import { Fragment } from "react";
import { useState, useEffect } from "react";
import { usePageTitle } from "../../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "./../../../hooks/useBaseUrl";
import Select from "react-select";
import LocalDateTime from "./../../../hooks/useLocalDateTime";

const attendance_type_options=[{value : 1, label : "Check-In"},{value : 2, label : "Check-Out"},{value : 3, label : "Break-In"}]

const employeeList = [{value : 1, label : "Kumar"},{value : 2, label : "Babu"},{value : 3, label : "Raja"}]
const AttendanceEntry = () => {
    usePageTitle("Daily Attendance Entry");
    const {server1:baseUrl} = useBaseUrl()
    const navigate = useNavigate();
    const { id } = useParams();
    const [options, setOptions] = useState([]);
    
    
    const initialState = {
        userId: null,
        attendanceType: null,
      };
      const initialStateErr = {
        userIdErr: false,
        attendanceTypeErr: false,
      };
      const [formIsValid, setFormIsValid]=useState(false);
      const [input, setInput] = useState(initialState);
      const [validation, setInputValidation] = useState(initialStateErr);
      const [isClicked, setIsClicked] = useState({userId: false,
        attendanceType: false});
      const [dataSending, setDataSending] = useState(false);

      useEffect(()=>{
        // axios.get(`${baseUrl}/api/state/list/105`).then((resp)=> {
        //   setOptions(resp.data.stateList);
        // })
      },[])
      
      useEffect(() => {
        if(id){
          axios.get(`${baseUrl}/api/attendanceentry/${id}`).then((resp)=> {
              setInput({
                userId: employeeList.find((x)=>x.value == resp.data?.attendance?.userId),
                attendanceType: attendance_type_options.find((x)=>x.value == resp.data?.attendance?.attendanceType)
            })
          })
        }
      },[id, baseUrl])

      useEffect(()=>{
      const errors=validation;
        if (input.userId === null) {
          errors.userIdErr = true;
        } else {
          errors.userIdErr = false;
        }
        if (input.attendanceType === null) {
          errors.attendanceTypeErr = true;
        } else {
          errors.attendanceTypeErr = false;
          // BsFillArrowLeftSquareFill;
        }
        setInputValidation((prev)=>{return{...prev,userIdErr : errors.userIdErr,attendanceTypeErr: errors.attendanceTypeErr}});

      },[input])

      useEffect(()=>{
        if (validation.userIdErr !== true  && validation.attendanceTypeErr !== true) {
          setFormIsValid(true);          
        }    else{
          setFormIsValid(false);          
        }
      },[validation])

      const postData = (data) => {
        axios.post(`${baseUrl}/api/attendanceentry`, data).then((res) => {
              if (res.data.status === 200) {
                Swal.fire({
                  icon: "success",
                  title: "Attendance",
                  text: "Status Updated Successfully!",
                  confirmButtonColor: "#5156ed",
                });
                setInput(initialState)
                navigate('/tender/hr/attendanceentry')
              } else if (res.data.status === 400) {
                Swal.fire({
                  icon: "error",
                  title: "Attendance",
                  text: res.data.errors,
                  confirmButtonColor: "#5156ed",
                });
                setDataSending(false)
              }
            });
      }
      
      const putData = (data, id) => {
        axios.put(`${baseUrl}/api/attendanceentry/${id}`, data).then((res) => {
          if (res.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Attendance",
              text: "Status Updated Successfully!",
              confirmButtonColor: "#5156ed",
            });
            setInput(initialState)
            navigate('/tender/hr/attendanceentry')
          } else if (res.data.status === 400) {
            Swal.fire({
              icon: "error",
              title: "Attendance",
              text: res.data.errors,
              confirmButtonColor: "#5156ed",
            });
            setDataSending(false)
          }
        });
      }
   
    const submitHandler = (e) => {
        e.preventDefault();
        setDataSending(true)
      
          const data = {
            userId: input.userId.value,
            attendanceType: input.attendanceType.value,
            tokenId: localStorage.getItem('token'),
          };
  
          if(!id){
            postData(data);
          }else{
            putData(data, id);
          }
        
    };

const selectChangeHandler = (value, action) =>{
  setInput((prev)=>{return {...prev, [action.name]: value}});
  setIsClicked((prev)=>{return {...prev, [action.name]: true}});
}

    return (
        <Fragment>
        <div className="container-fluid">
            <div className="card p-4">
                <form onSubmit={submitHandler}>
                <div className="row">
                    <div className="col-2">
                    <label>Employee Name</label>
                    </div>
                    <div className="col-10 mb-3">
                    <div className="row">
                        <div className="col-5 mr-5 ">
                        <Select
                            name="userId"
                            id="userId"
                            isSearchable="true"
                            isClearable="true"
                            options={employeeList}
                            value={input.userId}
                            onChange={selectChangeHandler}
                        ></Select>
                        </div>

                        <div className="col-6 ml-n5 mt-2">
                        {(validation.userIdErr  === true && isClicked.userId) &&  
                        <span style={{ color: "red" }}>
                          Please Select Employee..!                          
                        </span>  }
                        </div>
                    </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                    <label>Attendance Type</label>
                    </div>
                    <div className="col-10 mb-3">
                    <div className="row">
                        <div className="col-5 mr-5 ">
                        <Select
                                            name="attendanceType"
                                            id="attendanceType"
                                            isSearchable="true"
                                            isClearable="true"
                                            options={attendance_type_options}
                                            value={input.attendanceType}
                                            onChange={selectChangeHandler}
                                        ></Select>
                        </div>
                        <div className="col-6 ml-n5 mt-2">
                        {(validation.attendanceTypeErr === true && isClicked.attendanceType)&& 
                        <span style={{ color: "red" }}>
                            Please Select Attendance Type..!       
                        </span>}
                        </div>
                    </div>
                    </div>
                </div>
                 <div className="row">
                    <div className="col-2">
                    <label>Server Time</label>
                    </div>

                    <div className="col-5 ml-3">
                          <LocalDateTime/>
                    </div>
                </div> 
                <div className="row text-center">
                    <div className="col-12">
                    {id ? (
                        <button className="btn btn-primary" disabled ={dataSending || !formIsValid} > {dataSending ? "Updating..." : "Update"}</button>
                    ) : (
                        <button className="btn btn-primary" disabled = {dataSending || !formIsValid}> {dataSending ? "Submitting..." : "Submit"}</button>
                    )}
                    </div>
                </div>
                </form>
            </div>
        </div>
        </Fragment>
    )
}

export default AttendanceEntry;