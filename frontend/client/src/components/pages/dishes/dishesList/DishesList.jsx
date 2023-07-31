import React, { useState, useEffect, useCallback, useContext } from "react";
import "./DishesList.scss";
import { AuthContext } from "../../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../../../hooks/http.hook";
import { Link } from "react-router-dom";
import Loader from "../../../layout/loader/Loader";
import Button from "../../../layout/button/Button";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Input from "../../../layout/input/Input";

const DishesList = () => {
  const { user, accessToken } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const { t, i18n } = useTranslation();
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [delayedSearchText, setDelayedSearchText] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDelayedSearchText(searchText);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchText, request]);

  const fetchDishDelay = useCallback(async () => {
    try {
      if (delayedSearchText.length >= 1) {
        await request(
          `/api/dish/find?userId=${user._id}&name=${delayedSearchText}`
        ).then((res) => {
          setDishes(res.data);
        });
      } else {
        await request(`/api/dish/find?userId=${user._id}`).then((res) => {
          setDishes(res.data);
        });
      }
    } catch (e) {}
  }, [request, delayedSearchText, user]);

  useEffect(() => {
    fetchDishDelay();
  }, [fetchDishDelay]);

  const fetchDish = useCallback(async () => {
    try {
      await request(`/api/dish/find?userId=${user._id}`, "GET", null, {
        Authorization: `Bearer ${accessToken}`,
      }).then((res) => {
        setDishes(res.data);
        setIsLoading(false);
      });
    } catch (e) {}
  }, [request, accessToken, user]);

  useEffect(() => {
    fetchDish();
  }, [fetchDish]);

  const removeDishHandler = async (_id) => {
    try {
      await request(
        "/api/dish/delete",
        "DELETE",
        {
          ...{ _id },
        },
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );
      setDishes((prevDishes) => prevDishes.filter((dish) => dish._id !== _id));
      NotificationManager.success(t("Deleted"), t("Success"), 3000);
    } catch (e) {
      NotificationManager.error(t("Incorrect data"), t("Error"), 3000);
    }
  };

  const changeHandlerSearch = (event) => {
    const { value } = event.target;
    setSearchText(value);
  };

  if (isLoading) {
    return <Loader></Loader>;
  }
  return (
    <div className="dishes-list-container">
      <div className="dishes-container-content">
        <div className="dishes-container-content-header">
          <h1>{t("Dishes")}</h1>
        </div>
        <div className="dishes-container-content-section-search">
          <Input
            placeholder={t("Dish name")}
            label={t("Search")}
            type="text"
            id="searchText"
            name="searchText"
            value={searchText}
            onChange={changeHandlerSearch}
          ></Input>
        </div>
        <section id="dishesList" className="dishes-container-content-section">
          <div className="dishes-container-content-section-header">
            <h2>{t("List")}</h2>
          </div>

          <div className="dishes-container-content-section-container-with-rows">
            {dishes.map((item, index) => {
              return (
                <div
                  key={index}
                  className="dishes-container-content-section-container-rows"
                >
                  <div className="row-image">
                    <img
                      src={`${process.env.REACT_APP_SERVER_URL}${item.images[0]}`}
                      alt={`image_ ${index + 1}`}
                    ></img>
                  </div>
                  <div className="row-information">
                    <div className="row-information-name">
                      {t("Name")}: <span className="bold">{item.name}</span>
                      <div className="row-information-price">
                        {t("Price")}: <span className="bold">{item.price}</span>
                      </div>
                    </div>
                    <div className="row-information-description">
                      {t("Description")}:{" "}
                      <span className="bold">
                        {item.description?.[i18n.language]}
                      </span>
                    </div>
                  </div>
                  <div className="row-action">
                    <Link to={`/dish/update/${item._id}`}>
                      <Button
                        content={t("Update")}
                        action={"save"}
                        onClick={null}
                        disabled={null}
                      ></Button>
                    </Link>
                    <Button
                      content={t("Delete")}
                      action={"cancel"}
                      onClick={() => {
                        removeDishHandler(item._id);
                      }}
                      disabled={loading}
                    ></Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <nav className="dishes-section-nav">
        <ol>
          <li>
            <Link to="/dish/create">{t("Create")}</Link>
          </li>
        </ol>
      </nav>
      <NotificationContainer />
    </div>
  );
};

export default DishesList;
