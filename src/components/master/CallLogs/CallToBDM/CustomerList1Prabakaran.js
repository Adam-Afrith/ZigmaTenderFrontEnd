import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import axios from "axios";
import Swal from "sweetalert2/src/sweetalert2";
import { Input, Loader } from "rsuite";
import AuthContext from "../../../../storeAuth/auth-context";
import { useBaseUrl } from "../../../hooks/useBaseUrl";
// import AssignedCustomerModal from './AssignedCustomerModal';
import "./callDataTable.css";


let data = [];
const CustomerList1 = (props) => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const { server1: baseUrl } = useBaseUrl();
  const showModel = useRef(0);
  const selectAllRef = useRef(0);
  useEffect(() => {
    setData(props.data);
  }, [props]);

  
  useEffect(() => {
    if (input?.length > 0 || Object.keys(input)?.length > 0) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
  }, [input]);

  const updateStatus = (e, row) => {

    setData((prevState) =>
    prevState.map((datarow) =>
      datarow.id == row.original.id
        ? {
            ...row.original,
            assign_status: row.original.assign_status != 1 ? 1 : 0,
          }
        : datarow
    )
  );
    setInput((prev) => {
      return {
        ...prev,
        [row.original.id]: row.original.assign_status != 1 ? 1 : 0,
      };
    });

  };

  const selectEntireList = () =>{
    selectAllRef.current = selectAllRef.current === 1 ? 0 : 1;
  }

useEffect(()=>{
  if(selectAllRef.current === 1 || selectAllRef.current === 0 )
  {
   let newObj = {};  
   data.forEach((item)=>{
    newObj[item.id] = selectAllRef.current;
    })
    
    setData((prevState) =>
    prevState.map((datarow) =>
      {return{...datarow, assign_status: selectAllRef.current}}
    )
  );
  setInput(newObj);
  }
  
},[selectAllRef.current])

const handlePrint = () => {
  window.print();
};

const updateRef = () =>{
  showModel.current = showModel.current != 1 ? 1 : 0;
}

const handleExport = () => {
  // const headers = columns.map(column => column.name);
  const headers = ['Sno', 'Customer Name', 'Country', 'State', 'District', 'City','BDM Name','Assign Status'];
  console.log("header", headers)
  const csv = [
    "ASSIGNED CUSTOMERS REPORT",
    headers.join(','),
    
    ...data.map((row,index) => {
      if(row.assign_status == '1')
      {
        return `${index + 1},${row.customer_name},${row.country_name},${row.state_name},${row.district_name}, ${row.city_name},${props.userName.current},"Assigned"`; 
      }
      else{
        return null; // Return null for the empty row
      }
    })   
  ].filter(row => row !== null) // Filter out the null values
  .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'Call_Assigned_list_'+props.id+'.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};


  const columns = useMemo(
    () => [
      {
        Header: "SNo",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Name",
        accessor: "customer_name",
        // defaultCanSort: true,
        sortable: true,
      },
      {
        Header: "Country",
        accessor: "country_name",
        // defaultCanSort: true,
        sortable: true,
      },
      {
        Header: "State",
        accessor: "state_name",
        // defaultCanSort: true,
        sortable: true,
      },
      {
        Header: "District",
        accessor: "district_name",
        // defaultCanSort: true,
        sortable: true,
      },
      {
        Header: () => (
          <div>
            Assign Status{" "}&nbsp;&nbsp;
            <button onClick={() => selectEntireList()} 
            data-toggle="tooltip"
            data-placement="top"
            className={
              selectAllRef.current === 1 
                ? "btn btn-light btn-circle btn-sm"
                : "btn btn-light btn-circle btn-sm" } title={selectAllRef.current === 0 ? 'Click to Select All' : 'Click to Remove All'}>
            <i className={selectAllRef.current === 1 ? "fas fa-check text-success" : "fas fa-close text-danger"}/>
            </button>
          </div>
        ),
        accessor: "assign_status",
        sortable: true,
        Cell: ({ value, row }) => (
          <button
            className={
              value == 1
                ? "btn btn-success btn-circle btn-sm"
                : "btn btn-outline-danger btn-circle btn-sm"
            }
            onClick={(e) => updateStatus(e, row)}
           
          >
            <i className={value == 1 ? "fas fa-check" : "fas fa-close"}></i>
          </button>
        ),
      },
    ],
    []
  );
  

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  } = tableInstance;

  const submitList = () =>{
    setIsSubmitted(true);
    console.log("Input",input);


    let datatosend = {
      input : input,
      bdm_id: props.id,
      tokenid: localStorage.getItem("token"),
    }

    if (input?.length > 0 || Object.keys(input)?.length > 0) {
    axios.post(`${baseUrl}/api/calltobdm/updateAssignedCustomer`, datatosend).then((resp)=>{
      if(resp.data.status === 200)
      {
        Swal.fire({
          icon: "success",
          title: "Call Assign",
          text:  resp.data.message,
          confirmButtonColor: "#5156ed",
        });
      }
    else if (resp.data.status === 400) {
      Swal.fire({
        icon: "error",
        title: "Call Assign",
        text: resp.data.errors,
        confirmButtonColor: "#5156ed",
      });
     
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Call Assign",
        text: "Provided Credentials are Incorrect",
        confirmButtonColor: "#5156ed",
      }).then (()=>{
        localStorage.clear();
      });
    }
    setIsSubmitted(false);
  }).catch((err) => {
      Swal.fire({
          icon: "error",
          title: "Call Assigning",
          text:  (err.response.data.message || err),
          confirmButtonColor: "#5156ed",
        })

        setIsSubmitted(false);
    });   
    
  }

  }

  return (
    <>
    <div className="table-responsive pb-3">
      <div className="d-flex justify-content-between mb-2">
        <div className="">
          <select
            className="form-control"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex ">
          {/* <button name="modal" className="btn" onClick={updateRef}><i className="fas fa-info-circle fa-lg text-warning" aria-hidden="true"></i></button> */}
          {/* <button name="print" className="btn" onClick={handlePrint}><i className="fas fa-print fa-lg text-success" aria-hidden="true"></i></button> */}
          <button name="export" className="btn" onClick={handleExport}><i className="fas fa-file-excel fa-lg text-success"></i></button>
          <input
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="form-control"
          />
        </div>
      </div>

      <table
        className="table table-bordered text-center"
        id="dataTable"
        width="100%"
        cellSpacing={0}
        {...getTableProps()}
      >
        <thead className="p-3 mb-2 text-center bg-greeny text-white">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span className="text-right">
                    {column.defaultCanSort && column.isSorted ? (
                      column.isSortedDesc ? (
                        <i className="fas fa-sort-amount-asc text-white"></i>
                      ) : (
                        <i className="fas fa-sort-amount-desc text-white"></i>
                      )
                    ) : (
                      <span></span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="row align-items-center">
        <div className="col-auto">
          <button
            className="btn btn-sm mr-1 bg-greeny text-white font-weight-bold"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {"<<"}
          </button>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-sm mr-1 bg-greeny text-white font-weight-bold"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {">>"}
          </button>
        </div>
        <div className="col-auto">
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
        </div>
        <div className="col-auto">
          <span> {"| "} &nbsp;&nbsp;Go to page: </span>
        </div>
        <div className="col-sm-1">
          <input
            className="form-control"
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const pageNumber = e.target.value
                ? Number(e.target.value) - 1
                : 0;
              gotoPage(pageNumber);
            }}
          />
        </div>
      </div>


      <div className="inputgroup col-lg-12 mb-4 ml-3 mt-3">
                                <div className="row align-items-center">
                                    <div className="col-lg-12 text-right ">
                                        <button
                                            className="btn btn-primary"
                                            disabled={!isEdited}
                                            onClick={submitList}
                                        >
                                            {isSubmitted && <span className="spinner-border spinner-border-sm mr-2"></span>}
                                            {isSubmitted === true ? ((props.id) ? 'Updating...' : "Submitting....") : ((props.id) ? 'Update' : "Save")}

                                        </button>
                                        <button className="btn btn-secondary mx-3" onClick={props.cancelHandler} disabled={isSubmitted}>
                                            Cancel
                                        </button>
                                    </div>
s
                                </div>
                            </div>
                            
    </div>
    {/* <AssignedCustomerModal showModal = {showModel} updateRef={updateRef} data={data}/> */}
    </>
    
    );
};
export default CustomerList1;





