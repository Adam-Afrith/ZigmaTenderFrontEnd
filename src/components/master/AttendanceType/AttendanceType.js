import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { usePageTitle } from "../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";

const initialState = {
    attendancetype: "",
    activeStatus: 'active',
}

const initialStateErr = {
    attendancetypeErr: '',
    activeStatusErr: '',
}

const AttendanceType = () => {

    usePageTitle("Attendance Type Creation");
    const navigate = useNavigate();
    const { id } = useParams();

    const { server1: baseUrl } = useBaseUrl();

    const [dataSending, setDataSending] = useState(false);
    const [input, setInput] = useState(initialState);
    const [inputValidation, setInputValidation] = useState(initialStateErr);

    useEffect(() => {
        if(id){
            
          axios.get(`${baseUrl}/api/attendancetype/${id}`).then((resp)=> {
            setInput({
                attendancetype: resp.data.attendanceType.attendanceType,
                activeStatus: resp.data.attendanceType.activeStatus,
            })
          })
        }
      },[id, baseUrl])
   
    const inputHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });

        if (e.target.value === "") {
            setInputValidation({ ...inputValidation, [e.target.name]: true });
        } else {
            setInputValidation({ ...inputValidation, [e.target.name]: false });
        }
    }


    const postData = (data) => {
        axios.post(`${baseUrl}/api/attendancetype`, data).then((resp) => {
          if (resp.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Attendance Type",
              text:  resp.data.message,
              confirmButtonColor: "#5156ed",
            });

          navigate(`/tender/master/attendancetype`);
          
          } else if (resp.data.status === 400) {
            Swal.fire({
              icon: "error",
              title: "Attendance Type",
              text: resp.data.errors,
              confirmButtonColor: "#5156ed",
            });
           
          }
          else {
            Swal.fire({
              icon: "error",
              title: "Attendance Type",
              text: "Provided Credentials are Incorrect",
              confirmButtonColor: "#5156ed",
            }).then (()=>{
              localStorage.clear();
              navigate("/");
            });
          }
          setDataSending(false);
        })
        .catch((err) => {
            console.log("err", err.response.data.message)
            Swal.fire({
                icon: "error",
                title: "Attendance Type",
                text:  (err.response.data.message || err),
                confirmButtonColor: "#5156ed",
              })
              setDataSending(false);
          });
      };


      const putData = (data, id) => {
        axios.put(`${baseUrl}/api/attendancetype/${id}`, data).then((res) => {
          if (res.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Attendance Type",
              text: "Updated Successfully!",
              confirmButtonColor: "#5156ed",
            });
            setInput(initialState)
            navigate('/tender/master/attendancetype')
          } else if (res.data.status === 400) {
            Swal.fire({
              icon: "error",
              title: "Attendance Type",
              text: res.data.errors,
              confirmButtonColor: "#5156ed",
            });
            setDataSending(false)
          }
        })
        .catch((err) => {
            console.log("err", err.response.data.message)
            Swal.fire({
                icon: "error",
                title: "Attendance Type",
                text:  (err.response.data.message || err),
                confirmButtonColor: "#5156ed",
              })
              setDataSending(false);
          });
        ;
      }


    let formIsValid = false;

    if(input.attendancetype !== "" ){
        formIsValid = true 
    }

    const submitHandler = (e) => {
        e.preventDefault();
        
        setDataSending(true)

        if(!formIsValid){
           setDataSending(false)
           return     
        }
        
        let data = {
            attendanceType : input.attendancetype,
            activeStatus : input.activeStatus,
            tokenId : localStorage.getItem("token")
        }

      
        if(!id){
            postData(data);
        }else{
            putData(data, id);
        }
        

    }

    const cancelHandler = () => {
        navigate(`/tender/master/attendancetype`);
    }

    return (
        <Fragment>
            <div className="">
                <div className="card shadow mb-4 p-4">
                    <form>
                        <div className="row align-items-center">
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="attendancetype" className="font-weight-bold">Attendance Type<span className="text-danger">&nbsp;*</span> </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="attendancetype"
                                            name="attendancetype"
                                            value={input.attendancetype}
                                            onChange={inputHandler}
                                        />

                                        {inputValidation.attendancetype && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-bold">
                                                    Enter Attendance Type
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark ">
                                        <label htmlFor="activeStatus " className="font-weight-bold" >Active Status&nbsp;</label>
                                    </div>
                                    <div className="col-lg-8">
                                        <div className="form-check form-check-inline">
                                            <label
                                                className="form-check-label"
                                                htmlFor="activeStatus_active"
                                            >
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="activeStatus"
                                                    id="activeStatus_active"
                                                    checked={("active" === input.activeStatus)}
                                                    value="active"
                                                    onChange={inputHandler}
                                                />
                                                Active
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <label className="form-check-label" htmlFor="activeStatus_inactive">
                                                <input
                                                    className="form-check-input mx-3"
                                                    type="radio"
                                                    name="activeStatus"
                                                    id="activeStatus_inactive"
                                                    checked={"inactive" === input.activeStatus}
                                                    value="inactive"
                                                    onChange={inputHandler}
                                                />
                                                Inactive 
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-12 mb-4 ml-3">
                                <div className="row align-items-center">
                                    <div className="col-lg-12 text-center ">
                                        <button
                                            className="btn btn-primary"
                                            disabled={!formIsValid}
                                            onClick={submitHandler}
                                        >
                                            {dataSending && <span className="spinner-border spinner-border-sm mr-2"></span> }
                                            {dataSending === true ? ((id) ? 'Updating...' :"Submitting....") : ((id) ? 'Update' :"Save" )}

                                        </button>
                                           <span>&nbsp;&nbsp;&nbsp;</span>
                                        <button className="btn btn-secondary" onClick={cancelHandler} disabled = {dataSending}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default AttendanceType;