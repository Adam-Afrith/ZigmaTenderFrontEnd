import axios from "axios";
import { useState, useEffect, Fragment } from "react";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import Swal from "sweetalert2";
import PreLoader from "../../../../UI/PreLoader";

const AcceptedBidders = (props) => {
  const [acceptedBidders, setAcceptedBidders] = useState([]);
  const { server1: baseUrl } = useBaseUrl();
  const [FetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    try {
      setFetchLoading(true);

      let data = {
        tokenid : localStorage.getItem('token')
      }
      axios
        .post(
          `${baseUrl}/api/bidmanagement/tenderstatus/acceptedbidders/${props.bidManageMainId}`,data
        )
        .then((response) => {
          if (response.status === 200) {
            response.data.bidders.map((bidders) => {
              props.setInput((prev) => {
                return {
                  ...prev,
                  [bidders.competitorId]: {
                    [bidders.competitorId + "status"]: "",
                    [bidders.competitorId + "reason"]: "",
                  },
              };
              });
            });
            setAcceptedBidders(response.data.bidders);
          }
           setFetchLoading(false);
        });
        
    } catch (e) {
      setFetchLoading(false);
      Swal.fire({
        icon: "error",
        title: "Unable to Load Data",
        timer: 2000,
      });
    }
  }, [props.bidManageMainId]);
  

  const textInputHandler = (id, e) => {
    e.persist();
    props.setInput((prev) => {
      return {
        ...prev,
        [id]: {
          ...prev[id],
          [e.target.name]: e.target.value,
        },
      };
    });
//to reset reason

    if(e.target.name===(id+"status") && e.target.value==="qualified")
    {
      props.setInput((prev) => {
        return {
          ...prev, [id] : {...prev[id], [`${id}reason`]:""}
        }
    });
  };
  props.setisEdited(true);
}

  return (
    <Fragment>
      
      {acceptedBidders.map((item) => {
        return (
          <div className="row mb-2" key={item.competitorId}>
            <div className="col-sm-1"> </div>
            <div className="col-lg-4 text-dark text-left mr-4">
              <label>{item.compName}</label>
            </div>

            <div className="col-lg-3 text-left">
              <label
                className="form-check-label pointer"
                htmlFor={item.competitorId + "statusqulaified"}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  id={item.competitorId + "statusqulaified"}
                  name={item.competitorId + "status"}
                  value="qualified"
                  checked={
                    props.input &&
                    props.input[item.competitorId] &&
                    props.input[item.competitorId][item.competitorId + "status"] &&
                    (props.input[item.competitorId][item.competitorId + "status"]
                      ? props.input[item.competitorId][
                          item.competitorId + "status"
                        ] === "qualified"
                      : false)
                  }
                  onChange={(event) =>
                    textInputHandler(item.competitorId, event)
                  }
                />
                Qualified
              </label>

              <label
                className="pl-5 form-check-label pointer"
                htmlFor={item.competitorId + "statusnotqulaified"}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  id={item.competitorId + "statusnotqulaified"}
                  name={item.competitorId + "status"}
                  value="not qualified"
                  checked={
                    props.input &&
                    props.input[item.competitorId] &&
                    props.input[item.competitorId][item.competitorId + "status"] &&
                    (props.input[item.competitorId][item.competitorId + "status"]
                      ? props.input[item.competitorId][
                          item.competitorId + "status"
                        ] === "not qualified"
                      : false)
                  }
                  onChange={(event) =>
                    textInputHandler(item.competitorId, event)
                  }
                />
                Not Qualified
              </label>
            </div>
            {props.input[item.competitorId][item.competitorId + "status"]==="not qualified" &&
            <div className="col-lg-4 text-left row">
              <div className="col-lg-3">
                <label>Reason :</label>
              </div>
              <div className="col-lg-9">
                <textarea
                  className="form-control"
                  name= {item.competitorId + "reason"}
                  rows="2"
                  value={props.input[item.competitorId]?.[item.competitorId +"reason"]}
                  onChange={(event) =>
                    textInputHandler(item.competitorId, event)
                  }
                />
              </div>
            </div>}
          </div>
        );
      })}

    </Fragment>
  );
};

export default AcceptedBidders;
