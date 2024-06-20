import axios from "axios";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import Swal from "sweetalert2";
import { Fragment, useEffect } from "react";

const BiddersList = (props) =>{
    const { server1: baseUrl } = useBaseUrl();
    
    // const CreateBitters=()=>{
        
        const list = [];
        
        
                

 return(
    <Fragment>                 
        {/*//    for(var i=0; i<props.bidders; i++){       
        //     list.push(`
        //     <div className="inputgroup col-lg-6 mb-4 ">
        //     <div className="row align-items-center">
        //       <div className="col-lg-4 text-dark font-weight-bold pt-1">
        //         <label htmlFor="bidders"> No of Bidders
        //         <p className="text-info">Max Value : 20</p>
                   
        //         </label>
        //       </div>
        //       <div className="col-lg-6">
        //       <input
        //           type="text"
        //           className="form-control"
        //           id="bidders"
        //           placeholder="Enter Competitor Strength"
        //           name="bidders"
        //           value={bidders}
        //           onChange={textInputHandler}                  
        //         />
                
        //          {hasError && (
        //           <div className="pt-1">
        //             <span className="text-danger font-weight-bold">
        //               Enter Valid Input..!
        //             </span>
        //           </div>
        //         )}
        //       </div>
        //     </div>
        //   </div>


        //   <div className="inputgroup col-lg-6 mb-4 ">
        //     <div className="row align-items-center">
        //       <div className="col-lg-4 text-dark font-weight-bold pt-1">
        //         <label htmlFor="">
                 
        //         </label>
        //       </div>
        //       <div className="col-lg-6">
              
              
        //       </div>
        //     </div>
        //   </div>`
 //     ) */}
        </Fragment>
)
}

export default BiddersList;