import { usePageTitle } from "../../../../hooks/usePageTitle";
import { useAllowedUploadFileSize } from "../../../../hooks/useAllowedUploadFileSize";
import { useAllowedMIMEDocType } from "../../../../hooks/useAllowedMIMEDocType";
import { useState, useEffect, useRef, Fragment } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import axios from "axios";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import Swal from "sweetalert2";
import CommunicationFilesList from "./CommunicationFilesList";
import { useImageStoragePath } from "../../../../hooks/useImageStoragePath";
import CollapseCard from "../../../../UI/CollapseCard";
import "./UploadDoc.css";
import Select from "react-select";
import { Alert } from "bootstrap";
const options = [
    { value: "By Postal", label: "By Postal" },
    { value: "Courier", label: "Courier" },
    { value: "Parcel Service", label: "Parcel Service" },
    { value: "In hand Delivery", label: "In hand Delivery" },
];

const CommunicationFilesForm = () => {
    const { id } = useParams();
    // usePageTitle("Competitor Creation");
    const initialValue = {
        commId: "",
        date: "",
        refrence_no: "",
        from: "",
        to: "",
        subject: "",
        medium: "",
        med_refrence_no: "",
        fileName: "",
    };

    var FILELIST = '';
    const [input, setInput] = useState(initialValue);
    const [formIsValid, setFormIsValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [commFilesList, setCommFilesList] = useState([]);
    const [isBtnClicked, setIsBtnClicked] = useState(false);
    const [previewObjURL, setPreviewObjURL] = useState([]);
    const [progress, setProgressCompleted] = useState(0);
    const [dragover, setdragover] = useState(false);
    const wrapperRef = useRef(null);
    const [file, setFile] = useState("");
    const [previewForEdit, setPreviewForEdit] = useState("");
    let tokenId = localStorage.getItem("token");
    const { server1: baseUrl } = useBaseUrl();
    const { img: maxImageSize } = useAllowedUploadFileSize();
    const { MIMEtype: doctype } = useAllowedMIMEDocType();
    const { commnunicationfile: filePath } = useImageStoragePath();
    const [isPdfFile, setIsPdfFile] = useState(false);
    const [array, setArray] = useState([]);
    const [num, setNum] = useState(0);
    const [ImgaeList, setImgList] = useState([]);
    //  const navigate = useNavigate();
    const [hasError, setHasError] = useState(initialValue);

    useEffect(() => {
        getCompFilesList();
        setNum("wrk-" + Math.floor(100000 + Math.random() * 900000));
        imageList();

    }, []);

    const onDragEnter = () => {
        wrapperRef.current.classList.add("dragover");
        setdragover(true);
    };

    const onDragLeave = () => {
        wrapperRef.current.classList.remove("dragover");
        setdragover(false);
    };
    const onDrop = () => wrapperRef.current.classList.remove("dragover");

    const del_image = (e, id) => {

        e.preventDefault();
        axios.get(`${baseUrl}/api/workorder/creation/communicationfiledelete/${id}`).then(res => {
            if (res.data.status === 200) {

                imageList();
            }


        });
    }
    const openInNewTab = (url, id) => {

        onmouseover = window.open('http://192.168.1.29:8000/uploads/BidManagement/WorkOrder/CommunicationFiles/' + id, '', 'height=550,width=800,scrollbars=yes,left=320,top=120,toolbar=no,location=no,directories=no,status=no,menubar=no');
        return false;
    };

    const imageList = (e) => {

        let sub_id = document.getElementById('randno').value;
        const datatosend = {
            sub_id: sub_id,
        };
        axios.post(`${baseUrl}/api/workorder/creation/communicationfileUploadlist/`, datatosend).then(res => {

            if (res.data.status == 200) {
                setImgList(res.data.list);
                // window.location.href = "/admin/bill-upload/"+sub_id;

            }


        });


    }

    FILELIST = ImgaeList.map((item, index) => {
        let imageurl = '';
        if (item.filetype == 'pdf') {
            imageurl = "assets/icons/pdf_logo.png";
        }
        else if (item.filetype == 'docx' || item.filetype == 'doc') {
            imageurl = "assets/icons/doc-icon.png";
        } else if (item.filetype == 'jpeg' || item.filetype == 'jpg' || item.filetype == 'png' || item.filetype == 'img') {
            imageurl = "http://192.168.1.29:8000/uploads/BidManagement/WorkOrder/CommunicationFiles/" + item.comfile;
        }
        else {
            imageurl = "assets/icons/excelicon.png";
        }

        return (
            <>

                {/* <tr>
                  <td>{index+1}</td> */}
                <Link onClick={(url) => openInNewTab(url, item.comfile)}  >
                    <img src={imageurl} alt="" className="imageprev rounded-circle pointer" width="85" height='85' /></Link>&nbsp;<span
                        className="rounded-circle pointer fa fa-close text-danger h4 closebtn"
                        onClick={(e) => del_image(e, item.id)}
                    >
                    &nbsp;
                </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                {/* <td>
                          <button type="button"  onClick={ (e) => del_image(e, item.id) } className="btn btn-danger btn-sm">Delete</button>
                      </td> */}
                {/* </tr> */}
            </>




        )
    });



};
export default CommunicationFilesForm;