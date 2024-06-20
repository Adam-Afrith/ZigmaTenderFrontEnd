import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import CollapseCard from "../../../../UI/CollapseCard";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import useInputValidation from "../../../../hooks/useInputValidation";
import { useAllowedMIMEDocType } from "../../../../hooks/useAllowedMIMEDocType";
import { useAllowedUploadFileSize } from "../../../../hooks/useAllowedUploadFileSize";
//import {useImageStoragePath} from "../../../../hooks/useImageStoragePath";
import {
  isNotEmpty,
  isNotNull,
} from "../../../CommonFunctions/CommonFunctions";
import axios from "axios";
import Swal from "sweetalert2";
import WorkOrderUploadFile from "./WorkeOrderUploadFile";
import AgreemaneUploadFile from "./AgreementUploadFile";
import SiteHandOverUploadFile from "./SiteHandOverUploadFile";

const WorkOrder = () => {
  const { id } = useParams();
  const [dataSending, setDataSending] = useState(false);
  const wrapperRef = useRef(null);
  const [dragover, setdragover] = useState(false);
  const [dragover1, setdragover1] = useState(false);
  const [dragover2, setdragover2] = useState(false);
  const [file, setFile] = useState(null);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [workid, setworkid] = useState(null);
  const { server1: baseUrl } = useBaseUrl();
  const [toastSuccess, toastError] = useOutletContext();
  const [progress, setProgressCompleted] = useState(0);
  const navigate = useNavigate();
  const [FetchLoading, setFetchLoading] = useState(false);
  const { img: maxImageSize } = useAllowedUploadFileSize();
  const { MIMEtype: doctype } = useAllowedMIMEDocType();
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
    if (newFile && newFile.size > maxImageSize) {
      Swal.fire({
        title: "File Size",
        text: "Maximum Allowed File size is 1MB",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        setFile(null);
      });
    } else if (newFile && !doctype.includes(newFile.type)) {
      Swal.fire({
        title: "File Type",
        text: "Allowed File Type are JPG/JPEG/PNG/PDF ",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        setFile(null);
      });
    } else {
      setFile(newFile);
    }
  };

  const onDragEnter1 = () => {
    wrapperRef.current.classList.add("dragover");
    setdragover1(true);
  };

  const onDragLeave1 = () => {
    wrapperRef.current.classList.remove("dragover");
    setdragover1(false);
  };

  const onDrop1 = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop1 = (e) => {
    const newFile1 = e.target.files[0];
    if (newFile1 && newFile1.size > maxImageSize) {
      Swal.fire({
        title: "File Size",
        text: "Maximum Allowed File size is 1MB",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        setFile1(null);
      });
    } else if (newFile1 && !doctype.includes(newFile1.type)) {
      Swal.fire({
        title: "File Type",
        text: "Allowed File Type are JPG/JPEG/PNG/PDF ",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        setFile1(null);
      });
    } else {
      setFile1(newFile1);
    }
  };

  const onDragEnter2 = () => {
    wrapperRef.current.classList.add("dragover");
    setdragover2(true);
  };

  const onDragLeave2 = () => {
    wrapperRef.current.classList.remove("dragover");
    setdragover2(false);
  };

  const onDrop2 = () => wrapperRef.current.classList.remove("dragover");
  const onFileDrop2 = (e) => {
    const newFile2 = e.target.files[0];
    if (newFile2 && newFile2.size > maxImageSize) {
      Swal.fire({
        title: "File Size",
        text: "Maximum Allowed File size is 1MB",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        setFile2(null);
      });
    } else if (newFile2 && !doctype.includes(newFile2.type)) {
      Swal.fire({
        title: "File Type",
        text: "Allowed File Type are JPG/JPEG/PNG/PDF ",
        icon: "error",
        confirmButtonColor: "#2fba5f",
      }).then(() => {
        setFile2(null);
      });
    } else {
      setFile2(newFile2);
    }
  };

  const {
    value: orderQuantityvalue,
    isValid: orderQuantityIsValid,
    hasError: orderQuantityHasError,
    valueChangeHandler: orderQuantityChangeHandler,
    inputBlurHandler: orderQuantityBlurHandler,
    setInputValue: setorderQuantityValue,
    reset: resetorderQuantity,
  } = useInputValidation(isNotEmpty);

  const {
    value: PricePerUnitvalue,
    isValid: PricePerUnitIsValid,
    hasError: PricePerUnitHasError,
    valueChangeHandler: PricePerUnitChangeHandler,
    inputBlurHandler: PricePerUnitBlurHandler,
    setInputValue: setPricePerUnitValue,
    reset: resetPricePerUnit,
  } = useInputValidation(isNotEmpty);

  const {
    value: LoaDatevalue,
    isValid: LoaDateIsValid,
    hasError: LoaDateHasError,
    valueChangeHandler: LoaDateChangeHandler,
    inputBlurHandler: LoaDateBlurHandler,
    setInputValue: setLoaDateValue,
    reset: resetLoaDate,
  } = useInputValidation(isNotEmpty);

  const {
    value: OrderDatevalue,
    isValid: OrderDateIsValid,
    hasError: OrderDateHasError,
    valueChangeHandler: OrderDateChangeHandler,
    inputBlurHandler: OrderDateBlurHandler,
    setInputValue: setOrderDateValue,
    reset: resetOrderDate,
  } = useInputValidation(isNotEmpty);

  const {
    value: AgreeDatevalue,
    isValid: AgreeDateIsValid,
    hasError: AgreeDateHasError,
    valueChangeHandler: AgreeDateChangeHandler,
    inputBlurHandler: AgreeDateBlurHandler,
    setInputValue: setAgreeDateValue,
    reset: resetAgreeDate,
  } = useInputValidation(isNotEmpty);

  const {
    value: SiteHandOverDatevalue,
    isValid: SiteHandOverDateIsValid,
    hasError: SiteHandOverDateHasError,
    valueChangeHandler: SiteHandOverDateChangeHandler,
    inputBlurHandler: SiteHandOverDateBlurHandler,
    setInputValue: SiteHandOverDateValue,
    reset: resetSiteHandOverDate,
  } = useInputValidation(isNotEmpty);

  //const resetform = () =>
  //  {
  //   resetorderQuantity();
  //   resetPricePerUnit();
  //   resetLoaDate();
  //   resetOrderDate();
  //   resetAgreeDate();
  //   resetSiteHandOverDate();
  //   setFile();
  //   setFile1();
  //   setFile2();
  //};

  let formIsValid = false;

  if (
    orderQuantityIsValid &&
    PricePerUnitIsValid &&
    LoaDateIsValid &&
    OrderDateIsValid &&
    AgreeDateIsValid &&
    SiteHandOverDateIsValid
  ) {
    formIsValid = true;
  }

  var config = {
    onUploadProgress: function (progressEvent) {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setProgressCompleted(percentCompleted);
    },
  };

  var postData = (data) => {
    axios
      .post(`${baseUrl}/api/workorder/creation/Workorder`, data, config)
      .then((resp) => {
        if (resp.data.status === 200) {
          toastSuccess(resp.data.message);
          navigate("/tender/bidmanagement/list/main/workorder/" + id);
        } else if (resp.data.status === 400) {
          toastError(resp.data.message);
        }
        setDataSending(false);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        setDataSending(false);
      });
  };

  var setWorkOrderForm = (response) => {
    let data = response.data.WorkOrder[0];
    if (data !== undefined) {
      setworkid(data.id);
      setorderQuantityValue(data.orderquantity);
      setPricePerUnitValue(data.priceperunit);
      setLoaDateValue(data.loadate);
      setOrderDateValue(data.orderdate);
      setAgreeDateValue(data.agreedate);
      SiteHandOverDateValue(data.sitehandoverdate);
    }
  };

  //work order image data
  var getWorkOrderimageData = async () => {
    let response = await axios.get(
      `${baseUrl}/api/workorder/creation/Workorder/${id}`
    );
    if (response.status === 200) {
      setWorkOrderForm(response);
    }
  };

  useEffect(() => {
    if (id) {
      getWorkOrderimageData();
    }
  }, []);


  const setWorkOrderImage = (response) => {
    //response.data.name = wofilename;
    setFile(response.data);
  };

  var getWorkOrderImage = async () => {
    if(workid) {
      await axios({
        url: `${baseUrl}/api/download/workorderimage/${id}`,
        method: "GET",
        responseType: "blob", //important
      }).then((response) => {
        if (response.status === 200) {
          setWorkOrderImage(response);
        } else {
          alert("Unable to Process Now!");
        }
        setFetchLoading(false);
      }); 
    }
  };

  // useEffect(() => {
  //   if (id) {
  //     getWorkOrderImage();
  //   }
  // }, [workid]);


  //agreement image data

  const getWorkOrderImageData = async () => {
    if(workid) {
      await axios({
        url: `${baseUrl}/api/download/agreementimage/${id}`,
        method: "GET",
        responseType: "blob", // important
      }).then((response) => {
        if (response.status === 200) {
          setAgreementImage(response);
        } else {
          alert("Unable to Process Now!");
        }
        setFetchLoading(false);
      });
    }
  };

  // useEffect(() => {
  //   if (id) {
  //     getWorkOrderImageData();
  //   }
  // }, [workid]);

  const setAgreementImage = (response) => {
    //response.data.name = agfilename;
    setFile1(response.data);
  };

  // sitehandover image

  const setSitehandoverImage = (response) => {
    //response.data.name = shofilename;
    setFile2(response.data);
  };

  const getsitehandoverImageData = async () => {
    if(workid) {
      await axios({
        url: `${baseUrl}/api/download/sitehandoverimage/${id}`,
        method: "GET",
        responseType: "blob", // important
      }).then((response) => {
        if (response.status === 200) {
          setSitehandoverImage(response);
        } else {
          alert("Unable to Process Now!");
        }
        setFetchLoading(false);
      });
    }
  };

  useEffect(() => {
    if (id) {
      getsitehandoverImageData();
      getWorkOrderImage();
      getWorkOrderImageData();
    }
  }, [workid]);

  const putData = (data, workid) => {
    axios
      .post(
        `${baseUrl}/api/workorder/creation/Workorder/update/${workid}`,
        data,
        config
      )
      .then((ressp) => {
        if (ressp.data.status === 200) {
          toastSuccess(ressp.data.message);
        } else if (ressp.data.status === 400) {
          toastError(ressp.data.message);
        } else {
          toastError("Unable to update");
        }
        setDataSending(false);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        setDataSending(false);
      });
  };


  const submitHandler = (e) => {
    e.preventDefault();
    setDataSending(true);
    if (!formIsValid) {
      setDataSending(false);
      return;
    }

    const formdata = new FormData();

    let data = {
      orderQuantity: orderQuantityvalue,
      PricePerUnit: PricePerUnitvalue,
      LoaDate: LoaDatevalue,
      OrderDate: OrderDatevalue,
      AgreeDate: AgreeDatevalue,
      SiteHandOverDate: SiteHandOverDatevalue,
      tokenid: localStorage.getItem("token"),
      bidid: id,
      wofile: file,
      agfile: file1,
      shofile: file2,
    };

    if (file instanceof Blob) {
      data.wofile = new File([file], file.name);
    }

    if (file instanceof Blob) {
      data.agfile = new File([file1], file1.name);
    }

    if (file instanceof Blob) {
      data.shofile = new File([file2], file2.name);
    }

    for (var key in data) {
      formdata.append(key, data[key]);
    }

    if (workid === null) {
      postData(formdata);
    } else if (workid !== null) {
      putData(formdata, workid);
    }
  };


  return (
    <CollapseCard id={"WorkOrder"} title={"Work Order"}>
      <form onSubmit={submitHandler}>
        <div className="row align-items-center ">
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="date">Work Order Quantity</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="orderQuantity"
                  id="orderQuantity"
                  className="form-control"
                  value={orderQuantityvalue}
                  onChange={orderQuantityChangeHandler}
                  onBlur={orderQuantityBlurHandler}
                />
                {orderQuantityHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Work Order Quantity is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="refrence_no">
                  Price Per Unit Rs.(After Negotitation)
                </label>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="PricePerUnit"
                  id="PricePerUnit"
                  className="form-control"
                  value={PricePerUnitvalue}
                  onChange={PricePerUnitChangeHandler}
                  onBlur={PricePerUnitBlurHandler}
                />
                {PricePerUnitHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      Price Per Unit Rs.After Negotitation is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="from">LOA Date</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="date"
                  name="LoaDate"
                  id="LoaDate"
                  className="form-control"
                  value={LoaDatevalue}
                  onChange={LoaDateChangeHandler}
                  onBlur={LoaDateBlurHandler}
                />
                {LoaDateHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      LOA Date is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="to">Work Order Date</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="date"
                  name="OrderDate"
                  id="OrderDate"
                  className="form-control"
                  value={OrderDatevalue}
                  onChange={OrderDateChangeHandler}
                  onBlur={OrderDateBlurHandler}
                />
                {OrderDateHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      OrderDate is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label>Agreement Date</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="date"
                  name="AgreeDate"
                  id="AgreeDate"
                  className="form-control"
                  value={AgreeDatevalue}
                  onChange={AgreeDateChangeHandler}
                  onBlur={AgreeDateBlurHandler}
                />
                {AgreeDateHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      AgreeDate is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label htmlFor="refrence_no">Site Hand Over Date</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="date"
                  name="SiteHandOverDate"
                  id="SiteHandOverDate"
                  className="form-control"
                  value={SiteHandOverDatevalue}
                  onChange={SiteHandOverDateChangeHandler}
                  onBlur={SiteHandOverDateBlurHandler}
                />
                {SiteHandOverDateHasError && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-normal">
                      AgreeDate is invalid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row text-center">
            <div className="col-12"></div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label>Work Order Document Upload</label>
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
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">Upload File</div>
              <div className="col-lg-8">
                <WorkOrderUploadFile file={file} id={id} workid={workid}/>
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label>Agreement Document Upload</label>
              </div>
              <div className="col-lg-8">
                <div
                  className="dashed border-primary height_of_dropbox boderradius__dropbox d-flex flex-column align-items-center justify-content-center  drop-file-input bg-gray-200"
                  ref={wrapperRef}
                  onDragEnter={onDragEnter1}
                  onDragLeave={onDragLeave1}
                  onDrop={onDrop1}
                >
                  <p className="display-4 mb-0">
                    <i className="fas fa-cloud-upload-alt text-primary "></i>
                  </p>
                  {!dragover1 && (
                    <p className="mt-0">Drag & Drop an document or Click</p>
                  )}
                  {dragover1 && <p className="mt-0">Drop the document</p>}
                  <input
                    type="file"
                    value=""
                    className="h-100 w-100 position-absolute top-50 start-50 pointer "
                    onChange={onFileDrop1}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">Upload File</div>
              <div className="col-lg-8">
                <AgreemaneUploadFile file={file1} id={id} workid={workid}/>
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">
                <label>Site Hand Over Document Upload</label>
              </div>
              <div className="col-lg-8">
                <div
                  className="dashed border-primary height_of_dropbox boderradius__dropbox d-flex flex-column align-items-center justify-content-center  drop-file-input bg-gray-200"
                  ref={wrapperRef}
                  onDragEnter={onDragEnter2}
                  onDragLeave={onDragLeave2}
                  onDrop={onDrop2}
                >
                  <p className="display-4 mb-0">
                    <i className="fas fa-cloud-upload-alt text-primary "></i>
                  </p>
                  {!dragover2 && (
                    <p className="mt-0">Drag & Drop an document or Click</p>
                  )}
                  {dragover2 && <p className="mt-0">Drop the document</p>}
                  <input
                    type="file"
                    value=""
                    className="h-100 w-100 position-absolute top-50 start-50 pointer "
                    onChange={onFileDrop2}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4">
            <div className="row align-items-center font-weight-bold">
              <div className="col-lg-4 text-dark">Upload File</div>
              <div className="col-lg-8">
                <SiteHandOverUploadFile file={file2} id={id} workid={workid}/>
              </div>
            </div>
          </div>
        </div>
        <div className="row text-center">
          <div className="col-12">
            {workid ? (
              <button
                className="btn btn-primary"
                disabled={!formIsValid || dataSending || FetchLoading}
              >
                {dataSending && progress + "% Uploaded"}
                {!dataSending && "Edit"}
              </button>
            ) : (
              <button
                className="btn btn-primary"
                disabled={!formIsValid || dataSending || FetchLoading}
              >
                {dataSending && progress + "% Uploaded"}
                {!dataSending && "Submit"}
              </button>
            )}
          </div>
        </div>
      </form>
    </CollapseCard>
  );
};
export default WorkOrder;
