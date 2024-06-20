import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { usePageTitle } from "../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";
import Select from "react-select";
import styles from "./UserCreation.module.css";
import ReadyToUpload from "./ReadyToupload";

const initialState = {
  userName: "",
  usertype: "",
  loginId: "",
  password: "",
  confirmPassword: "",
  mobile: "",
  email: "",
  activeStatus: "active",
};

const initialStateErr = {
  userName: "",
  usertype: "",
  loginId: "",
  password: "",
  confirmPassword: "",
  mobile: "",
  email: "",
  activeStatus: "",
};

const UserCreation = () => {
  usePageTitle("User Creation");
  // const { id } = useParams();
  const navigate = useNavigate();
  const { id } = useParams();

  const { server1: baseUrl } = useBaseUrl();
  const wrapperRef = useRef(null);
  const [file, setFile] = useState(null);

  const [dataSending, setDataSending] = useState(false);
  const [input, setInput] = useState(initialState);
  const [roleOptions, setRoleoptions] = useState([]);
  const [inputValidation, setInputValidation] = useState(initialStateErr);
  const [dragover, setdragover] = useState(false);

  useEffect(() => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    axios.post(`${baseUrl}/api/usertype/options`,data).then((response) => {
      if (response.data.status === 200) {
        generateOptions(response.data.userType);
      }
    });
  }, []);

  useEffect(() => {
    if (id) {
      let data = {
        tokenid : localStorage.getItem('token')
      }
      
      axios.get(`${baseUrl}/api/usercreation/${id}`).then((resp) => {
        console.log(resp);
        if (resp.data.status === 200) {
          let user = resp.data.user;
          setInput({
            usertype: user.userType,
            activeStatus: user.activeStatus,
            userName: user.userName,
            loginId: user.name,
            password: user.confirm_passsword,
            confirmPassword: user.confirm_passsword,
            mobile: user.mobile.toString(),
            email: user.email,
          });

          if (resp.data.user.filename) {
            axios({
              url: `${baseUrl}/api/download/userfile/${user.id}`,data,
              method: "POST",
              responseType: "blob", // important
            }).then((response) => {
              if (response.status === 200) {
                response.data.name = user.original_filename;
                setFile(response.data);
              }
              // setFetchLoading(false)
            });
          }
        }
      });
    }
  }, [id, baseUrl]);

  const generateOptions = (usertype = []) => {
    let roles = usertype
      .map((role, index) => {
        if (role.id !== 1) {
          return {
            value: role.id,
            label: role.name,
          };
        }
      })
      .filter((role) => role !== undefined);
    setRoleoptions(roles);
  };

  const isMobileValidation = (value) => {
    console.log(value);
    if (value === null) {
      return false;
    } else if (
      value.trim() === "" ||
      value === null ||
      !/^[6-9]\d{9}$/.test(value)
    ) {
      return false;
    }
    return true;
  };
  const isEmailValid = (value) => {
    if (
      value.trim() === "" ||
      value === null ||
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ) {
      return false;
    } else {
      return true;
    }
  };

  const inputHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "mobile") {
      setInputValidation({
        ...inputValidation,
        [e.target.name]: !isMobileValidation(e.target.value),
      });
      return;
    }

    if (e.target.name === "email") {
      setInputValidation({
        ...inputValidation,
        [e.target.name]: !isEmailValid(e.target.value),
      });
      return;
    }

    if (e.target.name === "confirmPassword") {
      if (input.password === "") {
        setInputValidation({
          ...inputValidation,
          [e.target.name]: "Enter Password First",
        });
        return;
      }

      if (input.password !== e.target.value) {
        setInputValidation({
          ...inputValidation,
          [e.target.name]: "Not match with password entered",
        });
        return;
      }
    }

    if (e.target.name === "password") {
      if (
        input.confirmPassword !== "" &&
        e.target.value !== input.confirmPassword
      ) {
        setInputValidation({
          ...inputValidation,
          confirmPassword: "Not match with password entered",
        });
      } else if (
        input.confirmPassword !== "" &&
        e.target.value === input.confirmPassword
      ) {
        setInputValidation({ ...inputValidation, confirmPassword: false });
      }
    }

    if (e.target.value === "") {
      setInputValidation((prev) => ({ ...prev, [e.target.name]: true }));
    } else {
      setInputValidation((prev) => ({ ...prev, [e.target.name]: false }));
    }
  };

  const inputHandlerForSelect = (value, action) => {
    // console.log("Value", value);
    // console.log("Action", action);

    setInput({
      ...input,
      [action.name]: value,
    });
    if ((value === "") | (value === null)) {
      setInputValidation({ ...inputValidation, [action.name]: true });
    } else {
      setInputValidation({ ...inputValidation, [action.name]: false });
    }
  };

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
    const newFile = e.target.files[0];

    let filetypes = newFile.type;

    if (newFile.size / (1000 * 1000) > 1) {
      alert("Maximum upload size limit (1 MB) reached");
      return;
    }

    if (filetypes.split("/")[0] === "image") {
      setFile(newFile);
    } else {
      alert("File format not suppoted.");
    }
  };

  let formIsValid = false;

  if (
    input.userName !== "" &&
    input.usertype !== null &&
    input.usertype !== "" &&
    input.loginId !== "" &&
    input.password !== "" &&
    input.confirmPassword !== "" &&
    isMobileValidation(input.mobile) &&
    isEmailValid(input.email) &&
    !inputValidation.confirmPassword &&
    file
  ) {
    formIsValid = true;
  }

  const postData = (data) => {
    axios
      .post(`${baseUrl}/api/usercreation`, data)
      .then((resp) => {
        if (resp.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "User Creation",
            text: resp.data.message,
            confirmButtonColor: "#5156ed",
          });

          navigate(`/tender/master/usercreation`);
        } else if (resp.data.status === 400) {
          Swal.fire({
            icon: "error",
            title: "User Creation",
            text: resp.data.errors,
            confirmButtonColor: "#5156ed",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "User Creation",
            text: "Provided Credentials are Incorrect",
            confirmButtonColor: "#5156ed",
          }).then(() => {
            localStorage.clear();
            navigate("/");
          });
        }
        setDataSending(false);
      })
      .catch((err) => {
        console.log("err", err.response.data.message);
        Swal.fire({
          icon: "error",
          title: "User Creation",
          text: err.response.data.message || err,
          confirmButtonColor: "#5156ed",
        });
        setDataSending(false);
      });
  };

  const putData = (data, id) => {
    axios
      .post(`${baseUrl}/api/usercreation/${id}?_method=PUT`, data)
      .then((resp) => {
        if (resp.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "User Creation",
            text: resp.data.message,
            confirmButtonColor: "#5156ed",
          });

          navigate(`/tender/master/usercreation`);
        } else if (resp.data.status === 400) {
          Swal.fire({
            icon: "error",
            title: "User Creation",
            text: resp.data.errors,
            confirmButtonColor: "#5156ed",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "User Creation",
            text: "Provided Credentials are Incorrect",
            confirmButtonColor: "#5156ed",
          });
          //   .then (()=>{
          //     localStorage.clear();
          //     navigate("/");
          //   });
        }
        setDataSending(false);
      })
      .catch((err) => {
        console.log("err", err.response.data.message);
        Swal.fire({
          icon: "error",
          title: "User Creation",
          text: err.response.data.message || err,
          confirmButtonColor: "#5156ed",
        });
        setDataSending(false);
      });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!formIsValid) {
      setDataSending(false);
      return;
    }

    let data = {
      userName: input.userName,
      userType: input.usertype.value,
      activeStatus: input.activeStatus,
      password: input.password,
      confirmPassword: input.confirmPassword,
      mobile: input.mobile,
      email: input.email,
      loginId: input.loginId,
      file: file,
      tokenId: localStorage.getItem("token"),
    };

    if (file instanceof Blob) {
      data.file = new File([file], file.name);
    }

    const formdata = new FormData();
    for (var key in data) {
      if (data[key] === null) {
        formdata.append(key, "");
        continue;
      }

      formdata.append(key, data[key]);
    }

    console.log(data);
    console.log(formdata);
    if (!id) {
      postData(formdata);
    } else {
      putData(formdata, id);
    }
  };

  const cancelHandler = () => {
    navigate(`/tender/master/usercreation`);
  };

  return (
    <Fragment>      
        <div className="card shadow mb-4 p-4">
          <form>
            <div className="row align-items-center">
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="userName" className="font-weight-bold">
                      User Name<span className="text-danger">&nbsp;*</span>{" "}
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      className="form-control"
                      id="userName"
                      name="userName"
                      value={input.userName}
                      onChange={inputHandler}
                    />

                    {inputValidation.userName && (
                      <div className="pt-1">
                        <span className="text-danger font-weight-bold">
                          Enter User Name
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="usertype" className="font-weight-bold">
                      User Type (Role)
                      <span className="text-danger">&nbsp;*</span>{" "}
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <Select
                      name="usertype"
                      id="usertype"
                      isSearchable="true"
                      isClearable="true"
                      options={roleOptions}
                      value={input.usertype}
                      onChange={inputHandlerForSelect}
                    ></Select>
                    {inputValidation.usertype && (
                      <div className="pt-1">
                        <span className="text-danger font-weight-bold">
                          Enter Valid Input..!
                        </span>
                      </div>
                    )}
                    {/* {inputValidation.usertype && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-bold">
                                                    Enter User Type
                                                </span>
                                            </div>
                                        )} */}
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="loginId" className="font-weight-bold">
                      Login ID<span className="text-danger">&nbsp;*</span>{" "}
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      className="form-control"
                      id="loginId"
                      name="loginId"
                      value={input.loginId}
                      onChange={inputHandler}
                    />

                    {inputValidation.loginId && (
                      <div className="pt-1">
                        <span className="text-danger font-weight-bold">
                          Enter Login ID
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="password" className="font-weight-bold">
                      Password<span className="text-danger">&nbsp;*</span>{" "}
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={input.password}
                      onChange={inputHandler}
                    />

                    {inputValidation.password && (
                      <div className="pt-1">
                        <span className="text-danger font-weight-bold">
                          Enter Password
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label
                      htmlFor="confirmPassword"
                      className="font-weight-bold"
                    >
                      Confirm Password
                      <span className="text-danger">&nbsp;*</span>{" "}
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={input.confirmPassword}
                      onChange={inputHandler}
                    />

                    {inputValidation.confirmPassword && (
                      <div className="pt-1">
                        <span className="text-danger font-weight-bold">
                          {inputValidation.confirmPassword}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="mobile" className="font-weight-bold">
                      Mobile no (+91)
                      <span className="text-danger">&nbsp;*</span>{" "}
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="number"
                      // type="text"
                      className="form-control"
                      id="mobile"
                      placeholder="Enter Mobile No"
                      name="mobile"
                      value={input.mobile}
                      onChange={(e) => {
                        inputHandler(e);
                      }}
                      maxLength={10}
                    />

                    {inputValidation.mobile && (
                      <div className="pt-1">
                        <span className="text-danger font-weight-bold">
                          Invaild
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="email" className="font-weight-bold">
                      Email Id<span className="text-danger">&nbsp;*</span>{" "}
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={input.email}
                      onChange={inputHandler}
                    />

                    {inputValidation.email && (
                      <div className="pt-1">
                        <span className="text-danger font-weight-bold">
                          Invaild
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-5 text-dark ">
                    <label htmlFor="activeStatus " className="font-weight-bold">
                      Active Status&nbsp;
                    </label>
                  </div>
                  <div className="col-lg-7">
                    <div className="form-check form-check-inline">
                      <label
                        className="form-check-label"
                        htmlFor="activeStatus_active"
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="activeStatus"
                          id="activeStatus_active"
                          checked={"active" === input.activeStatus}
                          value="active"
                          onChange={inputHandler}
                        />
                        Active
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <label
                        className="form-check-label"
                        htmlFor="activeStatus_inactive"
                      >
                        <input
                          className="form-check-input mx-3"
                          type="radio"
                          name="activeStatus"
                          id="activeStatus_inactive"
                          checked={"inactive" === input.activeStatus}
                          value="inactive"
                          onChange={inputHandler}
                        />
                        Inactive
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {file === null && (
                <div className="inputgroup col-lg-12 mb-4 p-0">
                  <div className="row col-lg-6">
                    <div className="col-lg-4 text-dark font-weight-bold">
                      <label htmlFor="image">
                        Image Upload :
                        <span className="text-danger">&nbsp;*</span>
                      </label>
                    </div>
                    <div className="col-lg-8">
                      <div
                        className={`border-primary d-flex flex-column align-items-center justify-content-center   bg-gray-200 ${styles.height_of_dropbox} ${styles.boderradius__dropbox} ${styles.dashed} ${styles.drop_file_input} `}
                        ref={wrapperRef}
                        onDragEnter={onDragEnter}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                      >
                        <p className="display-4 mb-0">
                          <i className="fas fa-cloud-upload-alt text-primary "></i>
                        </p>
                        {!dragover && (
                          <p className="mt-0">
                            Drag & Drop an document or Click
                          </p>
                        )}
                        {dragover && <p className="mt-0">Drop the document</p>}
                        <input
                          type="file"
                          value=""
                          name="image"
                          className="h-100 w-100 position-absolute top-50 start-50 pointer"
                          accept={`image/*`}
                          onChange={onFileDrop}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {file !== null && (
                <div className="inputgroup col-lg-12 mb-4">
                  <div className="row col-lg-6">
                    <div className="col-lg-4 text-dark font-weight-bold  p-0">
                      {file.lastModified && (
                        <label htmlFor="customername">(Ready To Upload)</label>
                      )}
                      {!file.lastModified && (
                        <label htmlFor="customername">
                          (Uploaded Doc/File)
                        </label>
                      )}
                    </div>
                    <div className="col-lg-8 pr-0">
                      <ReadyToUpload
                        file={file}
                        clearFile={() => setFile(null)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">&nbsp;</div>
                </div>
              )}
              <div className="inputgroup col-lg-12">
                <div className="row align-items-center">
                  <div className="col-lg-12 text-center ">
                    <button
                      className="btn btn-primary  mr-2"
                      disabled={!formIsValid}
                      onClick={submitHandler}
                    >
                      {dataSending && (
                        <span className="spinner-border spinner-border-sm mr-2"></span>
                      )}
                      {dataSending === true
                        ? id
                          ? "Updating..."
                          : "Submitting...."
                        : id
                        ? "Update"
                        : "Save"}
                    </button>
            
            
                    <button
                      className="btn btn-secondary"
                      onClick={cancelHandler}
                      disabled={dataSending}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      
    </Fragment>
  );
};

export default UserCreation;
