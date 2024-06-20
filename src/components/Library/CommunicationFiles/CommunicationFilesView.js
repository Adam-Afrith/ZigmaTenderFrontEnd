import { Fragment, useContext } from "react"
import { Link } from "react-router-dom"
import AuthContext from "../../../storeAuth/auth-context"
import { usePageTitle } from "../../hooks/usePageTitle"
import { can } from "../../UserPermission"
import CommunicationFilesList from "./CommunicationFilesList"

const CommunicationFilesView = () => {
    usePageTitle("Communication Files List")
    const {permission} = useContext(AuthContext)
    return (
    <Fragment>
      {/* Page Heading */}
      <div className="">
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12">
                <div className="float-right">
                  {!!(permission?.['Communication Files']?.can_add) && <Link
                    to="communicationfilescreation"
                    className="btn btn-primary btn-icon-split "
                  >
                    <span className="icon text-white-50">
                      <i className="fas fa-plus-circle" />
                    </span>
                    <span className="text res-720-btn-none">New</span>
                  </Link>}
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-12">
                {/* <CityMasterList/> */}

                <CommunicationFilesList/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
    )
}

export default CommunicationFilesView