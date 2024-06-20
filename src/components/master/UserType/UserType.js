import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { usePageTitle } from "../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";

const initialState = {
    usertype: "",
    activeStatus: 'active',
}

const initialStateErr = {
    usertypeErr: '',
    activeStatusErr: '',
}

const UserType = () => {

    usePageTitle("User Type Creation");
    // const { id } = useParams();
    const navigate = useNavigate();
    const { id } = useParams();

    const { server1: baseUrl } = useBaseUrl();

    const [dataSending, setDataSending] = useState(false);
    const [input, setInput] = useState(initialState);
    const [inputValidation, setInputValidation] = useState(initialStateErr);

    useEffect(() => {
        if(id){
            let data = {
                tokenid : localStorage.getItem('token')
              }
          axios.post(`${baseUrl}/api/usertype/${id}`,data).then((resp)=> {
            setInput({
                usertype: resp.data.usertype.name,
                activeStatus: resp.data.usertype.activeStatus,
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
        axios.post(`${baseUrl}/api/usertype`, data).then((resp) => {
          if (resp.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "User Type",
              text:  resp.data.message,
              confirmButtonColor: "#5156ed",
            });

          navigate(`/tender/master/usertype`);
          
          } else if (resp.data.status === 400) {
            Swal.fire({
              icon: "error",
              title: "User Type",
              text: resp.data.errors,
              confirmButtonColor: "#5156ed",
            });
           
          }
          else {
            Swal.fire({
              icon: "error",
              title: "User Type",
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
                title: "User Type",
                text:  (err.response.data.message || err),
                confirmButtonColor: "#5156ed",
              })
              setDataSending(false);
          });
      };


      const putData = (data, id) => {
        axios.put(`${baseUrl}/api/usertype/${id}`, data).then((res) => {
          if (res.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "User Type",
              text: "Updated Successfully!",
              confirmButtonColor: "#5156ed",
            });
            setInput(initialState)
            navigate('/tender/master/usertype')
          } else if (res.data.status === 400) {
            // let errorMessage="" ;

            // Object.keys(res.data.errors).map(key => (
            //     errorMessage +=  res.data.errors[key][0] + '\n'
            // ))

            // console.log(errorMessage)
            Swal.fire({
              icon: "error",
              title: "User Type",
              text: res.data.errors,
              confirmButtonColor: "#5156ed",
            });
            setDataSending(false)
          }
        });
      }


    let formIsValid = false;

    if(input.usertype !== "" ){
        formIsValid = true 
    }

    const submitHandler = (e) => {
        e.preventDefault();
        
        setDataSending(true)

        if(!formIsValid){
           setDataSending(false)
           console.log("Test 12");
           return     
        }
        console.log("Test");
        let data = {
            name     : input.usertype,
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
        navigate(`/tender/master/usertype`);
    }

    return (
        <Fragment>
            
                <div className="card shadow mb-4 p-4">
                    <form>
                        <div className="row align-items-center">
                            <div className="col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="usertype" className="font-weight-bold">User Type<span className="text-danger">&nbsp;*</span> </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="usertype"
                                            name="usertype"
                                            value={input.usertype}
                                            onChange={inputHandler}
                                        />

                                        {inputValidation.usertype && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-bold">
                                                    Enter User Type
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
                            <div className="inputgroup col-lg-12  mt-2 mb-1">
                                <div className="row align-items-center">
                                    <div className="col-lg-12 text-center ">
                                        <button
                                            className="btn btn-primary mr-2"
                                            disabled={!formIsValid}
                                            onClick={submitHandler}
                                        >
                                            {dataSending && <span className="spinner-border spinner-border-sm mr-2"></span> }
                                            {dataSending === true ? ((id) ? 'Updating...' :"Submitting....") : ((id) ? 'Update' :"Save" )}

                                        </button>
                                        <button className="btn btn-secondary" onClick={cancelHandler} disabled = {dataSending}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
        </Fragment>
    )
}

export default UserType