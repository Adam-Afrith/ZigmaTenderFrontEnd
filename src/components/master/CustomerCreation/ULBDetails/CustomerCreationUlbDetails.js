import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useBaseUrl } from "../../../hooks/useBaseUrl";
import { useDispatch, useSelector } from "react-redux";
import { ULBDetailsActions } from "../store/ULBDetailsSlice";


const initialState = {
  area: "",
  population2011: "",
  presentpopulation: "",
  wards: "",
  households: "",
  commercial: "",
  ABbusstand: "",
  CDbusstand: "",
  market_morethan_oneacre: "",
  market_lessthan_oneacre: "",
  lengthofroad: "",
  lengthofrouteroad: "",
  lengthofotherroad: "",
  lengthoflanes: "",
  lengthofpucca: "",
  lengthofcutcha: "",
  parks: "",
  parksforpublicuse: "",
  tricycle: "",
  bov: "",
  bovrepair: "",
  lcv: "",
  lcvrepair: "",
  compactor: "",
  hookloaderwithcapacity: "",
  compactorbin: "",
  hookloader: "",
  tractortipper: "",
  lorries: "",
  jcb: "",
  bobcat: "",
  sanitaryworkers_sanctioned: "",
  sanitaryworkers_inservice: "",
  sanitarysupervisor_sanctioned: "",
  sanitarysupervisor_inservice: "",
  permanentdrivers: "",
  regulardrivers: "",
  publicgathering: "",
  secondarystorage: "",
  transferstation: "",
  households_animatorsurvey: "",
  assessments_residential: "",
  assessments_commercial: "",
};

let formvalid = false;
const CustomerCreationUlbDetails = () => {
  const [loading, setLoading] = useState(true);
  const [datasending, setdatasending] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [input, setInput] = useState(initialState);
  const [ulbid, setuldid] = useState(null);
  const { id } = useParams();
  const { server1: baseUrl } = useBaseUrl();
  const navigate = useNavigate();
  const [toastSuccess, toastError, setCustomerCreationMainID] =
    useOutletContext();

  let ulbdata = useSelector((state) => state.ulbdata.inputData)
  const dispatch = useDispatch();
  
  const setPresentPopulation = () => {
  let parsedInput = parseInt(input.population2011.replace(/,/g, ''));
  
    if (parsedInput) {
      let date = new Date();
      var currentYear = date.getFullYear();
      //Lastest census year = 2011;
      //Approximate Annual Poppulation growth is 1%

      // let currentPopulation=  (currentYear-2011)*1*input.population2011;

      // f(x)=a(1+r)^x - exponential growth over time period
      //x- time interval
      //a- intial amount
      //r- growth rate

      let currentPopulation = Math.round(
        parsedInput * (1 + 1 / 100) ** (currentYear - 2011)
      );

      setInput((prev) => {
        return { ...prev, presentpopulation: currentPopulation };
      });
    } else {
      setInput({ ...input, presentpopulation: "" });
    }
  };

  useEffect(() => {
    setPresentPopulation();
  }, [input.population2011]);

  // useEffect(() => {
  //   if(ulbdata){
     
  //     for (const key in ulbdata) {
      
      
  //         setInput((prev) => {
  //           console.log(ulbdata[key])
  //           return { 
  //             ...prev,
  //             [key] : ulbdata[key]
  //           }
  //         })
     
  //     }
    
  //   }
  // }, [])
  // console.log(input)
 

  const updateWithRecentState = () => {
    if(ulbdata){
      for (const key in ulbdata) {
          setInput((prev) => {
            return { 
              ...prev,
              [key] : ulbdata[key]
            }
          })
      }
    }
  }

  const getulbdetails = () => {
    axios
      .get(`${baseUrl}/api/customercreationulbdetails/${id}`)
      .then((resp) => {
        if (resp.data.status === 200) {
          let ulbdetails = resp.data.ulbdetails;
          setInput({
            ...input,
            area: ulbdetails.area ? ulbdetails.area : "",
            population2011: ulbdetails.population2011
              ? ulbdetails.population2011
              : "",
            // presentpopulation : (ulbdetails.presentpopulation) ? (ulbdetails.presentpopulation) : "",
            wards: ulbdetails.wards ? ulbdetails.wards : "",
            households: ulbdetails.households ? ulbdetails.households : "",
            commercial: ulbdetails.commercial ? ulbdetails.commercial : "",
            ABbusstand: ulbdetails.ABbusstand ? ulbdetails.ABbusstand : "",
            CDbusstand: ulbdetails.CDbusstand ? ulbdetails.CDbusstand : "",
            market_morethan_oneacre: ulbdetails.market_morethan_oneacre
              ? ulbdetails.market_morethan_oneacre
              : "",
            market_lessthan_oneacre: ulbdetails.market_lessthan_oneacre
              ? ulbdetails.market_lessthan_oneacre
              : "",
            lengthofroad: ulbdetails.lengthofroad
              ? ulbdetails.lengthofroad
              : "",
            lengthofrouteroad: ulbdetails.lengthofrouteroad
              ? ulbdetails.lengthofrouteroad
              : "",
            lengthofotherroad: ulbdetails.lengthofotherroad
              ? ulbdetails.lengthofotherroad
              : "",
            lengthoflanes: ulbdetails.lengthoflanes
              ? ulbdetails.lengthoflanes
              : "",
            lengthofpucca: ulbdetails.lengthofpucca
              ? ulbdetails.lengthofpucca
              : "",
            lengthofcutcha: ulbdetails.lengthofcutcha
              ? ulbdetails.lengthofcutcha
              : "",
            parks: ulbdetails.parks ? ulbdetails.parks : "",
            parksforpublicuse: ulbdetails.parksforpublicuse
              ? ulbdetails.parksforpublicuse
              : "",
            tricycle: ulbdetails.tricycle ? ulbdetails.tricycle : "",
            bov: ulbdetails.bov ? ulbdetails.bov : "",
            bovrepair: ulbdetails.bovrepair ? ulbdetails.bovrepair : "",
            lcv: ulbdetails.lcv ? ulbdetails.lcv : "",
            lcvrepair: ulbdetails.lcvrepair ? ulbdetails.lcvrepair : "",
            compactor: ulbdetails.compactor ? ulbdetails.compactor : "",
            hookloaderwithcapacity: ulbdetails.hookloaderwithcapacity
              ? ulbdetails.hookloaderwithcapacity
              : "",
            compactorbin: ulbdetails.compactorbin
              ? ulbdetails.compactorbin
              : "",
            hookloader: ulbdetails.hookloader ? ulbdetails.hookloader : "",
            tractortipper: ulbdetails.tractortipper
              ? ulbdetails.tractortipper
              : "",
            lorries: ulbdetails.lorries ? ulbdetails.lorries : "",
            jcb: ulbdetails.jcb ? ulbdetails.jcb : "",
            bobcat: ulbdetails.bobcat ? ulbdetails.bobcat : "",
            sanitaryworkers_sanctioned: ulbdetails.sanitaryworkers_sanctioned
              ? ulbdetails.sanitaryworkers_sanctioned
              : "",
            sanitaryworkers_inservice: ulbdetails.sanitaryworkers_inservice
              ? ulbdetails.sanitaryworkers_inservice
              : "",
            sanitarysupervisor_sanctioned:
              ulbdetails.sanitarysupervisor_sanctioned
                ? ulbdetails.sanitarysupervisor_sanctioned
                : "",
            sanitarysupervisor_inservice:
              ulbdetails.sanitarysupervisor_inservice
                ? ulbdetails.sanitarysupervisor_inservice
                : "",
            permanentdrivers: ulbdetails.permanentdrivers
              ? ulbdetails.permanentdrivers
              : "",
            regulardrivers: ulbdetails.regulardrivers
              ? ulbdetails.regulardrivers
              : "",
            publicgathering: ulbdetails.publicgathering
              ? ulbdetails.publicgathering
              : "",
            secondarystorage: ulbdetails.secondarystorage
              ? ulbdetails.secondarystorage
              : "",
            transferstation: ulbdetails.transferstation
              ? ulbdetails.transferstation
              : "",
            households_animatorsurvey: ulbdetails.households_animatorsurvey
              ? ulbdetails.households_animatorsurvey
              : "",
            assessments_residential: ulbdetails.assessments_residential
              ? ulbdetails.assessments_residential
              : "",
            assessments_commercial: ulbdetails.assessments_commercial
              ? ulbdetails.assessments_commercial
              : "",
          });
          setuldid(ulbdetails.id);
          // navigate("/tender/master/customercreation/list/main/contactPerson/"+id);
        }
        updateWithRecentState()
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      setCustomerCreationMainID(id);
      getulbdetails();
    }
  }, []);

  const dispatchData = (e) => {
    dispatch(ULBDetailsActions.storeInput({name : e.target.name, value : e.target.value}));
  }

  const inputHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });

    dispatchData(e);
  };


  for (const key in input) {
    try{
    if (input[key].trim() !== "") {
      formvalid = true;
      break;
    } else {
      formvalid = false;
    }
  }
  catch(err){
    formvalid = false;
    toastError("Form is Invalid");
  }
  }

  const submitHandler = (e) => {
    e.preventDefault();
    setdatasending(true);
    let ulbdetails = {
      area: input.area,
      population2011: input.population2011,
      // presentpopulation: input.presentpopulation,
      wards: input.wards,
      households: input.households,
      commercial: input.commercial,
      ABbusstand: input.ABbusstand,
      CDbusstand: input.CDbusstand,
      market_morethan_oneacre: input.market_morethan_oneacre,
      market_lessthan_oneacre: input.market_lessthan_oneacre,
      lengthofroad: input.lengthofroad,
      lengthofrouteroad: input.lengthofrouteroad,
      lengthofotherroad: input.lengthofotherroad,
      lengthoflanes: input.lengthoflanes,
      lengthofpucca: input.lengthofpucca,
      lengthofcutcha: input.lengthofcutcha,
      parks: input.parks,
      parksforpublicuse: input.parksforpublicuse,
      tricycle: input.tricycle,
      bov: input.bov,
      bovrepair: input.bovrepair,
      lcv: input.lcv,
      lcvrepair: input.lcvrepair,
      compactor: input.compactor,
      hookloaderwithcapacity: input.hookloaderwithcapacity,
      compactorbin: input.compactorbin,
      hookloader: input.hookloader,
      tractortipper: input.tractortipper,
      lorries: input.lorries,
      jcb: input.jcb,
      bobcat: input.bobcat,
      sanitaryworkers_sanctioned: input.sanitaryworkers_sanctioned,
      sanitaryworkers_inservice: input.sanitaryworkers_inservice,
      sanitarysupervisor_sanctioned: input.sanitarysupervisor_sanctioned,
      sanitarysupervisor_inservice: input.sanitarysupervisor_inservice,
      permanentdrivers: input.permanentdrivers,
      regulardrivers: input.regulardrivers,
      publicgathering: input.publicgathering,
      secondarystorage: input.secondarystorage,
      transferstation: input.transferstation,
      households_animatorsurvey: input.households_animatorsurvey,
      assessments_residential: input.assessments_residential,
      assessments_commercial: input.assessments_commercial,
      cust_creation_mainid: id,
    };

    let data = {
      ulbdetails: ulbdetails,
      tokenid: localStorage.getItem("token"),
    };

    if (ulbid) {
      putData(data);
    } else {
      postData(data);
    }
  };

  const postData = (data) => {
    axios
      .post(`${baseUrl}/api/customercreationulbdetails`, data)
      .then((resp) => {
        if (resp.data.status === 200) {
          toastSuccess(resp.data.message);
          resetall();
          navigate(
            "/tender/master/customercreation/list/main/bankdetails/" + id
          );
        } else if (resp.data.status === 400) {
          toastError(resp.data.message);
        }
        setdatasending(false);
      });
  };

  const putData = (data) => {
    axios
      .put(`${baseUrl}/api/customercreationulbdetails/${ulbid}`, data)
      .then((resp) => {
        if (resp.data.status === 200) {
          toastSuccess(resp.data.message);
          resetall();
          navigate(
            "/tender/master/customercreation/list/main/bankdetails/" + id
          );
        } else if (resp.data.status === 400) {
          toastError(resp.data.message);
        }
        setdatasending(false);
      });
  };

  const cancelHandler = () => {
    resetall();
  };

  const resetall = () => {
    setInput(initialState);
    dispatch(ULBDetailsActions.resetInput())
  };



 
  return (
    <Fragment>
      <div className="">
        {id && loading && (
          <div className="loading">
            <img
              id="loading-image"
              src="/assets/img/282.gif"
              alt="Loading..."
            />
          </div>
        )}
        {!id && (
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
        <form onSubmit={submitHandler}>
          <div className="row align-items-center">
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="area">Area in Sq.km </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="area"
                    name="area"
                    // value={ulbdata?.area ? ulbdata.area : input.area}
                    value={input.area}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4"  >
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="population2011">Population as per 2011</label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="number"
                    className="form-control"
                    id="population2011"
                    name="population2011"
                    // value={ulbdata?.population2011 ? ulbdata.population2011 : input.population2011}
                    value={input.population2011}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4"   >
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="presentpopulation">Present Population</label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="presentpopulation"
                    name="presentpopulation"
                    // value={ulbdata?.presentpopulation ? ulbdata.presentpopulation : input.presentpopulation}
                    value={!isNaN(input.presentpopulation)?input.presentpopulation:""}
                    onChange={inputHandler}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4"   >
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="wards">No. of Wards</label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="wards"
                    name="wards"
                    // value={ulbdata?.wards ? ulbdata.wards : input.wards}
                    value={input.wards}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4"   >
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="households">No. House holds</label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="households"
                    name="households"
                    value={input.households}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4"  >
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="commercial">
                    No. of commercial establishments
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="commercial"
                    name="commercial"
                    value={input.commercial}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4"  >
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="ABbusstand">No. of A&B grade bus stand</label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="ABbusstand"
                    name="ABbusstand"
                    value={input.ABbusstand}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4"  >
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="CDbusstand">No. of C&D grade bus stand</label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="CDbusstand"
                    name="CDbusstand"
                    value={input.CDbusstand}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4"  >
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="market_morethan_oneacre">
                    No. of markets available (having area more than one acre)
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="mamarket_morethan_oneacrerket"
                    name="market_morethan_oneacre"
                    value={input.market_morethan_oneacre}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="market_lessthan_oneacre">
                    No. of markets available (having area less than one acre)
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="market_lessthan_oneacre"
                    name="market_lessthan_oneacre"
                    value={input.market_lessthan_oneacre}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="lengthofroad">
                    Total length of Roads (Km)
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="lengthofroad"
                    name="lengthofroad"
                    value={input.lengthofroad}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="lengthofrouteroad">
                    Length of route Roads alone (Km)
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="lengthofrouteroad"
                    name="lengthofrouteroad"
                    value={input.lengthofrouteroad}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="lengthofotherroad">
                    Length of other roads/streets alone (Km)
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="lengthofotherroad"
                    name="lengthofotherroad"
                    value={input.lengthofotherroad}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4"  >
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="lengthoflanes">
                    Length of other Lanes alone (Km)
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="lengthoflanes"
                    name="lengthoflanes"
                    value={input.lengthoflanes}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="lengthofpucca">
                    Length of Pucca drain (Km)
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="lengthofpucca"
                    name="lengthofpucca"
                    value={input.lengthofpucca}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="lengthofcutcha">
                    Length of Cutcha drain (Km)
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="lengthofcutcha"
                    name="lengthofcutcha"
                    value={input.lengthofcutcha}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="parks">No. of parks available</label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="parks"
                    name="parks"
                    value={input.parks}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="parksforpublicuse">
                    No. of parks dedicated to public use
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="parksforpublicuse"
                    name="parksforpublicuse"
                    value={input.parksforpublicuse}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="tricycle">
                    No. of Tricycle available for d2d collection
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="tricycle"
                    name="tricycle"
                    value={input.tricycle}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="bov">No. of bov in working condition</label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="bov"
                    name="bov"
                    value={input.bov}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="bovrepair">No. of bov in repair</label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="bovrepair"
                    name="bovrepair"
                    value={input.bovrepair}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="lcv">
                    No. of LCV available in working condition
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="lcv"
                    name="lcv"
                    value={input.lcv}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="lcvrepair">
                    No. of LCV available with repair
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="lcvrepair"
                    name="lcvrepair"
                    value={input.lcvrepair}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="compactor">
                    No. of compactor available and its capacity
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="compactor"
                    name="compactor"
                    value={input.compactor}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="hookloaderwithcapacity">
                    No. of Hook loader available and its capacity
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="hookloaderwithcapacity"
                    name="hookloaderwithcapacity"
                    value={input.hookloaderwithcapacity}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="compactorbin">
                    No. of compactor bin available
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="compactorbin"
                    name="compactorbin"
                    value={input.compactorbin}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="hookloader">
                    No. of Hook loader available
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="hookloader"
                    name="hookloader"
                    value={input.hookloader}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="tractortipper">
                    No. of tractor cum tipper vehicle available
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="tractortipper"
                    name="tractortipper"
                    value={input.tractortipper}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="lorries">
                    No. of Lorries available and its capacity
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="lorries"
                    name="lorries"
                    value={input.lorries}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="jcb">No. of JCB available</label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="jcb"
                    name="jcb"
                    value={input.jcb}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="bobcat">No. of bobCat available</label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="bobcat"
                    name="bobcat"
                    value={input.bobcat}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="sanitaryworkers_sanctioned">
                    No. of sanitary workers (permanent) sanctioned
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="sanitaryworkers_sanctioned"
                    name="sanitaryworkers_sanctioned"
                    value={input.sanitaryworkers_sanctioned}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="sanitaryworkers_inservice">
                    No. of sanitary workers are in service on date (available)
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="sanitaryworkers_inservice"
                    name="sanitaryworkers_inservice"
                    value={input.sanitaryworkers_inservice}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="sanitarysupervisor_sanctioned">
                    No. of (permanent) sanitary supervisor sanctioned
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="sanitarysupervisor_sanctioned"
                    name="sanitarysupervisor_sanctioned"
                    value={input.sanitarysupervisor_sanctioned}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="sanitarysupervisor_inservice">
                    No. of sanitary supervisor are in service (available)
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="sanitarysupervisor_inservice"
                    name="sanitarysupervisor_inservice"
                    value={input.sanitarysupervisor_inservice}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="permanentdrivers">
                    No. of permanenty drivers sanctioned
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="permanentdrivers"
                    name="permanentdrivers"
                    value={input.permanentdrivers}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="regulardrivers">
                    No. of regular drivers available
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="regulardrivers"
                    name="regulardrivers"
                    value={input.regulardrivers}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="publicgathering">
                    No. of public gathering area (public meeting point)
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="publicgathering"
                    name="publicgathering"
                    value={input.publicgathering}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="secondarystorage">
                    No. of secondary storage point if any
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="secondarystorage"
                    name="secondarystorage"
                    value={input.secondarystorage}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="transferstation">
                    No. of Transfer station if any
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="transferstation"
                    name="transferstation"
                    value={input.transferstation}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="households_animatorsurvey">
                    No. of household (as per animator survey)
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="households_animatorsurvey"
                    name="households_animatorsurvey"
                    value={input.households_animatorsurvey}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="assessments_residential">
                    No. of assessments (residential)
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="assessments_residential"
                    name="assessments_residential"
                    value={input.assessments_residential}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-6 mb-4">
              <div className="row align-items-center font-weight-bold">
                <div className="col-lg-7 text-dark">
                  <label htmlFor="assessments_commercial">
                    No. of assessments (commercial)
                  </label>
                </div>
                <div className="col-lg-5">
                  <input
                    type="text"
                    className="form-control"
                    id="assessments_commercial"
                    name="assessments_commercial"
                    value={input.assessments_commercial}
                    onChange={inputHandler}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-12 mt-3 d-flex justify-content-end">
              <button
                className={
                  !formvalid
                    ? "btn btn-outline-primary mr-3 rounded-pill"
                    : "btn btn-primary mr-3 rounded-pill"
                }
                onClick={submitHandler}
                disabled={!formvalid || datasending}
              >
                {datasending && (
                  <span className="spinner-border spinner-border-sm mr-2"></span>
                )}
                {datasending && (ulbid ? "Updating..." : "Saving...")}
                {!datasending &&
                  (ulbid ? "Update & Continue" : "Save & Continue")}
              </button>
              <button
                className="btn  btn-outline-dark rounded-pill"
                onClick={() => navigate("/tender/master/customercreation/list")}
                disabled={datasending}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default CustomerCreationUlbDetails;
