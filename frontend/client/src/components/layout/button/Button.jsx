import React from "react";
import "./Button.scss";

const Button = ({ onClick, content, action, disabled = false}) => {
  return (
    <div className="button-container">
      <button className={`button ${action}`} disabled={disabled}  onClick={onClick}>{content}</button>
    </div>
  );
};

export default Button;
