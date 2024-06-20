import axios from "axios";

import { useEffect, useContext, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import AuthContext from "../../../storeAuth/auth-context";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import useInputValidation from "../../hooks/useInputValidation";
import { isNotEmpty, isNotNull } from "../CommonFunctions/CommonFunctions";
import Select from "react-select";
import ReimbursementList from "./ReimbursementList";



function ReimbursementAdmin(props) {

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
	const [optionsForStaff, setOptionsForStaff] = useState([]);
	const [groupOptions, setgroupOptions] = useState(initialOptions);
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


	let filterValid = true;


	const cust_category = [

		{ value: "state", label: "State" },
		{ value: "unionterritory", label: "Union Territory" },

	];
	const Group = [

		{ value: "yes", label: "Smart City" },
		{ value: "no", label: "Non Smart City" },

	];
	const getStateData = async (savedState) => {
		let response = await axios.get(`${baseUrl}/api/state-list/${savedState}`);
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
		value: groupValue,
		isValid: groupIsValid,
		hasError: groupHasError,
		valueChangeHandlerForReactSelect: groupChangeHandler,
		inputBlurHandler: groupBlurHandler,
		setInputValue: setgroup,
		reset: resetgroup,
	} = useInputValidation(isNotNull);
	const {
		value: executiveValue,
		isValid: executiveIsValid,
		hasError: executiveHasError,
		valueChangeHandlerForReactSelect: executiveChangeHandler,
		inputBlurHandler: executiveBlurHandler,
		setInputValue: setexecutive,
		reset: resetexecutive,
	} = useInputValidation(isNotNull);
	// if(stateIsValid || catIsValid || groupIsValid){
	//   filterValid = true;
	// }
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


	}, [])

	const goHandler = async () => {
		console.log('grp', groupValue?.value);
		// setLoading(true)
		if (catValue?.value == null) {
			var value1 = '';
		}
		else {
			var value1 = catValue.value;
		}

		if (stateValue?.value == null) {
			var value2 = '';
		}
		else {
			var value2 = stateValue.value;
		}

		if (executiveValue?.value == null) {
			var value3 = '';
		}
		else {
			var value3 = executiveValue.value;
		}

		let data = {
			fromdate: fromdateValue,
			todate: todateValue,
			executive: value3,
		}


		let response = await axios.post(`${baseUrl}/api/expensesapp/expapp`, data)
		let listarr = await generateListArray(response)

		setListarr(listarr)
		setLoading(false)
	}

	const generateListArray = async (response) => {

		let list = [...response.data.exp_app];

		let listarr = list.map((item, index, arr) => {
			let ho_app = '';
			let ceo_app = '';
			let hr_app = '';
			let ViewCustomer = item.customers;
			// let ViewCustomer =  <UlbViewCity />;
			// let editbtn ='<i calss="customer" style="cursor:pointer">'+item.customers+'</i> ';
			let cust = '<i class=" customer" style="cursor:pointer" >' + item.customers + '</i> ';

			let m20 = '<i class=" m20" style="cursor:pointer" >' + item.more_20 + '</i> ';
			let b10_20 = '<i class=" b10_20" style="cursor:pointer" >' + item.btw_10_20 + '</i> ';
			let b_5_10 = '<i class=" b_5_10" style="cursor:pointer" >' + item.btw_5_10 + '</i> ';
			let b_3_5 = '<i class=" b_3_5" style="cursor:pointer" >' + item.btw_3_5 + '</i> ';
			let print = '<i class="fas fa-solid fa-print print" style={{color: "#70e60f"}} ></i>';
			/**********HO approval********** */
			if (item.ho_approval == 'pending') {
				ho_app = '<i class="fas fa-p  pending" style={{color: "#70e60f", cursor: "pointer"}} data-action="HOApprove"></i>';
			} else if (item.ho_approval == 'approved') {
				ho_app = '<i class="fas fa-check approve" style={{color: "#70e60f", cursor: "pointer"}}  ></i>';
			}
			else if (item.ho_approval == 'rejected') {
				ho_app = '<i class="fas fa-xmark fade reject" style={{color: "#70e60f", cursor: "pointer"}} data-action="HOApprove_reject" ></i>';
			}

			/**********ceo approval********** */
			if (item.ceo_approval == 'pending') {

				ceo_app = '<i class="fas fa-p  pending" style={{color: "#70e60f", cursor: "pointer"}} data-action="CEOApprove" ></i>';
			} else if (item.ceo_approval == 'approved') {
				ceo_app = '<i class="fas fa-check  approve" style={{color: "#70e60f", cursor: "pointer"}} ></i>';

			}
			else if (item.ceo_approval == 'rejected') {
				ceo_app = '<i class="fas fa-xmark fade reject" style={{color: "#70e60f", cursor: "pointer"}} data-action="CEOApprove_reject"></i>';
			}

			/**********HR approval********** */
			if (item.hr_approval == 'pending') {
				hr_app = '<i class="fas fa-p  pending" style={{color: "#70e60f", cursor: "pointer"}} data-action="HRApprove" ></i>';
			} else if (item.hr_approval == 'approved') {
				hr_app = '<i class="fas fa-check  approve" style={{color: "#70e60f", cursor: "pointer"}} ></i>';
			}
			else if (item.hr_approval == 'rejected') {
				hr_app = '<i class="fas fa-xmark fade reject" style={{color: "#70e60f", cursor: "pointer"}} data-action="HRApprove_reject" ></i>';
			}



			return {
				...item,
				entry_date: item.entry_date,
				bill_no: item.ex_app_no,
				staff_name: item.userName,
				total_amount: item.total_amount,
				ho_app: ho_app,

				ceo_app: ceo_app,
				hr_app: hr_app,
				view: print,





				sl_no: index + 1
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
			<div className="ReimbursementAdmin">
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
									<div className="col-lg-3">
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
									</div>
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
							<div>
								{/* <BidManagementList loading={loading} list={list} getlist={getlist}/> */}

							</div>
						</div>
						<div className="card shadow mb-4 p-4">
							<div className="row mb-3">
								<div className="col-lg-12 text-right">
									{!!(permission?.['ReimbursementForm']?.can_add) && <Link
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
							<ReimbursementList loading={loading} list={list} getlist={goHandler} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default ReimbursementAdmin;