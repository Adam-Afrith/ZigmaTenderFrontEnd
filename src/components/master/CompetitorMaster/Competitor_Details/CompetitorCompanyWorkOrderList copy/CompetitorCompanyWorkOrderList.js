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
const CompetitorCompanyWorkOrderList = (props) => {
  
 var dataSet = []

 useEffect(() => {
   table =  $('#workOrderTable').DataTable({
        data: dataSet,
        columns: [
            { data: 'sl_no' },
            { data: 'custName' },
            { data: 'projectName'},
            { data: 'tnederId'},
            { data: 'state_name'},
            { data: 'woDate'},
            { data: 'quantity'},
            { data: 'unit_name'},
            { data: 'projectValue'},
            { data: 'perTonRate'},
            { data: 'qualityCompleted'},
            { data: 'date'},
            { data: 'woFile'},
            { data: 'completionFile'},
            { data: 'buttons' },
        ],
    })

      $('#workOrderTable tbody').on('click', 'tr .fa-edit', function () {
        let rowdata =table.row($(this).closest('tr')).data();
        props.onEdit(rowdata)
        
      });

      $('#workOrderTable tbody').on('click', 'tr .fa-trash', function () {
        let rowdata =table.row($(this).closest('tr')).data();
        props.onDelete(rowdata)
      });

      $('#workOrderTable tbody').on('click', 'td #woImg', function () {
        let rowdata =table.row($(this).closest('tr')).data();
        props.onPreview(rowdata)
      });
        $('#workOrderTable tbody').on('click', 'td #woImg1', function () {
          let rowdata =table.row($(this).closest('tr')).data();
          props.onPreview1(rowdata)
      });

 }, [])

 useEffect(() => {
    if(props.wOList){
        table.clear().rows.add(props.wOList).draw();
    }
 }, [props.wOList])
 

  return (
    <Fragment>
      <div className="col-lg-12">
        </div>
      <div className="table-responsive">
        <table
          className="table   text-center"
          id="workOrderTable"
          width="50%"
          cellSpacing={0}
        >
          <thead className="text-center bg-primary text-white ">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Project Name</th>
              <th scope="col">Tender Id</th>
              <th scope="col">State Name</th>
              <th scope="col">WO Date</th>
              <th scope="col">Quantity</th>
              <th scope="col">Unit</th>
              <th scope="col">Project Value</th>
              <th scope="col">Per Ton Rate</th>
              <th scope="col">Quality Completed</th>
              <th scope="col">Date</th>
              <th scope="col">WO Upload</th>
              <th scope="col">Completion Certificate Upload</th>
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

export default CompetitorCompanyWorkOrderList;
