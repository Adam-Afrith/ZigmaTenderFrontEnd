import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import CollapseCard from "../../../../UI/CollapseCard";
import Select from "react-select";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import useInputValidation from "../../../../hooks/useInputValidation";
import { useAllowedMIMEDocType } from "../../../../hooks/useAllowedMIMEDocType";
import { useAllowedUploadFileSize } from "../../../../hooks/useAllowedUploadFileSize";
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
import LetterAcceptanceDoc from "./LetterAcceptanceDocsupload";

const LetterOfAcceptance = () => {
  const { id } = useParams();
  const [dataSending, setDataSending] = useState(false);
  const { server1: baseUrl } = useBaseUrl();
  const navigate = useNavigate();
  const myRef = useRef(null);
  const [dragover, setdragover] = useState(false);
  const wrapperRef = useRef(null);
  const [file, setFile] = useState(null);
  const [lettacpId, setlettacpId] = useState(0);
  const [progress, setProgressCompleted] = useState(0);
  const [toastSuccess, toastError] = useOutletContext();
  const { img: maxImageSize } = useAllowedUploadFileSize();
  const { MIMEtype: doctype } = useAllowedMIMEDocType();
  const [FetchLoading, setFetchLoading] = useState(false);

  const options = [
    { value: "Postal", label: "Postal" },
    { value: "Courier", label: "Courier" },
    { value: "Parcel Service", label: "Parcel Service" },
    { value: "In hand Delivery", label: "In hand Delivery" },
  ];

  const onDragEnter = () => {
    wrapperRef.current.classList.add("dragover");
    setdragover(true);
  };

  const onDragLeave = () => {
    wrapperRef.current.classList.remove("dragover");
    setdragover(false);
  };

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile && newFile.size > maxImageSize) {
      Swal.fire({
        title: "File Size",
        text: "Maximum Allowed File size is 1MB",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        setFile(null);
      });
    } else if (newFile && !doctype.includes(newFile.type)) {
      Swal.fire({
        title: "File Type",
        text: "Allowed File Type are JPG/JPEG/PNG/PDF ",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        setFile(null);
      });
    } else {
      setFile(newFile);
    }
  };

  const {
    value: Datevalue,
    isValid: DateIsValid,
    hasError: DateHasError,
    valueChangeHandler: DateChangeHandler,
    inputBlurHandler: DateBlurHandler,
    setInputValue: setDateValue,
    reset: resetDate,
  } = useInputValidation(isNotEmpty);

  const {
    value: refrenceNovalue,
    isValid: refrenceNoIsValid,
    hasError: refrenceNoHasError,
    valueChangeHandler: refrenceNoChangeHandler,
    inputBlurHandler: refrenceNoBlurHandler,
    setInputValue: setrefrenceNoValue,
    reset: resetrefrenceNo,
  } = useInputValidation(isNotEmpty);

  const {
    value: fromvalue,
    isValid: fromIsValid,
    hasError: fromHasError,
    valueChangeHandler: fromChangeHandler,
    inputBlurHandler: fromBlurHandler,
    setInputValue: setfromValue,
    reset: resetfrom,
  } = useInputValidation(isNotEmpty);

  const {
    value: mediumvalue,
    isValid: mediumIsValid,
    hasError: mediumHasError,
    valueChangeHandler: mediumChangeHandler,
    inputBlurHandler: mediumBlurHandler,
    setInputValue: setmediumValue,
    reset: resetmedium,
  } = useInputValidation(isNotEmpty);

  const {
    value: medRefrenceNovalue,
    isValid: medRefrenceNoIsValid,
    hasError: medRefrenceNoHasError,
    valueChangeHandler: medRefrenceNoChangeHandler,
    inputBlurHandler: medRefrenceNoBlurHandler,
    setInputValue: setmedRefrenceNoValue,
    reset: resetmedRefrenceNo,
  } = useInputValidation(isNotEmpty);

  const {
    value: mediumSelectvalue,
    isValid: mediumSelectIsValid,
    hasError: mediumSelectHasError,
    valueChangeHandlerForReactSelect: mediumSelectChangeHandler,
    inputBlurHandler: mediumSelectBlurHandler,
    setInputValue: mediumSelectValue,
    reset: resetmediumSelect,
  } = useInputValidation(isNotNull);

  let formIsValid = false;

  // if (
  //   DateIsValid &&
  //   refrenceNoIsValid &&
  //   fromIsValid &&
  //   mediumIsValid &&
  //   medRefrenceNoIsValid &&
  //   mediumSelectIsValid
  // ) {
  //   formIsValid = true;
  // }

  if (
    Datevalue ||
    refrenceNovalue ||
    fromvalue ||
    mediumvalue ||
    medRefrenceNovalue ||
    mediumSelectvalue
  ) {
    formIsValid = true;
  }

  var config = {
    onUploadProgress: function (progressEvent) {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setProgressCompleted(percentCompleted);
    },
  };

  const postData = (data) => {
    axios
      .post(`${baseUrl}/api/letteracceptance/creation`, data, config)
      .then((resp) => {
        if (resp.data.status === 200) {
          toastSuccess(resp.data.message);
          navigate("/tender/bidmanagement/list/main/workorder/" + id);
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

  var setletterofacceptanceForm = (response) => {
    let data = response.data.letterofaccepttance[0];
    // console.log(data)
    if (data !== undefined) {
      setlettacpId(data.id);
      setDateValue(data.date ? data.date : "");
      setrefrenceNoValue(data.refrence_no ? data.refrence_no : "");
      setfromValue(data.from ? data.from : "");
      setmediumValue(data.medium ? data.medium : "");
      setmedRefrenceNoValue(data.med_refrence_no ? data.med_refrence_no : "");
      mediumSelectValue(
        data.medium_select
          ? options.find((x) => x.value === data.medium_select)
          : ""
      );
    }
  };

  //work order image data
  var getletterofacceptanceData = async () => {
    let response = await axios.get(
      `${baseUrl}/api/letteracceptance/creation/${id}`
    );
    if (response.status === 200) {
      setletterofacceptanceForm(response);
    }
  };

  useEffect(() => {
    if (id) {
      getletterofacceptanceData();
    }
  }, []);

  const setWorkOrderImage = (response) => {
    //  response.data.name = wofilename;
    setFile(response.data);
  };

  var getWorkOrderImage = async () => {
    if (lettacpId) {
      await axios({
        url: `${baseUrl}/api/download/letterofacceptance/workorderimage/${id}`,
        method: "GET",
        responseType: "blob", // important
      }).then((response) => {
        if (response.status === 200) {
          // if (response.data.type === "application/json") {
          //   setFile("");
          // } else {
            setWorkOrderImage(response);
          // }
        } else {
          alert("Unable to Process Now!");
        }
        setFetchLoading(false);
      });
    }
  };

  useEffect(() => {
    if (id) {
      getWorkOrderImage();
    }
  }, [lettacpId]);

  const putData = (data, lettacpId) => {
    console.log('data',data);
    axios
      .post(
        `${baseUrl}/api/letteracceptance/creation/update/${lettacpId}`,
        data,
        config
      )
      .then((ressp) => {
        if (ressp.data.status === 200) {
          toastSuccess(ressp.data.message);
        } else if (ressp.data.status === 400) {
          toastError(ressp.data.message);
        } else {
          toastError("Unable to update");
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

  const submitHandler = (e) => {
    e.preventDefault();

    setDataSending(true);

    if (!formIsValid) {
      setDataSending(false);
      return;
    }

    const formdata = new FormData();

    let data = {
      Date: Datevalue ? Datevalue : "",
      refrenceNo: refrenceNovalue ? refrenceNovalue : "",
      from: fromvalue ? fromvalue : "",
      medium: mediumvalue ? mediumvalue : "",
      medRefrenceNo: medRefrenceNovalue ? medRefrenceNovalue : "",
      mediumSelect: mediumSelectvalue ? mediumSelectvalue.value : "",
      tokenid: localStorage.getItem("token"),
      bidid: id,
    };

    if (file) {
      data.wofile = file;
    }
    if (file instanceof Blob) {
      data.wofile = new File([file], file.name);
    }

    for (var key in data) {
      formdata.append(key, data[key]);
    }

    if (lettacpId === 0) {
      // console.log(data);
      postData(formdata);
    } else if (lettacpId > 0) {
      putData(formdata, lettacpId);
    }
  };

  return (
    <CollapseCard id={"LetterOfAcceptance"} title={"Letter Of Acceptance"}>
      <form onSubmit={submitHandler}>
        <div className="row align-items-center ">
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="date">Date</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="date"
                  name="Date"
                  id="Date"
                  className="form-control"
                  value={Datevalue}
                  onChange={DateChangeHandler}
                  onBlur={DateBlurHandler}
                />
                {DateHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Date is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="refrence_no">Refrence No</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="refrenceNo"
                  id="refrenceNo"
                  className="form-control"
                  value={refrenceNovalue}
                  onChange={refrenceNoChangeHandler}
                  onBlur={refrenceNoBlurHandler}
                />
                {refrenceNoHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      refrenceNo is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="from">From</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="from"
                  id="from"
                  className="form-control"
                  value={fromvalue}
                  onChange={fromChangeHandler}
                  onBlur={fromBlurHandler}
                />
                {fromHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      from is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="to">Medium</label>
              </div>
              <div className="col-lg-8 ">
                <div className="d-flex justify-content-between">
                  <div className="col-lg-6">
                    <input
                      type="text"
                      name="medium"
                      id="medium"
                      className="form-control"
                      value={mediumvalue}
                      onChange={mediumChangeHandler}
                      onBlur={mediumBlurHandler}
                    />
                  </div>
                  <div className="col-lg-6 ml-2">
                    <Select
                      name="mediumSelect"
                      id="mediumSelect"
                      options={options}
                      isSearchable="true"
                      isClearable="true"
                      value={mediumSelectvalue}
                      onChange={(selectedOptions) => {
                        mediumSelectChangeHandler(selectedOptions);
                        // getcustno(selectedOptions);
                      }}
                      onBlur={mediumSelectBlurHandler}
                    ></Select>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  {mediumHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        medium is invalid
                      </span>
                    </div>
                  )}
                  {mediumSelectHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        mediumSelect is invalid
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label>Med.Refrence No</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="medRefrenceNo"
                  id="medRefrenceNo"
                  className="form-control"
                  value={medRefrenceNovalue}
                  onChange={medRefrenceNoChangeHandler}
                  onBlur={medRefrenceNoBlurHandler}
                />
                {medRefrenceNoHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      medRefrenceNo is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold"></div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label>LOA Document Upload</label>
              </div>
              <div className="col-lg-8">
                <div
                  className="dashed border-primary height_of_dropbox boderradius__dropbox d-flex flex-column align-items-center justify-content-center  drop-file-input bg-gray-200"
                  ref={wrapperRef}
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  <p className="display-4 mb-0">
                    <i className="fas fa-cloud-upload-alt text-primary "></i>
                  </p>
                  {!dragover && (
                    <p className="mt-0">Drag & Drop an document or Click</p>
                  )}
                  {dragover && <p className="mt-0">Drop the document</p>}
                  <input
                    type="file"
                    value=""
                    className="h-100 w-100 position-absolute top-50 start-50 pointer "
                    onChange={onFileDrop}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label> Preview</label>
              </div>
              <div className="col-lg-8">
                <LetterAcceptanceDoc file={file} />
              </div>
            </div>
          </div>
        </div>

        <div className="row text-center">
          <div className="col-12">
            {lettacpId ? (
              <button
                className="btn btn-primary"
                disabled={!formIsValid || dataSending}
              >
                {dataSending && progress + "% Uploaded"}
                {!dataSending && "Edit"}
              </button>
            ) : (
              <button
                className="btn btn-primary"
                disabled={!formIsValid || dataSending}
              >
                {dataSending && progress + "% Uploaded"}
                {!dataSending && "Submit"}
              </button>
            )}
          </div>
        </div>
      </form>
    </CollapseCard>
  );
};

export default LetterOfAcceptance;
