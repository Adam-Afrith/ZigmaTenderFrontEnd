import { useState, useReducer, useEffect, useContext, Fragment } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./login.css";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import AuthContext from "../../storeAuth/auth-context";
import { useBaseUrl } from "../hooks/useBaseUrl";
import OnlineStatus from "../OnlineStatus";
import { motion } from "framer-motion";


const userNameReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 0 };
  }
  if (action.type === "USER_INPUT_SUBMIT") {
    return { value: "", isValid: null };
  }

  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 0 };
  }
  if (action.type === "USER_INPUT_SUBMIT") {
    return { value: "", isValid: null };
  }

  return { value: "", isValid: false };
};

const userToken = localStorage.getItem("token");

function Login() {
  const { server1: baseUrl } = useBaseUrl();
  const [isDatasending, setdatasending] = useState(false);

  // useDocumentTitle("Login | Zigma tenders");
  const navigate = useNavigate();

  const [loginFormValid, setloginFormValid] = useState(false);
  const [error, setError] = useState("");

  const [userNameState, dispatchUserName] = useReducer(userNameReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const authCtx = useContext(AuthContext);

  const { isValid: userNameIsValid } = userNameState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    setloginFormValid(userNameIsValid && passwordIsValid);
  }, [userNameIsValid, passwordIsValid]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/tender", { replace: true });
    }
  }, [navigate]);

  const usernameHandler = (e) => {
    dispatchUserName({ type: "USER_INPUT", val: e.target.value });
    setError("");
  };

  const passwordHandler = (e) => {
    dispatchPassword({ type: "USER_INPUT", val: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setdatasending(true);

    const loginData = {
      name: userNameState.value,
      password: passwordState.value,
    };

    let url = `${baseUrl}/api/login1`;

    // let result = await fetch(url, {
    //   method: 'POST',
    //   body: JSON.stringify(loginData),
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //   },
    // })

    // result = await result.json();
    // console.log(result)

    fetch(url, {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication failed!";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data);
        if (data.logStatus === "success") {
          const {tokenId, role, permission} = data
          authCtx.login(tokenId, userNameState.value, role, permission);
          navigate("/tender", { replace: true });
          // navigate(0)
          setError("");
          return;
        } else if (data.logStatus === "error") {
          setError(data.msg);
          setdatasending(false);
        }
      })
      .catch((err) => {
        alert(err.message);
        setdatasending(false);
      });

    // dispatchUserName({ type: 'USER_INPUT_SUBMIT' })
    // dispatchPassword({ type: 'USER_INPUT_SUBMIT' })
  };

  return (
    <Fragment>
      <OnlineStatus />
      {!userToken && (
        <div className="Login" id='Login'>
          <div className="bg-gradient-primary login_Bg">
            <div className="box">
            <div className="truck"></div>
            <div className="truck1"></div>
            </div>            
            <div className='login_img' >
              <div className="container">
                {/* Outer Row */}
                <div className="row justify-content-center">
                  <div className="col-xl-10 col-lg-12 col-md-9">
                    {/* Nested Row within Card Body */}
                    <div className="row">
                      <div className="col-lg-6 alignment py-3  px-0 mt-2">
                        {/* <center> */}
                          <div className="new-box">
                            <img
                              className="login_logo"
                              src="/assets/icons/logo-zigma.png"
                              alt="..."                          
                            />
                            </div>
                        {/* </center> */}
                      </div> 
                      <div className="col-lg-6 get-flex-center">
                        <div className="card o-hidden border-0 my-5">
                          <div className="card-body" 
                           >
                            {/* <div className="p-5"> */}
                              <div className="text-center">
                                <h1 className="h4 text-gray-900 mb-4">Login</h1>
                              </div>
                              <form className="user">
                                <div className="form-group" >                                  
                                  <input
                                    type="text"
                                    className="form-control form-control-user"
                                    id="exampleInputEmail"
                                    aria-describedby="emailHelp"
                                    // placeholder="Enter Email Address..."
                                    onChange={usernameHandler}
                                    value={userNameState.value}
                                    required= 'required'
                                  />
                                  <label className="email label">
                                    <span>E</span>
                                    <span>m</span>
                                    <span>a</span>
                                    <span>i</span>
                                    <span>l</span>
                                  </label>
                                  {userNameIsValid === false && (
                                    <p className="pl-3 mt-1 text-danger">
                                      Invalid Username
                                    </p>
                                  )}
                                </div>
                                <div className="form-group" >                                  
                                  <input
                                    type="password"
                                    className="form-control form-control-user"
                                    id="exampleInputPassword"
                                    // placeholder="Password"
                                    onChange={passwordHandler}
                                    value={passwordState.value}
                                    required= 'required'
                                  />
                                  <label  className="pass label">
                                    <span>P</span>
                                    <span>a</span>
                                    <span>s</span>
                                    <span>s</span>
                                    <span>w</span>
                                    <span>o</span>
                                    <span>r</span>
                                    <span>d</span>
                                  </label>
                                  {passwordIsValid === false && (
                                    <p className="pl-3 mt-1 text-danger">
                                      Invalid Password
                                    </p>
                                  )}
                                </div>
                                {/* <div className="form-group" >
                                  <div className="custom-control custom-checkbox small">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      id="customCheck"
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="customCheck"
                                    >
                                      Remember Me
                                    </label>
                                  </div>
                                </div> */}

                                <button 
                                  className="btn login-btn"
                                  onClick={handleLogin}
                                  disabled={!loginFormValid || isDatasending}                                  
                                >
                                  <div className='dfx'>
                                                                      
                                    <div className="abso">                                                                                                    
                                      {isDatasending ? (<i className="fas fa-gavel hammer"></i>) : (<i className="fas fa-gavel"></i>)}
                                    </div>

                                    <div>
                                    {isDatasending && (
                                      <>                                                                              
                                      <span className="spinner-border spinner-border-sm mr-2"></span>                                      
                                      </>
                                    )}
                                    {isDatasending && "Logging in..."}
                                    {!isDatasending && "Login"}
                                    </div>
                                  </div>
                                  
                                </button>
                                <p className=" mt-3 text-danger text-center">
                                  <span>{error}</span>
                                </p>
                              </form>
                            {/* </div> */}
                          </div>  
                        </div>    
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Login;
