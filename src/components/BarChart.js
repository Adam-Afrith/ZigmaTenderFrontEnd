import React, { useState, useEffect, useReducer } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
// import { Slider } from "@mui/material";
import { useBaseUrl } from "./hooks/useBaseUrl";

function BarChart(props) {
  const [chartValue, setChartValue] = useState();
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);

  const [val, setVal] = useState({ start: [], end: [] });
  const [state, setStates] = useState([]);
  const [count, setCounts] = useState([]);

  const [ulbPopulation, setUlbPopulation] = useState("");


  const { server1: baseUrl } = useBaseUrl();

  useEffect(() => {
    let total = 0;
    getpopulationata();
    setVal({
      start: 10,
      end: total,
    });
  }, []);

  const getpopulationata = async () => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    await axios.post(`${baseUrl}/api/dashboard/ulbpopdetails`,data).then((resp) => {
      if (resp.status === 200) {
        setUlbPopulation(resp.data.ulbdetails);        
        // console.log(resp.data.ulbdetails);
      }
    });
  };


  const setChart = () => {
    setOptions({
      chart: {
        id: "basic-bar",
        stacked: true,
        // stackType: '100%'
      },
      colors: ["#619c23", "#252525"],
      plotOptions: {
        bar: {
          horizontal: false,
          // columnWidth: '80%'
        },
      },
      legend: {
        position: "right",
        verticalAlign: "top",
        containerMargin: {
          left: 35,
          right: 60,
        },
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            plotOptions: {
              bar: {
                horizontal: true,
              },
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      xaxis: {
        labels: {
          rotate: 270,
          borderColor: "#00E396",
        },
        markers: {
          size: 6,
          strokeWidth: 3,
          fillOpacity: 0,
          strokeOpacity: 0,
          hover: {
            size: 8,
          },
        },
        categories: state,
      },

      title: {
        text: "ULB DETAILS",
      },
      noData: {
        text: "Loading...",
      },
    });

    setSeries([
      {
        name: "No of ULBs",
        data: count,
      },
    ]);
  };



  useEffect(() => {
    
    if(ulbPopulation.length>0 && props.value)
    {
      sliderOnChange();
    
    }
  }, [props.value, ulbPopulation]);

  const sliderOnChange = () => {
    // console.log("Props",props.value);
    let unit = [0, 100000, 300000, 500000, 1000000, 2000000];
    let value = props.value;
    let unique = [];
    let chartArr = {};
    if (ulbPopulation) {
      ulbPopulation.forEach((element) => {
        if (!unique.includes(element.id)) {
          unique.push(element.id);
        }

        if (
          ((value[0] < 6
            ? parseInt(element.population2011) >= unit[value[0]]
            : parseInt(element.population2011) >= unit[value[0]] - 1) &&
            (value[1] < 6
              ? parseInt(element.population2011) <= unit[value[1]]
              : parseInt(element.population2011) >= unit[value[1] - 1])) ||
          (value[1] === 6 &&
            (value[0] < 6
              ? parseInt(element.population2011) >= unit[value[0]]
              : parseInt(element.population2011) >= unit[value[0] - 1]))
        ) {
          chartArr[element.state_code] = {
            count: (chartArr[element.state_code]?.count || 0) + 1,
          };
        }
      });
      setChartValue(chartArr);
    }    
  };
  


  //to change Objet to array
  useEffect(() => {
    // console.log("chartValue",chartValue);
    if (chartValue) {
      setStates(Object.keys(chartValue));
      setCounts(Object.values(chartValue).map(item => item.count));
    }
  }, [chartValue]);

//to change Objet to array
useEffect(() => {
  // console.log("chartValue",chartValue);
  if (state && count) {
    setChart();
  }
}, [state, count]);

  

  return (
    <>
      <div className="responsive">
        <Chart
          options={options}
          series={series}
          type="bar"
          width="100%"
          height={450}
        />
      </div>
    </>
  );
}

export default BarChart;
