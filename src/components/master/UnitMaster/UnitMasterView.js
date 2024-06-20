import { motion } from "framer-motion";
import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../../storeAuth/auth-context";
import { usePageTitle } from "../../hooks/usePageTitle";
//import { can } from "../../UserPermission";
import UnitMasterList from "./UnitMasterList";


const UnitMasterView = () => {
  usePageTitle("Unit Master");
  const {permission} = useContext(AuthContext)
  return (
    <>
      {/* Page Heading */}
      <div className="container-fluid p-0">
        <motion.div className="card shadow mb-4"
           initial={{scale: 0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'tween'}}>
          <div className="card-body">
            <div className="row">                            
                <div className="col-lg-12 text-right">
                  {!!(permission?.Units?.can_add) && <Link
                    to="unitcreation"
                    className="btn btn-primary btn-icon-split"
                  >
                    <span className="icon text-white-50">
                      <i className="fas fa-plus-circle" />
                    </span>
                    <span className="text res-720-btn-none">New</span>
                  </Link>}
                </div>                              
            </div>
            <div className="row mt-3">
              <div className="col-lg-12">
                <UnitMasterList/>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default UnitMasterView;
