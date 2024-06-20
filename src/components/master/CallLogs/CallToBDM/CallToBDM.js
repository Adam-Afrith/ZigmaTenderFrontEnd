import axios from "axios";
import { Fragment, useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import Select from "react-select";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { useBaseUrl } from "../../../hooks/useBaseUrl";
import CustomerList1 from "./CustomerList1";

const initialState = {
  country: null,
  customer: "",
  state: null,
  district: null,
  bdm_id: "",
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const CallToBDM = () => {
  usePageTitle("Assign Customers to BDM");

  const navigate = useNavigate();
  const { id } = useParams();
  const userName = useRef(""); //to display selected bdm user name
  const { server1: baseUrl } = useBaseUrl();
  const [input, setInput] = useState(initialState);
  const [data, setData] = useState([]);
  // const [inputValidation, setInputValidation] = useState(initialStateErr);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [dataSending, setDataSending] = useState(false);
  const [countryList, setCountryList] = useState({
    options: [],
    isLoading: true,
  });
  const [stateList, setStateList] = useState({
    options: [],
    isLoading: false,
  });
  const [districtList, setDistrictList] = useState({
    options: [],
    isLoading: false,
  });
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (id) {
      let sendingdata = {
        id: id, //bdm id
        tokenid: localStorage.getItem("token"),
      };
      axios
        .post(`${baseUrl}/api/getbdmdetails`, sendingdata)
        .then((response) => {
          if (response.data.status === 200) {
            userName.current = response.data.user.userName;
          }
        });
    }
    let data = {
      tokenid : localStorage.getItem('token')
    }
    axios.post(`${baseUrl}/api/country/list`,data).then((resp) => {
      setCountryList({ options: resp.data.countryList, isLoading: false });
    });

    if (id) {
      getList();
    }
  }, []);

  useEffect(() => {
    setStateList({ ...stateList, isLoading: true });
    let countryid = input.country?.value;
    let data = {
      tokenid : localStorage.getItem('token')
    }

    if (countryid) {
      axios.post(`${baseUrl}/api/state/list/${countryid}`,data).then((resp) => {
        setStateList({ options: resp.data.stateList, isLoading: false });
      });
    } else {
      setStateList({ options: [], isLoading: false });
    }
    setInput({ ...input, state: null });
  }, [input.country]);

  useEffect(() => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    setDistrictList({ ...districtList, isLoading: true });
    let countryid = input.country?.value;
    let stateid = input.state?.value;
    if (countryid && stateid) {
      axios
        .post(`${baseUrl}/api/district/list/${countryid}/${stateid}`,data)
        .then((resp) => {
          setDistrictList({
            options: resp.data.districtList,
            isLoading: false,
          });
        });
    } else {
      setDistrictList({
        options: [],
        isLoading: false,
      });
    }
    setInput({ ...input, district: "" });
  }, [input.state]);

  const getList = async () => {
    let datatosend = {
      country: input?.country?.value,
      state: input?.state?.value,
      district: input?.district?.value,
      tokenid: localStorage.getItem("token"),
      bdm_id: id,
    };
    const List = await axios.post(
      `${baseUrl}/api/filteredcustomerlist`,
      datatosend
    );
    setData(List.data.customerList);
  };

  const resetCusomer = () => {
    setInput((prev) => ({
      ...prev,
      customer: null,
    }));
    setCustomerOptions(null);
  };

  const inputHandlerForSelect = (value, action) => {
    setInput((prev) => ({
      ...prev,
      [action.name]: value,
    }));
  };

  let formIsValid = false;
  if (input.staffName && input.customer) {
    formIsValid = true;
  }

  const submitHandler = (e) => {
    e.preventDefault();
    getList();
  };

  const cancelHandler = () => {
    navigate(`/tender/calllog/calltobdm`);
  };
console.log("data", data)
  return (
    <Fragment>
      <div className="CallToBDM">
        <div className="card shadow mb-4 p-4">
          <form>
            <div className="row align-items-center">
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="staffName" className="font-weight-bold">
                      BDM Name<span className="text-danger">&nbsp;*</span>{" "}
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      value={userName.current}
                      type="text"
                      className="form-control"
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="country" className="font-weight-bold">
                      Country<span className="text-danger">&nbsp;*</span>{" "}
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <Select
                      name="country"
                      id="country"
                      isSearchable="true"
                      isClearable="true"
                      isLoading={countryList.isLoading}
                      options={countryList.options}
                      value={input.country}
                      onChange={(value, action) => {
                        inputHandlerForSelect(value, action);
                      }}
                    ></Select>
                  </div>
                </div>
              </div>

              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="state" className="font-weight-bold">
                      State<span className="text-danger">&nbsp;*</span>{" "}
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <Select
                      name="state"
                      id="state"
                      isSearchable="true"
                      isClearable="true"
                      isLoading={stateList.isLoading}
                      options={stateList.options}
                      value={input.state}
                      onChange={(value, action) => {
                        inputHandlerForSelect(value, action);
                        resetCusomer();
                      }}
                    ></Select>
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="district" className="font-weight-bold">
                      District<span className="text-danger">&nbsp;*</span>{" "}
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <Select
                      name="district"
                      id="district"
                      isSearchable="true"
                      isClearable="true"
                      isLoading={districtList.isLoading}
                      options={districtList.options}
                      value={input.district}
                      onChange={(value, action) => {
                        inputHandlerForSelect(value, action);
                      }}
                    ></Select>
                  </div>
                </div>
              </div>

              <div className="inputgroup col-lg-12 mb-4 ">
                <div className="row align-items-center">
                  <div className="col-lg-12 text-center ">
                    <button
                      className="btn btn-primary"
                      onClick={submitHandler}
                    >
                      {" "}
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          
            <CustomerList1
              id={id}
              setIsEdited={setIsEdited}
              isEdited={isEdited}
              data={data}
              submitHandler={submitHandler}
              dataSending={dataSending}
              userName = {userName}
            />          
        </div>
      </div>
    </Fragment>
  );
};

export default CallToBDM;
