import axios from "axios";



export const  getCountryData =  async (baseUrl,savedcountry) => {
    let data = {
        tokenid : localStorage.getItem('token')
      }
  let response = await axios.post(`${baseUrl}/api/country/list/${savedcountry}`,data)  
  return { options: response.data.countryList, isLoading: false }
};

export const  getSatateData =  async (baseUrl,countryid, category, savedstate) => {
    let data = {
        tokenid : localStorage.getItem('token')
      }
    let response = await  axios.post(`${baseUrl}/api/state/list/${countryid}/${category}/${savedstate}`,data)
    return { options: response.data.stateList, isLoading: false }
};

export const  getDistrictData =  async (baseUrl,countryid, stateid, savedDistrict) => {
    let data = {
        tokenid : localStorage.getItem('token')
      }
    let response = await  axios.post(`${baseUrl}/api/district/list/${countryid}/${stateid}/${savedDistrict}`,data)
    return { options: response.data.districtList, isLoading: false }
};

export const  getCityData =  async (baseUrl,countryid, stateid, districtid, savedCity) => {
    let data = {
      tokenid : localStorage.getItem('token')
    }
    let response = await  axios.post(`${baseUrl}/api/city/list/${countryid}/${stateid}/${districtid}/${savedCity}`,data)
    return { options: response.data.cityList, isLoading: false }
};

export const getCustSubCatList = async (baseUrl, mainid) => {

    let data = {
        tokenid : localStorage.getItem('token')
      }
    let response = await axios.post(`${baseUrl}/api/customersubcategory/list/${mainid}`,data)  
    return { options: response.data.CustomerSubCategoryList, isLoading: false }
}



// export const GetCountryData1 = () => {
  
//     axios.get(`${baseUrl}/api/country/list`).then((resp) => {
//      console.log(resp.data)
//       // setCountryList({ options: resp.data.countryList, isLoading: false });
//     });
//   };