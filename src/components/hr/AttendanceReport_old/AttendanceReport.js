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
    employee: { value : 'ALl', label: 'All'},
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

        setEmployeeOptions(options)
    }

    const getRoleList = async () => {
        const usertypelist = await axios.get(`${baseUrl}/api/usertype`);
        // console.log(usertypelist)

        let options = usertypelist.data.userType.map((item, index) => ({
            value: item.id,
            label: item.name,
        }))

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

        let data = {
            ...input,
            tokenid     : localStorage.getItem("token")
        }

        setMonth(input.month)

    }

    return (
        <div className="container-fluid p-0">
            <div className="card shadow mb-4 pt-2">
                <div className="card-body">
                    <div className="row d-flex">
                        <div className="col-sm-4 row d-flex align-items-center mb-4">
                            <div className="col-lg-3 text-dark font-weight-bold">
                                <label htmlFor="employee">Employee :</label>
                            </div>
                            <div className="col-lg-9">
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
                        <div className="col-sm-4 row  align-items-center mb-4">
                            <div className="col-lg-3 text-dark font-weight-bold">
                                <label htmlFor="role">Role :</label>
                            </div>
                            <div className="col-lg-9">
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
                        <div className="col-sm-3 row d-flex align-items-center mb-4">
                            <div className="col-lg-3 text-dark font-weight-bold">
                                <label htmlFor="month">Month :</label>
                            </div>
                            <div className="col-lg-9">
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
                        <div className="col-sm-1 row d-flex align-items-center mb-4">
                            <div className="col-sm-2">
                                <button className={`btn btn-outline-primary rounded-pill px-4`} onClick={goHandler} > Go </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <AttendenceReportList month={month} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AttendanceReport