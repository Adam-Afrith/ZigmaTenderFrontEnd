import axios from "axios";
import React, { Fragment, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../storeAuth/auth-context";
import { useBaseUrl } from "./hooks/useBaseUrl";

function Logout() {

  const {server1: baseUrl} = useBaseUrl();

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {

    const data = {
      tokenid : localStorage.getItem('token') 
    }

    axios.post(`${baseUrl}/api/logout`, data).then((res) => {
      if (res.data.status === 200) {
        authCtx.logout()
        navigate('/')
      }else{
        alert("Unable to logout. Try again!")
      }
    });

    // optional: redirect the user
  };
  return (
    <Fragment>
      {/* Logout Modal*/}
      <div
        className="modal fade"
        id="logoutModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Ready to Leave?
              </h5>
              <button
                className="close"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              Select "Logout" below if you are ready to end your current
              session.
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                type="button"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={logoutHandler} data-dismiss="modal">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Logout;
