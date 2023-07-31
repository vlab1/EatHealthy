import "./DishCreate.scss";
import React, {  useState, useContext } from "react";
import Input from "../../../layout/input/Input";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../../context/AuthContext";
import Button from "../../../layout/button/Button";
import TextArea from "../../../layout/textarea/TextArea";
import Uploader from "../../../layout/uploader/Uploader";
import { useHttp } from "../../../../hooks/http.hook";
import UploadFile from "../../../layout/uploadFile/UploadFile";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const DishCreate = () => {
  const { t } = useTranslation();
  const { request, loading } = useHttp();
  const { accessToken } = useContext(AuthContext);

  const [dishInformation, setDishInformation] = useState({
    name: "",
    description: {
      uk: "",
      en: "",
    },
    price: "",
    files: [],
    ingredients: [],
  });

  const changeHandlerGeneralInformation = (field, value, lng) => {
    if (field === "name") {
      setDishInformation((prevState) => ({
        ...dishInformation,
        [field]: value,
      }));
    } else if (field === "price") {

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

  const handleInputChangeDescription = (e, field, lng) => {
    const { value } = e.target;
    changeHandlerGeneralInformation(field, value, lng);
  };

  const createDishHandler = async () => {
    try {
      const files = dishInformation.files.map((item) => {
        return item.file;
      });

      await request(
        "/api/dish/create",
        "POST",
        {
          ...dishInformation,
        },
        {
          Authorization: `Bearer ${accessToken}`,
        },
        undefined,
        files
      );
      NotificationManager.success(t("Deleted"), t("Success"), 3000);
      if (dishInformation.files && dishInformation.files.length > 0) {
        window.location.reload();
      }
    } catch (e) {
      NotificationManager.error(t("Incorrect data"), t("Error"), 3000);
    }
  };

  return (
    <div className="dish-container-content-section">
      <div className="dish-container-content-section-container-with-rows">
        <div className="dish-container-content-section-header">
          <h1>{t("Create Dish")}</h1>
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
            <p>{t("Upload Images")}</p>
            <Uploader
              uploaded={dishInformation}
              setUploaded={setDishInformation}
            ></Uploader>
          </div>
          <div className="uploader-files">
            <p>{t("Upload Ingredients")}</p>

            <table className="table">
              <caption>
                {t("Example excel file for uploading ingredients / Uploaded ingredients")}
              </caption>
              <thead>
                <tr>
                  <th>name_en</th>
                  <th>name_uk</th>
                  <th>weight</th>
                </tr>
              </thead>
              {!(dishInformation?.ingredients &&
                dishInformation?.ingredients.length > 0) && <tbody>
                <tr>
                  <td>English name of the ingredient</td>
                  <td>English name of the ingredient</td>
                  <td>Вага</td>
                </tr>
                <tr>
                  <td>Українська назва інгредієнта</td>
                  <td>Українська назва інгредієнта</td>
                  <td>Weight</td>
                </tr>
              </tbody>}
              {(dishInformation?.ingredients &&
                dishInformation?.ingredients.length > 0) && (
                  <tbody>
                    {dishInformation.ingredients.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name?.en}</td>
                        <td>{item.name?.uk}</td>
                        <td>{item.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                )}
            </table>

            <UploadFile setUploaded={setDishInformation}></UploadFile>
          </div>
        </div>
        <div className="dish-container-content-section-container-rows-button">
          <Button
            content={t("Save")}
            action={"save"}
            onClick={createDishHandler}
            disabled={loading}
          ></Button>
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default DishCreate;
