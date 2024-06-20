import { usePageTitle } from "../../../../hooks/usePageTitle";
import { useAllowedUploadFileSize } from "../../../../hooks/useAllowedUploadFileSize";
import { useAllowedMIMEDocType } from "../../../../hooks/useAllowedMIMEDocType";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import Swal from "sweetalert2";
import CompetitorCompanyWorkOrderList from "./CompetitorCompanyWorkOrderList";
import "./UploadDoc.css";
import Select from "react-select";
import { useImageStoragePath } from "../../../../hooks/useImageStoragePath";
import { data } from "jquery";
import { ImageConfig } from "../../../../hooks/Config";
import PreLoader from "../../../../UI/PreLoader";

const CompetitorCompanyWorkOrderForm = (props) => {
  // const compNo=useContext(CompNoContext);
  const { compid } = useParams();
  usePageTitle("Competitor Creation");
  const initialValue = {
    woId: "",
    compNo: "",
    custName: "",
    projectName: "",
    tnederId: "",
    state: "",
    woDate: "",
    quantity: "",
    unit: "",
    projectValue: "",
    perTonRate: "",
    qualityCompleted: "",
    date: "",
    woFile: "",
    completionFile: "",
  };
  const [competitorWOInput, setCompetitorWOInput] = useState(initialValue);
  const [formIsValid, setFormIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wOList, setWOList] = useState([]);
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [previewObjURL, setPreviewObjURL] = useState(""); //for WO upload
  const [previewObjURL1, setPreviewObjURL1] = useState(""); // for Completion Certificate Upload
  const [progress, setProgressCompleted] = useState(0);
  const [dragover, setdragover] = useState(false);
  const wrapperRef = useRef(null); //for WO upload
  const wrapperRef1 = useRef(null); // for Completion Certificate Upload
  const [woFile, setFile] = useState(""); //for WO upload
  const [completionFile, setFile1] = useState(""); // for Completion Certificate Upload
  const [previewForEdit, setPreviewForEdit] = useState(""); //for WO upload
  const [previewForEdit1, setPreviewForEdit1] = useState(""); // for Completion Certificate Upload
  const [FileName, setFileName] = useState({
    woFile: "",
    woCompletionFile: "",
  }); // it is used for edit purpose
  let tokenId = localStorage.getItem("token");
  const { server1: baseUrl } = useBaseUrl();
  const { img: maxImageSize } = useAllowedUploadFileSize();
  const { MIMEtype: doctype } = useAllowedMIMEDocType();
  const [previewFileType, setPreviewFileType] = useState({
    woFile: "",
    woCompletionFile: "",
  });
  const [woStateList, setWoStateList] = useState("");
  const [woUnitList, setWoUnitList] = useState("");
  const { woFile: woFilePath, woCompletionFile: woCompletionFilePath } =
    useImageStoragePath();
  const [editDataState, setEditDataState] = useState("");
  const [editDataUnit, setEditDataUnit] = useState("");
  const [FetchLoading, setFetchLoading] = useState(false);
  const [ListLoading, setListLoading] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const [Com, setCom] = useState([]);
  const [hasError, setHasError] = useState({
    custName: false,
    projectName: false,
    tnederId: false,
    state: false,
    woDate: false,
    quantity: false,
    unit: false,
    projectValue: false,
    perTonRate: false,
    qualityCompleted: false,
    date: false,
    woFile: false,
    completionFile: false,
  });

  useEffect(() => {
    setListLoading(true);
    // getCompNo();
    getStateList();
    getUnitList();
    getWOList();
  }, []);

  useEffect(() => {
    if (props.compNo) {
      setCom(props.compNo);
      setCompetitorWOInput({
        ...competitorWOInput,
        compNo: props.compNo,
      });
    }
  }, [props.compNo]);

  const getStateList = async () => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    await axios.post(`${baseUrl}/api/state/list/105`,data).then((resp) => {
      setWoStateList(resp.data.stateList);
    });
  };

  const getUnitList = async () => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    await axios.post(`${baseUrl}/api/unit/list`,data).then((resp) => {
      setWoUnitList(resp.data.unitList);
    });
  };
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
    if (e.target.name === "woUpload") {
      const newFile = e.target.files[0];
      if (newFile) {
        setFile(newFile);
        setFileSize((prev) => prev + newFile.size);

        setPreviewObjURL(URL.createObjectURL(e.target.files[0]));
        // var uploaded_wo_file_name=e.target.files[0].name;
        var type = e.target.files[0].name.split(".")[1]; // To Find type of File
        setPreviewFileType((prev) => {
          return { ...prev, woFile: type };
        });

        if (previewForEdit) {
          setPreviewForEdit("");
        }
      }
    } else {
      const newFile = e.target.files[0];
      var type = e.target.files[0].name.split(".")[1]; // To Find type of File
      setPreviewFileType((prev) => {
        return { ...prev, woCompletionFile: type };
      });
      if (newFile) {
        setFile1(newFile);
        setFileSize((prev) => prev + newFile.size);
        setPreviewObjURL1(URL.createObjectURL(e.target.files[0]));
        if (previewForEdit1) {
          setPreviewForEdit1("");
        }
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
    let len = woFile?.name?.split(".").length;
    if (woFile && fileSize > maxImageSize) {
      setFileSize(prev => prev - woFile.size);
      Swal.fire({
        title: "File Size",
        text: "File size is too Large",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        setFile("");
        setPreviewObjURL("");
      });
    // if (woFile && woFile.size > maxImageSize) {
    //   Swal.fire({
    //     title: "File Size",
    //     text: "File size is too Large",
    //     icon: "error",
    //     confirmButtonColor: "#2fba5f",
    //   }).then(() => {
    //     setFile("");
    //     setPreviewObjURL("");
    //   });
    } else if (woFile && !doctype.includes(woFile.type)) {
      if (woFile?.name?.split(".")[len - 1] !== "rar") {
        Swal.fire({
          title: "File Type",
          text: "Invalid File Type",
          icon: "error",
          confirmButtonColor: "#2fba5f",
        }).then(() => {
          setFile("");
          setPreviewObjURL("");
        });
      }
    } else if (
      FileName.woFile === "text/plain" ||
      woFile?.name?.split(".")[len - 1] === "txt"
    ) {
      Swal.fire({
        title: "File Type",
        text: "Invalid File Type",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        setFile("");
        setPreviewObjURL("");
      });
    }
  }, [woFile]);

  useEffect(() => {
    let len = completionFile?.name?.split(".").length;
    if (completionFile && fileSize > maxImageSize) {
      setFileSize(prev=>prev-completionFile.size);
      Swal.fire({
        title: "File Size",
        text: "File Size is too large",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        setFile1("");
        setPreviewObjURL1("");
      });
    // if (completionFile && completionFile.size > maxImageSize) {
    //   Swal.fire({
    //     title: "File Size",
    //     text: "File Size is too large",
    //     icon: "error",
    //     confirmButtonColor: "#2fba5f",
    //   }).then(() => {
    //     setFile1("");
    //     setPreviewObjURL1("");
    //   });
    } else if (completionFile && !doctype.includes(completionFile.type)) {
      if (completionFile?.name?.split(".")[len - 1] !== "rar") {
        // else if (completionFile && !doctype.includes(completionFile.type)) {
        Swal.fire({
          title: "File Type",
          text: "Invalid File Type ",
          icon: "error",
          confirmButtonColor: "#2fba5f",
        }).then(() => {
          setFile1("");
          setPreviewObjURL1("");
        });
      }
    } else if (
      FileName.completionFile === "text/plain" ||
      completionFile?.name?.split(".")[len - 1] === "txt"
    ) {
      Swal.fire({
        title: "File Type",
        text: "Invalid File Type",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        setFile1("");
        setPreviewObjURL1("");
      });
    }
  }, [completionFile]);

  // const getCompNo = async () => {
  //   await axios
  //     .get(`${baseUrl}/api/competitorprofile/getcompno/${compid}`)
  //     .then((resp) => {
  //       if (resp.data.status === 200) {
  //         setCompetitorWOInput({
  //           ...competitorWOInput,
  //           compNo: resp.data.compNo,
  //         });
  //       }
  //     });
  // };

  //check Form is Valid or not
  useEffect(() => {
    if (
      // competitorWOInput.custName !== "" &&
      // (woFile !== "") | (previewForEdit !== "")
      competitorWOInput.custName !== ""
    ) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [competitorWOInput, woFile, previewForEdit]);

  const getWOList = () => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    axios
      .post(`${baseUrl}/api/competitordetails/wolist/${compid}`,data)
      .then((resp) => {
        let list = [...resp.data.wo];
        let listarr = list.map((item, index) => ({
          ...item,
          woFile:
            item.woFile !== "" &&
            (item.woFile.split(".")[1] === "jpg" ||
              item.woFile.split(".")[1] === "png" ||
              item.woFile.split(".")[1] === "jpeg" ||
              item.woFile.split(".")[1] === "webp")
              ? `<img src="${woFilePath}` +
                item.woFile +
                `" class="rounded-circle pointer" width="40" height="40" style="cursor:pointer" />`
              : `<img src="${
                  item.woFile.split(".")[1] === "rar" ||
                  item.woFile.split(".")[1] === "vnd.rar" ||
                  item.woFile.split(".")[1] === "x-rar-compressed" ||
                  item.woFile.split(".")[1] === "x-rar"
                    ? ImageConfig["x-rar"]
                    : item.woFile.split(".")[1] === "pdf"
                    ? ImageConfig["pdf"]
                    : item.woFile.split(".")[1] === "doc" ||
                      item.woFile.split(".")[1] === "docx" ||
                      item.woFile.split(".")[1] === "msword" ||
                      item.woFile.split(".")[1] ===
                        "vnd.openxmlformats-officedocument.wordprocessingml.document"
                    ? ImageConfig["doc"]
                    : item.woFile.split(".")[1] === "zip" ||
                      item.woFile.split(".")[1] === "multipart/x-zip" ||
                      item.woFile.split(".")[1] === "x-zip" ||
                      item.woFile.split(".")[1] === "x-zip-compressed"
                    ? ImageConfig["zip"]
                    : item.woFile.split(".")[1] === "xls" ||
                      item.woFile.split(".")[1] === "xlsx" ||
                      item.woFile.split(".")[1] === "vnd.ms-excel" ||
                      item.woFile.split(".")[1] ===
                        "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    ? ImageConfig["vnd.ms-excel"]
                    : item.woFile.split(".")[1] === "csv"
                    ? ImageConfig["csv"]
                    : ImageConfig["default"]
                }" class="rounded-circle pointer" width="50" height="40" alt="" style="cursor:pointer"></img>`,

          completionFile:
            item.completionFile !== "" &&
            (item.completionFile.split(".")[1] === "jpg" ||
              item.completionFile.split(".")[1] === "png" ||
              item.completionFile.split(".")[1] === "jpeg" ||
              item.completionFile.split(".")[1] === "webp")
              ? `<img src="${woCompletionFilePath}` +
                item.completionFile +
                `" class="rounded-circle pointer" width="40" height="40" style="cursor:pointer" />`
              : `<img src="${
                  item.completionFile.split(".")[1] === "rar" ||
                  item.completionFile.split(".")[1] === "vnd.rar" ||
                  item.completionFile.split(".")[1] === "x-rar-compressed" ||
                  item.completionFile.split(".")[1] === "x-rar"
                    ? ImageConfig["x-rar"]
                    : item.completionFile.split(".")[1] === "pdf"
                    ? ImageConfig["pdf"]
                    : item.completionFile.split(".")[1] === "doc" ||
                      item.completionFile.split(".")[1] === "docx" ||
                      item.completionFile.split(".")[1] === "msword" ||
                      item.completionFile.split(".")[1] ===
                        "vnd.openxmlformats-officedocument.wordprocessingml.document"
                    ? ImageConfig["doc"]
                    : item.completionFile.split(".")[1] === "zip" ||
                      item.completionFile.split(".")[1] === "multipart/x-zip" ||
                      item.completionFile.split(".")[1] === "x-zip" ||
                      item.completionFile.split(".")[1] === "x-zip-compressed"
                    ? ImageConfig["zip"]
                    : item.completionFile.split(".")[1] === "xls" ||
                      item.completionFile.split(".")[1] === "xlsx" ||
                      item.completionFile.split(".")[1] === "vnd.ms-excel" ||
                      item.completionFile.split(".")[1] ===
                        "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    ? ImageConfig["vnd.ms-excel"]
                    : item.completionFile.split(".")[1] === "csv"
                    ? ImageConfig["csv"]
                    : ImageConfig["default"]
                }" class="rounded-circle pointer" width="50" height="40" alt="" style="cursor:pointer"></img>`,
          buttons: `<i class="fa fa-edit text-primary mx-2 h6" style="cursor:pointer" title="Edit"></i> <i class="fa fa-trash text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>`,
          sl_no: index + 1,
        }));
        setWOList(listarr);
      })
      .then(() => {
        setListLoading(false);
      });
  };

  const getImageUrl = (id) => {
    let data = {
      tokenid : localStorage.getItem('token')
    }

    axios
      .get(`${baseUrl}/api/competitorworkorder/${id}`)
      .then((res) => {
        if (res.data.wo.woFile) {
          setFileName((prev) => {
            return { ...prev, woFile: res.data.wo.woFile };
          });
          axios({
            url: `${baseUrl}/api/download/competitorworkorder/${id}/${"woFile"}`,data,
            method: "POST",
            responseType: "blob", // important
            headers: {
              //to stop cacheing this response at browsers. otherwise may displayed cached files
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
              Accept: doctype,
            },
          }).then((response) => {
            if (response.status === 200) {
              setFileSize(prev=>prev+response.data.size);
              setFile(response.data);
              setPreviewObjURL(URL.createObjectURL(response.data));
              setPreviewFileType((prev) => {
                return { ...prev, woFile: response.data.type.split("/")[1] };
              });
            } else if (response.status === 204) {
              setFile("");
              setPreviewObjURL("");
              setPreviewFileType((prev) => {
                return { ...prev, woFile: "" };
              });
            } else {
              alert("Unable to Process Now!");
            }
          });
        }

        if (res.data.wo.completionFile) {
          setFileName((prev) => {
            return { ...prev, woCompletionFile: res.data.wo.completionFile };
          });
          axios({
            url: `${baseUrl}/api/download/competitorworkorder/${id}/${"woCompletionFile"}`,data,
            method: "POST",
            responseType: "blob", // important
            headers: {
              //to stop cacheing this response at browsers. otherwise may displayed cached files
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
              Accept: doctype,
            },
          }).then((response) => {
            if (response.status === 200) {
              setFileSize(prev=>prev+response.data.size);
              setFile1(response.data);
              setPreviewObjURL1(URL.createObjectURL(response.data));
              setPreviewFileType((prev) => {
                return {
                  ...prev,
                  woCompletionFile: response.data.type.split("/")[1],
                };
              });
            } else if (response.status === 204) {
              setFile1("");
              setPreviewObjURL1("");
              setPreviewFileType((prev) => {
                return { ...prev, woCompletionFile: "" };
              });
            } else {
              alert("Unable to Process Now!");
            }
          });
        }
      })
      .then(() => {
        setTimeout(() => {
          setFetchLoading(false);
        }, 1500);
      });
  };

  const onEdit = (data) => {
    console.log("data", data);
    setFetchLoading(true);
    setFile("");
    setFile1("");
    getStateList();
    getUnitList();
    data.state > 0 ? setEditDataState(data.state) : setEditDataState("");
    data.unit > 0 ? setEditDataUnit(data.unit): setEditDataUnit("");
    getImageUrl(data.id);
    setFormIsValid(true);
    setCompetitorWOInput({
      woId: data.id,
      compNo: data.compNo,
      custName: data.custName,
      projectName: data.projectName,
      tnederId: data.tnederId,
      woDate: data.woDate ? data.woDate : "",
      quantity: data.quantity,
      projectValue: data.projectValue,
      perTonRate: data.perTonRate,
      qualityCompleted: data.qualityCompleted,
      date: data.date? data.date: "",
      woFile: data.woFile,
      completionFile: data.completionFile,
    });
  };

  //set State on Edit
  useEffect(() => {
    if (
      woStateList !== "" &&
      woStateList !== undefined &&
      editDataState !== ""
    ) {
      setCompetitorWOInput((prev) => {
        return {
          ...prev,
          state: woStateList.find((x) => x.value === editDataState),
        };
      });
    }

    if (woUnitList !== "" && woUnitList !== undefined && editDataUnit !== "") {
      setCompetitorWOInput((prev) => {
        return {
          ...prev,
          unit: woUnitList.find((x) => x.value === editDataUnit),
        };
      });
    }
  }, [editDataState, woStateList, editDataUnit, woUnitList]);

  //Show preview For Wo Document upload in Form on Edit
  const onPreview = (data) => {
    let filePath = data.woFile;
    var pattern = /[a-zA-z0-9]*\.(?:png|jpeg|jpg|pdf)/;
    var img_url = filePath.match(pattern);
    window.open(woFilePath + img_url, "_blank");
  };

  //Show preview For Completion Document upload in Form on Edit
  const onPreview1 = (data) => {
    let filePath = data.completionFile;
    var pattern = /[a-zA-z0-9]*\.(?:png|jpeg|jpg|pdf)/;
    var img_url = filePath.match(pattern);
    window.open(woCompletionFilePath + img_url, "_blank");
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
          .delete(`${baseUrl}/api/competitorworkorder/${data.id}`)
          .then((resp) => {
            if (resp.data.status === 200) {
              Swal.fire({
                //success msg
                icon: "success",
                title: "Work Order",
                text: `removed!`,
                timer: 2000,
                showConfirmButton: false,
              });
              getWOList();
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
    setCompetitorWOInput({
      ...competitorWOInput,
      [e.target.name]: e.target.value,
    });

    if (
      e.target.value === "" ||
      e.target.value === null ||
      e.target.value === undefined
    ) {
      setHasError({ hasError, [e.target.name]: true });
    } else {
      setHasError({ ...hasError, [e.target.name]: false });
    }
  };

  const selectInputHandler = (value, action) => {
    setCompetitorWOInput({
      ...competitorWOInput,
      [action.name]: value,
    });
    if (value === "" || value === null || value === undefined) {
      setHasError({ ...hasError, [action.name]: true });
    } else {
      setHasError({ ...hasError, [action.name]: false });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setIsBtnClicked(true);
    if (typeof competitorWOInput.state.value !== "undefined") {
      // myVariable is defined
      var stateVlaue = competitorWOInput.state.value;
    }
    else {
      var stateVlaue = '';
    }
    if (typeof competitorWOInput.unit.value !== "undefined") {
      // myVariable is defined
      var UnitVlaue = competitorWOInput.unit.value;
    }
    else {
      var UnitVlaue = '';
    }

    let tokenId = localStorage.getItem("token");
    const datatosend = {
      compId: compid,
      compNo: Com,
      projectName: competitorWOInput.projectName,
      custName: competitorWOInput.custName,
      tnederId: competitorWOInput.tnederId,
      state: stateVlaue,
      woDate: competitorWOInput.woDate,
      quantity: competitorWOInput.quantity,
      unit: UnitVlaue,
      projectValue: competitorWOInput.projectValue,
      perTonRate: competitorWOInput.perTonRate,
      qualityCompleted: competitorWOInput.qualityCompleted,
      date: competitorWOInput.date,
      woFile: woFile,
      completionFile: completionFile,
      tokenId: tokenId,
    };

    const formdata = new FormData();

    for (var key in datatosend) {
      formdata.append(key, datatosend[key]);
    }
    if (
      datatosend.compId !== null &&
      datatosend.compNo !== null &&
      (datatosend.custName !== null || datatosend.projectName !== null)
    ) {
      axios
        .post(`${baseUrl}/api/competitorworkorder`, formdata, config)
        .then((resp) => {
          if (resp.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Competitor Work Order",
              text: resp.data.message,
              timer: 2000,
            }).then(function () {
              resetFields();
            });
            getWOList();
          } else if (resp.data.status === 404) {
            Swal.fire({
              icon: "error",
              title: "Competitor Work Order",
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
        title: "Competitor Work Order",
        text: "You are tring to submit empty values",
        confirmButtonColor: "#5156ed",
      }).then(function () {
        setLoading(false);
        setIsBtnClicked(false);
      });
    }
  };

  const resetFields = () => {
    setIsBtnClicked(false);
    setLoading(false);
    setFile("");
    setFile1("");
    setPreviewObjURL("");
    setPreviewObjURL1("");
    setPreviewForEdit("");
    setPreviewForEdit1("");
    setCompetitorWOInput(initialValue);
  };

  const updateHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setIsBtnClicked(true);
    let tokenId = localStorage.getItem("token");
    if (typeof competitorWOInput.state?.value !== "undefined") {
      // myVariable is defined
      var stateVlaue = competitorWOInput.state?.value;
    }
    else {
      var stateVlaue = '';
    }
    if (typeof competitorWOInput.unit?.value !== "undefined") {
      // myVariable is defined
      var UnitVlaue = competitorWOInput.unit?.value;
    }
    else {
      var UnitVlaue = '';
    }
    const datatosend = {
      compId: compid,
      compNo: Com,
      projectName: competitorWOInput.projectName,
      custName: competitorWOInput.custName,
      tnederId: competitorWOInput.tnederId,
      state: stateVlaue,
      woDate: competitorWOInput.woDate,
      quantity: competitorWOInput.quantity,
      unit: UnitVlaue,
      projectValue: competitorWOInput.projectValue,
      perTonRate: competitorWOInput.perTonRate,
      qualityCompleted: competitorWOInput.qualityCompleted,
      date: competitorWOInput.date,
      tokenId: tokenId,
      _method: "PUT",
    };

    if (woFile instanceof File && woFile instanceof Blob) {
      datatosend.woFile = woFile;
    } else if (woFile instanceof Blob) {
      datatosend.woFile = null; //Null - File Exists but Not reuploaded
    } else {
      datatosend.woFile = ""; //""(Empty String) - File Not exists but Not reuploaded
    }

    if (completionFile instanceof File && completionFile instanceof Blob) {
      //only true when new file Uploaded
      datatosend.completionFile = completionFile;
    } else if (completionFile instanceof Blob) {
      //only true when new file not Uploaded but already exist a file on load
      datatosend.completionFile = null; //Null - File Exists but Not reuploaded
    } else {
      datatosend.completionFile = ""; //""(Empty String) - File Not exists but Not reuploaded
    }

    const formdata = new FormData();

    for (var key in datatosend) {
      formdata.append(key, datatosend[key]);
    }
    axios
      .post(
        `${baseUrl}/api/competitorworkorder/${competitorWOInput.woId}`,
        formdata,
        config
      )
      .then((resp) => {
        if (resp.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Competitor Work Order",
            text: resp.data.message,
            timer: 2000,
          }).then(function () {
            getWOList();
            resetFields();
          });
        } else if (resp.data.status === 404) {
          Swal.fire({
            icon: "error",
            title: "Competitor Work Order",
            text: resp.data.errors,
            confirmButtonColor: "#5156ed",
          }).then(function () {
            setLoading(false);
            setIsBtnClicked(false);    
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Competitor Work Order",
            text: "Something went wrong!",
            confirmButtonColor: "#5156ed",
          }).then(function () {
            setLoading(false);
            setIsBtnClicked(false);
          });
        }
      });
  };

  const removeImgHandler = (e) => {
    // console.log("remove handler", e.target, " ----");
    //e.target.name receives only undefiend so used 'e.target.id'
    if (e.target.id === "woUpload") {
      setFileSize(prev=>prev-woFile.size);
      setFile("");
      setPreviewObjURL("");
      setPreviewForEdit("");
    } else if (e.target.id === "completionCertificate") {
      setFileSize(prev=>prev-completionFile.size);
      setFile1("");
      setPreviewObjURL1("");
      setPreviewForEdit1("");
    }
  };

  const clearFields = (e) => {
    e.preventDefault();
    setCompetitorWOInput(initialValue);
    setFile("");
    setFile1("");
    setPreviewForEdit("");
    setPreviewForEdit1("");
    setPreviewObjURL("");
    setPreviewObjURL1("");
    setFileName("");
    setEditDataState("");
    setEditDataUnit("");
    setFormIsValid(false);
    setLoading(false);
  };

  //JSX Starts here
  return (
    <div className="">
      <PreLoader loading={FetchLoading}>
        <form>
          <div className="row align-items-center">
            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold pt-1">
                  <label htmlFor="custName">
                    {" "}
                    Customer Name
                    <span className="text-danger h6 font-weight-bold">
                      &nbsp;*
                    </span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    className="form-control"
                    id="custName"
                    placeholder="Enter Customer Name"
                    name="custName"
                    value={competitorWOInput.custName}
                    onChange={textInputHandler}
                  />

                  {hasError.custName && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Customer Name is Mandatory..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold pt-1">
                  <label htmlFor="projectName">
                    Project Name
                    {/* <span className="text-danger h6 font-weight-bold">
                      &nbsp;*
                    </span> */}
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    className="form-control"
                    id="projectName"
                    placeholder="Enter Project Name"
                    name="projectName"
                    value={competitorWOInput.projectName}
                    onChange={textInputHandler}
                  />

                  {hasError.projectName && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Project Name is Mandatory..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold pt-1">
                  <label htmlFor="tnederId">
                    {" "}
                    Tender Id
                    {/* <span className="text-danger h6 font-weight-bold">
                      &nbsp;*
                    </span> */}
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    className="form-control"
                    id="tnederId"
                    placeholder="Enter Teder Id"
                    name="tnederId"
                    value={competitorWOInput.tnederId}
                    onChange={textInputHandler}
                  />

                  {hasError.tnederId && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Tender ID is Mandatory..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold pt-1">
                  <label htmlFor="state">
                    State Name
                    {/* <span className="text-danger h6 font-weight-bold">
                      &nbsp;*
                    </span> */}
                  </label>
                </div>
                <div className="col-lg-8">
                  <Select
                    name="state"
                    id="state"
                    isSearchable="true"
                    isClearable="true"
                    options={woStateList}
                    onChange={selectInputHandler}
                    value={competitorWOInput.state}
                  ></Select>

                  {hasError.state && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Select State..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold pt-1">
                  <label htmlFor="woDate">
                    {" "}
                    WO Date
                    {/* <span className="text-danger h6 font-weight-bold">
                      &nbsp;*
                    </span> */}
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="date"
                    className="form-control"
                    id="woDate"
                    name="woDate"
                    value={competitorWOInput.woDate}
                    onChange={textInputHandler}
                  />

                  {hasError.woDate && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Invalid Work Order Date ..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold pt-1">
                  <label htmlFor="qantity">
                    Quantity
                    {/* <span className="text-danger h6 font-weight-bold">
                      &nbsp;*
                    </span> */}
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    className="form-control"
                    id="quantity"
                    placeholder="Enter Quantity"
                    name="quantity"
                    value={competitorWOInput.quantity}
                    onChange={textInputHandler}
                  />

                  {hasError.quantity && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Enter Valid Quantity..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold pt-1">
                  <label htmlFor="unit">
                    Unit
                     {/* <span className="text-danger h6 font-weight-bold">
                      &nbsp;*
                    </span> */}
                  </label>
                </div>
                <div className="col-lg-8">
                  <Select
                    name="unit"
                    id="unit"
                    isSearchable="true"
                    isClearable="true"
                    options={woUnitList}
                    onChange={selectInputHandler}
                    value={competitorWOInput.unit}
                  ></Select>

                  {hasError.unit && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Select Unit..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold pt-1">
                  <label htmlFor="projectValue">
                    Project Value
                     {/* <span className="text-danger h6 font-weight-bold">
                      &nbsp;*
                    </span> */}
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    className="form-control"
                    id="projectValue"
                    placeholder="Enter Project Value"
                    name="projectValue"
                    value={competitorWOInput.projectValue}
                    onChange={textInputHandler}
                  />

                  {hasError.projectValue && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Enter Valid Project Value..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold pt-1">
                  <label htmlFor="perTonRate">
                    Per Ton Rate
                     {/* <span className="text-danger h6 font-weight-bold">
                      &nbsp;*
                    </span> */}
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    className="form-control"
                    id="perTonRate"
                    placeholder="Enter Per Ton Rate"
                    name="perTonRate"
                    value={competitorWOInput.perTonRate}
                    onChange={textInputHandler}
                  />

                  {hasError.perTonRate && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Enter Valid Per Ton Rate..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold pt-1">
                  <label htmlFor="qualityCompleted">
                    Quantity Completed
                     {/* <span className="text-danger h6 font-weight-bold">
                      &nbsp;*
                    </span> */}
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    className="form-control"
                    id="qualityCompleted"
                    placeholder="Enter Quantity Completed"
                    name="qualityCompleted"
                    value={competitorWOInput.qualityCompleted}
                    onChange={textInputHandler}
                  />

                  {hasError.qualityCompleted && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Quality Completed field is Mandatory..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold pt-1">
                  <label htmlFor="date">
                    {" "}
                    Date
                     {/* <span className="text-danger h6 font-weight-bold">
                      &nbsp;*
                    </span> */}
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    placeholder="Enter Date"
                    name="date"
                    value={competitorWOInput.date}
                    onChange={textInputHandler}
                  />

                  {hasError.date && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Select Valid Date..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center">
                {/*<div className="col-lg-3 text-dark font-weight-bold pt-1">
                <label htmlFor="projectName">WO Upload</label>
              </div>
               <div className="col-lg-8">
                <input
                  type="text"
                  className="form-control"
                  id="projectName"
                  placeholder="Enter Project Name"
                  name="projectName"
                  value={competitorWOInput.projectName}
                  onChange={textInputHandler}
                />

                {/* {hasError.projectName && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-bold">
                      Enter Valid Amount..!
                    </span>
                  </div>
                )} 
              </div> */}
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold pt-1">
                  <label htmlFor="woUpload">
                    {" "}
                    WO Upload
                     {/* <span className="text-danger h6 font-weight-bold">
                      &nbsp;*
                    </span> */}
                    {/* <p className="text-info mt-2 mb-n2">Max File size 1 MB</p>
                  <p className="text-info ">Allowed File Type JPG/JPEG/PNG/PDF</p> */}
                  </label>
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
                      name="woUpload"
                      id="woUpload"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold pt-1">
                  <label htmlFor="woUpload">Preview</label>
                </div>
                <div className="col-lg-8">
                  {woFile && (
                    <div className="card border-left-info shadow py-2 w-100 my-4">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col-md-9">
                            <div className="font-weight-bold text-info mb-1">
                              {/* {FileName.woFile? FileName.woFile : competitorWOInput.custName} */}
                            </div>

                            <div className="row no-gutters align-items-center ">
                              <div className="col-auto">
                                <div className="h6 mb-0 mr-3 font-weight-bold text-gray-800 ">
                                  <p className="text-truncate">
                                    {woFile.name
                                      ? woFile.name
                                      : FileName.woFile}
                                  </p>
                                  <p>({woFile.size / 1000} KB)</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 d-flex align-items-center justify-content-center">
                            {previewObjURL &&
                            ["jpg", "jpeg", "png", "webp"].includes(
                              previewFileType.woFile
                            ) ? (
                              <img
                                className="rounded-circle pointer"
                                id="previewImg"
                                src={previewObjURL}
                                alt="No Image"
                                width="75px"
                                height="75px"
                                onClick={() =>
                                  window.open(previewObjURL, "_blank")
                                }
                                title="Click for Preview"
                              />
                            ) : (
                              <a href={previewObjURL} download={previewObjURL}>
                                <img
                                  className="rounded-circle pointer"
                                  id="previewImg"
                                  src={ImageConfig[previewFileType.woFile]}
                                  alt="No Image"
                                  width="75px"
                                  height="75px"
                                  title="Click for Dwonload"

                                />
                              </a>

                            )}

                            {previewObjURL !== null && (
                              <button
                                type="button"
                                className="close"
                                aria-label="Close"
                                onClick={removeImgHandler}
                              >
                                <span aria-hidden="true" id="woUpload">
                                  &times;
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* {hasError.projectName && (
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
                <div className="col-lg-4 text-dark font-weight-bold pt-1">
                  <label htmlFor="completionCertificate">
                    {" "}
                    Completion Certificate Upload
                    {/* <span className="text-danger h6 font-weight-bold">
                    &nbsp;*
                  </span> */}
                  </label>
                </div>
                <div className="col-lg-8">
                  <div
                    className="dashed border-primary height_of_dropbox boderradius__dropbox d-flex flex-column align-items-center justify-content-center  drop-file-input bg-gray-200"
                    ref={wrapperRef1}
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
                      name="completionCertificate"
                      id="completionCertificate"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold pt-1">
                  <label htmlFor="projectName">Preview</label>
                </div>
                <div className="col-lg-8">
                  {completionFile && (
                    <div className="card border-left-info shadow py-2 w-100 my-4">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col-md-9">
                            <div className="font-weight-bold text-info mb-1 mr-2">
                              {/* <p> {FileName.woFile? FileName.woCompletionFile : competitorWOInput.custName}</p> */}
                            </div>

                            <div className="row no-gutters align-items-center ">
                              <div className="col-auto">
                                <div className="h6 mb-0 mr-3 font-weight-bold text-gray-800 ">
                                  <p className="text-truncate">
                                    {completionFile.name
                                      ? completionFile.name
                                      : FileName.woCompletionFile}
                                  </p>
                                  <p>({completionFile.size / 1000} KB)</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 d-flex align-items-center justify-content-center">
                            {previewObjURL1 &&
                            ["jpg", "jpeg", "png", "webp"].includes(
                              previewFileType.woCompletionFile
                            ) ? (
                              <img
                                className="rounded-circle pointer"
                                id="previewImg1"
                                src={previewObjURL1}
                                alt="No Image"
                                width="75px"
                                height="75px"
                                onClick={() =>
                                  window.open(previewObjURL1, "_blank")
                                }
                                title="Click for Preview"
                              />
                            ) : (
                              <a href={previewObjURL1} download={previewObjURL1}>
                                <img
                                  className="rounded-circle pointer"
                                  id="previewImg1"
                                  src={
                                    ImageConfig[previewFileType.woCompletionFile]
                                  }
                                  alt="No Image"
                                  width="75px"
                                  height="75px"
                                  title="Click for Download"
                                />
                              </a>

                            )}
                            
                            {previewObjURL1 && (
                              <button
                                type="button"
                                className="close"
                                aria-label="Close"
                                onClick={removeImgHandler}
                              >
                                <span
                                  aria-hidden="true"
                                  id="completionCertificate"
                                >
                                  &times;
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* for edit */}

                  {/* {hasError.projectName && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-bold">
                      Enter Valid Amount..!
                    </span>
                  </div>
                )} */}
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
                      !competitorWOInput.woId ? submitHandler : updateHandler
                    }
                  >
                    {!competitorWOInput.woId
                      ? loading === true
                        ? "Adding...."
                        : "Add"
                      : loading === true
                        ? "Updating...."
                        : "Update"}
                  </button>{" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <button
                    className="btn btn-secondary"
                    // disabled={!formIsValid || isBtnClicked === true}
                    onClick={clearFields}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </PreLoader>
      <PreLoader loading={ListLoading}>
        <CompetitorCompanyWorkOrderList
          wOList={wOList}
          onEdit={onEdit}
          onDelete={onDelete}
          onPreview={onPreview}
          onPreview1={onPreview1}
        />
      </PreLoader>
    </div>
  );
};
export default CompetitorCompanyWorkOrderForm;
