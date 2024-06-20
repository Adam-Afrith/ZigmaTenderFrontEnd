import React, { useEffect, useState } from 'react';

const SessionTimeout = ({ timeoutInSeconds, onTimeout }) => {
  const [sessionExpired, setSessionExpired] = useState(false);
  let timeout;

  useEffect(() => {
    const resetTimeout = () => {
      clearTimeout(timeout);
      startTimeout();
    };

    const startTimeout = () => {
      timeout = setTimeout(() => {
        setSessionExpired(true);
        onTimeout(); // Callback function to handle session timeout
      }, timeoutInSeconds * 1000);
    };

    const eventListeners = ['click', 'scroll', 'load', 'keydown'];

    eventListeners.forEach((event) => {
      window.addEventListener(event, resetTimeout);
    });

    startTimeout();

    return () => {
      clearTimeout(timeout);
      eventListeners.forEach((event) => {
        window.removeEventListener(event, resetTimeout);
      });
    };
  }, [timeoutInSeconds, onTimeout]);

  if (sessionExpired) {
    // Render your session expired message or component
    return <div>Session expired.</div>;
  }

  return null;
};

export default SessionTimeout;