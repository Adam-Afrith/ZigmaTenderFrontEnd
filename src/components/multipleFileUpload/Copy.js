import React, { useState, useRef } from 'react';
import axios from 'axios';
import styles from "./MultiFileUploader.module.css";
import { ImageConfig } from "../hooks/Config";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaDownload } from "react-icons/fa";
import {useAllowedUploadFileSize} from '../hooks/useAllowedUploadFileSize';
import { useBaseUrl } from "../hooks/useBaseUrl";
import Swal from "sweetalert2";

const MultiFileUploader = (props) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const MAX_TEXT_LENGTH = 20; // Maximum length for the card title
  const {total: Total_Max_file_size} =useAllowedUploadFileSize();
  const accumulatedStorageSize = useRef(0);
  const { server1: baseUrl } = useBaseUrl();

  const handleFileSelection = (event) => {
    const files = event.target.files;
    const updatedSelectedFiles = [...selectedFiles];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file extension is allowed
      if (isFileTypeAllowed(file)) {
        let totalSize = accumulatedStorageSize.current + file.size;
        if(totalSize <= Total_Max_file_size)
        {
        updatedSelectedFiles.push(file);
        accumulatedStorageSize.current = accumulatedStorageSize.current + file.size;
         
        // If it's an image file, create a preview URL
        if (isImageFile(file)) {
          file.previewURL = URL.createObjectURL(file);
        }
      }
      else{
        alert("File Storage limit reached for this Entry..!");
      }
    }
    }
    props.setFileList(updatedSelectedFiles);
    setSelectedFiles(updatedSelectedFiles);
  };

  const isFileTypeAllowed = (file) => {
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf', 'zip', 'rar', 'doc', 'docx', 'xls', 'xlsx', 'csv'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    return allowedExtensions.includes(fileExtension);
  };

  const isImageFile = (file) => {
    const imageExtensions = ['png', 'jpg', 'jpeg'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    return imageExtensions.includes(fileExtension);
  };

  const isRarFile = (file) => {
    console.log("File", file)
    if(file.type === '')
    {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      return fileExtension === 'rar' && true;
    }
      return false;
  };

  const handleFileUpload = () => {
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      formData.append('files[]', file);
    }

    axios
      .post('/upload', formData)
      .then((response) => {
        // Update the uploaded files state with the response from the server
        setUploadedFiles(response.data.files);
      })
      .catch((error) => {
        console.error('Error uploading files: ', error);
      });
  };

  const handleDeleteFile = (file) => {
    const updatedSelectedFiles = selectedFiles.filter((selectedFile) => selectedFile !== file);
    setSelectedFiles(updatedSelectedFiles);
    props.setFileList(updatedSelectedFiles);
  };


  const DeleteDoc = (fileid, filename) => {
    axios.delete(`${baseUrl}/api/callfileupload/${fileid}`).then((res) => {
      if (res.data.status === 200) {
        Swal.fire({
          title: "File",
          text: "Removed Successfully..",
          icon: "success",
          confirmButtonColor: "#2fba5f",
        });
        // getFileList();
      } else {
        Swal.fire({
          title: "File",
          text: res.data.message,
          icon: "error",
          confirmButtonColor: "#2fba5f",
        });
      }
    });
  };



  const handleDownloadFile = (file) => {
    // Implement file download logic here
    console.log('Download file:', file);
  };
console.log("SelectedFiles", selectedFiles)
console.log("uploaded Files", uploadedFiles)

  const renderSelectedFiles = () => {
    return (
      <div className="mt-4">
        <h3>Selected Files:</h3>
        <div className="row">
          {selectedFiles.map((file, index) => (
            <div className="file_Documents col-lg-4">
            <div className="card filecard bg-light shadow-lg">
            <div key={index} className="mb-3">
              <div className="card-body">
              
              <div className="fileDetails ">
                  <div className="pic">
                    {isImageFile(file) ? (
                    <img className="card-img-top" src={file.previewURL} alt={file.name} />
                    ) : isRarFile(file) ? (
                    <img className="card-img-top" src={ImageConfig['rar']} alt={file.name} />)
                      : (<img className="card-img-top" src={ImageConfig[file.type.split('/').pop()]} alt={file.name} />
                      )}
                  </div>
                  <div className="text">
                    <div>
                      <h6>Name: </h6>
                      <p>
                        {/* {file.name} */}
                      
                      {file.name.length > MAX_TEXT_LENGTH ? `${file.name.slice(0, MAX_TEXT_LENGTH)}...` : file.name}
                      
                      </p>
                    </div>
                    <div>
                      <h6>Size: </h6>
                      <p>{(file.size/(1200*1024)).toFixed(2) + "Mb"} </p>
                    </div>
                  </div>
              </div>
              <div className="fileAction">
               <div className="download">
                  <FaDownload
                    // onClick={() => downloadDoc(t.id, t.name)}
                    onClick={() => handleDownloadFile(file)}
                  />
                </div>
                <div className="delete">
                  <RiDeleteBin5Fill
                    // onClick={() => DeleteDoc(t.id, t.name)}
                    onClick={() => handleDeleteFile(file)}
                  />
                </div>
              </div>
                </div>
                </div>
                </div>
               </div>
            // </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUploadedFiles = () => { 
    return (
      <div className="mt-4">
        <h3>Uploaded Files:</h3>
        <div className="row">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="col-lg-12 mb-3">
              <div className="card">
                {isImageFile(file) ? (
                  <img className="card-img-top" src={file.previewURL} alt={file.name} />
                ) :  isRarFile(file) ? (
                  <img className="card-img-top" src={ImageConfig['rar']} alt={file.name} />)
                  : (<img className="card-img-top" src={ImageConfig[file.type.split('/').pop()]} alt={file.name} />
                )}
                <div className="card-body">
                  <h5 className="card-title">{file.name}</h5>
                  {/* <button className="btn btn-danger" onClick={() => handleDeleteFile(file)}>Delete</button>
                  <button className="btn btn-primary" onClick={() => handleDownloadFile(file)}>Download</button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="row align-items-center">
      <div className="col-lg-4 text-dark">
                      <label htmlFor="document" className="font-weight-bold">
                        Document
                      </label>
                    </div>
                    <div className="col-lg-8">
                      <div
                        className={`border-primary d-flex flex-column align-items-center justify-content-center   bg-gray-200 ${styles.height_of_dropbox} ${styles.boderradius__dropbox} ${styles.dashed} ${styles.drop_file_input}`}
                        onDrop={handleFileSelection}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <p className="display-4 mb-0">
                          <i className="fas fa-cloud-upload-alt text-primary "></i>
                        </p>
                        <p>Drag & Drop an document or Click</p>
                        <input
                          type="file"
                          className="h-100 w-100 position-absolute top-50 start-50 pointer"
                          onChange={handleFileSelection}
                          accept=".png, .jpg, .jpeg, .pdf, .zip, .rar, .doc, .docx, .xls, .xlsx, .csv"
                          multiple
                        />
                      </div>
                    </div>


      {/* {selectedFiles.length > 0 && (
        <div className="mt-4">
          <button className="btn btn-primary" onClick={handleFileUpload}>Upload</button>
        </div>
      )} */}

      {selectedFiles.length > 0 && renderSelectedFiles()}
      {uploadedFiles.length > 0 && renderUploadedFiles()}
    </div>
  );
};

export default MultiFileUploader;
