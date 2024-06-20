import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import AuthContext from "../../../storeAuth/auth-context";
import DataTable from '../../hooks/DataTable';


const DistrictMasterList = () => {  
  const { server1: baseUrl } = useBaseUrl();   
  const [response,setResponse] = useState([]);
  const [accessor,setAccessor] = useState([]);
  const [header,setHeader] = useState([]);
  const [title,setTitle] = useState('');
  const [count, setCount] = useState(0);
    

  let navigation = '/tender/master/districtmaster/districtcreation/';
  let deletion = (`${baseUrl}/api/district/`);

  useEffect(()=> {    
    let data = {tokenid : '6b17a5b1fe58f4b198ccf042a42421151678711068808' };      
    axios.post('http://192.168.1.71:8000/api/districtmastertable',data).then((res)=> {
        setResponse(res.data.data);   
        setAccessor(res.data.accessor);     
        setHeader(res.data.header);    
        setTitle(res.data.title);       
        console.log('res',res);      
    })  
  },[])

  const handleCount = (newCount) => {
    setCount(newCount);
    console.log('newCount',newCount);
  }

  return (
    <Fragment> 
       <DataTable 
          response={response}               
          accessor={accessor}   
          header={header}   
          getPermission={'Districts'}
          navigation={navigation}
          deletion={deletion}
          title={title}
          count={count}
          handleCount={handleCount}
        />
    </Fragment>
  );
};

export default DistrictMasterList;