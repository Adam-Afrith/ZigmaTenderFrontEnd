import { Fragment, useEffect } from "react";

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

let table; 
let dataSet= [];
const DocList = () => {

    useEffect(() => {
        table =  $('#dataTable').DataTable({
             data: dataSet,
             columns: [
                 { data: 'sl_no' },
                 { data: 'docname' },
                 { data: 'filename' },
                 { data: 'action' },
             ],
     
             // "rowCallback": function (nRow, aData, iDisplayIndex) { // for Sl.no
             //     var oSettings = this.fnSettings ();
             //     $("td:first", nRow).html(oSettings._iDisplayStart+iDisplayIndex +1);
             //     return nRow;
             // },
         })
     
           $('#dataTable tbody').on('click', 'tr .fa-edit', function () {
             let rowdata =table.row($(this).closest('tr')).data();
            //  props.onEdit(rowdata)
           });
     
           $('#dataTable tbody').on('click', 'tr .fa-trash', function () {
             let rowdata = table.row($(this).closest('tr')).data();
            //  props.onDelete(rowdata)
           });
      }, [])


    return (
        <Fragment>
            <div className="d-sm-flex align-items-center justify-content-between mt-2 mb-2">
                <h1 className="h4 mb-0 text-primary">List of Uploaded documents</h1>
            </div>
            <div className="table-responsive">
            <table
            className="table text-center"
            id="dataTable"
            width="100%"
            cellSpacing={0}
            >
            <thead className="text-center bg-primary text-white">
                <tr>
                <th scope="col">#</th>
                <th scope="col">Document Name</th>
                <th scope="col">Uploded Document</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody >
      
            </tbody>
            </table>
      </div>
        </Fragment>
    )
}

export default DocList;