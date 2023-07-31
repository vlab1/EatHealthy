import React, { useState } from "react";
import "./PasswordInput.scss";

const PasswordInput = ({ label, id, name, onChange, value, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-input-container">
      <label className="password-input-container-label">{label}</label>
      <div className="password-input-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          className="password-input-container-wrapper-input"
          id={id}
          name={name}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
        />
        <button type="button" id="eyeball" onClick={togglePasswordVisibility}>
          <div className="eye"></div>
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
