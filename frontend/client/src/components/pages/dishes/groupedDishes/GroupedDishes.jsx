import "./GroupedDishes.scss";
import React, { useState } from "react";
import LocalStorageService from "../../../../services/localStorage";
import { useTranslation } from "react-i18next";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const GroupedDishes = () => {
  const [items, setItems] = useState(LocalStorageService.getAllObjects());
  const { t, i18n } = useTranslation();

  const removeFromGroup = (item) => {
    LocalStorageService.deleteObjectById(item._id);
    NotificationManager.success(t("Removed"), t("Success"), 3000);
    setItems(LocalStorageService.getAllObjects());
  };

  const visit = (item) => {
    window.location.pathname = `/dish/visit/${item._id}`;
  };

  return (
    <div className="grouped-dishes-container">
      <div className="header">{t("Grouped dishes")}</div>
      {items.map((item, index) => {
        return (
          <div className="filter-result-item" key={index}>
            <img
              className="row-image"
              width="200"
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
              ${item?.userId?.profileId?.postcode}
           
          `}{" "}
                </span>{" "}
              </p>
            </span>

            <p className="row-address"></p>
            <p className="row-place-name">
              {t("Eating place name")}:{" "}
              <span className="bold">{item?.userId?.profileId?.name}</span>
            </p>
            <p className="row-description">
              {t("Description")}:{" "}
              <span className="bold">
                {" "}
                {item?.description?.[i18n.language]}
              </span>
            </p>

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
      <NotificationContainer></NotificationContainer>
    </div>
  );
};

export default GroupedDishes;
