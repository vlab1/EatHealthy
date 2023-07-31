import "./EatingPlaceProfile.scss";
import React, { useEffect, useState, useContext, useCallback } from "react";
import Input from "../../../layout/input/Input";
import { useTranslation } from "react-i18next";
import SelectInput from "../../../layout/select-input/SelectInput";
import DataPicker from "../../../layout/dataPicker/DataPicker";
import { AuthContext } from "../../../../context/AuthContext";
import Button from "../../../layout/button/Button";
import TextArea from "../../../layout/textarea/TextArea";
import Uploader from "../../../layout/uploader/Uploader";
import ImagesGallery from "../../../layout/imagesGallery/ImagesGallery";
import MyResponsiveBar from "../../../layout/barChart/BarChart";
import { useHttp } from "../../../../hooks/http.hook";
import Loader from "../../../layout/loader/Loader";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { Link } from "react-router-dom";

const EatingPlaceProfile = () => {
  const [activeSection, setActiveSection] = useState(null);
  const { user, accessToken } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const [views, setViews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  
  const formatStatistics = useCallback((array) => {
    function formatDate(date) {
      const [year, day, month] = date.split("-");
      if (i18n.language === "uk") {
        return `${day}.${month}.${year}`;
      } else {
        return `${month}-${day}-${year}`;
      }
    }
    array.forEach((item, index) => {
      array[index].date = formatDate(array[index].date);
    });
    return array;
  }, [i18n.language]);

  const fetchViews = useCallback(async () => {
    try {
      await request(
        `/api/eating-place/daily-views?_id=${
          user.profileId._id
        }&from=2023-05-17&to=${new Date().toISOString().split("T")[0]}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${accessToken}`,
        }
      ).then((res) => {
        setViews(formatStatistics(res.data));
        setIsLoading(false);
      });
    } catch (e) {}
  }, [request, accessToken, user, formatStatistics]);

  useEffect(() => {
    fetchViews();
  }, [fetchViews]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
        if (rect.top <= 0) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [contactInformation, setContactInformation] = useState({
    contactFirstName: user.profileId.contactFirstName || "",
    contactLastName: user.profileId.contactLastName || "",
    contactPatronymic: user.profileId.contactPatronymic || "",
    contactSex: user.profileId.contactSex || "",
    contactPhone: user.profileId.contactPhone || "",
    contactBirthDate:
      (user.profileId.contactBirthDate &&
        new Date(user.profileId.contactBirthDate)
          .toISOString()
          .split("T")[0]) ||
      new Date().toISOString().split("T")[0],
  });

  const [generalInformation, setGeneralInformation] = useState({
    name: user.profileId.name || "",
    description: {
      uk: user.profileId.description?.uk || "",
      en: user.profileId.description?.en || "",
    },
  });

  const [addressInformationEn, setAddressInformationEn] = useState({
    country: { en: user.profileId.country?.en || "" },
    region: { en: user.profileId.region?.en || "" },
    city: { en: user.profileId.city?.en || "" },
    address: { en: user.profileId.address?.en || "" },
    postcode: user.profileId.postcode || "",
  });

  const [addressInformationLocale, setAddressInformationLocale] = useState({
    country: { uk: user.profileId.country?.uk || "" },
    region: { uk: user.profileId.region?.uk || "" },
    city: { uk: user.profileId.city?.uk || "" },
    address: { uk: user.profileId.address?.uk || "" },
    postcode: user.profileId.postcode || "",
  });

  const [uploaded, setUploaded] = useState({
    images: user.profileId.images || [],
    files: [],
  });

  const changeHandlerContactInformation = (event) => {
    setContactInformation({
      ...contactInformation,
      [event.target.name]: event.target.value,
    });
  };

  const changeHandlerGeneralInformation = (field, value, lng) => {
    if (field === "name") {
      setGeneralInformation((prevState) => ({
        ...generalInformation,
        [field]: value,
      }));
    } else {
      setGeneralInformation((prevState) => ({
        ...generalInformation,
        [field]: {
          ...prevState[field],
          [lng]: value,
        },
      }));
    }
  };

  const changeHandleraddressInformationEn = (field, value) => {
    if (field === "postcode") {
      setAddressInformationEn((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    } else {
      setAddressInformationEn((prevState) => ({
        ...prevState,
        [field]: { en: value },
      }));
    }
  };

  const handleInputChangeDescription = (e, field, lng) => {
    const { value } = e.target;
    changeHandlerGeneralInformation(field, value, lng);
  };

  const changeHandleraddressInformationLocale = (field, value) => {
    if (field === "postcode") {
      setAddressInformationLocale((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    } else {
      setAddressInformationLocale((prevState) => ({
        ...prevState,
        [field]: { uk: value },
      }));
    }
  };

  const handleInputChangeAddressEn = (e, field) => {
    const { value } = e.target;
    changeHandleraddressInformationEn(field, value);
  };

  const handleInputChangeAddressLocale = (e, field) => {
    const { value } = e.target;
    changeHandleraddressInformationLocale(field, value);
  };

  const handleInputChangeImages = (item) => {
    setUploaded((prevState) => ({
      ...prevState,
      images: prevState.images.filter((image) => image !== item),
    }));
  };

  const updateHandler = async (body) => {
    body._id = user.profileId._id;
    try {
      await request(
        "/api/eating-place/update",
        "PUT",
        {
          ...body,
        },
        {
          Authorization: `Bearer ${accessToken}`,
        },
        undefined,
        body.files
      );

      NotificationManager.success(t("Saved"), t("Success"), 3000);
      if (body.files && body.files.length > 0) {
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
    <div className="subnavigation-eatingplace-container">
      <div className="subnavigation-container-content">
        <div className="subnavigation-container-content-header">
          <h1>{t("Eating Place Profile")}</h1>
        </div>

        <section
          id="general_information"
          className="subnavigation-container-content-section"
        >
          <div className="subnavigation-container-content-section-header">
            <h2>{t("General Information")}</h2>
          </div>
          <div className="subnavigation-container-content-section-container-with-rows">
            <div className="subnavigation-container-content-section-container-rows">
              <Input
                placeholder={t("Name")}
                label={t("Name")}
                type="text"
                id="name"
                name="name"
                value={generalInformation.name}
                onChange={(e) => handleInputChangeDescription(e, "name", "uk")}
              ></Input>
              <TextArea
                placeholder={t("Description (En)")}
                label={t("Description (En)")}
                type="text"
                id="description_en"
                name="description_en"
                value={generalInformation.description.en}
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
                value={generalInformation.description.uk}
                onChange={(e) =>
                  handleInputChangeDescription(e, "description", "uk")
                }
              ></TextArea>
            </div>
            <div className="subnavigation-container-content-section-container-rows-button">
              <Button
                content={t("Save")}
                action={"save"}
                onClick={() => {
                  updateHandler(generalInformation);
                }}
                disabled={loading}
              ></Button>
            </div>
          </div>
        </section>
        <section
          id="contact"
          className="subnavigation-container-content-section"
        >
          <div className="subnavigation-container-content-section-header">
            <h2>{t("Contact")}</h2>
          </div>

          <div className="subnavigation-container-content-section-container-with-columns">
            <div className="subnavigation-container-content-section-container-column">
              <Input
                placeholder={t("Contact First Name")}
                label={t("Contact First Name")}
                type="text"
                id="contactFirstName"
                name="contactFirstName"
                value={contactInformation.contactFirstName}
                onChange={changeHandlerContactInformation}
              ></Input>
              <Input
                placeholder={t("Contact Last Name")}
                label={t("Contact Last Name")}
                type="text"
                id="contactLastName"
                name="contactLastName"
                value={contactInformation.contactLastName}
                onChange={changeHandlerContactInformation}
              ></Input>
              <Input
                placeholder={t("Contact Patronymic")}
                label={t("Contact Patronymic")}
                type="text"
                id="contactPatronymic"
                name="contactPatronymic"
                value={contactInformation.contactPatronymic}
                onChange={changeHandlerContactInformation}
              ></Input>
            </div>
            <div className="subnavigation-container-content-section-container-column">
              <SelectInput
                options={[t("Male"), t("Female")]}
                optionName={"contactSex"}
                changeOption={changeHandlerContactInformation}
                defaultOption={t(user.profileId.contactSex) || t("Sex")}
                label={t("Contact Sex")}
              ></SelectInput>
              <Input
                placeholder={t("Contact Phone")}
                label={t("Contact Phone")}
                type="text"
                id="contactPhone"
                name="contactPhone"
                value={contactInformation.contactPhone}
                onChange={changeHandlerContactInformation}
              ></Input>
              <DataPicker
                label={t("Contact Birth Date")}
                name={"contactBirthDate"}
                id={"contactBirthDate"}
                value={contactInformation.contactBirthDate}
                onChange={changeHandlerContactInformation}
              ></DataPicker>
            </div>
            <div className="subnavigation-container-content-section-container-column button">
              <Button
                content={t("Save")}
                action={"save"}
                onClick={() => {
                  updateHandler(contactInformation);
                }}
                disabled={loading}
              ></Button>
            </div>
          </div>
        </section>
        <section
          id="addressEn"
          className="subnavigation-container-content-section"
        >
          {" "}
          <div className="subnavigation-container-content-section-header">
            <h2>{t("Address (En)")}</h2>
          </div>
          <div className="subnavigation-container-content-section-container-with-columns">
            <div className="subnavigation-container-content-section-container-column">
              <Input
                placeholder={t("Country")}
                label={t("Country")}
                type="text"
                id="country_en"
                name="country_en"
                value={addressInformationEn.country.en}
                onChange={(e) => handleInputChangeAddressEn(e, "country")}
              ></Input>
              <Input
                placeholder={t("Region")}
                label={t("Region")}
                type="text"
                id="region_en"
                name="region_en"
                value={addressInformationEn.region.en}
                onChange={(e) => handleInputChangeAddressEn(e, "region")}
              ></Input>
              <Input
                placeholder={t("City")}
                label={t("City")}
                type="text"
                id="city_en"
                name="city_en"
                value={addressInformationEn.city.en}
                onChange={(e) => handleInputChangeAddressEn(e, "city")}
              ></Input>
            </div>
            <div className="subnavigation-container-content-section-container-column">
              <Input
                placeholder={t("Address")}
                label={t("Address")}
                type="text"
                id="address_en"
                name="address_en"
                value={addressInformationEn.address.en}
                onChange={(e) => handleInputChangeAddressEn(e, "address")}
              ></Input>
              <Input
                placeholder={t("Postcode")}
                label={t("Postcode")}
                type="text"
                id="postcode_en"
                name="postcode_en"
                value={addressInformationEn.postcode}
                onChange={(e) => handleInputChangeAddressEn(e, "postcode")}
              ></Input>
            </div>
            <div className="subnavigation-container-content-section-container-column button">
              <Button
                content={t("Save")}
                action={"save"}
                onClick={() => {
                  updateHandler(addressInformationEn);
                }}
                disabled={loading}
              ></Button>
            </div>
          </div>
        </section>
        <section
          id="addressLocale"
          className="subnavigation-container-content-section"
        >
          <div className="subnavigation-container-content-section-header">
            <h2>{t("Address (Locale)")}</h2>
          </div>

          <div className="subnavigation-container-content-section-container-with-columns">
            <div className="subnavigation-container-content-section-container-column">
              <Input
                placeholder={t("Country")}
                label={t("Country")}
                type="text"
                id={`country_uk`}
                name={`country_uk`}
                value={addressInformationLocale.country.uk}
                onChange={(e) => handleInputChangeAddressLocale(e, "country")}
              ></Input>
              <Input
                placeholder={t("Region")}
                label={t("Region")}
                type="text"
                id={`region_uk`}
                name={`region_uk`}
                value={addressInformationLocale.region.uk}
                onChange={(e) => handleInputChangeAddressLocale(e, "region")}
              ></Input>
              <Input
                placeholder={t("City")}
                label={t("City")}
                type="text"
                id={`city_uk`}
                name={`city_uk`}
                value={addressInformationLocale.city.uk}
                onChange={(e) => handleInputChangeAddressLocale(e, "city")}
              ></Input>
            </div>
            <div className="subnavigation-container-content-section-container-column">
              <Input
                placeholder={t("Address")}
                label={t("Address")}
                type="text"
                id={`address_uk`}
                name={`address_uk`}
                value={addressInformationLocale.address.uk}
                onChange={(e) => handleInputChangeAddressLocale(e, "address")}
              ></Input>
              <Input
                placeholder={t("Postcode")}
                label={t("Postcode")}
                type="text"
                id={`postcode_uk`}
                name={`postcode_uk`}
                value={addressInformationLocale.postcode}
                onChange={(e) => handleInputChangeAddressLocale(e, "postcode")}
              ></Input>
            </div>
            <div className="subnavigation-container-content-section-container-column button">
              <Button
                content={t("Save")}
                action={"save"}
                onClick={() => {
                  updateHandler(addressInformationLocale);
                }}
                disabled={loading}
              ></Button>
            </div>
          </div>
        </section>
        <section
          id="images"
          className="subnavigation-container-content-section"
        >
          <div className="subnavigation-container-content-section-header">
            <h2>{t("Images")}</h2>
          </div>{" "}
          <div className="subnavigation-container-content-section-container-with-rows">
            <div className="subnavigation-container-content-section-container-rows">
              <ImagesGallery
                preview={uploaded.images}
                prefix={process.env.REACT_APP_SERVER_URL}
                onClick={handleInputChangeImages}
              />
            </div>
            {uploaded.images.length > 0 && (
              <div className="subnavigation-container-content-section-container-rows-button">
                <Button
                  content={t("Save")}
                  action={"save"}
                  onClick={() => {
                    updateHandler({ images: uploaded.images });
                  }}
                  disabled={loading}
                ></Button>
              </div>
            )}
          </div>
        </section>
        <section
          id="uploadImages"
          className="subnavigation-container-content-section"
        >
          <div className="subnavigation-container-content-section-header">
            <h2>{t("Upload Images")}</h2>
          </div>
          <div className="subnavigation-container-content-section-container-with-rows">
            <div className="subnavigation-container-content-section-container-rows">
              <Uploader
                uploaded={uploaded}
                setUploaded={setUploaded}
              ></Uploader>
            </div>
            {uploaded.files.length > 0 && (
              <div className="subnavigation-container-content-section-container-rows-button">
                <Button
                  content={t("Save")}
                  action={"save"}
                  onClick={() => {
                    updateHandler({
                      files: uploaded.files.map((item) => {
                        return item.file;
                      }),
                    });
                  }}
                  disabled={loading}
                ></Button>
              </div>
            )}
          </div>
        </section>
        <section
          id="statistics"
          className="subnavigation-container-content-section"
        >
          {" "}
          <div className="subnavigation-container-content-section-header">
            <h2>{t("Statistics")}</h2>
          </div>
          <div className="subnavigation-container-content-section-bar-chart">
            <MyResponsiveBar data={views}></MyResponsiveBar>
          </div>
        </section>
        <section
          id="myprofile"
          className="subnavigation-container-content-section"
        >
          {" "}
          <div className="subnavigation-container-content-section-header">
            <h2>{t("My Profile")}</h2>
          </div>
          <div className="subnavigation-container-content-section-text-content">
            <Link to={`/eatingplace/visit/${user.profileId._id}`}>
              <p>{t("Go to my profile")}</p>
            </Link>
          </div>
        </section>
      </div>
      <nav className="subnavigation-section-nav">
        <ol>
          <li
            className={activeSection === "general_information" ? "active" : ""}
          >
            <a href="#general_information">{t("General Information")}</a>
          </li>
          <li className={activeSection === "contact" ? "active" : ""}>
            <a href="#contact">{t("Contact")}</a>
          </li>
          <li className={activeSection === "addressEn" ? "active" : ""}>
            <a href="#addressEn">{t("Address (En)")}</a>
          </li>{" "}
          <li className={activeSection === "addressLocale" ? "active" : ""}>
            <a href="#addressLocale">{t("Address (Locale)")}</a>
          </li>
          <li className={activeSection === "images" ? "active" : ""}>
            <a href="#images">{t("Images")}</a>
          </li>
          <li className={activeSection === "uploadImages" ? "active" : ""}>
            <a href="#uploadImages">{t("Upload Images")}</a>
          </li>
          <li className={activeSection === "statistics" ? "active" : ""}>
            <a href="#statistics">{t("Statistics")}</a>
          </li>
          <li className={activeSection === "myprofile" ? "active" : ""}>
            <a href="#myprofile">{t("My Profile")}</a>
          </li>
        </ol>
      </nav>
      <NotificationContainer />
    </div>
  );
};

export default EatingPlaceProfile;
