import { usePageTitle } from "../../../hooks/usePageTitle";
import Bidders from "./Bidders/Bidders";
import TechnicalEvalution from "./TechnicalEvalution/TechnicalEvalution";
import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import axios from "axios";
import { useBaseUrl } from "../../../hooks/useBaseUrl";
import Swal from "sweetalert2";
import FinancialEvalution from "./FinancialEvalution/FinancialEvalution";
import AwardContract from "./AwardContract/AwardContract";
const TenderStatus = () => {
  usePageTitle("Update Bids Management");
  const [toastSuccess, toastError, setBidManagementMainId, bidManageMainId] =
    useOutletContext();
  const { server1: baseUrl } = useBaseUrl();
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState();
  let tokenId = localStorage.getItem("token");
  const { id } = useParams();
  const [seed, setSeed] = useState(1);

  useEffect(() => {
    getBidders();
  }, []);

  useEffect(() => {
    if (id) {
      setBidManagementMainId(id);
    }
  }, []);

  const getBidders = () => {
    axios
      .get(`${baseUrl}/api/tenderstatus/getbidder/${bidManageMainId}`)
      .then((response) => {
        if (response.data.status === 200) {
          setStatus(response.data.bidders.tenderstatus);
        }
      });
  };

  const updateTenderStatus = () => {
    setLoading(true);
    let data = {
      tenderstatus: "Cancelled",
      tokenId: tokenId,
    };
    if (data.tenderstatus != "" && data.tokenId != "") {
      axios
        .post(
          `${baseUrl}/api/tenderstatus/updatestatus/${bidManageMainId}`,
          data
        )
        .then((resp) => {
          if (resp.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Tender Status",
              text: resp.data.message,
              timer: 2000,
            }).then(function () {
              setLoading(false);
              setStatus("Cancelled");
            });
          } else if (resp.data.status === 404) {
            Swal.fire({
              icon: "error",
              title: "Tender Status",
              text: resp.data.errors,
              confirmButtonColor: "#5156ed",
            }).then(function () {
              setLoading(false);
            });
          }
        });
    }
  };
  const errorUpdate = () => {
    Swal.fire({
      icon: "success",
      title: "Tender Status",
      text: "Not able to Update",
      timer: 2000,
    }).then(function () {
      setLoading(false);
    });
  };

  const reloadFunction = () => {
    setSeed(Math.random());
  };

  return (
    <div className="formContent">
      {!bidManageMainId && (
        <div className="loading">
          <img
            id="loading-image"
            src="/assets/img/lock.png"
            alt="Loading..."
            width="150"
            height="150"
          />
        </div>
      )}

      {/* Biddres Form */}
      <div className="card mb-2  ">
        <a
          href="#bidders"
          className="d-block card-header py-3 bg-white "
          data-toggle="collapse"
          role="button"
          aria-expanded="true"
          aria-controls="bidders"
        >
          <h6 className="m-0 font-weight-bold text-dark">BIDDERS</h6>
        </a>
        {/* Card Content - Collapse */}
        <div className="collapse" id="bidders">
          <div className="card-header">
            <Bidders key={seed} reloadFunction={reloadFunction} />
          </div>
        </div>
      </div>

      {/* Technical Evaluation Form */}
      <div className="card mb-2  ">
        <a
          href="#technicalEvaluation"
          className="d-block card-header py-3 bg-white "
          data-toggle="collapse"
          role="button"
          aria-expanded="true"
          aria-controls="technicalEvaluation"
        >
          <h6 className="m-0 font-weight-bold text-dark">
            TECHNICAL EVALUATION
          </h6>
        </a>
        {/* Card Content - Collapse */}
        <div className="collapse" id="technicalEvaluation">
          <div className="card-header">
            <TechnicalEvalution key={seed} reloadFunction={reloadFunction} />
          </div>
        </div>
      </div>

      {/* Financial Evaluation Form */}
      <div className="card mb-2  ">
        <a
          href="#financialevaluation"
          className="d-block card-header py-3 bg-white "
          data-toggle="collapse"
          role="button"
          aria-expanded="true"
          aria-controls="financialevaluation"
        >
          <h6 className="m-0 font-weight-bold text-dark">
            FINANCIAL EVALUATION
          </h6>
        </a>

        {/* Card Content - Collapse */}
        <div className="collapse" id="financialevaluation">
          <div className="card-header">
            <FinancialEvalution key={seed} reloadFunction={reloadFunction} />
          </div>
        </div>
      </div>

      {/* Award of Contract Form */}
      <div className="card mb-2  ">
        <a
          href="#awardcontract"
          className="d-block card-header py-3 bg-white "
          data-toggle="collapse"
          role="button"
          aria-expanded="true"
          aria-controls="awardcontract"
        >
          <h6 className="m-0 font-weight-bold text-dark">AWARD OF CONTRACT</h6>
        </a>
        {/* Card Content - Collapse */}
        <div className="collapse" id="awardcontract">
          <div className="card-header">
            <AwardContract key={seed} reloadFunction={reloadFunction} />
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-lg-6">
          <label className="border border-info rounded-lg px-5 py-2 text-info font-weight-bolder h6">
            {status === "Completed"
              ? "Tender Completed"
              : status === "Cancelled"
              ? "Tender Cancelled"
              : "If Tender Cancelled Click Here"}
          </label>
        </div>
        <div className="col-lg-6">
          <button
            className="btn btn-primary rounded-lg px-5 py-2 text-white h6 float-right"
            onClick={status === "Pending" ? updateTenderStatus : errorUpdate}
            disabled={
              (status === "Pending") | (status === undefined) ? false : true
            }
            style={
              status !== "Pending" ? { display: "none" } : { display: "block" }
            }
          >
            {(status === undefined) | (status === "Pending") ? "Cancel" : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenderStatus;
