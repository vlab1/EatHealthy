import React, { useRef, useEffect } from "react";
import "./TextArea.scss";

const TextArea = ({ label, id, name, type, onChange, value, placeholder }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    const getScrollHeight = (elm) => {
      const savedValue = elm.value;
      elm.value = "";
      elm._baseScrollHeight = elm.scrollHeight;
      elm.value = savedValue;
    };

    const onExpandableTextareaInput = (event) => {
      const elm = event.target;
      if (!elm.classList.contains("autoExpand") || elm.nodeName !== "TEXTAREA")
        return;

      const minRows = parseInt(elm.getAttribute("data-min-rows"), 10) || 0;
      !elm._baseScrollHeight && getScrollHeight(elm);

      elm.rows = minRows;
      const rows = Math.ceil((elm.scrollHeight - elm._baseScrollHeight) / 16);
      elm.rows = minRows + rows;
      onChange(event);
    };

    textarea.addEventListener("input", onExpandableTextareaInput);

    return () => {
      textarea.removeEventListener("input", onExpandableTextareaInput);
    };
  }, [onChange]);

  return (
    <div className="textarea-container">
      <label className="textarea-container-label">{label}</label>
      <div className="textarea-container-wrapper">
        <textarea
          type={type}
          id={id}
          name={name}
          onChange={onChange}
          value={value}
          className="textarea-container-wrapper-textarea autoExpand"
          ref={textareaRef}
          rows="4"
          data-min-rows="4"
          placeholder={placeholder}
        ></textarea>
      </div>
    </div>
  );
};

export default TextArea;
