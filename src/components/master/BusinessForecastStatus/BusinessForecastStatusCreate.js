import { useState,useEffect } from "react";
import Swal from "sweetalert2";
import { usePageTitle } from "../../hooks/usePageTitle";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import Select from "react-select";

const BusinessForecastStatusCreate = () => {
  usePageTitle("Business Forecast Status Creation Master ");
const token =localStorage.getItem('token');


  const navigate = useNavigate();
  const { id } = useParams();
  console.log('id',id);
  const initialState = { statusname: "", Status: "Active" };
  const [statusInput, setstatusInput] = useState({
    forecast: "",
    statusname: "",
    Status: "Active",
  });
  const [statusValidation, setStatusValidation] = useState({ statusname: "" });
  const [dataSending, setDataSending]=useState(false);
  const { server1: baseUrl } = useBaseUrl();
  const [optionsForforecast, setOptionsForforecast] = useState([]);

  useEffect(() => {

    if(id ){
      console.log('optionsForforecast',optionsForforecast);

      const data ={
        token:token,
        editid :id
      }
      axios.post(`${baseUrl}/api/forecaststatus/geteditdata`,data).then((resp)=> {

let feactdata=resp.data.getedit;
console.log('resp.data.getedit.statusname',feactdata);
        setstatusInput({
          statusname : feactdata.status_name,
          Status : feactdata.active_status,
          forecast :  optionsForforecast.find((x) => x.value === feactdata.bizz_forecast_id), 
         
        })
        console.log('statusInput',statusInput.forecast);
      })
    }
    
  },[optionsForforecast])


  useEffect(() => {

    
  
    /*********for forecast drop dwon************ */

    const data ={
token : token

    }
    axios.post(`${baseUrl}/api/forecaststatus/forecast`,data).then((res) => {
      if (res.status === 200) {

       
        let op = res.data.get_forecast
        let roles = op.map((role, index) => ({
          value: role.id,
          label: role.name,
        }))

        setOptionsForforecast(roles)
      }
    });

 
  }, []);
  const inputHandler = (e) => {
    e.persist();
    setstatusInput({ ...statusInput, [e.target.name]: e.target.value });
  };
  const inputHandlerForSelect = (value, action) => {

    setstatusInput({ ...statusInput, [action.name]: value });
  };
let lin='';
  const submitStatus = (e) => {
    e.preventDefault();
    setDataSending(true);
    var errors = { ...statusValidation };

    if (statusInput.statusname === "") {
      errors.statusname = "Please Enter Status Name..!";
    } else {
      errors.statusname = "";
    }
    if (statusInput.forecast === "") {
      errors.forecast = "Please Enter Status Name..!";
    } else {
      errors.forecast = "";
    }
    

    const { statusname } = errors;

    setStatusValidation(errors);
    if (statusname !== "") {
      setDataSending(false)
      return;
    }

    const data = {
      status_name: statusInput.statusname,
      forecast_status: statusInput.Status,
      forecast : statusInput.forecast.value,
      token :token,
      
      updateId : id,
    };

    if (!id) {
lin='store' ;
    }else{
      lin='edit';
    }
    console.log('data',data);
   
      axios.post(`${baseUrl}/api/forecaststatus/`+lin, data).then((res) => {
        
        if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Business Forecast Status",
            text: res.data.message,
            confirmButtonColor: "#5156ed",
          });
          setstatusInput(initialState);
           navigate("/tender/master/businessforecaststatus");
        } else if (res.data.status === 400) {
          Swal.fire({
            icon: "error",
            title: "Business Forecast Status",
            text: res.data.message,
            confirmButtonColor: "#5156ed"
          });
          setDataSending(false);
        }
      });
    
   
}

  return (
    <div className="">
      <div className="card shadow mb-4 p-4">
        <form onSubmit={submitStatus} id="bizzstatus_FORM">
          <div className="row">
          <div className="col-lg-6 mb-4">
          <div className="row align-items-center">
              <div className="col-lg-4 text-dark">
                  <label>Business Forecast <span style={{ color: "red" }}>*</span> </label>
                </div>
                <div className="col-lg-8">
              <Select
                  name="forecast"
                  id="forecast"
                  isSearchable="true"
                  isClearable="true"
                   options={optionsForforecast}
                 value={statusInput.forecast}
                 onChange={inputHandlerForSelect}
                ></Select>
                </div>
                <span style={{ color: "red" }}>{statusValidation.forecast}</span>
              </div>
              </div>
            <div className="col-lg-6 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark">
                  <label>Status Name<span style={{ color: "red" }}>*</span></label>
                </div>
                <div className="col-lg-8">
                  <input
                    className="form-control "
                    type="text"
                    id="statusname"
                    name="statusname"
                    onChange={inputHandler}
                    value={statusInput.statusname}
                  />
                  <span style={{ color: "red" }}>{statusValidation.statusname}</span>
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
                    <label className="form-check-label" htmlFor="StatusActive">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="foreStatusActive"
                        name="foreStatus"
                        value="Active"
                        checked={statusInput.Status === "Active"}
                        onChange={inputHandler}
                      />
                      Active
                    </label>
                  </div>
                  <div className='form-check form-check-inline mr-4'>
                    <label
                      className="form-check-label"
                      htmlFor="StatusInActive"
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        id="foreStatusInActive"
                        name="foreStatus"
                        value="InActive"
                        checked={statusInput.Status === "InActive"}
                        onChange={inputHandler}
                      />
                      Inactive
                    </label>
                  </div>
                </div>
              </div>
            </div>
           
            <div className="col-lg-12 text-center">
              <div className="col-12">
                <button type="submit" className="btn btn-primary" disabled={dataSending}>
                  {!id ? (!dataSending ? "Submit" : "Submitting...") : (!dataSending ? "Update" : "Updating...")}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessForecastStatusCreate;
