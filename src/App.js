import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/Login";
import Masterlayout from "./components/Masterlayout";
import Dashboard from "./components/Dashboard";
import Tendertracker from "./components/tender/Tendertracker/Tendertracker";
import Tendercreation from "./components/tender/Tendercreation/Tendercreation";
import Legacystatement from "./components/tender/Legacystatement/Legacystatement";
import Bidmanagement from "./components/tender/Bidmanagement/Bidmanagement";
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
//import CompetitorBranch from "./components/master/CompetitorMaster/Competitor_Details/CompetitorBranch";
import CompetitorBranchForm from "./components/master/CompetitorMaster/Competitor_Details/CompetitorBranch/CompetitorBranchForm";
import CustomerCreationProfile from "./components/master/CustomerCreation/CustomerCreationProfile/CustomerCreationProfile";
import CustomerCreationMain from "./components/master/CustomerCreation/CustomerCreationMain";
import CustomerCreationContactPerson from "./components/master/CustomerCreation/CustomerCreationContactPerson/CustomerCreationContactperson";
// import CustomerCreationBankDetails from "./components/master/CustomerCreation/CustomerCreationBankdetails";
import CustomerCreationSWMProjectStatus from "./components/master/CustomerCreation/SWMProjectStatus/CustomerCreationSWMProjectStatus";
import StateMasterView from "./components/master/StateMaster/StateMasterView";
import CountryMasterView from "./components/master/CountryMaster/CountryMasterView";
import CountryMaster from "./components/master/CountryMaster/CountryMaster";
import UnitMaster from "./components/master/UnitMaster/UnitMaster";
import UnitMasterView from "./components/master/UnitMaster/UnitMasterView";
import TenderTypeMaster from "./components/master/TenderTypeMaster/TenderTypeMaster";
import TenderTypeMasterView from "./components/master/TenderTypeMaster/TenderTypeMasterView";
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
// ulb report by navin @ 29-03-2023
import UlbReport from "./components/tender/UlbReport/UlbReport"
// 
import CommunicationFilesView from "./components/Library/CommunicationFiles/CommunicationFilesView";
import CommunicationFilesCreation from "./components/Library/CommunicationFiles/CommunicationFilesCreation";
import Unauthorized from "./components/pages/Unauthorized";
import UserCreationView from "./components/master/UserCreation/UserCreationView";
import UserTypeView from "./components/master/UserType/UserTypeView";
import UserType from "./components/master/UserType/UserType";
import UserCreation from "./components/master/UserCreation/UserCreation";
import CallTypeView from "./components/master/CallLogs/CallType/CallTypeView";
import CallType from "./components/master/CallLogs/CallType/CallType";
import ZoneView from "./components/master/ZoneMaster/ZoneView";
import ZoneMaster from "./components/master/ZoneMaster/ZoneMaster";
import BusinessForecastView from "./components/master/CallLogs/BusinessForecast/BusinessForecastView";
import BusinessForecast from "./components/master/CallLogs/BusinessForecast/BusinessForecast";
import UserPermission from "./components/master/UserPermission/UserPermission";
import UserPermissionView from "./components/master/UserPermission/UserPermissionView";
import BDMUsersList from "./components/master/CallLogs/CallToBDM/BDMUsersList";
import CallToBDMView from "./components/master/CallLogs/CallToBDM/CallToBDMView";
import CallToBDM from "./components/master/CallLogs/CallToBDM/CallToBDM";
import ExpenseTypeView from "./components/master/ExpenseType/ExpenseTypeView";
import ExpenseType from "./components/master/ExpenseType/ExpenseType";
import AttendanceView from "./components/hr/AttendanceEntry/Attendance/AttendanceView";
import AttendanceEntry from "./components/hr/AttendanceEntry/Attendance/AttendanceEntry";
import AttendanceReport from "./components/hr/AttendanceReport/AttendanceReport";
import AttendanceType from "./components/master/AttendanceType/AttendanceType";
import AttendanceTypeView from "./components/master/AttendanceType/AttendanceTypeView";
// import CallLogCreation from './components/calllog/CallLogCreation/CallLogCreation_newlyAdded';
import CallLogCreation from './components/calllog/CallLogCreation/CallLogCreation';
import CallLogMain from './components/calllog/CallLogCreation/CallLogMain';
import CallLogHistory from "./components/calllog/CallLogCreation/CallLogHistory";
import CallLogTab from "./components/calllog/CallLogCreation/CallLogTab";
import CallReport from "./components/calllog/CallReport/CallReport";
import OtherExpenseMain from "./components/expenses/OtherExpenses/OtherExpenseMain";
import ExpenseCreation from "./components/expenses/OtherExpenses/CreateExpenseCreation";
import CreateExpenseCreation  from "./components/expenses/OtherExpenses/CreateExpenseCreation";

import ReimbursementAdmin from "./components/expenses/Reimbursement/ReimbursementAdmin";
import ReimbursementCreate from "./components/expenses/Reimbursement/ReimbursementCreate";
import RembursementPrintView from "./components/expenses/Reimbursement/RembursementPrintView"
import HolidayCreation from "./components/hr/Holiday/HolidayCreation";
import Holiday from "./components/hr/Holiday/Holiday";
/***Navin added  */
import BusinessForecastStatusCreate from "./components/master/BusinessForecastStatus/BusinessForecastStatusCreate"
import ForecastStatus from "./components/master/BusinessForecastStatus/ForecastStatus"
/****navin added */
// **********************

function App() {
  const authData = useContext(AuthContext);
  const {permission} = useContext(AuthContext)
 
  return (
   
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* {authCtx.isLoggedIn && ( */}
          <Route path="/tender" element={<Masterlayout />}>
            <Route index element={<Dashboard />} />
            <Route path="tendertracker" element={!!(permission?.["Tender Tracker"]?.can_view) ? <Tendertracker />: <Unauthorized/> } />
            <Route path="tendercreation" element={!!(permission?.Tenders?.can_add) ? <Tendercreation /> : <Unauthorized/> } />
            <Route path="legacystatement" element={!!(permission?.["Legacy Statements"]?.can_view) ? <Legacystatement /> : <Unauthorized/>} />
            <Route path="UlbReport" element={!!(permission?.["ULB Report"]?.can_view) ? <UlbReport />: <Unauthorized/> }/>
          
            <Route path="bidmanagement">
              <Route path="list" element={!!(permission?.['Bids Managements']?.can_view) ? <Bidmanagement /> : <Unauthorized/>} />
              <Route path="list/main" element={(!!(permission?.['Bids Managements']?.can_add) || !!(permission?.['Bids Managements']?.can_edit)) ? <BidmanagementMain /> : <Unauthorized/>}>
                <Route path="bidcreationmain/:tenderid" element={ <BidCreationMain /> } />
                <Route
                  path="bidcreationmain/:tenderid/:id"
                  element={ <BidCreationMain /> }
                />
                <Route path="bidsubmission" element={ <BidSubmission /> } />
                <Route path="bidsubmission/:id" element={ <BidSubmission /> } />
                <Route path="tenderstatus" element={ <TenderStatus /> } />
                <Route path="tenderstatus/:id" element={ <TenderStatus /> } />
                <Route path="workorder" element={ <Workorder /> } />
                <Route path="workorder/:id" element={ <Workorder /> } />
                
                
              </Route>
            </Route>

           


            <Route path="master">
              <Route
                path="customercreation/list"
                element={!!(permission?.Customers?.can_view) ? <CustomerCreation /> : <Unauthorized/>}
              />
              <Route
                path="customercreation/list/main"
                element={<CustomerCreationMain />}
              >
                <Route path="profile" element={!!(permission?.Customers?.can_add) ? <CustomerCreationProfile /> : <Unauthorized/>} />
               <Route
                  path="profile/:id"
                  element={!!(permission?.Customers?.can_edit) ? <CustomerCreationProfile /> : <Unauthorized/>}
                />
                 <Route
                  path="contactperson"
                  element={!!(permission?.Customers?.can_add) ? <CustomerCreationContactPerson /> : <Unauthorized/>}
                />
                <Route
                  path="contactperson/:id"
                  element={!!(permission?.Customers?.can_edit) ? <CustomerCreationContactPerson /> : <Unauthorized/>}
                />
                <Route
                  path="ulbdetails"
                  element={!!(permission?.Customers?.can_add) ? <CustomerCreationUlbDetails /> : <Unauthorized/>}
                />
               <Route
                  path="ulbdetails/:id"
                  element={!!(permission?.Customers?.can_edit) ? <CustomerCreationUlbDetails /> : <Unauthorized/>}
                />
                 <Route
                  path="bankdetails"
                  element={!!(permission?.Customers?.can_add) ? <CustomerCreationBankDetails /> : <Unauthorized/>}
                />
               <Route
                  path="bankdetails/:id"
                  element={!!(permission?.Customers?.can_edit) ? <CustomerCreationBankDetails /> : <Unauthorized/>}
                />
                 <Route
                  path="swmprojectstatus"
                  element={!!(permission?.Customers?.can_add) ? <CustomerCreationSWMProjectStatus /> : <Unauthorized/> }
                />
               <Route
                  path="swmprojectstatus/:id"
                  element={!!(permission?.Customers?.can_edit) ? <CustomerCreationSWMProjectStatus /> : <Unauthorized/>}
                />
              </Route>
              <Route
                path="customercreation/tabs"
                element={<CustomerCreationProfile />}
              />
              <Route
                path="competitorcreation"
                element={!!(permission?.Competitors?.can_view) ? <CompetitorCreation /> : <Unauthorized/>}
              />

              <Route
                path="competitorcreation/competitor"
                element={(!!(permission?.Competitors?.can_add) || !!(permission?.Competitors?.can_edit)) ? <Competitor /> : <Unauthorized/>}
              >
                <Route path="profile" element={ <CompetitorProfile /> } />
                <Route path="profile/:id" element={  <CompetitorProfile /> } />
                <Route path="details" element={<CompetitorDetails />}>
                  <Route path="branches" element={ <CompetitorBranchForm /> } />
                </Route>

                {/*route for to edit with id*/}
                <Route path="details/:compid" element={<CompetitorDetails />}>
                  <Route
                    path="branches/:compid"
                    element={ <CompetitorBranchForm />  }
                  />
                </Route>
              </Route>

              <Route path="statemaster">
                <Route index element={!!(permission?.States?.can_view) ? <StateMasterView /> : <Unauthorized/>} />
                <Route path="statecreation" element={!!(permission?.States?.can_add) ? <StateMaster /> : <Unauthorized/>} />
                <Route path="statecreation/:id" element={!!(permission?.States?.can_edit) ? <StateMaster /> : <Unauthorized/>} />
              </Route>
              <Route path="countrymaster">
                <Route index element={!!(permission?.Countries?.can_view) ? <CountryMasterView /> : <Unauthorized/> } />
                <Route path="countrycreation" element={!!(permission?.Countries?.can_add) ?  <CountryMaster /> : <Unauthorized/> } />
                <Route path="countrycreation/:id" element={!!(permission?.Countries?.can_edit) ? <CountryMaster /> : <Unauthorized/>} />
              </Route>
              <Route path="ulbmaster">
                <Route index element={<ULBMasterView />} />
                <Route path="ulbcreation" element={<ULBMaster />} />
                <Route path="ulbcreation/:id" element={<ULBMaster />} />
              </Route>
              <Route path="unitmaster">
                <Route index element={!!(permission?.Units?.can_view) ? <UnitMasterView /> : <Unauthorized/> } />
                <Route path="unitcreation" element={!!(permission?.Units?.can_add) ? <UnitMaster /> : <Unauthorized/> } />
                <Route path="unitcreation/:id" element={!!(permission?.Units?.can_edit) ? <UnitMaster /> : <Unauthorized/> } />
              </Route>

              <Route path="tendertypemaster">
                <Route index element={!!(permission?.['Tender Types']?.can_view) ? <TenderTypeMasterView /> : <Unauthorized/> } />
                <Route
                  path="tendertypecreation"
                  element={!!(permission?.['Tender Types']?.can_add) ? <TenderTypeMaster /> : <Unauthorized/>}
                />
                <Route
                  path="tendertypecreation/:id"
                  element={!!(permission?.['Tender Types']?.can_edit) ?  <TenderTypeMaster /> : <Unauthorized/> }
                />
              </Route>

              <Route path="districtmaster">
                <Route index element={!!(permission?.Districts?.can_view) ?  <DistrictMasterView /> : <Unauthorized/>} />
                <Route path="districtcreation" element={!!(permission?.Districts?.can_add) ?  <DistrictMaster /> : <Unauthorized/>} />
                <Route
                  path="districtcreation/:id"
                  element={!!(permission?.Districts?.can_edit) ?   <DistrictMaster /> : <Unauthorized/>}
                />
              </Route>
              <Route path="citymaster">
                <Route index element={!!(permission?.Cities?.can_view) ?  <CityMasterView /> : <Unauthorized/>} />
                <Route path="citycreation" element={!!(permission?.Cities?.can_add) ?  <CityCreation /> : <Unauthorized/>} />
                <Route path="citycreation/:id" element={!!(permission?.Cities?.can_edit) ? <CityCreation /> : <Unauthorized/>} />
              </Route>
              <Route path="usertype">
                <Route index element={!!(permission?.["User Type"]?.can_view) ? <UserTypeView /> : <Unauthorized/>} />
                <Route path="create" element={!!(permission?.["User Type"]?.can_add) ? <UserType /> : <Unauthorized/>} />
                <Route path="edit/:id" element={!!(permission?.["User Type"]?.can_edit) ? <UserType /> : <Unauthorized/>} />
              </Route>
              <Route path="userpermissions">
                <Route index element={ !!(permission?.["User Permissions"]?.can_view) ? <UserPermissionView /> : <Unauthorized/>} />
                <Route path="create" element={!!(permission?.["User Permissions"]?.can_add) ? <UserPermission /> : <Unauthorized/>} />
                <Route path="edit/:id" element={!!(permission?.["User Permissions"]?.can_edit) ? <UserPermission /> : <Unauthorized/>} />
              </Route>
              <Route path="usercreation">
                <Route index element={!!(permission?.["User Creation"]?.can_view) ? <UserCreationView/> : <Unauthorized/>} />
                <Route path="create" element={!!(permission?.["User Creation"]?.can_add) ? <UserCreation /> : <Unauthorized/>} />
                <Route path="edit/:id" element={!!(permission?.["User Creation"]?.can_edit) ? <UserCreation /> : <Unauthorized/>} />
              </Route>
              <Route path="projecttype">
                <Route index element={!!(permission?.['Project Types']?.can_view) ?  <ProjectTypeView /> : <Unauthorized/> } />
                <Route
                  path="projecttypecreation"
                  element={!!(permission?.['Project Types']?.can_add) ? <ProejctTypeMaster /> : <Unauthorized/> }
                />
                <Route
                  path="projecttypecreation/:id"
                  element={!!(permission?.['Project Types']?.can_edit) ? <ProejctTypeMaster /> : <Unauthorized/>}
                />
              </Route>
              <Route path="expensetype">
                <Route index element={!!(permission?.expense_type?.can_view) ?  <ExpenseTypeView /> : <Unauthorized/> } />
                <Route
                  path="create"
                  element={!!(permission?.expense_type?.can_add) ? <ExpenseType /> : <Unauthorized/> }
                />
                <Route
                  path="edit/:id"
                  element={!!(permission?.expense_type?.can_edit) ? <ExpenseType /> : <Unauthorized/>}
                />
              </Route>
              <Route path="projectstatus">
                <Route index element={ !!(permission?.['Project Status']?.can_view) ? <ProjectstatusView /> : <Unauthorized/>} />
                <Route
                  path="projectstatuscreation"
                  element={!!(permission?.['Project Status']?.can_add) ? <ProjectstatusMaster /> : <Unauthorized/>} 
                />
                <Route
                  path="projectstatuscreation/:id"
                  element={!!(permission?.['Project Status']?.can_edit) ? <ProjectstatusMaster /> : <Unauthorized/>}
                />
              </Route>
              <Route path="test">
                <Route index element={ <ProjectstatusView /> } />
                <Route
                  path="projectstatuscreation"
                  element={ <ProjectstatusMaster /> }
                />
                <Route
                  path="projectstatuscreation/:id"
                  element={ <ProjectstatusMaster /> }
                />
              </Route>
              <Route path="customersubcategory">
                <Route index element={!!(permission?.['Customer Sub Category']?.can_view) ? <CustSubCategView /> : <Unauthorized/>} />
                <Route
                  path="customersubcategorycreation"
                  element={!!(permission?.['Customer Sub Category']?.can_add) ? <CustSubCategMaster /> : <Unauthorized/>}
                />
                <Route
                  path="customersubcategorycreation/:id"
                  element={!!(permission?.['Customer Sub Category']?.can_edit) ? <CustSubCategMaster /> : <Unauthorized/>}
                />
              </Route>

              <Route path="zonemaster">
                <Route index element={!!(permission?.['ZoneMaster']?.can_view) ? <ZoneView /> : <Unauthorized/>} />
                <Route
                  path="create"
                  element={!!(permission?.['ZoneMaster']?.can_add) ? <ZoneMaster /> : <Unauthorized/>}
                />
                <Route
                  path="create/:id"
                  element={!!(permission?.['ZoneMaster']?.can_edit) ? <ZoneMaster /> : <Unauthorized/>}
                />
              </Route>
              <Route path="calltypemaster">  
                <Route index element={!!(permission?.['CallType']?.can_view) ? <CallTypeView /> : <Unauthorized/>} />
                <Route
                  path="calltypecreation"
                  element={!!(permission?.['CallType']?.can_add) ? <CallType /> : <Unauthorized/>} 
                />
                <Route
                  path="edit/:id"
                  element={!!(permission?.['CallType']?.can_edit) ? <CallType /> : <Unauthorized/>} 
                />
              </Route>
              <Route path="businessforecastmaster">  
                <Route index element={!!(permission?.['BusinessForecast']?.can_view) ? <BusinessForecastView /> : <Unauthorized/>}  />
                <Route
                  path="create"
                  element={!!(permission?.['BusinessForecast']?.can_add) ? <BusinessForecast /> : <Unauthorized/>} 
                />
                <Route
                  path="edit/:id"
                  element={!!(permission?.['BusinessForecast']?.can_edit) ? <BusinessForecast /> : <Unauthorized/>} 
                />
              </Route>
              <Route path="attendancetype">  
                <Route index element={!!(permission?.['attendance_type']?.can_view) ? <AttendanceTypeView /> : <Unauthorized/>}  />
                <Route
                  path="create"
                  element={!!(permission?.['attendance_type']?.can_add) ? <AttendanceType /> : <Unauthorized/>} 
                />
                <Route
                  path="edit/:id"
                  element={!!(permission?.['attendance_type']?.can_edit) ? <AttendanceType /> : <Unauthorized/>} 
                />
              </Route>
              <Route path="businessforecaststatus" >
              <Route index element={<ForecastStatus />} />
              <Route path="create"
              element={!!(permission?.['BusinessForecastStatus']?.can_add) ? <BusinessForecastStatusCreate /> : <Unauthorized/>} 
             />
             <Route
                  path="edit/:id"
                  element={!!(permission?.['BusinessForecastStatus']?.can_edit) ? <BusinessForecastStatusCreate /> : <Unauthorized/>} 
                />
                {/* <Route path="customersubcategorycreation" element={<CustSubCategMaster />} /> */}
                {/* <Route path="customersubcategorycreation/:id" element={<CustSubCategMaster />} /> */}
              </Route>
            </Route>

            <Route path="library">
              <Route path="communicationfiles" >
                <Route index element={!!(permission?.['Communication Files']?.can_view) ? <CommunicationFilesView /> : <Unauthorized/> } />
                <Route path="communicationfilescreation" element={!!(permission?.['Communication Files']?.can_add) ? <CommunicationFilesCreation /> : <Unauthorized/> }/>
                <Route path="communicationfilescreation/:id" element={!!(permission?.['Communication Files']?.can_edit) ? <CommunicationFilesCreation /> : <Unauthorized/> }/>
              </Route>
            </Route>

            <Route path="calllog">
              <Route index element={!!(permission?.['CallLogCreation']?.can_view) ? <CallLogMain/> : <Unauthorized/>} />
                <Route path="callcreation" element={ <CallLogTab/> }>
                  <Route path="callDetails" element={!!(permission?.['CallLogCreation']?.can_add) ? <CallLogCreation/> : <Unauthorized/>}/>
                  <Route path="callDetails/:id/:mode" element={!!(permission?.['CallLogCreation']?.can_add) ? <CallLogCreation/> : <Unauthorized/>}/>
                  <Route path="callHistory" element={<CallLogHistory/>}/>
                  <Route path="callHistory/:id/:mode" element={<CallLogHistory/>}/>
                </Route>

                <Route path="callReport" element={ <CallReport/> } />

              <Route path="calltobdm" >
               {/* <Route index element={!!(permission?.call_to_bdm?.can_view) ? <CallToBDMView/> : <Unauthorized/>} /> */}
               <Route index element={!!(permission?.call_to_bdm?.can_view) ? <BDMUsersList/> : <Unauthorized/>} />
               <Route path="create" element={!!(permission?.call_to_bdm?.can_add) ? <CallToBDM/> : <Unauthorized/>} />
               <Route path="edit/:id" element={!!(permission?.call_to_bdm?.can_edit) ? <CallToBDM/> : <Unauthorized/>} />
              </Route>
              {/* <Route path="creation" element = {<CallLogMain/>}>
              </Route>
              <Route path="creation/{id}" element = {<CallLogMain/>}></Route> */}
            </Route> 
            <Route path="hr">
              <Route path="attendanceentry" >
                <Route index element={!!(permission?.['AttendanceEntry']?.can_view) ? <AttendanceView /> : <Unauthorized/> } />
                <Route path="create" element={!!(permission?.['AttendanceEntry']?.can_add) ? <AttendanceEntry /> : <Unauthorized/> }/>
                <Route path="edit/:id" element={!!(permission?.['AttendanceEntry']?.can_edit) ? <AttendanceEntry /> : <Unauthorized/> }/>
              </Route>
              <Route path="attendancereport" element={!!(permission?.attendance_report?.can_view) ? <AttendanceReport/> : <Unauthorized/>}/>
              <Route path="holidays">
              <Route index element={!!(permission?.['HolidayMaster']?.can_view) ? <Holiday/> : <Unauthorized/>}/>
                <Route path="create" element={!!(permission?.['HolidayMaster']?.can_add) ? <HolidayCreation/> : <Unauthorized/>}/>
                <Route path="edit/:id" element={!!(permission?.['HolidayMaster']?.can_edit) ? <HolidayCreation/> : <Unauthorized/>}/>
              </Route> 
              
            </Route>
            <Route path="expenses">
              <Route path="otherExpense" >
                <Route index element={!!(permission?.['OtherExpenses']?.can_view) ? <OtherExpenseMain /> : <Unauthorized/> } />
                <Route path="create" element={!!(permission?.['OtherExpenses']?.can_add) ?  <CreateExpenseCreation />  : <Unauthorized/> } />
                <Route path="edit/:id" element={!!(permission?.['OtherExpenses']?.can_edit) ?  <CreateExpenseCreation />  : <Unauthorized/> } />
              </Route >
           {/* <Route path="Reimbursement" element={!!(permission?.["ReimbursementForm"]?.can_view) ? <ReimbursementAdmin />: <Unauthorized/> }/> */}
             
          <Route path="Reimbursement" >
            <Route index element={!!(permission?.["ReimbursementForm"]?.can_view) ? <ReimbursementAdmin />: <Unauthorized/> }/>
           <Route path="Create" element={!!(permission?.["ReimbursementForm"]?.can_add) ? <ReimbursementCreate />: <Unauthorized/> }/>
           <Route path="edit/:id" element={!!(permission?.["ReimbursementForm"]?.can_edit) ? <ReimbursementCreate />: <Unauthorized/> }/>
            </Route>
            </Route> 
          </Route>
          {/* tender end */}
        <Route path="remView/:id" element={<RembursementPrintView />} />
          {/* )} */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
   
  );
}

export default App;
