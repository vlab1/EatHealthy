import React from "react";
import "./Register.scss";
import Input from "../input/Input";
import PasswordInput from "../passwordInput/PasswordInput";
import Button from "../button/Button";
import { useTranslation } from "react-i18next";

const Register = ({
  formRegister,
  changeHandlerRegister,
  registerHandler,
  loading,
}) => {
  const { t } = useTranslation();

  return (
    <div className="register-container">
      <div className="register-container-item email">
        {" "}
        <Input
          label={t("Email")}
          type="text"
          id="email"
          name="email"
          value={formRegister.email}
          onChange={changeHandlerRegister}
          placeholder={t("Email")}
        ></Input>
      </div>
      <div className="register-container-item password">
        {" "}
        <PasswordInput
          placeholder={t("Password")}
          label={t("Password")}
          id="password"
          name="password"
          value={formRegister.password}
          onChange={changeHandlerRegister}
        ></PasswordInput>
      </div>
      <div className="register-container-item password">
        {" "}
        <PasswordInput
          placeholder={t("Password confirmation")}
          label={t("Password confirmation")}
          id="password_confirmation"
          name="password_confirmation"
          value={formRegister.password_confirmation}
          onChange={changeHandlerRegister}
        ></PasswordInput>
      </div>
      <div className="register-container-item button">
        {" "}
        <Button
          content={t("Register")}
          action={"save"}
          onClick={registerHandler}
          disabled={loading}
        ></Button>
      </div>
    </div>
  );
};

export default Register;
