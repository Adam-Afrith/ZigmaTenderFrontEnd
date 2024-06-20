import { useEffect } from "react";

const useGetLocation = (id, name) => {
   useEffect(() => {
    if(name=='country')
    {
        return "Country";
    }
    else if(name=='state')
    {
        return "State";
    }
    else if(name=='district')
    {
        return "district";
    }
    else if(name=='city')
    {
        return "City";
    }
  },[id,name]);
};

export {useGetLocation};