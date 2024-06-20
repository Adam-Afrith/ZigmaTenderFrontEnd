import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../storeAuth/auth-context";
import { useBaseUrl } from "./hooks/useBaseUrl";
import axios from "axios";
import "./logoicon.css";
import { usePageTitle } from "./hooks/usePageTitle";
import { motion } from "framer-motion";
import { ulbdataActions } from "./store/UlbDataSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Slider } from "@mui/material";
import AreaChart from "./AreaChart";
import BarChart from "./BarChart";
import Chart from "react-apexcharts";
import Unauthorized from "./pages/Unauthorized";

// Demo

function valueLabelFormat(value) {
  const units = [
    "0",
    "1 Lakh",
    "3 Lakh",
    "5 Lakh",
    "10 Lakh",
    "20 Lakh",
    "Greater than 20 Lakh",
  ];
  return units[value];
}


function Dashboard() {
  const authCtx = useContext(AuthContext);

  // const authCtx = useContext(AuthContext);
  const { server1: baseUrl } = useBaseUrl();

  const [value, setValue] = React.useState([0, 6]);

  const [data, setData] = useState([]);

  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);

  const [getRole, setGetRole] = useState([]);
  const [checkRole, setCheckRole] = useState(null);
  const [Live_tenders_count, setLive_tenders_count] = useState(0);
  const [fresh_tenders_count, setfresh_tenders_count] = useState(0);
  const [awarded_tenders_count, setawarded_tenders_count] = useState(0);
  const [completed_tenders_count, setcompleted_tenders_count] = useState(0);
  const [running_tenders_count, setrunning_tenders_count] = useState(0);
  const [bidanalysis, setbidAnalysis] = useState({
    awarded: 0,
    // bid_submitted: 0,
    to_be_opened: 0,
    // bid_details: 0,
    in_tech_eval: 0,
    in_fin_eval: 0,
    cancelled: 0,
    retender: 0,
  });

  const [callCount, setCallCount] = useState({
    attendedCallsCount: 0,
    completedCallCount: 0,
    openingCallCount: 0,
    overduecallcount: 0,
    todaycallCount: 0,
  })

  const marks = [
    { value: 0, label: "Zero" },
    { value: 6, label: "20 Lakh +" },
  ]; // defines the start and end points for the slider

  usePageTitle("Dashboard");

  const handleChange = (event, newValue) => { 
    setValue(newValue);
    console.log("newValue ", newValue); 
      };

  useEffect(() => {

    let data = {
      tokenid : localStorage.getItem('token')
    }
    // setValue(0,6)
    //Tender Analysis
    axios.post(`${baseUrl}/api/dashboard/tenderanalysis`,data).then((resp) => {
      // console.log("Tender :",resp.data);
    });

    

    //Customer Bid Analysis
    axios.post(`${baseUrl}/api/dashboard/bidanalysis`,data).then((resp) => {
      if (resp.data.status === 200) {
        // console.log("Bid :", resp.data);

        setbidAnalysis({
          awarded: resp.data.awarded.reduce((acc, item) => {
            return acc + item.count;
          }, 0),
           bid_submitted: resp.data.bid_submitted.reduce((acc, item) => {
            return acc + item.count;
          }, 0),
          to_be_opened: resp.data.to_be_opened.reduce((acc, item) => {
            return acc + item.count;
          }, 0),
          bid_details: resp.data.bid_details.reduce((acc, item) => {
            return acc + item.count;
          }, 0),
          in_tech_eval: resp.data.in_tech_eval.reduce((acc, item) => {
            return acc + item.count;
          }, 0),
          in_fin_eval: resp.data.in_fin_eval.reduce((acc, item) => {
            return acc + item.count;
          }, 0),
          cancelled: resp.data.cancelled.reduce((acc, item) => {
            return acc + item.count;
          }, 0),
          retender: resp.data.retender.reduce((acc, item) => {
            return acc + item.count;
          }, 0),
        });
      }
    });

    //Dashboard card
    
    axios
      .post(`${baseUrl}/api/bidcreation/creation/projectstatus`,data)
      .then((resp) => {
        // if(resp.data.awarded_tender_count){
        // console.log("project status", resp);
        if (resp.data.status === 200) {
          resp.data.live_tender_count &&
            setLive_tenders_count(resp.data.live_tender_count);
          resp.data.fresh_tender_count &&
            setfresh_tenders_count(resp.data.fresh_tender_count);
          resp.data.awarded_tender_count &&
            setawarded_tenders_count(resp.data.awarded_tender_count);
          resp.data.completed_tenders_count &&
            setcompleted_tenders_count(resp.data.completed_tenders_count);
          resp.data.running_tenders_count &&
            setrunning_tenders_count(resp.data.running_tenders_count);
        } else {
          console.log("error");
        }
      });
      
      axios
      .post(`${baseUrl}/api/dashboard/getCallCountAnalysis`, data)
      .then((resp) => {
        if (resp.data.status === 200) {
           console.log("Call Count IF: ",resp.data);

          setCallCount({
            attendedCallsCount: resp.data.attendedCallsCount,
            completedCallCount: resp.data.completedCallCount,
            openingCallCount: resp.data.openingCallCount,
            overduecallcount: resp.data.overduecallcount,
            todaycallCount: resp.data.todaycallCount
          })
        }
        else{
          console.log("Call Count Else: ",resp);
        }
      });
 setGetRole(authCtx?.role);
      authCtx?.role == 'BDM' ? setCheckRole(false) : setCheckRole(true);
  }, []);

  
  return (
    <>
      <div className="fixedCard">
        <div className="row">
          <div className="col-xl-12 col-md-12">
            <ul className="cardUl">
              <li>
                <div
                  className="card shadow h-100 py-2 border-left-primary border-3"                 
                >
                  <div className="card-body ">
                    <div className="row no-gutters align-items-center ">
                      <div className="col mr-2">
                        {/* <div className='icons icons1'>                                                                                      
                              <i className="fa-regular fa-signal-stream"></i>                         
                            </div> */}
                        <div className="h4 text-xl font-weight-bold text-primary text-uppercase mb-2 text-center">
                          Live Tenders
                        </div>

                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {Live_tenders_count}
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-live"></div>
                            
                          </div> */}
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <div
                  className="card border-left-success shadow h-100 py-2  border-3"
                >
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        {/* <div className='icons icons1'>                          
                              <i className="fa-solid fa-phone"></i>                           
                            </div> */}
                        <div className="h4 text-xl font-weight-bold text-success text-uppercase mb-2 text-center">
                          Fresh Tenders
                        </div>
                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {fresh_tenders_count}
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-fresh"></div>
                            <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                          </div> */}
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <div
                  className="card border-left-info shadow h-100 py-2  border-3"                  
                >
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="h4 text-xl font-weight-bold text-info text-uppercase mb-2 text-center">
                          Awarded Tenders
                        </div>
                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {awarded_tenders_count}
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-info"></div>
                            <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                          </div> */}
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <div
                  className="card border-left-pink shadow h-100 py-2  border-3"                  
                >
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="h4 text-xl font-weight-bold text-pink text-uppercase mb-2 text-center">
                          Running Tenders
                        </div>
                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {running_tenders_count}
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-info"></div>
                            <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                          </div> */}
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <div
                  className="card border-left-orange shadow h-100 py-2  border-3"                  
                >
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="h4 text-xl font-weight-bold text-orange text-uppercase mb-2 text-center">
                          Completed Tenders
                        </div>
                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {completed_tenders_count}
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-info"></div>
                            <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                          </div> */}
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <div
                  className="card shadow h-100 py-2 border-left-red border-3"                 
                >
                  <div className="card-body ">
                    <div className="row no-gutters align-items-center ">
                      <div className="col mr-2">
                        <div className="h4 text-xl font-weight-bold text-red text-uppercase mb-2 text-center">
                          Opening Calls
                        </div>

                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {/* {Live_tenders_count} */} {callCount.openingCallCount}
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-live"></div>
                            
                          </div> */}
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <div
                  className="card border-left-dblue shadow h-100 py-2  border-3"                  
                >
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="h4 text-xl font-weight-bold text-dblue text-uppercase mb-2 text-center">
                          Today Calls
                        </div>
                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {/* {fresh_tenders_count} */}{callCount.todaycallCount}
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-fresh"></div>
                            <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                          </div> */}
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <div
                  className="card border-left-brown shadow h-100 py-2  border-3"
                  
                >
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="h4 text-xl font-weight-bold text-brown text-uppercase mb-2 text-center">
                          Attended Calls
                        </div>
                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {/* {awarded_tenders_count} */} {callCount.attendedCallsCount}
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-info"></div>
                            <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                          </div> */}
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <div
                  className="card border-left-yellow shadow h-100 py-2  border-3"
                  
                >
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="h4 text-xl font-weight-bold text-yellow text-uppercase mb-2 text-center">
                          Completed Calls
                        </div>
                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {/* {running_tenders_count} */} {callCount.completedCallCount}
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-info"></div>
                            <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                          </div> */}
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <div
                  className="card border-left-ash shadow h-100 py-2  border-3"                 
                >
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="h4 text-xl font-weight-bold text-ash text-uppercase mb-2 text-center">
                          Over Due Calls
                        </div>
                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {/* {completed_tenders_count} */} {callCount.overduecallcount}
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-info"></div>
                            <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                          </div> */}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>    
        </div>        
      </div>

      {checkRole ? <div className="DynamicCard">
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="box col-lg-12">
              <div className="slider">
                <div className="col-md-6 mb-2 h6 text-primery">
                  {" "}Population :{" "}
                </div>
                <div className="col-md-6">
                  <Slider
                    value={value}
                    min={0}
                    step={1}
                    max={6}
                    // getAriaValueText={valueLabelFormat}
                    valueLabelFormat={valueLabelFormat}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    marks={marks}
                  />
                </div>
              </div>
            </div>
            <BarChart value={value} />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 col-md-12">
            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="responsive">
                  <Chart
                    id="pieChart"
                    type="donut"
                    width="100%"
                    height={400}
                    options={{
                      labels: [
                        "To Be Opened",
                        "In Technical Evaluation ",
                        "In Financial Evaluation ",
                        "Contract Awarded",
                        "Tender Cancelled",
                        "Tender Retender",
                      ],
                      title: {
                        text: "Bid Analysis",
                      },
                      plotOptions: {
                        pie: {
                          donut: {
                            size: "65%",
                            labels: {
                              show: true,
                              total: {
                                show: true,
                                fontSize: 20,
                                color: "#23b4f4",
                              },
                            },
                          },
                        },
                      },
                      responsive: [
                        {
                          breakpoint: 1000,
                          options: {
                            plotOptions: {
                              bar: {
                                size: "100%"
                              },
                            },
                            legend: {
                              position: "bottom",
                            },
                          },
                        },
                      ],
                    }}
                    series={[
                      bidanalysis?.to_be_opened,
                      bidanalysis?.in_tech_eval,
                      bidanalysis?.in_fin_eval,
                      bidanalysis?.awarded,
                      bidanalysis?.cancelled,
                      bidanalysis?.retender,
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="responsive">
                  <Chart
                    type="pie"
                    width="100%"
                    height={400}
                    options={{
                      labels: [
                        "To Be Opened",
                        "In Technical Evaluation ",
                        "In Financial Evaluation ",
                        "Contract Awarded",
                        "Tender Cancelled",
                        "Tender Retender",
                      ],
                      responsive: [
                        {
                          breakpoint: 1000,
                          options: {
                            plotOptions: {
                              bar: {
                                size: "100%"
                              },
                            },
                            legend: {
                              position: "bottom",
                            },
                          },
                        },
                      ],
                      title: {
                        text: "Bid Analysis - 2",
                      },
                    }}
                    series={[
                      // bidanalysis.bid_submitted,
                      bidanalysis.to_be_opened,
                      // data.bid_details,
                      bidanalysis.in_tech_eval,
                      bidanalysis.in_fin_eval,
                      bidanalysis.awarded,
                      bidanalysis.cancelled,
                      bidanalysis.retender,
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow mb-4">
          <div className="card-body">
            
            <AreaChart />
            
          </div>
        </div>
      </div> : null }
    </>
  );
}

export default Dashboard;
