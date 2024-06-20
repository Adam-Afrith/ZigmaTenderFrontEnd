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

const ProjetDetails = () => {
  const [dataSending, setDataSending] = useState(false);
  const { id } = useParams();
  const { server1: baseUrl } = useBaseUrl();
  const [proid, setproid] = useState(0);
  const myRef = useRef(null);
  const navigate = useNavigate();
  const [toastSuccess, toastError, setBidManagementMainId, bidManageMainId] =
    useOutletContext();

  const {
    value: proPeriodvalue,
    isValid: proPeriodIsValid,
    hasError: proPeriodHasError,
    valueChangeHandler: proPeriodChangeHandler,
    inputBlurHandler: proPeriodBlurHandler,
    setInputValue: setproPeriodValue,
    reset: resetproPeriod,
  } = useInputValidation(isNotEmpty);

  const {
    value: mobPeriodvalue,
    isValid: mobPeriodIsValid,
    hasError: mobPeriodHasError,
    valueChangeHandler: mobPeriodChangeHandler,
    inputBlurHandler: mobPeriodBlurHandler,
    setInputValue: setmobPeriodValue,
    reset: resetmobPeriod,
  } = useInputValidation(isNotEmpty);

  const {
    value: monsoonPeriodvalue,
    isValid: monsoonPeriodIsValid,
    hasError: monsoonPeriodHasError,
    valueChangeHandler: monsoonPeriodChangeHandler,
    inputBlurHandler: monsoonPeriodBlurHandler,
    setInputValue: setmonsoonPeriodValue,
    reset: resetmonsoonPeriod,
  } = useInputValidation(isNotEmpty);

  const {
    value: monthDurationvalue,
    isValid: monthDurationIsValid,
    hasError: monthDurationHasError,
    valueChangeHandler: monthDurationChangeHandler,
    inputBlurHandler: monthDurationBlurHandler,
    setInputValue: setmonthDurationValue,
    reset: resetmonthDuration,
  } = useInputValidation(isNotEmpty);

  const {
    value: supplyScapevalue,
    isValid: supplyScapeIsValid,
    hasError: supplyScapeHasError,
    valueChangeHandler: supplyScapeChangeHandler,
    inputBlurHandler: supplyScapeBlurHandler,
    setInputValue: setsupplyScapeValue,
    reset: resetsupplyScape,
  } = useInputValidation(isNotEmpty);

  const {
    value: supplyDatevalue,
    isValid: supplyDateIsValid,
    hasError: supplyDateHasError,
    valueChangeHandler: supplyDateChangeHandler,
    inputBlurHandler: supplyDateBlurHandler,
    setInputValue: setsupplyDateValue,
    reset: resetsupplyDate,
  } = useInputValidation(isNotEmpty);

  const {
    value: erectionStartvalue,
    isValid: erectionStartIsValid,
    hasError: erectionStartHasError,
    valueChangeHandler: erectionStartChangeHandler,
    inputBlurHandler: erectionStartBlurHandler,
    setInputValue: seterectionStartValue,
    reset: reseterectionStart,
  } = useInputValidation(isNotEmpty);

  const {
    value: commercialProducvalue,
    isValid: commercialProducIsValid,
    hasError: commercialProducHasError,
    valueChangeHandler: commercialProducChangeHandler,
    inputBlurHandler: commercialProducBlurHandler,
    setInputValue: setcommercialProducValue,
    reset: resetcommecrcialProduc,
  } = useInputValidation(isNotEmpty);

  const {
    value: tarCompletionvalue,
    isValid: tarCompletionIsValid,
    hasError: tarCompletionHasError,
    valueChangeHandler: tarCompletionChangeHandler,
    inputBlurHandler: tarCompletionBlurHandler,
    setInputValue: settarCompletionValue,
    reset: resettarCompletion,
  } = useInputValidation(isNotEmpty);

  const {
    value: producCompletionvalue,
    isValid: producCompletionIsValid,
    hasError: producCompletionHasError,
    valueChangeHandler: producCompletionChangeHandler,
    inputBlurHandler: producCompletionBlurHandler,
    setInputValue: setproducCompletionValue,
    reset: resetproducCompletion,
  } = useInputValidation(isNotEmpty);

  let formIsValid = false;

  if (
    // proPeriodIsValid &&
    // mobPeriodIsValid &&
    // monsoonPeriodIsValid &&
    // monthDurationIsValid &&
    // supplyScapeIsValid &&
    // supplyDateIsValid &&
    // erectionStartIsValid &&
    // commercialProducIsValid &&
    // tarCompletionIsValid &&
    // producCompletionIsValid

    proPeriodvalue ||
    mobPeriodvalue ||
    monsoonPeriodvalue ||
    monthDurationvalue ||
    supplyScapevalue ||
    supplyDatevalue ||
    erectionStartvalue ||
    commercialProducvalue ||
    tarCompletionvalue ||
    producCompletionvalue

  ) {
    formIsValid = true;
  }

  const resetform = () => {
    resetproPeriod();
    resetmobPeriod();
    resetmonsoonPeriod();
    resetmonthDuration();
    resetsupplyScape();
    resetsupplyDate();
    reseterectionStart();
    resetcommecrcialProduc();
    resettarCompletion();
    resetproducCompletion();
  };

  const setProjectDetailsform = (response) => {
    let data =  response.data.Projectdetails[0];
    if(data)
    {
    setproid(data.id);
    setproPeriodValue(data.properiod?data.properiod:"");
    setmobPeriodValue(data.mobPeriod?data.mobPeriod:"");
    setmonsoonPeriodValue(data.monsoonperiod?data.monsoonperiod:"");
    setmonthDurationValue(data.monthduration?data.monthduration:"");
    setsupplyScapeValue(data.supplyscape?data.supplyscape:"");
    setsupplyDateValue(data.supplydate?data.supplydate:"");
    seterectionStartValue(data.erectionstart?data.erectionstart:"");
    setcommercialProducValue(data.commercialproduc?data.commercialproduc:"");
    settarCompletionValue(data.tarcompletion?data.tarcompletion:"");
    setproducCompletionValue(data.produccompletion?data.produccompletion:"");
    }
  };

  const getProjectDetailsCreationData = async () => { 
    let response = await axios.get(
      `${baseUrl}/api/ProjectDetails/Creation/${id}`
    );
    if (response.status === 200) {
      setProjectDetailsform(response);
    }
  };

  useEffect(() => {
    if (id) {
      getProjectDetailsCreationData();
    }
  }, []);


  const postData = (data) => {
    axios
      .post(`${baseUrl}/api/ProjectDetails/Creation`, data)
      .then((resp) => {
        if (resp.data.status === 200) {
          toastSuccess(resp.data.message);
          console.log("resp.data",resp.data);
          setproid(resp.data.Projectdetails.id);
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

  const putData = (data) => {
    axios
      .put(`${baseUrl}/api/ProjectDetails/Creation/${proid}`, data)
      .then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Project Details",
            text: "Updated Successfully!",
            confirmButtonColor: "#5156ed",
          });
          setDataSending(false);
        } else if (res.data.status === 400) {
          Swal.fire({
            icon: "error",
            title: "",
            text: res.data.message,
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

    let projectDetails = {
      ProPeriod: proPeriodvalue,
      mobPeriod: mobPeriodvalue,
      monsoonPeriod: monsoonPeriodvalue,
      monthDuration: monthDurationvalue,
      supplyScape: supplyScapevalue,
      supplyDate: supplyDatevalue,
      erectionStart: erectionStartvalue,
      commercialProduc: commercialProducvalue,
      tarCompletion: tarCompletionvalue,
      producCompletion: producCompletionvalue,
    };

    let data = {
      projectDetails,
      tokenid: localStorage.getItem("token"),
      bidid: id,
    };

    if (proid === 0) {
      postData(data);
    } else if (proid > 0) {
      putData(data);
    }
  };

  return (
    <CollapseCard id={"ProjectDetails"} title={"Project details"}>
      <form onSubmit={submitHandler}>
        <div className="row align-items-center ">
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="date">Project Period In Month</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="ProPeriod"
                  id="ProPeriod"
                  className="form-control"
                  value={proPeriodvalue}
                  onChange={proPeriodChangeHandler}
                  onBlur={proPeriodBlurHandler}
                />
                {proPeriodHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Project Period In Month is Invalid...!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="refrence_no">
                  Mobilization Period In Month
                </label>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="mobPeriod"
                  id="mobPeriod"
                  className="form-control"
                  value={mobPeriodvalue}
                  onChange={mobPeriodChangeHandler}
                  onBlur={mobPeriodBlurHandler}
                />
                {mobPeriodHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Mobilization Period In Month is Invalid...!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="from">Monsoon Period In Months</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="monsoonPeriod"
                  id="monsoonPeriod"
                  className="form-control"
                  value={monsoonPeriodvalue}
                  onChange={monsoonPeriodChangeHandler}
                  onBlur={monsoonPeriodBlurHandler}
                />
                {monsoonPeriodHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Monsoon Period In Months is Invalid...!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="to">Total Duration In Months</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="monthDuration"
                  id="monthDuration"
                  className="form-control"
                  value={monthDurationvalue}
                  onChange={monthDurationChangeHandler}
                  onBlur={monthDurationBlurHandler}
                />
                {monthDurationHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Total Duration In Months is Invalid...!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label>Power Supply Scope</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="supplyScape"
                  id="supplyScape"
                  className="form-control"
                  value={supplyScapevalue}
                  onChange={supplyScapeChangeHandler}
                  onBlur={supplyScapeBlurHandler}
                />
                {supplyScapeHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Power Supply Scope is Invalid...!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="refrence_no">Power Supply Date</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="date"
                  name="supplyDate"
                  id="supplyDate"
                  className="form-control"
                  value={supplyDatevalue}
                  onChange={supplyDateChangeHandler}
                  onBlur={supplyDateBlurHandler}
                />
                {supplyDateHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Power Supply Date is Invalid...!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="refrence_no">Date Of Erection Started</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="date"
                  name="erectionStart"
                  id="erectionStart"
                  className="form-control"
                  value={erectionStartvalue}
                  onChange={erectionStartChangeHandler}
                  onBlur={erectionStartBlurHandler}
                />
                {erectionStartHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Date Of Erection Started is Invalid...!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="refrence_no">
                  Date Of Commercial Production
                </label>
              </div>
              <div className="col-lg-8">
                <input
                  type="date"
                  name="commercialProduc"
                  id="commercialProduc"
                  className="form-control"
                  value={commercialProducvalue}
                  onChange={commercialProducChangeHandler}
                  onBlur={commercialProducBlurHandler}
                />
                {commercialProducHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Date Of Commercial Production is Invalid...!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="refrence_no">Target Date For Completion</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="date"
                  name="tarCompletion"
                  id="tarCompletion"
                  className="form-control"
                  value={tarCompletionvalue}
                  onChange={tarCompletionChangeHandler}
                  onBlur={tarCompletionBlurHandler}
                />
                {tarCompletionHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Target Date For Completion is Invalid...!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="refrence_no">Expected Date Of Completion </label>
              </div>
              <div className="col-lg-8">
                <input
                  type="date"
                  name="producCompletion"
                  id="producCompletion"
                  className="form-control"
                  value={producCompletionvalue}
                  onChange={producCompletionChangeHandler}
                  onBlur={producCompletionBlurHandler}
                />
                {producCompletionHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Completion Date Production is Invalid...!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="row text-center">
          <div className="col-12">
            {proid ? (
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
          </div>
        </div>
      </form>
    </CollapseCard>
  );
};

export default ProjetDetails;
