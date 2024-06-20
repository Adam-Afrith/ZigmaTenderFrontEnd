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
const CompetitorDetailsCompanyNetWorthList = (props) => {
  
 var dataSet = []

 useEffect(() => {
   table =  $('#netWorthTable').DataTable({
        data: dataSet,
        columns: [
            { data: 'sl_no' },
            { data: 'accountYear' },
            { data: 'accValue' },
            { data: 'buttons' },
        ],
    })

      $('#netWorthTable tbody').on('click', 'tr .fa-edit', function () {
        let rowdata =table.row($(this).closest('tr')).data();
        props.onEdit(rowdata)
        
      });

      $('#netWorthTable tbody').on('click', 'tr .fa-trash', function () {
        let rowdata =table.row($(this).closest('tr')).data();
        props.onDelete(rowdata)
      });

 }, [])

 useEffect(() => {
    if(props.netWorthList){
        table.clear().rows.add(props.netWorthList).draw();
    }
 }, [props.netWorthList])
 

  return (
    <Fragment>
      <div className="col-lg-12">
        </div>
      <div className="table-responsive">
        <table
          className="table table-bordered text-center"
          id="netWorthTable"
          width="100%"
          cellSpacing={0}
        >
          <thead className="text-center bg-greeny text-white">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Accounting Year</th>
              <th scope="col">Value in Rupees</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
                
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default CompetitorDetailsCompanyNetWorthList;
