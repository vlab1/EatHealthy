import React, { useContext } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useTranslation } from "react-i18next";
import Purchase from "../../layout/purchase/Purchase";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import "./Subscription.scss";

const Subscription = () => {
  const { request } = useHttp();
  const auth = useContext(AuthContext);
  const { t } = useTranslation();

  const renewSubscriptionHandler = async (price, product) => {
    try {
      const res = await request(
        "/api/payment/buy-attempt",
        "PUT",
        {
          price,
          product,
        },
        {
          Authorization: `Bearer ${auth.accessToken}`,
        }
      );

      window.location.href = res.data;
    } catch (e) {
      NotificationManager.error(t("Incorrect data"), t("Error"), 3000);
    }
  };

  const SubscriptionItem = ({
    name,
    price,
    emoji,
    description,
    advantages,
    product,
  }) => (
    <div className="subscription-wrapper">
      <div className="name">{name}</div>
      <div className="price">{price}</div>
      <div className="emoji">{emoji}</div>
      <div className="description">{description}</div>
      <div className="advantages">
        {advantages.map((advantage, index) => (
          <li key={index}>{advantage}</li>
        ))}
      </div>
      <Purchase
        renewSubscriptionHandler={renewSubscriptionHandler}
        auth={auth}
        product={product}
        price={price}
      />
    </div>
  );

  return (
    <div className="subscription-container">
      <p className="big-text">{t("Profile")}</p>
      <div className="flex-wrapper">
        <SubscriptionItem
          name={t("Dietitian profile")}
          price={400}
          emoji="🏥"
          description={t(
            "Subscription allows you to use the profile of a dietitian. Apply and get benefits at work"
          )}
          advantages={[
            t("Dietitian profile"),
            t("Creation of medical practices"),
            t("Interaction with IoT"),
          ]}
          product="Dietitians"
        />
        <SubscriptionItem
          name={t("Eating place profile")}
          price={400}
          emoji="🏣"
          description={t(
            "Subscription allows you to use the profile of an eating place. Apply and get benefits at work"
          )}
          advantages={[
            t("Eating place profile"),
            t("Profiling"),
            t("Statistics"),
          ]}
          product="EatingPlaces"
        />
      </div>
      <NotificationContainer />
    </div>
  );
};

export default Subscription;
