import React, { useState, useEffect } from "react";
import "./Settings.scss";
import Input from "../../layout/input/Input";
import Button from "../../layout/button/Button";
import { useDispatch } from "react-redux";
import { setAllValues } from "../../../store/slices/settings.slice";
import { useSelector } from "react-redux";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import TextArea from "../../layout/textarea/TextArea";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const currentCholesterolData = useSelector((state) => state.settings);

  const setInternationalizedValues = () => {
    const newCurrentCholesterolData = JSON.parse(
      JSON.stringify(currentCholesterolData)
    );

    if (i18n.language === "en") {
      newCurrentCholesterolData.totalCholesterolMin = (
        newCurrentCholesterolData.totalCholesterolMin * 38.67
      ).toFixed(2);
      newCurrentCholesterolData.totalCholesterolMax = (
        newCurrentCholesterolData.totalCholesterolMax * 38.67
      ).toFixed(2);
      newCurrentCholesterolData.hdlCholesterolMin = (
        newCurrentCholesterolData.hdlCholesterolMin * 38.67
      ).toFixed(2);
      newCurrentCholesterolData.hdlCholesterolMax = (
        newCurrentCholesterolData.hdlCholesterolMax * 38.67
      ).toFixed(2);
      newCurrentCholesterolData.vldlCholesterolMin = (
        newCurrentCholesterolData.vldlCholesterolMin * 38.67
      ).toFixed(2);
      newCurrentCholesterolData.vldlCholesterolMax = (
        newCurrentCholesterolData.vldlCholesterolMax * 38.67
      ).toFixed(2);
      newCurrentCholesterolData.ldlCholesterolMin = (
        newCurrentCholesterolData.ldlCholesterolMin * 38.67
      ).toFixed(2);
      newCurrentCholesterolData.ldlCholesterolMax = (
        newCurrentCholesterolData.ldlCholesterolMax * 38.67
      ).toFixed(2);
    }
    setCholesterolData(newCurrentCholesterolData);
  };

  const [cholesterolData, setCholesterolData] = useState(
    JSON.parse(JSON.stringify(currentCholesterolData))
  );

  useEffect(() => {
    setInternationalizedValues();

  }, [i18n.language]);

  const cholesterolDataChangeHandler = (event) => {
    const { name, value } = event.target;
    let validatedValue = value;
    if (value.length === 0) {
      validatedValue = "0";
    }
    if (value.length >= 4 && value[0] === "0") {
      validatedValue = value.substr(1);
    }
    validatedValue = validatedValue.replace(/[^0-9.]/g, "");

    setCholesterolData({
      ...cholesterolData,
      [name]: validatedValue,
    });
  };
  const apiKeyChangeHandler = (event) => {
    const { name, value } = event.target;
    setCholesterolData({
      ...cholesterolData,
      [name]: value,
    });
  };
  const saveCholesterolData = () => {
    const newCurrentCholesterolData = JSON.parse(
      JSON.stringify(cholesterolData)
    );
    if (i18n.language === "en") {
      newCurrentCholesterolData.totalCholesterolMin =
        (newCurrentCholesterolData.totalCholesterolMin / 38.67).toFixed(2);
      newCurrentCholesterolData.totalCholesterolMax =
        (newCurrentCholesterolData.totalCholesterolMax / 38.67).toFixed(2);
      newCurrentCholesterolData.hdlCholesterolMin =
        (newCurrentCholesterolData.hdlCholesterolMin / 38.67).toFixed(2);
      newCurrentCholesterolData.hdlCholesterolMax =
        (newCurrentCholesterolData.hdlCholesterolMax / 38.67).toFixed(2);
      newCurrentCholesterolData.vldlCholesterolMin =
        (newCurrentCholesterolData.vldlCholesterolMin / 38.67).toFixed(2);
      newCurrentCholesterolData.vldlCholesterolMax =
        (newCurrentCholesterolData.vldlCholesterolMax / 38.67).toFixed(2);
      newCurrentCholesterolData.ldlCholesterolMin =
        (newCurrentCholesterolData.ldlCholesterolMin / 38.67).toFixed(2);
      newCurrentCholesterolData.ldlCholesterolMax =
        (newCurrentCholesterolData.ldlCholesterolMax / 38.67).toFixed(2);
    }

    dispatch(setAllValues(newCurrentCholesterolData));
    NotificationManager.success(
      t("Your values ​​are saved"),
      t("Success"),
      3000
    );
  };

  const toDefaultsCholesterolData = () => {
    setCholesterolData(currentCholesterolData);
    NotificationManager.info(t("Changes canceled"), t("Cancel"), 3000);
  };

  return (
    <div className="settings-container">
      <div className="settings-container-header">
        <h1>{t("Settings")}</h1>
      </div>
      <div className="settings-container-inputs">
        <div className="settings-container-inputs-group">
          <div className="settings-container-inputs-inner-group">
            <div className="settings-container-inputs-inner-group-item">
              <Input
                label={t("Total Cholesterol Min") + " (" + t("units") + ")"}
                type="text"
                id="totalCholesterolMin"
                name="totalCholesterolMin"
                value={cholesterolData.totalCholesterolMin}
                onChange={cholesterolDataChangeHandler}
              ></Input>
            </div>
            <div className="settings-container-inputs-inner-group-item">
              <Input
                label={t("Total Cholesterol Max") + " (" + t("units") + ")"}
                type="text"
                id="totalCholesterolMax"
                name="totalCholesterolMax"
                value={cholesterolData.totalCholesterolMax}
                onChange={cholesterolDataChangeHandler}
              ></Input>
            </div>
          </div>

          <div className="settings-container-inputs-inner-group">
            <div className="settings-container-inputs-inner-group-item">
              <Input
                label={t("HDL Cholesterol Min") + " (" + t("units") + ")"}
                type="text"
                id="hdlCholesterolMin"
                name="hdlCholesterolMin"
                value={cholesterolData.hdlCholesterolMin}
                onChange={cholesterolDataChangeHandler}
              ></Input>
            </div>
            <div className="settings-container-inputs-inner-group-item">
              <Input
                label={t("HDL Cholesterol Max") + " (" + t("units") + ")"}
                type="text"
                id="hdlCholesterolMax"
                name="hdlCholesterolMax"
                value={cholesterolData.hdlCholesterolMax}
                onChange={cholesterolDataChangeHandler}
              ></Input>
            </div>
          </div>
        </div>
        <div className="settings-container-inputs-group">
          <div className="settings-container-inputs-inner-group">
            <div className="settings-container-inputs-inner-group-item">
              <Input
                label={t("VLDL Cholesterol Min") + " (" + t("units") + ")"}
                type="text"
                id="vldlCholesterolMin"
                name="vldlCholesterolMin"
                value={cholesterolData.vldlCholesterolMin}
                onChange={cholesterolDataChangeHandler}
              ></Input>
            </div>
            <div className="settings-container-inputs-inner-group-item">
              <Input
                label={t("VLDL Cholesterol Max") + " (" + t("units") + ")"}
                type="text"
                id="vldlCholesterolMax"
                name="vldlCholesterolMax"
                value={cholesterolData.vldlCholesterolMax}
                onChange={cholesterolDataChangeHandler}
              ></Input>
            </div>
          </div>

          <div className="settings-container-inputs-inner-group">
            <div className="settings-container-inputs-inner-group-item">
              <Input
                label={t("LDL Cholesterol Min") + " (" + t("units") + ")"}
                type="text"
                id="ldlCholesterolMin"
                name="ldlCholesterolMin"
                value={cholesterolData.ldlCholesterolMin}
                onChange={cholesterolDataChangeHandler}
              ></Input>
            </div>
            <div className="settings-container-inputs-inner-group-item">
              <Input
                label={t("LDL Cholesterol Max") + " (" + t("units") + ")"}
                type="text"
                id="ldlCholesterolMax"
                name="ldlCholesterolMax"
                value={cholesterolData.ldlCholesterolMax}
                onChange={cholesterolDataChangeHandler}
              ></Input>
            </div>
          </div>
        </div>
      </div>
      {
        <div className="settings-container-textarea">
          <TextArea
            label={t("API Key")}
            type="text"
            placeholder={t("Your API key")}
            id="apiKey"
            name="apiKey"
            value={cholesterolData.apiKey}
            onChange={apiKeyChangeHandler}
          ></TextArea>
        </div>
      }
      <div className="settings-container-action-button">
        <Button
          content={t("Cancel")}
          action={"cancel"}
          onClick={toDefaultsCholesterolData}
        ></Button>
        <Button
          content={t("Save")}
          action={"save"}
          onClick={saveCholesterolData}
        ></Button>
      </div>

      <NotificationContainer />
    </div>
  );
};

export default Settings;
