import React, { useEffect, useState } from 'react';
// import { usePageTitle } from "../hooks/usePageTitle";
import { usePageTitle } from "../../hooks/usePageTitle";
import { BsFillTelephonePlusFill } from 'react-icons/bs';
import { MdSettingsPhone } from 'react-icons/md';
import { TbPhoneCheck } from 'react-icons/tb';
import { MdPhoneInTalk } from 'react-icons/md';
import axios from 'axios';
import { useBaseUrl } from '../../hooks/useBaseUrl';

const CallLogDashboard = () => {
    usePageTitle("Call Logs Dashboard")
    const { server1: baseUrl } = useBaseUrl();
    const [callCount, setCallCount] = useState({
        attendedCallsCount: 0,
        completedCallCount: 0,
        openingCallCount: 0,
        overduecallcount: 0,
        todaycallCount: 0,
      })



      useEffect(()=> {
        axios
        .get(`${baseUrl}/api/dashboard/getCallCountAnalysis`, { params: {tokenid: localStorage.getItem('token')} })
        .then((resp) => {
        if (resp.data.status === 200) {
            // console.log("Call Count IF: ",resp.data);
            setCallCount({
            attendedCallsCount: resp.data.attendedCallsCount,
            completedCallCount: resp.data.completedCallCount,
            openingCallCount: resp.data.openingCallCount,
            overduecallcount: resp.data.overduecallcount,
            todaycallCount: resp.data.todaycallCount
            })
        }
        else{
            console.log("Call Count Else: ",resp);
        }
        });
    },[])


    return (
    <div className='CallLogsDashboard'>
        <div className='title'>
            <h5>List Call</h5>
        </div>
        <div className='cards'>
            <div className='row'>
                <div className='col-lg-3'>
                    <div className='card'>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-lg-12 newCall'>
                                    <div className='count'>
                                        <h4>{callCount.openingCallCount}</h4>                                   
                                    </div>
                                    <div className='title'>
                                        <h4>New Calls</h4>                                        
                                    </div>  
                                    <div className='icon'> 
                                        <BsFillTelephonePlusFill />                                  
                                    </div>
                                </div>                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3'>
                    <div className='card'>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-lg-12 pendingCall'>
                                    <div className='count'>
                                        <h4>{callCount.overduecallcount}</h4>                                   
                                    </div>
                                    <div className='title'>
                                        <h4>Pending Calls</h4>                                        
                                    </div>    
                                    <div className='icon'>                                
                                        <MdSettingsPhone />                                    
                                    </div>
                                </div>                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3'>
                    <div className='card'>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-lg-12 updatedCall'>
                                    <div className='count'>
                                        <h4>{callCount.attendedCallsCount}</h4>                                   
                                    </div>
                                    <div className='title'>
                                        <h4>Updated Calls</h4>                                        
                                    </div>   
                                    <div className='icon'>                                 
                                        <MdPhoneInTalk />
                                    </div>
                                </div>                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3'>
                    <div className='card'>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-lg-12 completedCall'>
                                    <div className='count'>
                                        <h4>{callCount.completedCallCount}</h4>                                   
                                    </div>
                                    <div className='title'>
                                        <h4>Completed & Closed Calls</h4>                                        
                                    </div>              
                                    <div className='icon'>
                                        <TbPhoneCheck />                                           
                                    </div>                    
                                </div>                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
    </div>
    )

}

export default CallLogDashboard;