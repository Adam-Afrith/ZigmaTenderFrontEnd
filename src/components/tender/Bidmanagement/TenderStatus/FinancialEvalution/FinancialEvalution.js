import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import Select from "react-select";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import LockCard from "../../../../UI/LockCard";
import PreLoader from "../../../../UI/PreLoader";
import Swal from "sweetalert2";

const FinancialEvalution = (props) => {
  const { id } = useParams();
  const [FetchLoading, setFetchLoading] = useState(false);
  const { server1: baseUrl } = useBaseUrl();
  const [qualifiedList, setqualifiedList] = useState([]);
  const [input, setInput] = useState({});
  const [unitList, setunitList] = useState([]);
  const [leastList, setLeastList] = useState([]);
  const [isEditbtn, setisEditbtn] = useState(false);
  const [isDatasending, setdatasending] = useState(false);
  const [AddorUpdateForm, setAddorUpdateForm] = useState("add");
  const [toastSuccess, toastError, setBidManagementMainId, bidManageMainId] =
    useOutletContext();

  useEffect(() => {
    getTechnicalEvalutionList();

    getUnitList();
  }, []);

  // useEffect(() => {
  //     if(input && Object.keys(input).length > 0){

  //         let data = {}
  //         let sorted = {}
  //         for (const property in input) {
  //             if(input[property]?.amt){
  //                 data[property] = { amt : input[property]?.amt}
  //             }
  //         }

  //         if(Object.keys(data).length > 0){

  //             let result = Object.entries(data).sort((a, b) => a[1].amt - b[1].amt);

  //             result.forEach((value,index) => {
  //                 console.log(value)
  //                 data[value[0]] = {
  //                     ... data[value[0]],
  //                     least : 'L'+(index+1)
  //                 }
  //             })
  //         }

  //         console.log(data)
  //     }
  // }, [input])

  const getTechnicalEvalutionList = () => {
    setFetchLoading(true);
    try {
      let data = {
        tokenid : localStorage.getItem('token')
      }
      axios
        .post(`${baseUrl}/api/technicalevalution/qualifiedlist/${id}`,data)
        .then((resp) => {
          if (resp.status === 200) {
            setqualifiedList(resp.data.qualifiedList);
            generateLeastList(resp.data.qualifiedList.length);
            let qualifiedList = resp.data.qualifiedList;
            qualifiedList.length > 0
              ? getAlreadySavedFinancialEvalutionData(qualifiedList)
              : setFetchLoading(false);
          } else {
            console.log("ex");
            setFetchLoading(false);
          }
        });
    } catch (ex) {
      setFetchLoading(false);
      console.log("b;mfldmbs;lk");
    }
  };

  const isAlreadyStored = (qualifiedList, storedFinEvalList) => {
    setFetchLoading(true);
    // console.log(qualifiedList);
    // console.log(storedFinEvalList);

    qualifiedList.forEach((value, index) => {
      let storedFindata = storedFinEvalList.find(
        (x) => x.techsubId === value.id
      );
      if (storedFindata) {
        // console.log(storedFindata)
        if (storedFindata.unit) {
          setInput((prev) => {
            return {
              ...prev,
              [storedFindata.techsubId]: {
                ...prev[storedFindata.techsubId],
                unit: storedFindata.unit,
              },
            };
          });
        }

        if (storedFindata.amt) {
          setInput((prev) => {
            return {
              ...prev,
              [storedFindata.techsubId]: {
                ...prev[storedFindata.techsubId],
                amt: storedFindata.amt,
              },
            };
          });
        }

        if (storedFindata.least) {
          setInput((prev) => {
            return {
              ...prev,
              [storedFindata.techsubId]: {
                ...prev[storedFindata.techsubId],
                least: storedFindata.least,
              },
            };
          });
        }

        setInput((prev) => {
          return {
            ...prev,
            [storedFindata.techsubId]: {
              ...prev[storedFindata.techsubId],
              updateId: storedFindata.id,
            },
          };
        });
      }
    });
    setFetchLoading(false);
  };

  const getAlreadySavedFinancialEvalutionData = (qualifiedList) => {
    setFetchLoading(true);
    try {
      let data = {
        tokenid : localStorage.getItem('token')
      }
      axios
        .post(`${baseUrl}/api/financialevaluation/getstoreddata/${id}`,data)
        .then((resp) => {
          if (resp.status === 200) {
            if (resp.data.storedFinEvalList.length > 0) {
              // if(Array.isArray(resp.data.qualifiedList)){
              //     qualifiedList.forEach(isAlreadyStored)
              // }
              setisEditbtn(true);
              setAddorUpdateForm("update");
              isAlreadyStored(qualifiedList, resp.data.storedFinEvalList);
            } else {
              setFetchLoading(false);
            }
          } else {
            setFetchLoading(false);
          }
        });
    } catch (ex) {
      console.log("Exception", ex);
    }
  };

  const generateLeastList = (qualifiedListLen) => {
    const leastListArr = [];
    for (let i = 1; i <= qualifiedListLen; i++) {
      leastListArr.push({ value: "L" + i, label: "L" + i });
    }

    setLeastList(leastListArr);
    // console.log(leastListArr)
  };

  const getUnitList = () => {

     let data = {
        tokenid : localStorage.getItem('token')
      }

    axios.post(`${baseUrl}/api/unitmasters/getUnitList`,data).then((resp) => {
      // console.log(resp.data)
      if (resp.status === 200) {
        setunitList(resp.data.unitList);
      }
    });
  };

  const unitChangeHandler = (selectedOptions, techsubid) => {
    setInput((prev) => {
      return {
        ...prev,
        [techsubid]: {
          ...prev[techsubid],
          unit: selectedOptions ? selectedOptions.value : "",
        },
      };
    });
  };

  // const unit_name = [
  //     {value : '1', label : 'Cubic Metric Ton'}
  // ]

  const amtchangehandler = (e, techsubid) => {
    setInput((prev) => {
      return {
        ...prev,
        [techsubid]: {
          ...prev[techsubid],
          amt: +e.target.value,
        },
      };
    });
  };

  const leastChangeHandler = (selectedOptions, techsubid) => {
   
      if (input[techsubid]) {
        let preSelectedValue = input[techsubid].least;

        let index = leastList.findIndex(
          (option) => option.value === preSelectedValue
        );

        let leastListArr = leastList;
        leastListArr[index] = { ...leastList[index], isDisabled: false };
        setLeastList(leastListArr);
      }
    
    // else{
    //         let index = leastList.findIndex(option => option.value === selectedOptions.value)

    //         let leastListArr = leastList;
    //         leastListArr[index] = { ...leastList[index], isDisabled: true }

    //         setLeastList(leastListArr)
    // }

    setInput((prev) => {
      return {
        ...prev,
        [techsubid]: {
          ...prev[techsubid],
          least: selectedOptions ? selectedOptions.value : "",
        },
      };
    });
  };

  useEffect(() => {
    if (input && Object.keys(input).length > 0) {
      for (const key in input) {
        if (input[key].least) {
          // console.log(input[key].least)
          let index = leastList.findIndex(
            (option) => option.value === input[key].least
          );

          let leastListArr = leastList;
          leastListArr[index] = { ...leastList[index], isDisabled: true };

          setLeastList(leastListArr);
        }
      }

      leastList.forEach((item,index) => {

      })
    }
  }, [input]);

  const filterLeast = (e, techsubId) => {
    // console.log(input)
  };

  const resetform = () => {
    setInput({});
    generateLeastList(qualifiedList.length);
  };

  let formIsValid = false;

  if (qualifiedList.length > 0) {
    if (Object.keys(input).length > 0) {
      for (const key in input) {
        for (const key1 in input[key]) {
          if (input[key][key1]) {
            formIsValid = true;
            break;
          }
        }

        if (formIsValid) {
          break;
        }
      }
    }
  }

  const postData = (data) => {
    axios
      .post(`${baseUrl}/api/financialevaluation`, data)
      .then((resp) => {
        // console.log(resp.data)
        if (resp.status === 200 && resp.data.status === "success") {
          toastSuccess(resp.data.msg);
          props.reloadFunction();
        } else {
          toastError("Unable to submit!");
        }
        setdatasending(false);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        setdatasending(false);
      });
  };

  const putData = (data) => {
    setdatasending(true);
    axios
      .post(`${baseUrl}/api/financialevaluation`, data)
      .then((resp) => {
        // console.log(resp.data)
        if (resp.status === 200 && resp.data.status === "success") {
          toastSuccess("Updated Successfully");
          props.reloadFunction();
        } else {
          toastError("Unable to submit!");
        }
        setdatasending(false);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        setdatasending(false);
      });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    setdatasending(true);

    if (!formIsValid) {
      setdatasending(false);
      return;
    }

    let data = {
      finEvaluation: input,
      tokenid: localStorage.getItem("token"),
      bidid: id,
    };

    if (AddorUpdateForm === "add") {
      postData(data);
    } else if (AddorUpdateForm === "update") {
      putData(data);
    }
  };
    
  return (
    <LockCard locked={!id || qualifiedList.length===0}>
      <PreLoader loading={FetchLoading} >
        <div className="row text-info">
        <div className="col-lg-3 font-weight-bold text-center">Name of The Bidder</div>
        <div className="col-lg-3 font-weight-bold text-center">Unit</div>
        <div className="col-lg-3 font-weight-bold text-center">Price/Unit</div>
        <div className="col-lg-3 font-weight-bold text-center">Least Sequence</div>
        </div>
        {qualifiedList.map((item) => {
          return (
            <div
              className="row mt-2 d-flex align-items-center mb-2"
              key={item.id}
            >
              <div className="col-md-3 font-weight-bold">{item.compName}</div>
              <div className="col-md-3">
                <Select
                  name={"unit" + item.id}
                  id={"unit" + item.id}
                  isSearchable="true"
                  isClearable="true"
                  options={unitList}
                  onChange={(selectedOptions) => {
                    unitChangeHandler(selectedOptions, item.id);
                  }}
                  value={
                    input[item.id]?.unit
                      ? unitList.find((x) => x.value === input[item.id]?.unit)
                      : null
                  }
                  // isLoading={StateOptions.isLoading}
                  // isDisabled={id ? true : false}
                ></Select>
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  id="amt"
                  placeholder="Unit Price..."
                  name="amt"
                  value={
                    input ? (input[item.id]?.amt ? input[item.id].amt : "") : ""
                  }
                  onChange={(e) => {
                    amtchangehandler(e, item.id);
                  }}
                />
              </div>
              <div className="col-md-3">
                <Select
                  name={"least" + item.id}
                  id={"least" + item.id}
                  isSearchable="true"
                  isClearable="true"
                  options={leastList}
                  onChange={(selectedOptions) => {
                    leastChangeHandler(selectedOptions, item.id);
                  }}
                  value={
                    input[item.id]?.least
                      ? leastList.find((x) => x.value === input[item.id]?.least)
                      : null
                  }
                  // isLoading={StateOptions.isLoading}
                  // isDisabled={id ? true : false}
                ></Select>
              </div>
            </div>
          );
        })}
        <div className="col-lg-12 d-flex justify-content-center mt-4">
          {!isEditbtn && (
            <button
              className={
                !formIsValid
                  ? "btn btn-outline-primary rounded-pill px-4"
                  : "btn btn-primary rounded-pill px-4"
              }
              onClick={submitHandler}
              disabled={props.tenderStatus ==="Cancel"  || (!formIsValid || isDatasending || FetchLoading)}
            >
              {isDatasending && (
                <span className="spinner-border spinner-border-sm mr-2"></span>
              )}
              {isDatasending && "Submitting..."}
              {!isDatasending && "Submit"}
            </button>
          )}
          {isEditbtn && (
            <button
              className={
                !formIsValid
                  ? "btn btn-outline-primary rounded-pill px-4"
                  : "btn btn-primary rounded-pill px-4"
              }
              onClick={submitHandler}
              disabled={props.tenderStatus ==="Cancel"  || (!formIsValid || isDatasending || FetchLoading)}
            >
              {isDatasending && (
                <span className="spinner-border spinner-border-sm mr-2"></span>
              )}
              {isDatasending && "Updating..."}
              {!isDatasending && "Update"}
            </button>
          )}

          <button
            className="btn  btn-outline-dark rounded-pill mx-3"
            onClick={resetform}
            disabled={isDatasending || FetchLoading}
          >
            Clear
          </button>
        </div>
      </PreLoader>
    </LockCard>
  );
};

export default FinancialEvalution;
