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
//*********************************************//
 

let table;
const SWMProjectStatusSubTable = (props) => {

  var dataSet = props.projectList;

  useEffect(() => {
    
    table =  $('#dataTable').DataTable({
        data: dataSet,
        columns: [
            { data: 'sl_no' },
            { data : 'projecttype_label'},
            { data : 'status_label'},
            { data : 'vendor'},
            { data : 'vendortype_label'},
            { data : 'projectstatus_label'},
            { data : 'projectvalue'},
            { data : 'duration'},
            { data : 'buttons' },
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
  
  useEffect(() =>{
    if(props.projectList){
      table.clear().rows.add(props.projectList).draw();
    }
  }, [props.projectList])

  return (
    <Fragment>
      <div className="col-lg-12">
        {/* <button onClick={addrow}>Add row</button>
        <button onClick={cleardatatale}>Clear All</button> */}
      </div>
      <div className="table-responsive">
        <table
          className="table table-bordered text-center"
          id="dataTable"
          width="100%"
          cellSpacing={0}
        >
          <thead className="text-center bg-greeny text-white align-middle">
            <tr className="align-middle">
              <th scope="col" className="align-middle">#</th>
              <th scope="col" className="align-middle">Project Type</th>
              <th scope="col" className="align-middle">Status</th>
              <th scope="col" className="align-middle">Vendor</th>
              <th scope="col" className="align-middle">Vendor Type</th>
              <th scope="col" className="align-middle">Project Status</th>
              <th scope="col" className="align-middle"><p>Project Value</p>  (in lakhs)</th>
              <th scope="col" className="align-middle"><p>Duartion</p> (in months)</th>
              <th scope="col" className="align-middle">Action</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default SWMProjectStatusSubTable;
