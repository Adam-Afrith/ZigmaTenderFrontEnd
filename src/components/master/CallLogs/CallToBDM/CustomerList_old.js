import axios from "axios";
import { Fragment, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

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

import Swal from "sweetalert2/src/sweetalert2";
import { Input, Loader } from "rsuite";
import AuthContext from "../../../../storeAuth/auth-context";
import { useBaseUrl } from "../../../hooks/useBaseUrl";

let table;
const CustomerList = (props) => {
  const { server1: baseUrl } = useBaseUrl();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { permission } = useContext(AuthContext);
  const authcontext = useContext(AuthContext);
  // const [input, setInput] = useState([]);
  const inputref= useRef({});
  const [customerList, setCustomerList] = useState([]);
  const [listBackup, setListBackup] = useState([]); //this is used when Clear button is clicked

  useEffect(() => {
    getList();
  }, [props]);

  console.log("Input", inputref);
  const deleterecord = async (id) => {
    let response = axios.delete(`${baseUrl}/api/calltobdm/${id}`);
    return response;
  };

  const mutateCustomerSelection = (rowdata) => {
    console.log("Row", rowdata);
    console.log("Input", inputref);
    let rowStrid = rowdata.id.toString();
    // let rowid = rowdata.id;
// console.log("inputref[rowStrid]?.assign_status ",inputref[rowStrid]?.assign_status )
// console.log("inputref[rowStrid]?.assign_status === 0 ",inputref[rowStrid]?.assign_status === 0)
// console.log("rowdata.assign_status === 0 ",rowdata.assign_status === 0)
     
    let assignStatus = inputref[rowStrid]?.assign_status 
      ? inputref[rowStrid]?.assign_status === 0 
        ? 1 
        : 0
      : rowdata.assign_status === 0  
      ? 1
      : 0;

      console.log("assignStatus -",assignStatus);
 
    
      let newInpuObj = {
        rowid : rowdata.rowid,
        customerId: rowdata.id,
        assign_status: assignStatus,
      }
    inputref.current= {...inputref.current, [rowStrid]: newInpuObj};
    // setInput((prev)=>{return {...prev, [rowStrid]: newInpuObj}});
  };

  const getList = async () => {
    let datatosend = {
      country: props?.country?.value,
      state: props?.state?.value,
      district: props?.district?.value,
      tokenid: localStorage.getItem("token"),
      bdm_id: props.id,
    };
    const List = await axios.post(
      `${baseUrl}/api/filteredcustomerlist`,
      datatosend
    );
    // console.log("List", List);
    var dataSet;
    if (List.status === 200) {
      let list = [...List.data.customerList];
      setListBackup(List.data.customerList);
      setCustomerList(List.data.customerList);

      let listarr = list.map((item, index, arr) => {
        // console.log("item.assign_status", item.assign_status);

        // let editbtn = '<button class="btn btn-success btn-circle btn-lg"><i class="fas fa-trash-alt"></i></button>';
        let editbtn =
          !!permission?.call_to_bdm?.can_edit &&
          
           item.assign_status === 1 ? '<button class="btn btn-success btn-circle btn-md" data-index='+index+'><i class="fas fa-check toggle-class" id="check"></i></button>'
            : '<button class="btn btn-outline-danger btn-circle btn-md"><i class="fas fa-close toggle-class" data-index='+index+'></i></button>';
        return {
          ...item,
          customerName: item.customer_name,
          country_name: item.country_name,
          state_name: item.state_name,
          district_name: item.district_name,
          city_name: item.city_name,
          mobile: item.mobile_no ? item.mobile_no : "-",
          action: editbtn,
          sl_no: index + 1,
        };
      });

      dataSet = listarr;
    } else {
      dataSet = [];
    }

    let i = 0;
    table = $("#dataTable").DataTable({
      data: dataSet,
      columns: [
        {
          //data: 'sl_no',
          render: function (data, type, row) {
            return ++i;
          },
        },
        { data: "customerName" },
        { data: "country_name" },
        { data: "state_name" },
        { data: "district_name" },
        { data: "city_name" },
        { data: "mobile" },
        { data: "action" },
      ],
    });
    setLoading(false);

    $("#dataTable").on("click", "tr .btn", function () {
      // let rowdata = table.row($(this).closest("tr")).data();
      let row = table.row($(this).closest("tr"));
      let rowdata = row.data();
      let rowIndex = row.index();
      console.log("rowIndex -- ", rowIndex);
      console.log("rowdata -- ", rowdata);
      mutateCustomerSelection(rowdata);
      const newStatus = rowdata.assign_status === 1 ? 0 : 1;

      // update the button class and icon based on the new status
  
  
  // var table = $('#example').DataTable();
  // var Indexedrow = table.row(rowIndex);
  // Indexedrow.data()
  rowdata.assign_status = newStatus;
  console.log("Updated Row Data", rowdata);
  row(rowIndex).data(rowdata);
  table.draw();

  if (newStatus === 1) {
    $(this).removeClass('btn-outline-danger').addClass('btn-success');
    $(this).find('i').removeClass('fa-close').addClass('fa-check');
  } else {
    $(this).removeClass('btn-success').addClass('btn-outline-danger');
    $(this).find('i').removeClass('fa-check').addClass('fa-close');
  }
  // update the row data object in the DataTables data array
  // table.row(rowIndex).data(rowdata);
  
  // redraw the DataTables table to reflect the updated data
  // table.draw();  



    
      // if (newStatus === 1) {
      //   $(this).removeClass('btn-outline-danger').addClass('btn-success');
      //   $(this).find('i').removeClass('fa-close').addClass('fa-check');
      // } else {
      //   $(this).removeClass('btn-success').addClass('btn-outline-danger');
      //   $(this).find('i').removeClass('fa-check').addClass('fa-close');
      // }
      // // console.log("rowdata ****", rowdata);
      // mutateCustomerSelection(rowdata);
      // rowdata.assign_status = newStatus;
      // // console.log("rowdata _ _ _", rowdata);
      //  // update the rowdata object in the table data object
      // // $(this).table.row[rowIndex] = rowdata;
      
      // // Set the updated data back to the row
      // table.row(rowIndex).data(rowdata);

      // table.row($(this).closest("tr")).data(rowdata).draw();
      //to send for upatation
      //   if(input[rowdata.id].hasOwnProperty())
      //   {
      // console.log("has Property");
    });

    // to delete a row
    $("#dataTable tbody").on("click", "tr .fa-trash-alt", async function () {
      let rowdata = table.row($(this).closest("tr")).data();

      Swal.fire({
        text: `Are You sure, to delete ${rowdata.staffName}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        confirmButtonColor: "#2fba5f",
        cancelButtonColor: "#fc5157",
      }).then(async (willDelete) => {
        if (willDelete.isConfirmed) {
          let response = await deleterecord(rowdata.id);

          if (response.data.status === 200) {
            Swal.fire({
              //success msg
              icon: "success",
              text: `${rowdata.name} role and its permissions has been removed!`,
              timer: 1500,
              showConfirmButton: false,
            });

            // authcontext.getpermissions()
            //delete in datatable
            table
              .row($(this).parents("tr"))
              .remove()
              .column(0)
              .nodes()
              .each(function (cell, i) {
                cell.innerHTML = i + 1;
              })
              .draw();
          } else if (response.data.status === 404) {
            Swal.fire({
              // error msg
              icon: "error",
              text: response.data.message,
              showConfirmButton: true,
            });
          } else {
            Swal.fire({
              title: "Cancelled",
              icon: "error",
              timer: 1500,
            });
          }
        }
      });
    });
  };

  return (
    <Fragment>
      <div>
        {loading && <Loader size="lg" backdrop content="Fetching Data..." />}
      </div>
      <div className="table-responsive">
        <table
          className="table table-bordered text-center"
          id="dataTable"
          width="100%"
          cellSpacing={0}
        >
          <thead className="text-center">
            <tr>
              <th className="">Sl.No</th>
              <th className="">Customer Name</th>
              <th className="">Country</th>
              <th className="">State</th>
              <th className="">District</th>
              <th className="">City</th>
              <th className="">Contact No</th>
              <th className="">Action</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default CustomerList;
