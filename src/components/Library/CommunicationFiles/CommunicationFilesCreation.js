import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import Select from "react-select";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import axios from "axios";
import Swal from "sweetalert2/src/sweetalert2.js";
import styles from './UploadDoc.module.css';
import { acceptedFileTypes } from "../../master/FileConfig";
import DocListCP from "./DocListCP";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DocListSaved from "./DocListSaved";
import PreLoader from "../../UI/PreLoader";



const initialValue = {

    date: "",
    refrence_no: "",
    from: "",
    to: "",
    subject: "",
    medium: "",
    med_refrence_no: "",
    
    toselect: "",
    fromselect: ""
};

const initialOptions = {
    options: [],
    isLoading: false,
};

const fromToOptions = [
    { value: "Zigma Global", label: "Zigma Global" },
    { value: "ULB", label: "ULB" },
    { value: "Others", label: "Others" },
];

//Medium Options
const options = [
    { value: "By Postal", label: "By Postal" },
    { value: "Courier", label: "Courier" },
    { value: "Parcel Service", label: "Parcel Service" },
    { value: "In hand Delivery", label: "In hand Delivery" },
];

const CommunicationFilesCreation = () => {

    const {id} = useParams()
    usePageTitle((!id) ? "Communication Files - Create" : 'Communication Files - Update')
    const [input, setInput] = useState(initialValue);
    const [sizeLimitExceeded, setsizeLimitExceeded] = useState(false)
    const [hasError, setHasError] = useState(initialValue);
    const { server1: baseUrl } = useBaseUrl();
    const [ulbOptions, setulbOptions] = useState(initialOptions);
    const [Subject, setSubject] = useState(255)
    const [file, setFile] = useState([]);
    const [dragover, setdragover] = useState(false);
    const wrapperRef = useRef(null);
    const [progress, setProgressCompleted] = useState(0)
    const [isDatasending, setdatasending] = useState(false);
    const [isEditbtn, setisEditbtn] = useState(false)
    const [FetchLoading, setFetchLoading] = useState(false);
    const [preLoading, setPreLoader] = useState(false);
    const [docList, setDocList] = useState([]);
    const navigate = useNavigate();


    const toastSuccess = (text) => {

        toast.success( text , {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
    }
    
      const toastError = (text) => {
        toast.error( text , {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        });
      }

    useEffect(() => {
        getULBList()

        if(id){
            fetchDocs()
            fetchForm()
        }
    }, [id])

    const validateInputLength = (e) => {
        let maxLength = 255;
        setSubject(maxLength - e.target.value.length);
    };

    const getulbData = async (savedulb) => {
        let data = {
            tokenid : localStorage.getItem('token')
          }
        let response = await axios.post(`${baseUrl}/api/ulb-list/${savedulb}`,data);
        return { options: response.data.ulbList, isLoading: false };
    };


    const getULBList = async (savedulb = null) => {
        setulbOptions((c) => {
            return { ...c, isLoading: true };
        });
        let ulbList = await getulbData(savedulb);
        setulbOptions(ulbList);
    }



    const fromToChangehandler = (selectedOptions, field) => {
        let name;
        if (field === 'toselect') {
            name = 'to';
        }

        if (field === 'fromselect') {
            name = 'from'
        }

        if (name) {
            setInput((prev) => {

                if (selectedOptions?.value === 'Zigma Global') {
                    return {
                        ...prev,
                        [field]: selectedOptions,
                        [name]: selectedOptions.value
                    }
                }

                return {
                    ...prev,
                    [field]: selectedOptions,
                    [name]: ''
                }
            })
        }

    }




    const textInputHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
        // if (e.target.value === "" || e.target.value === null) {
        //   setHasError({ ...hasError, [e.target.name]: true });
        // } else {
        //   setHasError({ ...hasError, [e.target.name]: false });
        // }
    };

    const selectChangeHandler = (selectedOptions, action) => {
        setInput({
            ...input,
            [action.name]: selectedOptions
        })
    }

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

        const chosenFiles = Array.prototype.slice.call(e.target.files)

        const uploadedFiles = [...file];
        let sizeLimitExceeded = false;
        let size = 0;

        for (let uplodedFile of uploadedFiles) {
            size = size + +uplodedFile.size;
        }

        if (size / (1000 * 1000) > 50) {
            alert('Maximum Size (50 MB) reached')
            return;
        }

        let notSupportedFileFormats = [];
        let filesAlreadyInList = [];

        for (let chosenFile of chosenFiles) {
            let filetypes = chosenFile.type;
            // console.log(filetypes)
            if (
                uploadedFiles.findIndex((f) => f.name === chosenFile.name) === -1 &&
                (acceptedFileTypes.includes(filetypes) || filetypes.split('/')[0] === "image" || chosenFile.name.split('.').pop() === 'rar')
            ) {

                size = size + +chosenFile.size;

                if ((size / (1000 * 1000)) <= 50) {

                    uploadedFiles.push(chosenFile)
                } else {
                    alert('Maximum Size limit is 50 MB')
                    break;
                }
            } else {

                if (!acceptedFileTypes.includes(filetypes) && filetypes.split('/')[0] !== "image" && chosenFile.name.split('.').pop() !== 'rar') {
                    notSupportedFileFormats.push(chosenFile.name)

                }

                if (uploadedFiles.findIndex((f) => f.name === chosenFile.name) >= 0) {
                    filesAlreadyInList.push(chosenFile.name)

                }
            }
        }

        // console.log(filesAlreadyInList)

        if (filesAlreadyInList.length > 0) {
            alert(`${filesAlreadyInList.join(" ,")} -  File already in the To BE UPLOADED list`);
        }

        if (notSupportedFileFormats.length > 0) {
            alert(`${notSupportedFileFormats.join(" \n")} \n- File(s) Format not supported. Unable to upload!`);
        }

        setFile(uploadedFiles);
        // console.log(size/(1000 * 1000))
        // return



        // chosenFiles.some((file) => {
        //     if(uploadedFiles.findIndex((f) => f.name === file.name) === -1){

        //         for(let uplodedFile of uploadedFiles){
        //             size = size + +uplodedFile.size;
        //         }
        //     }
        // })

        // return;



        // let filetypes = newFile.type

        // if (filetypes === "application/pdf" || filetypes === "application/msword" || filetypes === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || filetypes.split('/')[0] === "image") {
        //     setFile(newFile);
        // } else {
        //     alert("File format not suppoted. Upload pdf, doc, docx and images only")
        // }

    }

    const deleteFromUpload = (filename) => {
        setFile(file.filter((f) => f.name !== filename))
    }

    var config = {
        onUploadProgress: function (progressEvent) {
            console.log("progressEvent",progressEvent)
            var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgressCompleted(percentCompleted)
        }
    }



    const resetform = () => {
        setInput(initialValue)

    }

    const fetchDocs = () => {
        setPreLoader(true)
        let data ={
            mainid : id,
        }
      
        axios.post(`${baseUrl}/api/communicationfilesmaster/list`, data).then((resp) => {
            if(resp.status === 200){
                // console.log(resp.data.docs)
                setDocList(resp.data.docs)          
            }else{
                
            }
            setPreLoader(false) 
        })
    }

    const fetchForm = () => {
        axios.get(`${baseUrl}/api/communicationfilesmaster/${id}`).then((resp) => {
            if(resp.status === 200){
                if(resp.data.status === 200){
                    let communicationfilesmaster = resp.data.communicationfilesmaster
                    setInput((prev) => {
                        return {
                            ...prev,
                            date            : (communicationfilesmaster.date || ''),
                            refrence_no     : (communicationfilesmaster.refrence_no || ''),  
                            fromselect      : communicationfilesmaster?.fromselect ? fromToOptions.find((x) => x.value === communicationfilesmaster.fromselect) : '',
                            from            : (communicationfilesmaster?.fromselect) ? (communicationfilesmaster.from || '') : '',
                   
                            toselect        : communicationfilesmaster?.toselect ? fromToOptions.find((x) => x.value === communicationfilesmaster.toselect) : '',

                            to              : (communicationfilesmaster?.toselect) ? (communicationfilesmaster.to || '') : '',  
                        
                            subject         : (communicationfilesmaster.subject || ''),
                            medium          : (communicationfilesmaster?.medium) ? options.find((x) => x.value === communicationfilesmaster.medium) : '',
                            med_refrence_no : (communicationfilesmaster.med_refrence_no || '')
                        }

                    })
                }
            }
        })
    }

    const postData = (data) => {
        axios.post(`${baseUrl}/api/communicationfilesmaster`, data, config).then((resp) => {
          
            if (resp.data.status === 200) {
                // console.log(resp.data)
              
                // window.history.replaceState(
                //     {},
                //     "Communication Files",
                //     `/tender/master/communicationfiles/communicationfilescreation/` +
                //       resp.data.id
                //   );
                //   navigate(
                //     `/tender/master/communicationfiles/communicationfilescreation/` +
                //       resp.data.id
                //   );
                // // fetchDocs()             
                // // fetchForm()
                // setFile([])
                toastSuccess(resp.data.message)
                Swal.fire({
                    icon: "success",
                    title: "Communication Files",
                    text: resp.data.message,
                    confirmButtonColor: "#5156ed",
                  });
                navigate(
                        `/tender/library/communicationfiles`
                    );
            } else if (resp.data.status === 400) {
                toastError(resp.data.message)
                Swal.fire({
                    icon: "error",
                    title: "Communication Files",
                    text: resp.data.message,
                    confirmButtonColor: "#5156ed",
                  });
            } else {
                toastError("Unable to process!")
                Swal.fire({
                    icon: "error",
                    title: "Communication Files",
                    text: 'Unable to process!',
                    confirmButtonColor: "#5156ed",
                  });
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

    const putData = (data) => {
        axios.post(`${baseUrl}/api/communicationfilesmaster/${id}?_method=PUT`, data, config).then((resp) => {
          
            if (resp.data.status === 200) {
                // console.log(resp.data)
                navigate(
                    `/tender/library/communicationfiles`                
                );
                toastSuccess(resp.data.message)
            } else if (resp.data.status === 400) {
                toastError(resp.data.message)
            } else {
                toastError("Unable to process!")
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



    let formIsValid = false;

    if(
        input.date ||
        input.refrence_no ||
        input.from ||
        input.to ||
        input.subject ||
        input.medium ||
        input.med_refrence_no
    ){
        formIsValid = true;
    }

    const submitHandler = (e) =>{
        e.preventDefault()
        setdatasending(true);
        if (!formIsValid) {
            setdatasending(false);
            return;
        }

        const formdata = new FormData();

        let data = {
            date            : (input.date || ''),
            refrence_no     : input.refrence_no,
            from            : (input.from?.value || input.from || ''),
            to              : (input.to?.value || input.to || ''),
            subject         : input.subject,
            medium          : (input.medium?.value || ''),
            med_refrence_no : input.med_refrence_no,
            fileName        : input.fileName,
            toselect        : (input.toselect?.value || ""),
            fromselect      : (input.fromselect?.value || ""),
            file            : file,
            tokenid         : localStorage.getItem("token"),
            formId          : (id || ''),
            filecount       : (file?.length || 0)
        }

        if (file instanceof Blob) {
            data.file = new File([file], file.name);
        }

        for (var key in data) {
            if(key === 'file'){
                let i = 0;
                for(var key2 in data[key]){
                    formdata.append(`${key}${++i}`, data[key][key2]);
                }
                continue;
            }
            formdata.append(key, data[key]);
        }

        if (id) {
            putData(formdata)
        } else {
            postData(formdata)
        }
    }


    return (
        <Fragment>
            <PreLoader loading = {preLoading}>
            <ToastContainer/>
            <div className="CommunicationFilesCreation">
                <div className="card shadow mb-4 p-4">
                    <form>
                        <div className="row align-items-center ">
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="date">Date :</label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="date"
                                            name="date"
                                            id="date"
                                            className="form-control"
                                            value={input.date}
                                            onChange={textInputHandler}
                                        />
                                        {hasError.date && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-normal">
                                                    Enter Valid Date..!
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="refrence_no" >
                                            Refrence No
                                        </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="text"
                                            name="refrence_no"
                                            id="refrence_no"
                                            className="form-control"
                                            value={input.refrence_no}
                                            onChange={textInputHandler}
                                        />
                                        {hasError.refrence_no && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-normal">
                                                    Enter Valid Refrence No..!
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center ">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="from" className=" font-weight-bold">From</label>
                                    </div>
                                    <div className="col-lg-8">
                                        <div className="col-lg-12 d-flex justify-content-between p-0">
                                            <Select
                                                name="fromselect"
                                                id="fromselect"
                                                className="col-md-6 p-0"
                                                isSearchable="true"
                                                isClearable="true"
                                                options={fromToOptions}
                                                onChange={(selectedOptions) => { fromToChangehandler(selectedOptions, 'fromselect') }}
                                                value={input.fromselect}
                                            ></Select>
                                            &nbsp;
                                            {(input?.fromselect === '' || input?.fromselect?.value === 'Others' || input?.fromselect === null) && <input
                                                type="text"
                                                name="from"
                                                id="from"
                                                className="form-control col-md-6"
                                                value={input.from}
                                                onChange={textInputHandler}
                                                disabled={!input?.fromselect}
                                            // onBlur={fromBlurHandler}
                                            />}
                                            {(input?.fromselect?.value === 'Zigma Global') && <input
                                                type="text"
                                                name="from"
                                                id="from"
                                                className="form-control col-md-6"
                                                value={input.from}
                                                onChange={textInputHandler}
                                                disabled={!(input?.fromselect)}
                                            // onBlur={fromBlurHandler}
                                            />}
                                            {(input?.fromselect?.value === 'ULB') &&

                                                <Select
                                                    name="from"
                                                    id="from"
                                                    className="col-md-6 p-0"
                                                    isSearchable="true"
                                                    isClearable="true"
                                                    options={ulbOptions.options}
                                                    onChange={selectChangeHandler}
                                                    value={input.from}
                                                    disabled={!(input?.fromselect)}
                                                ></Select>

                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="to" className=" font-weight-bold">
                                            To
                                        </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <div className="col-lg-12 d-flex justify-content-between p-0">
                                            <Select
                                                name="toselect"
                                                id="toselect"
                                                className="col-md-6 p-0"
                                                isSearchable="true"
                                                isClearable="true"
                                                options={fromToOptions}
                                                onChange={(selectedOptions) => { fromToChangehandler(selectedOptions, 'toselect') }}
                                                value={input.toselect}
                                            ></Select>
                                            &nbsp;
                                            {(input?.toselect === '' || input?.toselect?.value === 'Others' || input?.toselect === null) && <input
                                                type="text"
                                                name="to"
                                                id="to"
                                                className="form-control col-md-6"
                                                value={input.to}
                                                onChange={textInputHandler}
                                                disabled = {!input?.toselect}
                                            // onBlur={toBlurHandler}
                                            />}
                                            {(input?.toselect?.value === 'Zigma Global') && <input
                                                type="text"
                                                name="to"
                                                id="to"
                                                className="form-control col-md-6"
                                                value={input.to}
                                                onChange={textInputHandler}
                                                disabled = {!input?.toselect}
                                            // onBlur={toBlurHandler}
                                            />}
                                            {(input?.toselect?.value === 'ULB') &&

                                                <Select
                                                    name="to"
                                                    id="to"
                                                    className="col-md-6 p-0"
                                                    isSearchable="true"
                                                    isClearable="true"
                                                    options={ulbOptions.options}
                                                    onChange={selectChangeHandler}
                                                    value={input.to}
                                                    disabled = {!input?.toselect}
                                                ></Select>

                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row font-weight-bold">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="subject">
                                            Subject{" "}
                                        </label>
                                        <p className="text-info font-weight-bold">
                                            <small>
                                                <b>({Subject} Characters Remaining) </b>
                                            </small>
                                        </p>
                                    </div>
                                    <div className="col-lg-8">
                                        <textarea
                                            className="form-control"
                                            id="subject"
                                            placeholder="Enter Subject"
                                            name="subject"
                                            rows="3"
                                            value={input.subject}
                                            onChange={textInputHandler}
                                            onKeyUp={validateInputLength}
                                            maxLength="255"
                                        ></textarea>
                                        {/* {TenderDescriptionHasError && (
                                        <div className="pt-1">
                                        <span className="text-danger font-weight-normal">
                                            Tender Description is required.
                                        </span>
                                        </div>
                                    )} */}
                                    </div>
                                </div>
                            </div>

                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center  mb-4">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="medium" className=" font-weight-bold">Medium </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <Select
                                            name="medium"
                                            id="medium"
                                            options={options}
                                            isSearchable="true"
                                            isClearable="true"
                                            value={input.medium}
                                            onChange={selectChangeHandler}
                                        ></Select>
                                    </div>
                                </div>
                                <div className="row align-items-center font-weight-bold">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="med_refrence_no">Med. reference no</label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="text"
                                            name="med_refrence_no"
                                            id="med_refrence_no"
                                            className="form-control"
                                            value={input.med_refrence_no}
                                            onChange={textInputHandler}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row ">
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
                                            <input type="file" multiple value="" className="h-100 w-100 position-absolute top-50 start-50 pointer" accept={`${acceptedFileTypes.join()}`} onChange={onFileDrop} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    {file.length > 0 && <DocListCP filesToUpload={file} deleteFromUpload={deleteFromUpload} />}
                    <div className="col-lg-12 d-flex justify-content-center">
                        {!id &&
                            <button
                                className={(!formIsValid) ? "btn btn-outline-primary rounded-pill px-4" : "btn btn-primary rounded-pill px-4"}
                                disabled={!formIsValid || isDatasending || FetchLoading}
                                onClick = {submitHandler}
                            >
                                {isDatasending && <span className="spinner-border spinner-border-sm mr-2"></span>}
                                {isDatasending && progress + '% Uploaded'}
                                {!isDatasending && 'Save'}
                            </button>}
                        {id &&
                            <button
                                className={(!formIsValid) ? "btn btn-outline-primary rounded-pill px-4" : "btn btn-primary rounded-pill px-4"}
                                disabled={!formIsValid || isDatasending || FetchLoading}
                                onClick = {submitHandler}
                            >
                                {isDatasending && <span className="spinner-border spinner-border-sm mr-2"></span>}
                                {isDatasending && progress + '%  Updating...'}
                                {!isDatasending && 'Update'}
                            </button>}

                        {/* <button
                            className="btn  btn-outline-dark rounded-pill mx-3"
                            onClick={resetform}
                            disabled={isDatasending || FetchLoading}
                        >
                            Clear
                        </button> */}
                    </div>
                    <DocListSaved loaadig = {preLoading} docList= {docList}
                       fetchDocs = {fetchDocs}
                       toastSuccess = {toastSuccess}
                       toastError = {toastError} 
                       loading = {preLoading}
                    />
                </div>
            </div>
            </PreLoader>
        </Fragment>
    )
}

export default CommunicationFilesCreation