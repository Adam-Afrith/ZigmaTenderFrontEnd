import { usePageTitle } from "../../../../hooks/usePageTitle";
import { useAllowedUploadFileSize } from "../../../../hooks/useAllowedUploadFileSize";
import { useAllowedMIMEDocType } from "../../../../hooks/useAllowedMIMEDocType";
import { useState, useEffect, useRef, Fragment } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import axios from "axios";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import Swal from "sweetalert2";
import CommunicationFilesList from "./CommunicationFilesList";
import { useImageStoragePath } from "../../../../hooks/useImageStoragePath";
import CollapseCard from "../../../../UI/CollapseCard";
import "./UploadDoc.css";
import Select from "react-select";
import { Alert } from "bootstrap";

//Medium Options
const options = [
  { value: "By Postal", label: "By Postal" },
  { value: "Courier", label: "Courier" },
  { value: "Parcel Service", label: "Parcel Service" },
  { value: "In hand Delivery", label: "In hand Delivery" },
];

const CommunicationFilesForm = () => {
  const { id } = useParams();
  // usePageTitle("Competitor Creation");
  const initialValue = {
    commId: "",
    date: "",
    refrence_no: "",
    from: "",
    to: "",
    subject: "",
    medium: "",
    med_refrence_no: "",
    fileName: "",
  };

  const [input, setInput] = useState(initialValue);
  const [formIsValid, setFormIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commFilesList, setCommFilesList] = useState([]);
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [previewObjURL, setPreviewObjURL] = useState([]);
  const [progress, setProgressCompleted] = useState(0);
  const [dragover, setdragover] = useState(false);
  const wrapperRef = useRef(null);
  const [file, setFile] = useState("");
  const [previewForEdit, setPreviewForEdit] = useState("");
  let tokenId = localStorage.getItem("token");
  const { server1: baseUrl } = useBaseUrl();
  const { img: maxImageSize } = useAllowedUploadFileSize();
  const { MIMEtype: doctype } = useAllowedMIMEDocType();
  const { commnunicationfile: filePath } = useImageStoragePath();
  const [isPdfFile, setIsPdfFile] = useState(false);
  const [array, setArray] = useState([]);
  const [num, setNum] = useState(0);
  const [ImgaeList, setImgList] = useState([]);
  //  const navigate = useNavigate();
  const [hasError, setHasError] = useState(initialValue);

  useEffect(() => {
    getCompFilesList();
    setNum("wrk-" + Math.floor(100000 + Math.random() * 900000));

  }, []);
  useEffect(() => {
    imageList();
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

  // const onFileDrop = (e) => {
  //   const newFile = e.target.files[0];
  //   if(e.target.files[0]){
  //   var splited = newFile.name.split(".");
  //   if(splited[1]==="pdf")
  //   {setIsPdfFile(true);}
  //   else{setIsPdfFile(false);}
  //   }
  //   if (newFile) {

  //     setFile(newFile);
  //     setPreviewObjURL(URL.createObjectURL(e.target.files[0]));
  //     if (previewForEdit) {
  //       setPreviewForEdit("");
  //     }
  //   }
  // };
  const del_image = (e, id) => {

    e.preventDefault();
    axios.get(`${baseUrl}/api/workorder/creation/communicationfiledelete/${id}`).then(res => {
      if (res.data.status === 200) {

        imageList();
      }


    });



  }
  const openInNewTab = (url, id) => {

    onmouseover = window.open('http://192.168.1.29:8000/uploads/BidManagement/WorkOrder/CommunicationFiles/' + id, '', 'height=550,width=800,scrollbars=yes,left=320,top=120,toolbar=no,location=no,directories=no,status=no,menubar=no');
    return false;
  };
  var FILELIST = '';
  const imageList = (e) => {

    let sub_id = document.getElementById('rand_no').value;
    const datatosend = {
      sub_id: sub_id,
    };
    axios.post(`${baseUrl}/api/workorder/creation/communicationfileUploadlist/`, datatosend).then(res => {

      if (res.data.status == 200) {
        setImgList(res.data.list);
        // window.location.href = "/admin/bill-upload/"+sub_id;

      }


    });


  }
  FILELIST =
    ImgaeList.map((item, index) => {
      let imageurl = '';
      if (item.filetype == 'pdf') {
        imageurl = "assets/icons/pdf_logo.png";
      }
      else if (item.filetype == 'docx' || item.filetype == 'doc') {
        imageurl = "assets/icons/doc-icon.png";
      } else if (item.filetype == 'jpeg' || item.filetype == 'jpg' || item.filetype == 'png' || item.filetype == 'img') {
        imageurl = "http://192.168.1.29:8000/uploads/BidManagement/WorkOrder/CommunicationFiles/" + item.comfile;
      }
      else {
        imageurl = "assets/icons/excelicon.png";
      }

      return (
        <>


          {/* <tr>
                <td>{index+1}</td> */}
          <Link onClick={(url) => openInNewTab(url, item.comfile)}  >
            <img src={imageurl} alt="" className="imageprev rounded-circle pointer" width="85" height='85' /></Link>&nbsp;<span
              className="rounded-circle pointer fa fa-close text-danger h4 closebtn"
              onClick={(e) => del_image(e, item.id)}
            >
            &nbsp;
          </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

          {/* <td>
                        <button type="button"  onClick={ (e) => del_image(e, item.id) } className="btn btn-danger btn-sm">Delete</button>
                    </td> */}
          {/* </tr> */}

        </>
      )
    });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const onFileDrop = (e) => {

    // console.log("e.target.files",e.target.files);

    imageList();

    let file = e.target.files[0];
    //  let file=e.target.files[0]
    let sub_id = document.getElementById('rand_no').value;
    // let formData = new FormData();
    // formData.append('file', file);
    // console.log("Image FIles",formData);
    // console.log("Image FIles1",file);
    if (input.date == '') {

      Swal.fire({
        icon: "error",
        title: "Communication Files",
        text: "Date Is Empty",
        confirmButtonColor: "#5156ed",
      }).then(function () {
        setLoading(false);
        setIsBtnClicked(false);
      });
      return false;
    }

    //  let file=e.target.files[0]
    let tokenId = localStorage.getItem("token");
    if (
      input.date !== "" ||
      id !== "" ||
      input.refrence_no !== "" ||
      input.from !== "" ||
      input.to !== "" ||
      input.subject !== "" ||
      input.medium.value !== "" ||
      input.med_refrence_no !== "" ||
      tokenId !== ""
    ) {
      const datatosend = {
        date: input.date,
        refrenceno: input.refrence_no,
        from: input.from,
        to: input.to,
        subject: input.subject,
        medium: input.medium.value,
        medrefrenceno: input.med_refrence_no,

        sub_id: sub_id,
        tokenid: tokenId,
        bidid: id,
        file: file,
        tokenId: tokenId,
      };
      const formdata = new FormData();

      for (var key in datatosend) {
        formdata.append(key, datatosend[key]);
      }
      // let formData = new FormData();
      // formData.append('file', file);
      axios.post(`${baseUrl}/api/workorder/creation/communicationfileUpload/`, formdata).then(res => {

        if (res.data.status == 200) {

          // window.location.href = "/admin/bill-upload/"+sub_id;
          imageList();
        }


      });



    }
    else {

      Swal.fire({
        icon: "error",
        title: "Communication Files",
        text: "Fill the form after that to upload files",
        confirmButtonColor: "#5156ed",
      }).then(function () {
        setLoading(false);
        setIsBtnClicked(false);
      });

    }



    //   console.log("setFileArray before",setFileArray);

    //     if(e.target.files[0]){

    //         setFileArray.push([...setFileArray,e.target.files[0]]);
    //     // setArray(oldArray => [...oldArray,e.target.files[0]]);




    //     }  

    //     console.log("files len",setFileArray.length);
    //     console.log("setFileArray after",setFileArray);

    // let perv=[];
    //     for (let i = 0; i < e.target.files.length; i++) {
    //       perv.push(URL.createObjectURL(e.target.files[i]));
    //     }


    //     setSelectedFiles(e.target.files);
    //     setImagePreviews((previousImages) => previousImages.concat(perv));


    //     // setProgressInfos({ val: [images] });

    //     setMessage([]);
  }
    ;
  var IMG = 'TEST';
  IMG = images.map((url, i) => {
    return (
      <img src={url} alt={"image-" + i} key={i} />
    )
  })

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

  //check Form is Valid or not
  useEffect(() => {
    if (input.date !== "") {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [input, file, previewForEdit]);

  const getCompFilesList = () => {
    axios
      .get(`${baseUrl}/api/competitordetails/commFilesList/${id}`)
      .then((resp) => {
        let list = [...resp.data.comm];
        let listarr = list.map((item, index) => ({
          ...item,

          comfile:
            item.filetype === "pdf"
              ? `<embed src="${filePath}` +
              item.comfile
              +
              `" class="rounded-circle pointer" width="0" height="0" style="cursor:pointer" title="Pdf"/><img src="assets/icons/pdf_logo.png" class="rounded-circle pointer" width="75" height="75" alt="PDF" id="commImg" style="cursor:pointer" title="PDF"></img>`
              : `<img src="${filePath}` +
              item.comfile +
              `" class="rounded-circle pointer" width="75" height="75" alt="image" id="commImg" style="cursor:pointer" title="Image"></img>`,

          buttons: `<i class="fa fa-edit text-primary mx-2 h6" style="cursor:pointer" title="Edit"></i> <i class="fa fa-trash text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>`,
          sl_no: index + 1,
        }));
        setCommFilesList(listarr);
      });
  };

  const getImageUrl = (s) => {
    var pattern = /[a-zA-Z0-9]*\.(?:png|jpeg|jpg|pdf)/;

    var result = s.match(pattern);
    var img_url = filePath + result; //filePath is a state value, which indicates server storage location

    if (!(img_url === null || !img_url === undefined)) {
      setPreviewForEdit(img_url);
    } else {
      setPreviewForEdit("");
    }
  };

  const onEdit = (data) => {
    setFile("");

    var imgUrl = getImageUrl(data.comfile);
    setFormIsValid(true);
    setInput({
      ...input,
      commId: data.id,
      date: data.date,
      refrence_no: data.refrenceno,
      from: data.from,
      to: data.to,
      subject: data.subject,
      med_refrence_no: data.med_refrenceno,
    });
    setNum(data.randomno);
    setTimeout(() => {

      imageList();

    }, 1000);


    // var pattern = /[a-zA-z0-9]*\.(?:png|jpeg|jpg|pdf)/;
    // var img_url = data.comfile.match(pattern);
    // var splited = img_url[0].split(".");
    // if (splited[1] === "pdf") {
    //   setIsPdfFile(true);
    // }
    // else {
    //   setIsPdfFile(false);
    // }

    setInput((prev) => {
      return {
        ...prev,
        medium: options.find((x) => x.value === data.medium),
      };
    });
  };

  const onPreview = (data) => {

    var pattern = /[a-zA-z0-9]*\.(?:png|jpeg|jpg|pdf)/;
    var img_url = data.comfile.match(pattern);
    if (img_url[0]) {
      var splited = img_url[0].split(".");
      if (splited[1] === "pdf") { setIsPdfFile(true); }
      else { setIsPdfFile(false); }
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
          .delete(`${baseUrl}/api/workorder/creation/communicationfiles/${data.id}`)
          .then((resp) => {
            if (resp.data.status === 200) {
              Swal.fire({
                //success msg
                icon: "success",
                title: "Communication Files",
                text: `removed!`,
                timer: 2000,
                showConfirmButton: false,
              });
              getCompFilesList();
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
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    if (e.target.value === "" || e.target.value === null) {
      setHasError({ ...hasError, [e.target.name]: true });
    } else {
      setHasError({ ...hasError, [e.target.name]: false });
    }
  };

  const selectInputHandler = (value, action) => {
    setInput({
      ...input,
      [action.name]: value,
    });
    if (value === "" || value === null) {
      setHasError({ ...hasError, [action.name]: true });
    } else {
      setHasError({ ...hasError, [action.name]: false });
    }
  };


  const resetForm = () => {
    setLoading(false);
    setIsBtnClicked(false);
    setInput(initialValue);
    getCompFilesList();
    setFile("");
    setPreviewObjURL("");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setIsBtnClicked(true);

    let tokenId = localStorage.getItem("token");
    if (
      input.date !== "" ||
      id !== "" ||
      input.refrence_no !== "" ||
      input.from !== "" ||
      input.to !== "" ||
      input.subject !== "" ||
      input.medium.value !== "" ||
      input.med_refrence_no !== "" ||
      tokenId !== ""
    ) {
      const datatosend = {
        date: input.date,
        refrenceno: input.refrence_no,
        from: input.from,
        to: input.to,
        subject: input.subject,
        medium: input.medium.value,
        medrefrenceno: input.med_refrence_no,
        tokenid: tokenId,
        bidid: id,
        file: file,
        tokenId: tokenId,
        random: document.getElementById('rand_no').value
      };

      const formdata = new FormData();

      for (var key in datatosend) {
        formdata.append(key, datatosend[key]);
      }

      axios
        .post(
          `${baseUrl}/api/workorder/creation/communicationfiles/${id}`,
          formdata
        )
        .then((resp) => {

          if (resp.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Communication Files",
              text: resp.data.message,
              timer: 2000,
            }).then(function () {
              resetForm();
              setLoading(false);
              setIsBtnClicked(false);
            });

            //1998
            setNum("wrk-" + Math.floor(100000 + Math.random() * 900000));
            setTimeout(() => {

              imageList();

            }, 1000);

          } else if (resp.data.status === 404) {
            Swal.fire({
              icon: "error",
              title: "Communication Files",
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
        title: "Communication Files",
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
      input.date !== "" ||
      id !== "" ||
      input.refrence_no !== "" ||
      input.from !== "" ||
      input.to !== "" ||
      input.subject !== "" ||
      input.medium.value !== "" ||
      input.med_refrence_no !== "" ||
      tokenId !== ""
    ) {
      //When Image is not changed on update
      if (previewForEdit !== "" && file === "") {
        const datatosend = {
          date: input.date,
          refrenceno: input.refrence_no,
          from: input.from,
          to: input.to,
          subject: input.subject,
          medium: input.medium.value,
          med_refrenceno: input.med_refrence_no,
          tokenid: tokenId,
          bidid: id,
        };

        axios
          .patch(
            `${baseUrl}/api/workorder/creation/communicationfiles/${input.commId}`,
            datatosend
          )
          .then((resp) => {
            if (resp.data.status === 200) {
              Swal.fire({
                icon: "success",
                title: "Communication Files",
                text: resp.data.message,
                timer: 2000,
              }).then(function () {
                resetForm();
                setPreviewForEdit("");
              });

              setNum("wrk-" + Math.floor(100000 + Math.random() * 900000));
              setTimeout(() => {

                imageList();

              }, 1000);

            } else if (resp.data.status === 404) {
              Swal.fire({
                icon: "error",
                title: "Communication Files",
                text: resp.data.errors,
                confirmButtonColor: "#5156ed",
              }).then(function () {
                setLoading(false);
                setIsBtnClicked(false);
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Communication Files",
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

          date: input.date,
          refrenceno: input.refrence_no,
          from: input.from,
          to: input.to,
          subject: input.subject,
          medium: input.medium.value,
          med_refrenceno: input.med_refrence_no,
          tokenid: tokenId,
          bidid: id,
          file: file,
          _method: "PUT",
        };

        const formdata = new FormData();
        for (var key in datatosend) {
          formdata.append(key, datatosend[key]);
        }

        axios
          .post(
            `${baseUrl}/api/workorder/creation/communicationfiles/${input.commId}`,
            formdata,
            config
          )
          .then((resp) => {
            if (resp.data.status === 200) {
              Swal.fire({
                icon: "success",
                title: "Communication Files",
                text: resp.data.message,
                timer: 2000,
              }).then(function () {
                resetForm();
                setPreviewForEdit("");
              });
            } else if (resp.data.status === 404) {
              Swal.fire({
                icon: "error",
                title: "Communication Files",
                text: resp.data.errors,
                confirmButtonColor: "#5156ed",
              }).then(function () {
                setLoading(false);
                setIsBtnClicked(false);
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Communication Files",
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
          title: "Communication Files",
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
        title: "Communication Files",
        text: "Something went wrong!",
        confirmButtonColor: "#5156ed",
      }).then(function () {
        setLoading(false);
        setIsBtnClicked(false);
      });
    }
  };
  const removeImgHandler = (e) => {

    // setFile("");
    // setPreviewObjURL("");
    // setImages("");
    const s = imagePreviews.filter((img) => img !== e);
    setImagePreviews(s);


  };


  return (
    <Fragment>
      <CollapseCard id={"CommunicationFiles"} title={"Communication Files"}>
        <form>
          <div className="row align-items-center ">
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-4 text-dark">
                  <label htmlFor="date">Date</label><span style={{ color: 'red' }} > * </span>
                </div>
                <div className="col-lg-8">
                  <input
                    type="date"
                    name="date"
                    id="date"
                    className="form-control"
                    value={input.date}
                    onChange={textInputHandler}
                  />
                  {hasError.date && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        Enter Valid Date..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-4 text-dark">
                  <label htmlFor="refrence_no" className="ml-3">
                    Refrence No
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    name="refrence_no"
                    id="refrence_no"
                    className="form-control"
                    value={input.refrence_no}
                    onChange={textInputHandler}
                  />
                  {hasError.refrence_no && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        Enter Valid Refrence No..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-4 text-dark">
                  <label htmlFor="from">From</label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    name="from"
                    id="from"
                    className="form-control"
                    value={input.from}
                    onChange={textInputHandler}
                  />
                  {hasError.from && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        Enter Valid From Value..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-4 text-dark">
                  <label htmlFor="to" className="ml-3">
                    To
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    name="to"
                    id="to"
                    className="form-control"
                    value={input.to}
                    onChange={textInputHandler}
                  // onBlur={toBlurHandler}
                  />
                  {hasError.to && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        Enter Valid To Value..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-4 text-dark mt-n5">
                  <label htmlFor="subject">Subject</label>
                </div>
                <div className="col-lg-8 ">
                  <textarea
                    name="subject"
                    id="subject"
                    className="form-control"
                    maxLength="255"
                    rows="4"
                    cols="60"
                    value={input.subject}
                    onChange={textInputHandler}
                  ></textarea>
                  {hasError.subject && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-normal">
                        Enter Valid Subject..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6">
              <div className="inputgroup col-lg-12">
                <div className="row align-items-center font-weight-bold">
                  <div className="col-lg-4 text-dark">
                    <label>Medium</label>
                  </div>
                  <div className="col-lg-8 font-weight-normal">
                    <Select
                      name="medium"
                      id="medium"
                      options={options}
                      isSearchable="true"
                      isClearable="true"
                      value={input.medium}
                      onChange={selectInputHandler}
                    ></Select>
                    {hasError.medium ? (
                      <div className="pt-1">
                        <span className="text-danger font-weight-normal">
                          Enter Valid Medium..!
                        </span>
                      </div>
                    ) : (
                      <div className="mb-4"></div>
                    )}
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-12 mb-4">
                <div className="row align-items-center font-weight-bold">
                  <div className="col-lg-4 text-dark">
                    <label>Med.Refrence No</label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      name="med_refrence_no"
                      id="med_refrence_no"
                      className="form-control"
                      value={input.med_refrence_no}
                      onChange={textInputHandler}
                    />

                    {hasError.med_refrence_no ? (
                      <div className="pt-1">
                        <span className="text-danger font-weight-normal">
                          Enter Valid Med.Refrence No..!
                        </span>
                      </div>
                    ) : (
                      <div className="mb-4"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-6 mb-4 ">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold pt-1">
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
                      multiple
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
                <div className="col-lg-4 text-dark font-weight-bold pt-1">

                  <input type='hidden' id='rand_no' name='rand_no' value={num} />
                </div>
                <div className="col-lg-8">

                  {/* <img src={previewObjURL} /> */}

                  {/* for edit */}



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


            {/* <thead className="text-center bg-success  text-white">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col">Image preview</th>
              <th scope="col">remove Preview</th>
            </tr>
          </thead> */}

            {imagePreviews && (
              <div className='bg-E4E0E0
   col-lg-8' >
                {FILELIST}
              </div>
            )}




            {/* {
imagePreviews.map((img, i) => {
   
 return (
    <tr>
            <td>{i+1}</td>
            
            <td><img

className="border border-dark"
id="previewImg"
src={!isPdfFile ? img : "assets/icons/pdf_logo.png"}
alt="No Image"
        width="75px"
        height="75px"
        onClick={() =>
          window.open(img, "_blank")
        }
        title="Click for Preview" 
  /></td>
            <td>
    <span className="fa fa-close text-danger h4 closebtn" onClick={()=>removeImgHandler(img)} ></span>
              </td>
               </tr>
            );

       
           
       })
       
       }  */}




          </div>
          <div className="row text-center">
            <div className="col-12">
              <button
                className="btn btn-primary"
                disabled={!formIsValid || isBtnClicked === true}
                onClick={!input.commId ? submitHandler : updateHandler}
              >
                {!input.commId
                  ? loading === true
                    ? "Adding...."
                    : "Add"
                  : loading === true
                    ? "Updating...."
                    : "Update"}
              </button>
            </div>
          </div>
        </form>
        <CommunicationFilesList
          commFilesSubList={commFilesList}
          onEdit={onEdit}
          onDelete={onDelete}
          onPreview={onPreview}
        />
      </CollapseCard>
    </Fragment>
  );
};
export default CommunicationFilesForm;