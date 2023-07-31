import React from "react";
import "./Purchase.scss";
import { Link } from "react-router-dom";
import Button from "../button/Button";
import { useTranslation } from "react-i18next";

const Purchase = ({ renewSubscriptionHandler, auth, product, price }) => {
  const { t } = useTranslation();
  const buttonDisabled = auth.user?.profileId !== undefined;

  return (
    <div className="subscription-item">
      {auth.accessToken && (
        <Button
          onClick={() => {
            renewSubscriptionHandler(price, product);
          }}
          content={t("Buy")}
          action={"save"}
          disabled={buttonDisabled}
        ></Button>
      )}
      {!auth.accessToken && (
        <Link to="/authentication">
          <Button content={t("Buy")} action={"save"}></Button>
        </Link>
      )}
    </div>
  );
};

export default Purchase;
