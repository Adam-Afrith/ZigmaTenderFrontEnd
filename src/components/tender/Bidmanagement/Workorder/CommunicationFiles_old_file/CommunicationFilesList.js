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
const CommunicationFilesList = (props) => {
  
 var dataSet = []

 useEffect(() => {
   table =  $('#communicationfiles').DataTable({
        data: dataSet,
        columns: [
            { data: 'sl_no' },
            { data: 'date' },
            // { data: 'remark' },
            { data: 'comfile' },
            { data: 'buttons' },
        ],
    })

      $('#communicationfiles tbody').on('click', 'tr .fa-edit', function () {
        let rowdata =table.row($(this).closest('tr')).data();
        props.onEdit(rowdata)
        
      });

      $('#communicationfiles tbody').on('click', 'tr .fa-trash', function () {
        let rowdata =table.row($(this).closest('tr')).data();
        props.onDelete(rowdata)
      });

      $('#communicationfiles tbody').on('click', 'tr #commImg', function () {
        let rowdata =table.row($(this).closest('tr')).data();
        props.onPreview(rowdata)
        
      });

 }, [])

 useEffect(() => {
    if(props.commFilesSubList){
        table.clear().rows.add(props.commFilesSubList).draw();
    }
 }, [props.commFilesSubList])
 

  return (
    <Fragment>
      <div className="col-lg-12">
        </div>
      <div className="table-responsive">
        <table
          className="table   text-center"
          id="communicationfiles"
          width="100%"
          cellSpacing={0}
        >
          <thead className="text-center bg-primary text-white">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Document</th>
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

export default CommunicationFilesList;