import React, { useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import axios from "axios";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { useState } from "react";

const CallLogHistory = () => {
  usePageTitle("Call History");
  const { id } = useParams();
  const { server1: baseUrl } = useBaseUrl();
  const [navMode, setNavMode, callId, setCallId] = useOutletContext();
  const [getCallHistory, setGetCallHistory] = useState([]);
  const [someCallNms, setSomeCallNms] = useState({
    call_no: "",
    cust_name: "",
    call_creation_date: "",
  });

  useEffect(() => {
    if (id) {
      setCallId(id);
      setNavMode(navMode);
    }

    axios.get(`${baseUrl}/api/getcallhistory/list/${id}`).then((res) => {
      if (res.data.status === 200) {
        setGetCallHistory(res.data.getcallhistory);
        setSomeCallNms({
          ...someCallNms,
          call_no: res.data.getcallhistory[0].callid,
          cust_name: res.data.getcallhistory[0].customer_name,
          call_creation_date:
            res.data.getcallhistory[0].call_date.split(" ")[0],
        });
      }
    });
  }, []);

  // const CallHistory = getCallHistory.map((callHis, i) => (
  //   <tr key={i}>
  //     <td>{++i}</td>
  //     <td>{callHis.call_date.split(" ")[0]}</td>
  //     <td>{callHis.callname}</td>
  //     <td>{callHis.bizzname}</td>
  //     <td>{callHis.bizzstatusname}</td>
  //     <td>{callHis.additional_info ? callHis.additional_info : "--"}</td>
  //     <td>{callHis.remarks ? callHis.remarks : "--"}</td>
  //     <td>{callHis.call_date.split(" ")[0]}</td>
  //     <td>{callHis.close_date ? callHis.close_date : "--"}</td>
  //     <td>
  //       {callHis.next_followup_date ? callHis.next_followup_date : "Closed"}
  //     </td>
  //   </tr>
  // ));

  const CallHistory = getCallHistory.map((callHis, i, array) => {
    const prev = array[i - 1];
    const prevNxtFlwDate = prev ? prev.next_followup_date : '--';
    return (
      <tr key={i}>
        <td>{++i}</td>
        <td>{prevNxtFlwDate}</td>
        <td>{callHis.callname}</td>
        <td>{callHis.bizzname}</td>
        <td>{callHis.bizzstatusname ? callHis.bizzstatusname : '--'}</td>
        <td>{callHis.additional_info ? callHis.additional_info : '--'}</td>
        <td>{callHis.remarks ? callHis.remarks : '--'}</td>
        <td>{callHis.call_date.split(" ")[0]}</td>
        <td>{callHis.close_date ? callHis.close_date : '--'}</td>
        <td>{callHis.next_followup_date ? callHis.next_followup_date : 'Closed'}</td>                    
      </tr>
    )
  });

  return (
    <>
      <div className="CallLogHistory">
        <div className="card shadow">
          <div className="card-body">
            <div>
              <h6>Call No</h6>
              <h5>{someCallNms.call_no}</h5>
            </div>
            <div>
              <h6>Customer Name</h6>
              <h5>{someCallNms.cust_name}</h5>
            </div>
            <div>
              <h6>Call Creation Date</h6>
              <h5>{someCallNms.call_creation_date}</h5>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered text-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Last Follow Date</th>
                  <th>Call Type</th>
                  <th>Business Forecast</th>
                  <th>Status</th>
                  <th>Additional Info</th>
                  <th>Remarks</th>
                  <th>Started</th>
                  <th>Finished</th>
                  <th>Next Follow Up</th>
                </tr>
              </thead>
              <tbody>{CallHistory}</tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallLogHistory;
