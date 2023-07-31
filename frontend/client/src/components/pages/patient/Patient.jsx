import React, { useState, useEffect, useCallback, useContext } from "react";
import "./Patient.scss";
import { AuthContext } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../../hooks/http.hook";
import Chol from ".././../../images/chol.png";
import hdl from "../../../images/hdl.png";
import vldl from "../../../images/vldl.png";
import ldl from "../../../images/ldl.png";
import { Link, useParams } from "react-router-dom";
import LineChart from "../../layout/lineChart/LineChart";
import Loader from "../../layout/loader/Loader";

const Patient = () => {
  const { accessToken } = useContext(AuthContext);
  const { request } = useHttp();
  const { t, i18n } = useTranslation();
  const [patient, setPatient] = useState({});
  const { id } = useParams();
  const [statistics, setStatistics] = useState({ uk: [], en: [] });
  const [isLoading, setIsLoading] = useState(true);

  function formatDate(date) {
    const [year, day, month] = date.split("-");
    if (i18n.language === "uk") {
      return `${day}.${month}.${year}`;
    } else {
      return `${month}-${day}-${year}`;
    }
  }  
  function multiplyCholesterol(data) {
    data = JSON.parse(JSON.stringify(data));
    const multipliedData = { ...data };
    multipliedData.averageHDLCholesterol = (
      multipliedData.averageHDLCholesterol * 38.67
    ).toFixed(2);
    multipliedData.averageLDLCholesterol = (
      multipliedData.averageLDLCholesterol * 38.67
    ).toFixed(2);
    multipliedData.averageTotalCholesterol = (
      multipliedData.averageTotalCholesterol * 38.67
    ).toFixed(2);
    multipliedData.averageVLDLCholesterol = (
      multipliedData.averageVLDLCholesterol * 38.67
    ).toFixed(2);
    multipliedData.dietitianAppointment =
      multipliedData.dietitianAppointment.map((appointment) => {
        const multipliedMeasurement = { ...appointment.measurementId };

        multipliedMeasurement.totalCholesterol = (
          multipliedMeasurement.totalCholesterol * 38.67
        ).toFixed(2);

        multipliedMeasurement.hdlCholesterol = (
          multipliedMeasurement.hdlCholesterol * 38.67
        ).toFixed(2);

        multipliedMeasurement.vldlCholesterol = (
          multipliedMeasurement.vldlCholesterol * 38.67
        ).toFixed(2);

        multipliedMeasurement.ldlCholesterol = (
          multipliedMeasurement.ldlCholesterol * 38.67
        ).toFixed(2);

        return { ...appointment, measurementId: multipliedMeasurement };
      });

    return multipliedData;
  }

  function calculateAge(dateString) {
    if (dateString?.length > 0) {
      var currentDate = new Date();
      var birthday = new Date(dateString);

      var age = currentDate.getFullYear() - birthday.getFullYear();

      if (
        currentDate.getMonth() < birthday.getMonth() ||
        (currentDate.getMonth() === birthday.getMonth() &&
          currentDate.getDate() < birthday.getDate())
      ) {
        age--;
      }

      return Math.floor(age);
    }
    return "";
  }

  const fetchPatientDelay = useCallback(async () => {
    try {
      const res = await request(
        `/api/user/dietitian/find?_id=${id}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );

      const res1 = await request(
        `/api/dietitian-appointment/measurement-statistics?patientId=${id}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );
      setStatistics((prevState) => ({
        ...prevState,
        uk: res1.data,
        en: multiplyCholesterol(res1.data),
      }));
      setPatient(res.data[0]);
      setIsLoading(false);
    } catch (e) {}
  }, [request, accessToken, id]);

  useEffect(() => {
    fetchPatientDelay();
  }, [fetchPatientDelay]);



  function convertData(appointments) {
    if (appointments) {
      const cholesterolKeys = [
        "totalCholesterol",
        "hdlCholesterol",
        "vldlCholesterol",
        "ldlCholesterol",
      ];

      const colors = [
        "rgb(232, 193, 160)",
        "rgb(244, 117, 96)",
        "rgb(232, 168, 56)",
        "rgb(241, 225, 91)",
      ];

      const convertedData = [];

      cholesterolKeys.forEach((key, index) => {
        const data = {
          id: key,
          color: colors[index],
          data: [],
          label: t(key),
        };

        appointments.forEach((appointment) => {
          const createdAt =
            formatDate(appointment.measurementId.createdAt.split("T")[0]) +
            " " +
            appointment.measurementId.createdAt.split("T")[1].split(":")[0] +
            ":" +
            appointment.measurementId.createdAt.split("T")[1].split(":")[1];
          const value = Number(appointment.measurementId[key]);
          data.data.push({ x: createdAt, y: value });
        });
        convertedData.push(data);
      });

      return convertedData;
    }
    return [];
  }
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="auth-wrapper">
      <div className="header">{t("Patient profile")}</div>
      <div className="flex-rows">
        <div className="left-side">
          <div className="information">{t("INFORMATION")}</div>
          <div className="group-61">
            <p className="username-1">{t("email")}:</p>
            <p className="username">{patient?.email}</p>
          </div>
          <div className="group-61">
            <p className="username-1">{t("First name")}:</p>
            <p className="username">{patient?.profileId?.firstName}</p>
          </div>
          <div className="group-61">
            <p className="username-1">{t("Last name")}:</p>
            <p className="username">{patient?.profileId?.lastName}</p>
          </div>
          <div className="group-61">
            <p className="username-1">{t("Patronymic")}:</p>
            <p className="username">{patient?.profileId?.patronymic}</p>
          </div>
          <div className="group-61">
            <p className="username-1">{t("Sex")}:</p>
            <p className="username">{t(patient?.profileId?.sex)}</p>
          </div>

          <div className="group-61">
            <p className="username-1">{t("Phone")}:</p>
            <p className="username">{patient?.profileId?.phone}</p>
          </div>
          <div className="group-61">
            <p className="username-1">{t("Birth date")}:</p>
            <p className="username">
              {formatDate(patient?.profileId?.birthDate?.split("T")[0])}
            </p>
          </div>
          <div className="group-61">
            <p className="username-1">{t("Age")}:</p>
            <p className="username">
              {calculateAge(patient?.profileId?.birthDate)}
            </p>
          </div>
        </div>
        <div className="right-side">
          <div className="chart-block">
            <p className="title-hol">
              {t("Number of appointments attended")}{" "}
              {statistics?.[i18n.language]?.dietitianAppointment?.length}
            </p>
            <div className="line-chart">
              <LineChart
                data={convertData(
                  statistics?.[i18n.language]?.dietitianAppointment
                )}
                units={t("units")}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="center-side">
        <p className="average-title">{t("AVERAGE RESULTS")} </p>
        <div className="grid-container">
          <div className="item">
            <div className="item-image">
              <img alt="img_N" className="image" src={Chol}></img>
            </div>
            <p className="title-hol">{t("Total Cholesterol")} </p>
            <p className="number-hol">
              {statistics?.[i18n.language]?.averageTotalCholesterol}{" "}
              {t("units")}
            </p>
          </div>
          <div className="item">
            <div className="item-image">
              <img alt="img_N" className="image" src={vldl}></img>
            </div>
            <p className="title-hol">{t("VLDL Cholesterol")}</p>
            <p className="number-hol">
              {statistics?.[i18n.language]?.averageVLDLCholesterol} {t("units")}
            </p>
          </div>
          <div className="item">
            <div className="item-image">
              <img alt="img_N" className="image" src={hdl}></img>
            </div>
            <p className="title-hol">{t("HDL Cholesterol")}</p>
            <p className="number-hol">
              {statistics?.[i18n.language]?.averageHDLCholesterol} {t("units")}
            </p>
          </div>
          <div className="item">
            <div className="item-image">
              <img alt="img_N" className="image" src={ldl}></img>
            </div>
            <p className="title-hol">{t("LDL Cholesterol")}</p>
            <p className="number-hol">
              {statistics?.[i18n.language]?.averageLDLCholesterol} {t("units")}
            </p>
          </div>
        </div>
      </div>
      <div className="center-side-appoinments">
        <Link to={`/patient/appoinments/${patient?._id}`}>
          <p className="center-side-all-appoinments">
            {t("View all patient appoinments")}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Patient;
