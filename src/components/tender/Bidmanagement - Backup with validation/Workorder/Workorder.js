import { Fragment } from "react";
import CommunicationFiles from './CommunicationFiles/CommunicationFilesForm';
import Mobilization from './MobilizationAdvance/Mobilization';
import ProjetDetails from './ProjectDetails/ProjectDetails';
import LetterOfAcceptance from './LetterOfAcceptance/LetterOfAcceptance';
import WorkOrder from './WorkOrder/WorkOrder';

const Workorder = () => {

    return(
        <Fragment>
            <CommunicationFiles />
            <LetterOfAcceptance />
            <WorkOrder />
            <Mobilization />
            <ProjetDetails />
           
        </Fragment>
    )
}

export default Workorder;