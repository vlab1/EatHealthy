import React, { useState } from "react";
import "./Select.scss";

const Select = ({ options, optionsNames, changeOption, defaultOption }) => {
  const [selectedCategory, setSelectedCategory] = useState(defaultOption);
  const [optionsActive, setOptionsActive] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.toUpperCase());
    setOptionsActive(false);
    changeOption(category);
  };
  return (
    <div className="container">
      <div className="select-box">
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
                  name={optionsNames}
                />
                <label htmlFor={item}>{item.toUpperCase()}</label>
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

export default Select;
