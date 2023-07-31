import React from "react";
import { useTranslation } from "react-i18next";
import "./Main.scss";

const Main = () => {
  const { t } = useTranslation();

  return (
    <div className="main-container">
      <h1>{t("Eat healthy web-service")} </h1>
      <p>
        {t("A software system for automating the management of healthy meals people. The software service will be designed for convenient interaction between the patient, nutritionist and catering establishment.")}
      </p>
    </div>
  );
};

export default Main;
