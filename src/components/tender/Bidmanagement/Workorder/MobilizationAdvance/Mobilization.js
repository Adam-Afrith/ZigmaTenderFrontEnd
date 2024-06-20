import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import CollapseCard from "../../../../UI/CollapseCard";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import useInputValidation from "../../../../hooks/useInputValidation";
// import {
//   isNotEmpty,
//   isNotNull,
// } from "../../../CommonFunctions/CommonFunctions";
import {
  isNotEmpty,
  isNotNull,
} from "../../../CommonFunctions/CommonFunctions_copy";
import axios from "axios";
import Swal from "sweetalert2";

const Mobilization = () => {
  const { id } = useParams();
  const [dataSending, setDataSending] = useState(false);
  const { server1: baseUrl } = useBaseUrl();
  const navigate = useNavigate();
  // const myRef = useRef(null);
  const [mobId, setmobId] = useState(0);
  const [toastSuccess, toastError] = useOutletContext();

  const {
    value: mobAdvancevalue,
    isValid: mobAdvanceIsValid,
    hasError: mobAdvanceHasError,
    valueChangeHandler: mobAdvanceChangeHandler,
    inputBlurHandler: mobAdvanceBlurHandler,
    setInputValue: setmobAdvanceValue,
    reset: resetmobAdvance,
  } = useInputValidation(isNotEmpty);

  const {
    value: bankNamevalue,
    isValid: bankNameIsValid,
    hasError: bankNameHasError,
    valueChangeHandler: bankNameChangeHandler,
    inputBlurHandler: bankNameBlurHandler,
    setInputValue: setbankNameValue,
    reset: resetbankName,
  } = useInputValidation(isNotEmpty);

  const {
    value: bankBranchvalue,
    isValid: bankBranchIsValid,
    hasError: bankBranchHasError,
    valueChangeHandler: bankBranchChangeHandler,
    inputBlurHandler: bankBranchBlurHandler,
    setInputValue: setbankBranchValue,
    reset: resetbankBranch,
  } = useInputValidation(isNotEmpty);

  const {
    value: mobAdvModevalue,
    isValid: mobAdvModeIsValid,
    hasError: mobAdvModeHasError,
    valueChangeHandler: mobAdvModeChangeHandler,
    inputBlurHandler: mobAdvModeBlurHandler,
    setInputValue: setmobAdvModeValue,
    reset: resetmobAdvMode,
  } = useInputValidation(isNotEmpty);

  const {
    value: dateMobAdvvalue,
    isValid: dateMobAdvIsValid,
    hasError: dateMobAdvHasError,
    valueChangeHandler: dateMobAdvChangeHandler,
    inputBlurHandler: dateMobAdvBlurHandler,
    setInputValue: setdateMobAdvValue,
    reset: resetdateMobAdv,
  } = useInputValidation(isNotEmpty);

  const {
    value: validUptovalue,
    isValid: validUptoIsValid,
    hasError: validUptoHasError,
    valueChangeHandler: validUptoChangeHandler,
    inputBlurHandler: validUptoBlurHandler,
    setInputValue: setvalidUptoValue,
    reset: resetvalidUpto,
  } = useInputValidation(isNotEmpty);

  let formIsValid = false;

  if (
    // mobAdvanceIsValid &&
    // bankNameIsValid &&
    // bankBranchIsValid &&
    // mobAdvModeIsValid &&
    // dateMobAdvIsValid &&
    // validUptoIsValid

    mobAdvancevalue ||
    bankNamevalue ||
    bankBranchvalue ||
    mobAdvModevalue ||
    dateMobAdvvalue ||
    validUptovalue
  ) {
    formIsValid = true;
  }

  const resetform = () => {
    resetmobAdvance();
    resetbankName();
    resetbankBranch();
    resetmobAdvMode();
    resetdateMobAdv();
    resetvalidUpto();
  };

  const postData = (data) => {
    axios
      .post(`${baseUrl}/api/mobilization/creation`, data)
      .then((resp) => {
        if (resp.data.status === 200) {
          toastSuccess(resp.data.message);
          setmobId(resp?.data?.Mobilization?.id);
          // resetform();
          // navigate("/tender/bidmanagement/list/main/workorder/" + id);
        } else if (resp.data.status === 400) {
          toastError(resp.data.message);
        }
        setDataSending(false);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        setDataSending(false);
      });
  };

  var setMobilizationForm = (response) => {
    let data = response.data.MobilizationAdvance[0];
    if(data)
    {
    setmobId(data.id);
    setmobAdvanceValue(data.mobadvance?data.mobadvance:"");
    setbankNameValue(data.bankname?data.bankname:"");
    setbankBranchValue(data.bankbranch?data.bankbranch:"");
    setmobAdvModeValue(data.mobadvmode?data.mobadvmode:"");
    setdateMobAdvValue(data.datemobadv?data.datemobadv:"");
    setvalidUptoValue(data.validupto?data.validupto:"");
    }
  };

  const getMobilizatonCreationData = async () => {
    let response = await axios.get(
      `${baseUrl}/api/mobilization/creation/${id}`
    );
    if (response.status === 200) {
      setMobilizationForm(response);
    }
  };
  useEffect(() => {
    if (id) {
      getMobilizatonCreationData();
    }
  }, []);

  const putData = (data) => {
    axios
      .put(`${baseUrl}/api/mobilization/creation/${mobId}`, data)
      .then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Mobilization Advance",
            text: "Updated Successfully!",
            confirmButtonColor: "#5156ed",
          });
          setDataSending(false);
        } else if (res.data.status === 400) {
          Swal.fire({
            icon: "error",
            title: "",
            text:"unable to save",  
            // text: res.data.message,
            confirmButtonColor: "#5156ed",
          });
          setDataSending(false);
        }
      });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    setDataSending(true);

    if (!formIsValid) {
      setDataSending(false);
      return;
    }

    let mobilizationData = {
      mobAdvance: mobAdvancevalue,
      bankName: bankNamevalue,
      bankBranch: bankBranchvalue,
      mobAdvMode: mobAdvModevalue,
      dateMobAdv: dateMobAdvvalue,
      validUpto: validUptovalue,
    };

    let data = {
      mobilizationData,
      tokenid: localStorage.getItem("token"),
      bidid: id,
    };

    if (mobId === 0) {
      postData(data);
    } else if (mobId > 0) {
      putData(data);
    }
  };
  return (
    <CollapseCard id={"Mobilization"} title={"Mobilization Advance"}>
      <form onSubmit={submitHandler}>
        <div className="row align-items-center ">
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="date">Mobilization Advance</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="mobAdvance"
                  id="mobAdvance"
                  className="form-control"
                  value={mobAdvancevalue}
                  onChange={mobAdvanceChangeHandler}
                  onBlur={mobAdvanceBlurHandler}
                />
                {mobAdvanceHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Mob Advance is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="refrence_no">Bank Name</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="bankName"
                  id="bankName"
                  className="form-control"
                  value={bankNamevalue}
                  onChange={bankNameChangeHandler}
                  onBlur={bankNameBlurHandler}
                />
                {bankNameHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Bank Name is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="from">Bank Branch</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="bankBranch"
                  id="bankBranch"
                  className="form-control"
                  value={bankBranchvalue}
                  onChange={bankBranchChangeHandler}
                  onBlur={bankBranchBlurHandler}
                />
                {bankBranchHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Bank Branch is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="to">Mob.Adv Mode</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="mobAdvMode"
                  id="mobAdvMode"
                  className="form-control"
                  value={mobAdvModevalue}
                  onChange={mobAdvModeChangeHandler}
                  onBlur={mobAdvModeBlurHandler}
                />
                {mobAdvModeHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Mob.Adv Mode is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label>Date mob.adv Submission</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="date"
                  name="dateMobAdv"
                  id="dateMobAdv"
                  className="form-control"
                  value={dateMobAdvvalue}
                  onChange={dateMobAdvChangeHandler}
                  onBlur={dateMobAdvBlurHandler}
                />
                {dateMobAdvHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Date Mob.Adv Submission is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="refrence_no">Valid Upto</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="date"
                  name="validUpto"
                  id="validUpto"
                  className="form-control"
                  value={validUptovalue}
                  onChange={validUptoChangeHandler}
                  onBlur={validUptoBlurHandler}
                />
                {validUptoHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Valid Upto is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="row text-center">
          <div className="col-12">
            {mobId ? (
              <button
                className="btn btn-primary"
                disabled={!formIsValid || dataSending}
              >
                {dataSending ? "Editing..." : "Edit"}
              </button>
            ) : (
              <button
                className="btn btn-primary"
                disabled={!formIsValid || dataSending}
              >
                {dataSending ? "Submitting..." : "Submit"}
              </button>
            )}

            {/* {!id && (
                <button
                  className={
                    !formIsValid
                      ? "btn btn-outline-primary float-right rounded-pill"
                      : "btn btn-primary float-right rounded-pill"
                  }
                  disabled={!formIsValid || dataSending}
                >
                  {dataSending && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  {dataSending && "Saving..."}
                  {!dataSending && "Save & Continue"}
                </button>
              )}
              {id && (
                <button
                  className={
                    !formIsValid
                      ? "btn btn-outline-primary float-right rounded-pill"
                      : "btn btn-primary float-right rounded-pill"
                  }
                  disabled={!formIsValid || dataSending}
                >
                  {dataSending && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  {dataSending && "Updating..."}
                  {!dataSending && "Edit & Continue"}
                </button>
              )} */}
          </div>
        </div>
      </form>
    </CollapseCard>
  );
};

export default Mobilization;
