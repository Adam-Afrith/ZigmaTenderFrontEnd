import { Fragment, useEffect, useState } from "react"
import { ImageConfig } from "../../Config"
const ReadyToUpload = (props) => {

    const[preview, setPreview] = useState(undefined)
    const[isNotAnImage,setIsNotAnImage]= useState(false);

    useEffect(() => {

        // if (!props.file || props.file.type.split('/')[0] !== "image") {
        //     setPreview(undefined)
        //     return
        // }
        if (!props.file) {
            setPreview(undefined)
            return
        }
        
        if (!props.file || props.file.type.split('/')[0] !== "image") {
            setIsNotAnImage(true);
        }
        
        const objectUrl = URL.createObjectURL(props.file);
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [props.file])

    const downloadDoc = () => {
        const url = window.URL.createObjectURL(props.file);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${props.file.name}`);
        document.body.appendChild(link);
        link.click();
    }

    return (
        <Fragment>

            {/* <div className="card border-left-warning shadow py-2 w-100 my-4">
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className="font-weight-bold text-info text-uppercase mb-1"> Document Name
                            </div>
                            <div className="row no-gutters align-items-center">
                                <div className="col-auto">
                                    <div className="h6 mb-0 mr-3 font-weight-bold text-gray-800"> No File Uploaded </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <i className="fas fa-exclamation-circle fa-2x text-warning" />
                        </div>
                    </div>
                </div>
            </div> */}

            {props.file && <div className="card border-left-info shadow py-2 w-100 ">
            <div className="position-absolute fixed-top mr-2 mt-1 ">
            <button type="button" className="close text-danger" aria-label="Close" onClick={props.clearFile}>
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col-md-10">
                            <div className="row no-gutters align-items-center ">
                                <div className="col-auto">
                                    <div className="h6 mb-0 mr-3 font-weight-bold text-gray-800 ">
                                        <p className="text-truncate" title={props.file.name}>
                                         <span className='text-secondary'>{props.file.name && "File :"} </span> {props.file.name}
                                        </p>
                                        <p><span className='text-secondary'>Size : </span><span>({props.file.size/1000} KB)</span>
                                      
                                         {(!props.file.lastModified) && 
                                            <span className="btn btn-outline-warning btn-small ml-3 py-0 px-1"  onClick={downloadDoc}><i className="fa fa-download"></i></span> 
                                         }   
                                        </p>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2 d-flex align-items-center justify-content-center">
                             <img className="rounded-circle pointer" id="previewImg" src={!isNotAnImage ?  preview : (ImageConfig[props.file.type.split('/')[1]] || ImageConfig['default'])} alt="No Image" width="75px" height="75px"   onClick={()=> window.open(preview, "_blank")} title="Click for Preview"/>
                        </div>
                    </div>
                </div>
            </div>}
        </Fragment>

    )

}

export default ReadyToUpload 