import axios from "axios";
import { Fragment, useRef, useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import useInputValidation from "../../../../hooks/useInputValidation_copy";
import { isNotEmpty } from "../../../CommonFunctions/CommonFunctions";
import ReadyToUpload from "./ReadyToupload";
import styles from "./UploadDocTechnicalEvalution.module.css";
import Swal from "sweetalert2";
import LockCard from "../../../../UI/LockCard";
import PreLoader from "../../../../UI/PreLoader";
import Select from "react-select";
const TechnicalEvalution = (props) => {
  var competid = "";
  const [file, setFile] = useState(null);
  const [isDatasending, setdatasending] = useState(false);
  const [FetchLoading, setFetchLoading] = useState(true);
  const [isEditbtn, setisEditbtn] = useState(false);
  const [isEdited, setisEdited] = useState(false);
  const [UploadDocId, setUploadDocId] = useState(null);
  const [dragover, setdragover] = useState(false);
  const [leastcount, setleastcount] = useState("L1");
  const [competitorid, setcompetitorid] = useState("");

  const [progress, setProgressCompleted] = useState(0);
  const [leastbidder, setleastbidder] = useState([]);
  const [toastSuccess, toastError, setBidManagementMainId, bidManageMainId] =
    useOutletContext();
  const [idvalue, setidvalue] = useState([]);
  const [notHasList, setNotHasList] = useState(true);

  const wrapperRef = useRef(null);
  const ref = useRef();
  const { id } = useParams();
  const { server1: baseUrl } = useBaseUrl();
  const [input, setInput] = useState({});

  const [DateValue, setDateValue] = useState("");
  const [Description, setDescription] = useState("");
  const [leastHasError, setLeastHasError] = useState("");
  const [DateHasError, setDateHasError] = useState(true);
  // const [hasError, setHasError] = useState("");

  function DateChangeHandler(e) {
    setDateValue(e.target.value);
    // if (!e.target.value) {
    //   setDateHasError(true);
    // } else {
    //   setDateHasError(false);
    setisEdited(true);
    // }
  }
  function desChangeHandler(e) {
    setDescription(e.target.value);
    // if (!e.target.value) {
    //   setDateHasError(true);
    // } else {
    //   setDateHasError(false);
    setisEdited(true);
    // }
  }

  const onDragEnter = () => {
    wrapperRef.current.classList.add(styles["dragover"]);
    setdragover(true);
  };

  const onDragLeave = () => {
    wrapperRef.current.classList.remove(styles["dragover"]);
    setdragover(false);
  };

  const onDrop = () => wrapperRef.current.classList.remove(styles["dragover"]);

  const onFileDrop = (e) => {
    setisEdited(true);
    const newFile = e.target.files[0];

    let filetypes = newFile.type;

    if (
      filetypes === "application/pdf" ||
      filetypes === "application/msword" ||
      filetypes ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      filetypes.split("/")[0] === "image"
    ) {
      setFile(newFile);
    } else {
      toastError(
        "File format not suppoted. Upload pdf, doc, docx and images only"
      );
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

  function getTechEvalutionList() {
    if (bidManageMainId) {
      try {
        axios({
          url: `${baseUrl}/api/tenderstatus/awardcontract/${bidManageMainId}`,
          method: "GET",
          headers: {
            //to stop cacheing this response at browsers. otherwise wrongly displayed cached files
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
          .then((res) => {
            if (res.data.status === 200) {
              setUploadDocId(res.data.mainId);
              setDateValue(res.data.date ? res.data.date : "");
              let des = res.data.description ? res.data.description : "";
              setDescription(des ? des : "");

              competid = res.data.competitorId;
              setcompetitorid(res.data.competitorId);
              setisEditbtn(true);
              SelectList();

              let data = {
                tokenid : localStorage.getItem('token')
              }

              axios({
                url: `${baseUrl}/api/tenderstatus/awardontract/download/${bidManageMainId}`,data,
                method: "POST",
                responseType: "blob", // important
                headers: {
                  //to stop cacheing this response at browsers. otherwise wrongly displayed cached files
                  "Cache-Control": "no-cache",
                  Pragma: "no-cache",
                  Expires: "0",
                },
              }).then((response) => {
                if (response.status === 200) {
                  response.data.name = res.data.filename;
                  setisEditbtn(true);
                  setFile(response.data);
                } else {
                  // setisEditbtn(false);
                  setFile(null);
                }
              });
            } else if (res.data.status === 404) {
              {
                SelectList();
                setisEditbtn(false);
                setFile(null);
              }
            }
          })
          .then(() => {
            setFetchLoading(false);
          });
      } catch (exception) {
        setFetchLoading(false);
        console.log(exception);
      }
    }
    formIsValid = false;
  }

  //Get List of Competitors who are involved for Technical evaluation
  useEffect(() => {
    setFetchLoading(true);
    getTechEvalutionList();

    // get least compiteator
    setTimeout(() => {}, 5000);
  }, [bidManageMainId]);
  const SelectList = () => {
    if (bidManageMainId) {
      let data = {
        tokenid : localStorage.getItem('token')
      }
      axios({
        url: `${baseUrl}/api/tenderstatus/financialevaluation/getleastbidder/${bidManageMainId}`,data,
        method: "POST",

        headers: {
          //to stop cacheing this response at browsers. otherwise wrongly displayed cached files
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      }).then((response) => {
        if (response.status === 200) {
          setleastbidder(response.data.bidders);

          if (response.data.bidders.length > 0) {
            setNotHasList(false);

            // console.log("In IF competid",competid);

            let i = 0;

            response.data.bidders.map((option, index) => {
              if (competid) {
                if (option.competitorId == competid) {
                  setleastcount(option.least);
                  setidvalue(option.competitorId);
                }
                if (option.least) {
                  i++;
                }
              } else {
                if (option.least === "L1") {
                  // document.getElementById("com_id2").setAttribute("value",option.competitorId);
                  let cid = option.competitorId;
                  i++;
                  setidvalue(cid);
                } else if (option.least) {
                  i++;
                }
              }
              if (!option.least && i === 0) {
                setNotHasList(true);
              } else if (i > 0) {
                setNotHasList(false);
              }
            });
          }
        }
      });
    }
  };
  //select option for bidders

  const SettingLeast = (least) => {
    setleastcount(least);
  };

  const OnSelect = (option, least) => {
    let id = null;
    if (option ){
    id = option.value;
      if (id) {
        setLeastHasError(false);
      } else {
        setLeastHasError(true);
      }
    } else {
      if (option && !option.value) {
        setLeastHasError(true);
      }
      else {
        setLeastHasError(false);
      }
    }
    setleastcount(least);
    setidvalue(id);
    setisEdited(true);
  };
  

  const leastbidder_options = leastbidder.map((option, index) => {
    return {
      label: option.compName,
      value: option.competitorId,
      key: option.least,
    };
  });
  
  useEffect(() => {
    if (isEdited) setisEdited(true); 
  }, [DateValue, file, Description]);

  const resetform = () => {
    setDateValue("");
    setFile(null);
    //have to reset input with loop
    Object.keys(input).forEach((key) => {
      setInput((prev) => {
        return {
          ...prev,
          [key]: { [`${key}status`]: "", [`${key}reason`]: "" },
        };
      });
    });

    setisEditbtn(false);
    setUploadDocId(null);
  };

  let formIsValid = false;

  if (DateValue || file !== null) {
    formIsValid = true;
  }

  const postData = (data) => {
    try {
      axios
        .post(`${baseUrl}/api/tenderstatus/awardcontract`, data, config)
        .then((resp) => {
          if (resp.data.status === 200) {
            // ref.current.getDocList();
            // resetform();
            toastSuccess(resp.data.message);
            props.reloadFunction();
          } else if (resp.data.status === 400) {
            toastError(resp.data.message);
          } else {
            toastError("Unable to upload the document");
          }
          setdatasending(false);
        });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      setdatasending(false);
    }
  };
  const putData = (data, UploadDocId) => {
    // try{

    axios
      .post(
        `${baseUrl}/api/tenderstatus/awardcontract/${UploadDocId}`,
        data,
        config
      )
      .then((resp) => {
        if (resp.data.status === 200) {
          toastSuccess(resp.data.message);
          props.reloadFunction();
        } else if (resp.data.status === 400) {
          toastError(resp.data.message);
        } else {
          toastError("Unable to update");
        }

        setdatasending(false);
      });

    // }catch(err){
    //     Swal.fire({
    //       icon: "error",
    //       title: "Oops...",
    //       text: "Something went wrong!",
    //     });
    //     setdatasending(false);
    //   };
  };

  let comid = "";
  const submitHandler = (e) => {
    e.preventDefault();
    setdatasending(true);

    //     if (!formIsValid) {
    //       setdatasending(false);
    //       return;
    //     }

    const formdata = new FormData();
    // formdata.append('file', file[0]);

    let data = {
      date: DateValue,
      // file: formdata,
      competitorId: idvalue,
      description: Description,
      tokenid: localStorage.getItem("token"),
      bid_creation_mainid: id,
    };
    if (UploadDocId) {
      data._method = "PUT";
    }

    if (file instanceof Blob) {
      data.file = new File([file], file.name);
    }

    for (var key in data) {
      if (key === "input") {
        for (var key1 in data[key]) {
          for (var key2 in data[key][key1]) {
            if (key2.includes("status")) {
              formdata.append(`input[${key1}][status]`, data[key][key1][key2]);
            } else if (key2.includes("reason")) {
              formdata.append(`input[${key1}][reason]`, data[key][key1][key2]);
            }
          }
        }
      } else {
        formdata.append(key, data[key]);
      }
    }

    // postData(data);

    if (id && UploadDocId === null && !isEditbtn) {
      postData(formdata);
    } else if (id && UploadDocId !== null && isEditbtn) {
      putData(formdata, UploadDocId);
    }
  };

  //  {(!formIsValid || isDatasending || FetchLoading) && !isEdited}
  return (
    <LockCard locked={!id || notHasList}>
      <PreLoader loading={FetchLoading}>
        <form onSubmit={submitHandler} encType="multipart/form-data">
          <div className="row align-items-baseline">
            <div className="inputgroup col-lg-7 mb-4 ">
              <div className="row  font-weight-bold">
                <div className="col-lg-4 text-dark align-items-center">
                  <label htmlFor="contractaward" className="pt-2">
                    Contract Awarded To
                    <span className="text-danger">&nbsp;*&nbsp;</span>:
                  </label>
                </div>
                <div className="col-lg-8 ml-0">
                  <Select
                    name="contractaward"
                    id="contractaward"
                    options={leastbidder_options}
                    isSearchable="true"
                    isClearable="true"
                    //   value={input.medium}
                    value={leastbidder_options.filter(
                      (leastbidder_options) =>
                        leastbidder_options.key == leastcount
                    )}
                    onChange={(leastbidder_options) =>
                      leastbidder_options
                        ? OnSelect(leastbidder_options, leastbidder_options.key)
                        : OnSelect(null, null)
                    }
                  ></Select>
                  {leastHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        This field is required..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-1"></div>
            </div>
            <div className="inputgroup col-lg-5 mb-4 ">
              <div className="row font-weight-bold">
                <div className="col-lg-5 text-dark align-items-center">
                  <label htmlFor="Date" className="pt-2">
                    Contract Awarded Date{" "}
                    {/* <span className="text-danger">&nbsp;*&nbsp;</span>: */}{" "}
                    :
                  </label>
                </div>
                <div className="col-lg-7 align-items-left">
                  <input
                    type="Date"
                    className="form-control"
                    id="Date"
                    placeholder="Enter Date"
                    name="Date"
                    value={DateValue}
                    onChange={DateChangeHandler}
                    disabled={false}
                  />
                  {/* {DateHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                      This field is required..!
                      </span>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
            {file !== null && (
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row ">
                  <div className="col-lg-4 text-dark font-weight-bold">
                    <label htmlFor="customername">
                      Document Upload{" "}
                      {/* <span className="text-danger">&nbsp;*&nbsp;</span>: */}{" "}
                      :
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <ReadyToUpload
                      file={file}
                      clearFile={() => setFile(null)}
                    />
                  </div>
                </div>
              </div>
            )}
            {file === null && (
              <div className="inputgroup col-lg-7 mb-4">
                <div className="row ">
                  <div className="col-lg-4 text-dark font-weight-bold">
                    <label htmlFor="customername">Document Upload :</label>
                  </div>
                  <div className="col-lg-8 ">
                    <div
                      className={`border-primary d-flex flex-column align-items-center justify-content-center   bg-gray-200  ${styles.height_of_dropbox} ${styles.boderradius__dropbox} ${styles.dashed} ${styles.drop_file_input} `}
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
                        className="h-100 w-100 position-absolute top-50 start-50 pointer"
                        accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/* "
                        onChange={onFileDrop}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">&nbsp;</div>
              </div>
            )}
            <div className="inputgroup col-lg-1 mb-4 "></div>

            <div className="inputgroup col-lg-7 mb-4 ">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-4 text-dark">
                  <label htmlFor="Date" className="pr-3">
                    AOC Description{" "}
                    {/* <span className="text-danger">&nbsp;*&nbsp;</span>: */}{" "}
                    :
                  </label>
                </div>
                <div className="col-lg-8">
                  <textarea
                    name="description"
                    id="description"
                    className="form-control"
                    maxLength="255"
                    rows="4"
                    cols="60"
                    value={Description}
                    onChange={desChangeHandler}
                  ></textarea>
                  {/* {DateHasError && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        Date is required
                      </span>
                    </div>
                  )} */}
                </div>
              </div>
            </div>

            <div className="col-lg-12 d-flex justify-content-center">
              {!isEditbtn && (
                <button
                  className={
                    !formIsValid
                      ? "btn btn-outline-primary rounded-pill px-4"
                      : "btn btn-primary rounded-pill px-4"
                  }
                  disabled={
                    props.tenderStatus === "Cancel" ||
                    !formIsValid ||
                    isDatasending ||
                    FetchLoading
                  }
                >
                  {isDatasending && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  {isDatasending && progress + "% Uploaded"}
                  {!isDatasending && "Submit"}
                </button>
              )}
              {isEditbtn && (
                <button
                  className={
                    !formIsValid
                      ? "btn btn-outline-primary rounded-pill px-4"
                      : "btn btn-primary rounded-pill px-4"
                  }
                  disabled={
                    props.tenderStatus === "Cancel" ||
                    ((formIsValid || isDatasending || FetchLoading) &&
                      !isEdited)
                  }
                >
                  {isDatasending && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  {isDatasending && progress + "%  Updating..."}
                  {!isDatasending && "Update"}
                </button>
              )}

              <button
                className="btn  btn-outline-dark rounded-pill mx-3"
                onClick={resetform}
                disabled={isDatasending || FetchLoading}
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </PreLoader>
    </LockCard>
  );
};
export default TechnicalEvalution;
