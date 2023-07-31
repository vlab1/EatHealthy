import React, { useState, useEffect, useCallback, useContext } from "react";
import "./AppoinmentUpdate.scss";
import { AuthContext } from "../../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../../../hooks/http.hook";
import { Link } from "react-router-dom";
import Loader from "../../../layout/loader/Loader";
import Button from "../../../layout/button/Button";
import Input from "../../../layout/input/Input";
import TextArea from "../../../layout/textarea/TextArea";
import MedicalTable from "../../../layout/medical_table/MedicalTable";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import LocalStorageService from "../../../../services/localStorage";
import { useParams } from "react-router-dom";

const AppoinmentUpdate = () => {
  const { accessToken, user } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const { t, i18n } = useTranslation();
  const [appointment, setAppointment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unloadItems, setUnloadItems] = useState([]);
  const { id } = useParams();
  const [disabledAll, setDisabledAll] = useState(false);
  function formatDate(date) {
    const [year, day, month] = date.split("-");
    if (i18n.language === "uk") {
      return `${day}.${month}.${year}`;
    } else {
      return `${month}-${day}-${year}`;
    }
  }
  function extractIds(arr) {
    return arr.map((obj) => ({ _id: obj._id }));
  }

  function extractIds1(arr) {
    return arr.map((obj) => ({ _id: obj._id._id }));
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

  function removeDuplicates(arr) {
    const uniqueArr = arr.filter((value, index, self) => {
      const stringifiedValue = JSON.stringify(value);
      return (
        index ===
        self.findIndex((obj) => JSON.stringify(obj) === stringifiedValue)
      );
    });

    return uniqueArr;
  }

  const fetchAppointment = useCallback(async () => {
    try {
      await request(`/api/dietitian-appointment/find?_id=${id}`, "GET", null, {
        Authorization: `Bearer ${accessToken}`,
      }).then((res) => {
        setAppointment(res.data[0]);
        setDisabledAll(!(res?.data[0]?.dietitianId?._id === user._id));
        setIsLoading(false);
      });
    } catch (e) {}
  }, [request, accessToken, id, user]);

  useEffect(() => {
    fetchAppointment();
  }, [fetchAppointment]);

  const changeHandler = (event) => {
    setAppointment({
      ...appointment,
      [event.target.name]: event.target.value,
    });
  };

  const changeHandlerAppoinment = async () => {
    try {
      const recommendations = appointment.recommendations;
      const noValidAllowedDishes = [
        ...extractIds1(appointment.allowedDishes),
        ...extractIds(LocalStorageService.getAllObjects()),
      ];

      const allowedDishes = removeDuplicates(noValidAllowedDishes);

      const res = await request(
        `/api/dietitian-appointment/update`,
        "PUT",
        { recommendations, allowedDishes, _id: appointment?._id },
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );
      setAppointment(res.data);

      LocalStorageService.clearLocalStorage();
      setUnloadItems(LocalStorageService.getAllObjects());
      NotificationManager.success(t("Saved"), t("Success"), 3000);
    } catch (e) {
      NotificationManager.error(t("Incorrect data"), t("Error"), 3000);
    }
  };

  const changeHandlerUnload = () => {
    if (unloadItems && unloadItems.length > 0) {
      setUnloadItems([]);
    } else {
      setUnloadItems(LocalStorageService.getAllObjects());
    }
  };

  const removeFromGroup = (item) => {
    LocalStorageService.deleteObjectById(item._id);
    setUnloadItems(LocalStorageService.getAllObjects());
    NotificationManager.success(t("Removed"), t("Success"), 3000);
  };

  const removeFromGroupUploaded = (item) => {
    console.log(item);
    setAppointment((prevAppointment) => {
      let updatedAllowedDishes = prevAppointment.allowedDishes.filter(
        (dish) => dish?._id?._id !== item?._id?._id
      );
      return { ...prevAppointment, allowedDishes: updatedAllowedDishes };
    });
  };

  const visit = (item) => {
    window.location.pathname = `/dish/visit/${item._id}`;
  };
  if (isLoading) {
    return <Loader></Loader>;
  }
  return (
    <div className="appoinment-update-container">
      <div className="appoinment-header">
        <h1>{t("Appoinment")}</h1>
      </div>
      {disabledAll && (
        <div className="appoinment-header">
          <h1 className="error-appoinment">{t("Not your appoinment")}</h1>
        </div>
      )}

      <div className="appoinment-menu">
        {" "}
        <div className="appoinment-container-with-columns">
          <div className="appoinment-container-column">
            <Input
              placeholder={t("ID")}
              label={t("ID")}
              type="text"
              id="_id"
              name="_id"
              value={appointment?._id}
              onChange={null}
              disabled={true}
            ></Input>
            <Input
              placeholder={t("Email")}
              label={t("Email")}
              type="text"
              id="email"
              name="email"
              value={appointment?.patientId?.email}
              onChange={null}
              disabled={true}
            ></Input>
            <Input
              placeholder={t("First name")}
              label={t("First name")}
              type="text"
              id="firstName"
              name="firstName"
              value={appointment?.patientId?.profileId?.firstName}
              onChange={null}
              disabled={true}
            ></Input>
            <Input
              placeholder={t("Last name")}
              label={t("Last name")}
              type="text"
              id="lastName"
              name="lastName"
              value={appointment?.patientId?.profileId?.lastName}
              onChange={null}
              disabled={true}
            ></Input>
            <Input
              placeholder={t("Patronymic")}
              label={t("Patronymic")}
              type="text"
              id="patronymic"
              name="patronymic"
              value={appointment?.patientId?.profileId?.patronymic}
              onChange={null}
              disabled={true}
            ></Input>
          </div>
          <div className="appoinment-container-column">
            <Input
              placeholder={t("Sex")}
              label={t("Sex")}
              type="text"
              id="sex"
              name="sex"
              value={t(appointment?.patientId?.profileId?.sex)}
              onChange={null}
              disabled={true}
            ></Input>
            <Input
              placeholder={t("Birth date")}
              label={t("Birth date")}
              type="text"
              id="birthDate"
              name="birthDate"
              value={
                formatDate(appointment?.patientId?.profileId?.birthDate?.split("T")[0])
              }
              onChange={null}
              disabled={true}
            ></Input>
            <Input
              placeholder={t("Age")}
              label={t("Age")}
              type="text"
              id="age"
              name="age"
              value={calculateAge(appointment?.patientId?.profileId?.birthDate)}
              onChange={null}
              disabled={true}
            ></Input>
            <Input
              placeholder={t("Date")}
              label={t("Date")}
              type="text"
              id="date"
              name="date"
              value={formatDate(appointment?.createdAt.split("T")[0])}
              onChange={null}
              disabled={true}
            ></Input>
            <div className="visit-label">
              {" "}
              <Link to={`/patient/${appointment?.patientId?._id}`}>
                {t("Visit patient profile")}
              </Link>
            </div>
          </div>

          <div className="appoinment-medical-table">
            {appointment?.measurementId && (
              <MedicalTable
                units={t("units")}
                currentCholesterolSettingsData={
                  appointment?.measurementId?.cholesterolNorms
                }
                measurement={appointment?.measurementId}
                language={i18n.language}
              ></MedicalTable>
            )}
          </div>

          <div className="appoinment-current-dishes">
            {appointment?.allowedDishes?.map((item, index) => {
              return (
                <div className="filter-result-item" key={index}>
                  <img
                    className="row-image"
                    alt={`image_ ${index + 1}`}
                    src={`${process.env.REACT_APP_SERVER_URL}${item._id?.images[0]}`}
                  />
                  <span className="row-names">
                    <span>
                      {t("Name")}:{" "}
                      <span className="bold">{item?._id?.name} </span>
                    </span>
                    <p>
                      {t("Price")}:{" "}
                      <span className="bold">{item?._id?.price}</span>
                    </p>
                    <p>
                      {t("Address")}:{" "}
                      <span className="bold">
                        {`${
                          item?._id?.userId?.profileId?.country?.[i18n.language]
                        }, 
                ${item?._id?.userId?.profileId?.region?.[i18n.language]},
                ${item?._id?.userId?.profileId?.city?.[i18n.language]},
                ${item?._id?.userId?.profileId?.address?.[i18n.language]}, 
                ${item?._id?.userId?.profileId?.postcode}`}{" "}
                      </span>{" "}
                    </p>
                  </span>
                  <p className="row-place-name">
                    {t("Eating place name")}:{" "}
                    <span className="bold">
                      {item._id?.userId?.profileId?.name}
                    </span>
                  </p>
                  <p className="row-description">
                    {t("Description")}:{" "}
                    <span className="bold">
                      {" "}
                      {item._id?.description?.[i18n.language]}
                    </span>
                  </p>
                  <div>
                    <p
                      className="btn"
                      style={{ fontSize: "20px", cursor: "pointer" }}
                      onClick={() => {
                        visit(item._id);
                      }}
                    >
                      {t("Visit")}
                    </p>{" "}
                    {!disabledAll && (
                      <p
                        className="btn"
                        style={{ fontSize: "20px", cursor: "pointer" }}
                        onClick={() => {
                          if (!disabledAll) {
                            removeFromGroupUploaded(item);
                          }
                        }}
                      >
                        {t("Remove")}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="appoinment-textarea">
            <TextArea
              placeholder={t("Recommendations")}
              label={t("Recommendations")}
              type="text"
              id="recommendations"
              name="recommendations"
              value={appointment?.recommendations}
              onChange={changeHandler}
              disabled={disabledAll}
            ></TextArea>
          </div>
          {!disabledAll && (
            <div className="appoinment-unload">
              <Button
                content={t("Show unloaded food")}
                action={"save"}
                onClick={changeHandlerUnload}
                disabled={loading || disabledAll}
              ></Button>
            </div>
          )}

          <div className="appoinment-unloaded-dishes-container">
            {unloadItems.map((item, index) => {
              return (
                <div className="filter-result-item" key={index}>
                  <img
                    className="row-image"
                    alt={`image_ ${index + 1}`}
                    src={`${process.env.REACT_APP_SERVER_URL}${item?.images[0]}`}
                  />
                  <span className="row-names">
                    <span>
                      {t("Name")}: <span className="bold">{item?.name} </span>
                    </span>
                    <p>
                      {t("Price")}: <span className="bold">{item?.price}</span>
                    </p>
                    <p>
                      {t("Address")}:{" "}
                      <span className="bold">
                        {`${item?.userId?.profileId?.country?.[i18n.language]}, 
                ${item?.userId?.profileId?.region?.[i18n.language]},
                ${item?.userId?.profileId?.city?.[i18n.language]},
                ${item?.userId?.profileId?.address?.[i18n.language]}, 
                ${item?.userId?.profileId?.postcode}`}{" "}
                      </span>{" "}
                    </p>
                  </span>
                  <p className="row-place-name">
                    {t("Eating place name")}:{" "}
                    <span className="bold">
                      {item?.userId?.profileId?.name}
                    </span>
                  </p>
                  <p className="row-description">
                    {t("Description")}:{" "}
                    <span className="bold">
                      {" "}
                      {item?.description?.[i18n.language]}
                    </span>
                  </p>{" "}
                  <div>
                    <p
                      className="btn"
                      style={{ fontSize: "20px", cursor: "pointer" }}
                      onClick={() => {
                        visit(item);
                      }}
                    >
                      {t("Visit")}
                    </p>
                    <p
                      className="btn"
                      style={{ fontSize: "20px", cursor: "pointer" }}
                      onClick={() => {
                        removeFromGroup(item);
                      }}
                    >
                      {t("Remove")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {!disabledAll && (
            <div className="appoinment-column button">
              <Button
                content={t("Update")}
                action={"save"}
                onClick={changeHandlerAppoinment}
                disabled={loading || disabledAll}
              ></Button>
            </div>
          )}
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default AppoinmentUpdate;
