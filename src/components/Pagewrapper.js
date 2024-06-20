import React from "react";
import { useEffect, useContext } from "react";
import {  Outlet, useNavigate } from "react-router-dom";
import PreLoader from "./UI/PreLoader";
import { Provider } from "react-redux";
import dashboardStore from './store';
import SessionTimeout from "./SessionTimeout";
import axios from "axios";
import AuthContext from "../storeAuth/auth-context";
import { useBaseUrl } from "./hooks/useBaseUrl";


function Pagewrapper(props) {
  const navigate = useNavigate();
  const {server1: baseUrl} = useBaseUrl();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    window.addEventListener("sessionTimeout", handleSessionTimeout);

    return () => {
      window.removeEventListener("sessionTimeout", handleSessionTimeout);
    };
  }, []);

  const handleSessionTimeout = () => {
  
    console.log('Session expired. Logging out user...');
    
    const data = {
      tokenid : localStorage.getItem('token') 
    }

    axios.post(`${baseUrl}/api/logout`, data).then((res) => {
      if (res.data.status === 200) {
        navigate('/')
        authCtx.logout()
      }else{
        alert("Unable to logout. Try again!")
      }
    });

    // localStorage.clear();

    // navigate('/');
  };

  return (
    
   
    <Provider store={dashboardStore}>
      {/* <SessionTimeout timeoutInSeconds={10} onTimeout={handleSessionTimeout} /> */}
      <SessionTimeout timeoutInSeconds={3600} onTimeout={() => window.dispatchEvent(new Event("sessionTimeout"))} />

      {/* 300 seconds ==> 15 mins */}
      {/***1800 Seconds => 30 Mins***/}
      
    <div className="container-fluid"> 
      {!props.loading && <Outlet />}
    </div>
   </Provider>
  );
}

export default Pagewrapper;
