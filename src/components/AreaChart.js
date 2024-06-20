import React, { useState, useEffect, useReducer, useRef } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { Slider } from "@mui/material";
import Select from "react-select";
import { useBaseUrl } from "./hooks/useBaseUrl";

// const dataValue = [
//   { id: "31", count: 5, year: 2021, state_name: "Tamilnadu" },
//   { id: "31", count: 12, year: 2022, state_name: "Tamilnadu" },
//   { id: "31", count: 25, year: 2023, state_name: "Tamilnadu" },
//   { id: "1", count: 1, year: 2021, state_name: "Delhi" },
//   { id: "1", count: 5, year: 2022, state_name: "Delhi" },
//   { id: "1", count: 8, year: 2023, state_name: "Delhi" },
//   { id: "17", count: 10, year: 2021, state_name: "Karnataka" },
//   { id: "17", count: 20, year: 2022, state_name: "Karnataka" },
//   { id: "17", count: 2, year: 2023, state_name: "Karnataka" },
//   { id: "14", count: 0, year: 2021, state_name: "Himachal Pradesh" },
//   { id: "14", count: 20, year: 2022, state_name: "Himachal Pradesh" },
//   { id: "14", count: 45, year: 2023, state_name: "Himachal Pradesh" },
//   { id: "2", count: 12, year: 2021, state_name: "Andhra pradesh" },
//   { id: "2", count: 8, year: 2022, state_name: "Andhra pradesh" },
//   { id: "2", count: 0, year: 2023, state_name: "Andhra pradesh" },
// ];

const AreaChart = () => {
  const { server1: baseUrl } = useBaseUrl();
  const [dataValue, setDataValue]= useState([]);
  const [options, setOption] = useState([]); // list of values for dropdown
  const [selectedOption, setSelectedOption] = useState(null); // state for selected state id
  const [chartValue, setChartValue] = useState({
    year: [],
    count: [],
  }); // state hold value for chart preparing
  const [yearlysum, setYearlySum] = useState(); // holds [year : {count : value}] =>  [2021 : {count: 10}]
  const [opt, setOpt] = useState({}); // set year options for Chart in x axis
  const [srs, setSrs] = useState([]); // set Customer count options for Chart in y axis
  
  useEffect(()=>{
    //Customer Analysis
  axios.get(`${baseUrl}/api/dashboard/ulbdetails`).then((resp) => {
    console.log("resp", resp);
    setDataValue(resp.data.list);
  });
  },[])
  
  useEffect(() => {
    if (dataValue) {
      setdropdown();
    }
  }, [dataValue, selectedOption]);

  const setdropdown = () => {
    let uniqueList = []; //for Dropdown
    let uniqueYear = []; //for chart x axis
    let yearlyCount = [];
    

    let list = dataValue.forEach((item) => {
      //set Dropdown options
      if (!uniqueList.some((el) => el.value === item.id)) {
        let newArr = { value: item.id, label: item.state_name };
        uniqueList.push(newArr);
        // y.push(item.count);
      }

      //collect unique Year list
      if (!uniqueYear.some((elem) => elem == item.year)) {
        uniqueYear.push(item.year);
        // x.push(item.year);
      }

      if (!selectedOption) {
        if (uniqueYear.some((elem) => elem == item.year)) {
          yearlyCount[item.year] = {
            count: (yearlyCount[item.year]?.count || 0) + item.count,
          };
        }
      }
      else if ((uniqueYear.some((elem) => elem == item.year ) && item.id == selectedOption)) {
          yearlyCount[item.year] = {
            count: (yearlyCount[item.year]?.count || 0) + item.count,
          };
        
      }
    });
    setYearlySum(yearlyCount);
    setOption(uniqueList);
  };

  //to change Objet to array
  useEffect(() => {
      if (yearlysum) {
      setChartValue({
        year: Object.keys(yearlysum),
        count: Object.values(yearlysum.map((obj) => obj.count)),
      });
    }
  }, [yearlysum]);

  
  useEffect(() => {
    if (chartValue) {
      getOpt();
      getSrs();
    }
  }, [chartValue]);

  const getOpt = () => {
    setOpt({
      chart: {
        id: "area-bar",
      },
      xaxis: {
        categories: chartValue.year,
      },
      title: {
        text: "Customer Analysis",
      },
      noData: {
        text: "Loading...",
      },
    });
  };
  const getSrs = () => {
    setSrs([
      {
        name: "Customers",
        data: chartValue.count,
      },
    ]);
  };

  const handleTypeSelect = (e) => {
    if(e?.value){
      setSelectedOption(e.value);
    }
    else{
      setSelectedOption(null)
    }
  };

  return (
    <div className="col-log-12">
      <div className="row">        
        <div className="col-md-12 col-12 d-flex align-item-right mb-2 col-lg-12">
          <div className="col-sm-1 mt-2 col-lg-8">State : </div>
          <div className="col-sm-10 col-9 col-lg-4">
            <Select
              name="stateList"
              id="stateList"
              options={options}
              onChange={handleTypeSelect}
              isClearable='true'
              isSearchable='true'
              value={ options.filter(e=> e.value === selectedOption)}
              // value={selectedOption ? options.filter(e=> e.value === selectedOption) : null}
            ></Select>
          </div>
        </div>
      </div>
      <div>
        <Chart
          options={opt} 
          series={srs} 
          type="area"
          width="100%"
          height={350}
        />
      </div>
    </div>
  );
};

export default AreaChart;
