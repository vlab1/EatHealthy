import "./DishUpdate.scss";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../../../hooks/http.hook";
import Loader from "../../../layout/loader/Loader";
import Button from "../../../layout/button/Button";
import {
  NotificationManager,
  NotificationContainer
} from "react-notifications";
import { useParams } from "react-router-dom";
import UploadFile from "../../../layout/uploadFile/UploadFile";
import Input from "../../../layout/input/Input";
import TextArea from "../../../layout/textarea/TextArea";
import Uploader from "../../../layout/uploader/Uploader";
import ImagesGallery from "../../../layout/imagesGallery/ImagesGallery";

const DishUpdate = () => {
  const { id } = useParams();
  const { accessToken } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const fetchDish = useCallback(async () => {
    try {
      await request(`/api/dish/find?_id=${id}`, "GET", null, {
        Authorization: `Bearer ${accessToken}`,
      }).then((res) => {
        setDishInformation({
          _id: res.data[0]?._id || "", 
          name: res.data[0]?.name || "",
          description: {
            uk: res.data[0]?.description?.uk || "",
            en: res.data[0]?.description?.en || "",
          },
          price: res.data[0]?.price || "",
          images: res.data[0]?.images || [],
          ingredients: res.data[0]?.ingredients || [],
          files: [],
        });
        setIsLoading(false);
      });
    } catch (e) {}
  }, [request, accessToken, id]);

  useEffect(() => {
    fetchDish();
  }, [fetchDish]);

  const [dishInformation, setDishInformation] = useState({});

  const changeHandlerGeneralInformation = (field, value, lng) => {
    if (field === "name") {
      setDishInformation((prevState) => ({
        ...dishInformation,
        [field]: value,
      }));
    } else if (field === "price") {
      // const numericValue = value.replace(/[^0-9]/g, "");
      setDishInformation((prevState) => ({
        ...dishInformation,
        [field]: value,
      }));
    } else {
      setDishInformation((prevState) => ({
        ...dishInformation,
        [field]: {
          ...prevState[field],
          [lng]: value,
        },
      }));
    }
  };
  const handleInputChangeImages = (item) => {
    setDishInformation((prevState) => ({
      ...prevState,
      images: prevState.images.filter((image) => image !== item),
    }));
  };
  const handleInputChangeDescription = (e, field, lng) => {
    const { value } = e.target;
    changeHandlerGeneralInformation(field, value, lng);
  };

  const updateDishHandler = async () => {
    try {
      const files = dishInformation.files.map((item) => {
        return item.file;
      });
  
      await request(
        "/api/dish/update",
        "PUT",
        {
          ...dishInformation,
        },
        {
          Authorization: `Bearer ${accessToken}`,
        },
        undefined,
        files
      );
      NotificationManager.success(t("Updated"), t("Success"), 3000);
      if (dishInformation.files && dishInformation.files.length > 0) {
        window.location.reload();
      }
    } catch (e) {
      NotificationManager.error(t("Incorrect data"), t("Error"), 3000);
    }
  };

  if (isLoading) {
    return <Loader></Loader>;
  }

  return (
    <div className="dish-container-content-section">
      <div className="dish-container-content-section-container-with-rows">
        <div className="dish-container-content-section-header">
          <h1>{t("Update Dish")}</h1>
        </div>
        <div className="dish-container-content-section-container-rows">
          <div className="subnavigation-container-content-section-container-with-columns">
            <Input
              placeholder={t("Name")}
              label={t("Name")}
              type="text"
              id="name"
              name="name"
              value={dishInformation.name}
              onChange={(e) => handleInputChangeDescription(e, "name", "uk")}
            ></Input>

            <Input
              placeholder={t("Price")}
              label={t("Price")}
              type="text"
              id="price"
              name="price"
              value={dishInformation.price}
              onChange={(e) => handleInputChangeDescription(e, "price", "uk")}
            ></Input>
          </div>

          <TextArea
            placeholder={t("Description (En)")}
            label={t("Description (En)")}
            type="text"
            id="description_en"
            name="description_en"
            value={dishInformation.description.en}
            onChange={(e) =>
              handleInputChangeDescription(e, "description", "en")
            }
          ></TextArea>
          <TextArea
            placeholder={t("Description (Locale)")}
            label={t("Description (Locale)")}
            type="text"
            id="description_uk"
            name="description_uk"
            value={dishInformation.description.uk}
            onChange={(e) =>
              handleInputChangeDescription(e, "description", "uk")
            }
          ></TextArea>
          <div className="uploader-files">
            {" "}
            <p>{t("Images")}</p>
            <ImagesGallery
              preview={dishInformation.images}
              prefix={process.env.REACT_APP_SERVER_URL}
              onClick={handleInputChangeImages}
            ></ImagesGallery>
          </div>
          <div className="uploader-files">
            {" "}
            <p>{t("Upload Images")}</p>
            <Uploader
              uploaded={dishInformation}
              setUploaded={setDishInformation}
            ></Uploader>
          </div>
          <div className="uploader-files">
            <p>{t("Upload Ingredients")}</p>
            <table className="table">
              <caption>{t("Current Ingredients")}</caption>
              <thead>
                <tr>
                  <th>name_en</th>
                  <th>name_uk</th>
                  <th>weight</th>
                </tr>
              </thead>
              <tbody>
                {dishInformation?.ingredients?.map((item, index) => {
   
                  return (
                    <tr>
                      <td>{item?.name?.en}</td>
                      <td>{item?.name?.uk}</td>
                      <td>{item?.weight}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <UploadFile setUploaded={setDishInformation}></UploadFile>
          </div>
        </div>
        <div className="dish-container-content-section-container-rows-button">
          <Button
            content={t("Save")}
            action={"save"}
            onClick={updateDishHandler}
            disabled={loading}
          ></Button>
        </div>
      </div>
      <NotificationContainer/>
    </div>
  );
};

export default DishUpdate;
