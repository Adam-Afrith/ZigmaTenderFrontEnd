import { Fragment, useEffect, useState } from "react";
import { ImageConfig } from "../../Config";

const WorkOrderUploadFile = (props) => {
  const [preview, setPreview] = useState(undefined);
  let fileName = "";

  useEffect(() => {

    if (!props.file) {
      setPreview(undefined);
      return;
    }
    fileName = props.file.name ? props.file.name : props.fileName;

    const objectUrl = URL.createObjectURL(props.file);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [props.file]);


  const downloadDoc = () => {
    const url = window.URL.createObjectURL(props.file);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${props?.fileName ? props?.fileName : props?.file?.name}`);
    document.body.appendChild(link);
    link.click();
  };


  return (
    <Fragment>
      {props.file && (
        <div className="card border-left-info shadow py-2 w-100 my-4">
          <div className="card-body">
            <div className="row no-gutters align-items-center">
              <div className="col-md-10">
                <div className="font-weight-bold text-info text-uppercase mb-1">
                  {props.docName}
                </div>
                <div className="row no-gutters align-items-center">
                  <div className="col-auto">
                    <div className="h6 mb-0 mr-3 font-weight-bold text-gray-800">
                      <p className="text-truncate" title={props.file.name}>
                        {props.fileName ? props.fileName : props.file.name}
                      </p>
                      <p>({props.file.size / 1000} KB)
                      <span
                          className="btn btn-outline-warning btn-small ml-3 py-0 px-1"
                          onClick={downloadDoc}
                        >
                          <i className="fa fa-download"></i>
                        </span></p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-2 d-flex align-items-center justify-content-center">
                {preview && (
                  <img
                    className="rounded-circle pointer"
                    id="previewImg"
                    src={
                      (preview && props.file?.type?.split("/")[0]==='image')
                        ? preview
                        : props.file?.name?.split(".")[
                            props.file?.name?.split(".").length - 1
                          ] === "csv" &&
                          props.file?.type?.split("/")[1] === "octet-stream"
                        ? ImageConfig["csv"]
                        : props.file?.name?.split(".")[
                            props.file?.name?.split(".").length - 1
                          ] === "rar" &&
                          (props.file?.type?.split("/")[1] === "octet-stream" ||
                            props.file?.type === "")
                        ? ImageConfig["rar"]
                        : props.file?.type?.split("/")[1]
                        ? ImageConfig[props.file?.type?.split("/")[1]]
                        : ImageConfig["default"]
                    }
                    alt="No Image"
                    width="75px"
                    height="75px"
                    onClick={() => (preview && props.file.type.split("/")[0]==='image') && window.open(preview, "_blank")}
                    title="Click for Preview"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default WorkOrderUploadFile;
