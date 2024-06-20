import { Fragment } from "react"

const AttendenceReportList = (props) => {

    const  daysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    }

   
    const monthYear = props.month.split('-')
    const noOfDays = daysInMonth(monthYear[0], monthYear[1]);


    let dates = []
    for (let day = 1; day <= (noOfDays || 0); day++) {
    dates.push(day)
    }

    // console.log(dates)

    return (
        <Fragment>
            <div className="table-responsive pb-3">
                <table
                    className="table text-center"
                    id="dataTable"
                    width="100%"
                    cellSpacing={0}
                >
                    <thead className="text-center bg-gray-200 text-primary">
                        <tr>
                            <th scope="col">Employee Name</th>
                            {dates.map((item, index) => {
                               return(
                                <th key={index}>{item}</th>
                               )
                            })

                            }             
                          
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            {dates.map((item, index) => {
                               return(
                                <td key={index}><i className="fa fa-close"></i></td>
                               )
                            })

                            }
                        </tr>     
                    </tbody>
                </table>
            </div>
        </Fragment>
    )
}

export default AttendenceReportList