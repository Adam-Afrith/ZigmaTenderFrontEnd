import axios from "axios";
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
    useTable,
    useSortBy,
    usePagination,
    useGlobalFilter,
} from "react-table";
import { useBaseUrl } from "../../hooks/useBaseUrl";


// const data = [
//     { call_no: 'John', customer_name: 25, call_type: 'John', status: 25, next_follow_up_date: 'John', started: 25, finished: 25 },
//     { call_no: 'david', customer_name: 25, call_type: 'John', status: 25, next_follow_up_date: 'David', started: 25, finished: 25, },
//     // Add more data objects as needed
//   ];

const CallReportTable = ( {change, input, check} ) => {
    const {server1: baseUrl} = useBaseUrl();    
    const [data, setData] = useState([]);      

    const columns = useMemo(
        () => [
            {
                Header: "#",
                accessor: (row, index) => index + 1,
            },
            {
                Header: "Call No",
                accessor: "callid",
                // defaultCanSort: true,
                sortable: true,
            },
            {
                Header: "Customer Name",
                accessor: "customer_name",
                // defaultCanSort: true,
                sortable: true,
            },
            // {
            //     Header: "Call Type",
            //     accessor: "call_type",
            //     // defaultCanSort: true,
            //     sortable: true,
            // },
            {
                Header: "Status",
                accessor: "action",
                // defaultCanSort: true,
                sortable: true,
            },
            {
                Header: "Next Follow Up Date",
                accessor: "next_followup_date",
                // defaultCanSort: true,
                sortable: true,                
            },
            {
                Header: "Started",
                accessor: "call_date",
                // defaultCanSort: true,
                sortable: true,                
            },
            {
                Header: "Finished",
                accessor: "close_date",
                // defaultCanSort: true,
                sortable: true,                
            },            
        ],
        []
    );

    const tableInstance = useTable( { columns, data, }, useGlobalFilter, useSortBy, usePagination );

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

    useEffect(()=> {        
        axios.post(`${baseUrl}/api/getdaywisereport/list`,change).then((resp)=> { 
            const dayWiseReport = resp.data.daywisereport.map((dwr)=> ({
                callid : dwr.callid,
                customer_name : dwr.customer_name,
                // call_type : dwr.call_type,
                action: dwr.action,
                call_date: dwr.call_date,
                close_date : dwr.close_date ? dwr.close_date : '--' ,
                next_followup_date: dwr.next_followup_date ? dwr.next_followup_date : '--'
            }))              
            setData(dayWiseReport);
            // console.log('change', change);             
            console.log('data+++', resp.data.daywisereport);     
        })
    },[change]);
        
   
    // console.log('page',page);
    return (        
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
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="d-flex ">                    
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
                       <i className="fas fa-chevron-circle-left" />
                    </button>
                </div>
                <div className="col-auto">
                    <button
                        className="btn btn-sm mr-1 bg-greeny text-white font-weight-bold"
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                    >
                        <i className="fas fa-chevron-circle-right" />
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
        </div>

    );
};
export default CallReportTable;
