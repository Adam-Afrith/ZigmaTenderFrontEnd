import axios from "axios";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";

import { useImageStoragePath } from "../../hooks/useImageStoragePath";

import { ImageConfig } from "../../tender/Bidmanagement/Config";

import styles from './UploadDoc.module.css';


const DocCardCP = (props) => {

    const { server1: baseUrl } = useBaseUrl();
    const { CorrigendumPublishdocs: biddocs_filePath } = useImageStoragePath();
    const downloadDoc = (filename, docname, ext) => {
  
        let data = {
            tokenid : localStorage.getItem('token')
          }
            axios({
                url: `${baseUrl}/api/download/corrigendumpublishdocs/${filename}`,data,
                method: 'POST',
                responseType: 'blob', // important
              }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${docname}`);
                document.body.appendChild(link);
                link.click();
              });
    }

    const FormattedDate = (date) => {
        if(date){

            const targetdate = new Date(date);
            const yyyy = targetdate.getFullYear();
            let mm = targetdate.getMonth() + 1; // Months start at 0!
            let dd = targetdate.getDate();
        
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
        
            const formattedDate = dd + '-' + mm + '-' + yyyy;
            return formattedDate
        }

      }

    //   console.log(props.item)

    return (

        <Fragment>
            <div className={`card mb-1 py-1 border-left-info overflow-hidden ${styles.docrow}`}>
                <div className="row card-body p-1 align-items-center">
                    <div className="col-lg-1 d-flex justify-content-center">
                        <div className="btn-info btn-circle btn-small"> {+props.index + 1} </div>
                    </div>
                    <div className="row col-lg-10 bg-gray-200 rounded py-1">
                        <div className="col-3 col-lg-1">
                            <div className="img-block">
                            {props.item.type.split('/')[0] !== "image" && <img src={ImageConfig[props.item?.file_original_name?.split('.').pop()] || ImageConfig[props.item.type.split('/')[1]] || ImageConfig['default']} alt="" width="75px" height="75px" />}

                            {props.item.type.split('/')[0] === "image" && <img src={URL.createObjectURL(props.item)} alt="" width="75px" height="75px" />}

                         

                            {/* <img src={ImageConfig[props.item.file_type.split('/')[1]] || ImageConfig['default']} alt="" width="75px" height="75px" /> */}
                            </div>
                        </div>
                        <div className="col-8 pl-5 col-lg-11">

                            <div className="font-weight-bold text-info text-uppercase mb-1">
                            
                            </div>

                            <div className="row no-gutters align-items-center ">
                                <div className="col-auto">
                                    <div className="h6 mb-0 mr-3 font-weight-bold text-gray-800 ">
                                        <p className="text-truncate">
                                        <span className='text-secondary'>File Name : </span> {props.item.name} 
                                        </p>
                                        {/* <p> <span className='text-secondary'>Date : </span>{FormattedDate(props.item.date)}</p> */}
                                        <p><span className='text-secondary'>Size : </span> ({props.item.size/(1000)} kB)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-1 d-flex justify-content-center">
                       <div className="col-12 d-flex justify-content-center align-items-center">
                        {/* <div className="btn btn-outline-warning btn-circle btn-small mx-2"  onClick={() => downloadDoc(props.item.id, props.item.file_original_name, props.item.ext)}><i className="fa fa-download"></i></div> */}
                        {/* <div className="btn btn-outline-warning btn-circle btn-small mx-2"><Link className="fa fa-download" to={`${baseUrl}/storage/BidDocs/${props.item.file_new_name}`} target="_blank" download>
                        </Link></div> */}
                        {/* <div className="btn btn-outline-success btn-circle btn-small mx-2" onClick={() => props.onEdit(props.item)}> <i className="far fa-edit" ></i> </div> */}
                        {/* <div className="btn btn-outline-danger btn-circle btn-small mx-2" onClick={() => props.onDelete(props.item.name, props.item.file_original_name)}> <i className="fas fa-trash-alt" ></i> </div> */}
                        <div className="btn btn-outline-danger btn-circle btn-small mx-2" onClick={() => props.onDelete(props.item.name)}> <i className="fas fa-trash-alt" ></i> </div>
                       </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default DocCardCP