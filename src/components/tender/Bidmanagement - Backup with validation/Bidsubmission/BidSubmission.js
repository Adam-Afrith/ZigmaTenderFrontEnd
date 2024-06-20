import { Fragment, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import LockCard from "../../../UI/LockCard";
import BidSubmittedStatus from "./BidSubmittedStatus/BidSubmittedStatus";
import TenderFee from "./TenderFee/TenderFee";
import EMD from "./EMD/EMD";

const BidSubmission = () => {
    const [toastSuccess, toastError, setBidManagementMainId, bidManageMainId ] = useOutletContext();
    const { id } = useParams();
    useEffect(() => {
        if(id) {
            setBidManagementMainId(id)
        }
    }, [])

    return(
        <Fragment>
            <TenderFee/>
            <EMD/>
            <BidSubmittedStatus/>
            
        </Fragment>
    )
}

export default BidSubmission;