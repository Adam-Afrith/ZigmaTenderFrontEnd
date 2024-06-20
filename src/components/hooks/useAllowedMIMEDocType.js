const useAllowedMIMEDocType = () => {
  return {
    MIMEtype: [
      //for image
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
      //for Pdf
      "application/pdf",
      //for Word file
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/doc",
      //for Zip
      "application/zip",
      "application/x-zip",
      "application/octet-stream",
      "application/x-zip-compressed",
      //for csv
      "text/csv",
      "text/plain",
      "text/comma-separated-values",
      "application/csv",
    //for Excel
      "application/vnd.ms-excel",
      "application/excel",
      "application/vnd.msexcel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    
      //for rar
      "application/x-rar-compressed",
      "application/rar",
      "application/x-rar",
      "application/vnd.rar",
    ],
  };
};

export { useAllowedMIMEDocType };
