import axios from "axios";
import { Fragment, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useBaseUrl } from "../../../hooks/useBaseUrl";
import { usePageTitle } from "../../../hooks/usePageTitle";
import BidCreation from "./Bidcreate/BidCreation";
import CorrigendumPublish from "./CorrigendumPublish/CorrigendumPublish";
import PrebidQueries from "./PrebidQueries/PrebidQueries";
import TenderParticipation from "./TenderParticipation/TenderParticipation";

const BidCreationMain = () => {

    usePageTitle("Bid Creation");
    const navigate = useNavigate();

    const [toastSuccess, toastError, setBidManagementMainId, bidManageMainId ] = useOutletContext();
    const { id, tenderid } = useParams();
    const { server1: baseUrl } = useBaseUrl();

    useEffect(() => {
        if(id) {
            setBidManagementMainId(id)
        }
            
    }, [])

    useEffect(() => {
        if(tenderid){
          axios.get(`${baseUrl}/api/tendercreation/${tenderid}`).then((resp) => {
            if(!resp.data.tender){
              navigate('/tender/bidmanagement/list')
            }
          })
        }else{
            navigate('/tender/bidmanagement/list')
        }
    },[])

    
    return(
        <Fragment>
            <BidCreation/>
            <PrebidQueries/>
            <CorrigendumPublish/>
            <TenderParticipation/>
        </Fragment>
    )
}

export default BidCreationMain;