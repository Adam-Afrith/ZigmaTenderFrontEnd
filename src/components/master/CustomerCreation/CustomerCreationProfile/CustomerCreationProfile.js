import { Fragment, useEffect, useState } from "react";
import $ from 'jquery';
import Select from "react-select";
import useInputValidation from "../../../hooks/useInputValidation";
import { CustSubCatgyOpts } from "../data";

import {
  getCountryData,
  getSatateData,
  getDistrictData,
  getCityData,
  getCustSubCatList,
} from "../apiUtilites";
import { useBaseUrl } from "../../../hooks/useBaseUrl";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { isMobileValidation, phoneValidation, isPincodeValid, isEmailValid, isPanValid, isgstNoValid, isUrlValid } from "../CommonValidation";
// import { isMobileValidation, isPincodeValid, isEmailValid, isPanValid, isgstNoValid, isUrlValid } from "../CommonValidation_copy";

import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { profiledataActions } from "../store/CusProfileSlice";
import { contactPersonActions } from "../store/ContactPersonSlice";
import { swmprojectstatusActions } from "../store/SWMProjectStatusSlice";
import { ULBDetailsActions } from "../store/ULBDetailsSlice";
import { bankDetailsActions } from "../store/BankDetailsSlice";



// const isNotEmpty = (value) => value.trim() !== "";
// const isNotEmpty = (value) => {return true};
// const isEmail = (value) => value.includes("@");
const isNotNull = (value) => {
  // if (value === null) {
  //   return false;
  // } else if (value === "") {
  //   return false;
  // }
  return true;
};

const initialOptions = {
  options: [],
  isLoading: false,
};



const CustomerCreationProfile = () => {
  const location = useLocation();
  const { server1: baseUrl } = useBaseUrl();
  const [formNo, setFormNo]= useState(1);
  const [formId, setFormId]= useState(0);
  const [mainid, setMainId] = useState(0);
  const [isdatasending, setdatasending] = useState(false)
  const [isCustNoFetching, setCustNoFetching] = useState(false)
  const [custsubcategoryOptions, setcustomersubcategoryOptions] = useState(initialOptions);
  const [CountryOptions, setCountryOptions] = useState(initialOptions);
  const [StateOptions, setStateoptions] = useState(initialOptions);
  const [DistrictOptions, setDistrictoptions] = useState(initialOptions);
  const [CityOptions, setCityoptions] = useState(initialOptions);
  const [GstNoDisable, setGstNoDisable] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [addresslen, setaddresslength] =  useState(255);
  const [savedData, setSavedData] =useState({})
  const [isRendered, setIsrendered] = useState(false)

  const { id } = useParams();

  const navigate = useNavigate()
  const [toastSuccess, toastError, setCustomerCreationMainID] = useOutletContext();

  let cust_name = useSelector((state) => state.profiledata.inputData)
  const dispatch = useDispatch();

  const {
    value: customernoValue,
    isValid: customernoIsValid,
    hasError: customernoHasError,
    valueChangeHandler: customernoChangeHandler,
    inputBlurHandler: customernoBlurHandler,
    setInputValue: setcustomernoValue,
    reset: resetcustomerno,
  } = useInputValidation(isNotNull);

  // console.log('useInputValidation',useInputValidation(isNotNull));

  // const {
  //   value: customercategoryValue,
  //   isValid: customercategoryIsValid,
  //   hasError: customercategoryHasError,
  //   valueChangeHandler: customercategoryChangeHandler,
  //   inputBlurHandler: customercategoryBlurHandler,
  //   reset: resetcustomercategory,
  // } = useInputValidation(isNotEmpty);

  const {
    value: customernameValue,
    isValid: customernameIsValid,
    hasError: customernameHasError,
    valueChangeHandler: customernameChangeHandler,
    inputBlurHandler: customernameBlurHandler,
    setInputValue: setcustomernameValue,
    reset: resetcustomername,
  } = useInputValidation(isNotNull);

  const [customercategoryValue, setcustomercategoryValue] = useState("state");
  const [smartcity, setSmartCity] = useState("yes");
  const [gstReg, setgstReg] = useState("no");

  const {
    value: customersubcategoryValue,
    isValid: customersubcategoryIsValid,
    hasError: customersubcategoryHasError,
    valueChangeHandlerForReactSelect: customersubcategoryChangeHandler,
    inputBlurHandler: customersubcategoryBlurHandler,
    setInputValue: setcustomersubcategoryValue,
    reset: resetcustomersubcategory,
  } = useInputValidation(isNotNull);

  const {
    value: stateValue,
    isValid: stateIsValid,
    hasError: stateHasError,
    valueChangeHandlerForReactSelect: stateSelectedValue,
    inputBlurHandler: stateBlurHandler,
    setInputValue: setState,
    reset: resetstate,
  } = useInputValidation(isNotNull);

  const {
    value: countryValue,
    isValid: countryIsValid,
    hasError: countryHasError,
    valueChangeHandlerForReactSelect: countrySelectedValue,
    inputBlurHandler: countryBlurHandler,
    reset: resetcountry,
  } = useInputValidation(isNotNull);

  const {
    value: cityValue,
    isValid: cityIsValid,
    hasError: cityHasError,
    valueChangeHandlerForReactSelect: cityChangeHandler,
    inputBlurHandler: cityBlurHandler,
    setInputValue: setCity,
    reset: resetcity,
  } = useInputValidation(isNotNull);

  const {
    value: districtValue,
    isValid: districtIsValid,
    hasError: districtHasError,
    valueChangeHandlerForReactSelect: districtSelectedValue,
    inputBlurHandler: districtBlurHandler,
    setInputValue: setDistrict,
    reset: resetdistrict,
  } = useInputValidation(isNotNull);

  const {
    value: pincodeValue,
    isValid: pincodeIsValid,
    hasError: pincodeHasError,
    valueChangeHandler: pincodeChangeHandler,
    inputBlurHandler: pincodeBlurHandler,
    setInputValue: setpincodeValue,
    reset: resetpincode,
  } = useInputValidation(isPincodeValid);

  const {
    value: phoneValue,
    isValid: phoneIsValid,
    hasError: phoneHasError,
    valueChangeHandler: phoneChangeHandler,
    inputBlurHandler: phoneBlurHandler,
    setInputValue: setphoneValue,
    reset: resetphone,
  } = useInputValidation(phoneValidation);

  const {
    value: panValue,
    isValid: panIsValid,
    hasError: panHasError,
    valueChangeHandler: panChangeHandler,
    inputBlurHandler: panBlurHandler,
    setInputValue: setpanValue,
    reset: resetpan,
   } = useInputValidation(isPanValid); 

  const {
    value: mobilenoValue,
    isValid: mobilenoIsValid,
    hasError: mobilenoHasError,
    valueChangeHandler: mobilenoChangeHandler,
    inputBlurHandler: mobilenoBlurHandler,
    setInputValue: setmobilenoValue,
    reset: resetmobileno,
  } = useInputValidation(isMobileValidation);

  // const {
  //   value: currentyrdateValue,
  //   isValid: currentyrdateIsValid,
  //   hasError: currentyrdateHasError,
  //   valueChangeHandler: currentyrdateChangeHandler,
  //   inputBlurHandler: currentyrdateBlurHandler,
  //   setInputValue: setcurrentyrdateValue,
  //   reset: resetcurrentyrdate,
  // } = useInputValidation(isNotEmpty);

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    setInputValue: setemailValue,
    reset: resetemail,
  } = useInputValidation(isEmailValid);

  const {
    value: gstnoValue,
    isValid: gstnoIsValid,
    hasError: gstnoHasError,
    valueChangeHandler: gstnoChangeHandler,
    inputBlurHandler: gstnoBlurHandler,
    setInputValue: setgstnoValue,
    reset: resetgstno,
  } = useInputValidation(isgstNoValid);

  // const {
  //   value: populationyrdataValue,
  //   isValid: populationyrdataIsValid,
  //   hasError: populationyrdataHasError,
  //   valueChangeHandler: populationyrdataChangeHandler,
  //   inputBlurHandler: populationyrdataBlurHandler,
  //   setInputValue: setpopulationyrdataValue,
  //   reset: resetpopulationyrdata,
  // } = useInputValidation(isNotEmpty);

  const {
    value: addressValue,
    isValid: addressIsValid,
    hasError: addressHasError,
    valueChangeHandler: addressChangeHandler,
    inputBlurHandler: addressBlurHandler,
    setInputValue: setaddressValue,
    reset: resetaddress,
  } = useInputValidation(isNotNull);

  const {
    value: websiteValue,
    isValid: websiteIsValid,
    hasError: websiteHasError,
    valueChangeHandler: websiteChangeHandler,
    inputBlurHandler: websiteBlurHandler,
    setInputValue: setwebsiteValue,
    reset: resetwebsite,
  } = useInputValidation(isUrlValid);

  useEffect(() => {
    validateInputLength(addressValue)
  }, [addressValue])

  const dispatchData = (e) => {

    if(e.target.name === 'gstregistered'){
      dispatch(profiledataActions.storeInput({name : 'gstno', value : ''}));
    }

    dispatch(profiledataActions.storeInput({name : e.target.name, value : e.target.value}));
  }

  const customernameChangeHandler_store = (e) => dispatchData(e)
  const pincodeChangeHandler_store =(e) => dispatchData(e)
  const phoneChangeHandler_store =(e) => dispatchData(e)
  const panChangeHandler_store =(e) => dispatchData(e)
  const mobilenoChangeHandler_store =(e) => dispatchData(e)
  const emailChangeHandler_store =(e) => dispatchData(e)
  const gstnoChangeHandler_store =(e) => dispatchData(e)
  const addressChangeHandler_store =(e) => dispatchData(e)
  const websiteChangeHandler_store =(e) => dispatchData(e)
  const customercategoryhandler_store = (e) => dispatchData(e)
  const smartcityhandler_store = (e) => dispatchData(e)
  const gstregistered_store = (e) =>  dispatchData(e)

  const customersubcategoryChangeHandler_store = (selectedOptions) => {
    
    if(selectedOptions === null){
      dispatch(profiledataActions.storeInput({name : 'customersubcategory', value : '0' }));
      return; 
    }
    dispatch(profiledataActions.storeInput({name : 'customersubcategory', value : selectedOptions})); 
  }

  const countryChangeHandler_store = (selectedOptions) => {
  
    if(selectedOptions === null){
      dispatch(profiledataActions.storeInput({name : 'country', value : '0' }));
      return; 
    }
    dispatch(profiledataActions.storeInput({name : 'country', value : selectedOptions})); 
  }
  
  const stateChangeHandler_store = (selectedOptions) => {
    if(selectedOptions === null){
      dispatch(profiledataActions.storeInput({name : 'state', value : '0' }));
      return; 
    }
    dispatch(profiledataActions.storeInput({name : 'state', value : selectedOptions})); 
  }

  const districtChangeHandler_store = (selectedOptions) => {
    if(selectedOptions === null){
      dispatch(profiledataActions.storeInput({name : 'district', value : '0' }));
      return; 
    }
    dispatch(profiledataActions.storeInput({name : 'district', value : selectedOptions})); 
  }

  const cityChangeHandler_store = (selectedOptions) => {
    if(selectedOptions === null){
      dispatch(profiledataActions.storeInput({name : 'city', value : '0' }));
      return; 
    }
    dispatch(profiledataActions.storeInput({name : 'city', value : selectedOptions})); 
  }

  
  useEffect(() => {

    // const getCustCreationMainId = async () => {
    //   let data = {tokenid: localStorage.getItem("token")}
    //   let response = await axios.post(`${baseUrl}/api/customercreationmain/getmainid`, data);
    //   setMainId(response.data.customercreation.id)
    // }

    // const getFormNo = async () => {
    //   let response = await axios.get(`${baseUrl}/api/customercreation/profile/getFormNo`);
    //   setFormNo(response.data.form_no);
    // }



    const getCountryListOptions = async (savedcountry = null) => {
      setCountryOptions((c) => {
        return { ...c, isLoading: true };
      });
      let countryList = await getCountryData(baseUrl, savedcountry);
      setCountryOptions(countryList);
    };

    const getCustomerSubCategoryList = async () => {
      setcustomersubcategoryOptions((c) => {
        return { ...c, isLoading: true };
      });
      let custsubcatlist = await getCustSubCatList(baseUrl,id);
      setcustomersubcategoryOptions(custsubcatlist)
    }


    const setsavedDataToForm = (savedData) => {
      
      setFormId(savedData.id);
      setFormNo(savedData.form_no);
      setcustomernoValue(savedData.customer_no);
      !(cust_name && cust_name.customername)          && setcustomernameValue(savedData.customer_name);
      !(cust_name && cust_name.customercategory)      && setcustomercategoryValue(savedData.customer_category);
      !(cust_name && cust_name.smartcity)             && setSmartCity(savedData.smart_city);
      !(cust_name && cust_name.customersubcategory)   &&  setcustomersubcategoryValue(CustSubCatgyOpts.find((x) => x.value === savedData.customer_sub_category.toString()));
      //$$$
      !(cust_name && cust_name.pincode)               && setpincodeValue(savedData.pincode===null? "":savedData.pincode.toString());
      !(cust_name && cust_name.phone)                 && setphoneValue(savedData.phone===null ? "": savedData.phone);
      !(cust_name && cust_name.pan)                   && setpanValue(savedData.pan===null? "":savedData.pan);
      !(cust_name && cust_name.mobile)                && setmobilenoValue(savedData.mobile_no=== null ? "": savedData.mobile_no);
      // setcurrentyrdateValue(savedData.current_year_date)
      !(cust_name && cust_name.email)                 && setemailValue(savedData.email===null ? "": savedData.email);
      !(cust_name && cust_name.gstregistered)         && setgstReg((savedData.gst_no===null || savedData.gst_registered === "no") ? "no" : "yes");
      !(cust_name && cust_name.gstregistered)         && ((savedData.gst_no===null || savedData.gst_registered === "no") ? handleGST(true, '') : handleGST(false, savedData.gst_no));

      // !(cust_name && cust_name.gstregistered) && (savedData.gst_no===null || savedData.gst_registered === "no") ? setGstNoDisable(true) : setGstNoDisable(false);
      // savedData.gst_no === null ? setgstnoValue("") :  setgstnoValue(savedData.gst_no)
     
      // setpopulationyrdataValue(savedData.population_year_data)
     
      !(cust_name && cust_name.address) && setaddressValue(savedData.address === null ? "" : savedData.address);
      !(cust_name && cust_name.website) && setwebsiteValue(savedData.website ===null ? "": savedData.website);
    }

    const getprofileofcust = async () => {
      let response = await axios.get(`${baseUrl}/api/customercreationprofile/${id}`);
      setsavedDataToForm(response.data.profiledata);
      setSavedData(response.data.profiledata)
      setFormData(response.data.profiledata)
      getCountryListOptions(response.data.profiledata.country);
      getCustomerSubCategoryList();
    }

    if(id){
      getprofileofcust();
      setCustomerCreationMainID(id);
    }else{
      getCountryListOptions();
      getCustomerSubCategoryList();
      setLoading(false)
    }
    // getCustCreationMainId()
    // getProfileFormData();
  }, [baseUrl]);

  useEffect(() => {
    const data = location.state?.data;
    if(data?.byclicking){
      dispatch(profiledataActions.resetInput())
      dispatch(contactPersonActions.resetInput())
      dispatch(swmprojectstatusActions.resetInput())
      dispatch(ULBDetailsActions.resetInput())
      dispatch(bankDetailsActions.resetInput())
      return;
    }

    if(!cust_name){   
      return
    }
    (cust_name && cust_name.customername) && setcustomernameValue(cust_name.customername);
    (cust_name && cust_name.pincode)      && setpincodeValue(cust_name.pincode);
    (cust_name && cust_name.address)      && setaddressValue(cust_name.address);
    (cust_name && cust_name.phone)        && setphoneValue(cust_name.phone);
    (cust_name && cust_name.pan)          && setpanValue(cust_name.pan);
    (cust_name && cust_name.mobile)       && setmobilenoValue(cust_name.mobile);
    (cust_name && cust_name.email)        && setemailValue(cust_name.email);
    (cust_name && cust_name.website)      && setwebsiteValue(cust_name.website);
    // gstregistered
    (cust_name && cust_name.gstno)        && setgstnoValue(cust_name.gstno);
    (cust_name && cust_name.customercategory) && setcustomercategoryValue(cust_name.customercategory);

    (cust_name && cust_name.smartcity)      && setSmartCity(cust_name.smartcity);
    (cust_name && cust_name.gstregistered)  && setgstReg(cust_name.gstregistered) ; 
    (cust_name && cust_name.gstregistered)  && (cust_name.gstregistered === "no" ? handleGST(true, '') : handleGST(false, cust_name.gstno));   
  }, [])

  const handleGST = (status, gst_no) => {
    if(status){
      setGstNoDisable(true)
      setgstnoValue("")
    }else{
      setGstNoDisable(false)
      if(gst_no === null){
        setgstnoValue("")
      }else{
        setgstnoValue(gst_no)
      }
    }
  }
  
  useEffect(() => {

    if(custsubcategoryOptions.options.length > 0 && cust_name && cust_name.customersubcategory){
      if(cust_name.customersubcategory !== '0'){
        let sustsubcatSelectedOption = custsubcategoryOptions.options.find(
          (x) => x.value === cust_name.customersubcategory.value
        );
        customersubcategoryChangeHandler(sustsubcatSelectedOption);
      }
      return;
    }

    if (Object.keys(formData).length !== 0 && custsubcategoryOptions.options.length > 0) {
      let sustsubcatSelectedOption = custsubcategoryOptions.options.find(
        (x) => x.value === formData.customer_sub_category
      );
      customersubcategoryChangeHandler(sustsubcatSelectedOption)
      // countryChangeHandler(sustsubcatSelectedOption);
    }
  }, [formData, custsubcategoryOptions.options]);


  useEffect(() => {
    if(CountryOptions.options.length > 0 && cust_name && cust_name.country){
      // console.log('country1')
      if(cust_name.country !== '0'){
        let countrySelectedOption = CountryOptions.options.find(
          (x) => x.value === cust_name.country.value
        );
        countryChangeHandler(countrySelectedOption);
      }else{
        setLoading(false)
      }
      return;
    }

    if (Object.keys(formData).length !== 0 && CountryOptions.options.length > 0) {
      // console.log('country2')
      let countrySelectedOption = CountryOptions.options.find(
        (x) => x.value === formData.country
      );
      countryChangeHandler(countrySelectedOption);
    }
  }, [formData, CountryOptions.options]);

  useEffect(() => {

    if(StateOptions.options.length > 0 && cust_name && cust_name.state){
      // console.log('state1')
      if(cust_name.state !== '0'){
      let stateSelectedOption = StateOptions.options.find(
        (x) => x.value === cust_name.state.value
      );
      stateChangeHandler(stateSelectedOption);
      }else{
        setLoading(false)
      }
      return;
    }

    if (Object.keys(formData).length !== 0 && StateOptions.options.length > 0) {
      // console.log('state2')
      let StateSelectedOption = StateOptions.options.find(
        (x) => x.value === formData.state
      );
      stateChangeHandler(StateSelectedOption);
    }
  }, [formData,StateOptions.options]);

 

  useEffect(() => {
    if(DistrictOptions.options.length > 0 && cust_name && cust_name.district){
      if(cust_name.district !== '0'){
        // console.log('district1')
        let districtSelectedOption = DistrictOptions.options.find(
          (x) => x.value === cust_name.district.value
          );
        districtChangeHandler(districtSelectedOption);
      }else{
        setLoading(false)
      }
      return;
    }

    if (Object.keys(formData).length !== 0 && DistrictOptions.options.length > 0) {
      // console.log('district2')
      let districtSelectedOption = DistrictOptions.options.find(
        (x) => x.value === formData.district
      );
      districtChangeHandler(districtSelectedOption);
    }
  }, [formData, DistrictOptions.options]);

  useEffect(() => {
    if(CityOptions.options.length > 0 && cust_name && cust_name.city){
      if(cust_name.city !== '0'){
        let citySelectedOption = CityOptions.options.find(
          (x) => x.value === cust_name.city.value
        );
         cityChangeHandler(citySelectedOption);
      }
      setLoading(false)
      return;
    }

    if (Object.keys(formData).length !== 0 && CityOptions.options.length > 0) {
      let citySelectedOption = CityOptions.options.find(
        (x) => x. value === formData.city
        );
        cityChangeHandler(citySelectedOption);
        setFormData({});
        setLoading(false)
      }
    }, [formData, CityOptions.options]);
    
    useEffect(() => { // to auto generate cust no
      if(!id){
        if(stateValue){
          setCustNoFetching(true)
          let shortcode;
    
          smartcity==="yes" ? (shortcode = "SC") : (shortcode = "NC")

          let data = {
            tokenid : localStorage.getItem('token')
          }
    
          axios.post(`${baseUrl}/api/customercreation/getcustno/${stateValue.value}`,data).then((resp)=>{
            let custno  = resp.data.no;
            custno = String(custno).padStart(2, '0')
            custno = `${stateValue.state_code}-${shortcode}-${custno}`
            setcustomernoValue(custno)
            setCustNoFetching(false)
          })
        
        }
        if(stateValue === null){setcustomernoValue("")}
      }

      if(id && savedData.state && stateValue){
        if(savedData.state === stateValue.value){
          let savedCustNo = savedData.customer_no;
          let savedCustNoArr = savedCustNo.split("-");
          smartcity === "yes" ? setcustomernoValue(`${savedCustNoArr[0]}-SC-${String(savedCustNoArr[2]).padStart(2,'0')}`) : setcustomernoValue(`${savedCustNoArr[0]}-NC-${String(savedCustNoArr[2]).padStart(2,'0')}`)
        }else{
          setCustNoFetching(true)
          let shortcode;
    
          smartcity==="yes" ? (shortcode = "SC") : (shortcode = "NC")

          let data = {
            tokenid : localStorage.getItem('token')
          }
    
          axios.post(`${baseUrl}/api/customercreation/getcustno/${stateValue.value}`,data).then((resp)=>{
            let custno  = resp.data.no;
            custno = String(custno).padStart(2, '0')
            custno = `${stateValue.state_code}-${shortcode}-${custno}`
            setcustomernoValue(custno)
            setCustNoFetching(false)
          })
        }
      }else if(id && savedData.state && !stateValue && isRendered){
        setcustomernoValue("")
      }


  },[stateValue, smartcity])

 

  // const getcustno = (selectedOptions) => {

  //   console.log(selectedOptions, smartcity)

  //   if(selectedOptions === null){setcustomernoValue("") ; return;}

  //   if(selectedOptions){
  //     setCustNoFetching(true)
  //     let shortcode;

  //     smartcity==="yes" ? (shortcode = "SC") : (shortcode = "NC")

  //     axios.get(`${baseUrl}/api/customercreation/getcustno/${selectedOptions.value}`).then((resp)=>{
  //       let custno  = resp.data.no;
  //       custno = String(custno).padStart(2, '0')
  //       custno = `${selectedOptions.state_code}-${shortcode}-${custno}`
  //       setcustomernoValue(custno)
  //       setCustNoFetching(false)
  //     })
  //   }
  //   // if(selectedOptions === null){setcustomernoValue("")}
  // }

  

  const countryChangeHandler = async (selectedOptions, isTouched=null) => {
    if ((countryValue === selectedOptions && countryValue !== null) || selectedOptions===undefined) {
      setLoading(false)
      return;
    }

    countrySelectedValue(selectedOptions);
    isTouched && countryChangeHandler_store(selectedOptions);

    if (selectedOptions === null) {
      resetstatedistrictcity();
      if(isTouched){
        dispatch(profiledataActions.storeInput({name : 'state', value : '0'})); 
        dispatch(profiledataActions.storeInput({name : 'district', value : '0'})); 
        dispatch(profiledataActions.storeInput({name : 'city', value : '0'})); 
      }
      return;
    }
    resetstatedistrictcity();
 
    if(isTouched){
      dispatch(profiledataActions.storeInput({name : 'state', value : null})); 
      dispatch(profiledataActions.storeInput({name : 'district', value : null})); 
      dispatch(profiledataActions.storeInput({name : 'city', value : null})); 
    }
    // setState(null);
    // setDistrict(null);
    // setCity(null);
    renderStateList(selectedOptions, customercategoryValue)
    setDistrictoptions(initialOptions);
    setCityoptions(initialOptions);
    
  };

  const renderStateList = async (selectedOptions, category) => {
    setStateoptions({ ...StateOptions, isLoading: true });
    const stateListData = await getSatateData(baseUrl, selectedOptions.value, category, savedData.state);
    if(stateListData.options.length === 0){
      setLoading(false)
    }
    setStateoptions(stateListData);
  }

  const stateChangeHandler = async (selectedOptions, isTouched=null) => {
    if ((stateValue === selectedOptions && stateValue !== null) || selectedOptions===undefined) {
      setLoading(false)
      return;
    }

    stateSelectedValue(selectedOptions);
    isTouched && stateChangeHandler_store(selectedOptions);

    if (selectedOptions === null) {
      districtSelectedValue(selectedOptions);
      cityChangeHandler(selectedOptions);

      if(isTouched){
        dispatch(profiledataActions.storeInput({name : 'district', value : '0'})); 
        dispatch(profiledataActions.storeInput({name : 'city', value : '0'})); 
      }

      setDistrictoptions(initialOptions);
      setCityoptions(initialOptions);
      return;
    }

    // setDistrict(null);
    // setCity(null);

    districtSelectedValue(null);
    cityChangeHandler(null);

    if(isTouched){
      dispatch(profiledataActions.storeInput({name : 'district', value : null})); 
      dispatch(profiledataActions.storeInput({name : 'city', value : null})); 
    }


    setDistrictoptions({ ...DistrictOptions, isLoading: true });
    const districtListData = await getDistrictData(
      baseUrl,
      countryValue.value,
      selectedOptions.value,
      savedData.district
    );

    if(districtListData.options.length === 0){
      setLoading(false)
    }

    setDistrictoptions(districtListData);
    setCityoptions(initialOptions);
  };

  const districtChangeHandler = async (selectedOptions, isTouched=null) => {

    if ((districtValue === selectedOptions && districtValue !== null) || selectedOptions===undefined) {
      setLoading(false)
      return;
    }

    districtSelectedValue(selectedOptions);
    isTouched && districtChangeHandler_store(selectedOptions);

    if (selectedOptions === null) {
      cityChangeHandler(selectedOptions);
      if(isTouched){
        dispatch(profiledataActions.storeInput({name : 'city', value : '0'})); 
      }
      setCityoptions(initialOptions);
      return;
    }

    // setCity(null); 
    cityChangeHandler(null);
    if(isTouched){
      dispatch(profiledataActions.storeInput({name : 'city', value : null})); 
    }

    // console.log(selectedOptions)
    setCityoptions({ ...CityOptions, isLoading: true });

    const cityListData = await getCityData(
      baseUrl,
      countryValue.value,
      stateValue.value,
      selectedOptions.value,
      savedData.city,
    );

    if(cityListData.options.length === 0){
      setLoading(false)
    };

    setCityoptions(cityListData);
    setIsrendered(true)
  };

  const gstregistered = (e) => {
    setgstReg(e.target.value);
    gstregistered_store(e);
    if (e.target.value === "yes") {
      setGstNoDisable(false);
    } else {
      setGstNoDisable(true);
      setgstnoValue("")
    }
  };

  const resetstatedistrictcity = () => {
    stateSelectedValue(null);
    districtSelectedValue(null);
    cityChangeHandler(null);

    setStateoptions(initialOptions);
    setDistrictoptions(initialOptions);
    setCityoptions(initialOptions);
  }

  const customercategoryhandler = (e) => {
      setcustomercategoryValue(e.target.value)
      customercategoryhandler_store(e)

      dispatch(profiledataActions.storeInput({name : 'state', value : '0'})); 
      dispatch(profiledataActions.storeInput({name : 'district', value : '0'})); 
      dispatch(profiledataActions.storeInput({name : 'city', value : '0'})); 

      resetstatedistrictcity();
      renderStateList(countryValue, e.target.value)
  }

  const smartcityhandler = (e) => {
    smartcityhandler_store(e)
    setSmartCity(e.target.value); 
  }

  const validateInputLength = (value) => {
    let maxLength =255;
    setaddresslength(maxLength-value.length);  
  }
  // const ColourOption = [
  //   { value: "ocean", label: "Ocean" },
  //   { value: "blue", label: "Blue" },
  //   { value: "purple", label: "Purple" },
  //   { value: "red", label: "Red" },
  //   { value: "orange", label: "Orange" },
  //   { value: "yellow", label: "Yellow" },
  //   { value: "green", label: "Green" },
  //   { value: "forest", label: "Forest" },
  //   { value: "slate", label: "Slate" },
  //   { value: "silver", label: "Silver" },
  // ];

  let formIsValid = false;

  if (
    customernoValue &&
    customernameIsValid &&
    customersubcategoryIsValid &&
    stateIsValid &&
    countryIsValid &&
    cityIsValid &&
    districtIsValid 
    // &&
    // addressIsValid &&
    // pincodeIsValid &&
    // // phoneIsValid &&
    // panIsValid &&
    // mobilenoIsValid &&
    // // currentyrdateIsValid &&
    // emailIsValid &&
    // (gstnoIsValid || GstNoDisable)
     // &&
    // populationyrdataIsValid &&
    //websiteIsValid
  ) {
    formIsValid = true;
  }

  const resetall = () => {
    resetcustomerno();
    setcustomercategoryValue("state");
    resetcustomername();
    setSmartCity("yes");
    resetcustomersubcategory();
    resetstate();
    resetcountry();
    resetcity();
    resetdistrict();
    resetpincode();
    resetaddress();
    resetphone();
    resetpan();
    resetmobileno();
    // resetcurrentyrdate();
    resetemail();

    setgstReg("yes");
    resetgstno();
    // resetpopulationyrdata();
    resetwebsite();
  }

  const postData = (data) => {
    axios.post(`${baseUrl}/api/customercreationprofile`, data).then((resp) => {
      if (resp.data.status === 200) {
        setCustomerCreationMainID(resp.data.id)
        toastSuccess(resp.data.message)
        dispatch(profiledataActions.resetInput()); 
        resetall()
        window.history.replaceState({},"Customer Creation", "/tender/master/customercreation/list/main/profile/"+resp.data.id);
        navigate("/tender/master/customercreation/list/main/contactPerson/"+resp.data.id);
      } else if (resp.data.status === 400) {
        toastError(resp.data.message)
      }
      setdatasending(false)
    });
  };

 
  const putData = (data) => {
    
    axios.put(`${baseUrl}/api/customercreationprofile/${formId}`, data).then((resp) => {
      
      if (resp.data.status === 200) {
        toastSuccess(resp.data.message)
        dispatch(profiledataActions.resetInput()); 
        navigate(`/tender/master/customercreation/list/main/contactPerson/${formId}`);
      } else if (resp.data.status === 400) {
        toastError(resp.data.message)
      }
      
      setdatasending(false)
    })
    .catch(()=>{
        toastError("Can't allow empty values")
        setdatasending(false)
    })
  };


  const submitHandler = (event) => {
    event.preventDefault();
    setdatasending(true)

    if (!formIsValid) {
      setdatasending(false)
      return;
    }

    try{
    let profileData = {
      customer_no: customernoValue,
      customer_category: customercategoryValue,
      customer_name: customernameValue,
      smart_city: smartcity,
      customer_sub_category: customersubcategoryValue.value,
      country: countryValue.value,
      state: stateValue.value,
      district: districtValue.value,
      city: cityValue.value,
      pincode: pincodeValue,
      address: addressValue,
      phone: phoneValue,
      pan: panValue,
      mobile_no: mobilenoValue,
      // current_year_date: currentyrdateValue,
      email: emailValue,
      gst_registered: gstReg,
      gst_no: gstnoValue,
      // population_year_data: populationyrdataValue,
      website: websiteValue,
      // cust_creation_mainid : mainid,
    };

    let data = {
      profileData: profileData,
      tokenid: localStorage.getItem("token"),
      form_id: formId,
    };
    // console.log(profileData);
    if(formId === 0){
      postData(data);
    }else if(formId > 0){
      putData(data)
    }
}
catch(ex){
  // console.log(ex);
  toastError("Only allow to Update Not make Empty")
  setdatasending(false)
} ;
  }

  // const [isShow, setIsShow] = useState(false);
  // if (loading == false) {
  //   setIsShow(true);
  // }

  return (
    <Fragment>
    
      <div className="">
      {loading ? (<div className="loading">
        <img id="loading-image" src="/assets/img/282.gif" alt="Loading..." />
      </div> ) :
       (<form onSubmit={submitHandler} >
        {/* <input type = "number" name = "mainid" id = "mainid"  value = {mainid} readOnly={true}/>
        <input type = "number" name = "formNo" id = "formNo"  value = {formNo} readOnly={true}/>
        <input type = "number" name = "formId" id = "formId"  value = {formId} readOnly={true}/>*/}
        <div className="row align-items-center"> 
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-5 ">
                <label htmlFor="customerno" className="pr-3">Customer No <span className="text-danger">&nbsp;*</span> </label>
                {isCustNoFetching && 
                <><span className="spinner-border spinner-border-sm text-danger" role="status" aria-hidden="true"></span>
                <span className="sr-only">Loading...</span></>}
              </div>
              <div className="col-lg-7">
                <input
                  type="text"
                  className="form-control"
                  id="customerno"
                  placeholder=""
                  name="customerno"
                  value={customernoValue}
                  onChange={customernoChangeHandler}
                  onBlur={customernoBlurHandler}
                  disabled={true}
                />
               
                {/* {customernoHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Customer no. is required
                    </span>
                  </div>
                )} */}

              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4" >
            <div className="row align-items-center">
              <div className="col-lg-5 ">
                <label htmlFor="customercategory">Customer Category<span className="text-danger">&nbsp;*</span> </label>
              </div>
              <div className="col-lg-7">
                <div className="form-check form-check-inline">
                  <label
                    className="form-check-label"
                    htmlFor="customercategoryyes"
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="customercategory"
                      id="customercategoryyes"
                      checked={"state" === customercategoryValue}
                      value="state"
                      onChange={(e) =>{ customercategoryhandler(e); 
                          // getcustno(stateValue)
                        } }
                    />
                    State
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <label
                    className="form-check-label"
                    htmlFor="customercategoryno"
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="customercategory"
                      id="customercategoryno"
                      checked={"unionterritory" === customercategoryValue}
                      value="unionterritory"
                      onChange={(e) =>{ customercategoryhandler(e);  
                        //  getcustno(stateValue)
                        } }
                    />
                    Union Territory
                  </label>
                </div>
                {/* <input
                  type="text"
                  className="form-control"
                  id="customercategory"
                  placeholder="Enter Customer Category"
                  name="customercategory"
                  value={customercategoryValue}
                  onChange={customercategoryChangeHandler}
                  onBlur={customercategoryBlurHandler}
                /> */}
                {/* {customercategoryHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Customer Category is required
                    </span>
                  </div>
                )} */}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4" >
            <div className="row align-items-center">
              <div className="col-lg-5 ">
                <label htmlFor="customername">Customer Name<span className="text-danger">&nbsp;*</span> </label>
              </div>
              <div className="col-lg-7">
                <input
                  type="text"
                  className="form-control"
                  id="customername"
                  placeholder="Enter Customer Name"
                  name="customername"
                  value={customernameValue}
                  onChange={e => {customernameChangeHandler(e); customernameChangeHandler_store(e);}} 
                  onBlur={customernameBlurHandler}
                />
                {customernameHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Customer Name is required
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4" >
            <div className="row align-items-center">
              <div className="col-lg-5 ">
                <label htmlFor="smartcity">Smart City<span className="text-danger">&nbsp;*</span> </label>
              </div>
              <div className="col-lg-7">
                <div className="form-check form-check-inline">
                  <label className="form-check-label" htmlFor="smartcityyyes">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="smartcity"
                      id="smartcityyyes"
                      checked={"yes" === smartcity}
                      value="yes"
                      onChange={(e) => {
                        smartcityhandler(e)
                      }}
                    />
                    Yes
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <label className="form-check-label" htmlFor="smartcityno">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="smartcity"
                      id="smartcityno"
                      checked={"no" === smartcity}
                      value="no"
                      onChange={(e) => {
                        smartcityhandler(e)
                      }}
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4" >
            <div className="row align-items-center">
              <div className="col-lg-5 ">
                <label htmlFor="customersubcategory">
                  Customer Sub Category<span className="text-danger">&nbsp;*</span>
                </label>
              </div>
              <div className="col-lg-7">
                <Select
                  name="customersubcategory"
                  id="customersubcategory"
                  isSearchable="true"
                  isClearable="true"
                  options={custsubcategoryOptions.options}
                  onChange={(selectedOptions) => {customersubcategoryChangeHandler(selectedOptions); customersubcategoryChangeHandler_store(selectedOptions)}}
                  onBlur={customersubcategoryBlurHandler}
                  value={customersubcategoryValue}
                  isLoading={custsubcategoryOptions.isLoading}
                ></Select>
                {customersubcategoryHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Customer Sub. Category is required
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4" >
            <div className="row align-items-center">
              <div className="col-lg-5 ">
                <label htmlFor="country">Country<span className="text-danger">&nbsp;*</span> </label>
              </div>
              <div className="col-lg-7">
                <Select
                  name="country"
                  id="country"
                  isSearchable="true"
                  options={CountryOptions.options}
                  isClearable="true"
                  onChange={(selectedOptions) => {countryChangeHandler(selectedOptions, 1)}}
                  onBlur={countryBlurHandler}
                  value={countryValue}
                  isLoading={CountryOptions.isLoading}
                ></Select>
                {countryHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Country is required
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4" >
            <div className="row align-items-center">
              <div className="col-lg-5 ">
                <label htmlFor="state">State<span className="text-danger">&nbsp;*</span> </label>
              </div>
              <div className="col-lg-7">
                <Select
                  name="state"
                  id="state"
                  isSearchable="true"
                  isClearable="true"
                  options={StateOptions.options}
                  onChange={(selectedOptions) =>{ stateChangeHandler(selectedOptions, 1); 
                    // getcustno(selectedOptions);
                   }}
                  onBlur={stateBlurHandler}
                  value={stateValue}
                  isLoading={StateOptions.isLoading}
                ></Select>
                {stateHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      State is required
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4" >
            <div className="row align-items-center">
              <div className="col-lg-5 ">
                <label htmlFor="distrit">District <span className="text-danger">&nbsp;*</span> </label>
              </div>
              <div className="col-lg-7">
                <Select
                  name="distrit"
                  id="distrit"
                  isSearchable="true"
                  options={DistrictOptions.options}
                  isClearable="true"
                  onChange={(selectedOptions) => {districtChangeHandler(selectedOptions, 1); }}
                  onBlur={districtBlurHandler}
                  value={districtValue}
                  isLoading={DistrictOptions.isLoading}
                ></Select>
                {districtHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      District is required
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4" >
            <div className="row align-items-center">
              <div className="col-lg-5 ">
                <label htmlFor="city">City/Town/Village<span className="text-danger">&nbsp;*</span> </label>
              </div>
              <div className="col-lg-7">
                <Select
                  name="city"
                  id="city"
                  isSearchable="true"
                  options={CityOptions.options}
                  isClearable="true"
                  onChange={(selectedOptions) => {cityChangeHandler(selectedOptions); cityChangeHandler_store(selectedOptions)}}
                  onBlur={cityBlurHandler}
                  value={cityValue}
                  isLoading={CityOptions.isLoading}
                ></Select>
                {cityHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      City is required
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4" >
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-5 ">
                <label htmlFor="pincode">Pincode 
                {/* <span className="text-danger">&nbsp;*</span> */}
                 </label>
              </div>
              <div className="col-lg-7">
                <input
                  type="number"
                  className="form-control"
                  id="pincode"
                  placeholder="Enter Pincode"
                  name="pincode"
                  value={pincodeValue}
                  onChange={e => {pincodeChangeHandler(e) ; pincodeChangeHandler_store(e)}}
                  // onBlur={pincodeBlurHandler}
                />
                {pincodeHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Pincode is  Invalid!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4" >
            <div className="row font-weight-bold">
              <div className="col-lg-5  mt-2">
                <label htmlFor="address">Address
                {/* <span className="text-danger">&nbsp;*</span> */}
                </label>
                <p className="text-info font-weight-bold mt-n3"><small><b>({addresslen} Characters Remaining) </b></small></p> 
              </div>
              <div className="col-lg-7">
                <textarea
                  className="form-control"
                  id="address"
                  placeholder="Enter Address"
                  name="address"
                  rows="3"
                  onChange={e => {addressChangeHandler(e) ; addressChangeHandler_store(e)}}
                  // onBlur={addressBlurHandler}
                  value={addressValue}
                  onKeyUp={(e) => validateInputLength(e.target.value)}
                  maxLength="255"
                ></textarea>
                {addressHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Address is required.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4" >
            <div className="row align-items-center font-weight-bold  mb-4">
              <div className="col-lg-5 ">
                <label htmlFor="phone">Phone &nbsp;</label>
              </div>
              <div className="col-lg-7">
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  placeholder="Enter Phone No."
                  name="phone"
                  value={phoneValue}
                  onChange={e => {phoneChangeHandler(e); phoneChangeHandler_store(e)}}
                  // onBlur={phoneBlurHandler}
                />
                {phoneHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Phone is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-5 ">
                <label htmlFor="pan">Pan{/*<span className="text-danger">&nbsp;*</span>*/}</label>
                <p className="text-info font-weight-bold mt-n3"><small><b>(Example: FDTPM0000D)</b></small></p> 
              </div>
              <div className="col-lg-7">
                <input
                  type="text"
                  className="form-control"
                  id="pan"
                  placeholder="Enter PAN"
                  name="pan"
                  value={panValue}
                  onChange={e => {panChangeHandler(e); panChangeHandler_store(e)}}
                  // onBlur={panBlurHandler}
                />
                {panHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      PAN is Invalid.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4" >
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-5 ">
                <label htmlFor="mobile">Mobile No 
                {/* <span className="text-danger">&nbsp;*</span> */}
                </label>
              </div>
              <div className="col-lg-7">
                <input
                  type="text"
                  className="form-control"
                  id="mobile"
                  placeholder="Enter Mobile No"
                  name="mobile"
                  value={mobilenoValue}
                  onChange={e => {mobilenoChangeHandler(e); mobilenoChangeHandler_store(e)}}
                  // onBlur={mobilenoBlurHandler}
                />
                {mobilenoHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Mobile no is InValid.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-6 ">
                <label htmlFor="currentyrdate">Current Year/Date &nbsp;</label>
              </div>
              <div className="col-lg-6">
                <input
                  type="date"
                  className="form-control"
                  id="currentyrdate"
                  placeholder="Enter Date"
                  name="currentyrdate"
                  value={currentyrdateValue}
                  onChange={currentyrdateChangeHandler}
                  onBlur={currentyrdateBlurHandler}
                />
                {currentyrdateHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      This Field is required
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div> */}
          <div className="inputgroup col-lg-6 mb-4"
            initial={{y:80, opacity: 0}} 
            animate={{y:0, opacity: 1}}    
            transition={{ delay: .6, type:'spring', stiffness: 180}} >
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-5 ">
                <label htmlFor="email">Email
                {/* <span className="text-danger">&nbsp;*</span> */}
                </label>
              </div>
              <div className="col-lg-7">
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder="Enter Email"
                  name="email"
                  value={emailValue}
                  onChange={e => {emailChangeHandler(e); emailChangeHandler_store(e)}}
                  // onBlur={emailBlurHandler}
                />
                {emailHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Enter Valid e-mail
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-5 ">
                <label htmlFor="website">Website &nbsp;</label>
              </div>
              <div className="col-lg-7">
                <input
                  type="text"
                  className="form-control"
                  id="website"
                  placeholder="Enter Website"
                  name="website"
                  value={websiteValue}
                  onChange={e => {websiteChangeHandler(e); websiteChangeHandler_store(e)}}
                  // onBlur={websiteBlurHandler}
                />
                {websiteHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Website is Invalid.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4"></div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center">
              <div className="col-lg-5 ">
                <label htmlFor="gstregistered">GST Registered&nbsp;</label>
               
              </div>
              <div className="col-lg-7">
                <div className="form-check form-check-inline">
                  <label
                    className="form-check-label"
                    htmlFor="gstregisteredyes"
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gstregistered"
                      id="gstregisteredyes"
                      checked={"yes" === gstReg}
                      value="yes"
                      onChange={gstregistered}
                    />
                    Yes
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <label className="form-check-label" htmlFor="gstregisteredno">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gstregistered"
                      id="gstregisteredno"
                      checked={"no" === gstReg }
                      value="no"
                      onChange={gstregistered}
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-5 ">
                <label htmlFor="gstno">GST No.
                {/* <span className="text-danger">&nbsp;*</span> */}
                </label>
                {!GstNoDisable && <p className="text-info font-weight-bold mt-n3"><small><b>(Ex : 22AAAAA0000A1Z5)</b></small></p> }
              </div>
              <div className="col-lg-7">
                <input
                  type="text"
                  className="form-control"
                  id="gstno"
                  placeholder="Enter GST No"
                  name="gstno"
                  value={gstnoValue}
                  onChange={e => {gstnoChangeHandler(e); gstnoChangeHandler_store(e)}}
                  // onBlur={gstnoBlurHandler}
                  disabled={GstNoDisable}
                />
                {gstnoHasError && !GstNoDisable && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Enter Valid GST No.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-lg-12 text-center">
            {!id && <button
             className={(!formIsValid) ?  "btn btn-outline-primary rounded-pill" :  "btn btn-primary rounded-pill"} 
              disabled={!formIsValid || isdatasending}
            >
              {isdatasending && <span className="spinner-border spinner-border-sm mr-2"></span> }
              {isdatasending && "Saving..."}
              {!isdatasending && "Save & Continue"}
            </button>}
            {id && 
              <button
              className={(!formIsValid) ?  "btn btn-outline-primary rounded-pill" :  "btn btn-primary rounded-pill"} 
              disabled = {!formIsValid || isdatasending}
            >
              {isdatasending && <span className="spinner-border spinner-border-sm mr-2"></span> }
              {isdatasending && "Updating..."}
              {!isdatasending && "Edit & Continue"}
              </button>}
            <button className="btn  btn-outline-dark ml-3 rounded-pill"
            onClick = {() => navigate("/tender/master/customercreation/list")}
            disabled ={isdatasending}
            >
              Cancel
            </button>
          </div>
        </div>
      </form> ) }
      </div>
      
    </Fragment>
  );
};
export default CustomerCreationProfile;
