
//New
if(selectedMonth == currentMonth)
{   
if(date>currentDate)
{
    entryArr[date-1] =  {
        'attendanceType' : null,
        'attendanceTypeID' : null,
        // 'fromDate' : date,
        // 'toDate' : date,
        'fromDay' : date,
        'toDay' : date,
        'fromDate' : rowData?.from_date ? rowData?.from_date  : null,
        'toDate' : rowData?.to_date ? rowData?.to_date : null,
        'icon' : '',
        'title' : "-"
    }
}
else{
        entryArr[date-1] =  {
        'attendanceType' : rowData.attendanceType,
        'attendanceTypeID' : rowData.attendance_type_id,
        // 'fromDate' : date,
        // 'toDate' : date,
        'fromDay' : date,
        'toDay' : date,
        'fromDate' : rowData?.from_date ? rowData?.from_date  : null,
        'toDate' : rowData?.to_date ? rowData?.to_date : null,
        'icon' : rowData?.icon_class ? rowData?.icon_class : 'fa fa-star-o text-info',
        'title' : rowData?.reason ? rowData.reason : "Not updated"
        }
    }
}

else if(selectedMonth < currentMonth){
    entryArr[date-1] =  {
        'attendanceType' : rowData.attendanceType ? rowData.attendanceType : null,
        'attendanceTypeID' : rowData.attendance_type_id? rowData.attendance_type_id:null,
        // 'fromDate' : date,
        // 'toDate' : date,
        'fromDay' : date,
        'toDay' : date,
        'fromDate' : rowData?.from_date ? rowData?.from_date  : null,
        'toDate' : rowData?.to_date ? rowData?.to_date : null,
        'icon' : rowData?.icon_class ? rowData?.icon_class : 'fa fa-star-o text-info',
        'title' : rowData?.reason ? rowData.reason : "Not updated"
        }
}
else if(selectedMonth > currentMonth){
    entryArr[date-1] =  {
        'attendanceType' : null,
        'attendanceTypeID' : null,
        // 'fromDate' : date,
        // 'toDate' : date,
        'fromDay' : date,
        'toDay' : date,
        'fromDate' : rowData?.from_date ? rowData?.from_date  : null,
        'toDate' : rowData?.to_date ? rowData?.to_date : null,
        'icon' : '',
        'title' : "-"
    }
}



//Old
if(selectedMonth == currentMonth)
                            { 
                                if(date > currentDate)
                                {
                                    entryArr[date-1] =  {
                                        'attendanceType' : null,
                                        'attendanceTypeID' : null,
                                        // 'fromDate' : date,
                                        // 'toDate' : date,
                                        'fromDay' : date,
                                        'toDay' : date,
                                        'fromDate' : rowData?.from_date ? rowData?.from_date  : null,
                                        'toDate' : rowData?.to_date ? rowData?.to_date : null,
                                        'icon' : '',
                                        'title' : "-"
                                    }
                                }
                                else{
                                    if(dateExistInResult)
                                    {
                                        entryArr[date-1] =  {
                                        'attendanceType' : rowData.attendanceType,
                                        'attendanceTypeID' : rowData.attendance_type_id,
                                        // 'fromDate' : date,
                                        // 'toDate' : date,
                                        'fromDay' : date,
                                        'toDay' : date,
                                        'fromDate' : rowData?.from_date ? rowData?.from_date  : null,
                                        'toDate' : rowData?.to_date ? rowData?.to_date : null,
                                        'icon' : rowData?.icon_class ? rowData?.icon_class : 'fa fa-star-o text-info',
                                        'title' : rowData?.reason ? rowData.reason : "Not updated"}
                                    }
                                    else{
                                        
                                    }
                                }
                                entryArr[date-1] =  {
                                'attendanceType' : 0,
                                'attendanceTypeID' : 0,
                                // 'fromDate' : date,
                                // 'toDate' : date,
                                'fromDay' : date,
                                'toDay' : date,
                                'fromDate' : rowData?.from_date ? rowData?.from_date  : null,
                                'toDate' : rowData?.to_date ? rowData?.toDate : null,
                                'icon' : 'fas fa-check',
                                'title' : "Present"
                                }
                            }
                            else{
                                entryArr[date-1] =  {
                                    'attendanceType' : null,
                                    'attendanceTypeID' : null,
                                    // 'fromDate' : date,
                                    // 'toDate' : date,
                                    'fromDay' : date,
                                    'toDay' : date,
                                    'fromDate' : rowData?.from_date ? rowData?.from_date  : null,
                                    'toDate' : rowData?.to_date ? rowData?.to_date : null,
                                    'icon' : '',
                                    'title' : "-"
                                }
                            }