import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import axios from "axios";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import CustomerCreationList from "./CustomerCreationList";
import { motion } from "framer-motion";
//import { can } from "../../UserPermission";
import { useContext } from "react";
import AuthContext from "../../../storeAuth/auth-context";

const CustomerCreation = () => {
  usePageTitle("Customer Master");
  const { server1: baseUrl } = useBaseUrl();
  const navigate = useNavigate();
  const location = useLocation();
  const authData = useContext(AuthContext);
  const {permission} = useContext(AuthContext)

  const createCustomer = async () => {
    let data = {
      tokenid: localStorage.getItem("token"),
    };

    let response = await axios.post(
      `${baseUrl}/api/customercreationmain`,
      data
    );

    if(response.status === 200){
      navigate(`${location.pathname}/main/profile`)
    }else{
      alert("Unable to process, please try again later");
    }
 
  }

  const data = {
    byclicking: 'new'
   }

  return (
    <>
      {/* Page Heading */}
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-lg-12">
            <motion.div className="card shadow mb-4 t-card"
              initial={{scale: 0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'tween'}}>
              <div className="card-body">
                <div className="float-right ">
                 {!!(permission?.Customers?.can_add) ? <Link to ="main/profile" state={{ data: data }}  className=" btn btn-primary btn-icon-split">
                    <span className="icon text-white-50">
                      <i className="fas fa-plus-circle" />
                    </span>
                    <span className="text">New</span>
                  </Link> : ''}
                </div>                
                <div>
                  <CustomerCreationList />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerCreation;
