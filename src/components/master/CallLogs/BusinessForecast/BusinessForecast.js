import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../../hooks/useBaseUrl";
import { usePageTitle } from "../../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";
import Select from "react-select";

const initialState = {
  calltype: null,
  bizzforecast: "",
  activeStatus: "Active",
};

const initialStateErr = {
  calltypeErr: "",
  bizzforecastErr: "",
  activeStatusErr: "",
};

const BusinessForecast = () => {
  usePageTitle("Business Forecast Creation");
  const navigate = useNavigate();
  const { id } = useParams();

  const { server1: baseUrl } = useBaseUrl();

  const [dataSending, setDataSending] = useState(false);
  const [input, setInput] = useState(initialState);
  const [inputValidation, setInputValidation] = useState(initialStateErr);
  const [savedData, setSavedData] = useState({});
  const [calltypeList, setCallTypeList] = useState([]);
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    let data = {
      tokenid : localStorage.getItem('token')
    }

    axios.post(`${baseUrl}/api/calltype/list`,data).then((resp) => {
      setCallTypeList(resp.data.calltype);
    });
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`${baseUrl}/api/bizzforecast/${id}`)
        .then((resp) => {
          if (resp.data.status === 200 && resp.data.bizzforecast.length > 0) {
            const { name, activeStatus, id: bizzforecastId } = resp.data.bizzforecast[0];
            setSavedData(resp.data.bizzforecast[0]);
            setInput((prev) => ({
              ...prev,
              bizzforecast: name,
              activeStatus: activeStatus,
              calltype: calltypeList.find((x) => x.value === bizzforecastId),
            }));
          }
        })
        .catch((error) => {
          // Handle error if the request fails
        });
    }
  }, [id, baseUrl, calltypeList]);
  
  // useEffect(() => {
  //   if (calltypeList.length > 0 && savedData.id) {
  //     setInput((prev) => ({
  //       ...prev,
  //       calltype: calltypeList.find((x) => x.value === savedData.id),
  //     }));
  //   }
  // }, [calltypeList, savedData]);

  
  

  const inputHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });

    if (e.target.value === "") {
      setInputValidation({ ...inputValidation, [e.target.name]: true });
    } else {
      setInputValidation({ ...inputValidation, [e.target.name]: false });
    }
  };

  const inputHandlerForSelect = (selectedOption) => {
    if (selectedOption) {
      setInput((prev) => {
        return { ...prev, calltype: selectedOption };
      });
      setInputValidation((prev) => {
        return {...prev ,calltypeErr: false};
       })
    } else {
      setInput((prev) => {
        return { ...prev, calltype: null };
      });
      setInputValidation((prev) => {
        return {...prev ,calltypeErr: true};
       })
    }
  };

  

  const postData = (data) => {
    axios
      .post(`${baseUrl}/api/bizzforecast`, data)
      .then((resp) => {
        if (resp.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Bussiness Forecast",
            text: resp.data.message,
            confirmButtonColor: "#5156ed",
          });

          navigate(`/tender/master/businessforecastmaster`);
        } else if (resp.data.status === 400) {
          Swal.fire({
            icon: "error",
            title: "Bussiness Forecast",
            text: resp.data.message,
            confirmButtonColor: "#5156ed",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Bussiness Forecast",
            text: "Provided Credentials are Incorrect",
            confirmButtonColor: "#5156ed",
          }).then(() => {
            localStorage.clear();
            navigate("/");
          });
        }
        setDataSending(false);
      })
      .catch((err) => {
        // console.log("err", err.response.data.message);
        Swal.fire({
          icon: "error",
          title: "Bussiness Forecast",
          text: err.response.data.message || err,
          confirmButtonColor: "#5156ed",
        });
        setDataSending(false);
      });
  };

  const putData = (data, id) => {
    axios
      .put(`${baseUrl}/api/bizzforecast/${id}`, data)
      .then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Bussiness Forecast",
            text: "Updated Successfully!",
            confirmButtonColor: "#5156ed",
          });
          setInput(initialState);
          navigate("/tender/master/businessforecastmaster");
        } else if (res.data.status === 400) {
          Swal.fire({
            icon: "error",
            title: "Bussiness Forecast",
            text: res.data.errors,
            confirmButtonColor: "#5156ed",
          });
          setDataSending(false);
        }
      })
      .catch((err) => {
        // console.log("err", err.response.data.message);
        Swal.fire({
          icon: "error",
          title: "Bussiness Forecast",
          text: err.response.data.message || err,
          confirmButtonColor: "#5156ed",
        });
        setDataSending(false);
      });
  };

  
  useEffect(()=>{
   
    if(input.calltype!==null && input.bizzforecast !== "")
    {
    
     
      setFormIsValid(true);
    }
    else{ 
       

      setFormIsValid(false);
    }
  },[inputValidation])

  const submitHandler = (e) => {
    e.preventDefault();

    setDataSending(true);

    if (!formIsValid) {
      setDataSending(false);
      return;
    }

    let data = {
      call_type_id: input.calltype?.value,
      name: input.bizzforecast,
      activeStatus: input.activeStatus,
      tokenId: localStorage.getItem("token"),
    };
  
    if(data.call_type_id && data.name)
    {
    if (!id) {
      postData(data);
    } else {
      putData(data, id);
    }
  }
  else{
    setDataSending(false)
    Swal.fire({
      icon: "error",
      title: "Bussiness Forecast",
      text:"Fill the Form First!!",
      confirmButtonColor: "#5156ed",
    });
  }
  };

  const cancelHandler = () => {
    navigate(`/tender/master/businessforecastmaster`);
  };

  return (
    <Fragment>
      <div className="">
        <div className="card shadow mb-4 p-4">
          <form>
            <div className="row align-items-center">
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="calltype" className="font-weight-bold">
                      Call Type<span className="text-danger">&nbsp;*</span>{" "}
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <Select
                      name="calltype"
                      id="calltype"
                      isSearchable="true"
                      isClearable="true"
                      options={calltypeList}
                      onChange={(e) => {
                        inputHandlerForSelect(e);
                      }}
                      value={input.calltype}
                      // isLoading={calltypeList.isLoading}
                    ></Select>
                    {inputValidation.calltypeErr && (
                      <div className="pt-1">
                        <span className="text-danger font-weight-bold">
                          Enter Call Type 
                        </span>
                      </div>
                    )}

                  </div>
                </div>
              </div>

              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="bizzforecast" className="font-weight-bold">
                      Bussiness Forecast
                      <span className="text-danger">&nbsp;*</span>{" "}
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      className="form-control"
                      id="bizzforecast"
                      name="bizzforecast"
                      value={input.bizzforecast}
                      onChange={inputHandler}
                    />

                    {inputValidation.bizzforecast && (
                      <div className="pt-1">
                        <span className="text-danger font-weight-bold">
                          Enter Bussiness Forecast
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark ">
                    <label htmlFor="activeStatus " className="font-weight-bold">
                      Active Status&nbsp;
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <div className="form-check form-check-inline">
                      <label
                        className="form-check-label"
                        htmlFor="activeStatus_active"
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="activeStatus"
                          id="activeStatus_active"
                          checked={"Active" === input.activeStatus}
                          value="Active"
                          onChange={inputHandler}
                        />
                        Active
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <label
                        className="form-check-label"
                        htmlFor="activeStatus_inactive"
                      >
                        <input
                          className="form-check-input mx-3"
                          type="radio"
                          name="activeStatus"
                          id="activeStatus_inactive"
                          checked={"Inactive" === input.activeStatus}
                          value="Inactive"
                          onChange={inputHandler}
                        />
                        Inactive
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-12 ">
                <div className="row align-items-center">
                  <div className="col-lg-12 text-center ">
                    <button
                      className="btn btn-primary mr-2"
                      disabled={!formIsValid}
                      onClick={submitHandler}
                    >
                      {dataSending && (
                        <span className="spinner-border spinner-border-sm mr-2"></span>
                      )}
                      {dataSending === true
                        ? id
                          ? "Updating..."
                          : "Submitting...."
                        : id
                        ? "Update"
                        : "Save"}
                    </button>                    
                    <button
                      className="btn btn-secondary"
                      onClick={cancelHandler}
                      disabled={dataSending}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default BusinessForecast;
