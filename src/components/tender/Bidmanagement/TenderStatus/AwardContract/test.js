import { usePageTitle } from "../../../../hooks/usePageTitle";
import { useAllowedUploadFileSize } from "../../../../hooks/useAllowedUploadFileSize";
import { useAllowedMIMEDocType } from "../../../../hooks/useAllowedMIMEDocType";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import Swal from "sweetalert2";
import CompetitorCompanyQualityCertificatesList from "./CompetitorCompanyQualityCertificatesList";
import { useImageStoragePath } from "../../../../hooks/useImageStoragePath";
import "./UploadDoc.css";

const CompetitorCompanyQualityCertificatesForm = () => {
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
  const [isPdfFile, setIsPdfFile ] = useState(false);
  // const { pdf: maxPdfSize } = useAllowedUploadFileSize();
  // const navigate = useNavigate();

  useEffect(() => {
    getCompNo();
    getQCList();
  }, []);

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
    const newFile = e.target.files[0];
    if (newFile) {
      var splited = newFile.name.split(".");
      if(splited[1]==="pdf")
      {setIsPdfFile(true);}
      else{setIsPdfFile(false);}

      setFile(newFile);
      setPreviewObjURL(URL.createObjectURL(e.target.files[0]));
      if (previewForEdit) {
        setPreviewForEdit("");
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

  useEffect(() => {
    if (file && file.size > maxImageSize) {
      Swal.fire({
        title: "File Size",
        text: "Maximum Allowed File size is 1MB",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        setFile("");
        setPreviewObjURL("");
      });
    } else if (file && !doctype.includes(file.type)) {
      Swal.fire({
        title: "File Type",
        text: "Allowed File Type are JPG/JPEG/PNG/PDF ",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        setFile("");
        setPreviewObjURL("");
      });
    }
  }, [file]);
  const getCompNo = async () => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    await axios
      .post(`${baseUrl}/api/competitorprofile/getcompno/${compid}`,data)
      .then((resp) => {
        if (resp.data.status === 200) {
          setCompetitorQCInput({
            ...competitorQCInput,
            compNo: resp.data.compNo,
          });
        }
      });
  };

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
            item.filetype === "pdf"
              ? `<embed src="${filePath}` +
                item.filepath +
                `" class="rounded-circle pointer" width="0" height="0" style="cursor:pointer" title="Pdf"/><img src="assets/icons/pdf_logo.png" class="rounded-circle pointer" width="75" height="75" alt="PDF" id="qcImg" style="cursor:pointer" title="PDF"></img>`
              : `<img src="${filePath}` +
                item.filepath +
                `" class="rounded-circle pointer" width="75" height="75" alt="image" id="qcImg" style="cursor:pointer" title="Image"></img>`,

          buttons: `<i class="fa fa-edit text-primary mx-2 h6" style="cursor:pointer" title="Edit"></i> <i class="fa fa-trash text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>`,
          sl_no: index + 1,
        }));
        setQCList(listarr);
      });
  };

  const getImageUrl = (s) => {
    //console.log("filepath" + filePath);
    // let pat = "/" + filePath + "[a-zA-Z0-9]*.(?:png|jpeg|jpg|pdf)/";
    // let pattern = new RegExp(pat, "gi");
    //var pattern1 = /${filepath}[a-zA-Z0-9]*\.(?:png|jpeg|jpg|pdf)/;
    ///((?:https|http):\/\/.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}:8000\/[a-zA-z0-9\/]*\.(?:png|jpeg|jpg|pdf))/;
    // var url_splited = s.split('""');
    // console.log("url_splited", url_splited);
    var pattern = /[a-zA-Z0-9]*\.(?:png|jpeg|jpg|pdf)/;

    var result = s.match(pattern);
    var img_url = filePath + result; //filePath is a state value, which indicates server storage location
    // console.log("img Url  ", img_url);

    if (!(img_url === null || !img_url === undefined)) {
      setPreviewForEdit(img_url);
    } else {
      setPreviewForEdit("");
    }
  };

  const onEdit = (data) => {
    setFile("");
    var imgUrl = getImageUrl(data.filepath);

    setFormIsValid(true);
    setCompetitorQCInput({
      qcId: data.id,
      compNo: data.compNo,
      cerName: data.cerName,
      remark: data.remark,
    });
    var pattern = /[a-zA-z0-9]*\.(?:png|jpeg|jpg|pdf)/;
    var img_url = data.filepath.match(pattern);
    var splited = img_url[0].split(".");
    if(splited[1]==="pdf")
    {
      setIsPdfFile(true);
    }
    else{
      setIsPdfFile(false);
    }
  };

  const onPreview = (data) => {
    var pattern = /[a-zA-z0-9]*\.(?:png|jpeg|jpg|pdf)/;
    var img_url = data.filepath.match(pattern);
    if(img_url[0])
    {
    var splited = img_url[0].split(".");
    if(splited[1]==="pdf")
    {setIsPdfFile(true);}
    else{setIsPdfFile(false);}
    window.open(filePath + img_url, "_blank");
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
            console.log("competitorQCInput", competitorQCInput);
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
  const removeImgHandler = (e) => {
    setFile("");
    setPreviewObjURL("");
    setPreviewForEdit("");
  };

  return (
    <div className="card-body ">
      <form>
        <div className="row align-items-center">
          <div className="inputgroup col-lg-6 mb-4 ">
            <div className="row align-items-center">
              <div className="col-lg-3 text-dark font-weight-bold pt-1">
                <label htmlFor="cerName"> Certificate Name</label>
              </div>
              <div className="col-lg-8">
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
              <div className="col-lg-3 text-dark font-weight-bold pt-1">
                <label htmlFor="remark">Remarks</label>
              </div>
              <div className="col-lg-8">
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
              <div className="col-lg-3 text-dark font-weight-bold pt-1">
                <label htmlFor="cerName"> File Upload</label>
              </div>
              <div className="col-lg-8">
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
              <div className="col-lg-3 text-dark font-weight-bold pt-1">
                <label htmlFor="remark">Preview</label>
              </div>
              <div className="col-lg-8">
                {/* <img src={previewObjURL} /> */}
                {file && (
                  <div className="card border-left-info shadow py-2 w-100 my-4">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col-md-9">
                          <div className="font-weight-bold text-info text-uppercase mb-1">
                            {competitorQCInput.cerName}
                          </div>

                          <div className="row no-gutters align-items-center ">
                            <div className="col-auto">
                              <div className="h6 mb-0 mr-3 font-weight-bold text-gray-800 ">
                                <p className="text-truncate">{file.name}</p>
                                <p>({file.size / 1000} KB)</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 d-flex align-items-center justify-content-center">
                          {previewObjURL && (
                            <img
                              className="rounded-circle pointer"
                              id="previewImg"
                              // src={previewObjURL}
                              src={!isPdfFile ? previewObjURL : "assets/icons/pdf_logo.png"}
                              alt="No Image"
                              width="75px"
                              height="75px"
                              onClick={() =>
                                window.open(previewObjURL, "_blank")
                              }
                              title="Click for Preview"
                            />
                          )}
                          &nbsp;&nbsp;&nbsp;
                          {previewObjURL !== null && (
                            <span
                              className="fa fa-close text-danger h4 closebtn"
                              onClick={removeImgHandler}
                            >
                              &nbsp;
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* for edit */}

                {file === "" && previewForEdit !== "" && (
                  <div className="card border-left-info shadow py-2 w-100 my-4">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col-md-9">
                          <div className="font-weight-bold text-info text-uppercase mb-1">
                            {competitorQCInput.cerName}
                          </div>

                          {/* <div className="row no-gutters align-items-center ">
                                <div className="col-auto">
                                    <div className="h6 mb-0 mr-3 font-weight-bold text-gray-800 ">
                                        <p className="text-truncate">
                                            {file.name}
                                        </p>
                                        <p>({file.size/1000} KB)</p>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        <div className="col-md-3 d-flex align-items-center justify-content-center">
                          {previewForEdit !== "" && (
                            <img
                              className="rounded-circle pointer"
                              id="previewImg"
                              // src={previewForEdit}
                              src={!isPdfFile ? previewForEdit :"assets/icons/pdf_logo.png"}
                              alt="No Image"
                              width="75px"
                              height="75px"
                              onClick={() =>
                                window.open(previewForEdit, "_blank")
                              }
                              title="Click for Preview"
                            />
                          )}
                          &nbsp;&nbsp;&nbsp;
                          {previewForEdit !== "" && (
                            <span
                              className="fa fa-close text-danger h4 closebtn"
                              onClick={removeImgHandler}
                            >
                              &nbsp;
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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

          <div className="inputgroup col-lg-5 mb-4"></div>
          <div className="inputgroup col-lg-2 mb-4 align-items-center">
            <div className="row">
              <button
                className="btn btn-primary"
                disabled={!formIsValid || isBtnClicked === true}
                onClick={
                  !competitorQCInput.qcId ? submitHandler : updateHandler
                }
              >
                {!competitorQCInput.qcId
                  ? loading === true
                    ? "Adding...."
                    : "Add"
                  : loading === true
                  ? "Updating...."
                  : "Update"}
              </button>
            </div>
          </div>
          <div className="inputgroup col-lg-5 mb-4"></div>
        </div>
      </form>
      <CompetitorCompanyQualityCertificatesList
        qCSubList={qCList}
        onEdit={onEdit}
        onDelete={onDelete}
        onPreview={onPreview}
      />
    </div>
  );
};
export default CompetitorCompanyQualityCertificatesForm;
