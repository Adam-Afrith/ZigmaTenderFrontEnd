import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { usePageTitle } from "../../hooks/usePageTitle";
import useInputValidation from "../../hooks/useInputValidation";
import { isNotEmpty, isNotNull } from "../CommonFunctions/CommonFunctions";
import Swal from "sweetalert2/src/sweetalert2.js";
import Select from "react-select";
// import styles from "./UserCreation.module.css";
// import ReadyToUpload from "./ReadyToupload";
import ReimbursementSublist from "./ReimbursementSublist";

const initialState = {
    staff_name: "",
    name_for_app: "",
    note: "",
    entry_date: "",

}

const initialStateErr = {
    staff_name: '',
    name_for_app: '',
    note: '',
    entry_date: "",

}

const ReimbursementCreate = () => {
    usePageTitle("Create Reimbursement Form");
    // const { id } = useParams();
    const navigate = useNavigate();
    const { id } = useParams();

    const { server1: baseUrl } = useBaseUrl();
    const wrapperRef = useRef(null);
    const [file, setFile] = useState(null);

    const [dataSending, setDataSending] = useState(false);
    const [input, setInput] = useState(initialState);
    const [roleOptions, setRoleoptions] = useState([]);
    const [inputValidation, setInputValidation] = useState(initialStateErr);
    const [dragover, setdragover] = useState(false);
    const [TenderDescriptionlen, setTenderDescriptionlen] = useState(255);
    const [isDisabled, setIsDisabled] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().substr(0, 10)); // initialize date state with current date
    const [getSublist, setSublist] = useState('');
    useEffect(() => {


        axios.post(`${baseUrl}/api/expensesapp/staffList`).then((response) => {
            if (response.data.status === 200) {
                generateOptions(response.data.get_staff);
            }
        });



    }, [])
    /***********For child componet get data process  */
    const [checkedValues, setCheckedValues] = useState([]);
    const SlectedVlaue = [checkedValues];
    const handleExpense = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        console.log('checked', value);
        setCheckedValues(prevValues => {
            if (isChecked) {
                // add the value to the array
                return [...prevValues, value];
            } else {
                // remove the value from the array
                return prevValues.filter(val => val !== value);
            }
        });
        setTimeout(function () {
            CheckChecked();
        }, 500);



    };

    const CheckChecked = () => {
        var Sublist = document.getElementById('checking').value;
        if (Sublist.length != 0) {

            setIsDisabled(true);

        } else {
            setIsDisabled(false);
        }
        console.log('checkedValues', Sublist.length);

    }
    /****************************** */
    const {
        value: noteValue,
        isValid: noteIsValid,
        hasError: noteHasError,
        valueChangeHandler: noteChangeHandler,
        inputBlurHandler: noteBlurHandler,
        setInputValue: setnoteValue,
        reset: resetnote,
    } = useInputValidation(isNotEmpty);

    const {
        value: entry_dateValue,
        isValid: entry_dateIsValid,
        hasError: entry_dateHasError,
        valueChangeHandler: entry_dateChangeHandler,
        inputBlurHandler: entry_dateBlurHandler,
        setInputValue: setentry_dateValue,
        reset: resetentry_date,
    } = useInputValidation(isNotEmpty);


    const validateInputLength = (e) => {
        let maxLength = 255;
        setTenderDescriptionlen(maxLength - e.target.value.length);
    };
    // useEffect(() => {

    //     if(id){
    //       axios.get(`${baseUrl}/api/usercreation/${id}`).then((resp)=> {
    //         console.log(resp)
    //         if(resp.data.status === 200){
    //             let user =  resp.data.user
    //             setInput({
    //                 usertype: user.userType,
    //                 activeStatus: user.activeStatus,
    //                 userName : user.userName,
    //                 loginId  : user.name,
    //                 password : user.confirm_passsword,
    //                 confirmPassword :  user.confirm_passsword,
    //                 mobile: user.mobile.toString(),
    //                 email: user.email,
    //             })

    //             if(resp.data.user.filename){
    //                 axios({
    //                     url: `${baseUrl}/api/download/userfile/${user.id}`,
    //                     method: 'GET',
    //                     responseType: 'blob', // important
    //                 }).then((response) => {
    //                     if (response.status === 200) {
    //                         response.data.name = user.original_filename
    //                         setFile(response.data)
    //                     } 
    //                     // setFetchLoading(false)
    //                 });
    //             }
    //         }
    //       })
    //     }
    //   },[id, baseUrl])

    const generateOptions = (usertype = []) => {
        let roles = usertype.map((role, index) => ({
            value: role.id,
            label: role.userName,
        }))

        setRoleoptions(roles)
    }






    const inputHandlerForSelect = (value, action) => {

        if (value) {
            GetSubData(value)
        }
        else {

            setSublist('');
        }


        setInput({
            ...input,
            [action.name]: value,
        });
        if (value === "" | value === null) {
            setInputValidation({ ...inputValidation, [action.name]: true });

        }
        else {
            setInputValidation({ ...inputValidation, [action.name]: false });

        }
    };

    const inputHandlerForApproval = (value, action) => {


        setInput({
            ...input,
            [action.name]: value,
        });
        if (value === "" | value === null) {
            setInputValidation({ ...inputValidation, [action.name]: true });

        }
        else {
            setInputValidation({ ...inputValidation, [action.name]: false });

        }
    };

    const GetSubData = (id) => {

        setSublist(id.value)
    }







    let formIsValid = false;
    //1998
    if (input.staff_name !== '' &&
        (entry_dateValue !== null && entry_dateValue !== '') &&
        input.name_for_app !== ''&&(checkedValues!='' && checkedValues!=null)) {
        formIsValid = true
    }

    const postData = (data) => {
        axios.post(`${baseUrl}/api/usercreation`, data).then((resp) => {
            if (resp.data.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "User Creation",
                    text: resp.data.message,
                    confirmButtonColor: "#5156ed",
                });

                navigate(`/tender/master/usercreation`);

            } else if (resp.data.status === 400) {
                Swal.fire({
                    icon: "error",
                    title: "User Creation",
                    text: resp.data.errors,
                    confirmButtonColor: "#5156ed",
                });
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "User Creation",
                    text: "Provided Credentials are Incorrect",
                    confirmButtonColor: "#5156ed",
                }).then(() => {
                    localStorage.clear();
                    navigate("/");
                });
            }
            setDataSending(false);
        }).catch((err) => {
            console.log("err", err.response.data.message)
            Swal.fire({
                icon: "error",
                title: "User Creation",
                text: (err.response.data.message || err),
                confirmButtonColor: "#5156ed",
            })
            setDataSending(false);
        });
    }

    const putData = (data, id) => {
        axios.post(`${baseUrl}/api/usercreation/${id}?_method=PUT`, data).then((resp) => {
            if (resp.data.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "User Creation",
                    text: resp.data.message,
                    confirmButtonColor: "#5156ed",
                });

                navigate(`/tender/master/usercreation`);

            } else if (resp.data.status === 400) {
                Swal.fire({
                    icon: "error",
                    title: "User Creation",
                    text: resp.data.errors,
                    confirmButtonColor: "#5156ed",
                });
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "User Creation",
                    text: "Provided Credentials are Incorrect",
                    confirmButtonColor: "#5156ed",
                })
                //   .then (()=>{
                //     localStorage.clear();
                //     navigate("/");
                //   });
            }
            setDataSending(false);
        }).catch((err) => {
            console.log("err", err.response.data.message)
            Swal.fire({
                icon: "error",
                title: "User Creation",
                text: (err.response.data.message || err),
                confirmButtonColor: "#5156ed",
            })
            setDataSending(false);
        });
    }

    const submitHandler = (e) => {
        e.preventDefault();

        if (!formIsValid) {
            setDataSending(false)
            return
        }
        //1998
      
        let data = {
            staff_name: input.staff_name.value,
            entry_date: entry_dateValue,
            notes: noteValue,
            approverName: input.name_for_app.value,
            checkedExpenses: checkedValues,
        }
console.log('data',data);

axios.post(`${baseUrl}/api/expensesapp/storeData`, data).then((resp) => {
    if (resp.data.status === 200) {
        Swal.fire({
            icon: "success",
            title: "Reimbursement Form",
            text: "Added Succesfully",
            confirmButtonColor: "#5156ed",
        });

        navigate(`/tender/expenses/Reimbursement`);

    } else  {
        Swal.fire({
            icon: "error",
            title: "Reimbursement Form",
            text: "Entry Not Added",
            confirmButtonColor: "#5156ed",
        });
    }
    
    setDataSending(false);
}).catch((err) => {
    console.log("err", err.response.data.message)
    Swal.fire({
        icon: "error",
        title: "User Creation",
        text: (err.response.data.message || err),
        confirmButtonColor: "#5156ed",
    })
    setDataSending(false);
});
       
    }

    const cancelHandler = () => {
        navigate(`/tender/expenses/Reimbursement`);
    }

    return (
        <Fragment>
            <div className="">
                <div className="card shadow mb-4 p-4">
                    <form>
                        <div className="row align-items-center">
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="userName" className="font-weight-bold">Staff Name<span className="text-danger">&nbsp;*</span> </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <Select
                                            name="staff_name"
                                            id="staff_name"
                                            isSearchable="true"
                                            isClearable="true"
                                            options={roleOptions}
                                            value={input.staff_name}
                                            onChange={inputHandlerForSelect}
                                            isDisabled={isDisabled}
                                        ></Select>
                                        <input
                                            type="hidden"
                                            name="checking"
                                            id="checking"
                                            className="form-control"
                                            value={checkedValues}

                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="usertype" className="font-weight-bold">Entry Date<span className="text-danger">&nbsp;*</span> </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="date"
                                            name="entry_date"
                                            id="entry_date"
                                            className="form-control"
                                            value={entry_dateValue}
                                            onChange={entry_dateChangeHandler}
                                            disabled={isDisabled}
                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-12 mb-4">
                                <ReimbursementSublist onData={getSublist} handleExpense={handleExpense} />
                            </div>
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="name_for_app" className="font-weight-bold">HOD Name For Approval<span className="text-danger">&nbsp;*</span> </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <Select
                                            name="name_for_app"
                                            id="name_for_app"
                                            isSearchable="true"
                                            isClearable="true"
                                            options={roleOptions}
                                            value={input.name_for_app}
                                            onChange={inputHandlerForApproval}
                                        ></Select>
                                    </div>

                                </div>
                            </div>                            
                            <div className="inputgroup col-lg-6 mb-4">

                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="email" className="font-weight-bold">Note</label>
                                    </div>
                                    <div className="col-lg-8">
                                        <textarea
                                            className="form-control"
                                            id="note"
                                            placeholder="Note"
                                            name="note"
                                            rows="3"
                                            onChange={noteChangeHandler}
                                            onBlur={noteBlurHandler}
                                            value={noteValue}
                                            onKeyUp={noteChangeHandler}

                                        ></textarea>
                                    </div>
                                </div>
                            </div>



                            {(file !== null) && <div className="inputgroup col-lg-12 mb-4">
                                <div className="row col-lg-6">
                                    <div className="col-lg-4 text-dark font-weight-bold  p-0">
                                        {(file.lastModified) && <label htmlFor="customername">(Ready To Upload)</label>}
                                        {(!file.lastModified) && <label htmlFor="customername">(Uploaded Doc/File)</label>}
                                    </div>

                                </div>
                                <div className="col-lg-6">&nbsp;</div>
                            </div>}
                            <div className="inputgroup col-lg-12">
                                <div className="row align-items-center">
                                    <div className="col-lg-12 text-center ">
                                        <button
                                            className="btn btn-primary mr-3"
                                            disabled={!formIsValid}
                                            onClick={submitHandler}
                                        >
                                            {dataSending && <span className="spinner-border spinner-border-sm mr-2"></span>}
                                            {dataSending === true ? ((id) ? 'Updating...' : "Submitting....") : ((id) ? 'Update' : "Save")}

                                        </button>
                                        <button className="btn btn-secondary" onClick={cancelHandler} disabled={dataSending}>
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
    )
}

export default ReimbursementCreate