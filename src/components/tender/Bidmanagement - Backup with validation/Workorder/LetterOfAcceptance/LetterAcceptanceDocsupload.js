import { Fragment, useEffect, useState } from "react";
import { ImageConfig } from "../../Config";

const WorkOrderUploadFile = (props) => {
  const [preview, setPreview] = useState(undefined);


  useEffect(() => {
    if (!props.file || (props.file.type.split("/")[0] !== "image" && props.file.type.split("/")[0] !== "application")){
      setPreview(undefined);
      return;
    }
      const objectUrl = URL.createObjectURL(props.file);
      setPreview(objectUrl);
  
      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl);
    
  }, [props.file]);

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
                <div className="row no-gutters align-items-center ">
                  <div className="col-auto">
                    <div className="h6 mb-0 mr-3 font-weight-bold text-gray-800 ">
                     
                      <p className="text-truncate" title={props.file.name}>
                          {props.file.name}
                        </p>
                      <p>({props.file.size / 1000} KB)</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-2 d-flex align-items-center justify-content-center">
                {preview && (
                  <img
                    className="rounded-circle pointer"
                    id="previewImg"
                    src={(props.file==="" || props.file.type.split("/")[0] !== "application") ? preview : ImageConfig["pdf"]}
                    alt="No Image"
                    width="75px"
                    height="75px"
                    onClick={() => window.open(preview, "_blank")}
                    title="Click for Preview"
                  />
                )}
                {!preview && (
                  <img
                    src={
                      ImageConfig[props.file.type.split("/")[1]] ||
                      ImageConfig["default"]
                    }
                    alt=""
                    width="75px"
                    height="75px"
                    onClick={() => window.open(preview, "_blank")}
                  />
                )}
                {/* <i className="fas fa-clipboard-list fa-2x " /> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default WorkOrderUploadFile;
