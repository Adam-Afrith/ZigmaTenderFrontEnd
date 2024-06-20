

import axios from "axios";
import AuthContext from "../../../storeAuth/auth-context";
import { isNotEmpty, isNotNull } from "../CommonFunctions/CommonFunctions";
import React, { useEffect, useContext, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import useInputValidation from "../../hooks/useInputValidation";
import Select from "react-select";
import { forEach } from "jszip";
import ViewExpense from "./ViewExpense";


const ReimbursementSublist = (props) => {
    const { server1: baseUrl } = useBaseUrl();
    const [data, sethata] = useState(props.onData);

    const [popup, setpopup] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [Ulblist, setUlblist] = useState();
    const [Col, setCol] = useState();
    const [getlist, setList] = useState('No data available in table');

    var DATA = '';
    useEffect(() => {

        // handleOpenPopup(props.onData.length);
        var staff_id =props?.onData
        
        GetDta(staff_id)


    }, [props?.onData]);


    const handlePopup = (expense_id) => {

        
        clearPopupData();
       
        setTimeout(() => {
          setpopup(expense_id);
          
        }, 200);
      

      
     
    };
    const clearPopupData = () => {
      setpopup({});
    };

    const GetDta = async (id) => {
        
        let data = {
            staff_id: id,
 }

        let response = await axios.post(`${baseUrl}/api/expensesapp/getsublist`, data)
        let listarr = generatepopArray(response);
    };

    
    const Transferdata = (event) => {
        // collect checked data
props.handleExpense(event);
        
        // console.log("checkedValues",checkedValues);
        
      };

    let details = '';
    const generatepopArray = async (response) => {
       
        let status = response.data.status;
        if(status==400){
            setList("No data available in table");
        }else{
            
            let list = [...response.data.list];
         
            if (list.length != '0') {
    
    
    
              
                details = list.map((item, index) => {
                    var inc=index + 1;

                    if(item.expense_amount==null){
                     var expense_amount=   "00.00";
                    }else{
                       var  expense_amount= item.expense_amount;
                    }
                    if(item.call_amount==null){
                       var call_amount= "00.00"
                    }else{
                       var call_amount= item.call_amount
                    }
                    return (
                        <tr key={index}>
                            <td className='popuptd'>{inc}</td>
                            <td className='popuptd'><input type="checkbox" name="ck[]" value={item.id} onChange={Transferdata} /></td>
                            <td className='popuptd'>{item.entry_date}</td>
                            <td className='popuptd'>{item.userName}</td>
                            <td className='popuptd'>{call_amount}</td>
                            <td className='popuptd'> {expense_amount }+{item.expense_no} </td>
                            <td className='popuptd' align="center"><i class="fas fa-money clr" onClick={() => handlePopup(item.id)}></i></td>
                            
                        </tr>
                    );
                });
    
                setList(details);
               
            }
        }
       
    }

    const handleClosePopup = () => {
        setIsOpen(false);
        setList(null);
    };

    return (
        <div>
             <ViewExpense onData={popup} />
            <table className='poptb'>
                <thead>
                    <tr>
                        <th className='popth' >#</th>
                        <th className='popth'>Check Status</th>
                        <th className='popth'>Entry Date</th>
                        <th className='popth'>Branch Name / Staff Name</th>
                        <th className='popth'>Call Amount</th>
                        <th className='popth'>Expense Amount</th>
                        <th className='popth'>View</th>

                    </tr>
                </thead>
                <tbody>
                    {getlist}
                </tbody>
            </table>
            {/* <button onClick={}>Save</button> */}
        </div>
    );
};

export default ReimbursementSublist;
