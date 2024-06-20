import { Fragment, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useBaseUrl } from "../../../hooks/useBaseUrl";
import useInputValidation from "../../../hooks/useInputValidation";
//import { isIFSCvalid } from "../CommonValidation"
import { isIFSCvalid } from "../CommonValidation_copy";
import axios from "axios";
import CustomerCreationBankDetailsubtable from "./CusromerCreationBankDetailsubtable";
import Swal from "sweetalert2";
import { bankDetailsActions } from "../store/BankDetailsSlice";
import { useDispatch, useSelector } from "react-redux";

//$$$ const isNotEmpty = (value) => value.trim() !== "";
const isNotEmpty = (value) => true;
const isEmail = (value) => value.includes("@");

const CustomerCreationBankDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDatasending, setdatasending] = useState(false);
  const [toastSuccess, toastError, setCustomerCreationMainID] =
    useOutletContext();
  const { server1: baseUrl } = useBaseUrl();
  const [contactlist, setcontactlist] = useState(null);
  const [isEditbtn, setisEditbtn] = useState(false);
  const [bankid, setbankid] = useState(null);
  const [addresslen, setaddresslength] = useState(255);
  const [banklist, setbanklist] = useState(null);

  let bankdata = useSelector((state) => state.bankdata.inputData);
  const dispatch = useDispatch();

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
    value: bankaddressValue,
    isValid: bankaddressIsValid,
    hasError: bankaddressHasError,
    valueChangeHandler: bankaddressChangeHandler,
    inputBlurHandler: bankaddressBlurHandler,
    setInputValue: setbankaddressValue,
    reset: resetbankaddress,
  } = useInputValidation(isNotEmpty);

  const {
    value: ifsccodeValue,
    isValid: ifsccodeIsValid,
    hasError: ifsccodeHasError,
    valueChangeHandler: ifsccodeChangeHandler,
    inputBlurHandler: ifsccodeBlurHandler,
    setInputValue: setifsccodeValue,
    reset: resetifsccode,
  } = useInputValidation(isIFSCvalid);

  const {
    value: beneficiaryaccountnameValue,
    isValid: beneficiaryaccountnameIsValid,
    hasError: beneficiaryaccountnameHasError,
    valueChangeHandler: beneficiaryaccountnameChangeHandler,
    inputBlurHandler: beneficiaryaccountnameBlurHandler,
    setInputValue: setbeneficiaryaccountnameValue,
    reset: resetbeneficiaryaccountname,
  } = useInputValidation(isNotEmpty);

  const {
    value: accountnumberValue,
    isValid: accountnumberIsValid,
    hasError: accountnumberHasError,
    valueChangeHandler: accountnumberChangeHandler,
    inputBlurHandler: accountnumberBlurHandler,
    setInputValue: setaccountnumberValue,
    reset: resetaccountnumber,
  } = useInputValidation(isNotEmpty);

  useEffect(() => {
    bankdata?.ifsccode && setifsccodeValue(bankdata.ifsccode);
    bankdata?.bankname && setbanknameValue(bankdata.bankname);
    bankdata?.bankaddress && setbankaddressValue(bankdata.bankaddress);
    bankdata?.beneficiaryaccountname &&
      setbeneficiaryaccountnameValue(bankdata.beneficiaryaccountname);
    bankdata?.accountnumber && setaccountnumberValue(bankdata.accountnumber);

    bankdata?.isEditbtn && setisEditbtn(bankdata.isEditbtn);
    bankdata?.bankid && setbankid(bankdata.bankid);

    if (id) {
      setCustomerCreationMainID(id);
      getsublist();
    }
  }, []);

  useEffect(() => {
    validateInputLength(bankaddressValue);
  }, [bankaddressValue]);

  const dispatchData = (name, value) => {
    dispatch(bankDetailsActions.storeInput({ name: name, value: value }));
  };

  const banknameChangeHandler_store = (e) =>
    dispatchData(e.target.name, e.target.value);
  const bankaddressChangeHandler_store = (e) =>
    dispatchData(e.target.name, e.target.value);
  const ifsccodeChangeHandler_store = (e) =>
    dispatchData(e.target.name, e.target.value);
  const beneficiaryaccountnameChangeHandler_store = (e) =>
    dispatchData(e.target.name, e.target.value);
  const accountnumberChangeHandler_store = (e) =>
    dispatchData(e.target.name, e.target.value);

  const checkIFSCvalid = (value) => {
    if (!/^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/.test(value)) {
      return false;
    } else {
      return true;
    }
  };

  const getBank = async (e) => {
    let ifsccode = e.target.value;
    let isValid = checkIFSCvalid(ifsccode);
    if (isValid) {
      let response = await axios.get(`https://ifsc.razorpay.com/${ifsccode}`);
      if (response.status === 200) {
        setbanknameValue(response.data.BANK);
        setbankaddressValue(response.data.ADDRESS);
        validateInputLength(response.data.ADDRESS);

        dispatchData("bankname", response?.data?.BANK);
        dispatchData("bankaddress", response?.data?.ADDRESS);
      }
    } else {
      setbanknameValue("");
      dispatchData("bankname", "");
      setbankaddressValue("");
      dispatchData("bankaddress", "");
      validateInputLength("");
    }
  };

  const validateInputLength = (value) => {
    let maxLength = 255;
    setaddresslength(maxLength - value.length);
  };

  let formIsValid = false;

  // if (
  //   banknameIsValid &&
  //   bankaddressIsValid &&
  //   ifsccodeIsValid &&
  //   beneficiaryaccountnameIsValid &&
  //   accountnumberIsValid
  // ) {
  //   formIsValid = true;
  // }

  if (
    banknameValue ||
    bankaddressValue ||
    ifsccodeValue ||
    beneficiaryaccountnameValue ||
    accountnumberValue
  ) {
    formIsValid = true;
  }

  const submitHandler = (e) => {
    e.preventDefault();

    setdatasending(true);

        if (!formIsValid) {
          // console.log("Inavlid Form!");
          setdatasending(false)
          return;
        }
    
        let bankdetails = {
          ifsccode : ifsccodeValue,
          bankname : banknameValue,
          bankaddress : bankaddressValue,
          beneficiaryaccountname : beneficiaryaccountnameValue,
          accountnumber : accountnumberValue
       }
   
        let datatosend ={
          bankdetails,
          tokenid : localStorage.getItem("token"),
          cust_creation_mainid : id
        }
    
        if(bankid === null){
          postData(datatosend)
        }else{
          putData(datatosend)
        }
   
      }

    const postData = (data) => {
      axios.post(`${baseUrl}/api/customercreationbankdetails`, data).then((resp) => {
        // console.log(resp);
        if (resp.data.status === 200) {
          getsublist();
          toastSuccess(resp.data.message);
          resetform();
          // navigate("/tender/master/customercreation/list/main/contactPerson");
        } else if (resp.data.status === 400) {
          toastError(resp.data.message);
        }
        setdatasending(false);
      });
  };

    const putData = (data) => {
      axios.put(`${baseUrl}/api/customercreationbankdetails/${bankid}`, data).then((resp) =>{
        // console.log(resp);
        if (resp.data.status === 200) {
          getsublist();
          resetform();
          toastSuccess(resp.data.message);
        } else {
          toastError("Something went wrong!");
        }
        setdatasending(false);
      });
  };

  const getsublist = () => {
    let data = {
      mainid: id,
    };

    axios
      .post(`${baseUrl}/api/customercreationbankdetails/getlist`, data)
      .then((resp) => {
        // console.log(resp)
        let list = [...resp.data.bankdetails];
        let listarr = list.map((item, index, arr) => ({
          ...item,
          buttons: `<i class="fa fa-edit text-primary mx-2 h6" style="cursor:pointer" title="Edit"></i> <i class="fa fa-trash text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>`,
          sl_no: index + 1,
        }));

        setbanklist(listarr);
      });
  };

  const resetform = () => {
    resetbankname();
    resetbankaddress();
    resetifsccode();
    resetbeneficiaryaccountname();
    resetaccountnumber();
    setbankid(null);
    setisEditbtn(false);

    dispatch(bankDetailsActions.resetInput());
  };

  const onEdit = (data) => {
    setisEditbtn(true);
    setbankid(data.id);
    setbanknameValue(data.bankname ? data.bankname : "");
    setbankaddressValue(data.bankaddress ? data.bankaddress : "");
    setifsccodeValue(data.ifsccode ? data.ifsccode : "");
    setbeneficiaryaccountnameValue(
      data.beneficiaryaccountname ? data.beneficiaryaccountname : ""
    );
    setaccountnumberValue(data.accountnumber ? data.accountnumber : "");

    dispatchData("ifsccode", data.ifsccode ? data.ifsccode : "");
    dispatchData("bankname", data.bankname ? data.bankname : "");
    dispatchData("bankaddress", data.bankaddress ? data.bankaddress : "");
    dispatchData(
      "beneficiaryaccountname",
      data.beneficiaryaccountname ? data.beneficiaryaccountname : ""
    );
    dispatchData("accountnumber", data.accountnumber ? data.accountnumber : "");

    dispatchData("isEditbtn", true);
    dispatchData("bankid", data.id);
  };

  const onDelete = (data) => {
    Swal.fire({
      text: `Are You sure, to delete ${data.bankname} of ${data.beneficiaryaccountname}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#2fba5f",
      cancelButtonColor: "#fc5157",
    }).then((willDelete) => {
      if (willDelete.isConfirmed) {
        axios
          .delete(`${baseUrl}/api/customercreationbankdetails/${data.id}`)
          .then((resp) => {
            if (resp.data.status === 200) {
              getsublist();
              toastSuccess(resp.data.message);
            } else if (resp.data.status === 404) {
              toastError(resp.data.message);
            } else {
              toastError("Something went wrong!");
            }
          });
      } else {
        Swal.fire({
          title: "Cancelled",
          icon: "error",
          timer: 1500,
        });
      }
    });
  };

 


  return (
    <Fragment>
      <div className="">
        {!id && (
          <div className="loading">
            <img
              id="loading-image"
              src="/assets/img/lock.png"
              alt="Loading..."
              width="150"
              height="150"
            />
          </div>
        )}
        <form onSubmit={submitHandler}>
          <div className="row align-items-center">
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-5 text-dark">
                  <label htmlFor="ifsccode">IFSC Code :</label>
                </div>
                <div className="col-lg-7">
                  <input
                    type="text"
                    className="form-control"
                    id="ifsccode"
                    placeholder="Enter IFSC Code"
                    name="ifsccode"
                    value={ifsccodeValue}
                    onChange={(e) => {
                      ifsccodeChangeHandler(e);
                      getBank(e);
                      ifsccodeChangeHandler_store(e);
                    }}
                    onBlur={ifsccodeBlurHandler}
                  />
                  {ifsccodeHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        IFSC code is invalid.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-5 text-dark">
                  <label htmlFor="bankname">Bank Name:</label>
                </div>
                <div className="col-lg-7">
                  <input
                    type="text"
                    className="form-control"
                    id="bankname"
                    placeholder="Enter Bank Name "
                    name="bankname"
                    value={banknameValue}
                    onChange={(e) => {
                      banknameChangeHandler(e);
                      banknameChangeHandler_store(e);
                    }}
                    onBlur={banknameBlurHandler}
                  />
                  {banknameHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        Bank Name is required.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row font-weight-bold">
                <div className="col-lg-5 text-dark">
                  <label htmlFor="bankaddress">Bank address :</label>
                  <p className="text-info font-weight-bold">
                    <small>
                      <b>({addresslen} Characters Remaining) </b>
                    </small>
                  </p>
                </div>
                <div className="col-lg-7">
                  <textarea
                    type="text"
                    className="form-control"
                    id="bankaddress"
                    placeholder="Enter Bank Address"
                    name="bankaddress"
                    value={bankaddressValue}
                    onChange={(e) => {
                      bankaddressChangeHandler(e);
                      validateInputLength(e.target.value);
                      bankaddressChangeHandler_store(e);
                    }}
                    onBlur={bankaddressBlurHandler}
                    rows="3"
                    maxLength="255"
                  ></textarea>
                  {bankaddressHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        Bank address is required.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold mb-4">
                <div className="col-lg-5 text-dark">
                  <label htmlFor="beneficiaryaccountname">
                    Beneficiary Account Name :
                  </label>
                </div>
                <div className="col-lg-7">
                  <input
                    type="text"
                    className="form-control"
                    id="beneficiaryaccountname"
                    placeholder="Enter Beneficiary Account Name"
                    name="beneficiaryaccountname"
                    value={beneficiaryaccountnameValue}
                    onChange={(e) => {
                      beneficiaryaccountnameChangeHandler(e);
                      beneficiaryaccountnameChangeHandler_store(e);
                    }}
                    onBlur={beneficiaryaccountnameBlurHandler}
                  />
                  {beneficiaryaccountnameHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        Beneficiary Account Name is required.
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-5 text-dark">
                  <label htmlFor="accountnumber">Account Number :</label>
                </div>
                <div className="col-lg-7">
                  <input
                    type="text"
                    className="form-control"
                    id="accountnumber"
                    placeholder="Enter Account Number"
                    name="accountnumber"
                    value={accountnumberValue}
                    onChange={(e) => {
                      accountnumberChangeHandler(e);
                      accountnumberChangeHandler_store(e);
                    }}
                    onBlur={accountnumberBlurHandler}
                  />
                  {accountnumberHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        Beneficiary Account Number is required.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-12 d-flex justify-content-center mb-4" >
              {!isEditbtn && (
                <button
                  className={
                    !formIsValid
                      ? "btn btn-outline-primary rounded-pill px-4"
                      : "btn btn-primary rounded-pill px-4"
                  }
                  disabled={!formIsValid || isDatasending}
                >
                  {isDatasending && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  {isDatasending && "Saving..."}
                  {!isDatasending && "Add"}
                </button>
              )}
              {isEditbtn && (
                <button
                  className={
                    !formIsValid
                      ? "btn btn-outline-primary rounded-pill px-4"
                      : "btn btn-primary rounded-pill px-4"
                  }
                  disabled={!formIsValid || isDatasending}
                >
                  {isDatasending && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  {isDatasending && "Updating..."}
                  {!isDatasending && "Update"}
                </button>
              )}
              <button
                className="btn  btn-outline-dark rounded-pill mx-3"
                onClick={resetform}
                disabled={isDatasending}
                type="reset"
              >
                Clear
              </button>
            </div>
          </div>
        </form>

        {/* <div className="col-lg-12 d-flex justify-content-center mt-4"> */}
        <CustomerCreationBankDetailsubtable
          bankData={banklist}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        {/* </div> */}
        <div className="col-lg-12 mt-3 d-flex justify-content-center">
          {/* <button
              className="btn btn-outline-primary mr-3 rounded-pill"
              onClick = {() => navigate("/tender/master/customercreation/list/main/swmprojectstatus/"+id)}
            >
            Next
          </button> */}
          <button
            className="btn  btn-outline-dark rounded-pill"
            onClick={() => navigate("/tender/master/customercreation/list")}
          >
            Cancel
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default CustomerCreationBankDetails;
