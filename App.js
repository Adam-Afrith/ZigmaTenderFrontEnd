import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/Login";
import Masterlayout from "./components/Masterlayout";
import Dashboard from "./components/Dashboard";
import Tendertracker from "./components/tender/Tendertracker/Tendertracker";
import Tendercreation from "./components/tender/Tendercreation/Tendercreation";
import Legacystatement from "./components/tender/Legacystatement/Legacystatement";
import Bidmanagement from "./components/tender/Bidmanagement/Bidmanagement";
import UserCreation from "./components/tender/test/test";
import { AuthContextProvider } from "./storeAuth/auth-context";
import AuthContext from "./storeAuth/auth-context";
// import Master from "./components/master/Master";
import StateMaster from "./components/master/StateMaster/StateMaster";
import ULBMaster from "./components/master/ULBMaster/ULBMaster";
import ULBMasterView from "./components/master/ULBMaster/ULBMasterView";
import CustomerCreation from "./components/master/CustomerCreation/CustomerCreation";
import CompetitorCreation from "./components/master/CompetitorMaster/CompetitorCreation";
import Competitor from "./components/master/CompetitorMaster/Competitor";
import CompetitorProfile from "./components/master/CompetitorMaster/CompetitorProfile";
import CompetitorDetails from "./components/master/CompetitorMaster/CompetitorDetails";
import CompetitorBranch from "./components/master/CompetitorMaster/Competitor_Details/CompetitorBranch";
import CustomerCreationProfile from "./components/master/CustomerCreation/CustomerCreationProfile/CustomerCreationProfile";
import CustomerCreationMain from "./components/master/CustomerCreation/CustomerCreationMain";
import CustomerCreationContactPerson from "./components/master/CustomerCreation/CustomerCreationContactPerson/CustomerCreationContactperson";
import CustomerCreationSWMProjectStatus from "./components/master/CustomerCreation/SWMProjectStatus/CustomerCreationSWMProjectStatus";
import StateMasterView from "./components/master/StateMaster/StateMasterView";
import CountryMasterView from "./components/master/CountryMaster/CountryMasterView";
import CountryMaster from "./components/master/CountryMaster/CountryMaster";
import UnitMaster from "./components/master/UnitMaster/UnitMaster";
import UnitMasterView from "./components/master/UnitMaster/UnitMasterView";
import DistrictMaster from "./components/master/DistrictMaster/DistrictMaster";
import DistrictMasterView from "./components/master/DistrictMaster/DistrictMasterView";
import CityMasterView from "./components/master/CityCreation/CityMasterView";
import CityCreation from "./components/master/CityCreation/CityCreation";
import CustomerCreationUlbDetails from "./components/master/CustomerCreation/ULBDetails/CustomerCreationUlbDetails";
import ProjectTypeView from "./components/master/ProjectType/ProjectTypeView";
import ProjectstatusView from "./components/master/Projectstatus/ProjectstatusView";
import ProejctTypeMaster from "./components/master/ProjectType/ProjectTypeMaster";
import CustSubCategView from "./components/master/CustomerSubCategory/CustSubCategView";
import CustSubCategMaster from "./components/master/CustomerSubCategory/CustSubCategMaster";
import ProjectstatusMaster from "./components/master/Projectstatus/ProjectstatusMaster";
import CustomerCreationBankDetails from "./components/master/CustomerCreation/Bankdetails/CustomerCreationBankdetails";
import BidmanagementMain from "./components/tender/Bidmanagement/BidmanagementMain";
import BidCreationMain from "./components/tender/Bidmanagement/Bidcreation/BidCreationMain";
import BidSubmission from "./components/tender/Bidmanagement/Bidsubmission/BidSubmission";
import TenderStatus from "./components/tender/Bidmanagement/TenderStatus/TenderStatus";
import Workorder from "./components/tender/Bidmanagement/Workorder/Workorder";
import CommunicationFilesView from "./src/components/master/CommunicationFiles/CommunicationFilesView";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* {authCtx.isLoggedIn && ( */}
          <Route path="/tender" element={<Masterlayout />}>
            <Route index element={<Dashboard />} />
            <Route path="tendertracker" element={<Tendertracker />} />
            <Route path="tendercreation" element={<Tendercreation />} />
            <Route path="legacystatement" element={<Legacystatement />} />
            {/* <Route path="bidmanagement" element={<Bidmanagement />} /> */}
            <Route path="bidmanagement">
              <Route path="list" element={<Bidmanagement />}/>
              <Route path="list/main" element={<BidmanagementMain />}>
                <Route path="bidcreationmain" element={<BidCreationMain/>}/>
                <Route path="bidcreationmain/:id" element={<BidCreationMain/>}/>
                <Route path="bidsubmission" element={<BidSubmission/>}/>
                <Route path="tenderstatus" element={<TenderStatus/>}/>
                <Route path="workorder" element={<Workorder/>}/>
              </Route>
            </Route>
            <Route path="master">
              <Route
                path="customercreation/list"
                element={<CustomerCreation />}
              />
              <Route
                path="customercreation/list/main"
                element={<CustomerCreationMain />}
              >
                <Route path="profile" element={<CustomerCreationProfile />} />
                <Route path="profile/:id" element={<CustomerCreationProfile />} />
                <Route
                  path="contactperson"
                  element={<CustomerCreationContactPerson />}
                />
                 <Route
                  path="contactperson/:id"
                  element={<CustomerCreationContactPerson />}
                />
                <Route
                  path="ulbdetails"
                  element={<CustomerCreationUlbDetails />}
                />
                <Route
                  path="ulbdetails/:id"
                  element={<CustomerCreationUlbDetails />}
                />
                <Route
                  path="bankdetails"
                  element={<CustomerCreationBankDetails />}
                />
                <Route
                  path="bankdetails/:id"
                  element={<CustomerCreationBankDetails  />}
                />
                <Route
                  path="swmprojectstatus"
                  element={<CustomerCreationSWMProjectStatus />}
                />
                <Route
                  path="swmprojectstatus/:id"
                  element={<CustomerCreationSWMProjectStatus />}
                />
              </Route>
              <Route
                path="customercreation/tabs"
                element={<CustomerCreationProfile />}
              />
              <Route
                path="competitorcreation" element={<CompetitorCreation />}
               />
                
                <Route path="competitorcreation/competitor" element={<Competitor />} >
                  <Route path="profile" element={<CompetitorProfile />}/>
                  <Route path="details" element={<CompetitorDetails />}>
                    <Route path="branches" element={<CompetitorBranch />}/>
                  </Route>
                
                {/*route for to edit with id*/} 
                  <Route path="profile/:id" element={<CompetitorProfile />}/>
                  <Route path="details/:id" element={<CompetitorDetails />}>
                    <Route path="branches" element={<CompetitorBranch />}/>
                  </Route> 
                </Route>
             
              <Route path="statemaster" >
                <Route index element={<StateMasterView />} />
                <Route path="statecreation" element={<StateMaster />}/>
                <Route path="statecreation/:id" element={<StateMaster />}/>
              </Route>
              <Route path="countrymaster" >
                <Route index element={<CountryMasterView />} />
                <Route path="countrycreation" element={<CountryMaster />}/>
                <Route path="countrycreation/:id" element={<CountryMaster />}/>
              </Route>
              <Route path="ulbmaster" >
                <Route index element={<ULBMasterView />} />
                <Route path="ulbcreation" element={<ULBMaster />}/>
                <Route path="ulbcreation/:id" element={<ULBMaster />}/>
              </Route>
              <Route path="unitmaster" >
                <Route index element={<UnitMasterView />} />
                <Route path="unitcreation" element={<UnitMaster />}/>
                <Route path="unitcreation/:id" element={<UnitMaster />}/>
              </Route>
              <Route path="districtmaster" >
                <Route index element={<DistrictMasterView />} />
                <Route path="districtcreation" element={<DistrictMaster />}/>
                <Route path="districtcreation/:id" element={<DistrictMaster />}/>
              </Route>
              <Route path="citymaster">
                <Route index element={<CityMasterView/>}/>
                <Route path="citycreation" element={<CityCreation />}/>
                <Route path="citycreation/:id" element={<CityCreation />}/>
              </Route>
              <Route path="projecttype" >
                <Route index element={<ProjectTypeView />} />
                <Route path="projecttypecreation" element={<ProejctTypeMaster />}/>
                <Route path="projecttypecreation/:id" element={<ProejctTypeMaster />}/>
              </Route>
              <Route path="projectstatus" >
                <Route index element={<ProjectstatusView />} />
                <Route path="projectstatuscreation" element={<ProjectstatusMaster />}/>
                <Route path="projectstatuscreation/:id" element={<ProjectstatusMaster />}/>
              </Route>
              <Route path="customersubcategory" >
                <Route index element={<CustSubCategView />} />
                <Route path="customersubcategorycreation" element={<CustSubCategMaster />}/>
                <Route path="customersubcategorycreation/:id" element={<CustSubCategMaster />}/>
              </Route>
             
            </Route>
          </Route>

          {/* )} */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
