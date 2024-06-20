import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import useInputValidation from "../../../../hooks/useInputValidation";
import CollapseCard from "../../../../UI/CollapseCard";
import LockCard from "../../../../UI/LockCard";
import PreLoader from "../../../../UI/PreLoader";
import { isNotNull } from "../../../CommonFunctions/CommonFunctions";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";

const TenderParticipation = () => {
    const { id } = useParams();
    const [FetchLoading, setFetchLoading] = useState(false);
    const [isdatasending, setdatasending] = useState(false);
    const [toastSuccess, toastError, setBidManagementMainId, bidManageMainId, istenderParticipated, setTenderParticipated ] = useOutletContext();
    const { server1: baseUrl } = useBaseUrl();
    const [formId, setFormId] = useState(0);
    
  const {
    value: tenderParticipationValue,
    isValid: tenderParticipationIsValid,
    hasError: tenderParticipationHasError,
    valueChangeHandlerForReactSelect: tenderParticipationChangeHandler,
    inputBlurHandler: tenderParticipationBlurHandler,
    setInputValue: settenderParticipation,
    reset: resettenderParticipation,
  } = useInputValidation(isNotNull);

  const tenderParticipationOptions = [
    {value: 'participating', label: 'Participating'},
    {value: 'notparticipating', label: 'Non - Participating'},
  ];

  useEffect(() => {
    if(id){
      setFetchLoading(true)
      axios.get(`${baseUrl}/api/bidcreation/tenderparticipation/${id}`).then((resp) => {
        if (resp.data.status === 200) {
           setFormId(resp.data.BidCreationTenderParticipation.id)
           settenderParticipation(tenderParticipationOptions.find(
            (x) => x.value === resp.data.tenderpartcipation
          )) 
        }
        setFetchLoading(false)
      })  
    }
  },[])

  let formIsValid = false;

  if(tenderParticipationIsValid){
    formIsValid = true;
  }

  const postData = (data) => {
    axios.post(`${baseUrl}/api/bidcreation/tenderparticipation`, data).then((resp) => {
      if (resp.data.status === 200) {
        
        toastSuccess(resp.data.message)
        setFormId(resp.data.id)

        if(data.bidcreationData.tenderParticipation.value === 'participating'){
          setTenderParticipated(true)
        }else{
          setTenderParticipated(false)
        }
        // resetall()
        // window.history.replaceState({},"Bid Creation", "/tender/bidmanagement/list/main/bidcreationmain/"+resp.data.id);
        // navigate("/tender/bidmanagement/list/main/bidcreationmain/"+resp.data.id);
        // myRef.current.scrollIntoView({ behavior: 'smooth' })    
      } else if (resp.data.status === 400) {
        toastError(resp.data.message)
      }
      setdatasending(false)
    }).catch((err) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          })
          setdatasending(false)
    });
  };

  const putData =(data) =>{
    axios.put(`${baseUrl}/api/bidcreation/tenderparticipation/${formId}`, data).then((resp) =>{
  
        if (resp.data.status === 200) {
          toastSuccess(resp.data.message)
        
          if(data.bidcreationData.tenderParticipation.value === 'participating'){
            setTenderParticipated(true)
          }else{
            setTenderParticipated(false)
          }
        }else {
          toastError("Something went wrong!")
        }
        setdatasending(false)
      }).catch((err) => {
        
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          })
          setdatasending(false)
      });
  }

  const submitHandler = (e) => {
    e.preventDefault();

    setdatasending(true);

    if (!formIsValid) {
      setdatasending(false);
      return;
    }

    // console.log("Submitted!");

    let bidcreationData = {
        tenderParticipation: tenderParticipationValue,
        bidcreationMainid : id
    };

    let data = {
      bidcreationData: bidcreationData,
      tokenid: localStorage.getItem("token"),
      form_id: formId,
    };

  

    if(formId === 0){
        postData(data);
    }else if(formId > 0){
        putData(data)
    }

  };

    return(
        <CollapseCard id = {"TenderParticipation"} title={"Tender Participation"}>
            <LockCard locked={!id}>
                <PreLoader loading = {FetchLoading}>
                <form onSubmit={submitHandler}>
          <div className="row align-items-center ">
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold">
                  <label htmlFor="tenderParticipation">Tender Participation <span className="text-danger">*</span> </label>
                </div>
                <div className="col-lg-8">
                  <Select
                    name="tenderParticipation"
                    id="tenderParticipation"
                    isSearchable="true"
                    isClearable="true"
                    options={tenderParticipationOptions}
                    onChange={(selectedOptions) => {
                      tenderParticipationChangeHandler(selectedOptions);
                      // getcustno(selectedOptions);
                    }}
                    onBlur={tenderParticipationBlurHandler}
                    value={tenderParticipationValue}
                 
                  ></Select>
                  {tenderParticipationHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        Tender Participation is required
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
         
  
            <div className="col-lg-12">
              {formId === 0 && (
                <button
                  className={
                    !formIsValid
                      ? "btn btn-outline-primary float-right rounded-pill"
                      : "btn btn-primary float-right rounded-pill"
                  }
                  disabled={!formIsValid || isdatasending}
                >
                  {isdatasending && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  {isdatasending && "Saving..."}
                  {!isdatasending && "Save"}
                </button>
              )}
              {formId > 0 && (
                <button
                  className={
                    !formIsValid
                      ? "btn btn-outline-primary float-right rounded-pill"
                      : "btn btn-primary float-right rounded-pill"
                  }
                  disabled={!formIsValid || isdatasending}
                >
                  {isdatasending && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  {isdatasending && "Updating..."}
                  {!isdatasending && "Edit"}
                </button>
              )}
            </div>
          </div>
        </form>
                </PreLoader>
            </LockCard>
        </CollapseCard>
        )
}
export default TenderParticipation;