import { Fragment, useEffect, useState } from "react";
import PreLoader from "../../UI/PreLoader";


//For DataTable
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-bs4";
//import jsZip from "jszip";
import "datatables.net-buttons-bs4";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
//import pdfMake from "pdfmake/build/pdfmake";
//import pdfFonts from "pdfmake/build/vfs_fonts";
import UlbViewCity from "./UlbViewCity";

import axios from "axios";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import Swal from "sweetalert2";
import { usePageTitle } from "../../hooks/usePageTitle";
//  import UlbViewCity from "./UlbViewCity";
// import Popup from './Popup';

let table; 

const UlbReportList = (props) => {

    usePageTitle('ULB Report List');

    const [UlbtList, setUlbList] = useState([]);
    
    const { server1: baseUrl } = useBaseUrl();
    const navigate = useNavigate()
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);
    const [popup, setpopup] = useState('');
    const [popupfor, setpopupfor] = useState('');
    
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
    useEffect(() => {
      
        table =  $('#ulbdataTable').DataTable({
            data : UlbtList,
            columns: [
                { data: 'ulblist' },
                { data: 'customers' },
                { data: 'more_20' },
                { data: 'btw_10_20' },
                { data: 'btw_5_10' },
                { data: 'btw_3_5' },
                { data: 'btw_1_3' },
                { data: 'bel_1' },
                // { data: 'current_stage' },
                // { data: 'action' },
            ],
            buttons:[
              {
                extend: "print",
                text: '<i class="fa fa-print  mx-1" aria-hidden="true"></i> <span class="print">Print</span>',
                className: "btn btn-info",
                exportOptions: {
                    columns: ':not(.exclude-action)', 
                  },
              },
              {
                extend: "excel",
                text: '<i class="fa fa-file-excel-o mx-1" aria-hidden="true"></i> <span class="excel">Excel</span>',
                className: "btn btn-success",
                exportOptions: {
                  columns: ':not(.exclude-action)',
                },
              },
            ],

            // dom:
            // //   "<'row'<'col-sm-12'l>>" +
            //   "<'row'<'col-sm-12   col-md-6 pl-4'l>  <'col-sm-12 col-md-6 pr-4'f>>" +
            //   "<'row'<'col-sm-12'tr>>" +
            //   "<'row'<'col-sm-12 col-md-5 pl-4'i><'col-sm-12 col-md-7 pr-4'p>>",
    
        })
        table.buttons().container().appendTo("#ulbdataTable_wrapper .dataTables_filter");
        
        
        let currentPopup = null;
        $('#ulbdataTable tbody').on('click', 'td',function (event) {
          // console.log('class name ::  ',$(event.target).attr('class')); // check the class name
         
          let rowdata = table.row($(event.target).closest('tr')).data();
          console.log(rowdata);
         

          rowdata.popup.splice(0, rowdata.popup.length);
          if ($(event.target).hasClass('customer')) {
              rowdata.popup.push('customer');
             
          }
           else if ($(event.target).hasClass('m20')) {
              rowdata.popup.push('m20');
             
          } else if ($(event.target).hasClass('b10_20')) {
              rowdata.popup.push('b10_20');
             
          } else if ($(event.target).hasClass('b_5_10')) {
              rowdata.popup.push('b_5_10');
              
          } else if ($(event.target).hasClass('b_3_5')) {
              rowdata.popup.push('b_3_5');
              
          } else if ($(event.target).hasClass('b_1_3')) {
              rowdata.popup.push('b_1_3');
             
          } else if ($(event.target).hasClass('b_1')) {
              rowdata.popup.push('b_1');
             
          }
          if (currentPopup) {
            currentPopup.close();
        }

        handlePopup(rowdata);
      });
      
      
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
      }, [])


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
         <UlbViewCity onData={popup} />
            <PreLoader loading={props.loading}>
                <ToastContainer />
                <div className="table-responsive pb-3">
                    <table
                        className="table table-bordered text-center"
                        id="ulbdataTable"
                        width="100%"
                        cellSpacing={0}
                    >
                        <thead className="text-center bg-greeny text-white">
                            <tr>
                                {/* <th scope="col">#</th> */}
                                <th scope="col">ULB List</th>
                                <th scope="col">Number of City</th>
                                <th scope="col"> {"> 20 Lakh"}</th>
                                <th scope="col">{"10 - 20 Lakh"}</th>
                                <th scope="col">{"5 - 10 Lakh"}</th>
                                <th scope="col">{"3 - 5 Lakh"}</th>
                                 <th scope="col">{"1 - 3 Lakh"}</th> 
                                <th scope="col">{"< 1 Lakh"}</th>
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

export default UlbReportList