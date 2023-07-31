import React, { useState, useEffect, useCallback } from "react";
import "./MedicalTable.scss";
import { useTranslation } from "react-i18next";

const MedicalTable = ({
  measurement,
  currentCholesterolSettingsData,
  units,
  language,
}) => {
  const { t, i18n } = useTranslation();

  const [data, setData] = useState(
    JSON.parse(
      JSON.stringify({ ...measurement, ...currentCholesterolSettingsData })
    )
  );

  const [date,] = useState({
    year: measurement.createdAt.split("T")[0].split("-")[0],
    month: measurement.createdAt.split("T")[0].split("-")[1],
    day: measurement.createdAt.split("T")[0].split("-")[2],
    hours: measurement.createdAt.split("T")[1].split(":")[0],
    mins: measurement.createdAt.split("T")[1].split(":")[1],
  });

  const setInternationalizedValues = useCallback(() => {
    const newData = JSON.parse(
      JSON.stringify({ ...measurement, ...currentCholesterolSettingsData })
    );
  
    if (i18n.language === "en") {
      newData.totalCholesterolMin = (
        newData.totalCholesterolMin * 38.67
      ).toFixed(2);
      newData.totalCholesterolMax = (
        newData.totalCholesterolMax * 38.67
      ).toFixed(2);
      newData.hdlCholesterolMin = (newData.hdlCholesterolMin * 38.67).toFixed(2);
      newData.hdlCholesterolMax = (newData.hdlCholesterolMax * 38.67).toFixed(2);
      newData.vldlCholesterolMin = (newData.vldlCholesterolMin * 38.67).toFixed(2);
      newData.vldlCholesterolMax = (newData.vldlCholesterolMax * 38.67).toFixed(2);
      newData.ldlCholesterolMin = (newData.ldlCholesterolMin * 38.67).toFixed(2);
      newData.ldlCholesterolMax = (newData.ldlCholesterolMax * 38.67).toFixed(2);
  
      newData.totalCholesterol = (newData.totalCholesterol * 38.67).toFixed(2);
      newData.hdlCholesterol = (newData.hdlCholesterol * 38.67).toFixed(2);
      newData.vldlCholesterol = (newData.vldlCholesterol * 38.67).toFixed(2);
      newData.ldlCholesterol = (newData.ldlCholesterol * 38.67).toFixed(2);
    }
    setData(newData);
  }, [measurement, currentCholesterolSettingsData, i18n.language, setData]);
  
  useEffect(() => {
    setInternationalizedValues();
  }, [setInternationalizedValues]);
  
  return (
    <div className="control-container-table">
      <section className="performance-facts">
        <header className="performance-facts__header">
          <h1 className="performance-facts__title">{t("Cholesterol level")}</h1>
          <p>{t("Last measurement")}</p>
        </header>
        <table className="performance-facts__table">
          <thead>
            <tr>
              <th colSpan="3" className="small-info">
                {t("Established levels of cholesterol")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th colSpan="2">
                <b>{t("Total Cholesterol Min")}</b> ({units})
              </th>
              <td>{data.totalCholesterolMin}</td>
            </tr>
            <tr>
              <th colSpan="2">
                <b>{t("Total Cholesterol Max")}</b> ({units})
              </th>
              <td>{data.totalCholesterolMax}</td>
            </tr>
            <tr>
              <th colSpan="2">
                <b>{t("HDL Cholesterol Min")}</b> ({units})
              </th>
              <td>{data.hdlCholesterolMin}</td>
            </tr>
            <tr>
              <th colSpan="2">
                <b>{t("HDL Cholesterol Max")}</b> ({units})
              </th>
              <td>{data.hdlCholesterolMax}</td>
            </tr>
            <tr>
              <th colSpan="2">
                <b>{t("VLDL Cholesterol Min")}</b> ({units})
              </th>
              <td>{data.vldlCholesterolMin}</td>
            </tr>
            <tr>
              <th colSpan="2">
                <b>{t("VLDL Cholesterol Max")}</b> ({units})
              </th>
              <td>{data.vldlCholesterolMax}</td>
            </tr>
            <tr>
              <th colSpan="2">
                <b>{t("LDL Cholesterol Min")}</b> ({units})
              </th>
              <td>{data.ldlCholesterolMin}</td>
            </tr>
            <tr>
              <th colSpan="2">
                <b>{t("LDL Cholesterol Max")}</b> ({units})
              </th>
              <td>{data.ldlCholesterolMax}</td>
            </tr>
            <tr className="thick-row">
              <td colSpan="3" className="small-info">
                <b>{t("Measurement results")}</b>
              </td>
            </tr>
            <tr>
              <th colSpan="2">
                <b>{t("Total Cholesterol")}</b> ({units})
              </th>
              <td>
                <b>{data.totalCholesterol}</b>
              </td>
            </tr>
            <tr>
              <th colSpan="2">
                <b>{t("HDL Cholesterol")}</b> ({units})
              </th>
              <td>
                <b>{data.hdlCholesterol}</b>
              </td>
            </tr>
            <tr>
              <th colSpan="2">
                <b>{t("VLDL Cholesterol")}</b> ({units})
              </th>
              <td>
                <b>{data.vldlCholesterol}</b>
              </td>
            </tr>
            <tr>
              <th colSpan="2">
                <b>{t("LDL Cholesterol")}</b> ({units})
              </th>
              <td>
                <b>{data.ldlCholesterol}</b>
              </td>
            </tr>

            <tr className="thick-end">
              <th colSpan="2">
                <b>&nbsp;</b>
              </th>
              <td></td>
            </tr>
          </tbody>
        </table>

        {measurement.warnings.map((item, index) => {
          return (
            <p className="small-info" key={index}>
              * {item.description[language]}
            </p>
          );
        })}

        <table className="performance-facts__table--small small-info">
          <thead>
            <tr>
              <td colSpan="2"></td>
            </tr>
          </thead>
          <tbody></tbody>
        </table>

        <p className="small-info">{t("Date")}:</p>
        <p className="small-info text-center">
          {date.year} - {date.month} - {date.day}
        </p>
        <p className="small-info text-center">
          {date.hours} : {date.mins}
        </p>
      </section>
    </div>
  );
};

export default MedicalTable;
