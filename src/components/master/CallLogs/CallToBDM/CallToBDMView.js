import { motion } from "framer-motion"
import { Fragment, useContext } from "react"
import { Link } from "react-router-dom"
import AuthContext from "../../../../storeAuth/auth-context"
import { usePageTitle } from "../../../hooks/usePageTitle"
import CallToBDMList from "./CalltoBDMList"




const CallToBDMView = () => {
    usePageTitle('Assign Calls to BDM');
    const { permission } = useContext(AuthContext);
    return (
        <Fragment>
            <div className="container-fluid p-0">
                <motion.div className="card shadow mb-4"
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'tween' }}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="float-right">
                                    {!!(permission?.call_to_bdm?.can_add) && <Link
                                        to="create"
                                        className="btn btn-primary btn-icon-split rounded-pill"
                                    >
                                        <span className="icon text-white-50">
                                            <i className="fas fa-plus-circle" />
                                        </span>
                                        <span className="text">New</span>
                                    </Link>}
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-lg-12">
                               <CallToBDMList/>         
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Fragment>
    )
}

export default CallToBDMView