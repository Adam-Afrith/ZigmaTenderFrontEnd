import { Fragment } from "react";
import { useEffect } from "react";
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

var table;
const CustomerCreationContactSubtable = (props) => {
  
 var dataSet = []

 useEffect(() => {
   table =  $('#dataTable').DataTable({
        data: dataSet,
        columns: [
            { data: 'sl_no' },
            { data: 'contact_person' },
            { data: 'designation' },
            { data: 'email' },
            { data: 'mobile_no' },
            { data: 'buttons' },
            // {
            //   data: null,
            //   defaultContent: '<i class="fa fa-pencil text-success mx-4"/><i class="fa fa-trash text-danger"/>',
            //   orderable: false
            // }
        ],

        // "rowCallback": function (nRow, aData, iDisplayIndex) { // for Sl.no
        //     var oSettings = this.fnSettings ();
        //     $("td:first", nRow).html(oSettings._iDisplayStart+iDisplayIndex +1);
        //     return nRow;
        // },
    })

      $('#dataTable tbody').on('click', 'tr .fa-edit', function () {
        let rowdata =table.row($(this).closest('tr')).data();
        props.onEdit(rowdata)
      });

      $('#dataTable tbody').on('click', 'tr .fa-trash', function () {
        let rowdata = table.row($(this).closest('tr')).data();
        props.onDelete(rowdata)
      });
 }, [])

 useEffect(() => {
    if(props.contactData){
        table.clear().rows.add(props.contactData).draw();
    }
 }, [props.contactData])
 

 

//  const addrow = () => {
    
//     table.row.add( {
//         first_name: "Airi",
//         last_name: "Satou",
//         position: "Accountant",
//         office: "Tokyo",
//         start_date: "28th Nov 08",
//         salary: "$162,700"
//       }).draw();
//  }

//  const cleardatatale = () => {
//     table.clear().draw();
//  }

  return (
    <Fragment>
      <div className="col-lg-12">
        {/* <button onClick={addrow}>Add row</button>
        <button onClick={cleardatatale}>Clear All</button> */}
        </div>
      <div className="table-responsive">
        <table
          className="table table-bordered  text-center"
          id="dataTable"
          width="100%"
          cellSpacing={0}
        >
          <thead className="text-center bg-greeny text-white ">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Person Name</th>
              <th scope="col">Designation</th>
              <th scope="col">Email ID</th>
              <th scope="col">Mobile no</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody >
                
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default CustomerCreationContactSubtable
