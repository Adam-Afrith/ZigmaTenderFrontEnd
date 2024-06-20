import axios from "axios";
import { Fragment,  useContext,  useEffect, useState } from "react";
import { useBaseUrl } from "../../../hooks/useBaseUrl";
import DataTable from '../../../hooks/DataTable';




const BusinessForecastList = () => {
  const { server1: baseUrl } = useBaseUrl();    
  const [response,setResponse] = useState([]);
  const [accessor,setAccessor] = useState([]);
  const [header,setHeader] = useState([]);
  const [title,setTitle] = useState('');
  const [count, setCount] = useState(0);

  let navigation = '/tender/master/businessforecastmaster/edit/';
  let deletion = (`${baseUrl}/api/bizzforecast/`)
  
  useEffect(()=> {    
    let data = {tokenid: '3f29b9a02f3649491f01c5bd3bc144e91686027897535'};     
    axios.post('http://192.168.1.68:8000/api/bizzforecasttable',data).then((res)=> {
        setResponse(res.data.data);   
        setAccessor(res.data.accessor);     
        setHeader(res.data.header);         
        setTitle(res.data.title);  
        // console.log('res+++',res);                
    })      
  },[count])

  const handleCount = (newCount) => {
    setCount(newCount);
    console.log('newCount',newCount);
  }

  console.log('response',response)
  return (
    <Fragment>
        <DataTable 
          response={response}               
          accessor={accessor}   
          header={header}   
          getPermission={"BusinessForecast"}
          navigation={navigation}
          deletion={deletion}
          title={title}
          count={count}
          handleCount={handleCount}
        />
    </Fragment>
  );
};

export default BusinessForecastList;