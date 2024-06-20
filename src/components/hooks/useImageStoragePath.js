import { useBaseUrl } from "./useBaseUrl";

const useImageStoragePath = () => {
    const { server1: baseUrl } = useBaseUrl();  
    return {
        //-----Path for File access in  local storage  ----
        biddocs : baseUrl+'/uploads/BidManagement/biddocs/',        
        qcFile : baseUrl+'/uploads/competitor/qc/',
        woFile : baseUrl+'/uploads/competitor/woFile/',
        woCompletionFile : baseUrl+'/uploads/competitor/woCompletionFile/',
        prebiddocs : baseUrl+'/uploads/BidManagement/prebidqueries/',   
        CorrigendumPublishdocs : baseUrl+'/uploads/BidManagement/CorrigendumPublish/',   
        agfile: baseUrl+'/uploads/BidManagement/WorkOrder/WorkOrder/agreementDocument/',//Bit Management Work Order form
        workorderfile : baseUrl+'/uploads/BidManagement/WorkOrder/WorkOrder/workorderDocument/',//Bit Management Work Order form
        shofile : baseUrl+'/uploads/BidManagement/WorkOrder/WorkOrder/siteHandOverDocumet/',//Bit Management Work Order form
        commnunicationfile : baseUrl+'/uploads/BidManagement/WorkOrder/CommunicationFiles/',//Bit Management Work Order form
        letterofacceptence : baseUrl+'/uploads/BidManagement/WorkOrder/LetterOfAcceptence/Document/',//Bit Management Work Order form
        techEval: baseUrl+'/uploads/BidManagement/techevaluation/',//Bit Management Tender Status Tech Evaluation form
        commnunicationfilesmaster: baseUrl+'/uploads/Communicationfiles/',//Communication Files
        callcreation: baseUrl+'/uploads/CallCreation/CallLog/', //Call Creation Multi File Uploads
        expense: baseUrl+'/uploads/OtherExpenseSub/OtherExpSubFiles/', //Expense Creation File Uploads
        attendance: baseUrl+'/uploads/attendanceregisterfiles/', //Attendane Entry File Uploads
        expense: baseUrl+'/uploads/Expensecreation/documentsupload/',//Expense Creation

        //----- Uncomment when build App & for Server storage ----
        // qcFile : baseUrl+'/public/uploads/competitor/qc/',
        // woFile : baseUrl+'/public/uploads/competitor/woFile/',
        // woCompletionFile : baseUrl+'/public/uploads/competitor/woCompletionFile/',
        // biddocs : baseUrl+'/public/uploads/BidManagement/biddocs/',
        // prebiddocs : baseUrl+'/public/uploads/BidManagement/prebidqueries/',   
        // CorrigendumPublishdocs : baseUrl+'/public/uploads/BidManagement/CorrigendumPublish/',  
        // agfile: baseUrl+'/public/uploads/BidManagement/WorkOrder/WorkOrder/agreementDocument/',//Bit Management Work Order form
        // workorderfile : baseUrl+'/public/uploads/BidManagement/WorkOrder/WorkOrder/workorderDocument/',//Bit Management Work Order form
        // shofile : baseUrl+'/public/uploads/BidManagement/WorkOrder/WorkOrder/siteHandOverDocumet/',//Bit Management Work Order form
        // commnunicationfile : baseUrl+'/public/uploads/BidManagement/WorkOrder/CommunicationFiles/',//Bit Management Work Order form
        // letterofacceptence : baseUrl+'/public/uploads/BidManagement/WorkOrder/LetterOfAcceptence/Document/',//Bit Management Work Order form
        // techEval: baseUrl+'/public/uploads/BidManagement/techevaluation/',
        // commnunicationfilesmaster: baseUrl+'/public/uploads/Communicationfiles/',
        // callcreation: baseUrl+'/public/uploads/CallCreation/CallLog/', 
        // expense: baseUrl+'/public/uploads/OtherExpenseSub/OtherExpSubFiles/', 
        // attendance: baseUrl+'/public/uploads/attendanceregisterfiles/', //Attendane Entry File Uploads
        // expense: baseUrl+'/public/uploads/Expensecreation/documentsupload/',//Expense Creation
}
}
export {useImageStoragePath};