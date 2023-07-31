import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Banner.scss";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";

const Banner = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

  return location.pathname !== "/authentication" &&
    user &&
    (!user.profileModel || !user.emailIsActivated) ? (
    <div className="banner-outer">
      <div className="banner-inner responsive-wrapper">
        <p>
          {t("To complete registration you need")}{" "}
          <Link to="/subscription">{t("to purchase a profile")}</Link>.{" "}
          {t("Inactive users will be deleted after some time")}
        </p>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Banner;
