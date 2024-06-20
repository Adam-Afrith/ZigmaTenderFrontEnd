import axios from "axios";
import { useState, useEffect, Fragment } from "react";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import Swal from "sweetalert2";
import { event } from "jquery";

const AcceptedBidders = (props) => {
  const [acceptedBidders, setAcceptedBidders] = useState([]);
  const { server1: baseUrl } = useBaseUrl();
  const [formList, setFromList] = useState([]);
  console.log("props", props.input);
  useEffect(() => {
    try {
      axios
        .get(
          `${baseUrl}/api/bidmanagement/tenderstatus/acceptedbidders/${props.bidManageMainId}`
        )
        .then((response) => {
          if (response.status === 200) {
            // console.log("response", response.data.bidders);
            setAcceptedBidders(response.data.bidders);
          }
        });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Unable to Load Data",
        timer: 2000,
      });
    }
  }, [props.bidManageMainId]);
  // if(props.input[4].status){
  // console.log("CompId",props?.input[4].status==="qualified");}
  var stateArray = [];
  const createAndSetStates = (compId, id) => {
    if (compId && id) {
      let newField = { id: compId, status: "", reason: "" };
      stateArray.push(newField);
      // stateArray[id] = newField;
      // props.setInput((prev)=>{return{...prev, newField}})
      // console.log("stateArray13", stateArray);
    }
  };
  console.log("stateArray", stateArray);

  const createForm = () => {
    let resultList = acceptedBidders.map((item) => {
      createAndSetStates(item.competitorId, item.id);
      return (
        <div className="row mb-2" key={item.id}>
          <div className="col-lg-5 text-dark text-left">
            <label>{item.competitorId}</label>
          </div>
          <div className="col-lg-3 text-left">
            <label className="form-check-label" htmlFor="qualified">
              <input
                className="form-check-input"
                type="radio"
                name="status"
                value="qualified"
                checked={props.input[item.competitorId]?.status === "qualified"}
                onChange={(event) =>
                  props.textInputHandler(item.competitorId, event)
                }
              />
              Qualified
            </label>

            <label className="pl-5 form-check-label" htmlFor="not qualified">
              <input
                className="form-check-input"
                type="radio"
                name="status"
                value="not qualified"
                checked={
                  props.input[item.competitorId]?.status === "not qualified"
                }
                onChange={(event) =>
                  props.textInputHandler(item.competitorId, event)
                }
              />
              Not Qualified {props.input[item.competitorId]}
            </label>
          </div>
          <div className="col-lg-4 text-left row">
            <div className="col-lg-3">
              <label>Reason :</label>
            </div>
            <div className="col-lg-9">
              <textarea
                className="form-control"
                name="reason"
                rows="2"
                value={props?.input[item.competitorId]?.reason}
                onChange={(event) =>
                  props.textInputHandler(item.competitorId, event)
                }
              />
            </div>
          </div>
        </div>
      );
    });
    setFromList(resultList);
  };

  // console.log("formList :", formList);
  useEffect(() => {
    createForm();
  }, [acceptedBidders]);

  return <Fragment>{formList}</Fragment>;
};

export default AcceptedBidders;
