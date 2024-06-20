
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
const CustomerCreationBankDetailsubtable = (props) => {

    var dataSet = []

    useEffect(() => {
        table =  $('#dataTable').DataTable({
             data: dataSet,
             columns: [
                 { data: 'sl_no' },
                 { data: 'bankname' },
                 { data: 'bankaddress' },
                 { data: 'ifsccode' },
                 { data: 'beneficiaryaccountname' },
                 { data: 'accountnumber' },
                 { data: 'buttons' },  
             ],
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
        if(props.bankData){
            table.clear().rows.add(props.bankData).draw();
        }
     }, [props.bankData])


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
              <thead className="text-center bg-greeny text-white">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Bank Name</th>
                  <th scope="col">Bank Address</th>
                  <th scope="col">IFSC Code</th>
                  <th scope="col">Beneficiary Account Name</th>
                  <th scope="col">Account Number</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody >
                    
              </tbody>
            </table>
          </div>
        </Fragment>
      );

}

export default CustomerCreationBankDetailsubtable;