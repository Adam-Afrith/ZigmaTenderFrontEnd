import { useState,useEffect } from "react";
import Swal from "sweetalert2";
import { usePageTitle } from "../../hooks/usePageTitle";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";


const UnitMaster = () => {
  usePageTitle("Unit Creation Master ");

  const navigate = useNavigate();
  const { id } = useParams();
  const initialState = { unitName: "", unitStatus: "Active" };
  const [unitInput, setunitInput] = useState({
    unitName: "",
    unitStatus: "Active",
  });
  const [unitValidation, setUnitValidation] = useState({ unitName: "" });
  const [dataSending, setDataSending]=useState(false);
  const { server1: baseUrl } = useBaseUrl();

  useEffect(() => {
    if(id){
      axios.get(`${baseUrl}/api/unit/${id}`).then((resp)=> {
        setunitInput({
          unitName: resp.data.unit.unit_name,
          unitStatus: resp.data.unit.unit_status,
        })
      })
    }
    
  },[id])

  const inputHandler = (e) => {
    e.persist();
    setunitInput({ ...unitInput, [e.target.name]: e.target.value });
  };

  const submitUnit = (e) => {
    e.preventDefault();
    setDataSending(true);
    var errors = { ...unitValidation };

    if (unitInput.unitName === "") {
      errors.unitName = "Please Enter Unit Name..!";
    } else {
      errors.unitName = "";
    }

    const { unitName } = errors;

    setUnitValidation(errors);
    if (unitName !== "") {
      setDataSending(false)
      return;
    }

    const data = {
      unit_name: unitInput.unitName,
      unit_status: unitInput.unitStatus,
    };

    if (!id) {
      
      axios.post(`${baseUrl}/api/unit`, data).then((res) => {
        
        if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Unit",
            text: res.data.message,
            confirmButtonColor: "#5156ed",
          });
          setunitInput(initialState);
          navigate("/tender/master/unitmaster");
        } else if (res.data.status === 400) {
          Swal.fire({
            icon: "error",
            title: "Unit",
            text: res.data.message,
            confirmButtonColor: "#5156ed"
          });
          setDataSending(false);
        }
      });
    }
    else {
      
      axios.put(`${baseUrl}/api/unit/${id}`, data).then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Unit",
            text: res.data.message,
            confirmButtonColor: "#5156ed"
          });
          setunitInput(initialState);
          navigate("/tender/master/unitmaster");
        } else {
          Swal.fire({
            icon: "error",
            title: "Unit",
            text: res.data.message,
            confirmButtonColor: "#5156ed"
          });
          setDataSending(false);
        }
       
    });
  }
}

  return (
    <div className="">
      <div className="card shadow mb-4 p-4">
        <form onSubmit={submitUnit} id="unit_FORM">
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark">
                  <label>Unit Name</label>
                </div>
                <div className="col-lg-8">
                  <input
                    className="form-control "
                    type="text"
                    id="unitName"
                    name="unitName"
                    onChange={inputHandler}
                    value={unitInput.unitName}
                  />
                  <span style={{ color: "red" }}>{unitValidation.unitName}</span>
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
                    <label className="form-check-label" htmlFor="unitStatusActive">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="unitStatusActive"
                        name="unitStatus"
                        value="Active"
                        checked={unitInput.unitStatus === "Active"}
                        onChange={inputHandler}
                      />
                      Active
                    </label>
                  </div>
                  <div className='form-check form-check-inline mr-4'>
                    <label
                      className="form-check-label"
                      htmlFor="unitStatusInActive"
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        id="unitStatusInActive"
                        name="unitStatus"
                        value="InActive"
                        checked={unitInput.unitStatus === "InActive"}
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

export default UnitMaster;
