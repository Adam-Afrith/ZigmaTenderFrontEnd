import { usePageTitle } from "../../../../hooks/usePageTitle";
import { useState, useEffect, Fragment } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import Swal from "sweetalert2";
import BiddersList from "./BiddersList";
import PreLoader from "../../../../UI/PreLoader";
import LockCard from "../../../../UI/LockCard";
import { isDisabled } from "@testing-library/user-event/dist/utils";

const Bidders = (props) => {
  const [toastSuccess, toastError, setBidManagementMainId, bidManageMainId] =
    useOutletContext();

  // usePageTitle("Competitor Creation");

  const [bidders, setBidders] = useState("");
  const [compList, setCompList] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
  const [input, setInput] = useState([]);
  const [edit, setEdit] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [compListLoading, setCompListLoading] = useState(false);
  const [FetchLoading, setFetchLoading] = useState(true);
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  let tokenId = localStorage.getItem("token");
  const { server1: baseUrl } = useBaseUrl();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    //get the no of bidders
    getCompetitorList();
  }, []);

  useEffect(() => {
    //get the no of bidders
    getBidders();
  }, [bidManageMainId]);

  //set Fetched Data into input While loading if Bid Id has value
  useEffect(() => {
    if (edit && fetchedData.length > 0) {
      fetchedData.map((bidders, index) => {
        setInput((prev) => {
          return {
            ...prev,
            [bidders.id]: {
              compId: compList.find((x) =>
                x.value === bidders.competitorId
                  ? { value: x.value, label: x.label }
                  : null
              ),
              status: bidders.acceptedStatus ? bidders.acceptedStatus : "",
              reason: bidders.reason ? bidders.reason : "",
            },
          };
        });
        let Compindex = compList.findIndex(
          (option) => option.value === bidders.competitorId
        );
        let compListArr = compList;
        compListArr[Compindex] = { ...compList[Compindex], isdisabled: true };
        setCompList(compListArr);
      });
      setFetchLoading(false);
    }
  }, [bidders]);

  const getBidders = () => {
    setFetchLoading(true);
    if (bidManageMainId) {
      axios
        .get(`${baseUrl}/api/tenderstatusbidders/${bidManageMainId}`)
        .then((response) => {
          if (response.data.status === 200) {
            if (response.data.bidders.length > 0) {
              setBidders(response.data.bidders.length);
              setFetchedData(response.data.bidders);
              setEdit(true);
            } else {
              setFetchLoading(false);
            }
          } else {
            setFetchLoading(false);
          }
        });
    }
  };

  const getCompetitorList = () => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    setCompListLoading(true);
    axios.post(`${baseUrl}/api/tenderstatus/complist`,data).then((resp) => {
      if (resp.data.status === 200) {
        setCompList(resp.data.compList);
        // setCompListCopy(resp.data.compList);
      } else {
        toastError(resp.data.message);
      }
    });
    setCompListLoading(false);
  };

  const textInputHandler = (e) => {
    setInput(""); //it will reset previously created Set
    if (
      e.target.value !== "" &&
      e.target.value.match(/^[0-9]*$/) &&
      e.target.value <= 20 &&
      e.target.value > 0
    ) {
      getCompetitorList();
      //to create input state based in user input
      if (
        e.target.value &&
        compList.length &&
        e.target.value > compList.length
      ) {
        toastError(
          "Maximum No of Competitors in List is " + `${compList.length}`
        );
        setBidders("");
      } else {
        if (!edit && fetchedData.length === 0) {
          for (let i = 0; i < e.target.value; i++) {
            setInput((prev) => {
              return {
                ...prev,
                [i]: {
                  compId: null,
                  status: "",
                  reason: "",
                },
              };
            });
          }
        }
      }

      setFormIsValid(true);
      setHasError(false);
      setBidders(e.target.value);
    } else {
      setBidders("");
      setHasError(true);
      setFormIsValid(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setIsBtnClicked(true);
    // let tokenId = localStorage.getItem("token");

    const datatosend = {
      bidid: parseInt(bidManageMainId),
      input: input,
      tokenId: localStorage.getItem("token"),
    };
    if (
      datatosend.bidid !== null ||
      datatosend.bidders !== null ||
      datatosend.input !== null ||
      datatosend.tokenId !== null
    ) {
      axios
        .post(`${baseUrl}/api/tenderstatusbidders`, datatosend)
        .then((resp) => {
          if (resp.data.status === 200) {
            props.reloadFunction();
            Swal.fire({
              icon: "success",
              title: "Tender Status / Bidders",
              text: resp.data.message,
              timer: 2000,
            }).then(function () {
              setLoading(false);
              setIsBtnClicked(false);
              getBidders();
            });
          } else if (resp.data.status === 404) {
            Swal.fire({
              icon: "error",
              title: "Tender Status / Bidders",
              text: resp.data.message,
              confirmButtonColor: "#5156ed",
            }).then(function () {
              setLoading(false);
              setIsBtnClicked(false);
            });
          }
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Tender Status / Bidders",
        text: "You are tring to submit empty values",
        confirmButtonColor: "#5156ed",
      }).then(function () {
        setLoading(false);
        setIsBtnClicked(false);
      });
    }
  };

  const updateHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setIsBtnClicked(true);
    const datatosend = {
      bidid: parseInt(bidManageMainId),
      input: input,
      tokenId: localStorage.getItem("token"),
      _method: "PUT",
    };
    if (
      datatosend.bidid !== null ||
      datatosend.bidders !== null ||
      datatosend.input !== null ||
      datatosend.tokenId !== null
    ) {
      axios
        .put(
          `${baseUrl}/api/tenderstatusbidders/${bidManageMainId}`,
          datatosend
        )
        .then((resp) => {
          if (resp.data.status === 200) {
            props.reloadFunction();
            Swal.fire({
              icon: "success",
              title: "Tender Status / Bidders",
              text: resp.data.message,
              timer: 2000,
            }).then(function () {
              setIsBtnClicked(false);
              setLoading(false);
              getBidders();
            });
          } else if (resp.data.status === 404) {
            Swal.fire({
              icon: "error",
              title: "Tender Status / Bidders",
              text: resp.data.errors,
              confirmButtonColor: "#5156ed",
            }).then(function () {
              setLoading(false);
              setIsBtnClicked(false);
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Tender Status / Bidders",
              text: "Something went wrong!",
              confirmButtonColor: "#5156ed",
            }).then(function () {
              setLoading(false);
              setIsBtnClicked(false);
            });
          }
        });
    }
  };

// console.log("Input",input)
//   useEffect(()=>{
//     let allNotNullOrUndefined = false;

// for(const prop in input){
  
//   for(const obj in input[prop]){
    
//     for(const objprop in input[prop].obj){
//       console.log("objprop", objprop);
//   if (input[prop].hasOwnProperty(obj)) {
//     const val = input[prop].obj.objprop;
    
//     if (val === null || val === undefined || val === "") {
//       allNotNullOrUndefined = false;
//       break;
//     }
//   }
// }
//   }
// }
// console.log("allNotNullOrUndefined", allNotNullOrUndefined);
// if(allNotNullOrUndefined)
// {
//   setFormIsValid(true);
// }
// else{
//   setFormIsValid(false);
// }

// },[input])
// console.log("formIsValid", formIsValid);
  return (
    <Fragment>
      {/* <LockCard locked={props.tenderStatus==='Cancel'} text="Tender Cancelled" textClass="text-danger font-weight-bold h4"> */}
      <PreLoader loading={FetchLoading}>
        <div className="card-body mr-n5">
          <form>
            <div className="row align-items-center col-lg-12">
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark font-weight-bold  ml-n4">
                    <label htmlFor="bidders">
                      No of Bidders
                      <p className="text-info">Max Value : 20</p>
                    </label>
                  </div>
                  <div className="col-lg-6">
                    <input
                      type="text"
                      className="form-control"
                      id="bidders"
                      placeholder={
                        compList.length > 0
                          ? "Competitors in List - " + `${compList.length}`
                          : ""
                      }
                      name="bidders"
                      value={bidders}
                      onChange={textInputHandler}
                      disabled={
                        fetchedData.length > 0 ||
                        props.tenderStatus ||
                        FetchLoading
                      }
                    />

                    {hasError && (
                      <div className="pt-1">
                        <span className="text-danger font-weight-bold">
                          Enter Valid Input..!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="inputgroup col-lg-12 ml-n4">
              <BiddersList
                compList={compList}
                input={input}
                setInput={setInput}
                edit={edit}
                setIsEdited={setIsEdited}
                setCompList={setCompList}
                compListLoading={compListLoading}
                bidders={bidders}
                setBidders={setBidders}
                fetchedData={fetchedData}
                
              />
            </div>

            <div className="row align-items-center col-lg-12">
              <div className="col-lg-5"></div>
              <div className="col-lg-2">
                <button
                  className="btn btn-primary"
                  disabled={
                    props.tenderStatus === "Cancel" ||
                    ((!formIsValid || isBtnClicked === true) &&
                      isEdited === false)
                  }
                  onClick={!edit ? submitHandler : updateHandler}
                >
                  {!edit
                    ? loading === true
                      ? "Saving...."
                      : "Save"
                    : loading === true
                    ? "Updating...."
                    : "Update"}
                </button>
              </div>
              <div className="col-lg-5"></div>
            </div>
          </form>
        </div>
      </PreLoader>
      {/* </LockCard> */}
    </Fragment>
  );
};
export default Bidders;
