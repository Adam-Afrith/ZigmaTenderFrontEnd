import { Fragment, useEffect } from "react";
import Select from "react-select";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { useOutletContext } from "react-router-dom";
import PreLoader from "../../../../UI/PreLoader";

const BiddersList = (props) => {
  const [toastSuccess, toastError, setBidManagementMainId, bidManageMainId] =
    useOutletContext();

  const textInputHandler = (e) => {
    e.persist();

    let splitstring;
    let index;
    if (
      e.target.name.includes("status") &&
      (e.target.value === "approved" || e.target.value === "rejected")
    ) {
      splitstring = e.target.name.split("status");
      index = splitstring[1];
      props.setInput((prev) => {
        return {
          ...prev,
          [index]: {
            ...prev[index],
            status: e.target.value,
          },
        };
      });
      props.setIsEdited(true);

      if (e.target.value === "approved") {
        props.setInput((prev) => {
          return {
            ...prev,
            [index]: { ...prev[index], reason: "" },
          };
        });
      }
    } else if (e.target.name.includes("reason")) {
      splitstring = e.target.name.split("reason");
      index = splitstring[1];
      props.setInput((prev) => {
        return {
          ...prev,
          [index]: {
            ...prev[index],
            reason: e.target.value,
          },
        };
      });
      props.setIsEdited(true);
    }
  };

  const selectChangeHandler = (id, e) => {
    // (value, action ) => (id, e)

    var objIndex = e.name.split("compId");
    let inpIndex = objIndex[1];
    let PreviousInputCompId = "";
    if (id) {
      props.setInput((prev) => {
        // let rowData=prev[inpIndex].compId.value;
        // console.log(rowData)
        let rowData = prev[inpIndex];
        //##to reset isdisabled to false when option has changed
        PreviousInputCompId = rowData?.compId?.value;
        // console.log("PreviousInputCompId",PreviousInputCompId);
        if (PreviousInputCompId) {
          props.compList.forEach((value, index) => {
            let compListRowData = value;
            // console.log("value", value);
            // console.log("index", index);
            // console.log("compListRowData",compListRowData.value);
            if (compListRowData.value === PreviousInputCompId) {
              let compListArr1 = props.compList;
              compListArr1[index] = {
                ...props.compList[index],
                isdisabled: false,
              };
              props.setCompList(compListArr1);
            }
          });
        }
        return {
          ...prev,
          [inpIndex]: {
            compId: props.compList.find((x) =>
              x.value === id.value ? { value: id.value, label: id.label } : null
            ),
            status: "",
            reason: "",
          },
        };
      });
      props.setIsEdited(true);
    } else {
      props.setInput((prev) => {
        return {
          ...prev,
          [inpIndex]: {
            ...prev[inpIndex],
            compId: null,
          },
        };
      });
    }

    if (id === null) {
      let tempObj = props.input[inpIndex].compId;

      let index = props.compList.findIndex(
        (option) => option.value === tempObj.value
      );
      let compListArr = props.compList;
      compListArr[index] = { ...props.compList[index], isdisabled: false };
      props.setCompList(compListArr);
    } else {
      let index = props.compList.findIndex(
        (option) => option.value === id.value
      );

      let dubObj = props.compList;
      dubObj[index] = { ...dubObj[index], isdisabled: true };
      props.setCompList(dubObj);
    }
    props.setIsEdited(true);
  };

  let results = [];
  // useEffect(() => {
  //   if (props.bidders > props.compList.length && props.fetchedData.length===0) {
  //     // toastError("No of Bidders is higher than No of Competitors");
  //     toastError(
  //       "Only " + `${props.compList.length}` + " Competitors are Available..!"
  //     );
  //     props.setBidders("");
  //   }
  // }, [props.bidders]);

  Object.keys(props.input).forEach((key, index) => {
    results.push(
      <div className="row col-lg-12 mb-2" key={key}>
        <div className="col-lg-2 text-dark font-weight-bold text-left mt-2">
          <label>Name of Bidder {index + 1}</label>
        </div>
        <div
          className={
            props.fetchedData
              ? "col-lg-3 text-dark text-left font-weight-bold"
              : "col-lg-3 text-dark text-left"
          }
        >
          <Select
            name={"compId" + key}
            id={"compId" + key}
            isSearchable="true"
            isClearable="false"
            options={props.compList}
            onChange={(event, selectedOptions) => {
              selectChangeHandler(event, selectedOptions);
            }}
            value={props.input[key]["compId"]}
            isOptionDisabled={(option) => option.isdisabled}
            isLoading={props.compListLoading}
            isDisabled={props.fetchedData.length > 0}
          ></Select>
        </div>
        
        <div className="col-lg-3 text-left row ml-3">
          <div className="col-lg-5 mt-2 ">
            <label
              className="form-check-label pointer"
              htmlFor={"statusapproved" + key}
            >
              <input
                className="form-check-input"
                type="radio"
                onChange={(event) => textInputHandler(event)}
                name={"status" + key}
                id={"statusapproved" + key}
                value="approved"
                checked={
                  props.input &&
                  props.input[key] &&
                  props.input[key]["status"] &&
                  (props.input[key]["status"]
                    ? props.input[key]["status"] === "approved"
                    : false)
                }
              />
              <span className="text-dark font-weight-bold">Approved</span>
            </label>
          </div>

          <div className="col-lg-5 mt-2">
            <label
              className="form-check-label pointer"
              htmlFor={"statusrejected" + key}
            >
              <input
                className="form-check-input"
                type="radio"
                onChange={(event) => textInputHandler(event)}
                name={"status" + key}
                id={"statusrejected" + key}
                value="rejected"
                checked={
                  props.input &&
                  props.input[key] &&
                  props.input[key]["status"] &&
                  (props.input[key]["status"]
                    ? props.input[key]["status"] === "rejected"
                    : false)
                }
              />
              <span className="text-dark font-weight-bold">Rejected</span>
            </label>
          </div>
        </div>
        {props.input[key]["status"] === "rejected" && (
          <div className="col-lg-4 text-dark text-left row mb-2  form-outline">
            <div className="col-lg-3">
              <label className="form-check-label mt-2 text-dark font-weight-bold">
                Reason :
              </label>
            </div>
            <div className="col-lg-9">
              <textarea
                className="form-control "
                name={"reason" + key}
                rows="2"
                value={props.input[key]["reason"]}
                onChange={(event) => textInputHandler(event)}
              />
            </div>
          </div>
        )}
      </div>
    );
  });

  return (
    <Fragment>
      <PreLoader loading={props.compListLoading}>{results}</PreLoader>
    </Fragment>
  );
};

export default BiddersList;
