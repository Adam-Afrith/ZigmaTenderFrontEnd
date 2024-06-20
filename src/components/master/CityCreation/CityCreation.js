import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import Select from "react-select";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import axios from "axios";
import Swal from "sweetalert2/src/sweetalert2.js";

const initialDistrictList = {
  options: [],
  isLoading: false,
};

const initialStateList = {
  options: [],
  isLoading: false,
};

const initialCountryList = {
  options: [],
  isLoading: true,
};

const initialState = {
  country: null,
  state: null,
  district: null,
  city: "",
  status: "Active",
};

const initialStateErr = {
  countryErr: "",
  stateErr: "",
  districtErr: "",
  cityErr: "",
};

const CityCreation = () => {
  usePageTitle("City Creation");
  const { id } = useParams();
  const navigate = useNavigate();

  const { server1: baseUrl } = useBaseUrl();

  const [dataSending, setDataSending] = useState(false);
  const [input, setInput] = useState(initialState);
  const [inputValidation, setInputValidation] = useState(initialStateErr);
  const [countryList, setCountryList] = useState(initialCountryList);
  const [stateList, setStateList] = useState(initialStateList);
  const [districtList, setDistrictList] = useState(initialDistrictList);

  const [savedData, setSavedData] = useState({});

  useEffect(() => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    axios.post(`${baseUrl}/api/country/list`,data).then((resp) => {
      setCountryList({ options: resp.data.countryList, isLoading: false });
    });
  }, [baseUrl]);

  useEffect(() => {
    if (id) {
      axios.get(`${baseUrl}/api/city/${id}`).then((resp) => {
        setSavedData(resp.data.city);
        setInput((prevState) => {
          return { ...prevState, city: resp.data.city.city_name, status: resp.data.city.city_status}
        })
      });
    }
  }, [id, baseUrl]);

  useEffect(() => {
    if (id && countryList.options.length>0 && savedData) {
      setInput((prevstate) => {
        return {
          ...prevstate,
          country: countryList.options.find(
            (x) => x.value === savedData.country_id
          ),
        };
      });
    }
  }, [id, countryList.options, savedData]);

  useEffect(() => {
    if (id && stateList.options.length>0 && savedData) {
      setInput((prevstate) => {
        return {
          ...prevstate,
          state: stateList.options.find(
            (x) => x.value === savedData.state_id
          ),
        };
      });
    }
  }, [id, stateList.options , savedData])

  useEffect(() => {
    if (id && districtList.options.length>0 && savedData) {
      setInput((prevstate) => {
        return {
          ...prevstate,
          district: districtList.options.find(
            (x) => x.value === savedData.district_id
          ),
        };
      });
      setSavedData(null)
    }
  }, [id, districtList.options , savedData])

  // useEffect(() => {
  //   if (id && savedData.country_id) {
  //     setInput((prev) => {
  //       return {
  //         ...prev,
  //         country: countryList.options.find(
  //           (x) => x.value === savedData.country_id
  //         ),
  //       };
  //     });
  //   }
  // }, [id, savedData]);

  useEffect(() => {
    let data = {
      tokenid : localStorage.getItem('token')
    }

    setStateList(initialStateList);
    setInput((prevState) => {
      return {
        ...prevState,
        state: null,
      };
    });

    if (input.country) {
      setStateList((prevList) => {
        return { ...prevList, isLoading: true };
      });
      let countryid = input.country.value;
      axios.post(`${baseUrl}/api/state/list/${countryid}`,data).then((resp) => {
        setStateList({ options: resp.data.stateList, isLoading: false });
      });
    }
  }, [baseUrl, input.country]);

  // useEffect(() => {
  //   console.log(stateList.options);
  //   if (id && stateList.options) {
  //   }
  // }, [stateList]);

  useEffect(() => {
    let data = {
      tokenid : localStorage.getItem('token')
    }

    setDistrictList(initialDistrictList);
    setInput((prevState) => {
      return {
        ...prevState,
        district: null,
      };
    });

    if (input.state && input.country) {
      let countryid = input.country.value;
      let stateid = input.state.value;
      setDistrictList((prevList) => {
        return { ...prevList, isLoading: true };
      });
      axios
        .post(`${baseUrl}/api/district/list/${countryid}/${stateid}`,data)
        .then((resp) => {
          setDistrictList({
            options: resp.data.districtList,
            isLoading: false,
          });
        });
    }
  }, [baseUrl, input.country, input.state]);

  // console.log(input)

  const inputHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const inputHandlerForSelect = (value, action) => {
    setInput({
      ...input,
      [action.name]: value,
    });
  };

  const postData = (data) => {
    axios.post(`${baseUrl}/api/city`, data).then((resp) => {
      if (resp.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "New City " + resp.data.message,
          text: "",
          confirmButtonColor: "#5156ed",
        });
        setInput(initialState);
        navigate("/tender/master/citymaster");
      } else if (resp.data.status === 400) {
        Swal.fire({
          icon: "error",
          title: "City",
          text: resp.data.errors,
          confirmButtonColor: "#5156ed",
        });
        setDataSending(false);
      }
    });
  };

  const putData = (data, id) => {
    axios.put(`${baseUrl}/api/city/${id}`, data).then((res) => {
      if (res.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "City",
          text: "Updated Successfully!",
          confirmButtonColor: "#5156ed",
        });
        setInput(initialState)
        navigate('/tender/master/citymaster')
      } else if (res.data.status === 400) {
        Swal.fire({
          icon: "error",
          title: "City",
          text: res.data.errors,
          confirmButtonColor: "#5156ed",
        });
        setDataSending(false)
      }
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setDataSending(true);
    var errors = { ...inputValidation };

    input.country === null
      ? (errors.countryErr = "Select Country")
      : (errors.countryErr = "");
    input.state === null
      ? (errors.stateErr = "Select State")
      : (errors.stateErr = "");
    input.district === null
      ? (errors.districtErr = "Select District")
      : (errors.districtErr = "");
    input.city === ""
      ? (errors.cityErr = "Enter City Name")
      : (errors.cityErr = "");

    const { stateErr, countryErr, districtErr, cityErr } = errors;
    setInputValidation(errors);

    if (
      stateErr !== "" ||
      countryErr !== "" ||
      districtErr !== "" ||
      cityErr !== ""
    ) {
      setDataSending(false);
      return;
    }

    if (
      stateErr === "" &&
      countryErr === "" &&
      districtErr === "" &&
      cityErr === ""
    ) {
      const data = {
        country_id: input.country.value,
        state_id: input.state.value,
        district_id: input.district.value,
        city_name: input.city,
        city_status: input.status,
      };

      if (!id) {
        postData(data);
      } else {
        putData(data, id);
      }
    }

  
  };

  return (
    <div className="">
      <div className="card shadow mb-4 p-4">
        <form onSubmit={submitHandler}>
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark">
                  <label>Country Name</label>
                </div>
                <div className="col-lg-8">                  
                      <Select
                        name="country"
                        id="country"
                        isSearchable="true"
                        isClearable="true"
                        options={countryList.options}
                        onChange={inputHandlerForSelect}
                        // onBlur={countrylistBlurHandler}
                        value={input.country}
                        isLoading={countryList.isLoading}
                      ></Select>                    
                      <span style={{ color: "red" }}>
                        {inputValidation.countryErr}
                      </span>                    
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark">
                  <label>State Name</label>
                </div>
                <div className="col-lg-8">                  
                      <Select
                        name="state"
                        id="state"
                        isSearchable="true"
                        isClearable="true"
                        options={stateList.options}
                        onChange={inputHandlerForSelect}
                        
                        isLoading={stateList.isLoading}
                        value={input.state}
                      ></Select>                    
                      <span style={{ color: "red" }}>
                        {inputValidation.stateErr}
                      </span>                   
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark">
                  <label>District Name</label>
                </div>
                <div className="col-lg-8">                 
                      <Select
                        name="district"
                        id="district"
                        isSearchable="true"
                        isClearable="true"
                        options={districtList.options}
                        onChange={inputHandlerForSelect}
                        // onBlur={countrylistBlurHandler}
                        value={input.district}
                        isLoading={districtList.isLoading}
                      ></Select>                    
                      <span style={{ color: "red" }}>
                        {inputValidation.districtErr}
                      </span>                    
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark">
                  <label>City Name</label>
                </div>
                <div className="col-lg-8">                  
                      <input
                        className="form-control "
                        type="text"
                        id="city"
                        name="city"
                        onChange={inputHandler}
                        value={input.city}
                      />                   
                      <span style={{ color: "red" }}>
                        {inputValidation.cityErr}
                      </span>                   
                </div>
              </div>              
            </div>
            <div className="col-lg-6 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark">
                  <label>Active Status</label>
                </div>
                <div className="col-lg-8">                  
                    <div className='form-check form-check-inline mr-4'>
                      <label className="for-check-label" htmlFor="statusActive">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="statusActive"
                          name="status"
                          value="Active"
                          checked={input.status === "Active"}
                          onChange={inputHandler}
                        />
                        Active
                      </label>
                    </div>
                    <div className='form-check form-check-inline '>
                      <label className="for-check-label" htmlFor="statusInactive">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="statusInactive"
                          name="status"
                          value="InActive"
                          checked={input.status === "InActive"}
                          onChange={inputHandler}
                        />
                        Inactive
                      </label>
                    </div>                  
                </div>
              </div>
            </div>
            <div className="col-lg-12 text-center">              
                {id ? (
                  <button className="btn btn-primary" disabled={dataSending}>
                    {dataSending ? "Editing..." : "Edit"}
                  </button>
                ) : (
                  <button className="btn btn-primary" disabled={dataSending}>
                    {dataSending ? "Submitting..." : "Submit"}
                  </button>
                )}              
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CityCreation;
