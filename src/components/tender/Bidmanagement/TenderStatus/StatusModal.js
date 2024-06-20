import axios from "axios";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useBaseUrl } from "../../../hooks/useBaseUrl";
import ModalCard from "../../../UI/Modal/ModalCard";
import Select from "react-select";
import useInputValidation from "../../../hooks/useInputValidation_copy";
import { isNotNull } from "../../CommonFunctions/CommonFunctions";
import styles from "./TenderStatus_StatusModal.module.css";
import ReadyToUpload from "./ReadyToupload";
import PreLoader from "../../../UI/PreLoader";
import Swal from "sweetalert2";
import { useAllowedUploadFileSize } from "../../../hooks/useAllowedUploadFileSize";
import { useAllowedMIMEDocType } from "../../../hooks/useAllowedMIMEDocType";

const statusOptions = [
  { value: "Retender", label: "Retender" },
  { value: "Cancel", label: "Cancel" },
];

const StatusModal = (props) => {
  const { server1: baseUrl } = useBaseUrl();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [dragover, setdragover] = useState(false);
  const [file, setFile] = useState(null);
  const [formId, setFormId] = useState(0);
  const [isdatasending, setdatasending] = useState(false);
  const [progress, setProgressCompleted] = useState(0);
  const [FetchLoading, setFetchLoading] = useState(false);
  const { id } = useParams();
  const [toastSuccess, toastError, setBidManagementMainId, bidManageMainId] =
    useOutletContext();
  const { img: maxImageSize } = useAllowedUploadFileSize();
  const { MIMEtype: doctype } = useAllowedMIMEDocType();

  const {
    value: statusValue,
    isValid: statusIsValid,
    hasError: statusHasError,
    valueChangeHandlerForReactSelect: statusChangeHandler,
    inputBlurHandler: statusBlurHandler,
    setInputValue: setstatus,
    reset: resetstatus,
  } = useInputValidation(isNotNull);

  useEffect(() => {
    if (id) {
      fetchLatestData();
    }
  }, []);

  const onDragEnter = () => {
    wrapperRef.current.classList.add(styles["dragover"]);
    setdragover(true);
  };

  const onDragLeave = () => {
    wrapperRef.current.classList.remove(styles["dragover"]);
    setdragover(false);
  };

  const onDrop = () => wrapperRef.current.classList.remove(styles["dragover"]);

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];

    // let filetypes = newFile.type

    // console.log(filetypes)

    // if (filetypes === "application/pdf" || filetypes === "application/msword" || filetypes === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || filetypes === "application/x-zip-compressed" || filetypes.split('/')[0] === "image") {
    //   setFile(newFile);
    // } else {
    //   alert("File format not supported. Upload pdf, doc, docx and images only")
    // }

    let len = newFile?.name?.split(".").length;
    if (newFile && newFile.size > maxImageSize) {
      Swal.fire({
        title: "File Size",
        text: "File size is too Large",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        setFile(null);
      });
    } else if (newFile && !doctype.includes(newFile.type)) {
      if (newFile?.name?.split(".")[len - 1] !== "rar") {
        Swal.fire({
          title: "File Type",
          text: "Invalid File Type",
          icon: "error",
          confirmButtonColor: "#2fba5f",
        }).then(() => {
          setFile(null);
        });
      } else {
        setFile(newFile);
      }
    } else if (newFile?.name?.split(".")[len - 1] === "txt") {
      Swal.fire({
        title: "File Type",
        text: "Invalid File Type",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        setFile(null);
        // setPreviewObjURL("");
      });
    } else {
      setFile(newFile);
    }
  };

  let formIsValid = false;

  if (statusValue) {
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

  const fetchLatestData = () => {
    setFetchLoading(true);

    axios
      .get(`${baseUrl}/api/bigmanagement/tenderstatus/status/${id}`)
      .then((resp) => {
        if (resp.data.status === 200) {
          setFormId(resp.data.BidManagementTenderOrBidStaus.id);
          setstatus(
            statusOptions.find(
              (x) => x.value === resp.data.BidManagementTenderOrBidStaus.status
            )
          );

          if (resp.data.file) {
            let data = {
              tokenid : localStorage.getItem('token')
            }
            axios({
              url: `${baseUrl}/api/download/BidManagementTenderOrBidStausDocs/${resp.data.BidManagementTenderOrBidStaus.id}`,data,
              method: "POST",
              responseType: "blob", // important
            }).then((response) => {
              if (response.status === 200) {
                response.data.name =
                  resp.data.BidManagementTenderOrBidStaus.file_original_name;
                setFile(response.data);
              }
              setFetchLoading(false);
            });
          } else {
            setFetchLoading(false);
          }
        } else {
          setFetchLoading(false);
        }
      });
  };

  const postData = (data) => {
    axios
      .post(`${baseUrl}/api/bigmanagement/tenderstatus/status`, data, config)
      .then((resp) => {
        if (resp.data.status === 200) {
          let modalCloseBtn = document.querySelector(
            "#tenderStatusModal .close"
          );
          modalCloseBtn.click();
          toastSuccess(resp.data.message);
          setFormId(resp.data.id);
          fetchLatestData();
          props.checkTenderStatus();
          // resetall()
          // navigate("/tender/bidmanagement/list/main/bidsubmission/" + id);
          //   myRef.current.scrollIntoView({ behavior: 'smooth' })
          // window.history.replaceState({}, "Bid Creation", "/tender/bidmanagement/list/main/bidsubmission/" + id);
        } else if (resp.data.status === 400) {
          toastError(resp.data.message);
        } else {
          toastError("Unable to upload the document");
        }
        setdatasending(false);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        setdatasending(false);
      });
  };

  const putData = (data, formid) => {
    axios
      .post(
        `${baseUrl}/api/bigmanagement/tenderstatus/status/${formid}?_method=PUT`,
        data,
        config
      )
      .then((resp) => {
        if (resp.data.status === 200) {
          toastSuccess(resp.data.message);
          props.checkTenderStatus();
          let modalCloseBtn = document.querySelector(
            "#tenderStatusModal .close"
          );
          modalCloseBtn.click();

          fetchLatestData();
        } else if (resp.data.status === 400) {
          toastError(resp.data.message);
        } else {
          toastError("Unable to update");
        }
        setdatasending(false);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        setdatasending(false);
      });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    setdatasending(true);

    if (!formIsValid) {
      setdatasending(false);
      return;
    }

    // console.log("Submitted!");

    const formdata = new FormData();

    let data = {
      tenderstatus: statusValue.value,
      file: file,
      bidCreationMainId: id,
      tokenid: localStorage.getItem("token"),
      form_id: formId,
    };

    if (file instanceof Blob) {
      data.file = new File([file], file.name);
    }

    for (var key in data) {
      if (data[key] === null) {
        formdata.append(key, "");
        continue;
      }

      formdata.append(key, data[key]);
    }

    if (formId === 0) {
      postData(formdata);
    } else if (formId > 0) {
      putData(formdata, formId);
    }
    // optional: redirect the user
  };
  return (
    <Fragment>
      <ModalCard id={"tenderStatusModal"}>
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Tender Status
          </h5>
          <button
            className="close"
            type="button"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <PreLoader loading={FetchLoading}>
          <div className="modal-body">
            <form encType="multipart/form-data">
              <div className="row align-items-baseline">
                <div className="inputgroup col-lg-12 mb-4 ">
                  <div className="row align-items-center ">
                    <div className="col-lg-4 text-dark font-weight-bold">
                      <label htmlFor="status" className="pr-3">
                        Status :
                      </label>
                    </div>
                    <div className="col-lg-8">
                      <Select
                        name="modeofsubmission"
                        id="modeofsubmission"
                        isSearchable="true"
                        isClearable="true"
                        options={statusOptions}
                        onChange={(selectedOptions) => {
                          statusChangeHandler(selectedOptions);
                          // getcustno(selectedOptions);
                        }}
                        onBlur={statusBlurHandler}
                        value={statusValue}
                      ></Select>
                    </div>
                  </div>
                </div>
                {file === null && (
                  <div className="inputgroup col-lg-12 mb-4 p-0">
                    <div className="row col-lg-12 pr-0">
                      <div className="col-lg-4 text-dark font-weight-bold">
                        <label htmlFor="customername">Document Upload :</label>
                      </div>
                      <div className="col-lg-8 pr-0">
                        <div
                          className={`border-primary d-flex flex-column align-items-center justify-content-center   bg-gray-200 ${styles.height_of_dropbox} ${styles.boderradius__dropbox} ${styles.dashed} ${styles.drop_file_input} `}
                          ref={wrapperRef}
                          onDragEnter={onDragEnter}
                          onDragLeave={onDragLeave}
                          onDrop={onDrop}
                        >
                          <p className="display-4 mb-0">
                            <i className="fas fa-cloud-upload-alt text-primary "></i>
                          </p>
                          {!dragover && (
                            <p className="mt-0">
                              Drag & Drop an document or Click
                            </p>
                          )}
                          {dragover && (
                            <p className="mt-0">Drop the document</p>
                          )}
                          <input
                            type="file"
                            value=""
                            className="h-100 w-100 position-absolute top-50 start-50 pointer"
                            accept={{doctype}+'.rar'}
                            // accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/*,  application/x-zip-compressed"
                            onChange={onFileDrop}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {file !== null && (
                  <div className="inputgroup col-lg-12 mb-4 pr-0">
                    <div className="row col-lg-12 pr-0">
                      <div className="col-lg-4 text-dark font-weight-bold  p-0">
                        {file.lastModified && (
                          <label htmlFor="customername">
                            (Ready To Upload)
                          </label>
                        )}
                        {!file.lastModified && (
                          <label htmlFor="customername">
                            (Uploaded Doc/File)
                          </label>
                        )}
                      </div>
                      <div className="col-lg-8 pr-0 ">
                        <ReadyToUpload
                          file={file}
                          clearFile={() => setFile(null)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </PreLoader>

        <div className="modal-footer">
          <button
            className="btn btn-secondary rounded-pill"
            type="button"
            data-dismiss="modal"
          >
            Cancel
          </button>
          {formId === 0 && (
            <button
              className={
                !formIsValid
                  ? "btn btn-outline-primary float-right rounded-pill"
                  : "btn btn-primary float-right rounded-pill"
              }
              disabled={!formIsValid || isdatasending || FetchLoading}
              onClick={submitHandler}
            >
              {isdatasending && (
                <span className="spinner-border spinner-border-sm mr-2"></span>
              )}
              {isdatasending && progress + "% Submitting..."}
              {!isdatasending && "Submit"}
            </button>
          )}
          {formId > 0 && (
            <button
              className={
                !formIsValid
                  ? "btn btn-outline-primary float-right rounded-pill"
                  : "btn btn-primary float-right rounded-pill"
              }
              disabled={!formIsValid || isdatasending || FetchLoading}
              onClick={submitHandler}
            >
              {isdatasending && (
                <span className="spinner-border spinner-border-sm mr-2"></span>
              )}
              {isdatasending && progress + "% Updating..."}
              {!isdatasending && "Update"}
            </button>
          )}
        </div>
      </ModalCard>
    </Fragment>
  );
};

export default StatusModal;
