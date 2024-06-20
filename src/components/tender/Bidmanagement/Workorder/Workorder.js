import { Fragment, useState } from "react";
import {useOutletContext, useParams } from "react-router-dom";
import CommunicationFiles from './CommunicationFiles/CommunicationFilesForm';
import Mobilization from './MobilizationAdvance/Mobilization';
import ProjetDetails from './ProjectDetails/ProjectDetails';
import LetterOfAcceptance from './LetterOfAcceptance/LetterOfAcceptance';
import WorkOrder from './WorkOrder/WorkOrder';
import LockCard from "../../../UI/LockCard";
import { useEffect } from "react";
import axios from "axios";
import { useBaseUrl } from "../../../hooks/useBaseUrl";
// import PreLoader from "../../../../UI/PreLoader";

const Workorder = () => {
    const [toastSuccess, toastError, setBidManagementMainId, bidManageMainId, istenderParticipated ] = useOutletContext();
    const { id } = useParams();

    const { server1: baseUrl } = useBaseUrl();
 
    useEffect(() => {
        if(id) {
            setBidManagementMainId(id)
          
        }
      } , [])

    

    let locked =   !istenderParticipated || !id
    return(
        <Fragment>
            <LockCard locked={locked}>
                <CommunicationFiles />
                <LetterOfAcceptance />
                <WorkOrder />
                <Mobilization />
                <ProjetDetails />
           </LockCard>
        </Fragment>
    )
}

export default Workorder;