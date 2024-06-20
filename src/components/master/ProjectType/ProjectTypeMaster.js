import { Fragment, useContext } from "react";
import { useState, useEffect } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import AuthContext from "../../../storeAuth/auth-context";


const ProejctTypeMaster = () => {
    usePageTitle("Project Type Creation");
    const {permission} = useContext(AuthContext)
    const {server1:baseUrl} = useBaseUrl()
  
    const navigate = useNavigate();
    const { id } = useParams();

    const initialState = {
        projecttype: "",
        status: "Active",
      };
    
      const [input, setInput] = useState(initialState);
    
      const [validation, setInputValidation] = useState({
        projecttypeErr : "",
      });
      const [dataSending, setDataSending] = useState(false);
    
      useEffect(() => {
        if(id){
          axios.get(`${baseUrl}/api/projecttype/${id}`).then((resp)=> {
            setInput({
                projecttype: resp.data.projecttype.projecttype,
                status: resp.data.projecttype.status,
            })
          })
        }
      },[id, baseUrl])

      const postData = (data) => {
        axios.post(`${baseUrl}/api/projecttype`, data).then((res) => {
              if (res.data.status === 200) {
                Swal.fire({
                  icon: "success",
                  title: "New Project Type",
                  text: "Created Successfully!",
                  confirmButtonColor: "#5156ed",
                });
                setInput(initialState)
                navigate('/tender/master/projecttype')
              } else if (res.data.status === 400) {
                Swal.fire({
                  icon: "error",
                  title: "New Project Type",
                  text: res.data.errors,
                  confirmButtonColor: "#5156ed",
                });
                setDataSending(false)
              }
            });
      }
      
      const putData = (data, id) => {
        axios.put(`${baseUrl}/api/projecttype/${id}`, data).then((res) => {
          if (res.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Project Type",
              text: "Updated Successfully!",
              confirmButtonColor: "#5156ed",
            });
            setInput(initialState)
            navigate('/tender/master/projecttype')
          } else if (res.data.status === 400) {
            Swal.fire({
              icon: "error",
              title: "Project Type",
              text: res.data.errors,
              confirmButtonColor: "#5156ed",
            });
            setDataSending(false)
          }
        });
      }


      const inputHandler = (e) => {
        e.persist();
        setInput({ ...input , [e.target.name]: e.target.value });
      };

    const submitHandler = (e) => {
        e.preventDefault();
        setDataSending(true)
        var errors = { ...validation };
    
        if (input.projecttype.trim() === "") {
          errors.projecttypeErr = "Please Enter Project Type";
        
        } else {
          errors.projecttypeErr = "";
        }
    
        const { projecttypeErr } = errors;
    
        setInputValidation(errors);
    
        if (projecttypeErr !== "") {
          setDataSending(false)
          return;
        }
    
        if (projecttypeErr === "") {
          const data = {
            projecttype: input.projecttype,
            status: input.status,
          };
        
    
          if(!id){
            postData(data);
          }else{
            putData(data, id);
          }
        }
    };

    return (
        <Fragment>
        <div className="">
            <div className="card shadow mb-4 p-4">
                <form onSubmit={submitHandler}>
                <div className="row">
                    <div className="col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label>Project Type</label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      className="form-control "
                      type="text"
                      id="projecttype"
                      name="projecttype"
                      onChange={inputHandler}
                      value={input.projecttype}
                    />
                    <span style={{ color: "red" }}>
                      {validation.projecttypeErr}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label>Active Status</label>
                  </div>

                  <div className="col-lg-8">
                    <div className='form-check form-check-inline mr-4'>
                      <label
                        className="for-check-label"
                        htmlFor="statusActive"
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          id="statusActive"
                          name="status"
                          value="Active"
                          checked={input.status === "Active"}
                          onChange={inputHandler}
                        />
                        Active
                      </label>
                    </div>
                    <div className='form-check form-check-inline mr-4'>
                      <label
                        className="for-check-label"
                        htmlFor="statusInactive"
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          id="statusInactive"
                          name="status"
                          value="InActive"
                          checked={input.status === "InActive"}
                          onChange={inputHandler}
                        />
                        Inactive
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 text-center">                
                  {id ? (
                    <button className="btn btn-primary" disabled={dataSending} > {dataSending ? "Updating..." : "Update"}</button>
                  ) : (
                    <button className="btn btn-primary" disabled={dataSending}> {dataSending ? "Submitting..." : "Submit"}</button>
                  )}                
              </div>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  )
}

export default ProejctTypeMaster;