import "./DishesFilterList.scss";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../../../hooks/http.hook";
import Button from "../../../layout/button/Button";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Input from "../../../layout/input/Input";
import TextArea from "../../../layout/textarea/TextArea";
import LocalStorageService from "../../../../services/localStorage";

const DishesFilterList = () => {
  function cleanObject(obj) {
    const cleanedObj = { ...obj }; // Создаем копию исходного объекта

    // Удаление полей с пустыми строками
    Object.keys(cleanedObj).forEach((key) => {
      if (
        typeof cleanedObj[key] === "string" &&
        cleanedObj[key].trim().length === 0
      ) {
        delete cleanedObj[key];
      }
    });

    // Удаление пустых элементов в массиве ingredients
    if (Array.isArray(cleanedObj.ingredients)) {
      cleanedObj.ingredients = cleanedObj.ingredients.filter(
        (ingredient) => ingredient.trim().length > 0
      );
      if (cleanedObj.ingredients.length === 0) {
        delete cleanedObj.ingredients;
      }
    }

    // Удаление полей с длиной 0
    if (cleanedObj.country && cleanedObj.country.length === 0) {
      delete cleanedObj.country;
    }
    if (cleanedObj.region && cleanedObj.region.length === 0) {
      delete cleanedObj.region;
    }
    if (cleanedObj.city && cleanedObj.city.length === 0) {
      delete cleanedObj.city;
    }
    if (cleanedObj.eatingPlaceName && cleanedObj.eatingPlaceName.length === 0) {
      delete cleanedObj.eatingPlaceName;
    }
    if (cleanedObj.dishName && cleanedObj.dishName.length === 0) {
      delete cleanedObj.dishName;
    }

    return cleanedObj;
  }

  function createQueryString(data) {
    let queryArray = [];

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        let value = data[key];
        let newKey = key;
        if (key === "dishName") {
          newKey = "name";
        }
        if (value) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              queryArray.push(`${newKey}=${encodeURIComponent(item)}`);
            });
          } else {
            queryArray.push(`${newKey}=${encodeURIComponent(value)}`);
          }
        }
      }
    }

    return queryArray.join("&");
  }

  const { t, i18n } = useTranslation();
  const { request, loading } = useHttp();
  const [filterDishes, setFilterDishes] = useState([]);

  const [filterInformation, setFilterInformation] = useState({
    country: "",
    region: "",
    city: "",
    eatingPlaceName: "",
    ingredients: [],
    dishName: "",
  });

  const changeHandlerFilterInformation = (event) => {
    const { name, value } = event.target;

    if (name === "ingredients") {
      let filteredValue = value
        .replace(/[^\w\s,а-яА-ЯёЁїіє]/gu, "") // Удаление специальных символов и больших букв
        .toLowerCase(); // Преобразование в нижний регистр
      filteredValue = filteredValue
        .split(",")
        .map((ingredient) => ingredient.trim());
      setFilterInformation((prevInfo) => ({
        ...prevInfo,
        [name]: filteredValue,
      }));
    } else {
      setFilterInformation((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }
  };

  const filterHandler = async () => {
    try {
      const params = cleanObject(filterInformation);
      const querystring = "/api/dish/find?" + createQueryString(params);
      const res = await request(querystring);
      setFilterDishes(res.data);
      NotificationManager.success(t("Filter"), t("Success"), 3000);
    } catch (e) {
      NotificationManager.error(t("Incorrect data"), t("Error"), 3000);
    }
  };

  const addToGroup = (item) => {
    try {
      LocalStorageService.addObject(item);
      NotificationManager.success(t("Added"), t("Success"), 3000);
    } catch {
      NotificationManager.error(
        t("You have already added this food"),
        t("Error"),
        3000
      );
    }
  };

  const visit = (item) => {
    window.location.pathname = `/dish/visit/${item._id}`;
  };

  return (
    <div className="dish-filter-container">
      <div className="filter-header">
        <h1>{t("Filter")}</h1>
      </div>
      <div className="filter-menu">
        {" "}
        <div className="filter-container-with-columns">
          <div className="filter-container-column">
            <Input
              placeholder={t("Country")}
              label={t("Country")}
              type="text"
              id="country"
              name="country"
              value={filterInformation.country}
              onChange={changeHandlerFilterInformation}
            ></Input>
            <Input
              placeholder={t("Region")}
              label={t("Region")}
              type="text"
              id="region"
              name="region"
              value={filterInformation.region}
              onChange={changeHandlerFilterInformation}
            ></Input>
            <Input
              placeholder={t("City")}
              label={t("City")}
              type="text"
              id="city"
              name="city"
              value={filterInformation.city}
              onChange={changeHandlerFilterInformation}
            ></Input>
          </div>
          <div className="filter-container-column">
            <Input
              placeholder={t("Eating place name")}
              label={t("Eating place name")}
              type="text"
              id="eatingPlaceName"
              name="eatingPlaceName"
              value={filterInformation.eatingPlaceName}
              onChange={changeHandlerFilterInformation}
            ></Input>
            <Input
              placeholder={t("Dish name")}
              label={t("Dish name")}
              type="text"
              id="dishName"
              name="dishName"
              value={filterInformation.dishName}
              onChange={changeHandlerFilterInformation}
            ></Input>
          </div>

          <div className="filter-ingredients">
            <TextArea
              placeholder={t(
                "Use lowercase ingredient names and commas, nothing else. For example 'orange, tangerine, apple'"
              )}
              label={t("Ingredients")}
              type="text"
              id="ingredients"
              name="ingredients"
              value={filterInformation.ingredients}
              onChange={changeHandlerFilterInformation}
            ></TextArea>
          </div>
          <div className="filter-column button">
            <Button
              content={t("Filter")}
              action={"save"}
              onClick={filterHandler}
              disabled={loading}
            ></Button>
          </div>
        </div>
      </div>
      <div className="filter-result">
        {filterDishes.map((item, index) => {
          return (
            <div className="filter-result-item" key={index}>
              <img
                className="row-image"
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
                    addToGroup(item);
                  }}
                >
                  {t("Add")}
                </p>
                <p
                  className="btn"
                  style={{ fontSize: "20px", cursor: "pointer" }}
                  onClick={() => {
                    visit(item);
                  }}
                >
                  {t("Visit")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <NotificationContainer></NotificationContainer>
    </div>
  );
};

export default DishesFilterList;
