import { Fragment, useContext } from "react";
import { useState, useEffect } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import AuthContext from "../../../storeAuth/auth-context";

const initialState = {
    expenseType: "",
    activeStatus: "active",
};

const initialStateErr = {
    expenseType: '',
}

const ExpenseType = () => {
    usePageTitle("Expense Type Creation");
    const { permission } = useContext(AuthContext)
    const { server1: baseUrl } = useBaseUrl()

    const navigate = useNavigate();
    const { id } = useParams();


    const [input, setInput] = useState(initialState);
    const [inputValidation, setInputValidation] = useState(initialStateErr);

    const [dataSending, setDataSending] = useState(false);
    const [limitsForRoles, setLimitsForRoles] = useState([])

    useEffect(() => {
        axios.get(`${baseUrl}/api/usertype`).then((resp) => {
            if (resp.data.status === 200) {
                generateLimitsForRoles(resp.data.userType)
            }
        });

       if(id){
        getSavedData()
       }

    }, [])

    const getSavedData = () => {
        axios.get(`${baseUrl}/api/expensetype/${id}`).then((resp) => {
            if(resp.data.status ===200){
                let {limits_of_role, expenseType, active_status} = resp.data.ExpenseType
                setInput((prev) => ({
                    ...prev,
                    expenseType : expenseType,
                    activeStatus : active_status
                }))

                generateSavedData(limits_of_role)
                

            }
        });
    }

    const generateSavedData = (limits_of_role) => {

        limits_of_role.forEach((item,index) =>{
            setInput((prev) => ({
                ...prev,
                limitOfRoles : {
                    ...prev.limitOfRoles,
                    [item.userType_id] : {
                        unlimited : item.isUnlimited,
                        limit: item.limit ? item.limit : ''
                    }
                }
            }))
        })
    }

    const generateLimitsForRoles = (userType = []) => {
        setLimitsForRoles(userType)

        let limits = {}
        userType.forEach((item, index) => {
            limits = {
                ...limits,
                [item.id]: {
                    unlimited: 1,
                    limit: ''
                }
            }
        })

        setInput((prev) => ({ ...prev, limitOfRoles: limits }))

    }

    const inputHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });

        if (e.target.value === "") {
            setInputValidation((prev) => ({ ...prev, [e.target.name]: true }));
        } else {
            setInputValidation((prev) => ({ ...prev, [e.target.name]: false }));
        }
    }


    const inputHandlerForSelect = (value, action) => {

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

    const updateInput = (e, userId) => {
        setInput((prev) => (
            {
                ...prev,
                limitOfRoles: {
                    ...prev.limitOfRoles,
                    [userId]: {
                        unlimited: prev.limitOfRoles?.[userId]?.unlimited,
                        limit: e.target.value
                    }
                }
            }
        ))
    }



    const toggleLimits = (value, userId) => {
        // console.log(value)
        setInput((prev) => (
            {
                ...prev,
                limitOfRoles: {
                    ...prev.limitOfRoles,
                    [userId]: {
                        unlimited: +!(value),
                        limit: ''
                    }
                }
            }
        ))
    }

    let formIsValid = false;
    let limitValid = false;
    // console.log(input.limitOfRoles)

    if(input.limitOfRoles){
        limitValid = true
        for (const property in input.limitOfRoles){
            if(input.limitOfRoles[property].unlimited === 0 && input.limitOfRoles[property].limit === ''){
                limitValid = false
                break;
            }
        }

    }

    if(input.expenseType !== '' && limitValid){
        formIsValid = true;
    }

    const submitHandler = (e) => {
        e.preventDefault();

        if(!formIsValid){
            return
        }

        let data = {
            expenseType     : input.expenseType,
            activeStatus    : input.activeStatus,
            limitOfRoles    : input.limitOfRoles,
            tokenid         : localStorage.getItem("token")
        }

        if(id){
            putData(data)
        }else{
            postData(data)
        }
    }

    const postData = (data) => {
        setDataSending(true)
        console.log(data)

        axios.post(`${baseUrl}/api/expensetype`, data).then((resp) => {
        
            if(resp.data.status === 200){
                Swal.fire({
                    icon: "success",
                    title: "Expense Type",
                    text:  resp.data.message,
                    confirmButtonColor: "#5156ed",
                  });
            
                navigate(`/tender/master/expensetype`);

            }else{
                Swal.fire({
                    icon: "error",
                    title: "Expense Type",
                    text:  (resp.data.error || 'Unable to process'),
                    confirmButtonColor: "#5156ed",
                  })
            }
            setDataSending(false);
        }).catch((err) => {
            Swal.fire({
                icon: "error",
                title: "Expense Type",
                text:  (err.response.data.message || err),
                confirmButtonColor: "#5156ed",
              })
              setDataSending(false);
          });
    
    }

    const putData = (data) => {
        setDataSending(true)
        console.log(data)

        axios.put(`${baseUrl}/api/expensetype/${id}`, data).then((resp) => {
        
            if(resp.data.status === 200){
                Swal.fire({
                    icon: "success",
                    title: "Expense Type",
                    text:  resp.data.message,
                    confirmButtonColor: "#5156ed",
                  });
            
                navigate(`/tender/master/expensetype`);

            }else{
                Swal.fire({
                    icon: "error",
                    title: "Expense Type",
                    text:  (resp.data.error || 'Unable to process'),
                    confirmButtonColor: "#5156ed",
                  })
            }
            setDataSending(false);
        }).catch((err) => {
            Swal.fire({
                icon: "error",
                title: "Expense Type",
                text:  (err.response.data.message || err),
                confirmButtonColor: "#5156ed",
              })
              setDataSending(false);
          });
    
    }
    const cancelHandler = () => {
        navigate('/tender/master/expensetype')
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
                                        <label htmlFor="expenseType" className="font-weight-bold">Expense Type<span className="text-danger">&nbsp;*</span></label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            className="form-control "
                                            type="text"
                                            id="expenseType"
                                            name="expenseType"
                                            onChange={inputHandler}
                                            value={input.expenseType}
                                        />
                                        {inputValidation.expenseType && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-bold">
                                                    Invalid
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-5 text-dark ">
                                        <label htmlFor="activeStatus " className="font-weight-bold" >Active Status&nbsp;</label>
                                    </div>
                                    <div className="col-lg-7">
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
                                                    checked={("active" === input.activeStatus)}
                                                    value="active"
                                                    onChange={inputHandler}
                                                />
                                                Active
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <label className="form-check-label" htmlFor="activeStatus_inactive">
                                                <input
                                                    className="form-check-input mx-3"
                                                    type="radio"
                                                    name="activeStatus"
                                                    id="activeStatus_inactive"
                                                    checked={"inactive" === input.activeStatus}
                                                    value="inactive"
                                                    onChange={inputHandler}
                                                />
                                                Inactive
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <p className="text-danger font-weight-bold">Designation Expense Limit</p>
                            </div>
                        </div>
                        {limitsForRoles.map((item, index, arr) => {

                            return (
                                <div className="row mt-3  " key={item.id}>
                                    <div className="col-lg-2">
                                        {item.name}
                                    </div>
                                    <div className="col-lg-2">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" defaultValue id={"flexCheckChecked"+item.id} checked={input?.limitOfRoles?.[item.id].unlimited} onChange={() => toggleLimits(input?.limitOfRoles?.[item.id].unlimited, item.id)}
                                            />
                                            <label className="form-check-label" htmlFor={"flexCheckChecked"+item.id}>
                                                Unlimited
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-lg-1"></div>
                                    <div className="inputgroup col-lg-7 row">
                                        <div className="col-lg-2 text-dark">
                                            <label htmlFor="limit" className="font-weight-bold">Limit
                                            {!input?.limitOfRoles?.[item.id]?.unlimited ? <span className="text-danger">&nbsp;*</span> : ''}
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                className="form-control "
                                                type="number"
                                                id="limit"
                                                name="limit"
                                               
                                                value={input.limitOfRoles?.[item.id]?.limit}
                                                disabled={input?.limitOfRoles?.[item.id]?.unlimited}
                                                required={!input?.limitOfRoles?.[item.id]?.unlimited}
                                                onChange={(e) => {updateInput(e, item.id)}}
                                            />
                                            {inputValidation.expenseType && (
                                                <div className="pt-1">
                                                    <span className="text-danger font-weight-bold">
                                                        Invalid
                                                    </span>
                                                </div>
                                            )}
                                        </div>


                                    </div>
                                </div>
                            )
                        })}

                    </form>
                    <div className="inputgroup col-lg-12 mt-5">
                    <div className="row align-items-center">
                        <div className="col-lg-12 text-center">
                            <button
                                className="btn btn-primary"
                                disabled={!formIsValid}
                                onClick={submitHandler}
                            >
                                {dataSending && <span className="spinner-border spinner-border-sm mr-2"></span> }
                                {dataSending === true ? ((id) ? 'Updating...' :"Submitting....") : ((id) ? 'Update' :"Save" )}

                            </button>
                            <button className="btn btn-secondary mx-3" onClick={cancelHandler} disabled = {dataSending}>
                                Cancel
                            </button>
                        </div>
                        
                    </div>
                </div>
                </div>
            </div>
        </Fragment>
    )


}

export default ExpenseType