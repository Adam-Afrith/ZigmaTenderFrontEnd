import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import useInputValidation from "../../hooks/useInputValidation";
import { isNotEmpty } from "../CommonFunctions/CommonFunctions";
import BidManagementList from "./BidManagementList";


function Bidmanagement(props) {

  const { server1: baseUrl } = useBaseUrl();
  const [loading, setLoading] = useState(false);
  const [list, setListarr] = useState([])

  const {
    value: fromdateValue,
    isValid: fromdateIsValid,
    hasError: fromdateHasError,
    valueChangeHandler: fromdateChangeHandler,
    inputBlurHandler: fromdateBlurHandler,
    setInputValue: setfromdateValue,
    reset: resetfromdate,
  } = useInputValidation(isNotEmpty);

  const {
    value: todateValue,
    isValid: todateIsValid,
    hasError: todateHasError,
    valueChangeHandler: todateChangeHandler,
    inputBlurHandler: todateBlurHandler,
    setInputValue: settodateValue,
    reset: resettodate,
  } = useInputValidation(isNotEmpty);


  let filterValid = false;

  if(fromdateIsValid && todateIsValid){
    filterValid = true;
  }

  const goHandler = async () => {
    setLoading(true)
    let data = {
      fromdate : fromdateValue,
      todate : todateValue,
    }

    let response = await axios.post(`${baseUrl}/api/bidcreation/creation/bidlist`, data)
    let listarr = await generateListArray(response)
    
    setListarr(listarr)
    setLoading(false)
  }

  const generateListArray = async (response) =>{

    let list = [...response.data.tenderCreationList];
    
    let listarr = list.map((item, index, arr)=> ({
      ...item,
      NITdate:FormattedDate(item.nitdate),


      quality: item.quality!==null ? item.quality.toLocaleString('en-IN'): "--",

      submissiondate:(item.submissiondate) ? FormattedDate(item.submissiondate) : '',
      status:'<span class="font-weight-bold text-primary">New Tender</span>',
      current_stage:`<span class="font-weight-bold text-warning">Stage</span>`,
      action:`
      <i class="fa fa-print text-info mr-2 h6" style="cursor:pointer; font-size: 1.25rem" title="Print"></i> 
      <i class="fas fa-edit text-success mx-2 h6" style="cursor:pointer" title="Edit"></i> 
      <i class="fa fa-trash-o  text-danger h6  mx-2" style="cursor:pointer; font-size: 1.25rem"  title="Delete"></i>`,
      sl_no : index+1
    }))

    return listarr;
  }

  const getlist = async () => {
    setLoading(true)
    let response =  await axios.get(`${baseUrl}/api/bidcreation/creation`);
    let listarr = await generateListArray(response)
    
    setListarr(listarr)
    setLoading(false)
  }

  const FormattedDate = (date) => {
    const targetdate = new Date(date);
    const yyyy = targetdate.getFullYear();
    let mm = targetdate.getMonth() + 1; // Months start at 0!
    let dd = targetdate.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedDate = dd + '-' + mm + '-' + yyyy;
    return formattedDate
  }

  return (
    <>
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-lg-12">
            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="row d-flex justify-content-between">
                  <div className="col-lg-7 row">
                    <div className="col-sm-5 row d-flex align-items-center">
                      <div className="col-lg-3 text-dark font-weight-bold">
                        <label htmlFor="From">From :</label>
                      </div>
                      <div className="col-lg-9">
                        <input
                          type="date"
                          className="form-control"
                          id="fromdate"
                          placeholder="From Date"
                          name="fromdate"
                          value={fromdateValue}
                          onChange={fromdateChangeHandler}
                          max={todateValue}
                        />
                      </div>
                    </div>
                    <div className="col-sm-5 row d-flex align-items-center">
                    <div className="col-lg-3 text-dark font-weight-bold">
                        <label htmlFor="From">To :</label>
                      </div>
                      <div className="col-lg-9">
                        <input
                          type="date"
                          className="form-control"
                          id="todate"
                          placeholder="To Date"
                          name="todate"
                          value={todateValue}
                          onChange={todateChangeHandler}
                          min={fromdateValue}
                        />
                      </div>
                    </div>
                    <div className="col-sm-2">
                      <button className={`btn ${(!filterValid) && 'btn-outline-primary' } ${(filterValid) && 'btn-primary' } rounded-pill`} onClick={goHandler} disabled={!filterValid}> Go </button>
                    </div>
                  </div>
                  <div className="col-lg-5  d-flex align-items-end flex-column">
                    {/* <Link to="main/bidcreationmain" className="rounded-pill btn btn-primary btn-icon-split">
                      <span className="icon text-white-50">
                        <i className="fas fa-plus-circle" />
                      </span>
                      <span className="text">New</span>
                    </Link> */}
                  </div>
                </div>

              </div>
              <div>
                <BidManagementList loading={loading} list={list} getlist={getlist}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Bidmanagement;