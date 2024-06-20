import { useEffect } from "react";

const usePageTitle = (title) => {
   useEffect(() => {
    document.title = title; 
    document.getElementById("pageTitle").innerHTML = title; 
  },[title]);
};

export {usePageTitle};