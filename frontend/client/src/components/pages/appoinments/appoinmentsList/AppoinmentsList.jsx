import React, { useState, useEffect, useCallback, useContext } from "react";
import "./AppoinmentsList.scss";
import { AuthContext } from "../../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../../../hooks/http.hook";
import Loader from "../../../layout/loader/Loader";
import Input from "../../../layout/input/Input";

const AppoinmentsList = () => {
  const { user, accessToken } = useContext(AuthContext);
  const { request } = useHttp();
  const { t, i18n } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [delayedSearchText, setDelayedSearchText] = useState("");
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDelayedSearchText(searchText);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchText, request]);

  const fetchAppoinmentDelay = useCallback(async () => {
    try {
      if (delayedSearchText.length >= 1) {
        await request(
          `/api/dietitian-appointment/find?dietitianId=${user._id}&patientEmail=${delayedSearchText}`,
          "GET",
          null,
          {
            Authorization: `Bearer ${accessToken}`,
          }
        ).then((res) => {
          setAppointments(res.data);
        });
      } else {
        await request(
          `/api/dietitian-appointment/find?dietitianId=${user._id}`,
          "GET",
          null,
          {
            Authorization: `Bearer ${accessToken}`,
          }
        ).then((res) => {
          setAppointments(res.data);
        });
      }
    } catch (e) {}
  }, [request, delayedSearchText, user, accessToken]);

  useEffect(() => {
    fetchAppoinmentDelay();
  }, [fetchAppoinmentDelay]);

  const fetchAppointments = useCallback(async () => {
    try {
      await request(
        `/api/dietitian-appointment/find?dietitianId=${user._id}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${accessToken}`,
        }
      ).then((res) => {
        setAppointments(res.data);
        setIsLoading(false);
      });
    } catch (e) {}
  }, [request, accessToken, user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const changeHandlerSearch = (event) => {
    const { value } = event.target;
    setSearchText(value);
  };

  const editAppointment = (item) => {
    window.location.pathname = `/appoinment/update/${item?._id}`;
  };

  function formatDate(date) {
    const [year, day, month] = date.split("-");
    if (i18n.language === "uk") {
      return `${day}.${month}.${year}`;
    } else {
      return `${month}-${day}-${year}`;
    }
  }

  if (isLoading) {
    return <Loader></Loader>;
  }
  return (
    <div className="appoinment-list-container">
      <div className="header">{t("Appoinments")}</div>
      <div className="appoinment-list-container-content-section-search">
        <Input
          placeholder={t("Email")}
          label={t("Search")}
          type="text"
          id="searchText"
          name="searchText"
          value={searchText}
          onChange={changeHandlerSearch}
        ></Input>
      </div>
      {appointments.map((item, index) => {
        return (
          <div className="my-appointments" key={index}>
            <p className="id">
              {t("ID")}:<span className="bold"> {item?._id} </span>
            </p>
            <p className="email">
              {t("Email")}:{" "}
              <span className="bold">{item?.patientId?.email} </span>
            </p>
            <p className="phone">
              {t("Phone")}:{" "}
              <span className="bold">{item?.patientId?.profileId?.phone}</span>
            </p>
            <p className="name">
              {t("First name")}:{" "}
              <span className="bold">
                {item?.patientId?.profileId?.lastName}{" "}
                {item?.patientId?.profileId?.firstName}{" "}
                {item?.patientId?.profileId?.patronymic}
              </span>
            </p>
            <p className="birth_date">
              {t("Birth date")}:{" "}
              <span className="bold">
                {formatDate(
                  item?.patientId?.profileId?.birthDate?.split("T")[0]
                )}
              </span>
            </p>
            <p className="age">
              {t("Age")}:{" "}
              <span className="bold">
                {calculateAge(item?.patientId?.profileId?.birthDate)}
              </span>{" "}
              {t("years old")}
            </p>
            <p className="sex">
              {t("Sex")}:{" "}
              <span className="bold">{t(item?.patientId?.profileId?.sex)}</span>
            </p>
            <p className="date">
              {t("Date")}:{" "}
              <span className="bold">{formatDate(item?.createdAt?.split("T")[0])}</span>
            </p>
            <p
              className="btn"
              style={{ fontSize: "20px", cursor: "pointer" }}
              onClick={() => {
                editAppointment(item);
              }}
            >
              {t("EDIT")}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default AppoinmentsList;
