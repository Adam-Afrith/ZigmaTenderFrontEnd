import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../../hooks/useBaseUrl";
import { usePageTitle } from "../../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";

const initialState = {
    calltype: "",
    activeStatus: 'Active',
}

const initialStateErr = {
    calltypeErr: '',
    activeStatusErr: '',
}

const CallType = () => {

    usePageTitle("Call Type Creation");
    const navigate = useNavigate();
    const { id } = useParams();

    const { server1: baseUrl } = useBaseUrl();

    const [dataSending, setDataSending] = useState(false);
    const [input, setInput] = useState(initialState);
    const [inputValidation, setInputValidation] = useState(initialStateErr);

    useEffect(() => {
        if(id){
            
          axios.get(`${baseUrl}/api/calltype/${id}`).then((resp)=> {
            setInput({
                calltype: resp.data.calltype.name,
                activeStatus: resp.data.calltype.activeStatus,
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
        axios.post(`${baseUrl}/api/calltype`, data).then((resp) => {
          if (resp.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Call Type",
              text:  resp.data.message,
              confirmButtonColor: "#5156ed",
            });

          navigate(`/tender/master/calltypemaster`);
          
          } else if (resp.data.status === 400) {
            Swal.fire({
              icon: "error",
              title: "Call Type",
              text: resp.data.errors,
              confirmButtonColor: "#5156ed",
            });
           
          }
          else {
            Swal.fire({
              icon: "error",
              title: "Call Type",
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
                title: "Call Type",
                text:  (err.response.data.message || err),
                confirmButtonColor: "#5156ed",
              })
              setDataSending(false);
          });
      };


      const putData = (data, id) => {
        axios.put(`${baseUrl}/api/calltype/${id}`, data).then((res) => {
          if (res.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Call Type",
              text: "Updated Successfully!",
              confirmButtonColor: "#5156ed",
            });
            setInput(initialState)
            navigate('/tender/master/calltypemaster')
          } else if (res.data.status === 400) {
            Swal.fire({
              icon: "error",
              title: "Call Type",
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
                title: "Call Type",
                text:  (err.response.data.message || err),
                confirmButtonColor: "#5156ed",
              })
              setDataSending(false);
          });
        ;
      }


    let formIsValid = false;

    if(input.calltype !== "" ){
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
            name     : input.calltype,
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
        navigate(`/tender/master/calltypemaster`);
    }

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="card p-4">
                    <form>
                        <div className="row align-items-center">
                            <div className="inputgroup col-lg-12 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-2 text-dark">
                                        <label htmlFor="calltype" className="font-weight-bold">Call Type<span className="text-danger">&nbsp;*</span> </label>
                                    </div>
                                    <div className="col-lg-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="calltype"
                                            name="calltype"
                                            value={input.calltype}
                                            onChange={inputHandler}
                                        />

                                        {inputValidation.calltype && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-bold">
                                                    Enter Call Type
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-12 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-2 text-dark ">
                                        <label htmlFor="activeStatus " className="font-weight-bold" >Active Status&nbsp;</label>
                                    </div>
                                    <div className="col-lg-4">
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
                                                    checked={("Active" === input.activeStatus)}
                                                    value="Active"
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
                                                    checked={"InActive" === input.activeStatus}
                                                    value="InActive"
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

export default CallType