import axios from "axios";



export const  getCountryData =  async (baseUrl,savedcountry) => {
  let response = await axios.get(`${baseUrl}/api/country/list/${savedcountry}`)  
  return { options: response.data.countryList, isLoading: false }
};

export const  getSatateData =  async (baseUrl,countryid, category, savedstate) => {
    let response = await  axios.get(`${baseUrl}/api/state/list/${countryid}/${category}/${savedstate}`)
    return { options: response.data.stateList, isLoading: false }
};

export const  getDistrictData =  async (baseUrl,countryid, stateid, savedDistrict) => {
    let response = await  axios.get(`${baseUrl}/api/district/list/${countryid}/${stateid}/${savedDistrict}`)
    return { options: response.data.districtList, isLoading: false }
};

export const  getCityData =  async (baseUrl,countryid, stateid, districtid, savedCity) => {
    let response = await  axios.get(`${baseUrl}/api/city/list/${countryid}/${stateid}/${districtid}/${savedCity}`)
    return { options: response.data.cityList, isLoading: false }
};

export const getCustSubCatList = async (baseUrl, mainid) => {
    let response = await axios.get(`${baseUrl}/api/customersubcategory/list/${mainid}`)  
    return { options: response.data.CustomerSubCategoryList, isLoading: false }
}



// export const GetCountryData1 = () => {
  
//     axios.get(`${baseUrl}/api/country/list`).then((resp) => {
//      console.log(resp.data)
//       // setCountryList({ options: resp.data.countryList, isLoading: false });
//     });
//   };