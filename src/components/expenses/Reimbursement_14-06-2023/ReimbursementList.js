import { Fragment, useEffect, useState } from "react";
import PreLoader from "../../UI/PreLoader";


//For DataTable
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-bs4";
import jsZip from "jszip";
import "datatables.net-buttons-bs4";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";


import axios from "axios";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import Swal from "sweetalert2";
import { usePageTitle } from "../../hooks/usePageTitle";



let table; 

const ReimbursementList = (props) => {

    usePageTitle('List Reimbursement Form');

    const [UlbtList, setUlbList] = useState([]);
    
    const { server1: baseUrl } = useBaseUrl();
   
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);
    const [popup, setpopup] = useState('');
    const [popupfor, setpopupfor] = useState('');
    const [ResponseStatus, setResponseStatus] = useState('');
    const handleOpenPopup = () => {
      setIsOpen(true);
    };
    const handleClosePopup = () => {
      setIsOpen(false);
    };
  
      const handlePopup = (rowdata) => {
        clearPopupData();
       
        setTimeout(() => {
          setpopup(rowdata);
          
        }, 200);
      

      
     
    };
    const clearPopupData = () => {
      setpopup({});
    };
   
   
   // Incorrect usage


// Correct usage


    useEffect(() => {
     
      console.log("UlbtList",UlbtList);
        table =  $('#reimdataTable').DataTable({
            data : UlbtList,
            columns: [
                { data: 'sl_no' },
                { data: 'entry_date' },
                { data: 'bill_no' },
                { data: 'staff_name' },
                { data: 'total_amount' },
                { data: 'ho_app' },
                { data: 'ceo_app' },
                { data: 'hr_app' },
                { data: 'view.' },
                // { data: 'current_stage' },
                // { data: 'action' },
            ],
            // dom:
            // //   "<'row'<'col-sm-12'l>>" +
            //   "<'row'<'col-sm-12   col-md-6 pl-4'l>  <'col-sm-12 col-md-6 pr-4'f>>" +
            //   "<'row'<'col-sm-12'tr>>" +
            //   "<'row'<'col-sm-12 col-md-5 pl-4'i><'col-sm-12 col-md-7 pr-4'p>>",
    
        })
        let ApproveStatus = '';

        $('#reimdataTable tbody').on('click', 'td', function(event) {
          const btn = event.target;
          const action = btn.getAttribute('data-action');
              let rowdata = table.row($(event.target).closest('tr')).data();
        
         

if((action!=null)&&(action!='')){
  
  
  if((action=='HOApprove')||(action=='CEOApprove')||(action=='HRApprove'))
{

/*********
 * sucess 
 * https://content.presentermedia.com/content/animsp/00023000/23935/business_man_emote_thumbs_up_md_nwm_v2.gif
 * reject
 * https://content.presentermedia.com/content/animsp/00024000/24178/business_grant_emote_confused_md_nwm_v2.gif
 */
  Swal.fire({
    title: 'Update Your Approval Status',
     imageUrl: "https://content.presentermedia.com/content/animsp/00024000/24508/business_grant_emote_waiting_md_nwm_v2.gif",
    imageHeight: 200, // Set the height of the image
    showCancelButton: true,
    confirmButtonText: 'Approve',
    cancelButtonText: 'Reject'
  }).then(async (result) => {
    if (result.isConfirmed) {
      // handle "approve" action
      ApproveStatus='approved';
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // handle "reject" action
      ApproveStatus='rejected';
    }



console.log('ApproveStatus',ApproveStatus);

if(ApproveStatus){



    let data = {
      ApproveStatus: ApproveStatus,
      rowdata :rowdata.id,
      action:action,
      token:localStorage.getItem("token"),
}

  let response = await axios.post(`${baseUrl}/api/expensesapp/UpdateApproval`, data)
  /**********fro empty the approval status */
  ApproveStatus='';
  
  
  if(response.data.status===200){
    if( ApproveStatus=='approved'){

      Swal.fire({
        imageUrl: "https://content.presentermedia.com/content/animsp/00023000/23935/business_man_emote_thumbs_up_md_nwm_v2.gif",
        imageHeight: 200, // Set the height of the image
        title: "Approved",
        timer: 4000 // auto close after 2 seconds
       
    });

    }
    else{

      Swal.fire({
        imageUrl: "https://content.presentermedia.com/content/animsp/00024000/24178/business_grant_emote_confused_md_nwm_v2.gif",
        imageHeight: 200, // Set the height of the image
        title: "Rejected",
        timer: 4000 // auto close after 2 seconds
       
    });
    }
   
    props.getlist();
  }
}
  })


}else if((action=='HOApprove_reject')||(action=='CEOApprove_reject')||(action=='HRApprove_reject')){


  Swal.fire({
    title: 'Change Status',
     imageUrl: "https://content.presentermedia.com/content/animsp/00024000/24508/business_grant_emote_waiting_md_nwm_v2.gif",
    imageHeight: 200, // Set the height of the image
    
    showCancelButton: true,
    confirmButtonText: 'Approve',
    cancelButtonText: 'Colse'
  }).then(async (result) => {
    
    if (result.isConfirmed) {
      // handle "approve" action
      ApproveStatus='approved';
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // handle "reject" action
      ApproveStatus='Close';
    }
if( ApproveStatus=='approved'){

  let data = {
    ApproveStatus: ApproveStatus,
    rowdata :rowdata.id,
    action:action,
    token:localStorage.getItem("token"),
}

let response = await axios.post(`${baseUrl}/api/expensesapp/UpdateApproval`, data)
/**********fro empty the approval status */
ApproveStatus='';
  

if(response.data.status===200){
   Swal.fire({
    imageUrl: "https://content.presentermedia.com/content/animsp/00023000/23935/business_man_emote_thumbs_up_md_nwm_v2.gif",
    imageHeight: 200, // Set the height of the image
    title: "Approved",
    timer: 4000 // auto close after 2 seconds
   
});
  props.getlist();
}




}
  

  })








}else if((action=='printView')){

  const width = 800;
  const height = 600;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  const url = 'remView/';
window.open(url+rowdata.id, '', `width=${width}, height=${height}, left=${left}, top=${top}`);



}



  // Swal.fire({
  //   title: 'Loading...',
  //   imageUrl: {family},
  //   imageHeight: 200, // Set the height of the image
  //   imageAlt: 'Loading', // Set the alt text for the image
  //   showCancelButton: true,
  //   cancelButtonText: 'Cancel',
  //   confirmButtonText: 'Confirm',
  // }).then((result) => {
  //   if (result.isConfirmed) {
  //     // User clicked Confirm button
  //   } else if (result.dismiss === Swal.DismissReason.cancel) {
  //     // User clicked Cancel button
  //   }
  // });
  








}

        });
      //   $('#ulbdataTable tbody').on('click', 'td',function (event) {
      //     // console.log('class name ::  ',$(event.target).attr('class')); // check the class name
         
      //     let rowdata = table.row($(event.target).closest('tr')).data();
      //     console.log(rowdata);
         

      //     rowdata.popup.splice(0, rowdata.popup.length);
      //     if ($(event.target).hasClass('customer')) {
      //         rowdata.popup.push('customer');
             
      //     }
      //      else if ($(event.target).hasClass('m20')) {
      //         rowdata.popup.push('m20');
             
      //     } else if ($(event.target).hasClass('b10_20')) {
      //         rowdata.popup.push('b10_20');
             
      //     } else if ($(event.target).hasClass('b_5_10')) {
      //         rowdata.popup.push('b_5_10');
              
      //     } else if ($(event.target).hasClass('b_3_5')) {
      //         rowdata.popup.push('b_3_5');
              
      //     } else if ($(event.target).hasClass('b_1_3')) {
      //         rowdata.popup.push('b_1_3');
             
      //     } else if ($(event.target).hasClass('b_1')) {
      //         rowdata.popup.push('b_1');
             
      //     }
      //     if (currentPopup) {
      //       currentPopup.close();
      //   }

      //   handlePopup(rowdata);
      // });
      
      
        // $('#dataTable tbody').on('click', '.m20', function () {
        //   let rowdata =table.row($(this).closest('tr')).data();
          
        //   handlePopup('');
        //   rowdata.popup.push('m20');
        //   handlePopup(rowdata);
        // });

        // $('#dataTable tbody').on('click', '.b10_20', function () {
        //   let rowdata =table.row($(this).closest('tr')).data();
          
        //   rowdata.popup.push('b10_20');
        //   handlePopup(rowdata);
        // });


        // $('#dataTable tbody').on('click', '.b_5_10', function () {
        //   let rowdata =table.row($(this).closest('tr')).data();
          
        //   rowdata.popup.push('b_5_10');
        //   handlePopup(rowdata);
        // });


        // $('#dataTable tbody').on('click', '.b_3_5', function () {
        //   let rowdata =table.row($(this).closest('tr')).data();
          
        //   rowdata.popup.push('b_3_5');
        //   handlePopup(rowdata);
        // });


        // $('#dataTable tbody').on('click', '.b_1_3', function () {
        //   let rowdata =table.row($(this).closest('tr')).data();
          
        //   rowdata.popup.push('b_1_3');
        //   handlePopup(rowdata);
        // });


        // $('#dataTable tbody').on('click', '.b_1', function () {
        //   let rowdata =table.row($(this).closest('tr')).data();
          
        //   rowdata.popup.push('b_1');
        //   handlePopup(rowdata);
        // });
    
        // $('#dataTable tbody').on('click', 'tr .fa-trash-o', function () {
        //   let rowdata = table.row($(this).closest('tr')).data();
         
        //     deleteList(rowdata)
        //   // props.onDelete(rowdata)
        // });
      }, [ResponseStatus])


      useEffect(() => {
        props.getlist()
      }, [])

      useEffect(() => {
        if(Array.isArray(props.list)){
          table.clear().rows.add(props.list).draw();
        }
      }, [props.list])

      const deleteList = async (data) => {
        Swal.fire({
          text: `Are You sure, to delete records of '${data.customer_name}'?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
          confirmButtonColor: '#2fba5f',
          cancelButtonColor: '#fc5157'
      }).then(async (willDelete) => {
        if(willDelete.isConfirmed){
          let response =  await axios.delete(`${baseUrl}/api/bidcreation/creation/${data.tenderid}`);
          if(response.data.status === 200){
            props.getlist()
            toast.success( response.data.message , {
              position: toast.POSITION.TOP_CENTER
            });
          }else{
            toast.error("Unable to Delete!" , {
              position: toast.POSITION.TOP_CENTER
            });
          }
        }
      })
    
    
      }

    return (
      
        <Fragment>
         
            <PreLoader loading={props.loading}>
                <ToastContainer />
                <div className="table-responsive pb-3">
                    <table
                        className="table text-center"
                        id="reimdataTable"
                        width="100%"
                        cellSpacing={0}
                    >
                        <thead className="text-center bg-gray-200 text-primary">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Entry Date</th>
                                <th scope="col">Expense Bill No</th>
                                <th scope="col">Staff Name</th>
                                <th scope="col">Total Amount</th>
                                <th scope="col">HO Approval</th>
                                <th scope="col">CEO Approal</th>
                                 <th scope="col">HR Approal</th> 
                                <th scope="col">View</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
             
            </PreLoader>
        </Fragment>
       
    )
}

export default ReimbursementList