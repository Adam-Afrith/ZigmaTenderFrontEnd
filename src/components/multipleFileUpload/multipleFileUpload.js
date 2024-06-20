import { Fragment, useEffect, useRef, useState } from "react";

import Swal from "sweetalert2/src/sweetalert2.js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from './UploadDoc.module.css';
import { useBaseUrl } from "../hooks/useBaseUrl";
import { acceptedFileTypes } from "../master/FileConfig";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";

const MultipleFileUpload = () => {
    const wrapperRef = useRef(null);
    const [dragover, setdragover] = useState(false);
    const [file, setFile] = useState([]);
    const onDragEnter = () => {
        wrapperRef.current.classList.add(styles['dragover'])
        setdragover(true)
    };
console.log("Imported")

    const onDragLeave = () => {
        wrapperRef.current.classList.remove(styles['dragover'])
        setdragover(false)
    };
    const onDrop = () => wrapperRef.current.classList.remove(styles['dragover']);
    const onFileDrop = (e) => {
        const newFile = e.target.files[0];

        const chosenFiles = Array.prototype.slice.call(e.target.files)

        const uploadedFiles = [...file];
        let sizeLimitExceeded = false;
        let size = 0;

        for (let uplodedFile of uploadedFiles) {
            size = size + +uplodedFile.size;
        }

        if (size / (1000 * 1000) > 50) {
            alert('Maximum Size (50 MB) reached')
            return;
        }

        let notSupportedFileFormats = [];
        let filesAlreadyInList = [];

        for (let chosenFile of chosenFiles) {
            let filetypes = chosenFile.type;
            // console.log(filetypes)
            if (
                uploadedFiles.findIndex((f) => f.name === chosenFile.name) === -1 &&
                (acceptedFileTypes.includes(filetypes) || filetypes.split('/')[0] === "image" || chosenFile.name.split('.').pop() === 'rar')
            ) {

                size = size + +chosenFile.size;

                if ((size / (1000 * 1000)) <= 50) {

                    uploadedFiles.push(chosenFile)
                } else {
                    alert('Maximum Size limit is 50 MB')
                    break;
                }
            } else {

                if (!acceptedFileTypes.includes(filetypes) && filetypes.split('/')[0] !== "image" && chosenFile.name.split('.').pop() !== 'rar') {
                    notSupportedFileFormats.push(chosenFile.name)

                }

                if (uploadedFiles.findIndex((f) => f.name === chosenFile.name) >= 0) {
                    filesAlreadyInList.push(chosenFile.name)

                }
            }
        }

        // console.log(filesAlreadyInList)

        if (filesAlreadyInList.length > 0) {
            alert(`${filesAlreadyInList.join(" ,")} -  File already in the To BE UPLOADED list`);
        }

        if (notSupportedFileFormats.length > 0) {
            alert(`${notSupportedFileFormats.join(" \n")} \n- File(s) Format not supported. Unable to upload!`);
        }

        setFile(uploadedFiles);
       
    }


    /***Navin created New logic
     * for file upload
     */
    const [selectedImages, setSelectedImages] = useState([]);
    const [fileArray, setFileArray] = useState([]);

    const handleImageDrop = (event) => {

        event.preventDefault();
        const files = event.dataTransfer.files;
        handleImageFiles(files);
    };
    const handleImageSelect = (event) => {
        const files = event.target.files;
        handleImageFiles(files);
    };

    // const handleImageFiles = (files) => {

    //     const selectedFileArray = Array.from(files); // Convert FileList to array
    //     const images = selectedFileArray.map((file) => URL.createObjectURL(file));
    //     setSelectedImages([...selectedImages, ...images]);
    //     setFileArray((prevFileArray) => [...prevFileArray, ...selectedFileArray]);
    // };
    const handleImageFiles = (files) => {
        const selectedFileArray = Array.from(files); // Convert FileList to array
        const images = selectedFileArray.map((file) => {
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file)
          };
        });
      
        setSelectedImages([...selectedImages, ...images]);
        setFileArray((prevFileArray) => [...prevFileArray, ...selectedFileArray]);
      };
      
    const handleRemoveImage = (index) => {
        const updatedImages = [...selectedImages];
        const updatedFileArray = [...fileArray];
        updatedImages.splice(index, 1);
        updatedFileArray.splice(index, 1);
        setSelectedImages(updatedImages);
        setFileArray(updatedFileArray);
      };


    /************ */
    return (
<div>





        <div className="inputgroup col-lg-6 mb-4">
            <div className="row ">
                <div className="col-lg-4 text-dark font-weight-bold">
                    <label htmlFor="customername">Document Upload :</label>
                </div>
                <div className="col-lg-8">
                    <div className={`border-primary d-flex flex-column align-items-center justify-content-center   bg-gray-200 ${styles.height_of_dropbox} ${styles.boderradius__dropbox} ${styles.dashed} ${styles.drop_file_input} `}
                        onDrop={handleImageDrop} onDragOver={(event) => event.preventDefault()}
                    >
                        <p className="display-4 mb-0"><i className='fas fa-cloud-upload-alt text-primary '></i></p>
                        {!dragover && <p className="mt-0">Drag & Drop an document or Click</p>}
                        {dragover && <p className="mt-0">Drop the document</p>}
                        <input type="file" multiple value="" className="h-100 w-100 position-absolute top-50 start-50 pointer" accept={`${acceptedFileTypes.join()}`} onChange={handleImageSelect} />
                    </div>
                </div>
            </div>
            
        </div>


        <div className="col-lg-3 text-dark font-weight-bold">
                <label className="font-weight-bold">Preview</label>
            </div>

            <motion.div
                className="col-lg-9"
                initial={{ scale: 0.5, opacity: 0.4 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: "tween",
                    stiffness: 10,
                    duration: 0.1,
                    delay: 0.1,
                }}
            >
                 {selectedImages.map((image, index) => (
                <div className="upload_Documents">
                    <div className="card  my-4">
                       


                            <div className="card-body d-flex">
                                <div className="preview-image-container">
                                    <img key={index} src={image.url} alt={`Preview ${index}`} 
                                    className="preview-image"
                                    
                                    style={{ width: '200px', height: '150px' }}
                                    />

                                    



                                </div>
                                <div>
                                <div>
                              <h6> Name : </h6>{" "}
                              <span>{image?.name}</span>
                            </div>
                            <div>
                              <h6> Size : </h6>{" "}
                              <span>{image?.size}</span>
                              
                            </div>
                            <div>
                            <FaDownload
                                    //    onClick={() => downloadDoc(image?.originalfilename)}
                                       style={{ marginLeft: '10px' }} 
                                        />
                                        <i
                                        className="fas fa-trash delic"
                                        onClick={() => handleRemoveImage(index)}
                                        style={{ marginLeft: '10px' }} 
                                    ></i>
                            </div>
                            
                                </div>
                            </div>

                       
                        {/* <div className="card-body">
                            {/* <div className="noOfCountsForUpload">{''}</div> 
                            <div className="UploadingDetails col-lg-6">
                                <div>
                                    <h6> Name : </h6> <span>{file.name}</span>
                                </div>
                                <div>
                                    <h6> Size : </h6> <span>{file.size}
                                        <FaDownload
                                            onClick={() => downloadDoc(file.name)}
                                            style={{ marginLeft: '10px' }} />  </span>
                                </div>
                            </div>
                            <div className="UploadImg col-lg-6">
                                <img src={file.src} height={50} width={50} />
                                <i className="fa fa-times" aria-hidden="true" style={{ color: 'red', cursor: 'pointer' }} onClick={handleRemoveDoc}></i>
                            </div>

                        </div> */}

                    </div>
                </div>
                 ))}
            </motion.div>
</div>
    );
};

export default MultipleFileUpload;
