import React from "react";
import "./DataPicker.scss";

const DataPicker = ({ value, onChange, label, name, id }) => {

  function getCurrentDate() { 
    const today = new Date(); 
    let day = today.getDate(); 
    let month = today.getMonth() + 1; 
    const year = today.getFullYear(); 
 
    if (day < 10) { 
      day = "0" + day; 
    } 
 
    if (month < 10) { 
      month = "0" + month; 
    } 
 
    return `${year}-${month}-${day}`; 
  }

  return (
    <div className="data-input-container">
      <label className="data-input-container-label">{label}</label>
      <div className="data-input-container-wrapper">
        <input
          className="data-input-container-wrapper-input"
          type="date"
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          max={getCurrentDate()}
        ></input>
      </div>
    </div>
  );
};

export default DataPicker;


