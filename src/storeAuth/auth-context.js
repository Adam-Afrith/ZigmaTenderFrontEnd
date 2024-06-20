import axios from "axios";
import React, { useState } from "react";
import { useBaseUrl } from "../components/hooks/useBaseUrl";


const AuthContext = React.createContext({
  token: "",
  roles:[],
  permissions:[],
  isLoggedIn: false,
  login: (token, username, role, permission) => {},
  rolesAndPermission : (roles, permission) => {},
  logout: () => {},
  getpermissions : () => {},
});

let data = {
  tokenid : localStorage.getItem('token')
}

let initialRole = [] ;
let initialPermission =[] ;



export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token')
  const [token, setToken] = useState(initialToken); 
  const [role, setRole] = useState([]); 
  const [permission, setPermission] = useState({}); 
  const { server1: baseUrl } = useBaseUrl();

  const userIsLoggedIn = !!token;
  
  
  // const rP = async () => {

  //   if(localStorage.getItem('token')){
  //     let rolesAndPermission = await axios.post(`http://localhost:8000/api/getrolesandpermision`, data)
  //     if(rolesAndPermission.status === 200){
  //       setRole(rolesAndPermission.data.role);
  //       setPermission(rolesAndPermission.data.permission) 
  //     }
  //   }
  // }

  // rP()

  const loginHandler = (token, username, role, permission) => {
    setToken(token);
    setRole(role);
    setPermission(permission);
    localStorage.setItem('token', token)
    localStorage.setItem('userName', username)
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  };

  const rolesAndPermissionHandler = (role, permission) => {
    setRole(role);
    setPermission(permission);
  };

  const getpermissions = async () => {
    if(localStorage.getItem('token')){
      let rolesAndPermission = await axios.post(`${baseUrl}/api/getrolesandpermision`, {
        tokenid : localStorage.getItem('token')
      })
      if(rolesAndPermission.status === 200){
        rolesAndPermissionHandler(rolesAndPermission.data.role, rolesAndPermission.data.permission)
      }
    
    }else{
    
    }
  }

  const contextValue = {
    token               : token,
    isLoggedIn          : userIsLoggedIn,
    role                : role,
    permission          : permission,
    login               : loginHandler,
    logout              : logoutHandler,
    rolesAndPermission  : rolesAndPermissionHandler,
    getpermissions      : getpermissions
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;