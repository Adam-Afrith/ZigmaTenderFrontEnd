import axios from "axios";
import { Fragment, useEffect, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import Select from "react-select";
import { useBaseUrl } from "../../../hooks/useBaseUrl";
import useInputValidation from "../../../hooks/useInputValidation";
import { projectType as projectTypeOptions, statusOptions, vendorTypeOptions} from "../data";
import SWMProjectStatusSubTable from "./SWMProjectStatusSubTable";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { swmprojectstatusActions } from "../store/SWMProjectStatusSlice";
import { motion } from "framer-motion";
// validations for input value
const isNotNull = (value) => {
  //$$$$$
    // if (value === null) {
    //     return false;
    //   } else if (value === "") {
    //     return false;
    //   }
  //$$$$$
      return true;
}

const initialOptions = {
  options: [],
  isLoading: false,
};



//$$$ const isNotEmpty = (value) => value.trim() !== "";
const isNotEmpty = (value) => true;

let projectstatusList ; 
let projectTypeList;
const CustomerCreationSWMProjectStatus = () => {

    const navigate = useNavigate();
    const [isDatasending, setdatasending] = useState(false);
    const [isEditbtn, setisEditbtn]= useState(false);
    const [projectList,setProjectList] = useState(null)
    const [projectid, setProjectId]=useState(null)
    const {id} = useParams();
    const [toastSuccess, toastError, setCustomerCreationMainID] = useOutletContext()
    const { server1: baseUrl } = useBaseUrl();
    const [projecttypeoptions, setprojecttypeOptions] = useState(initialOptions);
    const [projectstatusoptions,  setprojectstatusoptions] = useState(initialOptions);

    let swmdata = useSelector((state) => state.swmdata.inputData)
    const dispatch = useDispatch();

    const {
        value: vendorValue,
        isValid: vendorIsValid,
        hasError: vendorHasError,
        valueChangeHandler: vendorChangeHandler,
        inputBlurHandler: vendorBlurHandler,
        setInputValue: setvendorValue,
        reset: resetvendor,
      } = useInputValidation(isNotEmpty);

     

      const {
        value: projectstatusValue,
        isValid: projectstatusIsValid,
        hasError: projectstatusHasError,
        valueChangeHandlerForReactSelect: projectstatusChangeHandler,
        inputBlurHandler: projectstatusBlurHandler,
        setInputValue: setprojectstatusValue,
        reset: resetprojectstatus,
      } = useInputValidation(isNotNull);
      
      const {
        value: projectvalueValue,
        isValid: projectvalueIsValid,
        hasError: projectvalueHasError,
        valueChangeHandler: projectvalueChangeHandler,
        inputBlurHandler: projectvalueBlurHandler,
        setInputValue: setprojectvalueValue,
        reset: resetprojectvalue,
      } = useInputValidation(isNotEmpty);
      
      const {
        value: durationdate1Value,
        isValid: durationdate1IsValid,
        hasError: durationdate1HasError,
        valueChangeHandler: durationdate1ChangeHandler,
        inputBlurHandler: durationdate1BlurHandler,
        setInputValue: setdurationdate1Value,
        reset: resetdurationdate1,
      } = useInputValidation(isNotEmpty);
      
      const {
        value: durationdate2Value,
        isValid: durationdate2IsValid,
        hasError: durationdate2HasError,
        valueChangeHandler: durationdate2ChangeHandler,
        inputBlurHandler: durationdate2BlurHandler,
        setInputValue: setdurationdate2Value,
        reset: resetdurationdate2,
      } = useInputValidation(isNotEmpty);



    const {
        value: projectTypeValue,
        isValid: projectTypeIsValid,
        hasError: projectTypeHasError,
        valueChangeHandlerForReactSelect: projectTypeChangeHandler,
        inputBlurHandler: projectTypeBlurHandler,
        setInputValue: setprojectTypeValue,
        reset: resetprojectType,
    } = useInputValidation(isNotNull);

    const {
        value: statusValue,
        isValid: statusIsValid,
        hasError: statusHasError,
        valueChangeHandlerForReactSelect: statusChangeHandler,
        inputBlurHandler: statusBlurHandler,
        setInputValue: setstatusValue,
        reset: resetstatus,
    } = useInputValidation(isNotNull);

    const {
        value: vendorTypeValue,
        isValid: vendorTypeIsValid,
        hasError: vendorTypeHasError,
        valueChangeHandlerForReactSelect: vendorTypeChangeHandler,
        inputBlurHandler: vendorTypeBlurHandler,
        setInputValue: setvendorTypeValue,
        reset: resetvendorType,
    } = useInputValidation(isNotNull);

    const dispatchData = (e) => {
      dispatch(swmprojectstatusActions.storeInput({name : e.target.name, value : e.target.value}));
    }

    const vendorChangeHandler_store = (e) => dispatchData(e);
    const projectvalueChangeHandler_store = (e) => dispatchData(e);
    const durationdate1ChangeHandler_store = (e) => dispatchData(e);
    const durationdate2ChangeHandler_store = (e) => dispatchData(e);

    const projectTypeChangeHandler_store = (selectedOptions) => {
      // if(selectedOptions === null){
      //   dispatch(swmprojectstatusActions.storeInput({name : 'projecttype', value : '0' }));
      //   return; 
      // }
      dispatch(swmprojectstatusActions.storeInput({name : 'projecttype', value : selectedOptions})); 
    }

    const statusChangeHandler_store = (selectedOptions) => {
      // if(selectedOptions === null){
      //   dispatch(swmprojectstatusActions.storeInput({name : 'status', value : '0' }));
      //   return; 
      // }
      dispatch(swmprojectstatusActions.storeInput({name : 'status', value : selectedOptions})); 
    }
  
    const vendorTypeChangeHandler_store = (selectedOptions) => {
      // if(selectedOptions === null){
      //   dispatch(swmprojectstatusActions.storeInput({name : 'vendorType', value : '0' }));
      //   return; 
      // }
      dispatch(swmprojectstatusActions.storeInput({name : 'vendorType', value : selectedOptions})); 
    }

    const projectstatusChangeHandler_store = (selectedOptions) => {
      // if(selectedOptions === null){
      //   dispatch(swmprojectstatusActions.storeInput({name : 'projectstatus', value : '0' }));
      //   return; 
      // }
      dispatch(swmprojectstatusActions.storeInput({name : 'projectstatus', value : selectedOptions})); 
    }

    useEffect(()=> {
      (swmdata?.projecttype)    && setprojectTypeValue(swmdata.projecttype);
      (swmdata?.status)         && setstatusValue(swmdata.status);
      // console.log(swmdata?.vendorType);
      (swmdata?.vendorType)     && setvendorTypeValue(swmdata.vendorType);
      (swmdata?.vendor)         && setvendorValue(swmdata.vendor);
      (swmdata?.projectstatus)  && setprojectstatusValue(swmdata.projectstatus);
      (swmdata?.projectvalue)   && setprojectvalueValue(swmdata.projectvalue);
      (swmdata?.durationdate1)  && setdurationdate1Value(swmdata.durationdate1);
      (swmdata?.durationdate2)  && setdurationdate2Value(swmdata.durationdate2);

      (swmdata?.editbtn)        && setisEditbtn(swmdata.editbtn);
      (swmdata?.projectid)      && setProjectId(swmdata.projectid);
    },[])

    // console.log("vendorValue",vendorValue);
    // console.log("vendorValue",projectstatusValue);
    // console.log("projectvalueValue",projectvalueValue);
    // console.log("durationdate1Value",durationdate1Value);
    // console.log("durationdate2Value",durationdate2Value);
    // console.log("projectTypeValue",projectTypeValue);
    // console.log("statusValue",statusValue);
    // console.log("vendorTypeValue",vendorTypeValue);

    const monthDiff = (d1, d2) => {
      var months;
      var date1 = new Date(d1);
      var date2 = new Date(d2);
      months = (date2.getFullYear() - date1.getFullYear()) * 12;
      months -= date1.getMonth();
      months += date2.getMonth();
      return months <= 0 ? 0 : months;
    }
    
  

    const getsublist =() =>{
      let data ={
        mainid : id,
      }
  
      axios.post(`${baseUrl}/api/customercreationsmwprojectstatus/getlist`, data).then((resp) => {
        let list = [...resp.data.project];
        let listarr = list.map((item, index, arr)=> ({
            ...item,
            duration: monthDiff(item.duration1, item.duration2),
            status_label: (item.status ? (statusOptions.find(o => o.value === item.status.toString()).label):""), 
            vendortype_label: (item.vendortype ? (vendorTypeOptions.find(o => o.value === item.vendortype.toString()).label):""),
            buttons:`<i class="fa fa-edit text-success mx-2 h6" style="cursor:pointer" title="Edit"></i> <i class="fa fa-trash text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>`,
            sl_no : index + 1
          }))
         
          setProjectList(listarr)
        });
      }

      const getProjectType = async () => {
        setprojecttypeOptions((c) => {
          return { ...c, isLoading: true };
        });
        let response = await axios.get(`${baseUrl}/api/projecttype/list/${id}`); 
        projectTypeList = { options: response.data.projectTypeList, isLoading: false }
        setprojecttypeOptions(projectTypeList)
      }

      const getProjectStatus = async () => {
        setprojectstatusoptions((c) => {
          return { ...c, isLoading: true };
        });
        let response = await axios.get(`${baseUrl}/api/projectstatus/list/${id}`);
        projectstatusList = { options: response.data.projectstatusList, isLoading: false }
        setprojectstatusoptions(projectstatusList)
      }

  
      
      useEffect(() => {
          if(id){
           setCustomerCreationMainID(id)
           getsublist()
           getProjectType()
           getProjectStatus()
          }

      }, [])

      const postData = (data) => {
        axios.post(`${baseUrl}/api/customercreationsmwprojectstatus`, data).then((resp) => {
          if (resp.data.status === 200) {
            getsublist()
            toastSuccess(resp.data.message)
            resetform()
            // navigate("/tender/master/customercreation/list/main/contactPerson");
          } else if (resp.data.status === 400) {
            toastError(resp.data.message)
          }else{
            toastError("Something went wrong!")
          }
          setdatasending(false)
         });
      };

      const putData =(data) => {
        axios.put(`${baseUrl}/api/customercreationsmwprojectstatus/${projectid}`, data).then((resp) =>{
          // console.log(resp.data);
          if (resp.data.status === 200) {
            getsublist()
            resetform()
            toastSuccess(resp.data.message)
          }else {
            toastError("Something went wrong!")
          }
          setdatasending(false)
        })
      }

      
      const onEdit =(data) => {
        setisEditbtn(true)
        setProjectId(data.id)
        setvendorValue(data.vendor ? data.vendor : "")
        setprojectstatusValueFunction(data)
        setprojectvalueValue(data.projectvalue ? data.projectvalue : "")
        setdurationdate1Value(data.duration1 ? data.duration1 : "")
        setdurationdate2Value(data.duration2?data.duration2:"")
        setprojectTypeValueFunction(data)
      
        // setprojectTypeValue(projectTypeOptions.find(o => o.value === data.projecttype.toString()))
        //$$$
        setstatusValue(data.status ? (statusOptions.find(o => o.value === data.status.toString())):"")
        setvendorTypeValue(data.vendortype ? vendorTypeOptions.find(o => o.value === data.vendortype.toString()):"")


       
        dispatch(swmprojectstatusActions.storeInput({name : 'vendor', value : data?.vendor ? data.vendor : ""}));
        dispatch(swmprojectstatusActions.storeInput({name : 'projectvalue', value : data?.projectvalue ? data.projectvalue : ""}));
        dispatch(swmprojectstatusActions.storeInput({name : 'durationdate1', value : data?.duration1 ? data.duration1 : ""}));
        dispatch(swmprojectstatusActions.storeInput({name : 'durationdate2', value : data?.duration2 ? data.duration2 : ""}));
        dispatch(swmprojectstatusActions.storeInput({name : 'projectid', value : data?.id}));
        dispatch(swmprojectstatusActions.storeInput({name : 'status', value : data?.status ? (statusOptions.find(o => o.value === data.status.toString())) : ""}));
        dispatch(swmprojectstatusActions.storeInput({
          name : 'vendorType',
          value : data?.vendortype ? vendorTypeOptions.find(o => o.value === data.vendortype.toString()) : ""
        }));
        dispatch(swmprojectstatusActions.storeInput({name : 'editbtn', value : true}));

      }
   
      const setprojectTypeValueFunction = (data) => {
        if(projectTypeList.options.find(o => o.value === data.projecttype)){
          setprojectTypeValue(projectTypeList.options.find(o => o.value === data.projecttype))
          dispatch(swmprojectstatusActions.storeInput({name : 'projecttype', value : projectTypeList.options.find(o => o.value === data.projecttype)}));
        }else{
          // setprojecttypeOptions((prev)=> {
          //   console.log(prev)
          //   return {
          //     ...prev,
          //     options : [...prev.options, 
          //       {
          //           'value' : data.projecttype,
          //           'label' : data.projecttype_label
          //       }
          //     ]
          //   }
          // })
          
          setprojectTypeValue( data.projecttype!==null ? {
            'value' : data.projecttype,
            'label' : data.projecttype_label
          } :""
          )
          dispatch(swmprojectstatusActions.storeInput({
            name : 'projecttype',
            value : data.projecttype ? {'value' : data.projecttype, 'label' : data.projecttype_label} : ""
          }));
        }
      }

      const setprojectstatusValueFunction = (data) => {
        
        if(projectstatusList.options.find(o => o.value === data.projectstatus)){
          setprojectstatusValue(projectstatusList.options.find(o => o.value === data.projectstatus));

          dispatch(swmprojectstatusActions.storeInput({name : 'projectstatus', value : projectstatusList.options.find(o => o.value === data.projectstatus)}));
        }else{
          // setprojectstatusoptions((prev)=> {
          //   return {
          //     ...prev,
          //     options : [...prev.options, 
          //       {
          //           'value' : data.projectstatus,
          //           'label' : data.projectstatus_label
          //       }
          //     ]
          //   }
          // })
          setprojectstatusValue( data.projectstatus? {
            'value' : data.projectstatus,
            'label' : data.projectstatus_label
          }:"")

          dispatch(swmprojectstatusActions.storeInput({
            name  : 'projectstatus',
            value : data.projectstatus ? {'value' : data.projectstatus, 'label' : data.projectstatus_label} : ""
          }));
        }
       
      }
      

      const onDelete = (data) => {

        Swal.fire({
          text: `Are You sure, to delete ${data.projecttype}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
          confirmButtonColor: '#2fba5f',
          cancelButtonColor: '#fc5157'
      }).then((willDelete) => {
        if(willDelete.isConfirmed){
          axios.delete(`${baseUrl}/api/customercreationsmwprojectstatus/${data.id}`).then((resp) =>{
            if (resp.data.status === 200) {
              getsublist()
              toastSuccess(resp.data.message)
            }else if(resp.data.status === 404){
              toastError(resp.data.message)
            }else {
              toastError("Something went wrong!")
            }
          })
        }else{
          Swal.fire({
              title: 'Cancelled',
              icon:'error',
              timer: 1500
            });
        }
      })
      }


    let formIsValid = false;

  //$$$ if (
  //   projectTypeIsValid && statusIsValid && vendorIsValid && vendorTypeIsValid && projectvalueIsValid && projectstatusIsValid && durationdate1IsValid && durationdate2IsValid
  // ) {
  //   formIsValid = true;
  // }
  if (
    projectTypeValue || statusValue || vendorValue || vendorTypeValue || projectvalueValue || projectstatusValue || durationdate1Value || durationdate2Value
  ) {
    formIsValid = true;
  }
  else{
    formIsValid = false;
    // toastError("Can't Submit Empty Data");
  }

    const resetform = ()=> {
        resetprojectType()
        resetstatus()
        resetvendor()
        resetprojectstatus()
        resetprojectvalue()
        resetdurationdate1()
        resetdurationdate2()
        resetvendorType()
        setisEditbtn(false)
        setProjectId(null)

        dispatch(swmprojectstatusActions.resetInput())
    }

    const submitHandler = (event) => {
        event.preventDefault()
        setdatasending(true)
    
        if (!formIsValid) {
          // console.log("Inavlid Form!");
          setdatasending(false)
          return;
        }

        //$$$
        // let swmProjectStatus = {
        //     vendor : vendorValue,
        //     projectstatus : projectstatusValue,
        //     projectvalue : projectvalueValue,
        //     duarationdate1 : durationdate1Value,
        //     duarationdate2 : durationdate2Value,
        //     projecttype : projectTypeValue,
        //     status : statusValue,
        //     vendortype: vendorTypeValue,
        //  }

        let swmProjectStatus = {
          vendor : vendorValue,
          projectstatus : (!projectstatusValue? "":projectstatusValue.value),
          projectvalue : projectvalueValue,
          duarationdate1 : durationdate1Value,
          duarationdate2 : durationdate2Value,
          // projecttype : (!projectTypeValue.value ? "":projectTypeValue.value),
          projecttype : (projectTypeValue?.value ? projectTypeValue.value : "" ),
          status : (!statusValue ? "" :statusValue.value),
          vendortype: (!vendorTypeValue ? "" : vendorTypeValue.value),
       }

         let datatosend ={
            swmProjectStatus,
            tokenid : localStorage.getItem("token"),
            cust_creation_mainid : id
          }
      
          if(projectid === null){
            postData(datatosend)
          }else{
            putData(datatosend)
          }
      
    }
// console.log("formIsValid", formIsValid);
    return(
        <Fragment>
        <div className="formContent">
        {!id && <div className="loading">
          <img id="loading-image" src="/assets/img/lock.png" alt="Loading..." width ="150" height="150"/>
        </div>}
        <form onSubmit={submitHandler}>
          <div className="row align-items-center">
            <motion.div className="inputgroup col-lg-6 mb-4"  
              initial={{y:80, opacity: 0}} 
              animate={{y:0, opacity: 1}}    
              transition={{ delay: .1, type:'spring', stiffness: 180}} >
              <div className="row align-items-center ">
                <div className="col-lg-5 text-dark font-weight-bold">
                  <label htmlFor="projecttype">
                   Project Type :
                  </label>
                </div>
                <div className="col-lg-7">
                    <Select
                    name="projecttype"
                    id="projecttype"
                    isSearchable="true"
                    options={projecttypeoptions.options}
                    isClearable="true"
                    onChange={(selectedOptions) =>{ projectTypeChangeHandler(selectedOptions); projectTypeChangeHandler_store(selectedOptions)}}
                    onBlur={projectTypeBlurHandler}
                    value={projectTypeValue}
                    isLoading={projecttypeoptions.isLoading}
                    ></Select>
                  {projectTypeHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                       Project Type is required.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div className="inputgroup col-lg-6 mb-4"  
              initial={{y:80, opacity: 0}} 
              animate={{y:0, opacity: 1}}    
              transition={{ delay: .1, type:'spring', stiffness: 180}} >
              <div className="row align-items-center ">
                <div className="col-lg-5 text-dark font-weight-bold">
                  <label htmlFor="status">
                   Status :
                  </label>
                </div>
                <div className="col-lg-7">
                    <Select
                    name="status"
                    id="status"
                    isSearchable="true"
                    options={statusOptions}
                    isClearable="true"
                    onChange={(selectedOptions) => {statusChangeHandler(selectedOptions); statusChangeHandler_store(selectedOptions);}}
                    onBlur={statusBlurHandler}
                    value={statusValue}
                    ></Select>
                  {statusHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                       Status is required.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div className="inputgroup col-lg-6 mb-4"  
              initial={{y:80, opacity: 0}} 
              animate={{y:0, opacity: 1}}    
              transition={{ delay: .2, type:'spring', stiffness: 180}} >
              <div className="row align-items-center ">
                <div className="col-lg-5 text-dark font-weight-bold">
                  <label htmlFor="vendorType">
                   Vendor Type :
                  </label>
                </div>
                <div className="col-lg-7">
                    <Select
                    name="vendorType"
                    id="vendorType"
                    isSearchable="true"
                    options={vendorTypeOptions}
                    isClearable="true"
                    onChange={(selectedOptions) => {vendorTypeChangeHandler(selectedOptions); vendorTypeChangeHandler_store(selectedOptions)}}
                    onBlur={vendorTypeBlurHandler}
                    value={vendorTypeValue}
                    ></Select>
                  {vendorTypeHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                       Vendor Type is required.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div className="inputgroup col-lg-6 mb-4"  
              initial={{y:80, opacity: 0}} 
              animate={{y:0, opacity: 1}}    
              transition={{ delay: .2, type:'spring', stiffness: 180}} >
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-5 text-dark">
                  <label htmlFor="vendor">
                    Vendor :
                  </label>
                </div>
                <div className="col-lg-7">
                  <input
                    type="text"
                    className="form-control"
                    id="vendor"
                    placeholder="Enter Vendor"
                    name="vendor"
                    value={vendorValue}
                    onChange={(e) => {vendorChangeHandler(e); vendorChangeHandler_store(e)}}
                    onBlur={vendorBlurHandler}
                  />
                  {vendorHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        Vendor is required.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div className="inputgroup col-lg-6 mb-4"  
              initial={{y:80, opacity: 0}} 
              animate={{y:0, opacity: 1}}    
              transition={{ delay: .3, type:'spring', stiffness: 180}} >
              <div className="row align-items-center ">
                <div className="col-lg-5 text-dark font-weight-bold" >
                  <label htmlFor="projectstatus">
                    Project Status :
                  </label>
                </div>
                <div className="col-lg-7">
                   <Select
                    name="projectstatus"
                    id="projectstatus"
                    isSearchable="true"
                    options={projectstatusoptions.options}
                    isClearable="true"
                    onChange={(selectedOptions) => {projectstatusChangeHandler(selectedOptions); projectstatusChangeHandler_store(selectedOptions)}}
                    onBlur={projectstatusBlurHandler}
                    value={projectstatusValue}
                    isLoading={projectstatusoptions.isLoading}
                    ></Select>
                  {projectstatusHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        Project Status is required.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div className="inputgroup col-lg-6 mb-4"  
              initial={{y:80, opacity: 0}} 
              animate={{y:0, opacity: 1}}    
              transition={{ delay: .3, type:'spring', stiffness: 180}} >
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-5 text-dark">
                  <label htmlFor="projectvalue">
                    Project Value :
                  </label>
                </div>
                <div className="col-lg-7">
                  <input
                    type="number"
                    className="form-control"
                    id="projectvalue"
                    placeholder="Enter Project Value"
                    name="projectvalue"
                    value={projectvalueValue}
                    onChange={(e) => {projectvalueChangeHandler(e); projectvalueChangeHandler_store(e) }}
                    onBlur={projectvalueBlurHandler}
                  />
                  {projectvalueHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        Project Value is required.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div className="inputgroup col-lg-6 mb-4"  
              initial={{y:80, opacity: 0}} 
              animate={{y:0, opacity: 1}}    
              transition={{ delay: .4, type:'spring', stiffness: 180}} >
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-5 text-dark">
                  <label htmlFor="duration">
                   Duration :
                  </label>
                </div>
                <div className="col-lg-7 ">
                  <div className="col-lg-12 d-flex justify-content-between p-0">
                  <input
                    type="date"
                    className="form-control col-md-5"
                    id="durationdate1"
                    placeholder="Enter Date"
                    name="durationdate1"
                    value={durationdate1Value}
                    onChange={(e) => {durationdate1ChangeHandler(e); durationdate1ChangeHandler_store(e)}}
                    onBlur={durationdate1BlurHandler}
                  />
                   <input
                    type="date"
                    className="form-control col-md-5"
                    id="durationdate2"
                    placeholder="Enter Date"
                    name="durationdate2"
                    value={durationdate2Value}
                    onChange={(e) => {durationdate2ChangeHandler(e); durationdate2ChangeHandler_store(e)} }
                    onBlur={durationdate2BlurHandler}
                  />
                  </div>
                 
                  {(durationdate1HasError || durationdate2HasError)  && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        Duration is required.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            
            <div className="col-lg-12 d-flex justify-content-center">
              {!isEditbtn && 
              <button
              className={(!formIsValid) ?  "btn btn-outline-primary rounded-pill px-4" :  "btn btn-primary rounded-pill px-4"} 
              disabled={!formIsValid || isDatasending}
              >
                {isDatasending && <span className="spinner-border spinner-border-sm mr-2"></span> }
                {isDatasending && 'Saving...'}
                {!isDatasending && 'Add'}
              </button>}
              {isEditbtn && 
               <button
               className={(!formIsValid) ?  "btn btn-outline-primary rounded-pill px-4" :  "btn btn-primary rounded-pill px-4"} 
               disabled={!formIsValid || isDatasending}
              >
                {isDatasending && <span className="spinner-border spinner-border-sm mr-2"></span> }
                {isDatasending && 'Updating...'}
                {!isDatasending && 'Update'}
              </button>  }  
              <button
                className="btn  btn-outline-dark rounded-pill mx-3"
                type="reset"
                onClick={resetform}
                disabled={isDatasending}
              >
                Clear
              </button>
            </div>
          </div>
        </form>

        {/* <div className="col-lg-12 d-flex justify-content-center mt-4"> */}
          {/* <CustomerCreationContactSubtable contactData = {contactlist} onEdit={onEdit} onDelete={onDelete}/> */}
          < SWMProjectStatusSubTable projectList = {projectList} onEdit={onEdit} onDelete={onDelete}/>
        {/* </div> */}
        <div className = "col-lg-12 mt-3 d-flex justify-content-end">
          <button
              className="btn btn-outline-primary mr-3 rounded-pill"
              onClick = {() => navigate("/tender/master/customercreation/list/main/ulbdetails/"+id)}
            >
            Next
          </button>
          <button className="btn  btn-outline-dark rounded-pill"
            onClick = {() => navigate("/tender/master/customercreation/list")}
            >
              Cancel
          </button>
        </div>       
      </div>
        </Fragment>
    )
}

export default CustomerCreationSWMProjectStatus

// @page
// {
//     font-family: Bookman Old Style;
//      size: legal portrait;
    
// }

{/* <img src="http://law.elawhands.com/assets/images/logoword-old4.png" width="99%" /> */}