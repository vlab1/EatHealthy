import React, { useState } from "react";
import "./Control.scss";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import ProgressButton from "../../layout/progress_button/ProgressButton";
import MedicalTable from "../../layout/medical_table/MedicalTable";
import { useSelector } from "react-redux";
import IoT from "../../../iot/iot";
import { setAllValues } from "../../../store/slices/control.slice";
import { useDispatch } from "react-redux";
import Button from "../../layout/button/Button";
import { reset } from "../../../store/slices/control.slice";
import { useTranslation } from "react-i18next";


const Control = () => {
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

  function getMeasurements() {
    setIsLoading(true);
    setTimeout(() => {
      iotDevice.runMeasurements({
        ...currentCholesterolSettingsData
      });
      const control = {
        ...iotDevice.sensor,
        warnings: iotDevice.warnings,
        date: iotDevice.date.toISOString(),
      };
      setValidMeasurement(true);
      setMeasurement(control);
      dispatch(setAllValues(control));
      NotificationManager.success(t("Data received"), t("Success"), 3000);
      setIsDisplayedTable(true);
      setIsLoading(false);
    }, 3000);
  }

  const dispatch = useDispatch();

  const iotDevice = new IoT();

  const [isLoading, setIsLoading] = useState(false);

  const lastMeasurement = useSelector((state) => state.control);

  const currentCholesterolSettingsData = useSelector((state) => state.settings);

  const [validMeasurement, setValidMeasurement] = useState(
    validMeasurementsCheck()
  );

  const [isDisplayedTable, setIsDisplayedTable] = useState(true);

  const [measurement, setMeasurement] = useState(lastMeasurement);

  function removeLastMeasurements() {
    dispatch(reset());
    setIsDisplayedTable(false);
  }

  return (
    <div className="control-container">
      <div className="control-container-header">
        <h1>{t("Control")}</h1>
      </div>
      <div className="control-container-measurements">
        <ProgressButton
          onClick={getMeasurements}
          isLoading={isLoading}
          content={t("Measure")}
        ></ProgressButton>
      </div>
      {!isLoading && isDisplayedTable && validMeasurement && (
        <div className="control-container-table-container">
          <MedicalTable
            units={t("units")}
            currentCholesterolSettingsData={currentCholesterolSettingsData}
            measurement={measurement}
            language={i18n.language}
          ></MedicalTable>
        </div>
      )}
      {validMeasurement && isDisplayedTable && !isLoading && (
        <div className="control-container-delete-measurements">
          <Button
            content={t("Delete")}
            action={"cancel"}
            onClick={removeLastMeasurements}
          ></Button>
        </div>
      )}
      <NotificationContainer />
    </div>
  );
};

export default Control;
