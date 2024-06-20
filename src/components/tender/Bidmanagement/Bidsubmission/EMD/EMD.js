import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
// import useInputValidation from "../../../../hooks/useInputValidation";
import useInputValidation from "../../../../hooks/useInputValidation_copy";
import CollapseCard from "../../../../UI/CollapseCard";
import LockCard from "../../../../UI/LockCard";
import { isNotEmpty, isNotNull } from "../../../CommonFunctions/CommonFunctions";
// import { isNotEmpty, isNotNull } from "../../../CommonFunctions/CommonFunctions_copy";
import Select from "react-select";
import styles from "./TenderFee.module.css";
import ReadyToUpload from "./ReadyToupload";
import Swal from "sweetalert2";
import axios from "axios";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import PreLoader from "../../../../UI/PreLoader";
import { acceptedFileTypes } from "../../../../master/FileConfig";



const modeOptions = [
    { value: 'bg', label: 'BG' },
    { value: 'dd', label: 'DD' },
    { value: 'neft/rtgs', label: 'NEFT / RTGS' },
    { value: 'onlineTransfer', label: 'Online Transfer' },
];


const EMD = () => {
    const { id } = useParams();
    const [formId, setFormId] = useState(0);
    const [isdatasending, setdatasending] = useState(false);
    const [FetchLoading, setFetchLoading] = useState(false);
    const [dragover, setdragover] = useState(false);
    const wrapperRef = useRef(null);
    const [file, setFile] = useState(null);
    const { server1: baseUrl } = useBaseUrl();
    const [toastSuccess, toastError, setBidManagementMainId, bidManageMainId ] = useOutletContext();
    const [progress, setProgressCompleted] = useState(0)
    const navigate = useNavigate();

    const {
        value: banknameValue,
        isValid: banknameIsValid,
        hasError: banknameHasError,
        valueChangeHandler: banknameChangeHandler,
        inputBlurHandler: banknameBlurHandler,
        setInputValue: setbanknameValue,
        reset: resetbankname,
    } = useInputValidation(isNotEmpty);

    const {
        value: bankbranchValue,
        isValid: bankbranchIsValid,
        hasError: bankbranchHasError,
        valueChangeHandler: bankbranchChangeHandler,
        inputBlurHandler: bankbranchBlurHandler,
        setInputValue: setbankbranchValue,
        reset: resetbankbranch,
    } = useInputValidation(isNotEmpty);


    const {
        value: modeValue,
        isValid: modeIsValid,
        hasError: modeHasError,
        valueChangeHandlerForReactSelect: modeChangeHandler,
        inputBlurHandler: modeBlurHandler,
        setInputValue: setmode,
        reset: resetmode,
    } = useInputValidation(isNotNull)

    const {
        value: dateofsubmissionValue,
        isValid: dateofsubmissionIsValid,
        hasError: dateofsubmissionHasError,
        valueChangeHandler: dateofsubmissionChangeHandler,
        inputBlurHandler: dateofsubmissionBlurHandler,
        setInputValue: setdateofsubmissionValue,
        reset: resetdateofsubmission,
    } = useInputValidation(isNotEmpty);

    const {
        value: bgnoValue,
        isValid: bgnoIsValid,
        hasError: bgnoHasError,
        valueChangeHandler: bgnoChangeHandler,
        inputBlurHandler: bgnoBlurHandler,
        setInputValue: setbgnoValue,
        reset: resetbgno,
    } = useInputValidation(isNotEmpty);

    const {
        value: ddnoValue,
        isValid: ddnoIsValid,
        hasError: ddnoHasError,
        valueChangeHandler: ddnoChangeHandler,
        inputBlurHandler: ddnoBlurHandler,
        setInputValue: setddnoValue,
        reset: resetddno,
    } = useInputValidation(isNotEmpty);

    const {
        value: utrnoValue,
        isValid: utrnoIsValid,
        hasError: utrnoHasError,
        valueChangeHandler: utrnoChangeHandler,
        inputBlurHandler: utrnoBlurHandler,
        setInputValue: setutrnoValue,
        reset: resetutrno,
    } = useInputValidation(isNotEmpty);

    const {
        value: refnoValue,
        isValid: refnoIsValid,
        hasError: refnoHasError,
        valueChangeHandler: refnoChangeHandler,
        inputBlurHandler: refnoBlurHandler,
        setInputValue: setrefnoValue,
        reset: resetrefno,
    } = useInputValidation(isNotEmpty);

    const {
        value: dateofissueValue,
        isValid: dateofissueIsValid,
        hasError: dateofissueHasError,
        valueChangeHandler: dateofissueChangeHandler,
        inputBlurHandler: dateofissueBlurHandler,
        setInputValue: setdateofissueValue,
        reset: resetdateofissue,
    } = useInputValidation(isNotEmpty);

    const {
        value: expiaryDateValue,
        isValid: expiaryDateIsValid,
        hasError: expiaryDateHasError,
        valueChangeHandler: expiaryDateChangeHandler,
        inputBlurHandler: expiaryDateBlurHandler,
        setInputValue: setexpiaryDateValue,
        reset: resetexpiaryDate,
    } = useInputValidation(isNotEmpty);

    const {
        value: dateofpaymentValue,
        isValid: dateofpaymentIsValid,
        hasError: dateofpaymentHasError,
        valueChangeHandler: dateofpaymentChangeHandler,
        inputBlurHandler: dateofpaymentBlurHandler,
        setInputValue: setdateofpaymentValue,
        reset: resetdateofpayment,
    } = useInputValidation(isNotEmpty);

    const {
        value: valueValue,
        isValid: valueIsValid,
        hasError: valueHasError,
        valueChangeHandler: valueChangeHandler,
        inputBlurHandler: valueBlurHandler,
        setInputValue: setvalueValue,
        reset: resetvalue,
    } = useInputValidation(isNotEmpty);

    const fetchLatestData = () => {
            setFetchLoading(true)
            axios.get(`${baseUrl}/api/bidcreation/bidsubmission/emdfee/${id}`).then((resp) => {
              if (resp.data.status === 200) {
                // console.log("resp.data",resp.data);
                  setFormId(resp.data.BidCreationEMD.id)
                  let emdfee = resp.data.BidCreationEMD
                  setbanknameValue(emdfee.bankname?emdfee.bankname:"")
                  setbankbranchValue(emdfee.bankbranch?emdfee.bankbranch:"")
                  setmode(modeOptions.find(
                      (x) => x.value === emdfee.mode
                  ))
                  setdateofsubmissionValue(emdfee.dateofsubmission?emdfee.dateofsubmission:"")
                  setbgnoValue(emdfee.bgno?emdfee.bgno:"")
                  setddnoValue(emdfee.ddno? emdfee.ddno:"")
                  setutrnoValue(emdfee.utrno? emdfee.utrno:"")
                  setrefnoValue(emdfee.refno? emdfee.refno :"")
                  setdateofissueValue(emdfee.dateofissue?emdfee.dateofissue:"")
                  setexpiaryDateValue(emdfee.expiaryDate?emdfee.expiaryDate:"")
                  setdateofpaymentValue(emdfee.dateofpayment?emdfee.dateofpayment:"")
                  setvalueValue (emdfee.value?emdfee.value:"")
  
                  if(resp.data.file){
                    let data = {
                        tokenid : localStorage.getItem('token')
                      }
                      axios({
                          url: `${baseUrl}/api/download/emdfeedocs/${emdfee.id}`,data,
                          method: 'POST',
                          responseType: 'blob', // important
                      }).then((response) => {
                          if (response.status === 200) {
                              response.data.name = emdfee.file_original_name
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
      },[])

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

        let filetypes = newFile.type;

        if((newFile.size/(1000*1000)) > 50){
            alert("Maximum upload size limit (50 MB) reached")
            return;
        }

        if (acceptedFileTypes.includes(filetypes) || filetypes.split('/')[0] === "image" || newFile.name.split('.').pop() === 'rar') {
            setFile(newFile);
        } else {
            alert("File format not suppoted. Upload pdf, doc, docx, csv, xlsx, zip, rar and images only")
        }

    }

    let formIsValid = false;

    const cancelHandler = () => {

    }

    if(banknameIsValid &&
        bankbranchIsValid &&
        modeIsValid &&
        dateofsubmissionIsValid &&
       (((modeValue.value==='bg') && bgnoIsValid && dateofissueIsValid && expiaryDateIsValid) ||
        ((modeValue.value==='dd') && ddnoIsValid && dateofissueIsValid) ||
        ((modeValue.value==='neft/rtgs' || modeValue.value==='onlineTransfer' ) && utrnoIsValid && refnoIsValid &&  dateofpaymentIsValid)) &&
        valueIsValid &&
        (file !== null)
    ){
        formIsValid = true;
    }

    // if((banknameValue ||
    //     bankbranchValue ||
    //     modeValue ||
    //     dateofsubmissionValue) &&
    //    (((modeValue.value==='bg') && bgnoValue ||( dateofissueValue || expiaryDateValue) ||
    //     ((modeValue.value==='dd') && ddnoValue || ( dateofissueValue)) ||
    //     ((modeValue.value==='neft/rtgs' || modeValue.value==='onlineTransfer') && utrnoValue)) &&
    //     (valueValue ||
    //     (file !== null))
    // )){
    //     formIsValid = true;
    // }
    

    var config = {
        onUploadProgress: function (progressEvent) {
            var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgressCompleted(percentCompleted)
        }
    }

    const modeOnChangeHandler = (selectedOptions) => {
        setbgnoValue('')
        setddnoValue('')
        setutrnoValue('')
        setrefnoValue('')
        setdateofissueValue('')
        setexpiaryDateValue('')
        setdateofpaymentValue('')
        setvalueValue ('')
        modeChangeHandler(selectedOptions)
    }

    const postData = (data) => {
        axios.post(`${baseUrl}/api/bidcreation/bidsubmission/emdfee`, data, config).then((resp) => {
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
        axios.post(`${baseUrl}/api/bidcreation/bidsubmission/emdfee/${formid}?_method=PUT`, data, config).then((resp) => {
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

        

        let tenderEmdData = {
            bankname  : banknameValue, 
            bankbranch : bankbranchValue, 
            mode : modeValue, 
            dateofsubmission : dateofsubmissionValue, 
            bgno : bgnoValue, 
            ddno : ddnoValue, 
            utrno : utrnoValue, 
            dateofissue : dateofissueValue, 
            expiaryDate : expiaryDateValue, 
            refno : refnoValue, 
            dateofpayment : dateofpaymentValue, 
            value : valueValue, 
            file: file,
            bidCreationMainId : id
        };
    
        let data = {
            bankname  : banknameValue, 
            bankbranch : bankbranchValue, 
            mode : modeValue.value, 
            dateofsubmission : dateofsubmissionValue, 
            bgno : bgnoValue, 
            ddno : ddnoValue, 
            utrno : utrnoValue, 
            dateofissue : dateofissueValue, 
            expiaryDate : expiaryDateValue, 
            refno : refnoValue, 
            dateofpayment : dateofpaymentValue, 
            value : valueValue, 
            file: file,
            bidCreationMainId : id,
            tokenid: localStorage.getItem("token"),
            form_id: formId,
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
            <CollapseCard id={"EMD"} title={"EMD Fee"}>
                <LockCard locked={!id}>
                    <PreLoader loading = {FetchLoading}>
                    <form onSubmit={submitHandler}>
                        <div className="row align-items-center ">
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="bankname" className="pr-3">
                                            Bank Name :
                                        </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="bankname"
                                            placeholder="Enter Bank Name"
                                            name="bankname"
                                            value={banknameValue}
                                            onChange={banknameChangeHandler}
                                            onBlur={banknameBlurHandler}
                                            disabled={false}
                                        />
                                        {banknameHasError && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-normal">
                                                    Bank Name is required
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="bankbranch" className="pr-3">
                                            Bank's Branch :
                                        </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="bankbranch"
                                            placeholder="Enter Bank Branch"
                                            name="bankbranch"
                                            value={bankbranchValue}
                                            onChange={bankbranchChangeHandler}
                                            onBlur={bankbranchBlurHandler}
                                            disabled={false}
                                        />
                                        {bankbranchHasError && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-normal">
                                                    Bank's Branch is required
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark font-weight-bold">
                                        <label htmlFor="mode">Mode :<span className="text-danger">*</span></label>
                                    </div>
                                    <div className="col-lg-8">
                                        <Select
                                            name="mode"
                                            id="mode"
                                            isSearchable="true"
                                            isClearable="true"
                                            options={modeOptions}
                                            onChange={(selectedOptions) => {
                                                modeOnChangeHandler(selectedOptions);
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
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="dateofsubmission" className="pr-3">
                                            Date of Submission : <span className="text-danger">*</span>
                                        </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="Date"
                                            className="form-control"
                                            id="dateofsubmission"
                                            placeholder="Enter Date of Submission"
                                            name="dateofsubmission"
                                            value={dateofsubmissionValue}
                                            onChange={dateofsubmissionChangeHandler}
                                            onBlur={dateofsubmissionBlurHandler}
                                            disabled={false}
                                        />
                                        {dateofsubmissionHasError && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-normal">
                                                    Date of Submission is required
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {modeValue && (modeValue.value === 'bg') && <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="bgno" className="pr-3">
                                            BG No :<span className="text-danger">*</span>
                                        </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="bgno"
                                            placeholder="Enter BG No."
                                            name="bgno"
                                            value={bgnoValue}
                                            onChange={bgnoChangeHandler}
                                            onBlur={bgnoBlurHandler}
                                            disabled={false}
                                        />
                                        {bgnoHasError && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-normal">
                                                    BG No. is required
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>}
                            {modeValue && (modeValue.value === 'dd') && <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="ddno" className="pr-3">
                                            DD No : <span className="text-danger">*</span>
                                        </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="ddno"
                                            placeholder="Enter DD No."
                                            name="ddno"
                                            value={ddnoValue}
                                            onChange={ddnoChangeHandler}
                                            onBlur={ddnoBlurHandler}
                                            disabled={false}
                                        />
                                        {ddnoHasError && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-normal">
                                                    DD No. is required
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>}
                            {modeValue && (modeValue.value === 'neft/rtgs' || modeValue.value === 'onlineTransfer') && <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="utrno" className="pr-3">
                                            UTR No :<span className="text-danger">*</span>
                                        </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="utrno"
                                            placeholder="Enter UTR no"
                                            name="utrno"
                                            value={utrnoValue}
                                            onChange={utrnoChangeHandler}
                                            onBlur={utrnoBlurHandler}
                                            disabled={false}
                                        />
                                        {utrnoHasError && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-normal">
                                                    UTR No. is required
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>}
                            {modeValue && (modeValue.value === 'bg' || modeValue.value === 'dd') && <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="dateofissue" className="pr-3">
                                            Date of Issue : <span className="text-danger">*</span>
                                        </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="dateofissue"
                                            placeholder="Enter Date of issue"
                                            name="dateofissue"
                                            value={dateofissueValue}
                                            onChange={dateofissueChangeHandler}
                                            onBlur={dateofissueBlurHandler}
                                            disabled={false}
                                        />
                                        {dateofissueHasError && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-normal">
                                                    Date of Issue is required
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>}
                            {modeValue && (modeValue.value === 'bg') && <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="expiaryDate" className="pr-3">
                                            Expiry Date :
                                        </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="expiaryDate"
                                            placeholder="Enter Date of issue"
                                            name="expiaryDate"
                                            value={expiaryDateValue}
                                            onChange={expiaryDateChangeHandler}
                                            onBlur={expiaryDateBlurHandler}
                                            disabled={false}
                                        />
                                        {expiaryDateHasError && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-normal">
                                                    Expiry Date is required
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>}
                            {modeValue && (modeValue.value === 'neft/rtgs' || modeValue.value === 'onlineTransfer') && <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="refno" className="pr-3">
                                            Ref No :
                                        </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="refno"
                                            placeholder="Enter Ref No."
                                            name="refno"
                                            value={refnoValue}
                                            onChange={refnoChangeHandler}
                                            onBlur={refnoBlurHandler}
                                            disabled={false}
                                        />
                                        {refnoHasError && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-normal">
                                                    Ref No. is required
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>}
                            {modeValue && (modeValue.value === 'neft/rtgs' || modeValue.value === 'onlineTransfer') && <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="dateofpayment" className="pr-3">
                                            Date of Payment :
                                        </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="dateofpayment"
                                            placeholder="Enter Date of issue"
                                            name="dateofpayment"
                                            value={dateofpaymentValue}
                                            onChange={dateofpaymentChangeHandler}
                                            onBlur={dateofpaymentBlurHandler}
                                            disabled={false}
                                        />
                                        {dateofpaymentHasError && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-normal">
                                                    Date of payment is required
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>}
                            {modeValue && <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="value" className="pr-3">
                                            Value :<span className="text-danger">*</span>
                                        </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="value"
                                            placeholder="Enter Value"
                                            name="value"
                                            value={valueValue}
                                            onChange={valueChangeHandler}
                                            onBlur={valueBlurHandler}
                                            disabled={false}
                                        />
                                        {valueHasError && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-normal">
                                                    Value is required
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>}
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
                                        <input type="file" value="" className="h-100 w-100 position-absolute top-50 start-50 pointer" accept={`${acceptedFileTypes.join()}`} onChange={onFileDrop} />
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

export default EMD;