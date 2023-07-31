import React, { useState } from "react";
import "./SelectInput.scss";

const SelectInput = ({
  options,
  optionName,
  changeOption,
  defaultOption,
  label,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(defaultOption);
  const [optionsActive, setOptionsActive] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setOptionsActive(false);
    changeOption({ target: { name: optionName, value: category } });
  };
  return (
    <div className="select-input-container">
      <div className="select-box">
        <label className="select-input-container-label">{label}</label>
        <div className={`options-container ${optionsActive ? "active" : ""}`}>
          {options.map((item, index) => {
            return (
              <div
                className="option"
                onClick={() => handleCategorySelect(item)}
                key={index}
              >
                <input
                  type="radio"
                  className="radio"
                  id={item}
                  name={optionName}
                  value={item}
                />
                <label htmlFor={item}>{item}</label>
              </div>
            );
          })}
        </div>

        <div
          className="selected"
          onClick={() => setOptionsActive(!optionsActive)}
        >
          {selectedCategory}
        </div>
      </div>
    </div>
  );
};

export default SelectInput;
