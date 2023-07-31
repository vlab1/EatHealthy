import React, { useCallback, useEffect, useState } from "react";
import "./EatingPlaceVisit.scss";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../../hooks/http.hook";
import Loader from "../../layout/loader/Loader";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";

const EatingPlaceVisit = () => {
  const { t, i18n } = useTranslation();
  const { request } = useHttp();
  const [eatingplace, setEatingplace] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [openButton, setOpenButton] = useState(true);
  const [openButtonSecond, setOpenButtonSecond] = useState(true);

  const fetchEatingPlace = useCallback(async () => {
    try {
      const res = await request(`/api/eating-place/find?_id=${id}`);
      setEatingplace(res.data[0]);
      setIsLoading(false);
    } catch (e) {}
  }, [request, id]);

  useEffect(() => {
    fetchEatingPlace();
  }, [fetchEatingPlace]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="dietitian-profile-container">
      <div className="name-label">
        <span> {eatingplace.name}</span>
      </div>

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
            {eatingplace.images.map((item, index) => {
              return (
                <SwiperSlide>
                  {" "}
                  <img
                    src={`${process.env.REACT_APP_SERVER_URL}${item}`}
                    key={index}
                    alt={index}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <div className="contact-wrapper">
          <div className="text-wrapper">
            <p className="label">{t("EATING PLACE")} 👋</p>
            <p>
              {t("CONTACT PERSONE")}:{" "}
              <span className="bold">
                {" "}
                {eatingplace?.contactLastName} {eatingplace?.contactFirstName}{" "}
                {eatingplace?.contactPatronymic}
              </span>
            </p>
            <p>
              {t("SEX")}:{" "}
              <span className="bold"> {t(eatingplace?.contactSex?.toUpperCase())}</span>
            </p>
            <button
              onClick={() => {
                setOpenButton(!openButton);
              }}
            >
              {openButton ? t("SHOW PHONE") : eatingplace?.contactPhone}
            </button>
          </div>

          <div className="address-wrapper">
            <p className="label">{t("LOCATION")} 📍</p>
            <button
              onClick={() => {
                setOpenButtonSecond(!openButtonSecond);
              }}
            >
              {openButtonSecond
                ? t("SHOW LOCATION")
                : eatingplace?.address?.[i18n.language] +
                  " " +
                  eatingplace?.city?.[i18n.language] +
                  " " +
                  eatingplace?.country?.[i18n.language]}
            </button>
          </div>
          <div className="description-wrapper">
            <p className="label">
              {t("DESCRIPTION")}
              {} 📙
            </p>
            <p className="label-info">
              {eatingplace?.description?.[i18n.language]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EatingPlaceVisit;
