import { Fragment } from "react";
import { useState, useEffect } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import Select from "react-select";

// const options = [{value:'1', label : 'AP'},{value:'2', label : 'MP'},{value:'3', label : 'Tamilnadu'},{value:'4', label : 'Delhi'}];

const ZoneMaster = () => {
    usePageTitle("Zone Master Creation");

    const {server1:baseUrl} = useBaseUrl()
  
    const navigate = useNavigate();
    const { id } = useParams();
    const [options, setOptions] = useState([]);

    const initialState = {
        zonename: "",
        statelist: "",
        status: "active",
      };
    
      const [input, setInput] = useState(initialState);
      const [statelist, setStateList] = useState([]);
      const [validation, setInputValidation] = useState({
        zonenameErr : "",
        statelistErr :""
      });
      const [dataSending, setDataSending] = useState(false);
      const [formIsValid ,setFormIsValid] = useState(false);
      const [isEdited , setIsEdited] = useState(false);
      const [datafetching , setDataFetching] = useState(false);
      useEffect(()=>{
        let data = {
          tokenid : localStorage.getItem('token')
        }
        axios.post(`${baseUrl}/api/state/list/105`,data).then((resp)=> {
          setOptions(resp.data.stateList);
        })
      },[])
      
      useEffect(() => {
        if(id){
          setDataFetching(true);
          axios.get(`${baseUrl}/api/zonemaster/${id}`).then((resp)=> {
            setInput({
                zonename: resp.data.zonename.zone_name,
                status: resp.data.zonename.active_status
            })

            setStateList(resp.data.zonename.statelist)
          })
        }
      },[id, baseUrl])

      const postData = (data) => {
        axios.post(`${baseUrl}/api/zonemaster`, data).then((res) => {
              if (res.data.status === 200) {
                Swal.fire({
                  icon: "success",
                  title: "New Zone ",
                  text: "Created Successfully!",
                  confirmButtonColor: "#5156ed",
                });
                setInput(initialState)
                navigate('/tender/master/zonemaster')
              } else if (res.data.status === 400) {
                Swal.fire({
                  icon: "error",
                  title: "Zone ",
                  text: res.data.errors,
                  confirmButtonColor: "#5156ed",
                });
                setDataSending(false)
              }
            });
      }
      
      const putData = (data, id) => {
        axios.put(`${baseUrl}/api/zonemaster/${id}`, data).then((res) => {
          if (res.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Zone ",
              text: "Updated Successfully!",
              confirmButtonColor: "#5156ed",
            });
            setInput(initialState)
            navigate('/tender/master/zonemaster')
          } else if (res.data.status === 400) {
            Swal.fire({
              icon: "error",
              title: "Zone ",
              text: res.data.errors,
              confirmButtonColor: "#5156ed",
            });
            setDataSending(false)
          }
        });
      }


      useEffect(()=>{
          
          if(statelist.length > 0 || validation.statelistErr ==="")
          {
            setInputValidation({...validation,statelistErr: false})
          }
          else{
            setInputValidation({...validation,statelistErr: true})
          }
      },[statelist])

      const inputHandler = (e) => {
        e.persist();
        setInput({ ...input , [e.target.name]: e.target.value });
        if (e.target.value === "") {
          setInputValidation({ ...validation, [e.target.name]: true });
        } else {
          setInputValidation({ ...validation, [e.target.name]: false });
        }
        if(datafetching === true && id)
        {
          setIsEdited(true);
          setDataFetching(false);
        }
      };


      useEffect(()=>{
        
        if(validation.statelistErr=== false && validation.zonenameErr == false && input.zonename && statelist.length > 0)
        {
          setFormIsValid(true);
          
        }
        else{
          setFormIsValid(false);
        }
      },[validation])
      
   
    const submitHandler = (e) => {
        e.preventDefault();
        setDataSending(true)
    
        if (input.zonename && statelist.length > 0) {
          const data = {
            zonename: input.zonename,
            statelist: statelist,
            status: input.status,
            tokenId: localStorage.getItem('token'),
          };
        
    
          if(!id){
            postData(data);
          }else{
            putData(data, id);
          }
        }
        else{
          setDataSending(false)
          Swal.fire({
            icon: "error",
            title: "Zone ",
            text: "Invalid Credentials. Try again Later",
            confirmButtonColor: "#5156ed",
          });
        }
    };

    console.log("Datasending", dataSending)
    console.log("formIsvalid", formIsValid)
    console.log("isEdited", isEdited)
    console.log("datafetching", datafetching)
    return (
    <Fragment>
      <div className="">
        <div className="card shadow mb-4 p-4">
          <form onSubmit={submitHandler}>
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label>Zone Name</label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      className="form-control "
                      type="text"
                      id="zonename"
                      name="zonename"
                      onChange={inputHandler}
                      value={input.zonename}
                    />

                    {validation.zonename && (
                      
                        <span className="text-danger font-weight-bold">
                          Enter Zone Name
                        </span>
                     
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label>State</label>
                  </div>
                  <div className="col-lg-8">
                    <Select
                      name="statelist"
                      id="statelist"
                      isSearchable="true"
                      isClearable="true"
                      isMulti='true'
                      options={options}
                      value={statelist}
                      onChange={(value, action) => { setStateList(value); setIsEdited(true) }}
                      closeMenuOnSelect={false}
                    ></Select>
                    {validation.statelistErr && (
                      <div className="pt-1">
                        <span className="text-danger font-weight-bold">
                          Please Select State..!
                        </span>
                      </div>
                    )}
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
                          value="active"
                          checked={input.status === "active"}
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
                          value="inactive"
                          checked={input.status === "inactive"}
                          onChange={inputHandler}
                        />
                        Inactive {(id ? !(formIsValid && isEdited) : !formIsValid)}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 text-center">
                {id ? (
                  <button className="btn btn-primary" disabled={dataSending || (id ? !(formIsValid && isEdited) : !formIsValid)} > {dataSending ? "Updating..." : "Update"}</button>
                ) : (
                  <button className="btn btn-primary" disabled={dataSending || (id ? !(formIsValid && isEdited) : !formIsValid)}> {dataSending ? "Submitting..." : "Submit"}</button>
                )}
              </div>
            </div>
          </form>
        </div >
      </div >
    </Fragment >
  )
}

export default ZoneMaster;