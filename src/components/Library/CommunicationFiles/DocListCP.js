import { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from "react";

import axios from "axios";
import styles from './UploadDoc.module.css';
import Swal from "sweetalert2";
import { useOutletContext } from "react-router-dom";

import DocCardCP from "./DocCardCP";
import PreLoader from "../../UI/PreLoader";
import { useBaseUrl } from "../../hooks/useBaseUrl";

const DocListCP = forwardRef((props, ref) => {

    const { server1: baseUrl } = useBaseUrl();
    const [docList, setDocList] = useState([]);

    const [loading, setPreLoader] = useState(false)

    useImperativeHandle(ref , () => ({
        getDocList
    }))

    const getDocList = () => {
        setPreLoader(true)
        let data ={
            mainid : props.BidCreationId,
        }
      
        axios.post(`${baseUrl}/api/bidcreation/corrigendumpublish/docupload/list`, data).then((resp) => {
            if(resp.status === 200){
                setDocList(resp.data.docs)     
            }else{
    
            }
            setPreLoader(false)
        })
    }

    const deleteHandler = (id, docname) => {
        Swal.fire({
            text: `Are You sure, to delete '${docname}'?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            confirmButtonColor: '#2fba5f',
            cancelButtonColor: '#fc5157'
        }).then((willDelete) => {
          if(willDelete.isConfirmed){
            axios.delete(`${baseUrl}/api/bidcreation/corrigendumpublish/docupload/${id}`).then((resp) =>{
              if (resp.data.status === 200) {
                getDocList()
                // toastSuccess(resp.data.message)
              }else if(resp.data.status === 404) {
                // toastError(resp.data.message)
              }else{
                // toastError("Something went wrong!")
              }
            })
          } else{
            Swal.fire({
                title: 'Cancelled',
                icon:'error',
                timer: 1500
              });
            }
        })
    }


    useEffect(()=>{
        getDocList()
    },[])


    return (
        <Fragment>
            <div className="DocListCP">
                <div className="d-sm-flex align-items-center justify-content-between mt-2 mb-2">
                    <h1 className="h4 mb-0 text-primary">Documents To be Uploaded</h1>
                </div>
                <PreLoader loading={loading}>
                    {props.filesToUpload.length > 0  && <div className={`overflow-auto col-lg-12 ${styles.doclist}`}>
                        {props.filesToUpload.map((item, index) => {
                            return(
                                <DocCardCP key = {index} item = {item} index={index} onDelete={props.deleteFromUpload} onEdit={props.onEdit}/>
                            )
                        })}
                    </div>}
                    {props.filesToUpload.length <= 0 && 
                    <div className={'mt-3'}>
                        <h5>No documents found. </h5>
                    </div>
                    }
                </PreLoader>
            </div>
        </Fragment>
    )
})

export default DocListCP;