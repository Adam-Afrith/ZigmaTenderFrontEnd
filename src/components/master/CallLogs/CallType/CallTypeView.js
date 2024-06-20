import { motion } from "framer-motion"
import { Fragment, useContext } from "react"
import { Link } from "react-router-dom"
import AuthContext from "../../../../storeAuth/auth-context"
import { usePageTitle } from "../../../hooks/usePageTitle"
import { can } from "../../../UserPermission"
import CallTypeList from "./CallTypeList"

const CallTypeView = () => {
    usePageTitle("Call Type Master")
    const {permission} = useContext(AuthContext)
    return (
    <Fragment>
      {/* Page Heading */}
      <div className="">
        <motion.div className="card shadow mb-4"
           initial={{scale: 0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'tween'}}>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12">
                <div className="float-right">
                <Link  //Have to modify userType-create to CallType-create
                    to="calltypecreation"
                    className="btn btn-primary btn-icon-split"
                  >
                    <span className="icon text-white-50">
                      <i className="fas fa-plus-circle" />
                    </span>
                    <span className="text res-720-btn-none">New</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-12">
                <CallTypeList/>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Fragment>
    )
}

export default CallTypeView