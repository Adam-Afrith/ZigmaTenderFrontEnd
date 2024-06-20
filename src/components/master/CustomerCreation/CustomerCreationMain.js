import { Fragment, useState } from "react";
import { NavLink } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import './customerCreationMain.css'
import {  Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import custStore from "./store";

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";



const CustomerCreationMain = () => {
  usePageTitle("Customer Creation");
  
  const[CustCreateMainId, setCustomerCreationMainID] = useState(0)

  const setCustomerMainId = (id) => {
    setCustomerCreationMainID(id)
  }

  const toastSuccess = (text) => {
    toast.success( text , {
      position: toast.POSITION.TOP_CENTER
    });
  }

  const toastError = (text) => {
    toast.error( text , {
      position: toast.POSITION.TOP_CENTER
    });
  }

  return (
    <Provider store={custStore}>
    <Fragment>
      <ToastContainer />
      <div className="CustomerCreationMain">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-lg-12">
              <div className="card shadow mb-3">
                <div className="card-body" style={{padding: '10px 0 0'}}>
                  <div>
                    <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
                      <li className="nav-item">
                        <NavLink
                          className="nav-link"
                          id="profile-tab"
                          data-toggle="tab"
                          to={(CustCreateMainId===0) ? "profile" : `profile/${CustCreateMainId}`}
                          role="tab"
                          aria-controls="profile"
                          aria-selected="true"
                        >
                          <i className='far fa-user'></i>
                          <span>Profile</span>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          className="nav-link"
                          id="contactPerson-tab"
                          data-toggle="tab"
                          to={(CustCreateMainId===0) ? "contactPerson" : `contactPerson/${CustCreateMainId}`}
                          // to="contactPerson"
                          role="tab"
                          aria-controls="contactPerson"
                          aria-selected="false"
                        >
                          
                          <i className='far fa-id-card'></i>
                          <span>Contact Person</span>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          className="nav-link"
                          id="SWMProjectStatus-tab"
                          data-toggle="tab"
                          to={(CustCreateMainId===0) ? "swmprojectstatus" : `swmprojectstatus/${CustCreateMainId}`}
                          // to="swmprojectstatus"
                          role="tab"
                          aria-controls="SWMProjectStatus"
                          aria-selected="false"
                        >
                          <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
                          <span>SWM Project Status</span>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          className="nav-link"
                          id="ulbdetails-tab"
                          data-toggle="tab"
                          to={(CustCreateMainId===0) ? "ulbdetails" : `ulbdetails/${CustCreateMainId}`}
                          // to="ulbdetails"
                          role="tab"
                          aria-controls="ulbdetails"
                          aria-selected="false"
                        >	
                        <i className='far fa-check-circle'></i>
                        <span>ULB Details</span>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          className="nav-link"
                          id="Bankdetails-tab"
                          data-toggle="tab"
                          to={(CustCreateMainId===0) ? "bankdetails" : `bankdetails/${CustCreateMainId}`}
                          // to="bankdetails"
                          role="tab"
                          aria-controls="Bankdetails"
                          aria-selected="false"
                        >	
                        <i className='fas fa-landmark'></i>
                        <span>Bank Details</span>
                        </NavLink>
                      </li>
                      
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card shadow mb-4">
                <div className="card-body">
                  <div className="formContent">
                    <div className="tab-content" id="myTabContent">
                      <div
                        className="tab-pane fade show active card-body tabContent"
                        id="home"
                        role="tabpanel"
                        aria-labelledby="home-tab"
                      >
                        <Outlet context={[toastSuccess, toastError, setCustomerCreationMainID, CustCreateMainId ]}/>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
    </Provider>
  );
};

export default CustomerCreationMain;
