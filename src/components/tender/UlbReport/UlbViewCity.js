
import Popup from './Popup';
import axios from "axios";
import './UlbTable.css';

import AuthContext from "../../../storeAuth/auth-context";


import { isNotEmpty, isNotNull } from "../CommonFunctions/CommonFunctions";





import React,{ useEffect, useContext, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";

import { useBaseUrl } from "../../hooks/useBaseUrl";
import useInputValidation from "../../hooks/useInputValidation";

import Select from "react-select";
import UlbReport from './UlbReport';


const UlbViewCity = (props) => {
  const { server1: baseUrl } = useBaseUrl();
  const [data, sethata] = useState(props.onData);

  
  const [isOpen, setIsOpen] = useState(false);
  const [Ulblist, setUlblist] = useState();
  const [Col, setCol] = useState();
  const [getlist, setList] = useState(null);

  var DATA='';
useEffect(() => {
 
  handleOpenPopup(props.onData.length);
  console.log(props.onData.length);
}, [props.onData]);



 const handleOpenPopup = async (PopupFor) => {

   console.log('PopupFor',PopupFor);
    if((PopupFor!='0')&&(isNaN(PopupFor))){
     
      

let popvalue=props.onData.popup;
const ResultFor = popvalue?.join();
console.log('result',ResultFor);
let ulblists=''
if(ResultFor=='customer'){
ulblists='City List';
}
else if (ResultFor=='m20'){
  ulblists='> 20 Lakh';
}

else if (ResultFor=='b10_20'){
  ulblists='10 - 20 Lakh';
}

else if (ResultFor=='b_5_10'){
  ulblists='5 - 10 Lakh';
}

else if (ResultFor=='b_3_5'){
  ulblists='3 - 5 Lakh';
}

else if (ResultFor=='b_1_3'){
  ulblists='1 - 3 Lakh';
}

else if (ResultFor=='b_1'){
  ulblists='< 1 Lakh';
}
console.log('ulblists',ulblists);


let data = {
  ULBnames : props.onData.customersubcategory,
  POPUP : ulblists,
  filter_state: props.onData.filter_state,
  filter_cat: props.onData.filter_cat,
  filter_group: props.onData.filter_group,
}
if(data?.POPUP){
  setCol(ulblists);
setUlblist(props.onData.customersubcategory);
  let response = await axios.post(`${baseUrl}/api/ulbreport/populb`, data)
  let listarr =  generatepopArray(response);
  
}




    
    console.log('popfor',ResultFor);
    console.log('Ulb',props.onData.customersubcategory);
    
    setIsOpen(true);
    }
   
  };

  let details='';
  const generatepopArray = async (response) => {
    console.log('responce',response);
    let list = [...response.data.UlbPopup];
    console.log('list.length>0',list.length);
if(list.length!='0'){
  

		
    console.log('resplistonce',list);
    details = list.map((item, index) => {
    return (
        <tr key={index}>
          <td className='popuptd'>{index + 1}</td>
          <td className='popuptd'>{item.customer_category}</td>
          <td className='popuptd'>{item.customer_name}</td>
          <td className='popuptd'>{item.state_name}</td>
          <td className='popuptd'>{item.district_name}</td>
          <td className='popuptd'>{item.city_name}</td>
          <td className='popuptd'>{item.population2011}</td>
        </tr>
    );
  });

  setList(details);
  console.log('listarr',details);
}
}

  const handleClosePopup = () => {
    setIsOpen(false);
    setList(null);
  };

  return (
    <div>
     
      {isOpen && (
        <Popup title={<span style={{color: 'blue'}}>Population Details</span>} onClose={handleClosePopup} id='fcus'>
          <p>{<span style={{color: 'blue'}}>{Ulblist}</span>}    {<span style={{color: 'blue'}}>:</span>}       {<span style={{color: 'blue'}}>{Col}</span>}    </p>
       <div>
        <table className='poptb'>
          <thead>
            <tr>
              <th className='popth' >#</th>
              <th className='popth'>Category</th>
              <th className='popth'>Customer Name</th>
              <th className='popth'>State Name</th>
              <th className='popth'>District Name</th>
              <th className='popth'>City Name</th>
              <th className='popth'>Population</th>
            
            </tr>
          </thead>
          <tbody>
{getlist}
          </tbody>
        </table>
       </div>
       
       
        </Popup>
      )}
    </div>
  );
};

export default UlbViewCity;
