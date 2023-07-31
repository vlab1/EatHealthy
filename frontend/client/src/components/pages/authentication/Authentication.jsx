import React, { useState, useContext } from "react";
import "./Authentication.scss";
import Login from "../../layout/login/Login";
import Register from "../../layout/register/Register";
import { useHttp } from "../../../hooks/http.hook";
import { AuthContext } from "../../../context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth_, provider } from "../../../firebase";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useTranslation } from "react-i18next";

const Authentication = () => {
  const getDefaultStateLogin = () => {
    return {
      email: "",
      password: "",
    };
  };

  const getDefaultStateRegister = () => {
    return {
      email: "",
      password: "",
      password_confirmation: "",
    };
  };

  const changeHandlerLogin = (event) => {
    setFormLogin({ ...formLogin, [event.target.name]: event.target.value });
  };

  const changeHandlerRegister = (event) => {
    setFormRegister({
      ...formRegister,
      [event.target.name]: event.target.value,
    });
  };

  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const { loading, request } = useHttp();
  const [formLogin, setFormLogin] = useState(getDefaultStateLogin());
  const [formRegister, setFormRegister] = useState(getDefaultStateRegister());

  const loginHandler = async () => {
    try {
      const res = await request("/api/user/login", "POST", {
        ...formLogin,
      });
      await request(
        "/api/refresh-token/create",
        "POST",
        null,
        {
          Authorization: `Bearer ${res.data}`,
        },
        "include"
      );
      auth.login(res.data);
      NotificationManager.success(t("Logged in"), t("Success"), 3000);
      setFormLogin(getDefaultStateLogin());
      window.location.pathname = "/main";
    } catch (e) {
      auth.logout();
      NotificationManager.error(t("Incorrect data"), t("Error"), 3000);
    }
  };

  const registerHandler = async () => {
    let res;
    try {
      res = await request("/api/user/register", "POST", {
        ...formRegister,
      });
      await request(
        "/api/refresh-token/create",
        "POST",
        null,
        {
          Authorization: `Bearer ${res.data}`,
        },
        "include"
      );
      await request("/api/mailer/send-activation-mail", "POST", null, {
        Authorization: `Bearer ${res.data}`,
      });
      auth.login(res.data);
      setFormRegister(getDefaultStateRegister());
      NotificationManager.success(t("Logged in"), t("Success"), 3000);
      window.location.pathname = "/main";
    } catch (e) {
      if (res) {
        await request("/api/user/delete", "DELETE", null, {
          Authorization: `Bearer ${res.data}`,
        });
      }
      auth.logout();
      NotificationManager.error(t("Incorrect data"), t("Error"), 3000);
    }
  };

  const googleloginHandler = async () => {
    try {
      signInWithPopup(auth_, provider).then(async (result) => {
        try {
          const res = await request("/api/user/google/login", "POST", {
            email: result.user.email,
            passwordGoogle: result.user.uid,
          });
          await request(
            "/api/refresh-token/create",
            "POST",
            null,
            {
              Authorization: `Bearer ${res.data}`,
            },
            "include"
          );
          auth.login(res.data);
          NotificationManager.success(t("Logged in"), t("Success"), 3000);
          window.location.pathname = "/main";
        } catch (e) {}
      });
    } catch (e) {
      auth.logout();
      NotificationManager.error(t("Incorrect data"), t("Error"), 3000);
    }
  };

  const [activeTab, setActiveTab] = useState("login");

  const changeTab = () => {
    setActiveTab(activeTab === "login" ? "register" : "login");
  };

  return (
    <div className="authentication-container">
      <div
        className={`authentication-container-item ${
          activeTab === "login" ? "" : "display-none"
        }`}
      >
        <Login
          formLogin={formLogin}
          changeHandlerLogin={changeHandlerLogin}
          loginHandler={loginHandler}
          loading={loading}
          googleloginHandler={googleloginHandler}
        />

        <div className="action-div">
          <p  onClick={changeTab}>
            To Register
          </p>
        </div>
      </div>
      <div
        className={`authentication-container-item ${
          activeTab === "register" ? "" : "display-none"
        }`}
      >
        <Register
          formRegister={formRegister}
          changeHandlerRegister={changeHandlerRegister}
          registerHandler={registerHandler}
          loading={loading}
        />
        <div className="action-div">
          <p  onClick={changeTab}>
            To Login
          </p>
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default Authentication;
