import { usePageTitle } from "../../../../hooks/usePageTitle";
import { useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import Swal from "sweetalert2";
import CompetitorDetailsLineOfBusinessList from "./CompetitorDetailsLineOfBusinessList";
// import { data, map } from "jquery";



const CompetitorDetailsLineOfBusinessForm = (props) => {
  const { compid } = useParams();
  usePageTitle("Competitor Creation");
  const initialValue = {
    bizLineId: null,
    compNo: null,
    bizLineValue: "",
    remark: "",
  };
  const [competitorBizLineInput, setCompetitorBizLineInput] =
    useState(initialValue);

  
  const [formIsValid, setFormIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bizLineList, setBizLineList] = useState([]);
  const [isBtnClicked,setIsBtnClicked]=useState(false);
  
  let tokenId = localStorage.getItem("token");
  const { server1: baseUrl } = useBaseUrl();
  // const navigate = useNavigate();

  useEffect(() => {
    // getCompNo();
    getBizLineList();
  }, []);

  useEffect(() => {
    if (props.compNo) {
      setCompetitorBizLineInput({
        ...competitorBizLineInput,
        compNo: props.compNo,
      });
    }
  }, [props.compNo]);
  // const getCompNo = async () => {
  //   await axios
  //     .get(`${baseUrl}/api/competitorprofile/getcompno/${compid}`)
  //     .then((resp) => {
  //       if (resp.data.status === 200) {
  //         setCompetitorBizLineInput({
  //           ...competitorBizLineInput,
  //           compNo: resp.data.compNo,
  //         });
  //       }
  //     });
  // };
  
  //check Form is Valid or not
useEffect(() => {
  if (
      competitorBizLineInput.bizLineValue !== "" 
  ) {
    setFormIsValid(true);
  }
  else{
    setFormIsValid(false);
  }
}, [competitorBizLineInput]);

  const getBizLineList = () => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    axios
      .post(`${baseUrl}/api/competitordetails/lineofbusinesslist/${compid}`,data)
      .then((resp) => {
        let list = [...resp.data.buz_line];
        let listarr = list.map((item, index) => ({
          ...item,
          buttons:`<i class="fa fa-edit text-primary mx-2 h6" style="cursor:pointer" title="Edit"></i> <i class="fa fa-trash text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>`,
          sl_no: index + 1,
        }));
        setBizLineList(listarr);
      });
  };




  const onEdit = (data) => {    
      setFormIsValid(true);     
        setCompetitorBizLineInput({
          bizLineId: data.id,
          compNo: data.compNo,
          bizLineValue: data.bizLineValue,
          remark: data.remark,
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
          .delete(`${baseUrl}/api/competitorlineofbusiness/${data.id}`)
          .then((resp) => {
            if (resp.data.status === 200) {
              Swal.fire({
                //success msg
                icon: "success",
                title: "Line of Business "+data.bizLineValue,
                text: `removed!`,
                timer: 2000,
                showConfirmButton: false,
              });
              getBizLineList();
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
 

  const textInputHandler = (e) =>{
    setCompetitorBizLineInput({...competitorBizLineInput, [e.target.name] : e.target.value});
  }
  

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setIsBtnClicked(true);
    let tokenId = localStorage.getItem("token");
    const datatosend = {
      compId: compid,
      compNo: competitorBizLineInput.compNo,
      remark: competitorBizLineInput.remark,
      bizLineValue: competitorBizLineInput.bizLineValue,
      tokenId: tokenId,
    };
    // console.log("datatosend",datatosend);
    if (
      datatosend.compId !== null &&
      datatosend.compNo !== null &&
      datatosend.bizLineValue !== null
    )
    {
    axios.post(`${baseUrl}/api/competitorlineofbusiness`, datatosend).then((resp) => {
      if (resp.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Competitor Line of Business",
          text: resp.data.message,
          timer: 2000,
        }).then(function () {
          setLoading(false);
          setIsBtnClicked(false);
          setCompetitorBizLineInput({...competitorBizLineInput, remark: "", bizLineValue: ""});
          getBizLineList();
        });
      } else if (resp.data.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Competitor Networth",
          text: resp.data.message,
          confirmButtonColor: "#5156ed",
        }).then(function () {
          setLoading(false);
          setIsBtnClicked(false);
        });
      }
    });
  }
  else{
    Swal.fire({
      icon: "error",
      title: "Competitor Line of Business",
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
      compNo: competitorBizLineInput.compNo,
      remark: competitorBizLineInput.remark,
      bizLineValue: competitorBizLineInput.bizLineValue,
      tokenId: tokenId,
    };
    if (
      datatosend.compId !== null &&
      datatosend.compNo !== null &&
      datatosend.bizLineValue !== null &&
      competitorBizLineInput.bizLineId
    )
    {
    axios.put(`${baseUrl}/api/competitorlineofbusiness/${competitorBizLineInput.bizLineId}`, datatosend).then((resp) => {
      if (resp.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Competitor Line of Business",
          text: resp.data.message,
          timer: 2000,
        }).then(function () {
          setCompetitorBizLineInput({...competitorBizLineInput,bizLineId:null, remark: "", bizLineValue: ""});
          getBizLineList();
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
      }
      else{
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
              <div className="col-lg-5 text-dark font-weight-bold pt-1">
                <label htmlFor="bizLineValue"> Line of Business

                    {/* Value in Rupees ( &#8377; )<span className="text-danger">&nbsp;*</span>
                    <p className="text-info">( upto : 99,999,999,999.99 )</p> */}
                </label>
              </div>
              <div className="col-lg-7">
                <input
                  type="text"
                  className="form-control"
                  id="bizLineValue"
                  placeholder="Enter Business Name"
                  name="bizLineValue"
                  value={competitorBizLineInput.bizLineValue}
                  onChange={textInputHandler}                  
                />
                
                {/* {hasError.remark && (
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
              <div className="col-lg-5 text-dark font-weight-bold pt-1">
                <label htmlFor="remark">
                  Remarks
                </label>
              </div>
              <div className="col-lg-7">
                <input
                  type="text"
                  className="form-control"
                  id="remark"
                  placeholder="Remark"
                  name="remark"
                  value={competitorBizLineInput.remark}
                  onChange={textInputHandler}                  
                />
                
                {/* {hasError.remark && (
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
                <button className="btn btn-primary" disabled={!formIsValid || isBtnClicked === true} onClick={!competitorBizLineInput.bizLineId ? submitHandler : updateHandler}>
                  {!competitorBizLineInput.bizLineId
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
      <CompetitorDetailsLineOfBusinessList bizLineList={bizLineList} onEdit={onEdit} onDelete={onDelete}/>
    </div>
  );
};
export default CompetitorDetailsLineOfBusinessForm;
