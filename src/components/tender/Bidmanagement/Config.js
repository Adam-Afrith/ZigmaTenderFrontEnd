import fileDefault from '../assets/file-blank-solid-240.png';
import filePdf from '../assets/new/pdf.png';
import fileDoc from '../assets/new/word.png';
import fileZip from '../assets/new/zip.png';
import fileXls from '../assets/new/xls.png';
import fileCsv from '../assets/new/csv.png';
import fileRar from '../assets/new/archive.png';


export const ImageConfig = {
     default: fileDefault,
     pdf: filePdf,
     doc: fileDoc,
     'rar' : fileRar,
    'msword' : fileDoc,
    'vnd.openxmlformats-officedocument.wordprocessingml.document' : fileDoc,
    'x-zip' : fileZip,
    'x-zip-compressed' : fileZip,
    'zip' : fileZip,
    'x-rar' : fileRar,
    'vnd.rar' : fileRar,
    'x-rar-compressed' : fileRar,
    'octet-stream' : fileRar,
    "plain": fileCsv,
    'csv' : fileCsv,
    'plain' : fileCsv,
    'vnd.ms-excel' : fileXls,
    'vnd.openxmlformats-officedocument.spreadsheetml.sheet' : fileXls

}