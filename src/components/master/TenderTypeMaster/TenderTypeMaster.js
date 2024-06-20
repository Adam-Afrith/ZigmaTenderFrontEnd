import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { usePageTitle } from "../../hooks/usePageTitle";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";

const TenderTypeMaster = () => {
  usePageTitle("TenderType Creation Master ");

  const navigate = useNavigate();
  const { id } = useParams();
  const initialState = { tenderType: "", tenderTypeStatus: "Active" };
  const [tenderTypeInput, setTenderTypeInput] = useState(initialState);
  const [tenderTypeValidation, setTenderTypeValidation] = useState({
    tenderType: "",
  });
  const [dataSending, setDataSending] = useState(false);
  const { server1: baseUrl } = useBaseUrl();
  let tokenId = localStorage.getItem("token");
  useEffect(() => {
    if (id) {
      axios.get(`${baseUrl}/api/tendertype/${id}`).then((resp) => {
        setTenderTypeInput({
          tenderType: resp.data.tendertype.tendertype,
          tenderTypeStatus: resp.data.tendertype.tendertype_status,
          tokenId: tokenId,
        });
      });
    }
  }, [id]);

  const inputHandler = (e) => {
    e.persist();
    setTenderTypeInput({ ...tenderTypeInput, [e.target.name]: e.target.value });
  };

  const submitTenderType = (e) => {
    e.preventDefault();
    setDataSending(true);
    var errors = { ...tenderTypeValidation };

    if (tenderTypeInput.tenderType === "") {
      errors.tenderType = "Please Enter Tender Type Name..!";
    } else {
      errors.tenderType = "";
    }

    const { tenderType } = errors;

    setTenderTypeValidation(errors);
    if (tenderType !== "") {
      setDataSending(false);
      return;
    }

    const data = {
      tendertype: tenderTypeInput.tenderType,
      tendertype_status: tenderTypeInput.tenderTypeStatus,
      tokenId: tokenId,
    };

    if (!id) {
      axios.post(`${baseUrl}/api/tendertype`, data).then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "TenderType",
            text: res.data.message,
            confirmButtonColor: "#5156ed",
          });
          setTenderTypeInput(initialState);
          navigate("/tender/master/tendertypemaster");
        } else if (res.data.status === 400) {
          Swal.fire({
            icon: "error",
            title: "TenderType",
            text: res.data.message,
            confirmButtonColor: "#5156ed",
          });
          setDataSending(false);
        }
      });
    } else {
      axios.put(`${baseUrl}/api/tendertype/${id}`, data).then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "TenderType",
            text: res.data.message,
            confirmButtonColor: "#5156ed",
          });
          setTenderTypeInput(initialState);
          navigate("/tender/master/tendertypemaster");
        } else {
          Swal.fire({
            icon: "error",
            title: "TenderType",
            text: res.data.message,
            confirmButtonColor: "#5156ed",
          });
          setDataSending(false);
        }
      });
    }
  };

  return (
    <div className="">
      <div className="card shadow mb-4 p-4">
        <form onSubmit={submitTenderType} id="tender_FORM">
          <div className="row align-items-center">
          <div className="col-lg-6 mb-4">
            <div className="row align-items-center">
              <div className="col-lg-4 text-dark">
                <label>Tender Type Name</label>
              </div>
              <div className="col-lg-8">               
                    <input
                      className="form-control "
                      type="text"
                      id="tenderType"
                      name="tenderType"
                      onChange={inputHandler}
                      value={tenderTypeInput.tenderType}
                    />                 
                    <span style={{ color: "red" }}>
                      {tenderTypeValidation.tenderType}
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
                  <div className='form-check form-check-inline mr-5'>
                    <label
                      className="form-check-label"
                      htmlFor="tenderTypeStatusActive"
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        id="tenderTypeStatusActive"
                        name="tenderTypeStatus"
                        value="Active"
                        checked={tenderTypeInput.tenderTypeStatus === "Active"}
                        onChange={inputHandler}
                      />
                      Active
                    </label>
                  </div>
                  <div className='form-check form-check-inline '>
                    <label
                      className="form-check-label"
                      htmlFor="tenderTypeStatusInActive"
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        id="tenderTypeStatusInActive"
                        name="tenderTypeStatus"
                        value="InActive"
                        checked={tenderTypeInput.tenderTypeStatus === "InActive"}
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
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={dataSending}
                >
                  {!id
                    ? !dataSending
                      ? "Submit"
                      : "Submitting..."
                    : !dataSending
                    ? "Update"
                    : "Updating..."}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenderTypeMaster;
