import React, { useEffect, useState, useContext, Fragment } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from "../storeAuth/auth-context";
import { useBaseUrl } from "./hooks/useBaseUrl";
import axios from "axios";

function Sidebar() {
  const [active, setActive] = useState("");
  const { server1: baseUrl } = useBaseUrl();
  const [menus, setMenu] = useState([])
  const [menushasPermission, setMenuHasPermission] = useState([])

  const pathName = "tender";

  const {permission} = useContext(AuthContext)
  const hideSidebarElement = (menuId, tab) => {
    document.getElementById(menuId).click();
    setActive(tab);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "js/sb-admin-2.min.js";
    document.body.appendChild(script);
    return () => {
      // clean up the script when the component in unmounted
      document.body.removeChild(script);
    };
  }, []);


  useEffect(() => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    axios.post(`${baseUrl}/api/menus`,data).then((response) => {
      setMenu(response.data.menuList || [])
    });
  }, [])

  useEffect(() => {

    if(menus && permission)
    {
   
    let permittedMenuList =[]; // get the menus list which has minunimum of one submenus
    
    menus.map((element)=>{
      let menuHasSubmenu = []; // get the submenus for menus who's submenus has minimum of one permission(add, edit,view, delete)
      element.sub_menus.map((submenu)=>{
        if(!!(permission?.[submenu.name]?.can_view) ||  !!(permission?.[submenu.name]?.can_add) || !!(permission?.[submenu.name]?.can_edit) || !!(permission?.[submenu.name]?.can_delete))
        {
          menuHasSubmenu.push(submenu.name);
        }
      })
      permittedMenuList[element.name]=menuHasSubmenu;
    })
    setMenuHasPermission(permittedMenuList);
  }
  }, [menus,permission])

    
  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion SideNav"
      id="accordionSidebar"
    >
      {/* Sidebar - Brand */}
      <span     
        // to="/"
        className="sidebar-brand d-flex align-items-center justify-content-center brand"
      >
        <div className="sidebar-brand-icon">
          <img
            src="assets/icons/logo.png"
            width="70"
            height="70"
            className="icon"
            alt="..."
          />
        </div>
        <div className="sidebar-brand-text mx-3">Zigma</div>
      </span>
      {/* Divider */}
      <hr className="sidebar-divider my-0" />
      {/* Nav Item - Dashboard */}
      <li className="nav-item">
        <Link className="nav-link" to="/tender">
          {/*<i className="fas fa-fw fa-tachometer-alt" />*/}
          <i className="fa fa-laptop"></i>
          <span className="font-weight-bold ml-1">Dashboard</span>
        </Link>
      </li>
     
     
      {menus.map((item,index) => {
       if(menushasPermission[item.name]?.length > 0) 
       {
       return (
        
        <Fragment key={index}>
        
        <hr className="sidebar-divider my-0" />
        <li className="nav-item ">
          
        <Link
        className="nav-link collapsed"
        to="#"
        data-toggle="collapse"
        data-target={`#collapse${item.name}Menu`}
        aria-expanded="true"
        aria-controls={`collapse${item.name}Menu`}
        id={`${item.name}Menu`}
        >
         <i className={item.icoClass}></i>
         <span>{item.aliasName}</span> 
        </Link>
        <div
          id={`collapse${item.name}Menu`}
          className="collapse"
          data-parent="#accordionSidebar"
        >
        <div className="bg-white py-2 collapse-inner rounded">  
            {item.sub_menus.map((subMenu, i)=> {
              if(menushasPermission[item.name]?.includes(subMenu.name)) 
              {
              return(
        
              <NavLink
                key={index+""+i}
                className={`collapse-item ${({ isActive }) => isActive ? "active" : undefined}`}
                to={subMenu.menuLink}
                onClick={() => hideSidebarElement(`${item.name}Menu`)}
              >
               {subMenu.aliasName}   
              </NavLink>
              )
              }
            }) }
        </div>

        </div>
        </li>
      </Fragment> )
       }
      })}

      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle"></button>
      </div>
    </ul>
  );
}

export default Sidebar;
