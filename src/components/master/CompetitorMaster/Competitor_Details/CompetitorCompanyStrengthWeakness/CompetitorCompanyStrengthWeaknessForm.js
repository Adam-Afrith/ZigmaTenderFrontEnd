import { usePageTitle } from "../../../../hooks/usePageTitle";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import Swal from "sweetalert2";
import CompetitorCompanyStrengthWeaknessList from "./CompetitorCompanyStrengthWeaknessList";

const CompetitorCompanyStrengthWeaknessForm = (props) => {
  const { compid } = useParams();
  usePageTitle("Competitor Creation");
  const initialValue = {
    prosConsId: null,
    compNo: null,
    strength: "",
    weakness: "",
  };
  const [competitorProsConsInput, setCompetitorProsConsInput] =
    useState(initialValue);

  const [formIsValid, setFormIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prosConsList, setProsConsList] = useState([]);
  const [isBtnClicked, setIsBtnClicked] = useState(false);

  let tokenId = localStorage.getItem("token");
  const { server1: baseUrl } = useBaseUrl();
  // const navigate = useNavigate();

  useEffect(() => {
    // getCompNo();
    getProsConsList();
  }, []);

  useEffect(() => {
    if (props.compNo) {
      setCompetitorProsConsInput({
        ...competitorProsConsInput,
        compNo: props.compNo,
      });
    }
  }, [props.compNo]);

  // const getCompNo = async () => {
  //   await axios
  //     .get(`${baseUrl}/api/competitorprofile/getcompno/${compid}`)
  //     .then((resp) => {
  //       if (resp.data.status === 200) {
  //         setCompetitorProsConsInput({
  //           ...competitorProsConsInput,
  //           compNo: resp.data.compNo,
  //         });
  //       }
  //     });
  // };

  //check Form is Valid or not
  useEffect(() => {
    if (
      competitorProsConsInput.strength !== "" ||
      competitorProsConsInput.weakness !== ""
    ) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [competitorProsConsInput]);

  const getProsConsList = () => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    axios
      .post(`${baseUrl}/api/competitordetails/prosconslist/${compid}`,data)
      .then((resp) => {
        let list = [...resp.data.pros_cons];
        let listarr = list.map((item, index) => ({
          ...item,
          buttons: `<i class="fa fa-edit text-primary mx-2 h6" style="cursor:pointer" title="Edit"></i> <i class="fa fa-trash text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>`,
          sl_no: index + 1,
        }));
        setProsConsList(listarr);
      });
  };

  const onEdit = (data) => {
    setFormIsValid(true);
    setCompetitorProsConsInput({
      prosConsId: data.id,
      compNo: data.compNo,
      strength: data.strength,
      weakness: data.weakness,
    });
  };

  const onDelete = (data) => {
    Swal.fire({
      text: `Are You sure, to delete ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#2fba5f",
      cancelButtonColor: "#fc5157",
    }).then((willDelete) => {
      if (willDelete.isConfirmed) {
        axios
          .delete(`${baseUrl}/api/competitorproscons/${data.id}`)
          .then((resp) => {
            if (resp.data.status === 200) {
              Swal.fire({
                //success msg
                icon: "success",
                title: "Strength/Weakness ",
                text: `removed!`,
                timer: 2000,
                showConfirmButton: false,
              });
              getProsConsList();
            } else if (resp.data.status === 404) {
              Swal.fire({
                // error msg
                icon: "error",
                text: resp.data.message,
                showConfirmButton: true,
              });
            } else {
              Swal.fire({
                icon: "error",
                text: "Something went wrong!",
                timer: 2000,
              });
            }
          });
      } else {
        Swal.fire({
          title: "Cancelled",
          icon: "error",
          timer: 1500,
        });
      }
    });
  };

  const textInputHandler = (e) => {
    setCompetitorProsConsInput({
      ...competitorProsConsInput,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setIsBtnClicked(true);
    let tokenId = localStorage.getItem("token");
    const datatosend = {
      compId: compid,
      compNo: competitorProsConsInput.compNo,
      weakness: competitorProsConsInput.weakness,
      strength: competitorProsConsInput.strength,
      tokenId: tokenId,
    };
    // console.log("datatosend",datatosend);
    if (
      datatosend.compId !== null &&
      datatosend.compNo !== null &&
      (datatosend.strength !== null || datatosend.weakness !== null)
    ) {
      axios
        .post(`${baseUrl}/api/competitorproscons`, datatosend)
        .then((resp) => {
          if (resp.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Competitor Strength/Weakness",
              text: resp.data.message,
              timer: 2000,
            }).then(function () {
              setLoading(false);
              setIsBtnClicked(false);
              setCompetitorProsConsInput({
                ...competitorProsConsInput,
                weakness: "",
                strength: "",
              });
              getProsConsList();
            });
          } else if (resp.data.status === 404) {
            Swal.fire({
              icon: "error",
              title: "Competitor Strength/Weakness",
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
        title: "Competitor Strength/Weakness",
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
    let tokenId = localStorage.getItem("token");
    const datatosend = {
      compId: compid,
      compNo: competitorProsConsInput.compNo,
      weakness: competitorProsConsInput.weakness,
      strength: competitorProsConsInput.strength,
      tokenId: tokenId,
    };
    if (
      datatosend.compId !== null &&
      datatosend.compNo !== null &&
      datatosend.strength !== null &&
      competitorProsConsInput.prosConsId
    ) {
      axios
        .put(
          `${baseUrl}/api/competitorproscons/${competitorProsConsInput.prosConsId}`,
          datatosend
        )
        .then((resp) => {
          if (resp.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Competitor Strength/Weakness",
              text: resp.data.message,
              timer: 2000,
            }).then(function () {
              setCompetitorProsConsInput({
                ...competitorProsConsInput,
                prosConsId: null,
                weakness: "",
                strength: "",
              });
              getProsConsList();
              setIsBtnClicked(false);
              setLoading(false);
            });
          } else if (resp.data.status === 404) {
            Swal.fire({
              icon: "error",
              title: "Competitor Networth",
              text: resp.data.errors,
              confirmButtonColor: "#5156ed",
            }).then(function () {
              setLoading(false);
              setIsBtnClicked(false);
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Competitor Networth",
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

  return (
    <div className="">
      <form>
        <div className="row align-items-center">
          <div className="inputgroup col-lg-6 mb-4 ">
            <div className="row align-items-center">
              <div className="col-lg-4 text-dark font-weight-bold pt-1">
                <label htmlFor="strength">
                  {" "}
                  Strength/Weakness
                  {/* Value in Rupees ( &#8377; )<span className="text-danger">&nbsp;*</span>
                    <p className="text-info">( upto : 99,999,999,999.99 )</p> */}
                </label>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  className="form-control"
                  id="strength"
                  placeholder="Enter Competitor Strength"
                  name="strength"
                  value={competitorProsConsInput.strength}
                  onChange={textInputHandler}
                />

                {/* {hasError.weakness && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-bold">
                      Enter Valid Amount..!
                    </span>
                  </div>
                )} */}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-6 mb-4 ">
            <div className="row align-items-center">
              <div className="col-lg-4 text-dark font-weight-bold pt-1">
                <label htmlFor="weakness">Weakness</label>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  className="form-control"
                  id="weakness"
                  placeholder="Enter Competitor Weakness"
                  name="weakness"
                  value={competitorProsConsInput.weakness}
                  onChange={textInputHandler}
                />

                {/* {hasError.weakness && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-bold">
                      Enter Valid Amount..!
                    </span>
                  </div>
                )} */}
              </div>
            </div>
          </div>          
          
          <div className="inputgroup col-lg-12 mb-4 align-items-center">
            <div className="row">
              <div className="col-lg-12 text-center">
              <button
                className="btn btn-primary"
                disabled={!formIsValid || isBtnClicked === true}
                onClick={
                  !competitorProsConsInput.prosConsId
                    ? submitHandler
                    : updateHandler
                }
              >
                {!competitorProsConsInput.prosConsId
                  ? loading === true
                    ? "Adding...."
                    : "Add"
                  : loading === true
                  ? "Updating...."
                  : "Update"}
              </button>
            </div>
            </div>
          </div>          
        </div>
      </form>
      <CompetitorCompanyStrengthWeaknessList
        prosConsList={prosConsList}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};
export default CompetitorCompanyStrengthWeaknessForm;
