import React from "react";
import "./Input.scss";

const Input = ({ label, id, name, type, onChange, value }) => {
  return (
    <div className="input-container">
      <label className="input-container-label">{label}</label>
      <div className="input-container-wrapper">
        <input
          className="input-container-wrapper-input"
          type={type}
          id={id}
          name={name}
          onChange={onChange}
          value={value}
        />
      </div>
    </div>
  );
};

export default Input;
