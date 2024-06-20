import { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from "react";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import axios from "axios";
import styles from './UploadDocTechnicalEvalution.module.css';
import Swal from "sweetalert2";
import { useOutletContext } from "react-router-dom";
import PreLoader from "../../../../UI/PreLoader";
import DocCardTechnicalEvalution from "./DocCardTechnicalEvalution";

const DocListTechnicalEvalution = forwardRef((props, ref) => {

    const { server1: baseUrl } = useBaseUrl();
    const [docList, setDocList] = useState([]);
    const [toastSuccess, toastError, setBidManagementMainId, bidManageMainId ] = useOutletContext();
    const [loading, setPreLoader] = useState(false)

    useImperativeHandle(ref , () => ({
        getDocList
    }))

    const getDocList = () => {
        setPreLoader(true)
        let data ={
            mainid : props.BidCreationId,
        }
      
        axios.post(`${baseUrl}/api/bidcreation/prebidqueries/docupload/list`, data).then((resp) => {
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
            axios.delete(`${baseUrl}/api/bidcreation/prebidqueries/docupload/${id}`).then((resp) =>{
              if (resp.data.status === 200) {
                getDocList()
                toastSuccess(resp.data.message)
              }else if(resp.data.status === 404) {
                toastError(resp.data.message)
              }else{
                toastError("Something went wrong!")
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
            <div className="d-sm-flex align-items-center justify-content-between mt-2 mb-2">
                <h1 className="h4 mb-0 text-primary">List of Uploaded documents</h1>
            </div>
            <PreLoader loading={loading}>
                {docList.length > 0  && <div className={`overflow-auto col-lg-12 ${styles.doclist}`}>
                    {docList.map((item, index) => {
                        return(
                            <DocCardTechnicalEvalution key = {index} item = {item} index={index} onDelete={deleteHandler} onEdit={props.onEdit}/>
                        )
                    })}
                </div>}
                {docList.length <= 0 && 
                <div className={'mt-3'}>
                    <h5>No documents found. </h5>
                </div>
                }
            </PreLoader>
        </Fragment>
    )
})

export default DocListTechnicalEvalution;