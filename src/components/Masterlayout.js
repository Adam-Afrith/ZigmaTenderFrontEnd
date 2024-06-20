import { Fragment, useContext, useEffect, useState } from "react";
import Contentwrapper from "./Contentwrapper";
import Pagewrapper from "./Pagewrapper";
import Logout from "./Logout";
import Sidebar from "./Sidebar";
import AuthContext from "../storeAuth/auth-context";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBaseUrl } from "./hooks/useBaseUrl";
import OnlineStatus from "./OnlineStatus";





function Masterlayout() {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(true)
  const { server1: baseUrl } = useBaseUrl();
  const navigate = useNavigate();  

  const validateToken = async () => {
    if(localStorage.getItem('token')){
      let data = {
        tokenid : localStorage.getItem('token')
      }

      const formdata = new FormData();

      for (var key in data) {
        formdata.append(key, data[key]);
      }
  
      axios.post(`${baseUrl}/api/validtetoken`, formdata).then((resp) => {
        if (resp.status === 200) {
          if(!resp.data.isValid){
            authCtx.logout()
            window.history.replaceState({},"login", "/");
            navigate('/')
          }
        }else{
          authCtx.logout()
          window.history.replaceState({},"login", "/");
          navigate('/')
        }
    
      }).catch((err) => {
        authCtx.logout()
        window.history.replaceState({},"login", "/");
        navigate(0)
        // navigate('/');
       
      });

      
    }
  }

  const getpermissions = async () => {
    if(localStorage.getItem('token')){
      let rolesAndPermission = await axios.post(`${baseUrl}/api/getrolesandpermision`, {
        tokenid : localStorage.getItem('token')
      })
      if(rolesAndPermission.status === 200){
        authCtx.rolesAndPermission(rolesAndPermission.data.role, rolesAndPermission.data.permission)
      }
      setLoading(false)
    }else{
      setLoading(false)
    }
  }
  


  useEffect( () => {
    getpermissions();
    validateToken();

    window.addEventListener('storage', validateToken)

    return () => {
      window.removeEventListener('storage', validateToken)
    }
  }, [])


    if(!localStorage.getItem('token')){
      return <Navigate to="/" />
    }


   return (
  	<Fragment>
     {/* <!-- Page Wrapper --> */}
      <OnlineStatus />

	   <div id="wrapper">
  
        <Sidebar/>
        <Contentwrapper loading={loading} />
        

    </div>

    {/* <!-- Scroll to Top Button--> */}
    <a className="scroll-to-top rounded" href="#page-top">
        <i className="fas fa-angle-up"></i>
    </a>
     {/* <!-- End of Page Wrapper --> */}

        <Logout/>
    </Fragment>
  );
}

export default Masterlayout;