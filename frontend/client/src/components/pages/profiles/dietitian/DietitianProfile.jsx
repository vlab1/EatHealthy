import "./DietitianProfile.scss";
import React, { useEffect, useState, useContext } from "react";
import Input from "../../../layout/input/Input";
import { useTranslation } from "react-i18next";
import SelectInput from "../../../layout/select-input/SelectInput";
import DataPicker from "../../../layout/dataPicker/DataPicker";
import { AuthContext } from "../../../../context/AuthContext";
import Button from "../../../layout/button/Button";
import { useHttp } from "../../../../hooks/http.hook";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import TextArea from "../../../layout/textarea/TextArea";

const DietitianProfile = () => {
  const [activeSection, setActiveSection] = useState(null);
  const { user, accessToken } = useContext(AuthContext);
  const { request, loading } = useHttp();

  const { t } = useTranslation();
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
        if (rect.top <= 0) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [generalInformation, setGeneralInformation] = useState({
    _id: user.profileId._id || "",
    firstName: user.profileId.firstName || "",
    lastName: user.profileId.lastName || "",
    patronymic: user.profileId.patronymic || "",
    sex: user.profileId.sex || "",
    phone: user.profileId.phone || "",
    birthDate:
      (user.profileId.birthDate &&
        new Date(user.profileId.birthDate).toISOString().split("T")[0]) ||
      new Date().toISOString().split("T")[0],
  });

  const changeHandlerGeneralInformation = (event) => {
    const { name, value } = event.target;
    setGeneralInformation((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const updateHandler = async () => {
    try {
      await request(
        "/api/dietitian/update",
        "PUT",
        {
          ...generalInformation,
        },
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );
      NotificationManager.success(t("Saved"), t("Success"), 3000);
    } catch (e) {
      NotificationManager.error(t("Incorrect data"), t("Error"), 3000);
    }
  };

  return (
    <div className="subnavigation-dietitian-container">
      <div className="subnavigation-container-content">
        <div className="subnavigation-container-content-header">
          <h1>{t("Eating Place Profile")}</h1>
        </div>

        <section
          id="general_information"
          className="subnavigation-container-content-section"
        >
          <div className="subnavigation-container-content-section-header">
            <h2>{t("General Information")}</h2>
          </div>

          <div className="subnavigation-container-content-section-container-with-columns">
            <div className="subnavigation-container-content-section-container-column">
              <Input
                placeholder={t("First name")}
                label={t("First name")}
                type="text"
                id="firstName"
                name="firstName"
                value={generalInformation.firstName}
                onChange={changeHandlerGeneralInformation}
              ></Input>
              <Input
                placeholder={t("Last name")}
                label={t("Last name")}
                type="text"
                id="lastName"
                name="lastName"
                value={generalInformation.lastName}
                onChange={changeHandlerGeneralInformation}
              ></Input>
              <Input
                placeholder={t("Patronymic")}
                label={t("Patronymic")}
                type="text"
                id="patronymic"
                name="patronymic"
                value={generalInformation.patronymic}
                onChange={changeHandlerGeneralInformation}
              ></Input>
            </div>
            <div className="subnavigation-container-content-section-container-column">
              <SelectInput
                options={[t("Male"), t("Female")]}
                optionName={"sex"}
                changeOption={changeHandlerGeneralInformation}
                defaultOption={t(user.profileId.sex) || t("Sex")}
                label={t("Sex")}
              ></SelectInput>
              <Input
                placeholder={t("Phone")}
                label={t("Phone")}
                type="text"
                id="phone"
                name="phone"
                value={generalInformation.phone}
                onChange={changeHandlerGeneralInformation}
              ></Input>
              <DataPicker
                label={t("Birth date")}
                name={"birthDate"}
                id={"birthDate"}
                value={generalInformation.birthDate}
                onChange={changeHandlerGeneralInformation}
              ></DataPicker>
            </div>

            <div className="subnavigation-container-content-section-container-column button">
              <Button
                content={t("Save")}
                action={"save"}
                onClick={updateHandler}
                disabled={loading}
              ></Button>
            </div>
          </div>
        </section>

        <section
          id="apiKey"
          className="subnavigation-container-content-section"
        >
          <div className="subnavigation-container-content-section-header">
            <h2>{t("API Key")}</h2>
          </div>

          <div className="subnavigation-container-content-section-container-with-row">
            <TextArea label={t("API Key")} disabled={true}   name={"apiKey"}
                id={"apiKey"} value={accessToken}></TextArea>
          </div>
        </section>
      </div>
      <nav className="subnavigation-section-nav">
        <ol>
          <li
            className={activeSection === "general_information" ? "active" : ""}
          >
            <a href="#general_information">{t("General Information")}</a>
          </li>
          <li className={activeSection === "apiKey" ? "active" : ""}>
            <a href="#apiKey">{t("API Key")}</a>
          </li>
        </ol>
      </nav>
      <NotificationContainer />
    </div>
  );
};

export default DietitianProfile;
