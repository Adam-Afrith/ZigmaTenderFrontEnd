import React from 'react'
import { useEffect } from 'react';
import { RiFileExcel2Fill } from 'react-icons/ri';
 import Excel from '../../images/excel.png'

const UseExport = ({ data, header, accessor, title }) => {
  
  function capitalizeArr(array) {
    const sno = 'S.No';    
    const Array = [sno].concat(array);
    return Array.map((str) => {
      if (typeof str !== 'string') {
        return str; // Return the element as is if it's not a string
      }
      const words = str.split('_');
      const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
      return capitalizedWords.join(' ');
    })
  }

  const toLower = title.toLowerCase();
  const toCamel = toLower.charAt(0).toUpperCase() + toLower.slice(1);
  const titleDownloadName = toCamel.split(' ').join('_');

  const myArray = header;
  const Header = capitalizeArr(myArray);

  useEffect(() => {   // This useEffect only for testing
   const newArr =  data.map((row, index) => {      
      const rowData = `${index++}, ${accessor.map((column) => row[column] == '[object Object]' ? '' : row[column])}`;      
      return rowData;
    })
    const head = Header.map((head)=> {return head == 'Action' ? '' : head})
    // console.log('newArr',newArr);  
    // console.log('head',head);  
  }, [])

  const handleExport = () => {   // OnClick from Excel Button      
    let i=1;       
    const csv = [
      title,
      Header.map((head)=> {return head == 'Action' ? '' : head}).join(','),
      
      ...data.map((row, index) => {  
        // console.log('rowdata',row);

        //this if condition for Call assign, if  Cusotmer is checked the assign_status=1 or 0. So we have to display either Assigned or not by using value. it will return other field data without changes, 
        // this returns current row if the header not has assign_status accesor
        if (row.assign_status == '1') {
          // return `${index + 1},${row.customer_name},${row.country_name},${row.state_name},${row.district_name}, ${row.city_name},${userName.current},"Assigned"`;               
          const rowData_AssignCall = `${i++} ${accessor.map((column) => (row[column] == '1' ? 'Assigned' : row[column]))}`;          
          
          return rowData_AssignCall;
        }
        else {
          if (row.action) {
            const rowData = `${i++}, ${accessor.map((column) => row[column] == '[object Object]' ? '' : row[column])}`;            
            
            return rowData;
          }
          else {
            return null; // Return null for the empty row
          }          
        }
      })
    ].filter(row => row !== null) // Filter out the null values
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', titleDownloadName + '.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  return (
    <>
      <button name="export" className="btn-rmv-border" onClick={handleExport}>
        {/* <i className="fas fa-file-excel fa-lg text-success" /> */}
        {/* <img src={Excel} width={30} height={30} className='mr-2' /> */}
        <RiFileExcel2Fill className='excel' />
      </button>
    </>
  )
}

export default UseExport;