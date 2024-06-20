import { Fragment, useEffect, useState } from "react";
// import { ImageConfig } from "../../Config";
import { ImageConfig } from "../../../../hooks/Config";

const Docsupload = (props) => {
  const [preview, setPreview] = useState("");
  const [doc, setDoc] = useState("");
  let filesize = 0;
// console.log("props",props);
  if (props.file.hasOwnProperty("data")) {
    setDoc(props.file.data);
    filesize=props.file.data.size;
  } else {
    setDoc(props.file);
    filesize=props.file.size;
  }

    useEffect(() => {
      // console.log("UseEffect");
    if (
      !props.file ||
      (props.file.type.split("/")[0] !== "image" &&
        props.file.type.split("/")[0] !== "application")
    ) {
      setPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(doc);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, []);

  let documentName =props.file?.name !== undefined ? props.file.name : props.fileName;
  
  const downloadDoc = () => {
    const url = window.URL.createObjectURL(doc);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", documentName);
    document.body.appendChild(link);
    link.click();
  };

  const onDelete = () => {
    props.setFile("");
  };

  const showPreview = (e) => {
    e.preventDefault();
    if (props.file !== "" && props.file.data.type.split("/")[0] === "image") {
      return window.open(preview), "_blank";
    }
  };

  return (
    <Fragment>
      {props.file && (
        <div className="card border-left-info shadow py-2 w-100 my-4">
          <div className="card-body">
            <div className="row no-gutters align-items-center">
              <div className="col-md-9">
                <div className="font-weight-bold text-info text-uppercase mb-1">
                  {props.docName}
                </div>
                <div className="row no-gutters align-items-center ">
                  <div className="col-auto">
                    <div className="h6 mb-0 mr-4 font-weight-bold text-gray-800 ">
                      <p className="text-truncate" title={documentName}>
                        {documentName}
                      </p>
                      <p>
                        <span>({filesize / 1000} KB)</span>
                        <span
                          className="btn btn-outline-warning btn-small  py-0 px-1 ml-3 mr-1"
                          onClick={downloadDoc}
                        >
                          <i className="fa fa-download"></i>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {preview && (
                <div className="col-md-3 d-flex align-items-center justify-content-center ml-n2">
                  <img
                    className="rounded-circle pointer"
                    id="previewImg"
                    // src={(props.file==="" || props.file.data.type.split("/")[0] !== "application") ? preview : ImageConfig["pdf"]}
                    src={
                      props.file !== "" &&
                      doc.type.split("/")[0] === "image"
                        ? preview
                        : doc.type.split("/")[0] === "application"
                        ? ImageConfig[doc.type.split("/")[1]]
                        : doc.type.split("/")[0] === "text"
                        ? ImageConfig[doc.type.split("/")[1]]
                        : doc.type === "" &&
                          doc.split(".")[doc.split(".").length - 1] === "rar"
                        ? ImageConfig["x-rar-compressed"]
                        : ImageConfig["default"]
                    }
                    alt="No Image"
                    width="75px"
                    height="75px"
                    onClick={(e) => showPreview(e)}
                    title="Click for Preview"
                  />
                  <div
                    className="pointer fa fa-close text-danger h5 closebtn mt-3 ml-1"
                    onClick={onDelete}
                  ></div>
                </div>
              )}
              {/* {!preview && (
                <div className="col-md-2 d-flex align-items-center justify-content-center ml-n3">
                  <img
                    src={
                      ImageConfig[props.file.data.type.split("/")[1]] ||
                      ImageConfig["default"]
                    }
                    alt=""
                    width="75px"
                    height="75px"
                    onClick={() => window.open(preview, "_blank")}
                    title="Click for Preview13"
                  />

                  <div
                    className="pointer fa fa-close text-danger h5 closebtn mt-3 ml-1"
                    onClick={onDelete}
                  ></div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Docsupload;
