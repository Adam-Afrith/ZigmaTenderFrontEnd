import axios from "axios";
import { useBaseUrl } from "./useBaseUrl";


//dispatch this hook like below line
// const {stateList}=useGetStateList({country:105});


const useGetStateList = async (props) => {
  const { server1: baseUrl } = useBaseUrl();  
//   let list = getList(props);
  
//   function getList(c){
//     axios
//     .get(`${baseUrl}/api/state/list/${c.country}`)
//     .then((resp) => {
//       // console.log(resp);
//       return  resp;
//     });
//   }
// console.log("list",list );
//   return {
//     states: list.data.stateList
//   }
let data = {
  tokenid : localStorage.getItem('token')
}

let list=[];
    await axios
        .post(`${baseUrl}/api/state/list/${props.country}`,data)
        .then((resp) => {
          // console.log("resp.data.stateList",resp.data.stateList);
          list = resp.data.stateList;      
         console.log("1");
        });
        
        console.log("2");
        
        return  list;
}

export {useGetStateList};
  