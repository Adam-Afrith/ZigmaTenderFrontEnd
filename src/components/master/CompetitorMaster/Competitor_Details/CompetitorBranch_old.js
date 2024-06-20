import { usePageTitle } from "../../../hooks/usePageTitle";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBaseUrl } from "../../../hooks/useBaseUrl";
import Select from "react-select";
import Swal from "sweetalert2";
import { Loader } from "rsuite";

//For DataTable
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-bs4";
import jsZip from "jszip";
import "datatables.net-buttons-bs4";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Link } from "react-router-dom";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
window.JSZip = jsZip;

let table;

const CompetitorBranch = () => {
  const { compid } = useParams();
  usePageTitle("Competitor Creation");
  const initialValue={
    branchId: null,
    compNo: null,
    country: null,
    state: null,
    district: null,
    city: null,
  }
  const [competitorBranchInput, setCompetitorBranchInput] = useState(initialValue);

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [formIsValid, setFormIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [editableRow, setEditableRow] = useState({
    branchId: null,
    compNo: null,
    country: null,
    state: null,
    district: null,
    city: null,
  });
  const [isMounted, setIsMounted] = useState(true);
  let inserted_id = 0;
  const [isChanged, setIsChanged] = useState({
    country: false,
    state: false,
    district: false,
    city: false,
  });
  const [hasError, setHasError] = useState({
    country: null,
    state: null,
    district: null,
    city: null,
  });

  var dataSet = []
  const { server1: baseUrl } = useBaseUrl();
  const navigate = useNavigate();

  useEffect(() => {
    
    getBranchList();
    getCountryList();
    getCompNo();
  }, []);


  useEffect(() => {
    var i=0;
    table =  $('#dataTable').DataTable({
         data: dataSet,
         columns: [
          {render: function (data, type, row) {
                    return ++i;
                  },
          },
          { data: "country_name" },
          { data: "state_name" },
          { data: "district_name" },
          { data: "city_name" },
          { data: "action" },
         ],
     })
     setIsMounted(false);
     $("#dataTable tbody").on("click", "tr .fa-edit", function () {
      let rowdata = table.row($(this).closest("tr")).data();
      getBranchDetails(rowdata.id);
    });
 
       // to delete a row
    $("#dataTable tbody").on("click", "tr .fa-trash-alt", async function () {
      let rowdata = table.row($(this).closest("tr")).data();

      Swal.fire({
        text: `Are You sure, to delete ${rowdata.city}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        confirmButtonColor: "#2fba5f",
        cancelButtonColor: "#fc5157",
      }).then(async (willDelete) => {
        if (willDelete.isConfirmed) {
          let response = await deleteBranch(rowdata.id);

          if (response.data.status === 200) {
            Swal.fire({
              //success msg
              icon: "success",
              text: `${rowdata.projectstatus} has been removed!`,
              timer: 1500,
              showConfirmButton: false,
            });

            //delete in datatable
            table
              .row($(this).parents("tr"))
              .remove()
              .column(0)
              .nodes()
              .each(function (cell, i) {
                cell.innerHTML = i + 1;
              })
              .draw();
          } else if (response.data.status === 404) {
            Swal.fire({
              // error msg
              icon: "error",
              text: response.data.message,
              showConfirmButton: true,
            });
          } else {
            Swal.fire({
              title: "Cancelled",
              icon: "error",
              timer: 1500,
            });
          }
        }
      });
    });
  }, [])
 
  useEffect(() => {
     if(branchList){
         table.clear().rows.add(branchList).draw();
     }
  }, [branchList])
  

  
  const getBranchList = async () => {
    const db_branchlist = await axios.get(`${baseUrl}/api/competitorbranch/branchlist/${compid}`);
    if (db_branchlist.data.status === 200) {
      let list = [...db_branchlist.data.branch];

      let listarr = list.map((item, index) => ({
        ...item,
        action: `<i class="fas fa-edit text-info mx-2 h6" style="cursor:pointer" title="Edit"></i> <i class="fas fa-trash-alt text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>`,
        sl_no: index + 1,
      }));
      setBranchList(listarr);
    } else {
      setBranchList([]);
    }
    // let i = 0;
    // table = $("#dataTable").DataTable({
    //   data: dataset,
    //   columns: [
    //     {
    //       render: function (data, type, row) {
    //         return ++i;
    //       },
    //     },
    //     { data: "country_name" },
    //     { data: "state_name" },
    //     { data: "district_name" },
    //     { data: "city_name" },
    //     { data: "action" },
    //   ],
    // });
    // setIsMounted(false);

    // $("#dataTable tbody").on("click", "tr .fa-edit", function () {
    //   let rowdata = table.row($(this).closest("tr")).data();
    //   getBranchDetails(rowdata.id);
    // });

    // // to delete a row
    // $("#dataTable tbody").on("click", "tr .fa-trash-alt", async function () {
    //   let rowdata = table.row($(this).closest("tr")).data();

    //   Swal.fire({
    //     text: `Are You sure, to delete ${rowdata.city}?`,
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonText: "Yes, delete it!",
    //     cancelButtonText: "No, cancel!",
    //     confirmButtonColor: "#2fba5f",
    //     cancelButtonColor: "#fc5157",
    //   }).then(async (willDelete) => {
    //     if (willDelete.isConfirmed) {
    //       let response = await deleteBranch(rowdata.id);

    //       if (response.data.status === 200) {
    //         Swal.fire({
    //           //success msg
    //           icon: "success",
    //           text: `${rowdata.projectstatus} has been removed!`,
    //           timer: 1500,
    //           showConfirmButton: false,
    //         });

    //         //delete in datatable
    //         table
    //           .row($(this).parents("tr"))
    //           .remove()
    //           .column(0)
    //           .nodes()
    //           .each(function (cell, i) {
    //             cell.innerHTML = i + 1;
    //           })
    //           .draw();
    //       } else if (response.data.status === 404) {
    //         Swal.fire({
    //           // error msg
    //           icon: "error",
    //           text: response.data.message,
    //           showConfirmButton: true,
    //         });
    //       } else {
    //         Swal.fire({
    //           title: "Cancelled",
    //           icon: "error",
    //           timer: 1500,
    //         });
    //       }
    //     }
    //   });
    // });
  };



  const getBranchDetails = async (rowid) => {
    let fetchedData = await axios.get(
      `${baseUrl}/api/competitorbranch/${rowid}`
    );
    setEditableRow((prev) => {
      return {
        ...prev,
        branchId: fetchedData.data.branch.id,
        compNo: fetchedData.data.branch.compNo,
        country: fetchedData.data.branch.country,
        state: fetchedData.data.branch.state,
        district: fetchedData.data.branch.district,
        city: fetchedData.data.branch.city,
      };
    });
  };
  useEffect(() => {
    if (
      editableRow.branchId &&
      editableRow.country !== "" &&
      countryList.length > 0 && isChanged.country===false
    ) {
      
      setCompetitorBranchInput({
        ...competitorBranchInput,
        country: countryList.find((x) => x.value === editableRow.country),
      });
    }
    else{
      
      setStateList([]);
      setDistrictList([]);
      setCityList([]);
      setCompetitorBranchInput((prev) => {
        return { ...prev, country: null, state:null, district: null, city: null };
          });
    }
  }, [editableRow, countryList]);

  const getCompNo = async () => {
    await axios
      .get(`${baseUrl}/api/competitorprofile/getcompno/${compid}`)
      .then((resp) => {
        if (resp.data.status === 200) {
          setCompetitorBranchInput({
            ...competitorBranchInput,
            compNo: resp.data.compNo,
          });
        }
      });
  };

  const getCountryList = async () => {
    await axios.get(`${baseUrl}/api/country/list`).then((resp) => {
      setCountryList(resp.data.countryList);
      setStateList([]);
    });
  };

  const getStateList = async () => {
    if(competitorBranchInput.country!==null){
    await axios
      .get(`${baseUrl}/api/state/list/${competitorBranchInput.country.value}`)
      .then((resp) => {
        setStateList(resp.data.stateList);
        setDistrictList([]);
      });
    }
  };
  const getDistrictList = async () => {
    if(competitorBranchInput.country!==null && competitorBranchInput.state!==null)
    {
    await axios
      .get(
        `${baseUrl}/api/district/list/${competitorBranchInput.country.value}/${competitorBranchInput.state.value}`
      )
      .then((resp) => {
        setDistrictList(resp.data.districtList);
        setCityList([]);
      });
    }
  };
  const getCityList = async () => {
    if(competitorBranchInput.country!==null && competitorBranchInput.state!==null && competitorBranchInput.district!==null )
    {
    await axios
      .get(
        `${baseUrl}/api/city/list/${competitorBranchInput.country.value}/${competitorBranchInput.state.value}/${competitorBranchInput.district.value}/null`
      )
      .then((resp) => {
        setCityList(resp.data.cityList);
      });
    }
  };

  useEffect(() => {
    
    if(editableRow.branchId && competitorBranchInput.country!==null && isChanged.country===false){
      console.log("In if");
      setStateList([]);
      setDistrictList([]);
      setCityList([]);
      getStateList();
    }
    else if(editableRow.branchId && competitorBranchInput.country===null){
      console.log("In Elif");
      setCompetitorBranchInput((prev) => {
        return { ...prev,state:null, district: null, city: null };
          });
      getStateList();
      setDistrictList([]);
      setCityList([]);
    }
    else{
      console.log("In else");
      setStateList([]);
      setDistrictList([]);
      setCityList([]);
    }
    
  }, [competitorBranchInput.country]);

//set state and get districtList
  useEffect(()=>{
    if(editableRow.branchId > 0 &&
      competitorBranchInput.country !== null &&
      stateList.length > 0 && isChanged.state===false)
      {
        setCompetitorBranchInput((prev)=>{return{...prev, state: stateList.find((x) => x.value === editableRow.state)
        }});
        setCompetitorBranchInput((prev) => {
              return { ...prev, district: null, city: null };
            });
            getDistrictList();
      }
      else {
        setCompetitorBranchInput((prev) => {
              return { ...prev, state: null, district: null, city: null };
            });
          setDistrictList([]);
          setCityList([]);
      }
  },[stateList])
  
//get districtList
  useEffect(() => {
    if(editableRow.branchId > 0 &&
      competitorBranchInput.state !== null &&
      districtList.length > 0 && isChanged.state===false)
      { setDistrictList([]);
        getDistrictList();
        setCompetitorBranchInput((prev) => {
          return { ...prev, district: null, city: null };
        });
        setCityList([]);
      }
    else if (competitorBranchInput.state !== null && stateList.length > 0) {
      setDistrictList([]);
      getDistrictList();
      setCompetitorBranchInput((prev) => {
        return { ...prev, district: null, city: null };
      });
      setCityList([]);
    }
    else{
      setDistrictList([]);
      setCityList([]);
      setCompetitorBranchInput((prev) => {
      return { ...prev, district: null, city: null };
    });
    
  }
  }, [competitorBranchInput.state]);


  //set district and get citytList
  useEffect(()=>{
    if(editableRow.branchId > 0 &&
      competitorBranchInput.state !== null &&
      districtList.length > 0 && editableRow.district!== null && isChanged.district===false)
      {
        setCompetitorBranchInput((prev)=>{return{...prev, district: districtList.find((x) => x.value === editableRow.district), city : null
        }});
          setCityList([]);  
      }
      else if(editableRow.branchId > 0 &&
        competitorBranchInput.state !== null &&
        districtList.length > 0 && isChanged.state===true){
          setCompetitorBranchInput((prev) => {
            return { ...prev, district:null, city: null };
          });

        setCityList([]);
      }
      else{
        setCompetitorBranchInput((prev) => {
              return { ...prev, district: null, city: null };
            });
          setCityList([]);
      }
  },[districtList]);

  //set city
  useEffect(() => {
   
    if (competitorBranchInput.district !== null && districtList.length > 0) {
      getCityList();
      setCompetitorBranchInput((prev) => {
      return { ...prev, city: null };
    });
  }
  else{setCityList([]);}
  }, [competitorBranchInput.district]);

    //set city
    useEffect(()=>{
      if(editableRow.branchId > 0 &&
        competitorBranchInput.district !== null &&
        cityList.length > 0 && editableRow.city!== null &&  isChanged.city===false)
        {
          setCompetitorBranchInput((prev)=>{return{...prev, city: cityList.find((x) => x.value === editableRow.city)
          }});
          setCompetitorBranchInput((prev) => {
            return {
              ...prev,
              branchId: editableRow.branchId,
              compNo: editableRow.compNo,
            };
          });
          setHasError({country:false, state:false, district:false, city:false});
        }
        else{
          setCompetitorBranchInput((prev) => {
                return { ...prev, city: null };
              });
        }
    },[cityList]);


  useEffect(() => {
    if (
      hasError.country === false &&
      hasError.state === false &&
      hasError.district === false &&
      hasError.city === false
    ) {
      setFormIsValid(true);
    }
    else{
      setFormIsValid(false);
    }
  }, [hasError]);
  //Set select Input Values
  const selectInputHandler = (value, action) => {
    switch (action.name) {
      case "country":
        setIsChanged({
          country: true,
          state: true,
          district: true,
          city: true,
        });
        break;
      case "state":
        setIsChanged({
          country: false,
          state: true,
          district: true,
          city: true,
        });
        break;
      case "district":
        setIsChanged({
          country: false,
          state: false,
          district: true,
          city: true,
        });
        break;
      case "city":
        setIsChanged({
          country: false,
          state: false,
          district: false,
          city: true,
        });
        break;
    }
    setCompetitorBranchInput({
      ...competitorBranchInput,
      [action.name]: value,
    });
    if (value === "" || value === null) {
      setHasError({ ...hasError, [action.name]: true });
    } else {
      setHasError({ ...hasError, [action.name]: false });
    }
  };
  
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    let tokenId = localStorage.getItem("token");
    const data = {
      compId: compid,
      compNo: competitorBranchInput.compNo,
      country: competitorBranchInput.country.value,
      state: competitorBranchInput.state.value,
      district: competitorBranchInput.district.value,
      city: competitorBranchInput.city.value,
      tokenId: tokenId,
    };
    if (
      data.compId !== null &&
      data.compNo !== null &&
      data.country !== null &&
      data.state !== null &&
      data.district !== null &&
      data.city !== null
    )
      console.log("data :", data);

    await axios.post(`${baseUrl}/api/competitorbranch`, data).then((resp) => {
      if (resp.data.status === 200) {
        console.log("resp.data :", resp.data);
        Swal.fire({
          icon: "success",
          title: "Competitor Branch",
          text: resp.data.message,
          timer: 2000,
        }).then(function () {
          setLoading(false);
          setCompetitorBranchInput(initialValue)
          getBranchList();
          // setBranchList(updatedBranchList);
          // navigate(`/tender/master/competitorcreation/competitor/details`);
        });
      } else if (resp.data.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Competitor Branch",
          text: resp.data.message,
          confirmButtonColor: "#5156ed",
        }).then(function () {
          setLoading(false);
        });
      }
    });
  };
  const deleteBranch = async (id) => {
    let response = axios.delete(`${baseUrl}/api/competitorbranch/${id}`);
    return response;
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    let tokenId = localStorage.getItem("token");
    const data = {
      compId: compid,
      brnachId: competitorBranchInput.branchId,
      compNo: competitorBranchInput.compNo,
      country: competitorBranchInput.country.value,
      state: competitorBranchInput.state.value,
      district: competitorBranchInput.district.value,
      city: competitorBranchInput.city.value,
      tokenId: tokenId,
    };
    if (
      data.compId !== null &&
      data.compNo !== null &&
      data.country !== null &&
      data.state !== null &&
      data.district !== null &&
      data.city !== null && formIsValid
    )
      console.log("data Update:", data);
    await axios.put(`${baseUrl}/api/competitorbranch/${competitorBranchInput.branchId}`, data).then((resp) => {
      if (resp.data.status === 200) {
        console.log("resp.data :", resp.data);
        Swal.fire({
          icon: "success",
          title: "Competitor Branch",
          text: resp.data.message,
          timer: 2000,
        }).then(function () {
          setLoading(false);
          setCompetitorBranchInput(initialValue);
          getBranchList();
          // navigate(`/tender/master/competitorcreation/competitor/details`);
        });
      } else if (resp.data.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Competitor Branch",
          text: resp.data.errors,
          confirmButtonColor: "#5156ed",
        }).then(function () {
          setLoading(false);
        });
      }
    });
  };

  return (
    
      <div className="card-body ">
        <form>
          <div className="row align-items-center">
            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark">
                  <label htmlFor="country" className="font-weight-bold">
                    Country<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <Select
                    name="country"
                    id="country"
                    isSearchable="true"
                    isClearable="true"
                    options={countryList}
                    value={competitorBranchInput.country}
                    onChange={selectInputHandler}
                    //   onBlur={onBlurSelectHandler}
                  ></Select>
                  {hasError.country && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Select Competitor Country..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>

            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold">
                  <label htmlFor="state">
                    State/UT<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <Select
                    name="state"
                    id="state"
                    isSearchable="true"
                    isClearable="true"
                    options={stateList}
                    onChange={selectInputHandler}
                    // onBlur="{customersubcategoryBlurHandler}"
                    value={competitorBranchInput.state}
                  ></Select>
                  {hasError.state && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Select Competitor State..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>

            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark">
                  <label htmlFor="district" className="font-weight-bold">
                    District<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <Select
                    name="district"
                    id="district"
                    isSearchable="true"
                    isClearable="true"
                    options={districtList}
                    onChange={selectInputHandler}
                    //onBlur={district}
                    value={competitorBranchInput.district}
                  ></Select>
                  {hasError.district && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Select Competitor District..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-1 mb-4"></div>

            <div className="inputgroup col-lg-5 mb-4">
              <div className="row align-items-center">
                <div className="col-lg-4 text-dark font-weight-bold">
                  <label htmlFor="city">
                    City<span className="text-danger">&nbsp;*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <Select
                    name="city"
                    id="city"
                    isSearchable="true"
                    isClearable="true"
                    options={cityList}
                    onChange={selectInputHandler}
                    //onBlur="{city}"
                    value={competitorBranchInput.city}
                  ></Select>
                  {hasError.city && (
                    <div className="pt-1">
                      <span className="text-danger font-weight-bold">
                        Select Competitor City..!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="inputgroup col-lg-5 mb-4"></div>
            <div className="inputgroup col-lg-2 mb-4 align-items-center">
              <div className="row">
                <button
                  className="btn btn-primary"
                  disabled={!formIsValid}
                  onClick={!editableRow.branchId ? submitHandler : updateHandler}
                >
                  {!editableRow.branchId
                    ? loading === true
                      ? "Adding...."
                      : "Add"
                    : loading === true
                    ? "Updating...."
                    : "Update"}
                </button>
              </div>
            </div>
            <div className="inputgroup col-lg-5 mb-4"></div>
          </div>
        </form>
        <div>
          {isMounted && (
            <Loader size="lg" backdrop content="Fetching Data..." />
          )}
        </div>
        <div className="table-responsive">
          <table
            className="table table-bordered text-center"
            id="dataTable"
            width="100%"
            cellSpacing={0}
          >
            <thead className="text-center bg-primary text-white">
              <tr>
                <th className="">#</th>
                <th className="">COUNTRY</th>
                <th className="">STATE</th>
                <th className="">DISTRICT</th>
                <th className="">CITY</th>
                <th className="">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white text-dark">
              {branchList.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td> {index + 1}</td>
                    <td> {item.country} 15</td>
                    <td> {item.state} 10</td>
                    <td> {item.district} </td>
                    <td> {item.city} </td>
                    <td>
                      <Link to={`competitorbranch/${item.id}`}>
                        <i className="fas fa-edit text-primary"></i>
                      </Link>
                      <Link onClick={() => deleteBranch(item.id, item.city)}>
                        <i className="fas fa-trash text-danger mx-3"></i>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

  );
};

export default CompetitorBranch;
