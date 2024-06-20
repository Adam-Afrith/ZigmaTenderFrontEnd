import axios from "axios";
import { data } from "jquery";
import { useState,useEffect, Fragment } from "react";
import Swal from "sweetalert2";
const ULBMasterList = ()=>{
    const [loading, setLoading] = useState(true);
    const [ulblist, setUlblist] = useState([]);

    useEffect(() => {
        let isMounted = true;
        
        axios.get('http://192.168.1.25:8000/api/ulb').then(res=>{
           if(isMounted)
            {
                if(res.status === 200)
                {
                    setUlblist(res.data.ulb);
                    setLoading(false);                 
                }
            }
        });

        return () => {
            isMounted = false
        };

    },[]);

    

    if(loading)
    {
        return <h4 className="text-danger">Loading ULB Master List...</h4>;
    }
    else
    {
        var ulblist_HTML = 
        ulblist.map( (item,index) => {
            return (
            <Fragment>
                <tr key={item.id}>
                    <td  className="text-center">{index+1}</td>
                    <td className="pl-3">{item.ulb_name}</td>
                    <td className="pl-3">Tamilnadu</td>
                    <td className="text-center">{item.ulb_status}</td>                              
                    <td className="text-center"><button type="button" className="btn btn-outline-success btn-sm align-middle">Edit</button></td>
                    <td className="text-center"><button type="button" className="btn btn-outline-danger btn-sm">Delete</button></td>
                </tr>
                </Fragment>);
            });

        }



return(
<div className="container-fluid ml-n4 pt-3">
    <div className="card mr-n5 ">
    <table className="w-auto table-bordered table-hover">
        <thead className="text-center bg-primary text-light font-weight-bold">
        <tr>
            <td className="w-1 p-2">
                SNO
            </td>
            <td className="w-30">
                ULB NAME
            </td>
            <td width="w-25">
                   STATE
            </td>
            <td width="w-30">
                   DESCRIPTION 
            </td>

            <td width="w-14">
               EDIT
            </td>        
            <td width="w-14">
               DELETE
            </td>        
            </tr>
        </thead>
        <tbody>
            {ulblist_HTML}
        </tbody>
    </table>
    </div>
</div>

)
}
export default ULBMasterList;