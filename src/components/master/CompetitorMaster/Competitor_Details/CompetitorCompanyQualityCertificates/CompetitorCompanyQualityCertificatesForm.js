import { usePageTitle } from "../../../../hooks/usePageTitle";
import { useAllowedUploadFileSize } from "../../../../hooks/useAllowedUploadFileSize";
import { useAllowedMIMEDocType } from "../../../../hooks/useAllowedMIMEDocType";
import { useState, useEffect, useRef} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import Swal from "sweetalert2";
import CompetitorCompanyQualityCertificatesList from "./CompetitorCompanyQualityCertificatesList";
import { useImageStoragePath } from "../../../../hooks/useImageStoragePath";
import "./UploadDoc.css";
import Docsupload from "./Docsupload";
import { ImageConfig } from "../../../../hooks/Config";
import PreLoader from "../../../../UI/PreLoader";

const CompetitorCompanyQualityCertificatesForm = (props) => {
  const { compid } = useParams();

  usePageTitle("Competitor Creation");
  const initialValue = {
    qcId: null,
    compNo: null,
    cerName: "",
    remark: "",
    fileName: "",
  };

  
  const [competitorQCInput, setCompetitorQCInput] = useState(initialValue);
  const [formIsValid, setFormIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qCList, setQCList] = useState([]);
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [previewObjURL, setPreviewObjURL] = useState("");
  const [progress, setProgressCompleted] = useState(0);
  const [dragover, setdragover] = useState(false);
  const wrapperRef = useRef(null);
  const [file, setFile] = useState("");
  const [previewForEdit, setPreviewForEdit] = useState("");
  let tokenId = localStorage.getItem("token");
  const { server1: baseUrl } = useBaseUrl();
  const { img: maxImageSize } = useAllowedUploadFileSize();
  const { MIMEtype: doctype } = useAllowedMIMEDocType();
  const { qcFile: filePath } = useImageStoragePath();
  const [fileName, setFileName] = useState("");
  const [FetchLoading, setFetchLoading] = useState(true);
  
  useEffect(() => {
    if (compid) {
      // getCompNo();
      getQCList();
    }
  }, []);

  useEffect(() => {
    if (props.compNo) {
      setCompetitorQCInput({
        ...competitorQCInput,
        compNo: props.compNo,
      });
    }
  }, [props.compNo]);
  
  const onDragEnter = () => {
    wrapperRef.current.classList.add("dragover");
    setdragover(true);
  };

  const onDragLeave = () => {
    wrapperRef.current.classList.remove("dragover");
    setdragover(false);
  };

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    e.preventDefault();
    const newFile = e.target.files[0];

    if (newFile && newFile.size > maxImageSize) {
      Swal.fire({
        title: "File Size",
        text: "File size too Large...!",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        // setFile(null);
      });
    } else if (newFile && !doctype.includes(newFile.type)) {
      let len = newFile.name.split(".").length;
      if (newFile.type === "" && newFile.name.split(".")[len - 1] === "rar") {
        setFile(newFile);
        setFileName("");
      } else {
        Swal.fire({
          title: "File Type",
          text: "Invalid File type",
          icon: "error",
          confirmButtonColor: "#2fba5f",
        })
      }
    } else {
      if(e.target.files[0].type==="text/plain")
      {
        Swal.fire({
          title: "File Type",
          text: "Invalid File type",
          icon: "error",
          confirmButtonColor: "#2fba5f",
        })
      }
      else{
      setFile(newFile);
      }
    }
  };

  var config = {
    onUploadProgress: function (progressEvent) {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setProgressCompleted(percentCompleted);
    },
  };

  // const getCompNo = async () => {
  //   await axios
  //     .get(`${baseUrl}/api/competitorprofile/getcompno/${compid}`)
  //     .then((resp) => {
  //       if (resp.data.status === 200) {
  //         setCompetitorQCInput({
  //           ...competitorQCInput,
  //           compNo: resp.data.compNo,
  //         });
  //       }
  //     });
  // };

  //check Form is Valid or not
  useEffect(() => {
    if (
      competitorQCInput.cerName !== "" &&
      (file !== "") | (previewForEdit !== "")
    ) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [competitorQCInput, file, previewForEdit]);

  const getQCList = () => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    axios
      .post(`${baseUrl}/api/competitordetails/qclist/${compid}`,data)
      .then((resp) => {
        let list = [...resp.data.qc];
        let listarr = list.map((item, index) => ({
          ...item,
          filepath:
            item.filepath !== "" &&
            (item.filepath.split(".")[1] === "jpg" ||
              item.filepath.split(".")[1] === "png" ||
              item.filepath.split(".")[1] === "jpeg" ||
              item.filepath.split(".")[1] === "webp")
              ? `<img src="${filePath}` +
                item.filepath +
                `" class="rounded-circle pointer" width="40" height="40" style="cursor:pointer" />`
              : `<img src="${
                  item.filepath.split(".")[1] === "rar" ||
                  item.filepath.split(".")[1] === "vnd.rar" ||
                  item.filepath.split(".")[1] === "x-rar-compressed" ||
                  item.filepath.split(".")[1] === "x-rar"
                    ? ImageConfig["x-rar"]
                    : item.filepath.split(".")[1] === "pdf"
                    ? ImageConfig["pdf"]
                    : item.filepath.split(".")[1] === "doc" ||
                      item.filepath.split(".")[1] === "docx" ||
                      item.filepath.split(".")[1] === "msword" ||
                      item.filepath.split(".")[1] ===
                        "vnd.openxmlformats-officedocument.wordprocessingml.document"
                    ? ImageConfig["doc"]
                    : item.filepath.split(".")[1] === "zip" ||
                      item.filepath.split(".")[1] === "multipart/x-zip" ||
                      item.filepath.split(".")[1] === "x-zip" ||
                      item.filepath.split(".")[1] === "x-zip-compressed"
                    ? ImageConfig["zip"]
                    : item.filepath.split(".")[1] === "xls" ||
                      item.filepath.split(".")[1] === "xlsx" ||
                      item.filepath.split(".")[1] === "vnd.ms-excel" ||
                      item.filepath.split(".")[1] ===
                        "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    ? ImageConfig["vnd.ms-excel"]
                    : item.filepath.split(".")[1] === "csv"
                    ? ImageConfig["csv"]
                    : ImageConfig["default"]
                }" class="rounded-circle pointer" width="40" height="40" alt="" style="cursor:pointer"></img>`,

          buttons: `<i class="fa fa-edit text-primary mx-2 h6" style="cursor:pointer" title="Edit"></i> <i class="fa fa-trash text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>`,
          sl_no: index + 1,
        }));
        setQCList(listarr);
      }).then(()=>{
        setFetchLoading(false);
      });
  };

  const onEdit = (data) => {
    setFormIsValid(true);
    setCompetitorQCInput({
      qcId: data.id,
      compNo: data.compNo,
      cerName: data.cerName ? data.cerName : "",
      remark: data.remark ? data.remark : "",
    });

    if (data.filepath) {
      let token = {
        tokenid : localStorage.getItem('token')
      }

      axios
        .get(`${baseUrl}/api/competitorqcertificate/${data.id}`)
        .then((resp) => {
          if (resp.status === 200) {
            if (resp.data.qc[0].filepath) {
              setFileName(resp.data.qc[0].filepath);
              axios({
                url: `${baseUrl}/api/download/competitorqcertificate/${data.id}`,token,
                method: "POST",
                responseType: "blob", // important
                headers: {
                  //to stop cacheing this response at browsers. otherwise wrongly displayed cached files
                  "Cache-Control": "no-cache",
                  Pragma: "no-cache",
                  Expires: "0",
                  Accept: doctype,
                },
              }).then((response) => {
                if (response.status === 200) {
                  setFile(response);
                } else if (response.status === 204) {
                  setFile("");
                  setFileName("");
                } else {
                  alert("Unable to Process Now!");
                }
              });
            }
          }
        });
    }
  };
  const onPreview = (data) => {
    if (file !== "" && file.data.type.split("/")[0] === "image") {
      return window.open(data.filepath), "_blank";
    }
  };

  const onDelete = (data) => {
    Swal.fire({
      text: `Are You sure, to delete ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#2fba5f",
      cancelButtonColor: "#fc5157",
    }).then((willDelete) => {
      if (willDelete.isConfirmed) {
        axios
          .delete(`${baseUrl}/api/competitorqcertificate/${data.id}`)
          .then((resp) => {
            if (resp.data.status === 200) {
              Swal.fire({
                //success msg
                icon: "success",
                title: "Quality Certificate",
                text: `removed!`,
                timer: 2000,
                showConfirmButton: false,
              });
              getQCList();
            } else if (resp.data.status === 404) {
              Swal.fire({
                // error msg
                icon: "error",
                text: resp.data.message,
                showConfirmButton: true,
              });
            } else {
              Swal.fire({
                icon: "error",
                text: "Something went wrong!",
                timer: 2000,
              });
            }
          });
      } else {
        Swal.fire({
          title: "Cancelled",
          icon: "error",
          timer: 1500,
        });
      }
    });
  };

  const textInputHandler = (e) => {
    setCompetitorQCInput({
      ...competitorQCInput,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setIsBtnClicked(true);

    let tokenId = localStorage.getItem("token");
    const datatosend = {
      compId: compid,
      compNo: competitorQCInput.compNo,
      remark: competitorQCInput.remark,
      cerName: competitorQCInput.cerName,
      file: file,
      tokenId: tokenId,
    };

    const formdata = new FormData();

    for (var key in datatosend) {
      formdata.append(key, datatosend[key]);
    }
    if (
      datatosend.compId !== null &&
      datatosend.compNo !== null &&
      (datatosend.cerName !== null || datatosend.remark !== null)
    ) {
      axios
        .post(`${baseUrl}/api/competitorqcertificate`, formdata, config)
        .then((resp) => {
          if (resp.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Competitor Quality Certificate",
              text: resp.data.message,
              timer: 2000,
            }).then(function () {
              setLoading(false);
              setIsBtnClicked(false);
              setCompetitorQCInput({
                ...competitorQCInput,
                remark: "",
                cerName: "",
              });
              getQCList();
              setFile("");
              setPreviewObjURL("");
            });
          } else if (resp.data.status === 404) {
            Swal.fire({
              icon: "error",
              title: "Competitor Quality Certificate",
              text: resp.data.message,
              confirmButtonColor: "#5156ed",
            }).then(function () {
              setLoading(false);
              setIsBtnClicked(false);
            });
          }
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Competitor Quality Certificate",
        text: "You are tring to submit empty values",
        confirmButtonColor: "#5156ed",
      }).then(function () {
        setLoading(false);
        setIsBtnClicked(false);
      });
    }
  };

  const updateHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setIsBtnClicked(true);
    let tokenId = localStorage.getItem("token");

    if (
      compid !== null &&
      competitorQCInput.compNo !== null &&
      competitorQCInput.cerName !== null &&
      competitorQCInput.qcId
    ) {
      //When Image is not changed on update
      if (previewForEdit !== "" && file === "") {
        const datatosend = {
          compId: compid,
          compNo: competitorQCInput.compNo,
          remark: competitorQCInput.remark,
          cerName: competitorQCInput.cerName,
          tokenId: tokenId,
        };

        axios
          .patch(
            `${baseUrl}/api/competitorqcertificate/${competitorQCInput.qcId}`,
            datatosend
          )
          .then((resp) => {
            if (resp.data.status === 200) {
              Swal.fire({
                icon: "success",
                title: "Competitor Quality Certificate",
                text: resp.data.message,
                timer: 2000,
              }).then(function () {
                setCompetitorQCInput({
                  ...competitorQCInput,
                  qcId: null,
                  remark: "",
                  cerName: "",
                  fileName: "",
                });
                getQCList();
                setIsBtnClicked(false);
                setLoading(false);
                setFile("");
                setPreviewObjURL("");
                setPreviewForEdit("");
              });
            } else if (resp.data.status === 404) {
              Swal.fire({
                icon: "error",
                title: "Competitor Qualiy Certificate",
                text: resp.data.errors,
                confirmButtonColor: "#5156ed",
              }).then(function () {
                setLoading(false);
                setIsBtnClicked(false);
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Competitor Qualiy Certificate",
                text: "Something went wrong!",
                confirmButtonColor: "#5156ed",
              }).then(function () {
                setLoading(false);
                setIsBtnClicked(false);
              });
            }
          });
      }
      //When Image is changed/reuploaded on update
      else if (previewForEdit === "" && file !== "") {
        const datatosend = {
          //qcId:competitorQCInput.qcId,
          compId: compid,
          compNo: competitorQCInput.compNo,
          remark: competitorQCInput.remark,
          cerName: competitorQCInput.cerName,
          file: file,
          tokenId: tokenId,
          _method: "PUT",
        };

        const formdata = new FormData();

        for (var key in datatosend) {
          formdata.append(key, datatosend[key]);
        }

        axios
          .post(
            `${baseUrl}/api/competitorqcertificate/${competitorQCInput.qcId}`,
            formdata,
            config
          )
          .then((resp) => {
            if (resp.data.status === 200) {
              Swal.fire({
                icon: "success",
                title: "Competitor Quality Certificate",
                text: resp.data.message,
                timer: 2000,
              }).then(function () {
                setCompetitorQCInput({
                  ...competitorQCInput,
                  qcId: null,
                  remark: "",
                  cerName: "",
                  fileName: "",
                });
                getQCList();
                setIsBtnClicked(false);
                setLoading(false);
                setFile("");
                setPreviewObjURL("");
                setPreviewForEdit("");
              });
            } else if (resp.data.status === 404) {
              Swal.fire({
                icon: "error",
                title: "Competitor Qualiy Certificate",
                text: resp.data.errors,
                confirmButtonColor: "#5156ed",
              }).then(function () {
                setLoading(false);
                setIsBtnClicked(false);
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Competitor Qualiy Certificate",
                text: "Something went wrong!",
                confirmButtonColor: "#5156ed",
              }).then(function () {
                setLoading(false);
                setIsBtnClicked(false);
              });
            }
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "Competitor Qualiy Certificate",
          text: "Upload Documnet!",
          confirmButtonColor: "#5156ed",
        }).then(function () {
          setLoading(false);
          setIsBtnClicked(false);
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Competitor Qualiy Certificate",
        text: "Something went wrong!",
        confirmButtonColor: "#5156ed",
      }).then(function () {
        setLoading(false);
        setIsBtnClicked(false);
      });
    }
  };
 

  return (
    <PreLoader loading={FetchLoading}>
    <div className="">
      <form>
        <div className="row align-items-center">
          <div className="inputgroup col-lg-6 mb-4 ">
            <div className="row align-items-center">
              <div className="col-lg-5 text-dark font-weight-bold pt-1">
                <label htmlFor="cerName"> Certificate Name</label>
              </div>
              <div className="col-lg-7">
                <input
                  type="text"
                  className="form-control"
                  id="cerName"
                  placeholder="Enter Certificate Name"
                  name="cerName"
                  value={competitorQCInput.cerName}
                  onChange={textInputHandler}
                />

                {/* {hasError.remark && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-bold">
                      Enter Valid Amount..!
                    </span>
                  </div>
                )} */}
              </div>
            </div>
          </div>

          <div className="inputgroup col-lg-6 mb-4 ">
            <div className="row align-items-center">
              <div className="col-lg-5 text-dark font-weight-bold pt-1">
                <label htmlFor="remark">Remarks</label>
              </div>
              <div className="col-lg-7">
                <input
                  type="text"
                  className="form-control"
                  id="remark"
                  placeholder="Enter Remarks"
                  name="remark"
                  value={competitorQCInput.remark}
                  onChange={textInputHandler}
                />

                {/* {hasError.remark && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-bold">
                      Enter Valid Amount..!
                    </span>
                  </div>
                )} */}
              </div>
            </div>
          </div>

          <div className="inputgroup col-lg-6 mb-4 ">
            <div className="row align-items-center">
              <div className="col-lg-5 text-dark font-weight-bold pt-1">
                <label htmlFor="cerName"> File Upload</label>
              </div>
              <div className="col-lg-7">
                <div
                  className="dashed border-primary height_of_dropbox boderradius__dropbox d-flex flex-column align-items-center justify-content-center  drop-file-input bg-gray-200"
                  ref={wrapperRef}
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  <p className="display-4 mb-0">
                    <i className="fas fa-cloud-upload-alt text-primary "></i>
                  </p>
                  {!dragover && (
                    <p className="mt-0">Drag & Drop an document or Click</p>
                  )}
                  {dragover && <p className="mt-0">Drop the document</p>}
                  <input
                    type="file"
                    value=""
                    className="h-100 w-100 position-absolute top-50 start-50 pointer "
                    onChange={onFileDrop}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="inputgroup col-lg-6 mb-4 ">
            <div className="row align-items-center">
              <div className="col-lg-5 text-dark font-weight-bold pt-1">
                <label htmlFor="remark">Preview</label>
              </div>
              <div className="col-lg-7">
                {file && (
                  <Docsupload
                    file={file}
                    setFile={setFile}
                    fileName={fileName}
                    setFileName={setFileName}
                  />
                )}
              </div>
            </div>
          </div>
          
          <div className="inputgroup col-lg-12 mb-4 align-items-center">
            <div className="row">
              <div className="col-lg-12 text-center">
                <button
                  className="btn btn-primary"
                  disabled={!formIsValid || isBtnClicked === true}
                  onClick={
                    !competitorQCInput.qcId ? submitHandler : updateHandler
                  }
                >
                  {!competitorQCInput.qcId
                    ? loading === true
                      ?  <span className="spinner-border spinner-border-sm mr-2"></span>+ progress + '% Uploaded'
                      : "Add"
                    : loading === true
                    ? progress + '% Updating'
                    : "Update"}
                </button>
              </div>
            </div>
          </div>          
        </div>
      </form>
      <CompetitorCompanyQualityCertificatesList
        qCSubList={qCList}
        onEdit={onEdit}
        onDelete={onDelete}
        onPreview={onPreview}

      />
    </div>
    </PreLoader>
  );
};
export default CompetitorCompanyQualityCertificatesForm;
