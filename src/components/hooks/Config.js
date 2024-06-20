import fileDefault from './imglogo/blank.png';
import filePdf from './imglogo/pdf.png';
import fileDoc from './imglogo/word.png';
import fileZip from './imglogo/zip.png';
import fileXls from './imglogo/xls.png';
import fileCsv from './imglogo/csv.png';
import fileRar from './imglogo/archive.png';


export const ImageConfig = {
    default: fileDefault,
    pdf: filePdf,
    doc: fileDoc,
    'docx': fileDoc,
    'csv' : fileCsv, // text/csv
    'msword' : fileDoc,
    "vnd.ms-excel": fileXls,
    "xlsx": fileXls,
    "xls": fileXls,
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet": fileXls, 
    'vnd.openxmlformats-officedocument.wordprocessingml.document' : fileDoc,
    'x-zip-compressed' : fileZip,
    'x-rar-compressed': fileRar,
    'vnd.rar' : fileRar,
    'x-rar' : fileRar,
    'rar' : fileRar,
    'octet-stream' : fileZip,
    'zip' : fileZip,
    'multipart/x-zip' : fileZip,
    'x-zip': fileZip
   
}