import React, { useState,useMemo, useEffect, useRef} from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import axios from "axios";
import Swal from "sweetalert2/src/sweetalert2";
import { Input, Loader } from "rsuite";
import AuthContext from "../../../../storeAuth/auth-context";
import { useBaseUrl } from "../../../hooks/useBaseUrl";
import "./callDataTable.css";
const CustomerList1=(props)=>{
    const [data,setData]=useState([]);
    const [input,setInput]=useState([]);
    const { server1: baseUrl } = useBaseUrl();
    
    useEffect(() => {
        getList();
      }, [props]);

    useEffect (()=>{
      if(data?.length > 0)
      {
        let tableData = data;
      }
    },[data])

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
        setData(List.data.customerList)
        console.log("List", List)
    }

    function handleCellEdit(rowId, columnId, value) {
      // Update the data source with the new value
      setData((prevState) =>
        prevState.map((row) =>
          row.id === rowId ? { ...row, [columnId]: value } : row
        )
      );
    }

useEffect(()=>{
  
if(input?.length>0 || Object.keys(input)?.length >0)
{
  props.setIsEdited(true);
}
else{
  props.setIsEdited(false);
}
},[input])

const updateStatus= (e,row)=>{

    setInput((prev) => {
      return {
        ...prev,
        [row.original.id]: row.original.assign_status === 0 ? 1 : 0,
      };
    });

    setData((prevState) =>
    prevState.map((datarow) =>
    datarow.id === row.original.id ? { ...row.original, assign_status: row.original.assign_status === 0 ? 1 : 0 } : datarow
    )
  );

}

console.log("Input", input);
console.log("Data", data);
// function DataTable({ data }) {
  const columns = useMemo(
    () => [
        {
            Header: '#',
            accessor: (row, index) => index + 1,
          },
      {
        Header: 'Name',
        accessor: 'customer_name',
        sortType: 'alphanumeric',
      },{
        Header: 'Country',
        accessor: 'country_name',
        sortType: 'alphanumeric',
      },
      {
        Header: 'State',
        accessor: 'state_name',
        sortType: 'alphanumeric',
      },
      {
        Header: 'District',
        accessor: 'district_name',
        sortType: 'alphanumeric',
      },
      {
        Header: 'Assign Status',
        accessor: 'assign_status',
        Cell: ({value , row}) => (
            <button className={value ?  "btn btn-success btn-circle btn-sm" : "btn btn-outline-danger btn-circle btn-sm" }onClick={e => updateStatus(e, row)}>
            <i className={value ? 'fas fa-check' : 'fas fa-close'}></i>
          </button>
        ),
      },
    ],
    []
  );

  

  const tableInstance = useTable(
    { columns, data, initialState: {
        sortBy: [
          {
            id: 'id',
            asc: true,
          },
        ],
      }, },
    useGlobalFilter,
    useSortBy,
    usePagination,
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

  return (
    <div className="table-responsive pb-3">
      <div className ="d-flex justify-content-between mb-2">
      <div className="">
        <input
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className='form-control p-2'
          width = "25%"

        />
      </div>
      
      <div className="d-flex ">
        {/* <button name="print" >Print</button>
        <button name="export" className="mx-3">Excel1</button> */}
        <input
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className='form-control'
        />
      </div>
      </div>
      
      <table className="table table-bordered text-center"
              id="dataTable"
              width="100%"
              cellSpacing={0} {...getTableProps()}>
        <thead className="p-3 mb-2 text-center bg-greeny text-white">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span className ="text-right">
                    {"   "}{column.isSorted ? (column.isSortedDesc ? <i className="fas fa-sort-amount-asc text-white"></i> : <i className="fas fa-sort-amount-desc text-white"></i>) : "" }
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
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button className="btn  btn-sm mr-1 bg-greeny text-white font-weight-bold"  onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<<"}
        </button>
        <button className="btn  btn-sm mr-1 bg-greeny text-white font-weight-bold" onClick={() => nextPage()} disabled={!canNextPage}>
        {">>"}
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' $$'}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(pageNumber);
            }}
            style={{ width: '50px' }}
          />
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
export default CustomerList1;