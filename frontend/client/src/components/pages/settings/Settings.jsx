import React, { useState, useContext, useEffect } from "react";
import "./Settings.scss";
import Button from "../../layout/button/Button";
import PasswordInput from "../../layout/passwordInput/PasswordInput";
import { AuthContext } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../../hooks/http.hook";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const Settings = () => {
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

  const [changePasswordForm, setChangePasswordForm] = useState({
    password: "",
    new_password: "",
    repeat_new_password: "",
  });

  const changeHandlerPassword = (event) => {
    setChangePasswordForm({
      ...changePasswordForm,
      [event.target.name]: event.target.value,
    });
  };

  const changePasswordHandler = async () => {
    if (
      changePasswordForm.new_password !== changePasswordForm.repeat_new_password
    ) {
      NotificationManager.error(t("Password mismatch"), t("Error"), 3000);
    } else {
      try {
        await request(
          "/api/user/update/password",
          "PUT",
          {
            ...changePasswordForm,
          },
          {
            Authorization: `Bearer ${accessToken}`,
          }
        );

        NotificationManager.success(t("Saved"), t("Success"), 3000);
        setChangePasswordForm({
          password: "",
          new_password: "",
          repeat_new_password: "",
        });
      } catch (e) {
        NotificationManager.error(t("Incorrect data"), t("Error"), 3000);
      }
    }
  };

  return (
    <div className="subnavigation-settings-container">
      <div className="subnavigation-container-content">
        <div className="subnavigation-container-content-header">
          <h1>
            {t("Settings")} {user.email}
          </h1>
        </div>
        <section
          id="changePassword"
          className="subnavigation-container-content-section"
        >
          <div className="subnavigation-container-content-section-header">
            <h2>{t("Change Password")}</h2>
          </div>
          <div className="subnavigation-container-content-section-container-with-rows">
            <div className="subnavigation-container-content-section-container-rows">
              <PasswordInput
                placeholder={t("Password")}
                label={t("Password")}
                type="text"
                id="password"
                name="password"
                value={changePasswordForm.password}
                onChange={changeHandlerPassword}
              ></PasswordInput>
              <PasswordInput
                placeholder={t("New Password")}
                label={t("New Password")}
                type="text"
                id="new_password"
                name="new_password"
                value={changePasswordForm.new_password}
                onChange={changeHandlerPassword}
              ></PasswordInput>
              <PasswordInput
                placeholder={t("Repeat New Password")}
                label={t("Repeat New Password")}
                type="text"
                id="repeat_new_password"
                name="repeat_new_password"
                value={changePasswordForm.repeat_new_password}
                onChange={changeHandlerPassword}
              ></PasswordInput>
            </div>
            <div className="subnavigation-container-content-section-container-rows-button">
              <Button
                content={t("Save")}
                action={"save"}
                onClick={changePasswordHandler}
                disabled={loading}
              ></Button>
            </div>
          </div>
        </section>
      </div>
      <nav className="subnavigation-section-nav">
        <ol>
          <li className={activeSection === "changePassword" ? "active" : ""}>
            <a href="#changePassword">{t("Change Password")}</a>
          </li>
        </ol>
      </nav>
      <NotificationContainer />
    </div>
  );
};
export default Settings;
