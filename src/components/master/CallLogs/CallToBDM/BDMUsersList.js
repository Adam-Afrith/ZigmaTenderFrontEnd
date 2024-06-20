import axios from "axios";
import { Fragment, useContext, useEffect, useState } from "react";
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
import { Loader } from "rsuite";
import AuthContext from "../../../../storeAuth/auth-context";
import { useBaseUrl } from "../../../hooks/useBaseUrl";

let table;
const BDMUsersList = () => {
    const { server1: baseUrl } = useBaseUrl();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { permission } = useContext(AuthContext)
    const authcontext = useContext(AuthContext)

    useEffect(() => {
        getList();
    }, []);

    const deleterecord = async (id) => {
        let response = axios.delete(`${baseUrl}/api/calltobdm/${id}`)
        return response;
    }

    const generateCustomerList = (customerList = []) => {
        let Customers = ''

        customerList.forEach((item, index) => {
            if((customerList.length-1) === index){
                Customers += '<p>'+item.customer.customer_name+'. </p>'
            }else{
                Customers += '<p>'+item.customer.customer_name+', </p>'
            }
        })

        return Customers
    }

    const getList = async () => {
        let data = {
            tokenid : localStorage.getItem('token')
          }
        const List = await axios.post(`${baseUrl}/api/bdmoptions`,data);

        var dataSet;
        if (
            List.status === 200
        ) {
            let list = [...List.data.user];
            
            let listarr = list.map((item, index, arr) => {
                let editbtn = !!(permission?.call_to_bdm?.can_edit) ? '<i class="fas fa-edit text-info mx-2 h6" style="cursor:pointer" title="Edit"></i> ' : '';
                let deletebtn = !!(permission?.call_to_bdm?.can_delete) ? '<i class="fas fa-trash-alt text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>' : '';
                return {
                    ...item,
                    staffName : item.userName,
                    action: editbtn + deletebtn,
                    sl_no: index + 1,
                }
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
                { data: "staffName" },
                // { data: "CustomerName" },
                { data: "action" },
            ],
        })
        setLoading(false)

        $("#dataTable tbody").on("click", "tr .fa-edit", function () {
            
            let rowdata = table.row($(this).closest("tr")).data();
            navigate(
                `/tender/calllog/calltobdm/edit/${rowdata.id}`
            );
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
                    let response = await deleterecord(rowdata.id)

                    if (response.data.status === 200) {
                        Swal.fire({ //success msg
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
                        Swal.fire({ // error msg
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

    }


    return(
        <Fragment>
            <div>
                {loading && <Loader size="lg" backdrop content="Fetching Data..." />}
            </div>
            <div className="table-responsive card p-4">
                <table
                className="table table-bordered text-center"
                id="dataTable"
                width="100%"
                cellSpacing={0}
                >
                <thead className="p-3 mb-2 text-center bg-greeny text-white">
                    <tr>
                    <th className="">Sl.No</th>
                    <th className="">BDM name</th>
                    <th className="">Action</th>
                    </tr>
                </thead>
                <tbody></tbody>
                </table>
            </div>
        </Fragment>
    )

}

export default BDMUsersList;