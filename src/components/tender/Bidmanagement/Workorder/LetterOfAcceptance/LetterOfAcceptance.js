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
import PreLoader from "../../../../UI/PreLoader";

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
  const [FetchLoading, setFetchLoading] = useState(true);
  const [fileName, setFileName] = useState("");


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
        text: "File size too Large...?!",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        // setFile(null);
      });
    } else if (newFile && !doctype.includes(newFile.type)) {
      let len=(newFile.name.split(".")).length;
      if(newFile.type==="" && newFile.name.split(".")[len-1] === "rar"){
        setFile(newFile);     
      }
      else{
      Swal.fire({
        title: "File Type",
        text: "Invalid File type",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        // setFile(null);
      });
    }
  }
    else {
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

  let formIsValid = false;

  // if (
  //   DateIsValid &&
  //   refrenceNoIsValid &&
  // ) {
  //   formIsValid = true;
  // }

  if (
    Datevalue ||
    refrenceNovalue 
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
    
    if (data !== undefined) {
      setlettacpId(data.id);
      setDateValue(data.date ? data.date : "");
      setrefrenceNoValue(data.refrence_no ? data.refrence_no : "");
    }
  };

  //work order image data
  var getletterofacceptanceData = async () => {
    let response = await axios.get(
      `${baseUrl}/api/letteracceptance/creation/${id}`
    );
    
    if (response.status === 200) {
      setletterofacceptanceForm(response);
      setFileName(response.data.letterofaccepttance[0]?.wofile?response.data.letterofaccepttance[0].wofile:"");
    }
    else{
      setFileName("");
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

      let data = {
        tokenid : localStorage.getItem('token')
      }
      await axios({
        url: `${baseUrl}/api/download/letterofacceptance/workorderimage/${id}`,data,
        method: "POST",
        responseType: "blob", // important
        headers: {   //to stop cacheing this response at browsers. otherwise wrongly displayed cached files
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }).then((response) => {
        if (response.status === 200) {
            setWorkOrderImage(response);
        } 
        else if (response.status === 204) {
          setWorkOrderImage("");
        }
        else {
          alert("Unable to Process Now!");
        }
      });
      setFetchLoading(false);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    if (id) {
      getWorkOrderImage();
    }
  }, [lettacpId]);

  const putData = (data, lettacpId) => {
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

// console.log("Filename", fileName);

  return (
    <CollapseCard id={"LetterOfAcceptance"} title={"Letter Of Acceptance"}>
      <PreLoader loading={FetchLoading}>
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
                <LetterAcceptanceDoc file={file} setFile={setFile} fileName={fileName}/>
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
      </PreLoader>
    </CollapseCard>
  );
};

export default LetterOfAcceptance;
