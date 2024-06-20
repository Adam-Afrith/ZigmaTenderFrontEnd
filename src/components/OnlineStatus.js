import { Fragment, useEffect, useState } from "react";
import styles from './OnlineStatus.module.css';

const OnlineStatus = () => {

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isShowingAlert, setShowingAlert] = useState(false);
    const alerttimeout = () => {
      setTimeout(
        () => setShowingAlert(false), 
        3000
      );
    }
  
      useEffect(() => {
          // Update network status
          const handleStatusChange = () => {
            setIsOnline(navigator.onLine);
            if(navigator.onLine){
              setShowingAlert(true)
            }
          };
  
          // Listen to the online status
          window.addEventListener('online', handleStatusChange);
  
          // Listen to the offline status
          window.addEventListener('offline', handleStatusChange);
  
          // Specify how to clean up after this effect for performance improvment
          return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
          };
      }, [isOnline]);

    return(
        <Fragment>
            {(!isOnline) && <div className="bg-danger"><p className="text-center font-weight-bold text-white">You are offline !</p></div>}
    
            <div className ={`bg-success ${(isShowingAlert && isOnline) ? styles.alert_shown : styles.alert_hidden} `}   onTransitionEnd={alerttimeout} >{(isShowingAlert) && <p className="text-center font-weight-bold text-white">You are Online now!</p>}</div>
        </Fragment>
    )
}

export default OnlineStatus;