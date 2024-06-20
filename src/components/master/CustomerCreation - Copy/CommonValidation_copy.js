export const isMobileValidation = (value) => {
  //console.log("isMobileValidation", value===undefined? "Error": "No issue")
  // //console.log("Value",value);
  //   if (value === null) {
  //     return true; // $$$$ Modified
  //   }else if(
  //    value.trim() === "" ||
  //    value === null ||
  //     !/^[6-9][\d\-\s]{9,13}$/.test(
  //     value
  //   )){
  //     return true; // $$$$ Modified
  //   }
    return true;
}

export const isIFSCvalid = (value) => {
  //console.log("isIFSCvalid", value===undefined? "Error": "No issue")
  // if(!/^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/.test(value)){
  //     return true; // $$$$ Modified
  // }else{
  //     return true;
  // }
  return true;
}

export const isPincodeValid = (value) => {
  //console.log("isPincodeValid", value===undefined? "Error": "No issue")
    // if(!/^[1-9][0-9]{5}$/.test(value)){
    //     return true; // $$$$ Modified //
    // }else{
    //     return true;
    // }
    return true;
}

export const isEmailValid = (value) => {
  //console.log("isEmailValid", value===undefined? "Error": "No issue")
    // if (
    //     value.trim() === "" ||
    //     value === null ||
    //     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    //   ) {
    //     return true; // $$$$ Modified
    //   } else {
    //     return true ;
    //   }
    return true;
}

export const isPanValid = (value) => {
  //console.log("isPanValid", value===undefined? "Error": "No issue")
  
    // if (value!==undefined && (  value === null ||
    //     value.trim() === "" ||
       
    //     !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value))
    //   ) {
    //     return true; // $$$$ Modified
    //   } else {
    //     return true;
    //   }
    return true;
}

export const  isgstNoValid = (value) => {
  //console.log("isgstNoValid", value===undefined? "Error": "No issue")
  
    // if (
    //   value.trim() === "" ||
    //   value === null ||
    //   !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
    //     value
    //   )
    // ) {
    //   return true; // $$$$ Modified
    // } else {
    //   return true;
    // }
    return true;
}

export const isUrlValid = (value) => {
    // if(value.trim() === "" ||
    //     value === null ||
    //     !/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(value)){
    //     return true; // $$$$ Modified
    // }else{
    //     return true;
    // }
    return true;
}

