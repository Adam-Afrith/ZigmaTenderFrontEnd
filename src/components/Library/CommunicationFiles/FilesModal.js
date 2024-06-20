import axios from "axios";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";


import Select from "react-select";


import styles from "./TenderStatus_StatusModal.module.css";


import Swal from "sweetalert2";
import PreLoader from "../../UI/PreLoader";
import ModalCard from "../../UI/Modal/ModalCard";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import DocListModal from "./DocListModal";


const FilesModal = (props) => {

  const { server1: baseUrl } = useBaseUrl();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [dragover, setdragover] = useState(false);
  const [file, setFile] = useState(null);
  const [formId, setFormId] = useState(0);
  const [isdatasending, setdatasending] = useState(false);
  const [progress, setProgressCompleted] = useState(0);
  const [FetchLoading, setFetchLoading] = useState(false);
  const [docList,setDocList] = useState([])
  const { id } = useParams();



  useEffect(() => {
    if(props.mainId){
      setFetchLoading(true)
      let data ={
          mainid : props.mainId,
      }
    
      axios.post(`${baseUrl}/api/communicationfilesmaster/list`, data).then((resp) => {
          if(resp.status === 200){
              console.log(resp.data.docs)
              setDocList(resp.data.docs)          
          }else{
              
          }
          setFetchLoading(false) 
      })
    }
  }, [props.mainId])




  

  

  
  


 

 

  return (
    <Fragment>
      <ModalCard id={"filesCloud"} modalsize={'large'}>
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Files
          </h5>
          <button
            className="close"
            type="button"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <PreLoader loading={FetchLoading}>
          <div className="modal-body">
          <DocListModal loading = {false} docList={docList}/>
          </div>
        </PreLoader>

        <div className="modal-footer">
          <button
            className="btn btn-secondary rounded-pill"
            type="button"
            data-dismiss="modal"
          >
            Cancel
          </button>
          {/* {(formId === 0) && (
            <button
              className={
                !formIsValid
                  ? "btn btn-outline-primary float-right rounded-pill"
                  : "btn btn-primary float-right rounded-pill"
              }
              disabled={!formIsValid || isdatasending || FetchLoading}
              onClick={submitHandler}
            >
              {isdatasending && (
                <span className="spinner-border spinner-border-sm mr-2"></span>
              )}
              {isdatasending && progress + "% Submitting..."}
              {!isdatasending && "Submit"}
            </button>
          )}
          {(formId > 0) && (
            <button
              className={
                !formIsValid
                  ? "btn btn-outline-primary float-right rounded-pill"
                  : "btn btn-primary float-right rounded-pill"
              }
              disabled={!formIsValid || isdatasending || FetchLoading}
              onClick={submitHandler}
            >
              {isdatasending && (
                <span className="spinner-border spinner-border-sm mr-2"></span>
              )}
              {isdatasending && progress + "% Updating..."}
              {!isdatasending && "Update"}
            </button>
          )} */}
        </div>
      </ModalCard>
    </Fragment>
  );
}

export default FilesModal;
