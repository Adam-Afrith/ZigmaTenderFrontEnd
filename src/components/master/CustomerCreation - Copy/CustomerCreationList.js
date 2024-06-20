import { Fragment, useContext } from "react";
import { useEffect, useState } from "react";
// import RotateLoader from "react-spinners/RotateLoader";
import "./CustomerCreationList.css";
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

import axios from "axios";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { Loader } from "rsuite";
import AuthContext from "../../../storeAuth/auth-context";
import {can} from "../../../components/UserPermission"
let table;

const CustomerCreationList = () => {
  const { server1: baseUrl } = useBaseUrl();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [customerList, setCustomerlist] = useState([]);
  const authData = useContext(AuthContext);
  const {permission} = useContext(AuthContext)

  useEffect(() => {
    table = $("#dataTable").DataTable({
      data: customerList,
      columns: [
        { data: "sl_no" },
        { data: "customer_name" },
        { data: "state_name" },
        { data: "city_name" },
        { data: "customer_group" },
        { data: "buttons" },
      //  (can('customer-edit', authData.permissions) || can('customer-delete', authData.permissions)) && { data: "buttons" },
      ],
      dom:
        //   "<'row'<'col-sm-12'l>>" +
        "<'row mt-3'<'col-sm-12   col-md-6 'l>  <'col-sm-12 col-md-6 'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5 'i><'col-sm-12 col-md-7 'p>>",
    });

    $("#dataTable tbody").on("click", "tr .fa-edit", function () {
      let rowdata = table.row($(this).closest("tr")).data();
      navigate(`${location.pathname}/main/profile/${rowdata.id}`, { state: { data: {byclicking :'new' } }});
      // props.onEdit(rowdata)
    });

    $("#dataTable tbody").on("click", "tr .fa-trash-o", function () {
      let rowdata = table.row($(this).closest("tr")).data();

      deleteList(rowdata);
      // props.onDelete(rowdata)
    });
  }, []);

  const deleteList = async (data) => {
    Swal.fire({
      text: `Are You sure, to delete records of ${data.customer_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#2fba5f",
      cancelButtonColor: "#fc5157",
    }).then(async (willDelete) => {
      if (willDelete.isConfirmed) {
        let response = await axios.delete(
          `${baseUrl}/api/customercreationprofile/${data.id}`
        );
        if (response.data.status === 200) {
          getlist();
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          toast.error("Unable to Delete!", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      }
    });
  };

  
  const getlist = async () => {
    setLoading(true);
    let response = await axios.get(`${baseUrl}/api/customercreationprofile`);
    // let userPermissions = authData.permission
   


    let list = [...response.data.customercreationList];
    let listarr = list.map((item, index, arr) => {
      let editbtn = !!(permission?.Customers?.can_edit) ? '<i class="fas fa-edit text-success mx-2 h6" style="cursor:pointer" title="Edit"></i> ' : '';
      let deletebtn =  !!(permission?.Customers?.can_delete) ?  '<i class="fa fa-trash-o  text-danger h6  mx-2" style="cursor:pointer; font-size: 1.25rem"  title="Delete"></i>' : '' ;
    return {
      ...item,
      customer_group:
        item.smart_city === "yes" ? "Smart City" : "Non Smart City",
        
      buttons: editbtn + deletebtn,
      sl_no: index + 1,
    }});
    table.clear().rows.add(listarr).draw();
    setLoading(false);
  };

  useEffect(() => {
    getlist();
  }, []);

  return (
    <Fragment>
      <div className="CustomerCreationList">
        <div className="Content-display">
          {/* {loading && <div className="spinner">
                    <RotateLoader
                    color="#36d6d1"
                    cssOverride={{}}
                    loading
                    margin={15}
                    size={15}
                    speedMultiplier={1} />
                  </div>} */}
          {loading && (
            <div className="loading">
              <img
                id="loading-image"
                src="/assets/img/282.gif"
                alt="Loading..."
              />
            </div>
          )}
          <ToastContainer />

          <div className="table-responsive pb-3">
            <table
              className="table table-bordered  text-center"
              id="dataTable"
              width="100%"
              cellSpacing={0}
            >
              <thead className="text-center bg-greeny text-white">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">State Name</th>
                  <th scope="col">City Name</th>
                  <th scope="col">Customer Group</th>
                  {/* {(can('customer-edit', authData.permissions) || can('customer-delete', authData.permissions)) &&  <th scope="col">Action</th>} */}
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CustomerCreationList;
