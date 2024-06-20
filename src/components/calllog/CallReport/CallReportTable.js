import axios from "axios";
import React, { useState, useMemo, useEffect, useRef, Fragment } from "react";

import { useBaseUrl } from "../../hooks/useBaseUrl";
import UseExport from "../../hooks/useExport";
import DataTable from "../../hooks/DataTable";

// const data = [
//     { call_no: 'John', customer_name: 25, call_type: 'John', status: 25, next_follow_up_date: 'John', started: 25, finished: 25 },
//     { call_no: 'david', customer_name: 25, call_type: 'John', status: 25, next_follow_up_date: 'David', started: 25, finished: 25, },
//     // Add more data objects as needed
//   ];

const CallReportTable = ({change}) => {
    const { server1: baseUrl } = useBaseUrl();    
    const [response,setResponse] = useState([]);
    const [accessor,setAccessor] = useState([]);
    const [header,setHeader] = useState([]);
    const [title,setTitle] = useState('');
    const [count, setCount] = useState(0);

    useEffect(()=> {
        let data = {
           tokenid : localStorage.getItem('token'),
            ...change
          };          
        axios.post(`${baseUrl}/api/getdaywisereport/list`,data).then((res)=> { 
            setResponse(res.data.data);   
            setAccessor(res.data.accessor);     
            setHeader(res.data.header);         
            setTitle(res.data.title);     
        })
    },[count, change]);

    const handleCount = (newCount) => {
        setCount(newCount);
      }


    return (    
       <Fragment>        
            <DataTable 
                response={response}               
                accessor={accessor}   
                header={header}   
                getPermission={""}
                // navigation={navigation}
                // deletion={deletion}
                title={title}
                count={count}
                handleCount={handleCount}
            />
        </Fragment>
    );
};


export default CallReportTable;
