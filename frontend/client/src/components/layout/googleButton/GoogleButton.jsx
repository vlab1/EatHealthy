import React from "react";
import "./GoogleButton.scss";


const GoogleButton = ({onClick, content}) => {
  return (
    <button onClick={onClick} type="button" className="login-with-google-btn">
      {content}
    </button>
  );
};

export default GoogleButton;
