import React from "react";
import Topbar from "./Topbar";
import Pagewrapper from "./Pagewrapper";
import Footer from "./Footer";
function Contentwrapper(props) {
  return (
      <div id="content-wrapper" className="d-flex flex-column"> 
        <div id="content">
             <Topbar/>
             <Pagewrapper loading={props.loading}/>
        </div> 
        <Footer/>                 
      </div>
  
  );
}

export default Contentwrapper;
