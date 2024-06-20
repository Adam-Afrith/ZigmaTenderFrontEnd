import axios from "axios";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { Link } from "react-router-dom";
import { Fragment,  useContext,  useEffect, useState } from "react";
import {  useNavigate,useParams } from "react-router-dom";
// import Swal from "sweetalert2";

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
import { useBaseUrl } from "../../hooks/useBaseUrl";
import Swal from "sweetalert2/src/sweetalert2";
import { Loader } from "rsuite";
import AuthContext from "../../../storeAuth/auth-context";
// import { can } from "../../../UserPermission";

let table;
const CompetitorCreation = () => {
  useDocumentTitle("Competitor Creation");
  usePageTitle("Competitor Master");
  const { server1: baseUrl } = useBaseUrl();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {permission} = useContext(AuthContext)
  const { id } = useParams();


  const deleterecord = async (id) => {
    let response =  axios.delete(`${baseUrl}/api/competitorprofile/${id}`)
    return response;
  }

  const getList = async () => {
    const competitorlist = await axios.get(`${baseUrl}/api/competitorprofile`);
  
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
      competitorlist.status === 200 &&
      competitorlist.data.status === 200
    ) {
      let list = [...competitorlist.data.competitor];
      let listarr = list.map((item, index, arr) => {
        let editbtn = !!(permission?.["Competitors"]?.can_edit) ? '<i class="fas fa-edit text-info mx-2 h6" style="cursor:pointer" title="Edit"></i> ' : '';
            let deletebtn =  !!(permission?.["Competitors"]?.can_delete)  ?  '<i class="fas fa-trash-alt text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>' : '';

        
        return {

        ...item,
        // status : (item.activeStatus ===  "active") ? `<span class="text-success font-weight-bold"> Active </span>` : `<span class="text-warning font-weight-bold"> Inactive </span>`,
        // action: `<i class="fas fa-edit text-info mx-2 h6" style="cursor:pointer" title="Edit"></i> <i class="fas fa-trash-alt text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>`,
        // action: (item.name === "Admin" || item.name === "admin") ? '' :( editbtn + deletebtn),
        action:  editbtn + '' + ((item.role_id === 1) ? '' : deletebtn) ,
        sl_no: index + 1,
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
        { data: "compNo" },
        { data: "compName" },
        { data: "mobile" },
        { data: "email" },
        { 
          data: "action",
          className: "exclude-action",  
        },
        // { data: "action" },
      ],
      buttons:[
        {
          extend: "print",
          text: '<i class="fa fa-print  mx-1" aria-hidden="true"></i><span class="print">Print</span>',
          className: "btn btn-info",
          exportOptions: {
              columns: ':not(.exclude-action)', 
            },
        },
        {
          extend: "excel",
          text: '<i class="fa fa-file-excel-o mx-1" aria-hidden="true"></i> <span class="excel">Excel</span>',
          className: "btn btn-success",
          exportOptions: {
            columns: ':not(.exclude-action)',
          },
        },
        
      ]
    })
    table.buttons().container().appendTo("#dataTable_wrapper .dataTables_filter");
    setLoading(false)
    //to edit 
    $("#dataTable tbody").on("click", "tr .fa-edit", function () {
      let rowdata = table.row($(this).closest("tr")).data();
      console.log('ROW DATA--',rowdata)
      navigate(
        `competitor/profile/${rowdata.id}`
      );
    });
    

    // to delete a row
    $("#dataTable tbody").on("click", "tr .fa-trash-alt", async function () {
      let rowdata = table.row($(this).closest("tr")).data();
      
      Swal.fire({
        text: `Are You sure, to delete ${rowdata.compName}?`,
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
              title: `${rowdata.compName} `,
              text: `${rowdata.compName} has been removed!`,
              timer: 1500,
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

  return (
    <Fragment>
       <div className="container-fluid p-0">
        <div className="row">
          <div className="col-lg-12">
            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="float-right mb-3">
                  {!!(permission?.Competitors?.can_add) ? <Link
                    to={id ? "competitor/profile/${id}" : "competitor/profile"}
                    className="btn btn-primary btn-icon-split"
                  >
                    <span className="icon text-white-50">
                      <i className="fas fa-plus-circle" />
                    </span>
                    <span className="text res-720-btn-none">New</span>
                  </Link> : ''}
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
                        <th className="w-5">Sl.No</th>
                        <th className="w-15">Competitor No</th>
                        <th className="w-25">Competitor Name</th>
                        <th className="w-15">Mobile Number</th>
                        <th className="w-25"> Email Id</th>
                        <th className="w-15">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {loading && <Loader size="lg" backdrop content="Fetching Data..." />}
      </div>      
    </Fragment>
  );
};

export default CompetitorCreation;