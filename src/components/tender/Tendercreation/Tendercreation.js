import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import Select from "react-select";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import axios from "axios";
import Swal from "sweetalert2/src/sweetalert2.js";

const initialState = {
  organisation: "",
  customerName: "",
  nitDate: "",
  tenderType: "",
};

const organisationList = [
  {value :"Public Sector Unit", label :"Public Sector Unit"},
  {value :"Private/Public Sector Company", label :"Private/Public Sector Company"},
];


const initialStateErr = {
  organisation: null,
  customerName: null,
  nitDate: null,
  tenderType: null,
};

const initialOptions = {
  options: [],
  isLoading: false,
};

const Tendercreation = () => {
  usePageTitle("Tender Creation");
  // const { id } = useParams();
  const navigate = useNavigate();

  const { server1: baseUrl } = useBaseUrl();

  const [dataSending, setDataSending] = useState(false);
  const [input, setInput] = useState(initialState);
  const [inputValidation, setInputValidation] = useState(initialStateErr);
  const [ulbOptions, setulbOptions] = useState(initialOptions);
  // const [organisationList, setOrganisationList] = useState();
  // const [customerNameList, setCustomerNameList] = useState();
  const [tenderTypeList, setTenderTypeList] = useState({
    value: "",
    label:""
  });
  const [formIsValid, setFormIsValid] = useState(false);
  // const [loading, setLoading] = useState(false);
  let tokenId = localStorage.getItem("token");
  // const [savedData, setSavedData] = useState({});

 

  useEffect(() => {
    // getOrganisationList();
    // getCustomerNameList();
    getTenderTypeList();
    getulbListOptions();
  }, []);

  // const getOrganisationList = () => {
  //   axios.get(`${baseUrl}/api/organisation/list`).then((resp) => {
  //     setOrganisationList(resp.data.organisationList);
  //   });
  // };
  // const getCustomerNameList = () => {
  //   axios.get(`${baseUrl}/api/customerName/list`).then((resp) => {
  //     setCustomerNameList(resp.data.customerNameList);
  //   });
  // };

  const getTenderTypeList = () => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    axios.post(`${baseUrl}/api/tendertype/list`,data).then((resp) => {
      setTenderTypeList(resp.data.tendertypeList);
    });
  };
  const getulbData = async (savedulb) => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    let response = await axios.post(`${baseUrl}/api/ulb-list/${savedulb}`,data);
    return { options: response.data.ulbList, isLoading: false };
  };      

  const getulbListOptions = async (savedulb = null) => {
    setulbOptions((c) => {
      return { ...c, isLoading: true };
    });
    let ulbList = await getulbData(savedulb);
    setulbOptions(ulbList);
  };

  const inputHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    if(e.target.value === "")
    {
        setInputValidation({...inputValidation, [e.target.name]:true});
    }
    else{
      setFormIsValid(false);
      setInputValidation({...inputValidation, [e.target.name]:false});
    }
  };

  const inputHandlerForSelect = (value, action) => {
    // console.log("Value", value);
    // console.log("Action", action);

    setInput({
      ...input,
      [action.name]: value,
    });
    if(value === "" | value === null)
    {
        setInputValidation({...inputValidation, [action.name]:true});
    }
    else{
      setFormIsValid(false);
      setInputValidation({...inputValidation, [action.name]:false});
    }
  };
 
  useEffect(()=>{
    
    if(
  (input.customerName ? (input.customerName.value!=="" && input.customerName.value!==undefined && input.customerName.value!==null): false) &&
      input.nitDate!=="" &&
      (input.organisation ? (input.organisation.value!=="" && input.organisation.value!==undefined && input.organisation.value!==null): false) && 
      (input.tenderType ? (input.tenderType.value!=="" && input.tenderType.value!==undefined && input.tenderType.value!==null): false))
    {
      setFormIsValid(true);
    }
    else{
      setFormIsValid(false);
    }
  },[input]);

  const postData = (data) => {
    axios.post(`${baseUrl}/api/tendercreation`, data).then((resp) => {
      if (resp.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Tender",
          text:  resp.data.message,
          confirmButtonColor: "#5156ed",
        });
        
      navigate(`/tender/bidmanagement/list`);
      } else if (resp.data.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Tender",
          text: resp.data.errors,
          confirmButtonColor: "#5156ed",
        });
       
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Tender",
          text: "Provided Credentials are Incorrect",
          confirmButtonColor: "#5156ed",
        }).then (()=>{
          localStorage.clear();
          navigate("/");
        });
      }
      setDataSending(false);
      setFormIsValid(false);
    });
  };
  
  // const putData = (data, id) => {
  //   axios.put(`${baseUrl}/api/city/${id}`, data).then((res) => {
  //     if (res.data.status === 200) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "City",
  //         text: "Updated Successfully!",
  //         confirmButtonColor: "#5156ed",
  //       });
  //       setInput(initialState);
  //     } else if (res.data.status === 400) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "City",
  //         text: res.data.errors,
  //         confirmButtonColor: "#5156ed",
  //       });
  //       setDataSending(false);
  //     }
  //   });
  // };

  const submitHandler = (e) => {
    e.preventDefault();
    setDataSending(true); 
    if(input.customerName.value!=="" && input.nitDate!=="" && input.organisation.value!=="" && (input.tenderType.value!=="" | input.tenderType.value!==undefined))
    {
      setDataSending(false);
    
      const data = {
        organisation: input.organisation.value,
        customername: input.customerName.value,
        nitdate: input.nitDate,
        tendertype: input.tenderType.value,
        tokenId:tokenId
      };
      postData(data)
      // if (!id) {
      //   postData(data);
      // } else {
      //   putData(data, id);
      // }
    }
  };

  // const updateHandler = (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   //Have to write, when need Update option 
  // }
    


  const cancelHandler = () => {
    setInput(initialState);
    setInputValidation(initialStateErr);
    setFormIsValid(false);
    setDataSending(false);
    // setLoading(false);
  };

  return (
    <div className="card shadow mb-4 p-4">
      <form>
        <div className="row align-items-center">
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center">
              <div className="col-lg-4 text-dark">
                <label htmlFor="organisation" className="font-weight-bold"> Organisation<span className="text-danger">&nbsp;*</span> </label>
              </div>
              <div className="col-lg-8">
                <Select
                  name="organisation"
                  id="organisation"
                  isSearchable="true"
                  isClearable="true"
                  options={organisationList}
                  value={input.organisation}
                  onChange={inputHandlerForSelect}
                ></Select>

                {inputValidation.organisation && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-bold">
                      Select Valid Type..!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center">
              <div className="col-lg-4 text-dark">
                <label htmlFor="customerName" className="font-weight-bold">
                  Customer Name<span className="text-danger">&nbsp;*</span>
                </label>
              </div>
              <div className="col-lg-8">
                <Select
                  name="customerName"
                  id="customerName"
                  isSearchable="true"
                  isClearable="true"
                  options={ulbOptions.options}
                  value={input.customerName}
                  onChange={inputHandlerForSelect}
                ></Select>
                {inputValidation.customerName && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-bold">
                      Enter Valid Input..!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>


          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center">
              <div className="col-lg-4 text-dark">
                <label htmlFor="tenderType" className="font-weight-bold">
                  Tender Type<span className="text-danger">&nbsp;*</span>
                </label>
              </div>
              <div className="col-lg-8">
                <Select
                  name="tenderType"
                  id="tenderType"
                  isSearchable="true"
                  isClearable="true"
                  options={tenderTypeList}
                  value={input.tenderType}
                  onChange={inputHandlerForSelect}

                ></Select>
                {inputValidation.tenderType && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-bold">
                      Select Tender Type..!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center">
              <div className="col-lg-4 text-dark font-weight-bold">
                <label htmlFor="nitDate">
                  NIT Date<span className="text-danger">&nbsp;*</span>
                </label>
              </div>
              <div className="col-lg-8">
                <input
                  type="date"
                  className="form-control"
                  id="nitDate"
                  name="nitDate"
                  value={input.nitDate}
                  onChange={inputHandler}
                />
                {inputValidation.nitDate && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-bold">
                      Select Valid Date..!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="inputgroup col-lg-12 ">
            <div className="row align-items-center">
              <div className="col-lg-12 text-center ">
                <button
                  className="btn btn-primary mr-3"
                  disabled={!formIsValid}
                  onClick={submitHandler}
                >
                  {dataSending === true ? "Submitting...." : "Save & Countinue"}

                </button>
                <button className="btn btn-secondary" onClick={cancelHandler}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Tendercreation;
