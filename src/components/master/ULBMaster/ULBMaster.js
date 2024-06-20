import { useState,useEffect } from "react";
import Swal from "sweetalert2";
import { usePageTitle } from "../../hooks/usePageTitle";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const url = "192.168.1.25:8000";
const ULBMaster = () => {
  usePageTitle("ULB Master Creation");

  const navigate = useNavigate();
  const { id } = useParams();
  const initialState = { ulbName: "", ulbStatus: "Active" };
  const [ulbInput, setUlbInput] = useState({
    ulbName: "",
    ulbStatus: "Active",
  });
  const [ulbValidation, setulbValidation] = useState({ ulbName: "" });
  
  
  useEffect(() => {
    if(id){
      axios.get(`http://${url}/api/ulb/${id}`).then((resp)=> {
        setUlbInput({
          ulbName: resp.data.ulb.ulb_name,
          ulbStatus: resp.data.ulb.ulb_status,
        })
      })
    }
    
  },[id])

  const inputHandler = (e) => {
    e.persist();
    setUlbInput({ ...ulbInput, [e.target.name]: e.target.value });
  };

  const submitUlb = (e) => {
    e.preventDefault();
    var errors = { ...ulbValidation };

    if (ulbInput.ulbName === "") {
      errors.ulbName = "Please Enter Localbody Name..!";
    } else {
      errors.ulbName = "";
    }

    const { ulbName } = errors;

    setulbValidation(errors);
    if (ulbName !== "") {
      return;
    }

    const data = {
      ulb_name: ulbInput.ulbName,
      ulb_status: ulbInput.ulbStatus,
    };

    if (!id) {
      
      axios.post(`http://${url}/api/ulb`, data).then((res) => {
        
        if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "New ULB",
            text: "Created Successfully!",
            confirmButtonColor: "#5156ed",
          });
          setUlbInput(initialState);
          navigate("/tender/master/ulbmaster");
        } else if (res.data.status === 400) {
          Swal.fire({
            icon: "error",
            title: "New ULB Creation",
            text: "Failed to Create New ULB!",
            confirmButtonColor: "#5156ed"
          });
        }
      });
    }
    else {
      
      axios.put(`http://${url}/api/ulb/${id}`, data).then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "ULB",
            text: res.data.message,
            confirmButtonColor: "#5156ed"
          });
          setUlbInput(initialState);
          navigate("/tender/master/ulbmaster");
        } else {
          Swal.fire({
            icon: "error",
            title: "ULB",
            text: res.data.message,
            confirmButtonColor: "#5156ed"
          });
        }
       
    });
  }
}

  return (
    <div className="container-fluid">
      <div className="card p-4">
        <form onSubmit={submitUlb} id="ULB_FORM">
          <div className="row">
            <div className="col-2">
              <label>LocalBody Name</label>
            </div>
            <div className="col-10 mb-3">
              <div className="row">
                <div className="col-5 mr-5 ">
                  <input
                    className="form-control "
                    type="text"
                    id="ulbName"
                    name="ulbName"
                    onChange={inputHandler}
                    value={ulbInput.ulbName}
                  />
                </div>
                <div className="col-6 ml-n5 mt-2">
                  <span style={{ color: "red" }}>{ulbValidation.ulbName}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-2">
              <label>Active Status</label>
            </div>

            <div className="col-5 ml-3">
              <div className="row ">
                <div className="col-3">
                  <label className="form-check-label" htmlFor="ulbStatusActive">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="ulbStatusActive"
                      name="ulbStatus"
                      value="Active"
                      checked={ulbInput.ulbStatus === "Active"}
                      onChange={inputHandler}
                    />
                    Active
                  </label>
                </div>
                <div className="col-3">
                  <label
                    className="form-check-label"
                    htmlFor="ulbStatusInActive"
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      id="ulbStatusInActive"
                      name="ulbStatus"
                      value="InActive"
                      checked={ulbInput.ulbStatus === "InActive"}
                      onChange={inputHandler}
                    />
                    InActive
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ULBMaster;
