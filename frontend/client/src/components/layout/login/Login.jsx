import React from "react";
import "./Login.scss";
import Input from "../input/Input";
import PasswordInput from "../passwordInput/PasswordInput";
import Button from "../button/Button";
import GoogleButton from "../googleButton/GoogleButton";
import { useTranslation } from "react-i18next";

const Login = ({
  formLogin,
  changeHandlerLogin,
  loginHandler,
  loading,
  googleloginHandler,
}) => {
  const { t } = useTranslation();
  return (
    <div className="login-container">
      <div className="login-container-item email">
        {" "}
        <Input
          placeholder={t("Email")}
          label={t("Email")}
          type="text"
          id="email"
          name="email"
          value={formLogin.email}
          onChange={changeHandlerLogin}
        ></Input>
      </div>
      <div className="login-container-item password">
        {" "}
        <PasswordInput
          placeholder={t("Password")}
          label={t("Password")}
          id="password"
          name="password"
          value={formLogin.password}
          onChange={changeHandlerLogin}
        ></PasswordInput>
      </div>
      <div className="login-container-item button">
        {" "}
        <GoogleButton
          onClick={googleloginHandler}
          content={t("Login")}
        ></GoogleButton>
        <Button
          content={t("Login")}
          action={"save"}
          onClick={loginHandler}
          disabled={loading}
        ></Button>
      </div>
    </div>
  );
};

export default Login;
