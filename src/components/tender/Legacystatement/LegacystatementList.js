import { Fragment, useEffect, useState } from "react"
import PreLoader from "../../UI/PreLoader"
import { toast, ToastContainer } from 'react-toastify';
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
import moment from 'moment';
import 'datatables.net';
// import 'datatables.net-dt/css/jquery.dataTables.css';

import { useLocation, useNavigate } from "react-router-dom";



let table;
// Define the custom sorting type for the NITdate column
$.fn.dataTable.ext.type.order['date-format-pre'] = function (value) {
  return moment(value, 'DD/MM/YYYY').format('YYYYMMDD');
};

const LegacystatementList = (props) => {

    const navigate = useNavigate()
    const [legacylist, setlegacylist] = useState([])
    const location = useLocation();

    useEffect(() => {
        table =  $('#dataTable').DataTable({
          columnDefs: [
            { targets: 1, type: 'date-format' }
          ],
            data : legacylist,
            columns: [
                { data: 'sl_no' },
                { data: 'NITdate', type: 'date-format'  },
                { data: 'location' },
                { data: 'quality'},
                { data: 'unit' },
                { data: 'projectvalue'},
                { data: 'status'},
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
        table.buttons().container().appendTo("#dataTable_wrapper .dataTables_filter");
    
        $('#dataTable tbody').on('click', 'tr .fa-edit', function () {
          let rowdata =table.row($(this).closest('tr')).data();
          
          if(rowdata.bidid !== null){
            navigate(`${location.pathname}/main/bidcreationmain/${rowdata.tenderid}/${rowdata.bidid}`)
          }
          
          if(rowdata.bidid === null){
            navigate(`${location.pathname}/main/bidcreationmain/${rowdata.tenderid}`)
          }
          // props.onEdit(rowdata)
        });
    
        $('#dataTable tbody').on('click', 'tr .fa-trash-o', function () {
          let rowdata = table.row($(this).closest('tr')).data();
         
            // deleteList(rowdata)
          // props.onDelete(rowdata)
        });
      }, [])

      useEffect(() => {
        if(Array.isArray(props.list)){
          table.clear().rows.add(props.list).draw();
        }
      }, [props.list])

return (
    <Fragment>
        
        <PreLoader loading = {props.loading}>
        <ToastContainer/>
        <div className="table-responsive">
                    <table
                        className="table table-bordered text-center"
                        id="dataTable"
                        width="100%"
                        cellSpacing={0}
                    >
                        <thead className="text-center bg-greeny text-white">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">NIT Date</th>
                                <th scope="col">Location</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Unit</th>
                                <th scope="col">Project Cost</th>
                                <th scope="col">Status</th>
                                {/* <th scope="col">Action</th> */}
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

export default LegacystatementList