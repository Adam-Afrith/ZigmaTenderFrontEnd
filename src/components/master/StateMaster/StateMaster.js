import { useState, useEffect } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useBaseUrl } from "../../hooks/useBaseUrl";

const StateMaster = () => {
  usePageTitle("State Master Creation");
  useDocumentTitle("State Master");
  const {server1: baseUrl} = useBaseUrl()
  const navigate = useNavigate();
  const { id } = useParams();

  const initialState = {
    countryName: null,
    stateName: "",
    statecode: "",
    stateStatus: "Active",
    category:"State"
  };

  const [stateInput, setStateInput] = useState(initialState);
  const [stateValidation, setInputValidation] = useState({
    stateName: "",
    countryName: "",
    statecode: ""
  });
  const [countryList, setCountryList] = useState([]);
  const [dataSending, setDataSending] = useState(false);

  useEffect(() => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    axios.post(`${baseUrl}/api/country/list`,data).then((resp) => {
      setCountryList(resp.data.countryList);
    });
  }, [baseUrl]);

  useEffect(() => {
    if (id) {
      axios.get(`${baseUrl}/api/state/${id}`).then((resp) => {
     
        setStateInput({
          countryName: countryList.find(
            (x) => x.value === resp.data.state.country_id
          ),
          stateName: resp.data.state.state_name,
          stateStatus: resp.data.state.state_status,
          statecode: resp.data.state.state_code,
          category: resp.data.state.category,
        });
      });
    }
  }, [id, countryList, baseUrl]);

  const inputHandler = (e) => {
    e.persist();
    setStateInput({ ...stateInput, [e.target.name]: e.target.value });
  };

  const inputHandlerForSelect = (value, action) => {
    setStateInput({
      ...stateInput,
      [action.name]: value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setDataSending(true);
    var errors = { ...stateValidation };

    stateInput.countryName === null
      ? (errors.countryName = "Select Country")
      : (errors.countryName = "");
    stateInput.stateName === ""
      ? (errors.stateName = "Please Enter State")
      : (errors.stateName = "");
    stateInput.statecode === ""
      ? (errors.statecode = "Please Enter State Code")
      : (errors.statecode = "");

    const { stateName, countryName, statecode } = errors;
    setInputValidation(errors);

    if (stateName !== "" || countryName !== "" || statecode !== "") {
      setDataSending(false)
      return;
    }

    if (stateName === "" && countryName === "" && statecode === "") {
      const data = {
        country_id: stateInput.countryName.value,
        state_name: stateInput.stateName.trim(),
        state_status: stateInput.stateStatus.trim(),
        state_code: stateInput.statecode.toUpperCase().trim(),
        category: stateInput.category.trim(),
      };


      // console.log(data)
      // setDataSending(false)
      // return

      if (!id) {
        axios.post(`${baseUrl}/api/state`, data).then((res) => {
          if (res.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "State",
              text: "Created Successfully!",
              confirmButtonColor: "#5156ed",
            });
            setStateInput(initialState);
            navigate("/tender/master/statemaster");
          } else if (res.data.status === 400) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: res.data.errors,
              confirmButtonColor: "#5156ed",
            });
            setDataSending(false)
          }
         
        });
      } else {
        axios.put(`${baseUrl}/api/state/${id}`, data).then((res) => {
          if (res.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "State",
              text: "Updated Successfully!",
              confirmButtonColor: "#5156ed",
            });
            setStateInput(initialState);
            navigate("/tender/master/statemaster");
          } else if (res.data.status === 400) {
            Swal.fire({
              icon: "error",
              title: "State",
              text: res.data.errors,
              confirmButtonColor: "#5156ed",
            });
            setDataSending(false)
          }
        });
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
                    name="countryName"
                    id="countryName"
                    isSearchable="true"
                    isClearable="true"
                    options={countryList}
                    onChange={inputHandlerForSelect}
                    // onBlur={countrylistBlurHandler}
                    value={stateInput.countryName}
                  ></Select>                    
                  <span style={{ color: "red" }}>
                    {stateValidation.countryName}
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
                  <input
                    className="form-control "
                    type="text"
                    id="stateName"
                    name="stateName"
                    onChange={inputHandler}
                    value={stateInput.stateName}
                  />                    
                  <span style={{ color: "red" }}>
                    {stateValidation.stateName}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark">
                  <label>State Short Code</label>
                </div>
                <div className="col-lg-8">                  
                  <input
                    className="form-control text-uppercase"
                    type="text"
                    id="statecode"
                    name="statecode"
                    onChange={inputHandler}
                    value={stateInput.statecode}
                  />                    
                  <span style={{ color: "red" }}>
                    {stateValidation.statecode}
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
                  <div className='form-check form-check-inline'>
                    <label
                      className="for-check-label"
                      htmlFor="stateStatusActive"
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        id="stateStatusActive"
                        name="stateStatus"
                        value="Active"
                        checked={stateInput.stateStatus === "Active"}
                        onChange={inputHandler}
                      />
                      Active
                    </label>  
                  </div>     
                  <div className='form-check form-check-inline'>
                    <label
                      className="for-check-label"
                      htmlFor="stateStatusInactive"
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        id="stateStatusInactive"
                        name="stateStatus"
                        value="InActive"
                        checked={stateInput.stateStatus === "InActive"}
                        onChange={inputHandler}
                      />
                      Inactive
                    </label>  
                  </div>                                                  
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark">
                  <label>Category</label>
                </div>

                <div className="col-lg-8">                  
                    <div className='form-check form-check-inline'>
                      <label
                        className="for-check-label"
                        htmlFor="categoryState"
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          id="categoryState"
                          name="category"
                          value="State"
                          checked={stateInput.category === "State"}
                          onChange={inputHandler}
                        />
                        State
                      </label>
                    </div>
                    <div className='form-check form-check-inline'>
                      <label
                        className="for-check-label"
                        htmlFor="categoryUnion"
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          id="categoryUnion"
                          name="category"
                          value="Union Territory"
                          checked={stateInput.category === "Union Territory"}
                          onChange={inputHandler}
                        />
                        Union Territory
                      </label>
                    </div>                  
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="row align-items-center">
                <div className="col-12 col-lg-12 text-center">
                  {id ? (
                    <button className="btn btn-primary" disabled={dataSending}>
                      {dataSending ? "Editing..." : 'Edit'}
                    </button>
                  ) : (
                    <button className="btn btn-primary" disabled={dataSending}>
                      {dataSending ? "Submitting..." : 'Submit'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StateMaster;
