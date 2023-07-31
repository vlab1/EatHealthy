import React, { useState, useEffect } from "react";
import "./Send.scss";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useSelector } from "react-redux";
import MedicalTable from "../../layout/medical_table/MedicalTable";
import Input from "../../layout/input/Input";
import Button from "../../layout/button/Button";
import { useHttp } from "../../../hooks/http.hook";
import { useDispatch } from "react-redux";
import { reset } from "../../../store/slices/control.slice";
import { useTranslation } from "react-i18next";

const Send = () => {
  const { t, i18n } = useTranslation();

  function validMeasurementsCheck() {
    if (
      !lastMeasurement ||
      !Array.isArray(lastMeasurement.warnings) ||
      lastMeasurement.warnings.length === 0
    ) {
      return false;
    }
    if (
      lastMeasurement.warnings.length === 0 &&
      lastMeasurement.totalCholesterol === 0 &&
      lastMeasurement.hdlCholesterol === 0 &&
      lastMeasurement.vldlCholesterol === 0 &&
      lastMeasurement.ldlCholesterol === 0
    ) {
      return false;
    }
    return true;
  }
  const { loading, request } = useHttp();

  const dispatch = useDispatch();

  const [appointmentId, setAppointmentId] = useState("");

  const [lastMeasurement, setLastMeasurement] = useState(
    useSelector((state) => state.control)
  );

  const currentCholesterolSettingsData = useSelector((state) => state.settings);

  const [validMeasurement, setValidMeasurement] = useState(
    validMeasurementsCheck()
  );

  const appointmentIdChangeHandler = (event) => {
    const { value } = event.target;
    let validatedValue = value;

    if (value.length <= 24) {
      setAppointmentId(validatedValue);
    }
  };

  const sendMeasurementData = async () => {
    if (!validMeasurementsCheck()) {
      NotificationManager.error(t("Missing measurements"), t("Error"), 3000);
    } else if (appointmentId.length !== 24) {
      NotificationManager.error(
        t("Appointment ID must be 24 characters long"),
        t("Error"),
        3000
      );
    } else if (currentCholesterolSettingsData.apiKey.length !== 171) {
      NotificationManager.error(t("Invalid API key"), t("Error"), 3000);
    } else {
      try {
        await request(
          "/api/dietitian-measurement/iot/create",
          "POST",
          {
            ...lastMeasurement,
            cholesterolNorms: currentCholesterolSettingsData,
            appointmentId,
          },
          {
            Authorization: `Bearer ${currentCholesterolSettingsData.apiKey}`,
          }
        );
        dispatch(reset());
        setAppointmentId("");
        setLastMeasurement(null);
        NotificationManager.success(t("Data sent"), t("Success"), 3000);
      } catch (e) {
        if (e.message === "invalid signature") {
          NotificationManager.error(t("Invalid API key"), t("Error"), 3000);
        } else {
          NotificationManager.error(
            t("Oops, something went wrong"),
            t("Error"),
            3000
          );
        }
      }
    }
  };

  return (
    <div className="send-container">
      <div className="send-container-header">
        <h1>{t("Send")}</h1>
      </div>
      <div className="send-container-actions">
        <div className="send-container-actions-item-input">
          {" "}
          <Input
            label={t("Appointment ID")}
            type="text"
            id="appointmentId"
            name="appointmentId"
            value={appointmentId}
            onChange={appointmentIdChangeHandler}
          ></Input>
        </div>

        <div className="send-container-actions-item-button">
          {" "}
          <Button
            content={t("Send")}
            action={"save"}
            onClick={sendMeasurementData}
            disabled={loading}
          ></Button>
        </div>
      </div>

      {validMeasurement && lastMeasurement && (
        <div className="send-container-table-container">
          <MedicalTable
            units={t("units")}
            currentCholesterolSettingsData={currentCholesterolSettingsData}
            measurement={lastMeasurement}
            language={i18n.language}
          ></MedicalTable>
        </div>
      )}
      <NotificationContainer />
    </div>
  );
};

export default Send;
