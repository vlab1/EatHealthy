import "./DishVisit.scss";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../../../hooks/http.hook";
import Loader from "../../../layout/loader/Loader";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";

const DishVisit = () => {
  const { request } = useHttp();
  const { t, i18n } = useTranslation();
  const [dish, setDish] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  const fetchDish = useCallback(async () => {
    try {
      await request(`/api/dish/find?_id=${id}`).then((res) => {
        setDish(res.data[0]);
        setIsLoading(false);
      });
    } catch (e) { }
  }, [request, id]);

  useEffect(() => {
    fetchDish();
  }, [fetchDish]);

  const visitToEatingPlace = (id) => {
    window.location.pathname = `/eatingplace/visit/${id}`;
  };

  if (isLoading) {
    return <Loader></Loader>;
  }
  return (
    <div className="dish-visit-container">
      
      <p className="main-text-dish">{dish?.name}</p>

      <div className="flex-wrapper">

        <div className="imgs-wrapper">
          <Swiper
            spaceBetween={50}
            modules={[Pagination]}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            pagination={{
              clickable: true,
            }}
          >
            {dish?.images?.map((item, index) => {
              return (
                <SwiperSlide>
                  <img
                    key={index}
                    src={`${process.env.REACT_APP_SERVER_URL}${item}`}
                    width="200"
                    alt={`image_ ${index + 1}`}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="contact-wrapper">
          <div className="text-wrapper">
            <p className="label">{t("ABOUT DISH")} 🍽️</p>
            <p>   {t("PRICE")}:    <span className="bold">{dish?.price} </span> </p>
            <p>   {t("NAME")}:     <span className="bold"> {dish?.name}</span> </p>

            <button
                style={{ fontSize: "20px", cursor: "pointer" }}
                onClick={() => {
                  visitToEatingPlace(dish?.userId?.profileId?._id);
                }}
              >
                {t("Visit to eating place")}
      
            </button>
          </div>

          <div className="address-wrapper">
            <p className="label">{t("INGRIDIENTS AND THEIR VALUE")} 🍉</p>
            {dish?.ingredients.map((item, index) => 
            {
              return (<p key={index}>{item?.name?.[i18n.language]} - {item?.weight}</p>)
            }
            )}
          </div>
          <div className="description-wrapper">
            <p className="label">
              {t("DESCRIPTION")}
              { } 📙
            </p>
            <p className="label-info">
              {dish?.description?.[i18n.language]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishVisit;
