import React, { useState } from "react";
import "./ProgressButton.scss";
import { useTranslation } from "react-i18next";

const ProgressButton = ({ onClick, isLoading, content }) => {
  const { t } = useTranslation();
  return (
    <div className="progress-button">
      {isLoading && <p className="getting-data">{t("Getting data")}</p>}
      <div
        className={`load center ${isLoading ? "bar" : ""}`}
        onClick={!isLoading ? onClick : null}
      >
        <p>{isLoading ? "" : content}</p>
        <div className="loader"></div>
      </div>{" "}
    </div>
  );
};

export default ProgressButton;
