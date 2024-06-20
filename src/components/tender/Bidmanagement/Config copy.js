import fileDefault from '../assets/file-blank-solid-240.png';
// import fileCSS from '../assets/file-css-solid-240.png';
// import filePdf from '../assets/file-pdf-solid-240.png';
import filePdf from '../assets/new/pdf.png';
// import filePng from '../assets/file-png-solid-240.png';
// import fileDoc from '../assets/file-doc-solid-240.png';
// import filePng from '../assets/file-png-solid-240.png';
import fileDoc from '../assets/new/word.png';
// import fileZip from '../assets/Simple_Comic_zip.png';
import fileZip from '../assets/new/zip.png';
import fileXls from '../assets/new/xls.png';
import fileCsv from '../assets/new/csv.png';
import fileRar from '../assets/new/archive.png';

export const ImageConfig = {
    default: fileDefault,
    pdf: filePdf,
    // png: filePng,
    // css: fileCSS,
    doc: fileDoc,
    'csv' : fileCsv, // text/csv
    'msword' : fileDoc,
    "vnd.ms-excel": fileXls,
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet": fileXls,
    'vnd.openxmlformats-officedocument.wordprocessingml.document' : fileDoc,
    'x-zip-compressed' : fileZip,
    'vnd.rar' : fileRar,
    'x-rar' : fileRar,
    'x-rar-compressed': fileRar,
    'octet-stream' : fileZip,
    'zip' : fileZip,
    'multipart/x-zip' : fileZip,
   
}