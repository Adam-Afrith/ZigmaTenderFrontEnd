import { Fragment, useEffect, useState } from "react"

const ReadyToUpload = (props) => {

    const[preview, setPreview] = useState(undefined)

    useEffect(() => {

        if (!props.file || props.file.type.split('/')[0] !== "image") {
            setPreview(undefined)
            return
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
                                            <span className='text-secondary'>File : </span> {props.file.name}
                                        </p>
                                        <p><span className='text-secondary'>Size : </span><span>({props.file.size/1000} KB)</span>
                                        {/* <div className="btn btn-outline-warning btn-circle btn-small mx-2"  ><i className="fa fa-download"></i></div> */}
                        {/* <div className="btn btn-outline-warning btn-circle btn-small mx-2"><Link className="fa fa-download" to={`${baseUrl}/storage/BidDocs/${props.item.file_new_name}`} target="_blank" download>
                        </Link></div> */}
                        {/* <div className="btn btn-outline-success btn-circle btn-small mx-2" > <i className="far fa-edit" ></i> </div> */}
                        {/* <div className="btn btn-outline-danger btn-circle btn-small mx-2" > <i className="fas fa-trash-alt" ></i> </div> */}
                                         {(!props.file.lastModified) && 
                                            <span className="btn btn-outline-warning btn-small ml-3 py-0 px-1"  onClick={downloadDoc}><i className="fa fa-download"></i></span> 
                                         }   
                                        </p>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2 d-flex align-items-center justify-content-center">
                            {preview &&  <img className="rounded-circle pointer" id="previewImg" src={preview} alt="No Image" width="75px" height="75px"   onClick={()=> window.open(preview, "_blank")} title="Click for Preview"/>}

                            {/* {!preview && <img src={ImageConfig[props.file.name.split('.').pop()] ||ImageConfig[props.file.type.split('/')[1]] ||  ImageConfig['default']} alt="" width="75px" height="75px"/>} */}
                            {/* <i className="fas fa-clipboard-list fa-2x " /> */}
                        </div>
                    </div>
                </div>
            </div>}
        </Fragment>

    )

}

export default ReadyToUpload 