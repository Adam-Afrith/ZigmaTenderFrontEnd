
import axios from "axios";
import { Fragment,  createContext,  useContext,  useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

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
import { useBaseUrl } from "../../hooks/useBaseUrl";
import Swal from "sweetalert2/src/sweetalert2";
import { Loader } from "rsuite";
import AuthContext from "../../../storeAuth/auth-context";
import CallLogCreation from "./CallLogCreation";
//import CallLogHistory from "./CallLogHistory";


let table;
const CallLogMainList = () => {
  
  const { server1: baseUrl } = useBaseUrl();
  const [loading, setLoading] = useState(true);
  const [btnNxtFlw, setNxtFlw] = useState(null);
  //const [actBtn, setActBtn] = useState([]);
  const navigate = useNavigate();
  const {permission} = useContext(AuthContext)

  const deleterecord = async (id) => {
    let response =  axios.delete(`${baseUrl}/api/callcreation/${id}`)
    return response;
  }

  const getList = async () => {
    const callloglist = await axios.get(`${baseUrl}/api/callcreation/getCallMainList/${localStorage.getItem("token")}`);
    console.log('CallCreatoin--',callloglist)
    // let userPermissions ;
    // let data = {
    //   tokenid : localStorage.getItem('token')
    // }

    // let rolesAndPermission = await axios.post(`${baseUrl}/api/getrolesandpermision`, data)
    // if(rolesAndPermission.status === 200){
    //   userPermissions = rolesAndPermission.data;
    // }
  
    var dataSet;
    if (
      callloglist.status === 200 &&
      callloglist.data.status === 200 &&
      callloglist.data?.calllog
    ) {
      let list = [...callloglist.data.calllog];
      let listarr = list.map((item, index, arr) => {
        // CallLogCreation
        let nxtfollowupbtn = !!(permission?.['CallLogCreation']?.can_edit) ? '<i class="fas fas fa-user text-info mx-2 h6" style="cursor:pointer" title="nxtFollowUp"></i> '  : '';
        let editbtn = !!(permission?.['CallLogCreation']?.can_edit) ? '<i class="fas fa-edit text-info mx-2 h6" style="cursor:pointer" title="Edit"></i> '  : '';
        let deletebtn =  !!(permission?.['CallLogCreation']?.can_delete) ? '<i class="fas fa-trash-alt text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>' : '';

        
        
        return {

        ...item,
        mode: "Direct",
        // status : (item.activeStatus ===  "active") ? `<span class="text-success font-weight-bold"> Active </span>` : `<span class="text-warning font-weight-bold"> Inactive </span>`,
        // action: `<i class="fas fa-edit text-info mx-2 h6" style="cursor:pointer" title="Edit"></i> <i class="fas fa-trash-alt text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>`,
        // action: (item.name === "Admin" || item.name === "admin") ? '' :( editbtn + deletebtn),
        action: ( nxtfollowupbtn + editbtn + deletebtn ),
        sl_no: index + 1,
        completed: item.close_date? item.close_date: '--',
        next_followup :  item.next_followup_date ? item.next_followup_date :  item.close_date ? "<span class='text-success'>Closed</span>" : "<span class='text-warning'>InLive</span>"
      }});

      dataSet = listarr;

    } else {
       dataSet = [];
    }

    
    let i = 0;
    table = $("#dataTable").DataTable({
      data: dataSet,
      columns: [
        // {
        //  // data: 'sl_no',
        //   render: function (data, type, row) {
        //     return ++i;
        //   },
        // },

        { data: "sl_no" },
        { data: "callid" },
        { data: "customer_name" },
        { data: "username"},
        { data: "mode"},
        { data: "callname" },        
        { data: "call_date"},
        { data: "completed"},
        { data: "next_followup"},
        { 
          data: "action",
          className: "exclude-action",  
        },
        // { data: "action" },
      ],
      buttons:[
        {
          extend: "print",
          text: '<i class="fa fa-print  mx-1" aria-hidden="true"></i> Print',
          className: "btn btn-info",
          exportOptions: {
              columns: ':not(.exclude-action)', 
            },
        },
        {
          extend: "excel",
          text: '<i class="fa fa-file-excel-o mx-1" aria-hidden="true"></i> Excel',
          className: "btn btn-success",
          exportOptions: {
            columns: ':not(.exclude-action)',
          }, 
        },
      
      ],
    })
    table.buttons().container().appendTo("#dataTable_wrapper .dataTables_filter");
    setLoading(false)

    //to followup 
    $("#dataTable tbody").on("click", "tr .fa-user", function () {
      // let rowdata = axios.get(`${baseUrl}/api/callhistory/72/`);
       let rowdata = table.row($(this).closest("tr")).data();
       navigate(
         `/tender/calllog/callcreation/callDetails/${rowdata.id}/nxtFlw`
       );
       console.log('rowdata',rowdata);
     });

    //to edit 
    $("#dataTable tbody").on("click", "tr .fa-edit", function () {
      let rowdata = table.row($(this).closest("tr")).data();
      navigate(
        `/tender/calllog/callcreation/callDetails/${rowdata.id}/edit`
      );
    });

    // to delete a row
    $("#dataTable tbody").on("click", "tr .fa-trash-alt", async function () {
      let rowdata = table.row($(this).closest("tr")).data();
      
      Swal.fire({
        text: `Are You sure, to delete ${rowdata.callid}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        confirmButtonColor: "#2fba5f",
        cancelButtonColor: "#fc5157",
      }).then( async (willDelete) => {
        if (willDelete.isConfirmed) {
         let response = await deleterecord(rowdata.id)

         if (response.data.status === 200) {
            Swal.fire({ //success msg
              icon: "success",
              title: "Delete Call",
              text: `${rowdata.callid} has been removed!`,
              timer: 1000,
              showConfirmButton: false,
            });

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
          }else if (response.data.status === 404) {
            Swal.fire({ // error msg
              icon: "error",
              text: response.data.message,
              showConfirmButton: true,
            });
          } else {
            Swal.fire({
              title: "Delete",
              text: response.data.message,
              icon: "error",
              timer: 1500,
            });
          }
        } 
      });
    });
  };

  useEffect(() => {
    getList();
  }, []);

  const nxtFlwCtx = createContext();

  <nxtFlwCtx.Provider value={btnNxtFlw}>
  <CallLogCreation />
</nxtFlwCtx.Provider>

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
          <thead className="text-center bg-greeny text-white">
            <tr>
              <th className="">#</th>
              <th className="">Call ID</th>
              <th className="">Customer Name</th>
              <th className="">Executive Name</th>
              <th className="">Mode</th>
              <th className="">Call Type</th>
              <th className="">Started</th>
              <th className="">Completed</th>
              <th className="">Next Follow Up</th>
              <th className="">Action</th>
            </tr>
          </thead>
          <tbody></tbody>

        </table>
      </div>
    
    </Fragment>
  );
};

export default CallLogMainList;
