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
const CompetitorDetailsLineOfBusinessList = (props) => {
  
 var dataSet = []

 useEffect(() => {
   table =  $('#bizLineTable').DataTable({
        data: dataSet,
        columns: [
            { data: 'sl_no' },
            { data: 'bizLineValue' },
            { data: 'remark' },
            { data: 'buttons' },
        ],
    })

      $('#bizLineTable tbody').on('click', 'tr .fa-edit', function () {
        let rowdata =table.row($(this).closest('tr')).data();
        props.onEdit(rowdata)
        
      });

      $('#bizLineTable tbody').on('click', 'tr .fa-trash', function () {
        let rowdata =table.row($(this).closest('tr')).data();
        props.onDelete(rowdata)
      });

 }, [])

 useEffect(() => {
    if(props.bizLineList){
        table.clear().rows.add(props.bizLineList).draw();
    }
 }, [props.bizLineList])
 

  return (
    <Fragment>
      <div className="col-lg-12">
        </div>
      <div className="table-responsive">
        <table
          className="table table-bordered text-center"
          id="bizLineTable"
          width="100%"
          cellSpacing={0}
        >
          <thead className="text-center bg-greeny text-white">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Line Of Business</th>
              <th scope="col">Remarks</th>
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

export default CompetitorDetailsLineOfBusinessList;
