import { useState, useEffect } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useBaseUrl } from "../../hooks/useBaseUrl";

const CountryMaster = () => {
  usePageTitle("Country Creation");
  useDocumentTitle("Country Master")
  const {server1:baseUrl} = useBaseUrl()
  
  const navigate = useNavigate();
  const { id } = useParams();

  const initialState = {
    countryName: "",
    countryStatus: "Active",
  };

  const [countryInput, setCountryInput] = useState(initialState);

  const [countryValidation, setInputValidation] = useState({
    countryName: "",
  });
  const [dataSending, setDataSending] = useState(false);

  useEffect(() => {
    if(id){
      axios.get(`${baseUrl}/api/country/${id}`).then((resp)=> {
        setCountryInput({
          countryName: resp.data.country.country_name,
          countryStatus: resp.data.country.country_status,
        })
      })
    }
  },[id, baseUrl])

  
  const postData = (data) => {
    axios.post(`${baseUrl}/api/country`, data).then((res) => {
          if (res.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "New Country",
              text: "Created Successfully!",
              confirmButtonColor: "#5156ed",
            });
            setCountryInput(initialState)
            navigate('/tender/master/countrymaster')
          } else if (res.data.status === 400) {
            Swal.fire({
              icon: "error",
              title: "New Country",
              text: res.data.errors,
              confirmButtonColor: "#5156ed",
            });
            setDataSending(false)
          }
        });
  }
  
  const putData = (data, id) => {
    axios.put(`${baseUrl}/api/country/${id}`, data).then((res) => {
      if (res.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Country",
          text: "Updated Successfully!",
          confirmButtonColor: "#5156ed",
        });
        setCountryInput(initialState)
        navigate('/tender/master/countrymaster')
      } else if (res.data.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Country",
          text: res.data.errors,
          confirmButtonColor: "#5156ed",
        });
        setDataSending(false)
      }
    });
  }
  
  const inputHandler = (e) => {
    e.persist();
    setCountryInput({ ...countryInput, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setDataSending(true)
    var errors = { ...countryValidation };

    if (countryInput.countryName === "") {
      errors.countryName = "Please Enter Country";
    } else {
      errors.countryName = "";
    }

    const { countryName } = errors;

    setInputValidation(errors);

    if (countryName !== "") {
      setDataSending(false)
      return;
    }

    if (countryName === "") {
      const data = {
        country_name: countryInput.countryName,
        country_status: countryInput.countryStatus,
      };
    

      if(!id){
        postData(data);
      }else{
        putData(data, id);
      }
    }
  };

  return (
    <div className="">
      <div className="card shadow p-4">
        <form onSubmit={submitHandler}>
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 ">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark font-weight-bold pt-1">                
                    <label>Country Name</label>
                  </div>
                  <div className="col-lg-8">  
                    <input
                      className="form-control "
                      type="text"
                      id="countryName"
                      name="countryName"
                      onChange={inputHandler}
                      value={countryInput.countryName}
                    />              
                  </div>
                </div>
              </div>       
              <div className="col-lg-6 mb-4 ">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark font-weight-bold pt-1">                
                    <label>Active Status</label>
                  </div>
                  <div className="col-lg-8">                    
                      <div className="form-check form-check-inline mr-3">  
                        <label
                          className="for-check-label"
                          htmlFor="countryStatusActive"
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            id="countryStatusActive"
                            name="countryStatus"
                            value="Active"
                            checked={countryInput.countryStatus === "Active"}
                            onChange={inputHandler}
                          />
                          Active
                        </label>  
                      </div>   
                      <div className="form-check form-check-inline">  
                        <label
                          className="for-check-label"
                          htmlFor="countryStatusInactive"
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            id="countryStatusInactive"
                            name="countryStatus"
                            value="InActive"
                            checked={countryInput.countryStatus === "InActive"}
                            onChange={inputHandler}
                          />
                          Inactive
                        </label>   
                      </div>                    
                  </div>
                </div>
              </div>   
              <div className="col-lg-12 ">
                <div className="row align-items-center">
                  <div className="col-lg-12 text-center">
                    {id ? (
                      <button className="btn btn-primary" disabled ={dataSending} > {dataSending ? "Updating..." : "Update"}</button>
                    ) : (
                      <button className="btn btn-primary" disabled = {dataSending}> {dataSending ? "Submitting..." : "Submit"}</button>
                    )}
                  </div>
                </div>       
              </div>
            </div>
                  
          
        </form>
      </div>
    </div>
  );
};

export default CountryMaster;
