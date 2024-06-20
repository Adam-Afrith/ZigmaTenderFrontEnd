import { Fragment } from "react";
import { useState, useEffect, useRef } from "react";
import { usePageTitle } from "../../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "./../../../hooks/useBaseUrl";
import Select from "react-select";
import LocalDateTime from "./../../../hooks/useLocalDateTime";
import styles from "../../../master/UserCreation/UserCreation.module.css";
import { ImageConfig } from "../../../hooks/Config";
import { useAllowedMIMEDocType } from "../../../hooks/useAllowedMIMEDocType";
import { useAllowedUploadFileSize } from "../../../hooks/useAllowedUploadFileSize";
import { useImageStoragePath } from "../../../hooks/useImageStoragePath";
import { FaDownload } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import useGeoLocation from "../../../hooks/useGeoLocation";
import { Link } from 'react-router-dom';

const selectFiles = {
  name: '',
  size: '',
  type: '',
  value: '',
  src: undefined,
};


const AttendanceEntry = () => {
  usePageTitle("Attendance Entry");
  const { server1: baseUrl } = useBaseUrl()
  const navigate = useNavigate();
  const { id } = useParams();
  const [options, setOptions] = useState([]);  

  const initialState = {
    userId: '',
    attendanceType: '',
    fromDate: undefined,
    toDate: undefined,
    startTime: '',
    reason: '',   
  };
  const initialStateErr = {
    userIdErr: "",
    attendanceTypeErr: "",
    fromDateErr: "",
    toDateErr: "",
  };
  const { MIMEtype: docType } = useAllowedMIMEDocType();
  const [accFileStorage, setAccFileStorage] = useState(0);
  const { total: totalStorageSize } = useAllowedUploadFileSize();
  const { attendance: filePath } = useImageStoragePath();
  const [dateTime, setDateTime] = useState(new Date());

  const [formIsValid, setFormIsValid] = useState(false);
  const [input, setInput] = useState(initialState);
  const [inputValidation, setInputValidation] = useState(initialStateErr);
  
  // const [isClicked, setIsClicked] = useState({
  //   userId: false,
  //   attendanceType: false
  // });

  const [employeeList, setEmployeeList] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);

  const [files, setFiles] = useState({});
  const [fileData, setFileData] = useState([]);
  const [fileCheck, setFileCheck] = useState(null);
  const [fileSizeLimit, setFileSizeLimit] = useState({ error: '' });
  const [dataSending, setDataSending] = useState(false);
  const [file, setFile] = useState(selectFiles);
  const [fileListCheck, setFileListCheck] = useState(false);
  const [fileuploading, setFileUploading] = useState(false);  

  const [savedData, setSavedData] = useState({});


  const location = useGeoLocation();

  // console.log('LOCATION--',location)

 


  useEffect(() => {
    let data1 = {
      tokenid : localStorage.getItem('token')
    }

    axios.post(`${baseUrl}/api/employeelist`,data1).then((resp) => {
      setEmployeeList(resp.data.employeelist);
     
    })   

    let data = {
      tokenid : localStorage.getItem('token')
    }

    axios.post(`${baseUrl}/api/attendancetypelist`,data).then((resp) => {
      setAttendanceList(resp.data.attendancetypelist);
    })

  }, [])  

  useEffect(() => {
    let fileCount = 1;
  
    if (id && employeeList.length >0 && attendanceList.length > 0) {
     getSavedList();
    }
    else{
      if(employeeList.find((x) => x.label == localStorage.getItem('userName'))){
        setInput((prev)=>{return{...prev, userId: employeeList.find((x) => x.label == localStorage.getItem('userName'))}});
      }
    }
  }, [id, baseUrl,employeeList, attendanceList])


const getSavedList = ()=>{
    axios.get(`${baseUrl}/api/attendanceregister/${id}`).then((resp) => {
        
      let setuserid = employeeList.find((x) => x.value == resp.data?.showattendance?.user_id);
      let setAttendanceType = attendanceList.find((x) => x.value == resp.data?.showattendance?.attendance_type_id);

      setInput({
        userId: setuserid,
        attendanceType: setAttendanceType,
        fromDate: resp.data.showattendance?.from_date,
        toDate: resp.data.showattendance?.to_date,
        startTime: resp.data.showattendance?.start_time ? resp.data.showattendance.start_time : '',
        reason: resp.data.showattendance?.reason ? resp.data.showattendance?.reason : '',              
      })

getAttendanceFiles(resp.data.attendanceFiles, 1);
})
}



//get the submittd file list
//here mode == 1  ---> file action happend for not submitted file. ie., locally added file have to be delete
//here mode == 0  ---> file action happend for submitted file. ie., no file is added locally added 

const getAttendanceFiles = (fileList, mode = 0) =>{

      let PreviweList=[];
      fileList.forEach((item)=>{
        let fileTypeRow = item.filetype? item.filetype: item.filetype === "" ? "application/x-rar-compressed": "";
        let fileNameExt = item.hasfilename.split('.')[item.hasfilename.split('.').length-1];
        let imgfilePath = filePath+item.hasfilename; 
        let fileExt = fileTypeRow.split("/")[1];
        let fileMIME = fileTypeRow.split("/")[0];
        let src = fileMIME === "image"
            ? imgfilePath
            : (fileMIME === "octet-stream" || (fileMIME === 'text' && (fileExt ==='csv' || fileExt ==='plain') && fileNameExt==='csv' ))
              ? ImageConfig["csv"]
              : (fileMIME === "octet-stream" || fileMIME === "application") &&
                (fileExt === "rar" || fileExt === "x-rar-compressed")
                ? ImageConfig["rar"]
                : ImageConfig[fileExt];
      
                PreviweList.push({
            name : item.filename,
            size: item.filesize,
            pic: src,
            rowId : item.id
            });
      
      }) 
      
      //Set fileData For Show preview of files
      if(mode === 1)
      {
      setFileData((prev)=>{
        return{
          ...prev,...PreviweList
        }
      });
    }
    else{
      setFileData({...PreviweList});
    }
  
    }

  useEffect(() => {
    
    const errors = inputValidation;
    if (input.userId === null) {
      errors.userIdErr = true;
    } else {
      errors.userIdErr = false;
    }
    if (input.attendanceType === null) {
      errors.attendanceTypeErr = true;
    } else {
      errors.attendanceTypeErr = false;
    }
    if (input.fromDate === null) {
      errors.fromDateErr = true;
    } else {
      errors.fromDateErr = false;
      errors.fromDateErr = false;
    }
    if (input.toDate === null) {
      errors.toDateErr = true;
    } else {
      errors.toDateErr = false;
      errors.toDateErr = false;
    }
    setInputValidation((prev) => { return { 
      ...prev,
       userIdErr: errors.userIdErr,
       attendanceTypeErr: errors.attendanceTypeErr,
       fromDateErr: errors.fromDateErr,
       toDateErr: errors.toDateErr
       } });

  }, [input])

  useEffect(() => {
    
    if (
      input.userId?.value && 
      input.attendanceType?.value &&
      input.fromDate && 
      input.toDate 
      // &&
      // location.coordinates
      ) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }

  }, [inputValidation,location])

  const postData = (formData) => {
    axios({
      method: 'post',
      url: `${baseUrl}/api/attendanceregister`,
      data: formData,
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) =>{
      if(res.data.status === 200){
        Swal.fire({
          title: "Attendance Details",
          text: "Submitted Successfully...!",
          icon: "success",
          confirmButtonColor: "#2fba5f",
          // timer: 1000,
        });
        // navigate(`/tender/hr/attendanceentry/edit/${res.data.id}`);
        navigate(`/tender/hr/attendanceentry`);
        getFileList();
      }
      else if(res.data.status === 400){
        Swal.fire({
          title: "Attendance Details",
          text: res.data.message,
          icon: "error",
          confirmButtonColor: "#2fba5f",
          // timer: 1000,
        });
      }
      else{
        Swal.fire({
          title: "Attendance Details",
          text: "Failed to Submit",
          icon: "error",
          confirmButtonColor: "#2fba5f",
          // timer: 1000,
        });
      }
      setDataSending(false)
    })

  }

  const putData = (data, id) => {

     axios({
      method: 'post',
      url: `${baseUrl}/api/attendanceregister/${id}`,
      data: data,
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) =>{
    // axios.put(`${baseUrl}/api/attendanceregister/${id}`, data).then((res) => {
      if (res.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Attendance",
          text: "Status Updated Successfully!",
          confirmButtonColor: "#5156ed",
        });
        getFileList();
        // setInput(initialState)
        navigate('/tender/hr/attendanceentry')
      } else if (res.data.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Attendance",
          text: res.data.message,
          confirmButtonColor: "#5156ed",
        });
       
      }
      else{
        Swal.fire({
          icon: "error",
          title: "Attendance",
          text: "Unable to Update Record Now..!",
          confirmButtonColor: "#5156ed",
        });
      }
      setDataSending(false)
    });
  }

  const getFileList = () =>{
    
    let senddata = {
      "id": id,
      "tokenid": localStorage.getItem('token')
    }
    axios.post(`${baseUrl}/api/attendanceregister/fileList`, senddata).then((resp)=>{
      getAttendanceFiles(resp.data.attendanceFiles);
    }) 
  }

  
  const submitHandler = (e) => {
    e.preventDefault();
    setDataSending(true)
  
    if(location?.error?.code)
    {
      Swal.fire({
        title: "Geo Location Access Denied..!",
        text: "Allow to to get Geo Location...!",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      });
      setDataSending(false)
      return;
    }
      

    if(!formIsValid){
           setDataSending(false)
           return     
        }
      else{
        if(input.fromDate > input.toDate)
        {
          Swal.fire({
            title: "Date Range Error",
            text: "Check the selected Date Range...!",
            icon: "error",
            confirmButtonColor: "#2fba5f",
          });
          setDataSending(false)
          return;
        }
  
      }

    const formData = new FormData();
    formData.append('user_id', input.userId?.value); 
    formData.append('attendance_type_id',input.attendanceType?.value);  
    formData.append('from_date',input.fromDate);  
    formData.append('to_date',input.toDate);  
    formData.append('reason',input.reason);  
    formData.append('start_time',input.startTime);  
    formData.append('latitude', location.coordinates?.lat);
    formData.append('longitude', location.coordinates?.lng);
    // formData.append('file',file);      
    formData.append('tokenid',localStorage.getItem('token')); 
    // console.log("localStorage.getItem('token')",localStorage.getItem('token'))
    Object.values(files).forEach((item)=>{
      formData.append("file[]", item);
    })
    
    

    if(id)
    {
      formData.append('_method',"PUT"); 
    }

          

    if (!id) {
      postData(formData);
    } else {
      putData(formData, id);
    }

  };

  const inputHandlerForSelect = (value, action) => {
    setInput((prev) => { return { ...prev, [action.name]: value } });
   // setIsClicked((prev) => { return { ...prev, [action.name]: true } });
  }

  let fileCount = 1;



  useEffect(()=>{
        let PreviweList = [];      
      Object.values(files).forEach((item)=>{
        
        const fileType = item.type
        ? item.type
        : item.type === ""
          ? "application/x-rar-compressed"
          : "";
  
      if (docType.includes(fileType)) {
        
      //to skip text file. MIME type of text file and csv file are same. so we get the extension of a file to stop uploading .txt file
        if((fileType == "text/plain" && item.name.split('.').length[item.name.split('.').length]-1) =='txt')
      {
        
        Swal.fire({
          title: "File Type",
          text: "Invalid File Type..!",
          icon: "error",
          confirmButtonColor: "#2fba5f",
        });
      }
      else{
      
        // if (docType.includes(fileType)) {
        if (accFileStorage + item?.size <= totalStorageSize) {
          const Files = item;
          const FilesValue =item;
          const fileName = Files.name;
          const fileSize = (Files.size.toString().length > 6 ? (Files.size / 1e+6).toString().slice(0, -5) + ' MB' : (Files.size / 1000).toString().slice(0, -1) + ' KB');
  
          //Set fileData For Show preview of files
    let fileTypeRow = item.type? item.type: item.type === "" ? "application/x-rar-compressed": "";
    let urlRow = URL.createObjectURL(item); //
    let fileExt = fileTypeRow.split("/")[1];
    let fileMIME = fileTypeRow.split("/")[0];
    let src = fileMIME === "image"
        ? urlRow
        : fileMIME === "octet-stream" && fileExt === "csv"
          ? ImageConfig["csv"]
          : (fileMIME === "octet-stream" || fileMIME === "application") &&
            (fileExt === "rar" || fileExt === "x-rar-compressed")
            ? ImageConfig["rar"]
            : ImageConfig[fileExt];
  
            PreviweList.push({
        name : item.name,
        size: item.size,
        pic: src,
        rowId : ''
        });
  
        // accFileStorage
          setAccFileStorage((prev)=> {return prev + item.size});
          // setFileCheck(true);
            }
         else {
          Swal.fire({
            title: "File Storage",
            text: "Storage size Overflow..",
            icon: "error",
            confirmButtonColor: "#2fba5f",
          });
        }
      } }else {
        
        Swal.fire({
          title: "File Type",
          text: "Invalid File Type..!",
          icon: "error",
          confirmButtonColor: "#2fba5f",
        });
      }
      })
      if(Object.keys(fileData).length > 0)
      {
          Object.values(fileData).forEach((obj)=>{
            PreviweList.push(obj);
          })
      }
      //Eliminate File Duplication 
      const uniqueArray = PreviweList.filter((obj, index, self) =>
      index === self.findIndex((o) => o.size === obj.size && o.name === obj.name));
      setFileData({...uniqueArray});
  
  },[files])

  
  const handleFile = (e) => {
    let filelist = Object.values(e.target.files).map((fileQ)=>{
      return fileQ;
    })
   setFiles((prev)=>{return{...prev, ...filelist}});    
  };

  const objectData = {
    name: file.name,
    size: file.size,
    pic: file.src,
  };

  //for Preview purpose only
  const addfiles = () => {
    let updated = [...fileData];
    updated.push(objectData);
    setFileData(updated);
    setFileListCheck(true);
    setFileSizeLimit({ ...fileSizeLimit, error: '' })
  };

  const handleFileAdd = (e) => {
    e.preventDefault();
    addfiles();
    // uploadFiles();      
    setFileCheck(false);
  };

  const removePreview = (e) => {
    e.preventDefault();
    setFileCheck(false);
    setFile({ ...file, value: '' })
    setFileSizeLimit('');
  };

  const downloadDoc = (fileid, filename) => {
    if(fileid!="")
    {
    let sendData={
      "id" : fileid,
      "fileName": filename
    }
    axios({
      url: `${baseUrl}/api/attendance/docdownload`,
      data: sendData,
      method: "POST",
      responseType: "blob", // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${filename}`);
      document.body.appendChild(link);
      link.click();
    });
  }
  else{

    let blobFile = Object.values(files).find((x)=> x.name == filename);
    const url = window.URL.createObjectURL(new Blob([blobFile]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${filename}`);
      document.body.appendChild(link);
      link.click();
  }
  };

  const DeleteDoc = (fileid, filename) => {
    
    if(fileid==="")
    {

      //files has newly added files alone not stored/submitted files
      const fileArray = Object.values(files);

      const filteredFiles = fileArray.filter((x) => x.name != filename);
      
      setFiles(filteredFiles);


      //fileData has both newly added and stored/submitted files 
      //fileData used to display the list of files
      const fileArray1 = Object.values(fileData);
      const filteredFiles1 = fileArray1.filter((x) => x.name != filename);

      setFileData({...filteredFiles1}); 
    }
    else{    
    axios.delete(`${baseUrl}/api/destroyfile/${fileid}`).then((res) => {
      if (res.data.status === 200) {
        Swal.fire({
          title: "File",
          text: "Removed Successfully..",
          icon: "success",
          confirmButtonColor: "#2fba5f",
        });
        // getSavedList(); 
        //here parameter '0' indicates the function that, file removed from server and have to update the list
        // getFileList(0);
      
        const fileArray2 = Object.values(fileData);
        const filteredFiles2 = fileArray2.filter((x) => (x.name != filename && x.rowId != fileid));
        setFileData({...filteredFiles2}); 

      } else {
        Swal.fire({
          title: "File",
          text: res.data.message,
          icon: "error",
          confirmButtonColor: "#2fba5f",
        });
      }
    });
  }
  };

  const inputChangeHandler = (e) => {
    // console.log("e.target.value ", e.target.value==='' );
    // console.log("e.target.value ", e.target.value===null);
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  
  // console.log('input',input)
  return (
    <Fragment>
      <div className="AttendanceEntry">
        <div className="card shadow p-4 mb-4">
          <form onSubmit={submitHandler}>
            <div className="row">
              <div className="col-lg-6">
                <div className="row align-items-center mb-3">
                  <div className="col-lg-3">
                    <label>Employee Name <span className="text-danger h6">*</span></label>
                  </div>
                  <div className="col-lg-9">
                    <Select
                      name="userId"
                      id="userId"
                      isSearchable="true"
                      isClearable="true"
                      options={employeeList}
                      value={input.userId}
                      onChange={inputHandlerForSelect}
                    ></Select>
                    {inputValidation.userIdErr && (
                      <div className="pt-1">
                        <span className="text-danger font-weight-bold">
                          Select Employee
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="row align-items-center mb-3">
                  <div className="col-lg-3">
                    <label>From Date<span className="text-danger h6">*</span></label>
                  </div>
                  <div className="col-lg-9">
                    <input type="date" className="form-control" name='fromDate'  value={input.fromDate} 
                    onChange={(e) => inputChangeHandler(e)}
                    // onChange={inputHandler}
                     />
                    {inputValidation.fromDateErr && (
                      <div className="pt-1">
                        <span className="text-danger font-weight-bold">
                          Select From Date
                        </span>
                      </div>
                    )}
                  </div>
                  
                </div>
                <div className="row align-items-center mb-3">
                  <div className="col-lg-3">
                    <label htmlFor="startTime">Start Time</label>
                  </div>
                  <div className="col-lg-9">
                    <input type="time" id="startTime" name="startTime" className="form-control" value={input.startTime} onChange={inputChangeHandler}/>                   
                  </div>
                </div>
                <div className="row align-items-center mb-3">
                  <div className="col-lg-3 text-dark">
                    <label htmlFor="document" className="font-weight-bold">
                      Document
                    </label>
                  </div>
                  <div className="col-lg-9">
                    <div
                      className={`document border-primary d-flex flex-column align-items-center justify-content-center   bg-gray-200 ${styles.height_of_dropbox} ${styles.boderradius__dropbox} ${styles.dashed} ${styles.drop_file_input} `}
                    >
                      <p className="display-4 mb-0">
                        <i className="fas fa-cloud-upload-alt text-primary "></i>
                      </p>
                      <p>Drag & Drop an document or Click</p>
                      <input
                        type="file"
                        value={file.value}
                        name="image"
                        id="image"
                        className="h-100 w-100 position-absolute top-50 start-50 pointer"
                        // accept={`image/*`}
                        accept=".png, .jpg, .jpeg, .pdf, .zip, .rar, .doc, .docx, .xls, .xlsx, .csv"
                        onChange={(e) => handleFile(e)}
                        multiple
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row align-items-center mb-3">
                  <div className="col-lg-3">
                    <label>Attendance Type <span className="text-danger h6">*</span>  </label>
                  </div>
                  <div className="col-lg-9">
                    <Select
                      name="attendanceType"
                      id="attendanceType"
                      isSearchable="true"
                      isClearable="true"
                      options={attendanceList}
                      value={input.attendanceType}
                      onChange={inputHandlerForSelect}
                    ></Select>
                  {inputValidation.attendanceTypeErr && (
                      <div className="pt-1">
                        <span className="text-danger font-weight-bold">
                          Select Attendance Type 
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="row align-items-center mb-3">
                  <div className="col-lg-3">
                    <label>To Date<span className="text-danger h6">*</span></label>
                  </div>
                  <div className="col-lg-9">
                    <input type="date" className="form-control" name='toDate' value={input.toDate} 
                    onChange={(e) => inputChangeHandler(e)}
                    // onChange={inputHandler}
                     />
                    {inputValidation.toDateErr && (
                      <div className="pt-1">
                        <span className="text-danger font-weight-bold">
                          Select To Date
                        </span>
                      </div>
                    )}
                  
                  </div>
                  
                
                </div>
                <div className="row align-items-center mb-3">
                  <div className="col-lg-3">
                    <label>Reason </label>
                  </div>
                  <div className="col-lg-9">
                    <textarea cols={50} rows={2} className="form-control" name='reason' value={input.reason} onChange={(e) => inputChangeHandler(e)} />
                  </div>
                </div>
                {/* {fileCheck ?
                  <div className="row align-items-center mb-3">
                    <div className="col-lg-3">
                      <label className="font-weight-bold">Preview</label>
                    </div>
                    <div className="col-lg-9">
                      <>
                        <div className="upload_Documents">
                          <div className="card  my-4">
                            <div className="card-body">
                              <div className="UploadingDetails">
                                <div>
                                  <h6> Name : </h6> <span>{file.name}</span>
                                </div>
                                <div>
                                  <h6> Size : </h6> <span>{file.size}</span>
                                </div>
                              </div>
                              <div className="UploadImg">
                                <img
                                  src={file.src}
                                  onClick={() =>
                                    window.open(file.src, "_blank")
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="btns">
                            <button
                              className="btn btn-info mr-2"
                              onClick={(e) => {
                                handleFileAdd(e);
                                // setFileUploading(true);
                              }}
                            >
                              {fileuploading ? "Adding..." : "Add"}
                            </button>
                            <button
                              className="btn btn-dark"
                              onClick={(e) => removePreview(e)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </>
                    </div>
                  </div> : fileSizeLimit.error
                } */}
              </div>
            </div>

            <div className="row align-items-center mb-4">
              <div className="col-lg-12">
               
                  <h6 className="listOfupload">
                    List of Uploaded documents
                  </h6>
               
              </div>
              <div className="col-lg-12">
                {/* {fileListCheck && ( */}
                  <div className="file_Documents">
                    
                    {Object.keys(fileData).length > 0 && (
                    Object.values(fileData).map((t, i) => (
                  
                      <div className="card" key={i}>
                        <div className="card-body">
                          <div className="noOfFiles">{fileCount++}</div>
                          <div className="fileDetails">
                            <div className="pic">
                              <img src={t.pic} alt="" />
                            </div>
                            <div className="text">
                              <div>
                                <h6>Name: </h6>
                                <p>{t.name} &nbsp;&nbsp; {!t.rowId && <i className="fa fa-info-circle text-warning" aria-hidden="true" title="File not Stored"></i>}</p>
                              </div>
                              <div>
                                <h6>Size: </h6>
                                <p>{(Math.round((t.size/1024) * 100) / 100).toFixed(2)} KB</p>
                              </div>
                            </div>
                          </div>
                          <div className="fileAction">
                            <div className="download" onClick={() => downloadDoc(t.rowId, t.name)}>
                              <FaDownload/>
                            </div>

                            <div className="delete" onClick={() => DeleteDoc(t.rowId, t.name)}> 
                              <RiDeleteBin5Fill/>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                    )}
                  </div>
                {/* )} */}
              </div>
            </div>
            <div className="row text-center">
              <div className="col-12">
                {id ? (
                  <button className="btn btn-primary" disabled={dataSending || !formIsValid} > {dataSending ? "Updating..." : "Update"}</button>
                ) : (
                  <button className="btn btn-primary" disabled={dataSending || !formIsValid}> {dataSending ? "Submitting..." : "Submit"}</button>
                )}
              </div>
            </div>
          </form>

          {location.loaded
                                    ? JSON.stringify(location)
                                    : "Location data not available yet."}   
                          
                          
        </div>
      </div>
    </Fragment>
  )
}

export default AttendanceEntry;



