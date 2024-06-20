import { Fragment, useContext, useEffect, useState } from "react";
import PreLoader from "../../UI/PreLoader";

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

import axios from "axios";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import Swal from "sweetalert2";
import { usePageTitle } from "../../hooks/usePageTitle";
import FilesModal from "./FilesModal";
import AuthContext from "../../../storeAuth/auth-context";
import { can } from "../../UserPermission";



let table;

const CommunicationFilesList = (props) => {

    // usePageTitle('Bid Management List');

    const [communicationfilesList, setcommunicationfilesList] = useState([])
    const { server1: baseUrl } = useBaseUrl();
    const [loading, setLoading] =  useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [mainId, setMainId] = useState(null);
    const {permission} = useContext(AuthContext)

    useEffect(() => {
      
        table =  $('#dataTable').DataTable({
            data : communicationfilesList,
            columns: [
                { data: 'sl_no' },
                { data: 'date' },
                { data: 'fromvalue' },
                { data: 'tovalue' },
                { data: 'medium' },
                { data: 'med_refrence_no'},
                { data: 'Files'},
                { data: "action"},
                // { data: 'current_stage' },
               // { data: 'action' },
            ],

            buttons:[
              {
                extend: "print",
                text: '<i class="fa fa-print  mx-1" aria-hidden="true"></i> <span class="print">Print</span>',
                className: "btn btn-info",
                exportOptions: {
                    // columns: ':not(.exclude-action)', 
                    columns: [0, 1, 2, 3, 4, 5], //Except Files 6 and action 7 columns
                  },
              },
              {
                extend: "excel",
                text: '<i class="fa fa-file-excel-o mx-1" aria-hidden="true"></i> <span class="excel">Excel</span>',
                className: "btn btn-success",
                exportOptions: {
                  columns: ':not(.exclude-action)',
                  columns: [0, 1, 2, 3, 4, 5], //Except Files 6 and action 7 columns
                },
              },
            ],
            // dom:
            // //   "<'row'<'col-sm-12'l>>" +
            //   "<'row'<'col-sm-12   col-md-6 pl-4'l>  <'col-sm-12 col-md-6 pr-4'f>>" +
            //   "<'row'<'col-sm-12'tr>>" +
            //   "<'row'<'col-sm-12 col-md-5 pl-4'i><'col-sm-12 col-md-7 pr-4'p>>",
    
        })
        table.buttons().container().appendTo("#dataTable_wrapper .dataTables_filter");
    
        $('#dataTable tbody').on('click', 'tr .fa-edit', function () {
          let rowdata =table.row($(this).closest('tr')).data();
        
          navigate(
            `/tender/library/communicationfiles/communicationfilescreation/` +
            rowdata.id
          );
          // if(rowdata.bidid !== null){
          //   navigate(`${location.pathname}/main/bidcreationmain/${rowdata.tenderid}/${rowdata.bidid}`)
          // }
          
          // if(rowdata.bidid === null){
          //   navigate(`${location.pathname}/main/bidcreationmain/${rowdata.tenderid}`)
          // }
          // props.onEdit(rowdata)
        });
    
        $('#dataTable tbody').on('click', 'tr .fa-trash-o', function () {
          let rowdata = table.row($(this).closest('tr')).data();
         
            deleteList(rowdata)
          // props.onDelete(rowdata)
        });

        
        $('#dataTable tbody').on('click', 'tr .fa-cloud-download ', function () {
          let rowdata = table.row($(this).closest('tr')).data();
              // console.log(rowdata)
              setMainId(rowdata.id)
          // deleteList(rowdata)
          // props.onDelete(rowdata)
        });
      }, [])

      useEffect(() => {
       getList()
      }, [])

      const getList = async () => {
        setLoading(true)
    
        let response = await axios.get(`${baseUrl}/api/communicationfilesmaster`)
        // console.log(response.data.communicationFiles)
        let listarr = await generateListArray(response)
        table.clear().rows.add(listarr).draw();
        // setListarr(listarr)
        setLoading(false)
      }

      const generateListArray = async (response) =>{

        let list = [...response.data.communicationFiles];
        
        let userPermissions ;
        let data = {
          tokenid : localStorage.getItem('token')
        }
    
        let rolesAndPermission = await axios.post(`${baseUrl}/api/getrolesandpermision`, data)
        if(rolesAndPermission.status === 200){
          userPermissions = rolesAndPermission.data;
        }

        let listarr = list.map((item, index, arr)=> {
          
          let editbtn = !!(permission?.['Communication Files']?.can_edit) ? '<i class="fas fa-edit text-success mx-2 h6" style="cursor:pointer" title="Edit"></i>  ' : '' ;
          let deletebtn = !!(permission?.['Communication Files']?.can_delete) ? '<i class="fa fa-trash-o  text-danger h6  mx-2" style="cursor:pointer; font-size: 1.25rem"  title="Delete"></i>' : '' ;
          return {
          ...item,
          date    : item.date ? FormattedDate(item.date) : '',
          Files   : `<i class="fa fa-cloud-download text-primary mx-2 h6" style="cursor:pointer; font-size: 1.25rem" title="Files"  data-toggle="modal"
          data-target="#filesCloud" ></i> `,
          // action  :`
          // <i class="fas fa-edit text-success mx-2 h6" style="cursor:pointer" title="Edit"></i> 
          // <i class="fa fa-trash-o  text-danger h6  mx-2" style="cursor:pointer; font-size: 1.25rem"  title="Delete"></i>`,
          action  : editbtn+deletebtn,
          sl_no   : index+1
        }})
    
        return listarr;
      }

      const FormattedDate = (date) => {
        const targetdate = new Date(date);
        const yyyy = targetdate.getFullYear();
        let mm = targetdate.getMonth() + 1; // Months start at 0!
        let dd = targetdate.getDate();
    
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
    
        const formattedDate = dd + '-' + mm + '-' + yyyy;
        return formattedDate
      }

      // useEffect(() => {
      //   if(Array.isArray(props.list)){
      //     table.clear().rows.add(props.list).draw();
      //   }
      // }, [props.list])

      const deleteList = async (data) => {
        Swal.fire({
          text: `Are You sure, to delete this record?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
          confirmButtonColor: '#2fba5f',
          cancelButtonColor: '#fc5157'
      }).then(async (willDelete) => {
        if(willDelete.isConfirmed){
          let response =  await axios.delete(`${baseUrl}/api/communicationfilesmaster/${data.id}`);
          if(response.data.status === 200){
            getList()
            toast.success( response.data.message , {
              position: toast.POSITION.TOP_CENTER
            });
          }else{
            toast.error("Unable to Delete!" , {
              position: toast.POSITION.TOP_CENTER
            });
          }
        }
      })
    
    
      }

    return (
        <Fragment>
            <PreLoader loading={loading}>
                <ToastContainer />
                <div className="table-responsive pb-3">
                    <table
                        className="table table-bordered text-center"
                        id="dataTable"
                        width="100%"
                        cellSpacing={0}
                    >
                        <thead className="text-center bg-greeny text-white">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Date</th>
                                <th scope="col">From</th>
                                <th scope="col">To</th>
                                <th scope="col">Medium</th>
                                <th scope="col">Med. reference no</th>
                                <th scope="col">Files</th>
                                {/* <th scope="col">Current Stage</th> */}
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </PreLoader>
            <FilesModal mainId ={mainId}/>
        </Fragment>
    )
}

export default CommunicationFilesList