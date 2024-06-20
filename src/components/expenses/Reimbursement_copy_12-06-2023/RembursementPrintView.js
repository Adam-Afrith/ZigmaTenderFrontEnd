import axios from "axios";
import React, { useEffect, useContext, useState } from "react";

import { useBaseUrl } from "../../hooks/useBaseUrl";
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import './SubTable.css';
import printlogo from "./image/logo_print.png"
function RembursementPrintView() {
  const { id } = useParams();
  const { server1: baseUrl } = useBaseUrl();
  const BasicDetail = {
    date: "",
    bill_no: "",
    staff_name: "",
    destination: "",
    totalAmount: "",

  }
  const [Bill, setBill] = useState(BasicDetail);
  const [calllist, setcalllist] = useState([]);
  const [otherlist, setotherlist] = useState([]);

  useEffect(() => {

    let data = {
      id: id,
    }
    axios.post(`${baseUrl}/api/expensesapp/printView`, data).then((response) => {
      if (response.data.status === 200) {
        // generateOptions(response.data.get_staff);
        console.log(response.data.otherExpense);
        let Detail = response.data.exapp;
        console.log('Detail', Detail);
        const dateString = Detail?.entry_date;

        // Create a new Date object from the given date string
        const date = new Date(dateString);

        // Convert the date to the desired format "d-m-Y"
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        console.log(formattedDate);
        setBill((prev) => {
          return {
            ...prev,
            date: formattedDate,
            bill_no: Detail?.ex_app_no,
            staff_name: Detail?.userName,
            destination: Detail?.description_sub,
            totalAmount: Detail?.total_amount

          };
        });

        /*** get list for call call* */

        let list = [...response.data.withCall];

        if (list.length !== 0) {
          const totalSumcall = list.reduce((sum, item) => sum + parseFloat(item.amount), 0);
          let calldetail = list.map((item, index) => {
            var inc = index + 1;

            return (
              <tr key={index}>
                <td className="popuptd">{inc}</td>
                <td className="popuptd">{item.entry_date}</td>
                <td className="popuptd">{item.callid}</td>
                <td className="popuptd">{item.customer_name}</td>
                <td className="popuptd">{'requirement not received'}</td>
                <td className="popuptd">{'requirement not received'}</td>
                <td className="popuptd">{'requirement not received'}</td>
                <td className="popuptd">{item.amount}</td>
                <td className="popuptd">{'requirement not received'}</td>
              </tr>
            );
          });
          calldetail.push(
            <tr key="total" >
              <td colSpan="6" className="popuptd"></td>
              <td className="popuptd"><strong>Total:</strong></td>
              <td className="popuptd">{totalSumcall.toFixed(2)}</td>
              <td className="popuptd"></td>
            </tr>
          );
          setcalllist(calldetail);

        }




        /****get list for other expenses */
        let listother = [...response.data.otherExpense];

        if (listother.length !== 0) {
          const totalSum = listother.reduce((sum, item) => sum + parseFloat(item.amount), 0);
          console.log('totalSum', totalSum);
          let otherdetail = listother.map((item, index) => {
            var inc = index + 1;

            return (
              <tr key={index}>
                <td className="popuptd">{inc}</td>
                <td className="popuptd">{item.entry_date}</td>
                <td className="popuptd">{item.expense_no}</td>
                <td className="popuptd">{item.expenseType}</td>
                <td className="popuptd">{item.description_sub}</td>
                <td className="popuptd">{item.amount}</td>

              </tr>


            );
          });
          otherdetail.push(
            <tr key="total" >
              <td colSpan="4" className="popuptd"></td>
              <td className="popuptd"><strong>Total:</strong></td>
              <td className="popuptd">{totalSum.toFixed(2)}</td>
            </tr>
          );
          setotherlist(otherdetail);

        }

        console.log('setotherlist', otherlist)

      }
    });



  }, [])




  return (
    <div >
      <div>
        {/**************We need to desing for this part ******************* */}
        <div className="cardprint">

<div className="d-flex">
  <div >
  
            <img src={printlogo} alt="Card" className="cardprint-image" />
          
  </div>
<div>
          <h2 className="cardprint-title"> Zigma Global Environ Solutions</h2>
                            <h5 class=""> 24,Kalaimagal Kalvi Nilayam Road,</h5>
                            <h5 class=""> Erode 638001,</h5>
                            <h5 class=""> Tamil Nadu, INDIA.</h5>
</div>
               
         

</div>
         

<div>
<br></br><br></br>
          <h4 className="cardprint-title"> <strong>Expense Billing </strong> </h4>
          <p className="billd">  <strong>Expense Date</strong> : {Bill.date} </p>
          <p className="billd">  <strong>Expense Bill No</strong> : {Bill.bill_no}  </p>
          <p className="billd">  <strong>Staff Name</strong> : {Bill.staff_name} </p>
          <p className="billd">  <strong>Designation</strong> : Business Development Executive </p>
          <p className="billd"> <strong>Total Amount</strong> : {Bill.totalAmount} </p>


</div>
          



        </div>

        <div className="cardprint-content">
      




        </div>

        {/**************We need to desing for this part ******************* */}
        <span style={{ color: '#323a46', fontSize: '1.75rem', 'fontweight': 400 }}>Call Details</span>
        <table className='poptb'>
          <thead>
            <tr>
              <th className='popth' >#</th>
              <th className='popth'>Entry Date</th>
              <th className='popth'>Call No</th>
              <th className='popth'>Customer Name</th>
              <th className='popth'>Travel Expense No</th>
              <th className='popth'>Vehicle Type</th>
              <th className='popth'>Pre-Booked</th>
              <th className='popth'>Paid Amount</th>
              <th className='popth'>Claim Amount</th>

            </tr>
          </thead>
          <tbody>
            {calllist.length > 0 ? calllist : <tr><td colSpan="6">No Data Found</td></tr>}

          </tbody>
        </table>

      </div>
      <div><br></br>

       
          <span style={{ color: '#323a46', fontSize: '1.75rem', 'fontweight': 400 }}>Other Details</span>


       






        <table className='poptb'>
          <thead>
            <tr>
              <th className='popth' >#</th>
              <th className='popth'>Entry Date</th>
              <th className='popth'>Expense No</th>
              <th className='popth'>Expense Type</th>
              <th className='popth'>Description</th>
              <th className='popth'>Amount</th>



            </tr>
          </thead>
          <tbody>
            {otherlist.length > 0 ? otherlist : <tr><td colSpan="6">No Data Found</td></tr>}

          </tbody>
        </table>
      </div>

    </div>


  );
}

export default RembursementPrintView;
