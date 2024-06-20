import axios from "axios";
import Select from "react-select";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { usePageTitle } from "../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";

const initialState = {
    occasion: "",
    date: '',
    day: '',
    remarks: ''
}

const initialStateErr = {
    occasion: "",
    date: '',
    day: '',
    remarks: ''
}

const Day = [
    {label: 'Sunday', value: 'Mon'},
    {label: 'Monday', value: 'Tues'},
    {label: 'Tuesday', value: 'Wednes'},
    {label: 'Wednesday', value: 'Thurs'},
    {label: 'Thursday', value: 'Fri'},
    {label: 'Friday', value: 'Sat'},
    {label: 'Saturday', value: 'Sun'},
]

const HolidayCreation = () => {

    usePageTitle("Holiday Creation");
    const navigate = useNavigate();
    const { id } = useParams();

    const { server1: baseUrl } = useBaseUrl();

    const [dataSending, setDataSending] = useState(false);
    const [input, setInput] = useState(initialState);
    const [inputValidation, setInputValidation] = useState(initialStateErr);


    useEffect(()=> {             
        let data = {
            tokenid : localStorage.getItem('token')
          }
        if(id) {
            axios.get(`${baseUrl}/api/holidays/${id}`).then((resp)=> {                 
                // const holidaysList = resp.data.holidaylist.map((hod)=> ({                
                //     occasion : hod.occasion,
                //     date: hod.date,
                //     remarks : hod.remarks,
                //     action : <button onClick={() => getRow(hod)}><i className="fas fa-edit"/></button>
                // }))              
                // setData(holidaysList);                     

                
                 
                const date = new Date(resp.data.holidaylist[0].date); 
                const dayIndex = date.getDay(); // Get the day index (0 for Sunday, 1 for Monday, etc.)
        
                // Map the day index to the corresponding value from the Day array
                const dayValue = Day[dayIndex].value;
                const dayLabel = Day[dayIndex].label;
  
                setInput({...input, 
                    date: resp.data.holidaylist[0].date,
                    occasion: resp.data.holidaylist[0].occasion,
                    remarks: resp.data.holidaylist[0].remarks,
                    day: { value: dayValue, label: dayLabel },
                })
                
            })
        }            
    },[id]);

    const inputDateHandler = (e) => {
        const date = new Date(e.target.value); // Create a new Date object from the selected date
        const dayIndex = date.getDay(); // Get the day index (0 for Sunday, 1 for Monday, etc.)
        
        // Map the day index to the corresponding value from the Day array
        const dayValue = Day[dayIndex].value;
        const dayLabel = Day[dayIndex].label;

        setInput({
            ...input,
            day: { value: dayValue, label: dayLabel },
            [e.target.name]: e.target.value
        });
        // console.log('date',date);
        // console.log('dayIndex',dayIndex);
    }
   
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
    }

    const selectHandler = (value, action) => {
        setInput({...input, [action.name]: value});
    }


    const postData = (formData) => {
        // console.log("Post Data")
        axios.post(`${baseUrl}/api/holidays`, formData).then((resp) => {  
            // console.log('resp', resp)          
          if (resp.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Holiday",
              text:  "Added Successfully",
              confirmButtonColor: "#5156ed",
            });
          navigate('/tender/hr/holidays');
          
          } else if (resp.status === 400) {
            Swal.fire({
              icon: "error",
              title: "Holiday",
              text: resp.data.errors,
              confirmButtonColor: "#5156ed",
            });
           
          }
        //   else {
        //     Swal.fire({
        //       icon: "error",
        //       title: "Holiday",
        //       text: "Provided Credentials are Incorrect",
        //       confirmButtonColor: "#5156ed",
        //     }).then (()=>{
        //       localStorage.clear();
        //       navigate("/");
        //     });
        //   }
          setDataSending(false);
        })
        .catch((err) => {
            // console.log("err", err.response.data.message)
            Swal.fire({
                icon: "error",
                title: "Holiday",
                text:  (err.response.data.message || err),
                confirmButtonColor: "#5156ed",
              })
              setDataSending(false);
          });
      };


      const putData = (data, id) => {
        axios.put(`${baseUrl}/api/holidays/${id}`, data).then((res) => {
            // console.log('res',res);
          if (res.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Holiday",
              text: "Updated Successfully!",
              confirmButtonColor: "#5156ed",
            });
            setInput(initialState)
            navigate('/tender/hr/holidays')
          } else if (res.data.status === 400) {
            Swal.fire({
              icon: "error",
              title: "Holiday",
              text: res.data.errors,
              confirmButtonColor: "#5156ed",
            });
            setDataSending(false)
          }
        })
        .catch((err) => {
            // console.log("err", err.response.data.message)
            Swal.fire({
                icon: "error",
                title: "Holiday",
                text:  (err.response.data.message || err),
                confirmButtonColor: "#5156ed",
              })
              setDataSending(false);
          });
        ;
      }


    let formIsValid = false;

    if(input.occasion !== "" ){
        formIsValid = true 
    }

    const submitHandler = (e) => {
        e.preventDefault();
        
        setDataSending(true)

        if(!formIsValid){
           setDataSending(false)
           return     
        }
        
        let data = {
            occasion : input.occasion,
            date : input.date,
            remarks : input.remarks,
            // day : input.day?.value,
            tokenid : localStorage.getItem("token")            
        }


        const formData = new FormData();
        formData.append('occasion', input.occasion); 
        formData.append('date',input.date);  
        formData.append('remarks',input.remarks);  
        formData.append('tokenid',localStorage.getItem("token"));  

      
        if(!id){
            postData(formData);
        }else{
            putData(data, id);
        }
        

    }

    const cancelHandler = () => {
        navigate(`/tender/hr/holidays`);
    }


    // console.log('input', input);
    return (
        <Fragment>            
            <div className="card shadow mb-4 p-4">
                <form>
                    <div className="row align-items-center">
                        <div className="inputgroup col-lg-6 mb-4">
                            <div className="row align-items-center">
                                <div className="col-lg-3 text-dark">
                                    <label htmlFor="occasion" className="font-weight-bold">Occasion Name<span className="text-danger">&nbsp;*</span> </label>
                                </div>
                                <div className="col-lg-9">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="occasion"
                                        name="occasion"
                                        value={input.occasion}
                                        onChange={inputHandler}
                                    />

                                    {inputValidation.occasion && (
                                        <div className="pt-1">
                                            <span className="text-danger font-weight-bold">
                                                Enter Occasion Type
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="inputgroup col-lg-6 mb-4">
                            <div className="row align-items-center">
                                <div className="col-lg-3 text-dark ">
                                    <label htmlFor="date " className="font-weight-bold" > Date &nbsp;</label>
                                </div>
                                <div className="col-lg-9">                                                                            
                                            <input
                                                className="form-control"
                                                type="date"
                                                name="date"
                                                id="date_active"                                                    
                                                value={input.date}
                                                onChange={inputDateHandler}
                                            />                                                                                                                             
                                </div>
                            </div>
                        </div>
                        <div className="inputgroup col-lg-6 mb-4">
                            <div className="row align-items-center">
                                <div className="col-lg-3 text-dark ">
                                    <label htmlFor="day" className="font-weight-bold" > Day &nbsp;</label>
                                </div>
                                <div className="col-lg-9">                                    
                                <Select
                                    name="day"
                                    id="day"
                                    isSearchable="true"
                                    isClearable="true"
                                    options={Day}
                                    value={input.day}
                                    onChange={selectHandler}
                                    isDisabled={true}
                                ></Select>                                                                                                                  
                                </div>
                            </div>
                        </div>
                        <div className="inputgroup col-lg-6 mb-4">
                            <div className="row align-items-center">
                                <div className="col-lg-3 text-dark ">
                                    <label htmlFor="remarks" className="font-weight-bold" >Remarks &nbsp;</label>
                                </div>
                                <div className="col-lg-9">                                    
                                    <textarea className="form-control" cols={50} rows={2} name='remarks' value={input.remarks} onChange={inputHandler}></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="inputgroup col-lg-12 mb-4 ml-3">
                            <div className="row align-items-center">
                                <div className="col-lg-12 text-center ">
                                    <button
                                        className="btn btn-primary"
                                        disabled={!formIsValid}
                                        onClick={submitHandler}
                                    >
                                        {dataSending && <span className="spinner-border spinner-border-sm mr-2"></span> }
                                        {dataSending === true ? ((id) ? 'Updating...' :"Submitting....") : ((id) ? 'Update' :"Save" )}

                                    </button>
                                        <span>&nbsp;&nbsp;&nbsp;</span>
                                    <button className="btn btn-secondary" onClick={cancelHandler} disabled = {dataSending}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>            
        </Fragment>
    )
}

export default HolidayCreation;







// const date = new Date(e.target.value); // Create a new Date object from the selected date
// const dayIndex = date.getDay(); // Get the day index (0 for Sunday, 1 for Monday, etc.)

// // Map the day index to the corresponding value from the Day array
// const dayValue = Day[dayIndex].value;
// const dayLabel = Day[dayIndex].label;

// setInput({
//     ...input,
//     day: { value: dayValue, label: dayLabel },
//     [e.target.name]: e.target.value
// });
// // console.log('date',date);
// // console.log('dayIndex',dayIndex);