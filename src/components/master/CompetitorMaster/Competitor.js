import { usePageTitle } from "../../hooks/usePageTitle";
import { Fragment, useState,useEffect } from "react";
import {useParams,  Outlet, NavLink, useLocation} from "react-router-dom";
import "./CompetitorMaster.css";

const CompetitorTab = () => {
  usePageTitle("Competitor Creation");
  const { id } = useParams();
const [competitorId,setCompetitorId]=useState(0);

 //assigning location variable
 const location = useLocation();

 //destructuring pathname from location
 const { pathname } = location;

 //Javascript split method to get the name of the path in array
 const activeTab = pathname.split("/");
 
useEffect(() => {
  {id && setCompetitorId(id)}
}, []);

  return (     
    <Fragment>
      <div className="CompetitorTab">
        <div className="row">
          <div className="col-lg-12">
            <div className="card shadow mb-3">
              <div className="card-body" style={{padding: "10px 0 0 0"}}>
                <div>
                  <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        id="profile-tab"
                        data-toggle="tab"
                        to={!competitorId ? "profile" : `profile/${competitorId}`}
                        role="tab"
                        aria-controls="profile"
                        aria-selected="true"
                      >
                        <i className='far fa-user '></i>
                        <span>Competitor Profile</span>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link" 
                        id="details-tab"
                        data-toggle="tab"
                        to={!competitorId ? "details": `details/${competitorId}`}
                        role="tab"
                        aria-controls="details"
                        aria-selected="false"
                      >
                        <i className='far fa-id-card '></i>
                        <span>Competitor Details</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="tab-content" id="myTabContent">
                  <div
                    className={activeTab[5] === 'profile' ? `tab-pane fade show active ` : `tab-pane fade show active bg-white`}
                    id="home"
                    role="tabpanel"
                    aria-labelledby="home-tab"
                  >
                    <Outlet context={[competitorId, setCompetitorId]} />
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

export default CompetitorTab;
