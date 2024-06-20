import axios from "axios";
import { useEffect,useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import useInputValidation from "../../hooks/useInputValidation";
import { isNotEmpty,isNotNull } from "../CommonFunctions/CommonFunctions";
import TendertrackerList from "./TendertrackerList";

import Select from "react-select";

function Tendertracker(props) {
	const initialOptions = {
		options: [],
		isLoading: false,
	  };
  const { server1: baseUrl } = useBaseUrl();
  const [loading, setLoading] = useState(false);
  const [StateOptions, setStateOptions] = useState(initialOptions);
 
  const [list, setListarr] = useState([])
  const {
    value: qtyValue,
    isValid: qtyIsValid,
    hasError: qtyHasError,
    valueChangeHandlerForReactSelect: qtyChangeHandler,
    inputBlurHandler: qtyBlurHandler,
    setInputValue: setqty,
    reset: resetqty,
  } = useInputValidation(isNotNull);

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

  const Quantity = [
	{ label: ">50,000", value: 'morethan50' },
	{ label: "50,000 - 1,00,000", value: 'between' },
	{ label: "< 1,00,000", value: 'lessthan1lk' },
	
  ];
  
  const {
    value: stateValue,
    isValid: stateIsValid,
    hasError: stateHasError,
    valueChangeHandlerForReactSelect: stateChangeHandler,
    inputBlurHandler: stateBlurHandler,
    setInputValue: setState,
    reset: resetstate,
  } = useInputValidation(isNotNull);

 


  let filterValid = true;
  if((fromdateValue)&&(todateValue)||stateIsValid || qtyIsValid){
    if((fromdateValue)&&(!todateValue)){
      filterValid = true;
    }
    else if((!fromdateValue)&&(todateValue)){
      filterValid = true;

    }else{
      filterValid = false;
    }

    
  }
  console.log('filterValid',filterValid)
 

  const goHandler = async () => {
    setLoading(true)
    let data = {
      state : stateValue?.value,
      quality : qtyValue?.value,
      fromdate : fromdateValue,
      todate : todateValue,
    }


    let response = await axios.post(`${baseUrl}/api/tendertrack/creation/tracklist`, data)
    let listarr = await generateListArray(response)
    
     setListarr(listarr)
    setLoading(false)
  }

  const generateListArray = async (response) =>{
	let list = [...response.data.tendertracker];
	let listarr = list.map((item, index, arr)=> ({
	  ...item,
	 
	  submissiondate:(item.submissiondate) ? FormattedDate(item.submissiondate) : '',
	  pre_bid_date:(item.prebiddate)?FormattedDate(item.prebiddate):'',
	  estprojectvalue:(item.estprojectvalue)?item.estprojectvalue.toLocaleString(undefined, {maximumFractionDigits:2}):'',
	  tenderfeevalue:(item.tenderfeevalue)?item.tenderfeevalue.toLocaleString(undefined, {maximumFractionDigits:2}):'',
	  emdamt:(item.emdamt)?item.emdamt.toLocaleString(undefined, {maximumFractionDigits:2}):'',
	  quality:(item.quality)?item.quality.toLocaleString(undefined, {maximumFractionDigits:2}):'',
	 
	  
	//   number2.toLocaleString(undefined, {maximumFractionDigits:2}) 
	 sl_no : index+1
	}))

	return listarr;
  }

  const getlist = async () => {
	setLoading(true)

  let data = {
    tokenid : localStorage.getItem('token')
    }
	let response =  await axios.post(`${baseUrl}/api/tendertrack/list`,data);
	let listarr = await generateListArray(response)
	
	setListarr(listarr)
	setLoading(false)
  }
  const getStateData = async (savedState) => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    let response = await axios.post(`${baseUrl}/api/state-list/${savedState}`,data);
    return { options: response.data.stateList, isLoading: false };
  };

  const getStateListOptions = async (savedState = null) => {
    setStateOptions((c) => {
      return { ...c, isLoading: true };
    });
    let StateList = await getStateData(savedState);
    setStateOptions(StateList);
  };
  useEffect(() => {
    getStateListOptions();
   

    
  }, []);

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
      <div className="Tendertracker">
        <div className="row">
          <div className="col-lg-12">
            <div className="card shadow mb-4 p-4">
              <div className="row">
              <div className="col-lg-2">
                  <div className="form-group">
                  <label htmlFor="From">From :</label>										
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
                <div className="col-lg-2">
                  <div className="form-group">
                    	<label htmlFor="From">To :</label>										
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
                <div className="col-lg-3">
                  <div className="form-group">
                    <label htmlFor="From">Quantity :</label>
                    <Select
                      name="qty"
                      id="qty"
                      isSearchable="true"
                      isClearable="true"
                      options={Quantity}
                      onChange={(selectedOptions) => {
                        qtyChangeHandler(selectedOptions);
                        // getcustno(selectedOptions);
                      }}
                      value={qtyValue}
                    ></Select>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="form-group">
                    <label htmlFor="From">State :</label>
                    <Select
                      name="state"
                      id="state"
                      isSearchable="true"
                      isClearable="true"
                      options={StateOptions.options}
                      onChange={(selectedOptions) => {
                        stateChangeHandler(selectedOptions);
                        // getcustno(selectedOptions);
                      }}
                      value={stateValue}


                      isLoading={StateOptions.isLoading}

                    ></Select>
                  </div>
                </div>
                <div className="col-lg-2 text-center">                  
                  <button className='btn-tender-block' onClick={goHandler} disabled={filterValid}> Search </button>
                </div>
              </div>
            </div>
            <div className="card shadow mb-4 p-4">
              <div>
                <TendertrackerList loading={loading} list={list} getlist={getlist} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tendertracker;
