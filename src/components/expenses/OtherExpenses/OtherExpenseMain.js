import axios from "axios";

import { useEffect, useContext, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import AuthContext from "../../../storeAuth/auth-context";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import useInputValidation from "../../hooks/useInputValidation";
import { isNotEmpty, isNotNull } from "../CommonFunctions/CommonFunctions";
import Select from "react-select";
import OtherExpenseMainList from "./OtherExpenseMainList";
 


function OtherExpenseMain(props) {

	const userName = localStorage.getItem('UserName');
	const token = localStorage.getItem('token');

	const initialOptions = {
		options: [],
		isLoading: false,
	}
	const { server1: baseUrl } = useBaseUrl();
	const [loading, setLoading] = useState(false);
	const [list, setListarr] = useState([])
	const { permission } = useContext(AuthContext)
	const [StateOptions, setStateOptions] = useState(initialOptions);
	const [CategoryOptions, setCategoryOptions] = useState(initialOptions);
	const [groupOptions, setgroupOptions] = useState(initialOptions);
	const [optionsForStaff, setOptionsForStaff] = useState([]);
const[userType,setUserType]=useState('');

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

	
	const cust_category = [

		{ value: "state", label: "State" },
		{ value: "unionterritory", label: "Union Territory" },

	];
	const Group = [

		{ value: "yes", label: "Smart City" },
		{ value: "no", label: "Non Smart City" },

	];
	const getStateData = async (savedState) => {
		let data = {
			tokenid : localStorage.getItem('token')
		  }
		let response = await axios.post(`${baseUrl}/api/state-list/${savedState}`,data);
		return { options: response.data.stateList, isLoading: false };

	};

	const getStateListOptions = async (savedState = null) => {
		let category = { options: cust_category, isLoading: false };
		setStateOptions((c) => {
			return { ...c, isLoading: true };
		});
		let StateList = await getStateData(savedState);
		setStateOptions(StateList);
		setCategoryOptions(category);
	};
	const {
		value: stateValue,
		isValid: stateIsValid,
		hasError: stateHasError,
		valueChangeHandlerForReactSelect: stateChangeHandler,
		inputBlurHandler: stateBlurHandler,
		setInputValue: setstate,
		reset: resetstate,
	} = useInputValidation(isNotNull);
	const {
		value: catValue,
		isValid: catIsValid,
		hasError: catHasError,
		valueChangeHandlerForReactSelect: catChangeHandler,
		inputBlurHandler: catBlurHandler,
		setInputValue: setcat,
		reset: resetcat,
	} = useInputValidation(isNotNull);

	const {
		value: executiveValue,
		isValid: executiveIsValid,
		hasError: executiveHasError,
		valueChangeHandlerForReactSelect: executiveChangeHandler,
		inputBlurHandler: executiveBlurHandler,
		setInputValue: setgroup,
		reset: resetgroup,
	} = useInputValidation(isNotNull);

	if(fromdateIsValid || todateIsValid || executiveIsValid){
		console.log('todateIsValid',todateIsValid);
		if(todateIsValid===true && fromdateIsValid===true){
			filterValid = true;
		}else if(executiveIsValid===true){
			filterValid = true;
		}
	  
	}
	useEffect(() => {

		axios.post(`${baseUrl}/api/expenses/staffList`).then((res) => {
			if (res.status === 200) {
	  
			  // generateOptions(res.data.get_staff);
			  let op = res.data.get_staff
			  let roles = op.map((role, index) => ({
				value: role.id,
				label: role.userName,
			  }))
	  
			  setOptionsForStaff(roles)
			}
		  });
		getStateListOptions();

	}, [])


	const goHandler = async () => {
console.log('grp',fromdateValue);
		// setLoading(true)
		if(fromdateValue==null){
			var value1='';
		}
		else{
			var value1=fromdateValue;
		}

		if(todateValue==null){
			var value2='';
		}
		else{
			var value2=todateValue;
		}
		

		if(executiveValue?.value==null){
			var value3='';
		}
		else{
			var value3=executiveValue.value;
		}
		
		
		let data = {
			fromdate: fromdateValue,
			todate: todateValue,
			executive: value3,
			token :token,
			userName :userName
		}

		let response = await axios.post(`${baseUrl}/api/mainlist`, data)
		let listarr = await generateListArray(response)
		setUserType(response.data.usertype);
		setListarr(listarr)
		setLoading(false)
	}

	const generateListArray = async (response) => {

		let list = [...response.data.exp_app];

		let listarr = list.map((item, index, arr) => {
		
      let editbtn='';
      let deletebtn='';
			
let print =  '<i class="fas fa-solid fa-print print" style={{color: "#70e60f"}} ></i>' ;


 editbtn = !!(permission?.['OtherExpenses']?.can_edit) ? '<i class="fas fa-edit text-info mx-2 h6" style="cursor:pointer" title="Edit" data-action="EDIT"></i> '  : '';
   deletebtn =  !!(permission?.['OtherExpenses']?.can_delete) ? '<i class="fas fa-trash-alt text-danger h6  mx-2" style="cursor:pointer"  title="Delete" data-action="DELETE"></i>' : '';
       
			return {
				...item, 
				entry_date: item.entry_date,
				exp_no:item.expense_no ,
				staff_name : item.userName,
				total_amount:item.expense_amount,
			

				action: editbtn+deletebtn,
			
				view: print,
	
				sl_no : index+1
			}
		})
		// <i class="fa fa-print text-info mr-2 h6" style="cursor:pointer; font-size: 1.25rem" title="Print"></i>  -- To add @ line 72 
		return listarr;
	}



	//   const FormattedDate = (date) => {
	//     const targetdate = new Date(date);
	//     const yyyy = targetdate.getFullYear();
	//     let mm = targetdate.getMonth() + 1; // Months start at 0!
	//     let dd = targetdate.getDate();

	//     if (dd < 10) dd = '0' + dd;
	//     if (mm < 10) mm = '0' + mm;

	//     const formattedDate = dd + '-' + mm + '-' + yyyy;
	//     return formattedDate
	//   }

	return (
		<>
			<div className="OtherExpenseMain">
				<div className="row">
					<div className="col-lg-12">
						<div className="card shadow mb-4 pt-2">
							<div className="card-body">
								<div className="row d-flex">
									<div className="col-lg-3">
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
									<div className="col-lg-3">
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
									{userType === 1 && (<div className="col-lg-3">
										<div className="form-group">
											<label htmlFor="Group">Executive Name :</label>										
											<Select
												name="staff"
												id="staff"
												isSearchable="true"
												isClearable="true"
												options={optionsForStaff}
												value={executiveValue}
												onChange={(selectedOptions) => {
													executiveChangeHandler(selectedOptions);
													// getcustno(selectedOptions);
												}}

											></Select>
										</div>
									</div>)}
									<div className="col-lg-3">										
										<button className='btn-tender-block' onClick={goHandler} disabled={!filterValid}> Search </button>										
									</div>																		
									{/* <div className="col-lg-5  d-flex align-items-end flex-column">
										<Link to="main/bidcreationmain" className="rounded-pill btn btn-primary btn-icon-split">
										<span className="icon text-white-50">
											<i className="fas fa-plus-circle" />
										</span>
										<span className="text">New</span>
										</Link>
									</div>*/}
								</div>								
							</div>
						</div>
						<div className="card shadow mb-4 p-4">
							<div className="row mb-3">
								<div className="col-lg-12 text-right">
									{!!(permission?.['OtherExpenses']?.can_add) && <Link
										to="Create"
										className="btn btn-primary btn-icon-split"
									>
										<span className="icon text-white-50">
											<i className="fas fa-plus-circle" />
										</span>
										<span className="text res-720-btn-none">New</span>
									</Link>}
								</div>
							</div>
							<OtherExpenseMainList loading={loading} list={list} getlist={goHandler} />
						</div>
					</div>
					<div>
						{/* <BidManagementList loading={loading} list={list} getlist={getlist}/> */}
					</div>
				</div>
			</div>		
		</>
	);
}

export default OtherExpenseMain;