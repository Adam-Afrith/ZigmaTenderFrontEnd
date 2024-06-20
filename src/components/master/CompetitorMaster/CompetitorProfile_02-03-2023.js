import { usePageTitle } from "../../hooks/usePageTitle";
import { Fragment, useState } from "react";
import Select from "react-select";
import { useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import PreLoader from "../../UI/PreLoader";

const registrationTypeList = [
  { value: 0, label: "Registered" },
  { value: 1, label: "Section 8 Company" },
  { value: 2, label: "Partnership" },
  { value: 3, label: "Proprietor" },
  { value: 4, label: "Private Limited Company" },
  { value: 5, label: "Public Limited Company" },
  { value: 6, label: "Limited Liability Partnership" },
  { value: 7, label: "One Person Company" },
  { value: 8, label: "Sole Proprietorship" },
];
const companyTypeList = [
  { value: "0", label: "Work Contract Services" },
  { value: "1", label: "Factory / Manufacturing" },
  { value: "2", label: "Service Provider or Other" },
  { value: "3", label: "Retail Business" },
  { value: "4", label: "Engineering Service and Consulting" },
];

const CompetitorProfile = () => {
  const { id } = useParams();
  usePageTitle("Competitor Creation");
  const [competitorId, setCompetitorId] = useOutletContext();
  const { server1: baseUrl } = useBaseUrl();
  const navigate = useNavigate();
  const [hasError, setHasError] = useState({
    compNo: null,
    compName: null,
    registrationType: null,
    registerationYear: null,
    country: null,
    state: null,
    district: null,
    city: null,
    address: null,
    pincode: null,
    panNo: null,
    mobile: null,
    email: null,
    gstNo: null,
    directors: null,
    companyType: null,
    manpower: null,
  });
  const intialValues = {
    compNo: "",
    compName: "",
    registrationType: "",
    registerationYear: "",
    country: "",
    state: "",
    district: "",
    city: "",
    address: "",
    pincode: "",
    panNo: "",
    mobile: "",
    email: "",
    gstNo: "",
    directors: "",
    companyType: "",
    manpower: "",
  };
  // const [remainingCharCount, setRemaingCharCount]=useState({
  //   compName: 255,
  //   registerationYear: 4,
  //   address: "",
  //   pincode: 6,
  //   panNo: 10,
  //   mobile: 10,
  //   email: 255,
  //   gstNo: 15,
  //   directors: 255,
  //   manpower: 255,
  // });
  const [competitorFormInput, setCompetitorFormInput] = useState(intialValues);
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [formIsValid, setFormIsValid] = useState(false);
  const [fetchingData, setFetchingData] = useState({
    compNo: "",
    compName: "",
    registrationType: "",
    registerationYear: "",
    country: "",
    state: "",
    district: "",
    city: "",
    address: "",
    pincode: "",
    panNo: "",
    mobile: "",
    email: "",
    gstNo: "",
    directors: "",
    companyType: "",
    manpower: "",
  });
  const [isChanged, setIsChanged] = useState({
    country: false,
    state: false,
    district: false,
    city: false,
  });
  const [fetchLoading, setFetchingLoading]=useState(true);

  useEffect(() => {
    if (id) {
      editCompetitor();
      setCompetitorId(id);
    }
    getCountryList();
  }, []);

  const getCountryList = async () => {
    await axios.get(`${baseUrl}/api/country/list`).then((resp) => {
      setCountryList(resp.data.countryList);
    });
  };

  //set Country on Edit
  useEffect(() => {
    if (
      id &&
      fetchingData.country !== "" &&
      countryList.length > 0 &&
      isChanged.country === false
    ) {
      setCompetitorFormInput({
        ...competitorFormInput,
        country: countryList.find((x) => x.value === fetchingData.country),
      });
    }
  }, [countryList, fetchingData]);

  //Get State  for New or modification
  useEffect(() => {
    if (competitorFormInput.country !== null && isChanged.country === true) {
      setCompetitorFormInput((prev) => {
        return { ...prev, state: null, district: null, city: null };
      });
      getStateList();
    } else if (
      competitorFormInput.country !== null &&
      isChanged.country === false
    ) {
      getStateList();
    } else if (competitorFormInput.country === null) {
      setStateList([]);
      setCompetitorFormInput((prev) => {
        return { ...prev, state: null, district: null, city: null };
      });
    }
  }, [competitorFormInput.country]);

  //set State on Edit
  useEffect(() => {
    if (
      fetchingData.state !== "" &&
      isChanged.country === false &&
      competitorFormInput.country !== null &&
      stateList.length > 0
    ) {
      setCompetitorFormInput((prev) => {
        return {
          ...prev,
          state: stateList.find((x) => x.value === fetchingData.state),
          district: null,
          city: null,
        };
      });
    } else {
      setCompetitorFormInput((prev) => {
        return { ...prev, district: null, city: null };
      });
      setDistrictList([]);
    }
  }, [stateList]);

  //set District for New or modification Branch
  useEffect(() => {
    if (competitorFormInput.state !== null && isChanged.state === false) {
      getDistrictList();
    } else if (competitorFormInput.state !== null && isChanged.state === true) {
      getDistrictList();
      setCompetitorFormInput((prev) => {
        return { ...prev, district: null, city: null };
      });
    } else if (competitorFormInput.state === null) {
      setCompetitorFormInput((prev) => {
        return { ...prev, district: null, city: null };
      });
      setDistrictList([]);
    }
  }, [competitorFormInput.state]);

  //set District on Edit
  useEffect(() => {
    if (
      fetchingData.district !== "" &&
      isChanged.state === false &&
      competitorFormInput.state !== null &&
      districtList.length > 0
    ) {
      setCompetitorFormInput((prev) => {
        return {
          ...prev,
          district: districtList.find((x) => x.value === fetchingData.district),
          city: null,
        };
      });
    } else {
      setCompetitorFormInput((prev) => {
        return { ...prev, city: null };
      });
      setCityList([]);
    }
  }, [districtList]);

  //set City for New or modification Branch
  useEffect(() => {
    if (competitorFormInput.district !== null && isChanged.district === false) {
      getCityList();
    } else if (
      competitorFormInput.district !== null &&
      isChanged.district === true
    ) {
      getCityList();
      setCompetitorFormInput((prev) => {
        return { ...prev, city: null };
      });
    } else if (competitorFormInput.district === null) {
      setCityList([]);
      setCompetitorFormInput((prev) => {
        return { ...prev, city: null };
      });
    }
  }, [competitorFormInput.district]);

  useEffect(() => {
    if (id && cityList.length > 0 && isChanged.city === false) {
      setCompetitorFormInput({
        ...competitorFormInput,
        city: cityList.find((x) => x.value === fetchingData.city),
      });
      setFetchingLoading(false);
    }
   
  }, [cityList]);

  const getStateList = async () => {
    if (competitorFormInput.country !== null) {
      await axios
        .get(`${baseUrl}/api/state/list/${competitorFormInput.country.value}`)
        .then((resp) => {
          setStateList(resp.data.stateList);
        });
    }
  };
  const getDistrictList = async () => {
    if (
      competitorFormInput.country !== null &&
      competitorFormInput.state !== null
    ) {
      await axios
        .get(
          `${baseUrl}/api/district/list/${competitorFormInput.country.value}/${competitorFormInput.state.value}`
        )
        .then((resp) => {
          setDistrictList(resp.data.districtList);
        });
    }
  };
  const getCityList = async () => {
    if (
      competitorFormInput.country !== null &&
      competitorFormInput.state !== null &&
      competitorFormInput.district !== null
    ) {
      await axios
        .get(
          `${baseUrl}/api/city/list/${competitorFormInput.country.value}/${competitorFormInput.state.value}/${competitorFormInput.district.value}/null`
        )
        .then((resp) => {
          setCityList(resp.data.cityList);
        });
    }
  };

  useEffect(() => {
    if (id && fetchingData.registrationType !== "") {
      setCompetitorFormInput((prev) => {
        return {
          ...prev,
          registrationType: registrationTypeList.find(
            (x) => x.value === parseInt(fetchingData.registrationType)
          ),
        };
      });
    }
  }, [fetchingData]);
  useEffect(() => {
    if (id && fetchingData.companyType !== "") {
      setCompetitorFormInput((prev) => {
        return {
          ...prev,
          companyType: companyTypeList.find(
            (x) => x.value === fetchingData.companyType
          ),
        };
      });
    }
  }, [fetchingData]);

  useEffect(() => {
    if (!isNaN(id)) {
      setCompetitorFormInput((prev) => {
        return {
          ...prev,
          compNo: fetchingData.compNo,
          compName: fetchingData.compName,
          registerationYear: fetchingData.registerationYear,
          address: fetchingData.address,
          pincode: fetchingData.pincode,
          panNo: fetchingData.panNo,
          mobile: fetchingData.mobile,
          email: fetchingData.email,
          gstNo: fetchingData.gstNo,
          directors: fetchingData.directors,
          manpower: fetchingData.manpower,
        };
      });
    }
    else{
      setFetchingLoading(false);
    }
  }, [fetchingData]);
  const editCompetitor = () => {
    axios.get(`${baseUrl}/api/competitorprofile/${id}`).then((resp) => {
      setFetchingData({
        compNo: resp.data.competitor.compNo,
        compName: resp.data.competitor.compName,
        registerationYear: resp.data.competitor.registerationYear,
        country: resp.data.competitor.country,
        state: resp.data.competitor.state,
        district: resp.data.competitor.district,
        city: resp.data.competitor.city,
        address: resp.data.competitor.address,
        pincode: resp.data.competitor.pincode,
        panNo: resp.data.competitor.panNo,
        mobile: resp.data.competitor.mobile,
        email: resp.data.competitor.email,
        gstNo: resp.data.competitor.gstNo,
        directors: resp.data.competitor.directors,
        registrationType: resp.data.competitor.registrationType,
        companyType: resp.data.competitor.companyType,
        manpower: resp.data.competitor.manpower,
      });
      document.getElementById("dis").setAttribute("value", "2");
      document.getElementById("dis").setAttribute("defaultValue", "");
      setHasError({
        compNo: false,
        compName: false,
        registrationType: false,
        registerationYear: false,
        country: false,
        state: false,
        district: false,
        city: false,
        address: false,
        pincode: false,
        panNo: false,
        mobile: false,
        email: false,
        gstNo: false,
        directors: false,
        companyType: false,
        manpower: false,
      });
      setFormIsValid(true);
    });
    
  };

  useEffect(() => {
    if (
      hasError.compName !== null &&
      hasError.compName !== true &&
      hasError.registrationType !== null &&
      hasError.registrationType !== true &&
      hasError.registerationYear !== null &&
      hasError.registerationYear !== true &&
      hasError.country !== null &&
      hasError.country !== true &&
      hasError.state !== null &&
      hasError.state !== true &&
      hasError.district !== null &&
      hasError.district !== true &&
      hasError.city !== null &&
      hasError.city !== true &&
      hasError.panNo !== null &&
      hasError.panNo !== true &&
      hasError.gstNo !== null &&
      hasError.gstNo !== true &&
      hasError.mobile !== null &&
      hasError.mobile !== true &&
      hasError.compNo !== null &&
      hasError.compNo !== true &&
      hasError.address !== null &&
      hasError.address !== true &&
      hasError.pincode !== null &&
      hasError.pincode !== true &&
      hasError.email !== null &&
      hasError.email !== true &&
      hasError.directors !== null &&
      hasError.directors !== true &&
      hasError.companyType !== null &&
      hasError.companyType !== true &&
      hasError.manpower !== null &&
      hasError.manpower !== true &&
      JSON.stringify(competitorFormInput) !== JSON.stringify(intialValues)
    ) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [hasError]);

  //Set Text Input Values
  const textInputHandler = (e) => {
    setCompetitorFormInput({
      ...competitorFormInput,
      [e.target.name]: e.target.value,
    });

    switch (e.target.name) {
      case "pincode":
        if (!/^[1-9][0-9]{5}$/.test(e.target.value)) {
          setHasError({ ...hasError, pincode: true });
        } else {
          setHasError({ ...hasError, pincode: false });
        }
        break;

      case "registerationYear":
        if (
          (e.target.value > today.getFullYear()) |
          (e.target.value < 1900) |
          isNaN(e.target.value)
        ) {
          setHasError({ ...hasError, registerationYear: true });
        } else {
          setHasError({ ...hasError, registerationYear: false });
        }
        break;
      case "mobile":
        if (
          e.target.value.trim() === "" ||
          e.target.value === null ||
          !/^[6-9]{1}[0-9]{9}$/.test(e.target.value)
        ) {
          setHasError({ ...hasError, mobile: true });
        } else {
          setHasError({ ...hasError, mobile: false });
        }
        break;
      case "email":
        if (
          e.target.value.trim() === "" ||
          e.target.value === null ||
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e.target.value)
        ) {
          setHasError({ ...hasError, email: true });
        } else {
          setHasError({ ...hasError, email: false });
        }
        break;
      case "gstNo":
        if (
          e.target.value.trim() === "" ||
          e.target.value === null ||
          !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
            e.target.value
          )
        ) {
          setHasError({ ...hasError, gstNo: true });
        } else {
          setHasError({ ...hasError, gstNo: false });
        }
        break;
      case "panNo":
        if (
          e.target.value.trim() === "" ||
          e.target.value === null ||
          !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(e.target.value)
        ) {
          setHasError({ ...hasError, panNo: true });
        } else {
          setHasError({ ...hasError, panNo: false });
        }
        break;
      case "manpower":
        if (
          e.target.value.trim() === "" ||
          e.target.value === null ||
          !/^[0-9]{1,5}$/.test(e.target.value)
        ) {
          setHasError({ ...hasError, manpower: true });
        } else {
          setHasError({ ...hasError, manpower: false });
        }
        break;

      default:
        // setFormIsValid(true);
        if (e.target.value.trim() === "" || e.target.value === null) {
          setHasError({ ...hasError, [e.target.name]: true });
        } else {
          setHasError({ ...hasError, [e.target.name]: false });
        }
    }
  };

  //Set select Input Values
  const selectInputHandler = (value, action) => {
    // if(id){
    //   setIsChanged({isChanged, [action.name]:true});
    // }
    switch (action.name) {
      case "country":
        setIsChanged({
          country: true,
          state: true,
          district: true,
          city: true,
        });
        break;
      case "state":
        setIsChanged({
          country: false,
          state: true,
          district: true,
          city: true,
        });
        break;
      case "district":
        setIsChanged({
          country: false,
          state: false,
          district: true,
          city: true,
        });
        break;
      case "city":
        setIsChanged({
          country: false,
          state: false,
          district: false,
          city: true,
        });
        break;
    }
    setCompetitorFormInput({ ...competitorFormInput, [action.name]: value });
    if (value === "" || value === null) {
      setHasError({ ...hasError, [action.name]: true });
    } else {
      setHasError({ ...hasError, [action.name]: false });
    }
  };

  const onBlurSelectHandler = (e) => {
    switch (e.target.name) {
      case "pincode":
        if (!/^[1-9][0-9]{5}$/.test(e.target.value)) {
          setHasError({ ...hasError, pincode: true });
        } else {
          setHasError({ ...hasError, pincode: false });
        }
        break;

      case "registerationYear":
        if (
          (e.target.value > today.getFullYear()) |
          (e.target.value < 1900) |
          isNaN(e.target.value)
        ) {
          setHasError({ ...hasError, registerationYear: true });
        } else {
          setHasError({ ...hasError, registerationYear: false });
        }
        break;
      case "mobile":
        if (
          e.target.value.trim() === "" ||
          e.target.value === null ||
          !/^[6-9]{1}[0-9]{9}$/.test(e.target.value)
        ) {
          setHasError({ ...hasError, mobile: true });
        } else {
          setHasError({ ...hasError, mobile: false });
        }
        break;
      case "email":
        if (
          e.target.value.trim() === "" ||
          e.target.value === null ||
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e.target.value)
        ) {
          setHasError({ ...hasError, email: true });
        } else {
          setHasError({ ...hasError, email: false });
        }
        break;
      case "gstNo":
        if (
          e.target.value.trim() === "" ||
          e.target.value === null ||
          !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
            e.target.value
          )
        ) {
          setHasError({ ...hasError, gstNo: true });
        } else {
          setHasError({ ...hasError, gstNo: false });
        }
        break;
      case "panNo":
        if (
          e.target.value.trim() === "" ||
          e.target.value === null ||
          !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(e.target.value)
        ) {
          setHasError({ ...hasError, panNo: true });
        } else {
          setHasError({ ...hasError, panNo: false });
        }
        break;
      case "manpower":
        if (
          e.target.value.trim() === "" ||
          e.target.value === null ||
          !/^[0-9]{1,5}$/.test(e.target.value)
        ) {
          setHasError({ ...hasError, manpower: true });
        } else {
          setHasError({ ...hasError, manpower: false });
        }
        break;

      default:
        // setFormIsValid(true);
        if (e.target.value.trim() === "" || e.target.value === null) {
          setHasError({ ...hasError, [e.target.name]: true });
        } else {
          setHasError({ ...hasError, [e.target.name]: false });
        }
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    let tokenId = localStorage.getItem("token");
    var registrationTypeInt = competitorFormInput.registrationType.value + "";
    const data = {
      compNo: competitorFormInput.compNo,
      compName: competitorFormInput.compName,
      registrationType: registrationTypeInt,
      registerationYear: competitorFormInput.registerationYear,
      country: competitorFormInput.country.value,
      state: competitorFormInput.state.value,
      district: competitorFormInput.district.value,
      city: competitorFormInput.city.value,
      address: competitorFormInput.address,
      pincode: competitorFormInput.pincode,
      panNo: competitorFormInput.panNo,
      mobile: competitorFormInput.mobile,
      email: competitorFormInput.email,
      gstNo: competitorFormInput.gstNo,
      directors: competitorFormInput.directors,
      companyType: competitorFormInput.companyType.value,
      manpower: competitorFormInput.manpower,
      tokenId: tokenId,
    };

    axios.post(`${baseUrl}/api/competitorprofile`, data).then((res) => {
      if (res.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Competitor",
          text: res.data.message,
          confirmButtonColor: "#5156ed",
        }).then(function () {
          setLoading(false);
          navigate(
            `/tender/master/competitorcreation/competitor/details/${res.data.inserted_id}`
          );
        });

        document.getElementById("dis").setAttribute("value", "2");
        document.getElementById("dis").setAttribute("defaultValue", "");
      } else if (res.data.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Competitor",
          text: res.data.message,
          confirmButtonColor: "#5156ed",
        }).then(function () {
          setLoading(false);
        });
      }
    });
  };

  const updateHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    let tokenId = localStorage.getItem("token");
    const data = {
      compNo: competitorFormInput.compNo,
      compName: competitorFormInput.compName,
      registrationType: competitorFormInput.registrationType.value,
      registerationYear: competitorFormInput.registerationYear,
      country: competitorFormInput.country.value,
      state: competitorFormInput.state.value,
      district: competitorFormInput.district.value,
      city: competitorFormInput.city.value,
      address: competitorFormInput.address,
      pincode: competitorFormInput.pincode,
      panNo: competitorFormInput.panNo,
      mobile: competitorFormInput.mobile,
      email: competitorFormInput.email,
      gstNo: competitorFormInput.gstNo,
      directors: competitorFormInput.directors,
      companyType: competitorFormInput.companyType.value,
      manpower: competitorFormInput.manpower,
      tokenId: tokenId,
    };

    if (
      data.compName === fetchingData.compName &&
      data.registerationYear === fetchingData.registerationYear &&
      data.registrationType === parseInt(fetchingData.registrationType) &&
      data.country === fetchingData.country &&
      data.state === fetchingData.state &&
      data.district === fetchingData.district &&
      data.city === fetchingData.city &&
      data.address === fetchingData.address &&
      data.pincode === fetchingData.pincode &&
      data.mobile === fetchingData.mobile &&
      data.panNo === fetchingData.panNo &&
      data.email === fetchingData.email &&
      data.gstNo === fetchingData.gstNo &&
      data.directors === fetchingData.directors &&
      data.companyType === fetchingData.companyType &&
      data.manpower === fetchingData.manpower
    ) {
      Swal.fire({
        icon: "info",
        title: "Competitor",
        text: "Nothing Has Changed to Update...!",
        timer: 2000,
      }).then(function () {
        setLoading(false);
      });
    } else {
      axios.put(`${baseUrl}/api/competitorprofile/${id}`, data).then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Competitor",
            text: res.data.message,
            confirmButtonColor: "#5156ed",
          }).then(function () {
            setLoading(false);
            navigate(
              "/tender/master/competitorcreation/competitor/details/${res.data.inserted_id}"
            );
          });
        } else if (res.data.status === 404) {
          Swal.fire({
            icon: "error",
            title: "Competitor",
            text: res.data.message,
            confirmButtonColor: "#5156ed",
          });
        }
        setLoading(false);
      });
    }
  };

  const cancelHandler = () => {
    navigate("/tender/master/competitorcreation/");
  };

  return (
    <Fragment>
      <PreLoader loading={fetchLoading}>
        <form onSubmit={submitHandler}>
          <div className="row align-items-center">
            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-4 text-dark">
                  <label htmlFor="no">
                    Competitor No<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    className="form-control"
                    id="compNo"
                    placeholder=""
                    name="compNo"
                    value={competitorFormInput.compNo}
                    onChange={textInputHandler}
                    // ////onBlur={onBlurSelectHandler}
                    disabled={false}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>

            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark">
                  <label
                    htmlFor="customercategory"
                    className="font-weight-bold"
                  >
                    Competitor Name<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <input type="hidden" id="dis" name="dis" defaultValue="1" />
                  <input
                    type="text"
                    className="form-control"
                    id="compName"
                    placeholder="Enter Competitor Name"
                    name="compName"
                    value={competitorFormInput.compName}
                    onChange={textInputHandler}
                    ////onBlur={onBlurSelectHandler}
                  />
                  {hasError.compName && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Competitor Name is Invalid..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>

            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark">
                  <label htmlFor="regType" className="font-weight-bold">
                    Registration Type
                    <span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <Select
                    name="registrationType"
                    id="registrationType"
                    isSearchable="true"
                    isClearable="true"
                    options={registrationTypeList}
                    value={competitorFormInput.registrationType}
                    onChange={selectInputHandler}
                    ////onBlur={onBlurSelectHandler}
                  ></Select>
                  {hasError.registrationType && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Select Registration Type..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>

            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold">
                  <label htmlFor="registerationYear">
                    Registeration Year
                    <span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    className="form-control"
                    id="registerationYear"
                    placeholder="YYYY"
                    name="registerationYear"
                    value={competitorFormInput.registerationYear}
                    onChange={textInputHandler}
                    ////onBlur={onBlurSelectHandler}
                  />
                  {hasError.registerationYear && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Registration Year is Invalid..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>
            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark">
                  <label htmlFor="country" className="font-weight-bold">
                    Country<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <Select
                    name="country"
                    id="country"
                    isSearchable="true"
                    isClearable="true"
                    options={countryList}
                    value={competitorFormInput.country}
                    onChange={selectInputHandler}
                    //onBlur={onBlurSelectHandler}
                  ></Select>
                  {hasError.country && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Select Competitor Country..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>

            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold">
                  <label htmlFor="state">
                    State/UT<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <Select
                    name="state"
                    id="state"
                    isSearchable="true"
                    isClearable="true"
                    options={stateList}
                    onChange={selectInputHandler}
                    // onBlur="{customersubcategoryBlurHandler}"
                    value={competitorFormInput.state}
                  ></Select>
                  {hasError.state && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Select Competitor State..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>

            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark">
                  <label htmlFor="district" className="font-weight-bold">
                    District<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <Select
                    name="district"
                    id="district"
                    isSearchable="true"
                    isClearable="true"
                    options={districtList}
                    onChange={selectInputHandler}
                    //onBlur={district}
                    value={competitorFormInput.district}
                  ></Select>
                  {hasError.district && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Select Competitor District..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>

            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold">
                  <label htmlFor="city">
                    City<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <Select
                    name="city"
                    id="city"
                    isSearchable="true"
                    isClearable="true"
                    options={cityList}
                    onChange={selectInputHandler}
                    //onBlur="{city}"
                    value={competitorFormInput.city}
                  ></Select>
                  {hasError.city && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Select Competitor City..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>
            <div className="inputgroup col-lg-5 mb-4 ">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-4 text-dark">
                  <label htmlFor="address">
                    Address<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <textarea
                    className="form-control"
                    rows="3"
                    id="address"
                    name="address"
                    value={competitorFormInput.address}
                    onChange={textInputHandler}
                    //onBlur={onBlurSelectHandler}
                    placeholder="#Door No, Street,
                   Area,
                   Landmark"
                  />
                  {hasError.address && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Address is Invalid..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-1"></div>
            <div className="inputgroup col-lg-5 mt-n4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold">
                  <label htmlFor="pincode" className="">
                    Pincode<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    className="form-control"
                    id="pincode"
                    placeholder="Ex: 638001"
                    name="pincode"
                    value={competitorFormInput.pincode}
                    onChange={textInputHandler}
                    //onBlur={onBlurSelectHandler}
                  />
                  {hasError.pincode && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Pincode is Invalid..!
                      </span>
                    </div>
                  )}
                </div>
                <div className="col-lg-4 text-dark font-weight-bold mt-3 mb-n3">
                  <label htmlFor="panNo">
                    PAN<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8 mt-3">
                  <input
                    type="text"
                    className="form-control"
                    id="panNo"
                    placeholder="Enter Pan No"
                    name="panNo"
                    value={competitorFormInput.panNo}
                    onChange={textInputHandler}
                    //onBlur={onBlurSelectHandler}
                  />
                  {hasError.panNo && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        PAN Number is Invalid..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>
            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-4 text-dark">
                  <label htmlFor="mobile">
                    Mobile No<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    className="form-control"
                    id="mobile"
                    placeholder="Enter Mobile No"
                    name="mobile"
                    value={competitorFormInput.mobile}
                    onChange={textInputHandler}
                    //onBlur={onBlurSelectHandler}
                  />
                  {hasError.mobile && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Mobile Number is Invalid..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>
            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold">
                  <label htmlFor="email">
                    Email ID<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    placeholder="Enter Email Id"
                    name="email"
                    value={competitorFormInput.email}
                    onChange={textInputHandler}
                    //onBlur={onBlurSelectHandler}
                  />
                  {hasError.email && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Email ID is Invalid..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-1 mb-4"></div>
            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-4 text-dark">
                  <label htmlFor="gst">
                    GST No<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    className="form-control"
                    id="gstNo"
                    placeholder="Enter GST No"
                    name="gstNo"
                    value={competitorFormInput.gstNo}
                    onChange={textInputHandler}
                    //onBlur={onBlurSelectHandler}
                  />
                  {hasError.gstNo && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        GST Number is Invalid..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>

            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold">
                  <label htmlFor="directors">
                    Directors<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    className="form-control"
                    id="directors"
                    placeholder="Enter Director's Name"
                    name="directors"
                    value={competitorFormInput.directors}
                    onChange={textInputHandler}
                    //onBlur={onBlurSelectHandler}
                  />
                  {hasError.directors && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Director(s) Name is Invalid..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-1 mb-4"></div>

            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark">
                  <label htmlFor="companyType" className="font-weight-bold">
                    Type of Company<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <Select
                    name="companyType"
                    id="companyType"
                    isSearchable="true"
                    isClearable="true"
                    options={companyTypeList}
                    onChange={selectInputHandler}
                    //onBlur="{companyTypeBlurHandler}"
                    value={competitorFormInput.companyType}
                  ></Select>
                  {hasError.companyType && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Select Competitor Company Type..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-4 mb-4"></div>

            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold">
                  <label htmlFor="manpower">
                    Manpower Strength
                    <span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    className="form-control"
                    id="manpower"
                    placeholder="Enter Company Manpower"
                    name="manpower"
                    value={competitorFormInput.manpower}
                    onChange={textInputHandler}
                    //onBlur={onBlurSelectHandler}
                  />
                  {hasError.manpower && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Manpower Strength is Invalid..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4"></div>
            <div className="inputgroup col-lg-6 mb-4"></div>
            <div className="inputgroup col-lg-5 mb-4 ml-n3">
              <div className="row align-items-center">
                <div className="col-lg-10 text-right ">
                  <button
                    className="btn btn-primary"
                    disabled={!formIsValid}
                    onClick={!id ? submitHandler : updateHandler}
                  >
                    {!id
                      ? loading === true
                        ? "Submitting...."
                        : "Save & Countinue"
                      : loading === true
                      ? "Updating...."
                      : "Update"}
                  </button>
                </div>
                <div className="col-lg-1 text-left">
                  <button className="btn btn-secondary" onClick={cancelHandler}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </PreLoader>
    </Fragment>
  );
};
export default CompetitorProfile;
