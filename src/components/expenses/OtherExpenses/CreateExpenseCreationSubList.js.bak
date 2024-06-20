import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { FaDownload } from "react-icons/fa";
import styles from "../../master/UserCreation/UserCreation.module.css";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useAllowedMIMEDocType } from "../../hooks/useAllowedMIMEDocType";
import { ImageConfig } from "../../hooks/Config";
import { useImageStoragePath } from "../../hooks/useImageStoragePath";
import { useAllowedUploadFileSize } from "../../hooks/useAllowedUploadFileSize";
import { generatePath, useNavigate, useParams } from 'react-router-dom';

const selectState = {
  customerName: "",
  callNo: "",
  expenseType: "",
  amount: "",
  description: "",
  need_call_against_expense: '',
};

const imageGet ={
  originalfilename:'',
  filesize:'',
  pic:'',
  imageId:''
}
const selectFile = {
  name: "",
  size: "",
  type: "",
  value: "",
  src: undefined,
};

const CreateExpenseCreationSubList = ({
  setTable,
  editData,
  currentRow,
  pass,
  input,
  img,
  editCheck,
  setEditCheck,
  invc,
  getSubdata,
  EditId,
  setEditId,
  Bdm,
  getCurrentDate
}) => {
  const navigate = useNavigate();
  const [checkImage,setCheckImage]=useState(false)
  const [image, setImage] = useState(imageGet);
  const [inputSub, setInputSub] = useState(selectState);
  const [file, setFile] = useState(selectFile);
  const [eTargFiles, setETargFiles] = useState(null);
  const [fileCheck, setFileCheck] = useState(null);
  const [btnCheck, setBtnCheck] = useState(false);
  const [optionsForCustomers, setOptionsForCustomers] = useState([]);
  const [optionsForExpense, setOptionsForExpense] = useState([]);
  const [checkBox, setCheckBox] = useState(false);
  const [check, setCheck] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [triggerTable, setTriggerTable] = useState(false);
  const [CallIdOptions, setCallIdOptions] = useState([]);
  const { MIMEtype: docType } = useAllowedMIMEDocType();
  const { server1: baseUrl } = useBaseUrl();
  const { expense: filePath } = useImageStoragePath();
  const[updateId , setUpdate]=useState();
  const[expType , setexpType]=useState();
  const [Lmitamt, setLmitAmt] = useState('');
  const [LimitExeed, setLimitExeed] = useState(false);
  const [removestatus, setRemove] = useState(0);
  const [accFileStorage, setAccFileStorage] = useState(0);
const { total: totalStorageSize } = useAllowedUploadFileSize();
const [fileData, setFileData] = useState([]);
const [fileSizeLimit, setFileSizeLimit]= useState({error: ''});


  useEffect(() => {
    
    if (EditId) {
      setFile(selectFile);
      setFileCheck(false);
      let data = {
        eidtId: EditId,
      }
  
      setEditCheck(true);
      axios.post(`${baseUrl}/api/editsub`, data).then((res) => {
       
        let fetcheddata = res.data.subdata;
       
        if (fetcheddata?.need_call_against_expense == 1) {
          setCheck(true);
        } else {
          setCheck(false);
        }
        setUpdate(fetcheddata.id);

        setInputSub((prev) => {
          return {
            ...prev,
            amount: fetcheddata?.amount,
            description: fetcheddata?.description_sub,
            expenseType: optionsForExpense.find((x) => x.value === fetcheddata.expense_type_id),
            need_call_against_expense: fetcheddata?.need_call_against_expense,
            customerName: optionsForCustomers.find((x) => x.value == fetcheddata.customer_id),
            callNo: CallIdOptions.find((x) => x.value == fetcheddata.call_no),
         
          };
        });
            let fileExt =fetcheddata.filetype.split("/")[fetcheddata.filetype.split("/").length - 1];
        let fileMIME = fetcheddata.filetype.split("/")[0];
     

       let imageIs= fetcheddata.hasfilename;
       if(fileMIME){
         setCheckImage(true);
       }else{
         setCheckImage(false);
       }
       
        setImage((prev) => {
          return {
            ...prev,
            originalfilename: fetcheddata?.originalfilename,
            filesize: fetcheddata?.filesize,
            imageId:fetcheddata?.id,
            pic:fileMIME === "image"
                  ? filePath+""+fetcheddata.hasfilename
                  : fileMIME === "octet-stream" && fileExt === "csv"
                  ? ImageConfig["csv"]
                  : fileMIME === "octet-stream" && fileExt === "rar"
                  ? ImageConfig["rar"]
                  : (fetcheddata.filetype ==="text/plain" && fetcheddata.originalfilename.split(".")[fetcheddata.originalfilename.split(".").length - 1] ==="csv") ? ImageConfig["csv"]
                  :ImageConfig[fileExt],
          };
        });
        
          //  setTimeout(() => {
          //   setInputSub((prev) => {
          //     return {
          //       ...prev,
          //       callNo: CallIdOptions.find((x) => x.value == fetcheddata.call_no),
             
          //     };
          //   });
          //   }, 3000);
      
      });
    }
  }, [EditId]);
  
  useEffect(() => {

   
   
    axios.post(`${baseUrl}/api/otherExpcustomer/list`).then((res) => {
      if (res.status === 200) {
        setOptionsForCustomers(res.data.customerList);
      }
    });

    axios.get(`${baseUrl}/api/expensetype/list`).then((res) => {
      if (res.status === 200) {
        setOptionsForExpense(res.data.expenselist);
      }
    });
  }, []);

  useEffect(() => {
    if (check) {
      setCheckBox(true);
    } else {
      setCheckBox(false);
      setInputSub({ ...inputSub, customerName: null, callNo: null });
    }
  }, [check]);

  useEffect(() => {
    if (fileCheck === true) {
      setBtnCheck(true);
    }
  }, [file]); // this hook will render when file change

  useEffect(() => {
    if (checkBox == true) {
    if (
      inputSub.expenseType !== null &&
      inputSub.amount !== ""&& inputSub?.customerName?.value!='' &&
      inputSub?.callNo?.value
    ) {

      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }else{

    
    if (
      inputSub.expenseType !== null &&
      inputSub.amount !== ""
      
    ) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }


  }

    setTriggerTable(false);
  }, [inputSub]); // this hook will render when inputSub change

  useEffect(() => {
    if (inputSub.customerName) {

      let data = {
        tokenid: localStorage.getItem("token"),
        id: inputSub.customerName?.value,
      };
     
      axios.post(`${baseUrl}/api/callnumber`, data).then((res) => {
        if (res.data.status === 200) {
         

          setCallIdOptions(res.data.CallList);
        } else {
          Swal.fire({
            // error msg
            icon: "error",
            text: "Customer Had No calls",
            showConfirmButton: true,
          });
        }
      });
    }
  }, [inputSub.customerName]); // this hook will render when inputSub change $$

  useEffect(() => {
   

    if (pass) {
      // setInputSub({...inputSub, need_call_against_expense:editData.need_call_against_expense, expenseType: editData.expenseType, amount: editData.amount, description:editData.description});
      setInputSub((prev) => {
        return {
          ...prev,
          need_call_against_expense: currentRow.need_call_against_expense,
          expenseType: optionsForExpense.find(x => x.value === currentRow.expense_type_id),
          amount: currentRow.amount,
          description: currentRow.description_sub,
          mainid: currentRow.mainid,
          customerName: optionsForCustomers.find(x => x.value == currentRow.customer_id),
          // callNo: CallIdOptions.find(x => x.value == currentRow.call_no) 
        };
      });
      currentRow.need_call_against_expense == 1 ? setCheckBox(true) : setCheckBox(false);

      // setInputSub((prev) => {
      //   return {
      //     ...prev,
      //     customerName: optionsForCustomers.find(
      //       (x) => x.value == currentRow.expense_type_id
      //     ),
      //   };
      // });
      // setInputSub((prev) => {
      //   return {
      //     ...prev,
      //     callNo: CallIdOptions.find((x) => x.value == currentRow.call_no),
      //   };
      // });
    }
  }, [currentRow]); // Current Row state gets true this hook will render *** this state comes from props

  

  useEffect(() => {
    
   
    if (currentRow.customer_id && CallIdOptions.length > 0) {
      setInputSub((prev) => {
        return {
          ...prev,
          callNo: CallIdOptions.find(x => x.value == currentRow.call_no),
        };
      });
    }
  }, [currentRow.customer_id, CallIdOptions])


  useEffect(() => {
   
    //     axios.get(`${baseUrl}/api/otherexpensesub`).then((res)=>{
    //       if(res.status === 200) {
    //         let filelist = [];
    //         for(let key in res.data.otherexpensesub){

    //     let fileExt =res.data.otherexpensesub[key].filetype.split("/")[res.data.otherexpensesub[key].filetype.split("/").length - 1];
    //     let fileMIME = res.data.otherexpensesub[key].filetype.split("/")[0];

    //     let fileobject = {
    //             id: res.data.otherexpensesub[key].id,
    //             mainid: res.data.otherexpensesub[key].mainid,
    //             need_call_against_expense:res.data.otherexpensesub[key].mainid,
    //             customer_id: res.data.otherexpensesub[key].customer_id,
    //             call_no: res.data.otherexpensesub[key].call_no,
    //             expense_type_id: res.data.otherexpensesub[key].expense_type_id,
    //             filetype: res.data.otherexpensesub[key].filetype,
    //             amount : res.data.otherexpensesub[key].amount,
    //             description_sub: res.data.otherexpensesub[key].description_sub,
    //             expenseType: res.data.otherexpensesub[key].expenseType,
    //             // oesid: res.data.otherexpensesub[key].oesid,
    //             etid: res.data.otherexpensesub[key].etid,
    //             hasfilename: res.data.otherexpensesub[key].hasfilename,
    //             originalfilename: res.data.otherexpensesub[key].originalfilename,
    //             name: res.data.otherexpensesub[key].originalfilename,
    //             filesize: res.data.otherexpensesub[key].filesize,
    //             pic: fileMIME === "image"
    //               ? filePath+""+res.data.otherexpensesub[key].hasfilename
    //               : fileMIME === "octet-stream" && fileExt === "csv"
    //               ? ImageConfig["csv"]
    //               : fileMIME === "octet-stream" && fileExt === "rar"
    //               ? ImageConfig["rar"]
    //               : (res.data.otherexpensesub[key].filetype ==="text/plain" && res.data.otherexpensesub[key].originalfilename.split(".")[res.data.otherexpensesub[key].originalfilename.split(".").length - 1] ==="csv") ? ImageConfig["csv"]
    //               :ImageConfig[fileExt],
    //           };
    //           filelist.push(fileobject);
    //       }
    
    //           setTable(filelist);
    //       }
    //     })

    if (triggerTable === true) {
      setInputSub({
        ...inputSub,
        expenseType: null,
        amount: "",
        description: "",
      });
      setFileCheck(false);
      setBtnCheck(false);
    }
  }, [triggerTable]); // triggerTable state gets true this hook will render *** initially works in handleSubmit

  const handleCheck = () => {
   
    setCheck(!check);
  };

  const inputHandlerForText = (e) => {



    setInputSub({ ...inputSub, [e.target.name]: e.target.value });
  };

  const inputHandlerForAmount = (e) => {
    // only allow numbers in the input field
    const regex = /^[0-9\b]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setInputSub({ ...inputSub, [e.target.name]: e.target.value });
    }


  };

  const inputHandlerForSelect = (value, action) => {


setexpType(value.value)
    setInputSub({ ...inputSub, [action.name]: value });

  };
  useEffect(() => {
    
    let data = {
      userType: Bdm,
      expenseType:inputSub.expenseType?.value ?? "",
    };

    axios.post(`${baseUrl}/api/getlimit`, data).then((res) => {
      if (res.data.status === 200) {
       let lmits=res.data;

if(lmits.lmitsatatus===0){
  setLmitAmt(lmits.lmitamt);
  setLimitExeed(false);
}else{
  setLmitAmt('');
  setLimitExeed(false);
}

      } 
    });
  }, [inputSub.expenseType?.value,Bdm])


  useEffect(() => {
   
   
    if(Lmitamt){

      if(inputSub.amount > Lmitamt){

        setLimitExeed(true);
      }else{
        setLimitExeed(false);
      }

    }else{
      setLimitExeed(false);
    }
 
  }, [inputSub.amount,Lmitamt])

  

  const inputHandlerForFile = (e) => {
    if(updateId){
      setImage({ ...file, value: "" });
    }
    
    if(checkImage===true){
      handleRemoveDoc();
    }
    const Files = e.target.files[0];
    const FilesValue = e.target.value;
    const fileName = Files.name;
    const fileType = Files.type;
    const fileSize = Files.size + " KB";
    const url = URL.createObjectURL(Files);
    setETargFiles(Files);

    if (docType.includes(e.target.files[0].type)) {
      setFile({
        ...file,
        name: fileName,
        size: fileSize,
        value: FilesValue,
        type: fileType,
        src:
          fileType.split("/")[0] === "image"
            ? url
            : ImageConfig[fileType.split("/")[1]],
      });
    }
    setRemove(0);
    setFileCheck(true);
  };

  const handleRemoveDoc = () => {
    setFile({ ...file, value: "" });
    setFileCheck(false);
    setBtnCheck(false);
    setEditCheck(false);
    setFileCheck(false);
    setCheckImage(false);
    setRemove(1);
  };
  let ck = '';

  let lin='';
  let msg='';
  const handleSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData();

    if (checkBox == true) {
      ck = 1;
    } else {

      ck = 0;
    }

    let data = {
      executive_id: input.staff.value,
      entry_date: input.entryDate,
      description: input.description,
      customer_id: inputSub?.customerName?.value  ?? "",

      call_no:inputSub?.callNo?.value  ?? "",
      expense_type_id: inputSub.expenseType?.value ?? "",
      amount: inputSub.amount,
      description_sub: inputSub.description,
      file: image.originalfilename ? image.originalfilename : file.name,
      need_call_against_expense: ck,
      invc: invc,
      removestatus:removestatus,
      update_id:updateId,
      tokenid: localStorage.getItem("token"),
    };

    if (eTargFiles instanceof Blob) {
      data.file = new File([eTargFiles], file.name);
      
    }
    for (var key in data) {
      formdata.append(key, data[key]);
    }
    if (currentRow.oesid) {
      putData(formdata);
    } else {
      postData(formdata);
      
    }
    setTriggerTable(true);
  };
  if(updateId==''||updateId==null){
     lin='expensestore';
     
  }else{

     lin='subupdate';
  }
  const postData = async (data) => {
  
    await axios.post(`${baseUrl}/api/`+lin, data).then((res) => {
      if (res.data.status === 200) {
        // Swal.fire({
        //   icon: "success",
        //   title: "New SubExpense",
        //   text: "Created Successfully!",
        //   confirmButtonColor: "#5156ed",
        // });
        // setInputSub(selectState);
       if(lin==='expensestore'){
        navigate(`/tender/expenses/otherExpense/edit/`+res.data.Mainid);
       }
        setUpdate('')
getSubdata(invc);
setCheck(false);
setEditCheck(false);
setEditId('');
setFile(selectFile); 
setImage(imageGet);          
setCheckImage(false); 
      } else if (res.data.status === 400) {
        Swal.fire({
          icon: "error",
          title: "New SubExpense",
          text: 'Something Went Worng',
          confirmButtonColor: "#5156ed",
        });
      }
    });
   
  };

  const putData = (data) => {
    axios({
      url: `${baseUrl}/api/otherexpensesub/${currentRow.oesid}`,
      data: data,
      method: "put",
    }).then((res) => {
      if (res.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "New SubExpense",
          text: "Updated Successfully!",
          confirmButtonColor: "#5156ed",
        });
      } else if (res.data.status === 400) {
        Swal.fire({
          icon: "error",
          title: "New SubExpense",
          text: res.data.message,
          confirmButtonColor: "#5156ed",
        });
      }
    });
    
  };

  const optionsForCustomer = [
    { value: 1, label: "Abc" },
    { value: 2, label: "def" },
  ];



  const downloadDoc = async (filename) => {
  
    if(image?.imageId)
    {
      let sendData = {
        "fileName" : filename,
        "id" : updateId
      }
      await axios({
        url: `${baseUrl}/api/expense/downloadfile`,
        method: "POST",
        responseType: "blob", // important
        data: sendData,
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
      const url = window.URL.createObjectURL(new Blob([eTargFiles]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${filename}`);
      document.body.appendChild(link);
      link.click();
    }
    
  };

  return (
    <div className="CreateExpenseCreationSubList">
      <form onSubmit={handleSubmit}>
        <div className="row d-flex justify-content-between">
          <div className="col-sm-12 row d-flex align-items-center mb-4">
            <div className="col-lg-5">
            {Bdm === 2 ? (
    <input
      type="checkbox"
      id="checkBox"
      name="check"
      value={
        inputSub.need_call_against_expense === 1
          ? inputSub.need_call_against_expense
          : 0
      }
      className="mr-3"
      checked={checkBox}
      onChange={handleCheck}
    />
   
  ) : null}
   {Bdm === 2 ? (
   <label htmlFor="checkBox">Need Call Against Expense </label>
   ) : null}
            </div>
          </div>
          {checkBox && (
            <div className="col-sm-6 row d-flex align-items-center mb-4">
              <div className="col-lg-3 text-dark font-weight-bold">
                <label>Customer Name <span className="text-danger font-weight-bold">*</span></label>
              </div>
              <div className="col-lg-9">
                <Select
                  name="customerName"
                  id="cusName"
                  isSearchable="true"
                  isClearable="true"
                  options={optionsForCustomers}
                  value={ inputSub?.customerName}
                  onChange={inputHandlerForSelect}
                // onChange={(inputSub.customerName) => {inputHandlerForSelect(inputSub.customerName,"")}}
                ></Select>
              </div>
            </div>
          )}
          {checkBox && (
            <div className="col-sm-6 row  align-items-center mb-4">
              <div className="col-lg-3 text-dark font-weight-bold">
                <label>Call No <span className="text-danger font-weight-bold">*</span></label>
              </div>
              <div className="col-lg-9">
                <Select
                  name="callNo"
                  id="callNo"
                  isSearchable="true"
                  isClearable="true"
                  options={CallIdOptions}
                  value={inputSub?.callNo}
                  onChange={inputHandlerForSelect}
                ></Select>
              </div>
            </div>
          )}
          <div className="col-sm-6 row d-flex align-items-center mb-4">
            <div className="col-lg-3 text-dark font-weight-bold">
              <label>Expense Type <span className="text-danger font-weight-bold">*</span></label>
            </div>
            <div className="col-lg-9">
              <Select
                name="expenseType"
                id="expenseType"
                isSearchable="true"
                isClearable="true"
                options={optionsForExpense}
                value={inputSub?.expenseType}
                onChange={inputHandlerForSelect}
              ></Select>
            </div>
          </div>
          <div className="col-sm-6 row  align-items-center mb-4">
            <div className="col-lg-3 text-dark font-weight-bold">
              <label>Amount <span className="text-danger font-weight-bold">*</span></label>
            </div>
            <div className="col-lg-9">
              <input
                type="text"
                name="amount"
                value={inputSub.amount}
                onChange={(e) => inputHandlerForAmount(e)}
                className="form-control"
              />
            </div>
            {LimitExeed ? (
  <span className='fade' style={{color: "#eb0e0e"}}>Lmit Amount Exeed For This Staff.Lmit Amount is: {Lmitamt}</span>
) : (
  null
)}
          </div>
          <div className="col-sm-6 row d-flex align-items-center mb-4">
            <div className="col-lg-3 text-dark font-weight-bold">
              <label>Description</label>
            </div>
            <div className="col-lg-9">
              <textarea
                type="textarea"
                name="description"
                col="40"
                row="40"
                className="form-control"
                value={inputSub?.description}
                onChange={(e) => inputHandlerForText(e)}
              />
            </div>
          </div>
          <div className="col-sm-6 row d-flex align-items-center mb-4">
            <div className="col-lg-3 text-dark font-weight-bold">
              <label>Document Upload</label>
            </div>
            <div className="col-lg-9">
              <div
                className={`border-primary d-flex flex-column align-items-center justify-content-center   bg-gray-200 ${styles.height_of_dropbox} ${styles.boderradius__dropbox} ${styles.dashed} ${styles.drop_file_input} `}
              >
                <p className="display-4 mb-0">
                  <i className="fas fa-cloud-upload-alt text-primary "></i>
                </p>
                <p>Drag & Drop an document or Click</p>
                <input
                  type="file"
                  value={file.value}
                  name="file"
                  className="h-100 w-100 position-absolute top-50 start-50 pointer"
                  // accept={`image/*`}
                  onChange={(e) => inputHandlerForFile(e)}
                  
                />
              </div>
            </div>
            {/* {fileCheck && (
              <div className="d-flex justify-content-end w-100 pr-3">
                <button className="doc-cancel" onClick={handleRemoveDoc}>
                  Click to Cancel
                </button>
              </div>
            )}
            {checkImage && (
              <div className="d-flex justify-content-end w-100 pr-3">
                <button className="doc-cancel" onClick={handleRemoveDoc}>
                  Click to Cancel
                </button>
              </div>
            )} */}
          </div>
          <div className="col-sm-6 row d-flex align-items-center mb-4 ">
            {fileCheck && (
              <>
                <div className="col-lg-3 text-dark font-weight-bold">
                  <label className="font-weight-bold">Preview</label>
                </div>
                <motion.div
                  className="col-lg-9"
                  initial={{ scale: 0.5, opacity: 0.4 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "tween",
                    stiffness: 10,
                    duration: 0.1,
                    delay: 0.1,
                  }}
                >
                  <>
                    <div className="upload_Documents">
                      <div className="card  my-4">
                        <div className="card-body">
                          {/* <div className="noOfCountsForUpload">{''}</div> */}
                          <div className="UploadingDetails col-lg-6">
                            <div>
                              <h6> Name : </h6> <span>{file.name}</span>
                            </div>
                            <div>
                              <h6> Size : </h6> <span>{file.size}
                                 <FaDownload
                                      onClick={() => downloadDoc(file.name)}
                                      style={{ marginLeft: '10px' }} />  </span>
                            </div>
                          </div>
                          <div className="UploadImg col-lg-6">
                            <img src={file.src} height={50} width={50}/>
                            <i className="fa fa-times" aria-hidden="true"   style={{ color: 'red',cursor: 'pointer' }} onClick={handleRemoveDoc}></i>
                          </div>
                        
                        </div>
                      </div>
                    </div>
                  </>
                </motion.div>
              </>
            )}

            {checkImage && (
              <>
                <div className="col-lg-3 text-dark font-weight-bold">
                  <label className="font-weight-bold">Preview</label>
                </div>
                <motion.div
                  className="col-lg-9"
                  initial={{ scale: 0.5, opacity: 0.4 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "tween",
                    stiffness: 10,
                    duration: 0.1,
                    delay: 0.1,
                  }}
                >
                  <>
                    <div className="upload_Documents">
                      <div className="card  my-4">
                        <div className="card-body">
                          {/* <div className="noOfCountsForUpload">{''}</div> */}
                          <div className="UploadingDetails">
                            <div>
                              <h6> Name : </h6>{" "}
                              <span>{image?.originalfilename}</span>
                            </div>
                            <div>
                              <h6> Size : </h6>{" "}
                              <span>{image?.filesize}
                              <FaDownload
                                       onClick={() => downloadDoc(image?.originalfilename)}
                                       style={{ marginLeft: '10px' }}  /></span>
                            </div>
                          </div>
                          <div className="UploadImg">
                            <img src={image?.pic} height={50} width={50}/>
                            <i className="fa fa-times" aria-hidden="true"  style={{ color: 'red',cursor: 'pointer' }} onClick={handleRemoveDoc}></i>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  </>
                </motion.div>
              </>
            )}
          </div>
          <div className="col-sm-12 row d-flex align-items-center justify-content-center mb-4">
            <button
              className="btn btn-success subList"
              type="submit"
              disabled={isFormValid}
            >
              {editCheck ? "Update" : "ADD"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateExpenseCreationSubList;
