import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import CollapseCard from "../../../../UI/CollapseCard";
import LockCard from "../../../../UI/LockCard";
import PreLoader from "../../../../UI/PreLoader";
import Swal from "sweetalert2";
import axios from "axios";
import Select from "react-select";
import useInputValidation from "../../../../hooks/useInputValidation";
import { isNotNull } from "../../../CommonFunctions/CommonFunctions";
import ReadyToUpload from "./ReadyToupload";
import styles from '../TenderFee/TenderFee.module.css'

const modeOptions = [
    { value: 'online', label: 'Online' },
    { value: 'hardcopy', label: 'Hardcopy' },
    { value: 'both', label: 'Both' },

];

const BidSubmittedStatus = () => {
    const { id } = useParams();
    const [FetchLoading, setFetchLoading] = useState(false);
    const [formId, setFormId] = useState(0);
    const [isdatasending, setdatasending] = useState(false);
    const [dragover, setdragover] = useState(false);
    const wrapperRef = useRef(null);
    const [file, setFile] = useState(null);
    const { server1: baseUrl } = useBaseUrl();
    const [toastSuccess, toastError, setBidManagementMainId, bidManageMainId] = useOutletContext();
    const [progress, setProgressCompleted] = useState(0)
    const navigate = useNavigate();
    const [bidsubmissionstatusValue, setbidsubmissionstatusValue] = useState("Yes");


    const bidsubmssionstatushandler = (e) => {
        setbidsubmissionstatusValue(e.target.value);
    };



    const {
        value: modeValue,
        isValid: modeIsValid,
        hasError: modeHasError,
        valueChangeHandlerForReactSelect: modeChangeHandler,
        inputBlurHandler: modeBlurHandler,
        setInputValue: setmode,
        reset: resetmode,
    } = useInputValidation(isNotNull)

    const onDragEnter = () => {
        wrapperRef.current.classList.add(styles['dragover'])
        setdragover(true)
    };

    const onDragLeave = () => {
        wrapperRef.current.classList.remove(styles['dragover'])
        setdragover(false)
    };

    const onDrop = () => wrapperRef.current.classList.remove(styles['dragover']);

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];

        let filetypes = newFile.type

        if (filetypes === "application/pdf" || filetypes === "application/msword" || filetypes === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || filetypes.split('/')[0] === "image") {
            setFile(newFile);
        } else {
            alert("File format not supported. Upload pdf, doc, docx and images only")
        }

    }

    let formIsValid = false;

    const fetchLatestData = () => {
        setFetchLoading(true)
        axios.get(`${baseUrl}/api/bidcreation/bidsubmission/bidsubmittedstatus/${id}`).then((resp) => {
          if (resp.data.status === 200) {
              setFormId(resp.data.BidCreationBidSubmittedStatus.id)
              let bidsubmittedstatus = resp.data.BidCreationBidSubmittedStatus
              setbidsubmissionstatusValue(bidsubmittedstatus.bidSubmittedStatus)
              setmode(modeOptions.find(
                  (x) => x.value === bidsubmittedstatus.modeofsubmission
              ))
            

              if(resp.data.file){
                  axios({
                      url: `${baseUrl}/api/download/bidsubmittedstatusdocs/${bidsubmittedstatus.id}`,
                      method: 'GET',
                      responseType: 'blob', // important
                  }).then((response) => {
                      if (response.status === 200) {
                          response.data.name = bidsubmittedstatus.file_original_name
                          setFile(response.data)
                      } else {
                          alert("Unable to Process Now!")
                      }
                      setFetchLoading(false)
                  });
              }                
          }
          setFetchLoading(false)
        })  
      
    }

    useEffect(() => {
        if(id){
            fetchLatestData()
        }
    }, [])

    if( modeIsValid &&
        (file !== null)
    ){
        formIsValid = true;
    }
    var config = {
        onUploadProgress: function (progressEvent) {
            var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgressCompleted(percentCompleted)
        }
    }

    const postData = (data) => {
        axios.post(`${baseUrl}/api/bidcreation/bidsubmission/bidsubmittedstatus`, data, config).then((resp) => {
            if (resp.data.status === 200) {
                toastSuccess(resp.data.message);
                setFormId(resp.data.id);
                fetchLatestData() 
                // resetall()
                navigate("/tender/bidmanagement/list/main/bidsubmission/"+id);
                //   myRef.current.scrollIntoView({ behavior: 'smooth' })    
                window.history.replaceState({},"Bid Creation", "/tender/bidmanagement/list/main/bidsubmission/"+id);
            } else if (resp.data.status === 400) {
                toastError(resp.data.message)
            } else {
                toastError("Unable to upload the document")
            }
            setdatasending(false)
        }).catch((err) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
            setdatasending(false)
        });
    }

    const putData = (data, formid) => {
        axios.post(`${baseUrl}/api/bidcreation/bidsubmission/bidsubmittedstatus/${formid}?_method=PUT`, data, config).then((resp) => {
            if (resp.data.status === 200) {
              toastSuccess(resp.data.message)
              fetchLatestData() 
            } else if (resp.data.status === 400) {
              toastError(resp.data.message)
            }else {
              toastError("Unable to update")
            }
            setdatasending(false)
          }).catch((err) => {
           
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            })
            setdatasending(false)
          });
    }

    const submitHandler = (e) => {
        e.preventDefault();

        setdatasending(true);

        if(!formIsValid) {
        setdatasending(false);
        return;
        }

        // console.log("Submitted!");

        const formdata = new FormData();

        let data = {
            bidSubmittedStatus  : bidsubmissionstatusValue, 
            modeofsubmission    : modeValue.value,
            file                : file,
            bidCreationMainId   : id,
            tokenid             : localStorage.getItem("token"),
            form_id             : formId,
        };
    
        if (file instanceof Blob) {
            data.file = new File([file], file.name);
        }

        for (var key in data) {
            if(data[key] === null){
                formdata.append(key, '');
                continue;
            }

            formdata.append(key, data[key]);
        }   

        if(formId === 0){
            postData(formdata);
        }else if(formId > 0){
            putData(formdata, formId)
        }

    }



    return (
        <Fragment>
            <CollapseCard id={"BidSubmittedStatus"} title={"Bid Submitted Status"}>
                <LockCard locked={!id}>
                    <PreLoader loading={FetchLoading}>
                        <form onSubmit={submitHandler}>
                            <div className="row align-items-center ">
                                <div className="inputgroup col-lg-6 mb-4">
                                    <div className="row align-items-center">
                                        <div className="col-lg-4 text-dark font-weight-bold">
                                            <label htmlFor="bidSubmittedStatus">Bid Submitted Status :</label>
                                        </div>
                                        <div className="col-lg-8">
                                            <div className="form-check form-check-inline mr-5">
                                                <label className="form-check-label" htmlFor="bidSubmittedStatus_yes">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="bidSubmittedStatus"
                                                        id="bidSubmittedStatus_yes"
                                                        checked={"Yes" === bidsubmissionstatusValue}
                                                        value="Yes"
                                                        onChange={(e) => {
                                                            bidsubmssionstatushandler(e);
                                                            // getcustno(stateValue)
                                                        }}
                                                    />
                                                    Yes
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <label className="form-check-label" htmlFor="bidSubmittedStatus_no">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="bidSubmittedStatus"
                                                        id="bidSubmittedStatus_no"
                                                        checked={"No" === bidsubmissionstatusValue}
                                                        value="No"
                                                        onChange={(e) => {
                                                            bidsubmssionstatushandler(e);
                                                            //  getcustno(stateValue)
                                                        }}
                                                    />
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="inputgroup col-lg-6 mb-4">
                                    <div className="row align-items-center">
                                        <div className="col-lg-4 text-dark font-weight-bold">
                                            <label htmlFor="modeofsubmission">Mode of Submission :</label>
                                        </div>
                                        <div className="col-lg-8">
                                            <Select
                                                name="modeofsubmission"
                                                id="modeofsubmission"
                                                isSearchable="true"
                                                isClearable="true"
                                                options={modeOptions}
                                                onChange={(selectedOptions) => {
                                                    modeChangeHandler(selectedOptions);
                                                    // getcustno(selectedOptions);
                                                }}
                                                onBlur={modeBlurHandler}
                                                value={modeValue}

                                            ></Select>
                                            {modeHasError && (
                                                <div className="pt-1">
                                                    <span className="text-danger font-weight-normal">
                                                        Mode is required
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {file === null && <div className="inputgroup col-lg-12 mb-4 p-0">
                            <div className="row col-lg-6">
                                <div className="col-lg-4 text-dark font-weight-bold">
                                    <label htmlFor="customername">Document Upload :</label>
                                </div>
                                <div className="col-lg-8">
                                    <div className={`border-primary d-flex flex-column align-items-center justify-content-center   bg-gray-200 ${styles.height_of_dropbox} ${styles.boderradius__dropbox} ${styles.dashed} ${styles.drop_file_input} `}
                                        ref={wrapperRef}
                                        onDragEnter={onDragEnter}
                                        onDragLeave={onDragLeave}
                                        onDrop={onDrop}
                                    >
                                        <p className="display-4 mb-0"><i className='fas fa-cloud-upload-alt text-primary '></i></p>
                                        {!dragover && <p className="mt-0">Drag & Drop an document or Click</p>}
                                        {dragover && <p className="mt-0">Drop the document</p>}
                                        <input type="file" value="" className="h-100 w-100 position-absolute top-50 start-50 pointer" accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/* " onChange={onFileDrop} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">&nbsp;</div>
                            </div>}
                            {(file !== null) && <div className="inputgroup col-lg-12 mb-4">  
                            <div className="row col-lg-6">
                                <div className="col-lg-4 text-dark font-weight-bold  p-0">
                                  {(file.lastModified) && <label htmlFor="customername">(Ready To Upload)</label>}
                                  {(!file.lastModified) && <label htmlFor="customername">(Uploaded Doc/File)</label>}
                                </div>
                                <div className="col-lg-8 pr-0">
                                    <ReadyToUpload file={file} clearFile={() => setFile(null)}/>
                                </div>
                            </div>
                            <div className="col-lg-6">&nbsp;</div>
                            </div>}
                            <div className="col-lg-12">
                                {(formId===0) && (
                                    <button
                                        className={
                                            !formIsValid
                                                ? "btn btn-outline-primary float-right rounded-pill"
                                                : "btn btn-primary float-right rounded-pill"
                                        }
                                        disabled={!formIsValid || isdatasending}
                                    >
                                        {isdatasending && (
                                            <span className="spinner-border spinner-border-sm mr-2"></span>
                                        )}
                                        {isdatasending && progress + "% Saving..."}
                                        {!isdatasending && "Save"}
                                    </button>
                                )}
                                {(formId>0) && (
                                    <button
                                        className={
                                            !formIsValid
                                                ? "btn btn-outline-primary float-right rounded-pill"
                                                : "btn btn-primary float-right rounded-pill"
                                        }
                                        disabled={!formIsValid || isdatasending}
                                    >
                                        {isdatasending && (
                                            <span className="spinner-border spinner-border-sm mr-2"></span>
                                        )}
                                        {isdatasending && progress + "% Updating..."}
                                        {!isdatasending && "Edit"}
                                    </button>
                                )}
                              
                            </div>
                            </div>
                        </form>
                    </PreLoader>
                </LockCard>
            </CollapseCard>
        </Fragment>
    )
}

export default BidSubmittedStatus;