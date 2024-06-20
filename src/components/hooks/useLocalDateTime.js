import {useState, useEffect} from 'react';
const LocalDateTime = () => {
    const [dateTime, setDateTime] = useState(new Date());
    const options = {
      timeZone: "Asia/Kolkata",
      // timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    };

    useEffect(()=>{
      let timer=setInterval(() => {
        setDateTime(new Date());
      }, 1000);      
      return function cleanup(){
        clearInterval(timer);
      }
    },[dateTime])
    // console.log("dateTime",dateTime.toLocaleString('en-US',options))
return(
  <>
    <label                    
         className="form-check-input"
                            type="text"
                            id="time"
                            name="status">
                            {dateTime.toLocaleString('en-US') + ''}</label>
                            </>
)
};

export default LocalDateTime;
