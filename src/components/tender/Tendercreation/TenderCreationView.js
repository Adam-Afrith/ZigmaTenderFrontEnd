import { Fragment } from "react"
import { Link } from "react-router-dom"
import { usePageTitle } from "../../hooks/usePageTitle"
import TenderCreationList from "./TenderCreationList"

const TenderCreationView = () => {
    usePageTitle("Tender Creation List")
    return (
    <Fragment>
      {/* Page Heading */}
      <div className="container-fluid p-0">
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12">
                <div className="float-right">
                  <Link
                    to="Tendercreation"
                    className="btn btn-primary btn-icon-split "
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
                
              </div>
            </div>
          </div>
        </div>
      </div>
      <TenderCreationList/>
    </Fragment>

    )
}

export default TenderCreationView