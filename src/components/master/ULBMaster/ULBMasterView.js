import { Link } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import ULBMasterList from "./ULBMasterList";
const ULBMasterView = () => {
  usePageTitle("ULB Creation");
  return (
    <>
      {/* Page Heading */}
      <div className="container-fluid p-0">
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12">
                <div className="row">
                <div className="col-6 text-left ml-3"> <h6 className="m-0 font-weight-bold text-primary">ULB MASTER LIST</h6></div>
                <div className="col-5 text-right ml-5">
                  <Link
                    to="ulbcreation"
                    className="btn btn-primary btn-icon-split rounded-pill"
                  >
                    <span className="icon text-white-50">
                      <i className="fas fa-plus-circle" />
                    </span>
                    <span className="text">New</span>
                  </Link>
                </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-12">
                <ULBMasterList/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ULBMasterView;
