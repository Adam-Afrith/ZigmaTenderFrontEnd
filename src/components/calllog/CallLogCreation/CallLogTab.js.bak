import { usePageTitle } from "../../hooks/usePageTitle";
import { Fragment, useState, useEffect } from "react";
import { useParams, Outlet, NavLink, useLocation, Link } from "react-router-dom";

const CallLogTab = () => {
  usePageTitle("Call Creation");
  const { id, mode } = useParams();
  const [callId, setCallId] = useState(0);
  const [navMode, setNavMode] = useState("edit");
  //assigning location variable
  const location = useLocation();

  //destructuring pathname from location
  const { pathname } = location;

  //Javascript split method to get the name of the path in array
  const activeTab = pathname.split("/");

  useEffect(() => {
    {
      id && setCallId(id);
    }
  }, []);

  return (
    <Fragment>
      <div className="d-flex justify-content-end back">
        <Link to='/tender/calllog'><button><i className="fas fa-chevron-circle-left" /><span>Back</span></button></Link>
      </div>
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-lg-12">
            <div className="card mb-4">
              <div className="card-body">
                <div>
                  <ul
                    className="nav nav-tabs nav-justified"
                    id="myTab"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        id="callDetails-tab"
                        data-toggle="tab"
                        to={
                          !callId
                            ? "callDetails"
                            : `callDetails/${callId}/${navMode}`
                        }
                        role="tab"
                        aria-controls="callDetails"
                        aria-selected="true"
                      >
                        <i className="far fa-user mr-3"></i>
                        Call Details
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        id="callHistory-tab"
                        data-toggle="tab"
                        // to={!callId ? "callHistory" : `callHistory/${callId}/${mode}`}
                        to={
                          !callId
                            ? "callHistory"
                            : `callHistory/${callId}/${navMode}`
                        }
                        role="tab"
                        aria-controls="callHistory"
                        aria-selected="false"
                      >
                        <i className="far fa-id-card mr-3"></i>
                        Call History
                      </NavLink>
                    </li>
                  </ul>

                  <div className="tab-content" id="myTabContent">
                    <div
                      className={
                        activeTab[4] === "callDetails" || "callHistory"
                          ? `tab-pane fade show active bg-light`
                          : `tab-pane fade show active bg-white`
                      }
                      id="home"
                      role="tabpanel"
                      aria-labelledby="home-tab"
                    >
                      <Outlet
                        context={[navMode, setNavMode, callId, setCallId]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CallLogTab;
