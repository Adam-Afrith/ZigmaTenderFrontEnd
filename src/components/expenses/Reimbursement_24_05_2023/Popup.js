import React from 'react';


const Popup = ({ title, onClose, children }) => {
  return (
    <div className="popup">
      <div className="popup__overlay" onClick={onClose}></div>
      <div className="popup__content">
        <div className="popup__header">
          <h2>{title}</h2>
          <button className="popup__close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="popup__body">{children}</div>
        <div className="popup__footer"></div>
      </div>
    </div>
  );
};

export default Popup;
