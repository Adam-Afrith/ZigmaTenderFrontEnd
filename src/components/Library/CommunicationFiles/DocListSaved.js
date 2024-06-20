import { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from "react";

import axios from "axios";
import styles from './UploadDoc.module.css';
import Swal from "sweetalert2";
import { useOutletContext } from "react-router-dom";

import DocCardCP from "./DocCardCP";
import DocCardSaved from "./DocCardSaved";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import PreLoader from "../../UI/PreLoader";

const DocListSaved = (props) => {

    const { server1: baseUrl } = useBaseUrl();
;
    // const [loading, setPreLoader] = useState(false)

    

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
            axios.delete(`${baseUrl}/api/communicationfilesmaster/deletedoc/${id}`).then((resp) =>{
              if (resp.data.status === 200) {
                   props.fetchDocs();
                // getDocList()
                props.toastSuccess(resp.data.message)
              }else if(resp.data.status === 404) {
                props.toastError(resp.data.message)
              }else{
                props.toastError("Something went wrong!")
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


    return (
        <Fragment>
          <div className="DocListSaved">
            <div className="d-sm-flex align-items-center justify-content-between mt-2 mb-2">
                <h1 className="h4 mb-0 text-primary">Saved documents</h1>
            </div>
            <PreLoader loading={props.loading}>
                {props.docList.length > 0  && <div className={`overflow-auto col-lg-12 ${styles.doclist}`}>
                    {props.docList.map((item, index) => {
                        return(
                            <DocCardSaved key = {index} item = {item} index={index} onDelete={deleteHandler} onEdit={props.onEdit}/>
                        )
                    })}
                </div>}
                {props.docList.length <= 0 && 
                <div className={'mt-3'}>
                    <h5>No documents found. </h5>
                </div>
                }
            </PreLoader>
          </div>
        </Fragment>
    )
}

export default DocListSaved;