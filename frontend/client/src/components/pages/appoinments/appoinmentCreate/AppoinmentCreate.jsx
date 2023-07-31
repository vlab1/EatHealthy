import React, { useState, useEffect, useCallback, useContext } from "react";
import "./AppoinmentCreate.scss";
import { AuthContext } from "../../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../../../hooks/http.hook";
import Button from "../../../layout/button/Button";
import Input from "../../../layout/input/Input";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const AppoinmentCreate = () => {
  const {  accessToken } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const { t } = useTranslation();
  const [patient, setPatient] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [delayedSearchText, setDelayedSearchText] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDelayedSearchText(searchText);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const fetchPatientDelay = useCallback(async () => {
    try {
      if (delayedSearchText.length >= 1) {
        const res = await request(
          `/api/user/dietitian/find?email=${delayedSearchText}`,
          "GET",
          null,
          {
            Authorization: `Bearer ${accessToken}`,
          }
        );
        setPatientsList(res.data);
      } else {
        setPatientsList([]);
      }
    } catch (e) {}
  }, [request, delayedSearchText, accessToken]);

  useEffect(() => {
    fetchPatientDelay();
  }, [fetchPatientDelay]);

  const changeHandlerSearch = (event) => {
    const { value } = event.target;
    setSearchText(value);
  };

  const createAppoinmentHandler = async () => {
    try {
      const res = await request(
        `/api/dietitian-appointment/create`,
        "POST",
        { patientId: patient._id },
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );
      window.location.pathname = `/appoinment/update/${res.data._id}`;
    } catch (e) {
      NotificationManager.error(t("Incorrect data"), t("Error"), 3000);
    }
  };

  return (
    <div className="appoinment-create-container">
            <div className="header">{t("Appoinment create")}</div>
      <div className="action-container">
        <div className="search-input">
          <Input
            placeholder={t("Email")}
            label={t("Search")}
            type="text"
            id="searchText"
            name="searchText"
            value={searchText}
            onChange={changeHandlerSearch}
          ></Input>

          {patientsList.length > 0 && (
            <div className="absolut-epta">
              <div className="ababa">
                {patientsList.map((item, index) => {
                  return (
                    <p
                      key={index}
                      onClick={() => {
                        setSearchText(item.email);
                        setPatient(item);
                      }}
                    >
                      {item.email}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="create-button">
          <Button
            content={t("Create")}
            action={"save"}
            onClick={createAppoinmentHandler}
            disabled={loading}
          ></Button>
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default AppoinmentCreate;
