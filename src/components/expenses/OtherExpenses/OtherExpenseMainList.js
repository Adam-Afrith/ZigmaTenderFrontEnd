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
//import pdfMake from "pdfmake/build/pdfmake";
//import pdfFonts from "pdfmake/build/vfs_fonts";


import axios from "axios";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { useLocation, useNavigate,generatePath } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import Swal from "sweetalert2";
import { usePageTitle } from "../../hooks/usePageTitle";



let table; 

const OtherExpenseMainList = (props) => {

    usePageTitle('List Expense Creation');
   
    const [UlbtList, setUlbList] = useState([]);
    
    const { server1: baseUrl } = useBaseUrl();
    const navigate = useNavigate()
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
   
   const  handleApprove=()=>{

    console.log("affagg");

    // swal({
    //   title: "Are you sure?",
    //   text: "You won't be able to revert this!",
    //   icon: "warning",
    //   buttons: ["Reject", "Approve"],
    // })
    // .then((value) => {
    //   if (value === true) {
    //     // User clicked "Approve"
    //   } else {
    //     // User clicked "Reject"
    //   }
    // });
    


   }
   // Incorrect usage


// Correct usage


    useEffect(() => {
     
     
        table =  $('#reimdataTable').DataTable({
            data : UlbtList,
            columns: [
                { data: 'sl_no' },
                { data: 'entry_date' },
                { data: 'exp_no' },
                { data: 'staff_name' },
                { data: 'total_amount' },
                { data: 'view' },
                { data: 'action' },
               
                // { data: 'current_stage' },
                // { data: 'action' },
            ],
            buttons:[
              {
                extend: "print",
                text: '<i class="fa fa-print  mx-1" aria-hidden="true"></i> <span class="print">Print</span>',
                className: "btn btn-info",
                exportOptions: {
                  // columns: ':not(.exclude-action)', 
                  columns: [0, 1, 2, 3, 4], //Except view 5 and action 6 columns
                },
              },
              {
                extend: "excel",
                text: '<i class="fa fa-file-excel-o mx-1" aria-hidden="true"></i> <span class="excel">Excel</span>',
                className: "btn btn-success",
                exportOptions: {
                  // columns: ':not(.exclude-action)', 
                  columns: [0, 1, 2, 3, 4], //Except view 5 and action 6 columns
                },
              },
            ],
            // dom:
            // //   "<'row'<'col-sm-12'l>>" +
            //   "<'row'<'col-sm-12   col-md-6 pl-4'l>  <'col-sm-12 col-md-6 pr-4'f>>" +
            //   "<'row'<'col-sm-12'tr>>" +
            //   "<'row'<'col-sm-12 col-md-5 pl-4'i><'col-sm-12 col-md-7 pr-4'p>>",
    
        })
        table.buttons().container().appendTo("#reimdataTable_wrapper .dataTables_filter");

        let ApproveStatus = '';

        $('#reimdataTable tbody').on('click', 'td', function(event) {
          const btn = event.target;
          const action = btn.getAttribute('data-action');
              let rowdata = table.row($(event.target).closest('tr')).data();
        
         

if((action!=null)&&(action!='')){
  console.log('action',action);
  if(action=='EDIT'){

    navigate(`/tender/expenses/otherExpense/edit/`+rowdata.id);

  }
  else if(action=='DELETE'){

    let data = {
      delete_id: rowdata.id,
    }
    axios.delete(`${baseUrl}/api/deleteMain/${rowdata.id}`).then((res) => {
			if (res.status === 200) {
	  
        props.getlist();
			}
		  });

 

  }









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
                <div className="table-responsive ">
                    <table
                        className="table table-bordered text-center"
                        id="reimdataTable"
                        width="100%"
                        cellSpacing={0}
                    >
                        <thead className="text-center bg-greeny text-white">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Entry Date</th>
                                <th scope="col">Expense No</th>
                                <th scope="col">Branch Name / Staff Name</th>
                                <th scope="col">Total Amount</th>
                                <th scope="col">View</th>
                                <th scope="col">Action</th>
                                
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

export default OtherExpenseMainList