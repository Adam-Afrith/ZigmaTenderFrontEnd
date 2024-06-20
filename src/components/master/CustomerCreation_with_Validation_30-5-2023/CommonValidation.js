export const isMobileValidation = (value) => {
    if (value === null) {
      return false;
    }else if(
     value.trim() === "" ||
     value === null ||
      !/^[6-9]\d{9}$/.test(
      value
    )){
      return false;
    }
    return true;
}
export const phoneValidation = (value) => { 
if(
    !/^(0|[6-9])\d{9,12}$/.test(
    value
  )){
    return false;
  }
  return true;
}

export const isIFSCvalid = (value) => {
  if(!/^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/.test(value)){
      return false;
  }else{
      return true;
  }
}

export const isPincodeValid = (value) => {
    if(!/^[1-9][0-9]{5}$/.test(value)){
        return false;
    }else{
        return true;
    }
}

export const isEmailValid = (value) => {
    if (
        value.trim() === "" ||
        value === null ||
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
      ) {
        return false ;
      } else {
        return true ;
      }
}

export const isPanValid = (value) => {
    if (
        value.trim() === "" ||
        value === null ||
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)
      ) {
        return false ;
      } else {
        return true;
      }
}

export const  isgstNoValid = (value) => {

    if (
      value.trim() === "" ||
      value === null ||
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        value
      )
    ) {
      return false ;
    } else {
      return true;
    }
}

export const isUrlValid = (value) => {
    if(value.trim() === "" ||
        value === null ||
        !/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(value)){
        return false;
    }else{
        return true;
    }
}

