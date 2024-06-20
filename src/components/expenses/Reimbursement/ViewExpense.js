
import Popup from './Popup';
import axios from "axios";
import './SubTable.css';

import AuthContext from "../../../storeAuth/auth-context";


import { isNotEmpty, isNotNull } from "../CommonFunctions/CommonFunctions";





import React,{ useEffect, useContext, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";

import { useBaseUrl } from "../../hooks/useBaseUrl";
import useInputValidation from "../../hooks/useInputValidation";

import Select from "react-select";



const ViewExpense = (props) => {
  const { server1: baseUrl } = useBaseUrl();
  const [data, sethata] = useState(props.onData);

  
  const [isOpen, setIsOpen] = useState(false);
  const [Ulblist, setUlblist] = useState();
 
  const [getcall, setcall] = useState(null);
  const [getother, setother] = useState(null);

  const [StafName, setStafName] = useState();
  const [EntryDate,setEntryDate] = useState();
  const [TotalAmount,setTotalAmount] = useState();
 
  var DATA='';
useEffect(() => {
  console.log("props.onData",props.onData);
  if((props.onData!='0')&&(!isNaN(props.onData))&&(props.onData!='')){
    handleOpenPopup(props.onData);
  }
  
  
}, [props.onData]);



 const handleOpenPopup = async (PopupFor) => {
 
  
    if((PopupFor!='0')&&(!isNaN(PopupFor))){
     
      setIsOpen(true);
     
let data = {
  id :PopupFor,
}


setUlblist(props.onData.customersubcategory);
  let response = await axios.post(`${baseUrl}/api/expensesapp/popupsub`, data)
  
  let listarr =  generatepopArray(response);
 


    }
   
  };

  let details='';
  
  let details2='';
  let details3='';
  const generatepopArray = async (response) => {
    


//     let list = [...response.data.calldel];
   
//     console.log('list.length>0',list.length);
// if(list.length!='0'){
  

		
//     console.log('resplistonce',list);
//     details = list.map((item, index) => {
//     return (
//         <tr key={index}>
//           <td className='popuptd'>{index + 1}</td>
//           <td className='popuptd'>{item.customer_category}</td>
//           <td className='popuptd'>{item.customer_name}</td>
//           <td className='popuptd'>{item.state_name}</td>
//           <td className='popuptd'>{item.district_name}</td>
//           <td className='popuptd'>{item.city_name}</td>
//           <td className='popuptd'>{item.population2011}</td>
//         </tr>
//     );
//   });
  
//   setcall(details);
  
//   console.log('listarr',details);
// }else{
//   setcall("No Data's");
  
// }

let list2 = [...response.data.other_exp];
if(list2.length!='0'){
 
  details2 = list2.map((item, index) => {
    return (
        <tr key={index}>
          <td className='popuptd'>{index + 1}</td>
          <td className='popuptd'>{item.expenseType}</td>
          <td className='popuptd'></td>
          <td className='popuptd'>{item.other_amount}</td>
         
        </tr>
    );
  });
  setother(details2);
}else{
  setother("No Data's");
}
let list3 = [...response.data.staff];
if(list3.length!='0'){

  details3 = list3.map((item, index) => {
   
    setStafName(item.userName);
    setEntryDate(item.entry_date);
    setTotalAmount(item.total_amount);
  });
 
}else{
  setother("No Data's");
}


}

  const handleClosePopup = () => {
    setIsOpen(false);
    setcall(null);
    setother(null);
  };

  console.log('StafName',StafName);
  
  return (
    <div className='ViewExpense'>
     
      {isOpen && (
        <Popup title={<span style={{color: 'blue'}}>Expense Details</span>} onClose={handleClosePopup} id='fcus'>
          <div className='exp-details'>
              <div>
                <strong>Staff Name:</strong>
                <span>{StafName}</span>
              </div>
              <div>
                <strong>Entry Date:</strong>
                <span>{EntryDate}</span>
              </div>
              <div>
                <strong>Total Amount:</strong>
                <span>{TotalAmount}</span>
              </div>
          </div>
          <p>
            
  {/* <span style={{color: 'black', marginRight: '5px'}}><strong>Staff Name:</strong></span>
  <span style={{color: 'black', marginRight: '250px'}}>{StafName}</span>
  <span style={{color: 'black', marginRight: '5px'}}><strong>Entry Date:</strong></span>
  <span style={{color: 'black', marginRight: '100px'}}>{EntryDate}</span>
  <span style={{color: 'black', marginRight: '5px'}}><strong>Total Amount:</strong></span>
  <span style={{color: 'black'}}>{TotalAmount}</span> */}
            

            
             </p>
             <div>

<p>
<span style={{color: '#3f6ad8',fontSize: '20px'}}><strong>Call Details</strong></span>


</p>

      <div className='table-responsive'>     
        <table className='poptb'>
          <thead>
            <tr>
              <th className='popth' >#</th>
              <th className='popth'>Call-ID</th>
              <th className='popth'>Travel Expense No</th>
              <th className='popth'>Pre Booked</th>
              
            
            </tr>
          </thead>
          <tbody>
{getcall}
          </tbody>
        </table>
      </div>
       </div>
       <div>

<p>
<span style={{color: '#3f6ad8',fontSize: '20px'}}><strong>Other Details</strong></span>


</p>

           <div className='table-responsive'>
        <table className='poptb'>
          <thead>
            <tr>
              <th className='popth' >#</th>
              <th className='popth'>Expense Type</th>
              <th className='popth'>Image View</th>
              <th className='popth'>Amount</th>
              
            
            </tr>
          </thead>
          <tbody>
{getother}
          </tbody>
        </table>
        </div> 
       </div>
       
        </Popup>
      )}
    </div>
  );
};

export default ViewExpense;
