import axios from "axios";
// import { data } from "jquery";
import { useState, useEffect,Fragment} from "react";

import Swal from "sweetalert2";

//For DataTable
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-bs4";
import jsZip from "jszip";
import "datatables.net-buttons";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useNavigate } from "react-router-dom";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
window.JSZip = jsZip;
const url = "192.168.1.25:8000";
const ULBMasterList = () => {
    
  const [loading, setLoading] = useState(true);
  const [ulblist, setUlblist] = useState([]);
const navigate=useNavigate();
  useEffect(() => {
    let isMounted = true;

    axios.get(`http://${url}/api/ulb`).then((res) => {
      if (isMounted) {
        if (res.status === 200) {
          setUlblist(res.data.ulb);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [loading]);

  const deleteHandler = (e, delete_id) => {
    // let delete_id = e.currentTarget.parentNode.getAttribute("key");
    e.preventDefault();

    Swal.fire({
        text: "Are You sure, to delete this record?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonColor: '#2fba5f',
        cancelButtonColor: '#fc5157'
    }).then((willDelete) => {

        if(willDelete.isConfirmed){
                    axios.delete(`http://${url}/api/ulb/${delete_id}`)
          .then((res) => {
            if (res.data.status === 200) {
              Swal.fire({
                icon: "success",
                text: "ULB has been removed!",
                timer: 1500 ,
                showConfirmButton: false,               
              });
              //setUlbInput({ ulbName: "", ulbStatus: "Active" });
              setLoading(true);
            } else if (res.data.status === 400) {
              Swal.fire({
                icon: "error",
                text: "Failed to delete ULB!",
                timer: 1500,
                showConfirmButton: false,
              });
            }
          });
        }
        else{
            Swal.fire({
                title: 'Cancelled',
                icon:'error',
                timer: 1500
              });
        }

        });
  };


  const editHandler = (e, update_id) => {
    
    e.preventDefault();

    Swal.fire({
        text: "Are You sure, to update this record?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No!',
        confirmButtonColor: '#2fba5f',
        cancelButtonColor: '#fc5157'
    }).then((willupdate) => {

        if(willupdate.isConfirmed){
          console.log(`/tender/master/ulbmaster/ulbcreation/${update_id}`);
            navigate(`/tender/master/ulbmaster/ulbcreation/${update_id}`);
        //     axios.get(`http://${url}/api/ulb/${update_id}`).then((res) => {
                
        // if (res.data.status === 200) {
        //   Swal.fire({
        //     icon: "success",
        //     title: "State",
        //     text: "Updated Successfully!",
        //     confirmButtonColor: "#5156ed",
        //        timer: 1500 
        //   });
          
        // } else if (res.data.status === 400) {
        //   Swal.fire({
        //     icon: "error",
        //     title: "State",
        //     text: res.data.errors,
        //     confirmButtonColor: "#5156ed",
        //   });
        }
      });
    }

           // navigate('/tender/master/ulbmaster');
//                     <Navigate  to={{
//     pathname: "/page",
//     state: data // your data array of objects
//   }}
// />
            
            
            
        //     axios.patch(`http://192.168.1.25:8000/api/ulb/${update_id}`)
        //   .then((res) => {
        //     if (res.data.status === 200) {
        //       Swal.fire({
        //         icon: "success",
        //         text: "ULB has been removed!",
        //         timer: 1500 ,
        //         showConfirmButton: false,               
        //       });
        //       //setUlbInput({ ulbName: "", ulbStatus: "Active" });
        //       setLoading(true);
        //     } else if (res.data.status === 400) {
        //       Swal.fire({
        //         icon: "error",
        //         text: "Failed to delete ULB!",
        //         timer: 1500,
        //         showConfirmButton: false,
        //       });
        //     }
        //   });
        // }
        // else{
        //     Swal.fire({
        //         title: 'Cancelled',
        //         icon:'error',
        //         timer: 1500
        //       });
        


  useEffect(() => {
    const table = $(`#dataTable`).DataTable({
      dom:
        //   "<'row'<'col-sm-12'l>>" +
          "<'row'<'col-sm-12   col-md-2 mt-2'l> <'col-sm-12  col-md-4'B> <'col-sm-12 col-md-6 mt-2'f>>" +
          "<'row'<'col-sm-12'tr>>" +
          "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",

        buttons: [
          // {
          //   extend: "print",
          //   text: '<i class="fa fa-print  mx-1" aria-hidden="true"></i> Print',
          //   className: "btn btn-info",
          // },
          // {
          //   extend: "excel",
          //   text: '<i class="fa fa-file-excel-o mx-1" aria-hidden="true"></i> Excel',
          //   className: "btn btn-success",
          // },
          // {
          //   extend: "pdf",
          //   text: '<i class="fa fa-file-pdf-o  mx-1" aria-hidden="true"></i> PDF',
          //   className: "btn btn-dark",
          // },
        ],
    });

    return () => {
        
      table.destroy();
    
    };
  }, [loading]);

  if (loading) {
    return <h4 className="text-danger">Loading ULB Master List...</h4>;
  } else {
    var ulblist_HTML = ulblist.map((ulbData, index) => {
      return (
        <tr key={ulbData.id}>
          <td className="text-center">{index + 1}</td>
          <td className="pl-3">{ulbData.ulb_name}</td>
          <td className="pl-3">Tamilnadu</td>
          <td className="text-center">{ulbData.ulb_status}</td>
          <td className="text-center">
            <span>
              <i
                className="fas fa-edit text-primary h5"
                onClick={(e)=>editHandler(e,ulbData.id )}
              ></i>
            </span>
            <span>
              <i
                className="fas fa-trash ml-4 text-danger"
                onClick={(e) => deleteHandler(e, ulbData.id)}
              ></i>
            </span>
          </td>
        </tr>
      );
    });
  }

  return (
    <Fragment>
      
      <div className="card-body">
        <div className="table-responsive">
          <table
            className="table table-bordered"
            id="dataTable"
            width="100%"
            cellSpacing={0}
          >
            <thead>
              <tr>
                <th className="text-center">SNO</th>
                <th className="text-center">ULB NAME</th>
                <th className="text-center">STATE</th>
                <th className="text-center">STATUS</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>

            <tbody>{ulblist_HTML}</tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};
export default ULBMasterList;
