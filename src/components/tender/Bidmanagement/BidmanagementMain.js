import { Fragment, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import {  Outlet } from "react-router-dom";
import axios from "axios";
import { useBaseUrl } from "../../hooks/useBaseUrl";

const BidmanagementMain = () => {

    const[bidManageMainId, setBidManagementMainId] = useState(0)
    const[tendercreationid, setTenderCreationId] =  useState(null)
    const [istenderParticipated, setTenderParticipated] = useState(false)
    const { id, tenderid } = useParams();
    const { server1: baseUrl } = useBaseUrl();
    const navigate = useNavigate();

    useEffect(() => {
      if(id){
        if(tenderid){
          setTenderCreationId(tenderid)
        }
        
        axios.get(`${baseUrl}/api/bidcreation/creation/${id}`).then((resp) => {
          if(resp.data.bidcreationdata){
            setTenderCreationId(resp.data.bidcreationdata.tendercreation)
          }else{
            navigate('/tender/bidmanagement/list')
          }
        })
      }else{
        if(tenderid){
          setTenderCreationId(tenderid)
        }
      }


    }, [id])

    useEffect(() => {
      if(id){
        axios.get(`${baseUrl}/api/bidcreation/creation/${id}`).then((resp) => {
          if(!resp.data.bidcreationdata){
            navigate('/tender/bidmanagement/list')
          }
        })
      }
    },[])


    const getTenderParticipationStatus = () => {
      axios.get(`${baseUrl}/api/bidcreation/tenderparticipation/${id}`).then((resp) => {
          if (resp.data.status === 200) {
              if(resp.data.BidCreationTenderParticipation.tenderparticipation){
                  if(resp.data.BidCreationTenderParticipation.tenderparticipation === 'participating'){
                      setTenderParticipated(true)
                  }
              }
          }
      })
  }

    useEffect(() => {
      getTenderParticipationStatus()
    }, [bidManageMainId])

    
    const toastSuccess = (text) => {
        toast.success( text , {
          position: toast.POSITION.TOP_CENTER
        });
      }
    
      const toastError = (text) => {
        toast.error( text , {
          position: toast.POSITION.TOP_CENTER
        });
      }
    
    return (
        <Fragment>
          <ToastContainer />
          <div className="container-fluid p-0">
            <div className="row">
              <div className="col-lg-12">
                <div className="card shadow mb-4">
                  <div className="card-body">
                    <div>
                      <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
                        <li className="nav-item">
                          <NavLink
                            className="nav-link"
                            id="bidcreationmain-tab"
                            data-toggle="tab"
                            to={(bidManageMainId===0) ? `bidcreationmain/${tendercreationid}` : `bidcreationmain/${tendercreationid}/${bidManageMainId}`}
                            role="tab"
                            aria-controls="bidcreationmain"
                            aria-selected="true"
                          >
                            <i className='far fa-user mr-3'></i>
                            Bid Creation
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink
                            className="nav-link"
                            id="bidsubmission-tab"
                            data-toggle="tab"
                            to={(bidManageMainId===0) ? "bidsubmission" : `bidsubmission/${+bidManageMainId}`}
                            role="tab"
                            aria-controls="bidsubmission"
                            aria-selected="false"
                          >
                            
                            <i className='far fa-id-card mr-3'></i>
                            Bid Submission
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink
                            className="nav-link"
                            id="tenderstatus-tab"
                            data-toggle="tab"
                            to={(bidManageMainId===0) ? "tenderstatus" : `tenderstatus/${+bidManageMainId}`}
                            role="tab"
                            aria-controls="tenderstatus"
                            aria-selected="false"
                          >
                            <i className="fas fa-map-marker-alt mr-3" aria-hidden="true"></i>
                            Tender Status
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink
                            className="nav-link"
                            id="workorder-tab"
                            data-toggle="tab"
                            to={(bidManageMainId===0) ? "workorder" : `workorder/${bidManageMainId}`}
                            // to="workorder"
                            role="tab"
                            aria-controls="workorder"
                            aria-selected="false"
                          >	
                          <i className='far fa-check-circle mr-3'></i>
                            Work Order
                          </NavLink>
                        </li> 
                      </ul>
                      <div className="tab-content" id="myTabContent">
                        <div
                          className="tab-pane show active card-body px-0"
                          id="home"
                          role="tabpanel"
                          aria-labelledby="home-tab"
                        >
                          <Outlet context={[toastSuccess, toastError, setBidManagementMainId, bidManageMainId, istenderParticipated, setTenderParticipated ]}/>
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
}
export default BidmanagementMain;