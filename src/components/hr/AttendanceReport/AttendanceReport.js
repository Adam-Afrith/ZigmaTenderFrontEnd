import axios from "axios"
import { useEffect, useState } from "react"
import { useBaseUrl } from "../../hooks/useBaseUrl"
import { usePageTitle } from "../../hooks/usePageTitle"
import Select from "react-select";
import AttendenceReportList from "./AttendenceReportList";



const currentDate = new Date();
    // const currentMonth = currentDate.getMonth();
const currentMonth = currentDate.getFullYear() + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2)

const initialState = {
    employee: { value : 'All', label: 'All'},
    role: { value : 'All', label: 'All'},
    month: currentMonth
}



const AttendanceReport = () => {
    usePageTitle('Attendance Report')
    const { server1: baseUrl } = useBaseUrl();

    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    const [month, setMonth] =useState(currentMonth)
    const [input, setInput] = useState(initialState)
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        getEmployeeList()
        getRoleList()
    }, [])

    const getEmployeeList = async () => {
        const userCreationList = await axios.get(`${baseUrl}/api/usercreation`);
        // console.log(userCreationList)
        let options = userCreationList.data.userlist.map((item, index) => ({
            value: item.id,
            label: item.name,
        }))

        options.unshift({ value: 'All', label: 'All' });
        setEmployeeOptions(options)
    }

    const getRoleList = async () => {
        let data = {
            tokenid : localStorage.getItem('token')
          }
        const usertypelist = await axios.post(`${baseUrl}/api/usertype`,data);
        // console.log(usertypelist)

        // let options = usertypelist.data.userType.map((item, index) => ({
        //     value: item.id,
        //     label: item.name,
        // }))

        let options = usertypelist.data.userType
        .filter((item) => item.id !== 1)
        .map((item) => ({ value: item.id, label: item.name }));

        options.unshift({ value: 'All', label: 'All' });
        setRoleOptions(options)
    }

    const filterHandler = (value, action) => {
        setInput({
            ...input,
            [action.name]: value,
        });
    }

    const inputHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
    }

    

    const goHandler = ()  => {

        // console.log('input',input)
        // let data = {
        //     ...input,
        //     tokenid     : localStorage.getItem("token")
        // }

        // setMonth(input.month)
        
        setIsClicked(true)
        

    }

    // console.log('input',input)
    return (
        <div className="AttendanceReport">
            <div className="card shadow mb-4 pt-2">
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="form-group">
                                <label htmlFor="employee">Employee :</label>                            
                                <Select
                                    name="employee"
                                    id="employee"
                                    isSearchable="true"
                                    isClearable="true"
                                    options={employeeOptions}
                                    onChange={filterHandler}
                                    value={input.employee}
                                ></Select>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="form-group">
                                <label htmlFor="role">Role :</label>                            
                                <Select
                                    name="role"
                                    id="role"
                                    isSearchable="true"
                                    isClearable="true"
                                    options={roleOptions}
                                    onChange={filterHandler}
                                    value={input.role}
                                ></Select>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="form-group">
                                <label htmlFor="month">Month :</label>                            
                                <input
                                    name="month"
                                    id="month"
                                    type="month"
                                    className="form-control"
                                    onChange={inputHandler}
                                    value={input.month}
                                    max={currentMonth}
                                />
                            </div>
                        </div>
                        <div className="col-lg-3">                            
                            <button className='btn-tender-block' onClick={goHandler} >Search</button>                            
                        </div>
                    </div>                    
                </div>
            </div>
            <div className="card shadow mb-4 p-4">
                <div>
                    <AttendenceReportList input={input} isClicked={isClicked} setIsClicked={setIsClicked}/>                    
                </div>
            </div>
        </div>
    )
}

export default AttendanceReport