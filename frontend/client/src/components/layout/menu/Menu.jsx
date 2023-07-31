import React, { useState, useContext } from "react";
import "./Menu.scss";
import { NavLink } from "react-router-dom";
import Select from "../select/Select";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../context/AuthContext";

const Menu = () => {
  const { t, i18n } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const [lineStyles, setLineStyles] = useState(undefined);

  const [menuStyles, setMenuStyles] = useState(undefined);

  const [languages] = useState(["uk", "en"]);

  const { user, logout } = useContext(AuthContext);

  const closeMenu = () => {
    setMenuStyles({ left: "-320px" });
    setLineStyles({ background: "#373a47" });
    setIsOpen(false);
  };

  const openMenu = () => {
    setMenuStyles({ left: "0px" });
    setLineStyles({ background: "#FFF" });
    setIsOpen(true);
  };

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const UserProfileOptions = () => {
    if (user?.profileModel === "Dietitians") {
      return (
        <>
          <NavLink to="/main">
            <div
              className="menu-container-menu-menu-item first-child"
              onClick={toggleMenu}
            >
              {t("Main")}
            </div>
          </NavLink>
          <NavLink to="/appoinments">
            <div className="menu-container-menu-menu-item" onClick={toggleMenu}>
              {t("Appoinments")}
            </div>
          </NavLink>
          <NavLink to="/appoinment/create">
            <div className="menu-container-menu-menu-item" onClick={toggleMenu}>
              {t("Appoinment create")}
            </div>
          </NavLink>
          <NavLink to="/dish/grouped">
            <div className="menu-container-menu-menu-item" onClick={toggleMenu}>
              {t("Allowed dish")}
            </div>
          </NavLink>
          <NavLink to="/dishes/filter">
            <div className="menu-container-menu-menu-item" onClick={toggleMenu}>
              {t("Dishes search")}
            </div>
          </NavLink>
          <NavLink to={`/profile/dietitian`}>
            <div className="menu-container-menu-menu-item" onClick={toggleMenu}>
              {t("Profile")}
            </div>
          </NavLink>
          <NavLink to={`/settings`}>
            <div className="menu-container-menu-menu-item" onClick={toggleMenu}>
              {t("Settings")}
            </div>
          </NavLink>
          <NavLink>
            <div className="menu-container-menu-menu-item" onClick={logout}>
              {t("Logout")}
            </div>
          </NavLink>
          <div className="menu-container-menu-menu-item-select">
            <Select
              options={languages}
              optionsNames="lang"
              changeOption={changeLanguage}
              defaultOption={
                i18n.language ? i18n.language.toUpperCase() : "Select Language"
              }
            ></Select>
          </div>
        </>
      );
    }

    if (user?.profileModel === "EatingPlaces") {
      return (
        <>
          {" "}
          <NavLink to="/main">
            <div
              className="menu-container-menu-menu-item first-child"
              onClick={toggleMenu}
            >
              {t("Main")}
            </div>
          </NavLink>
          <NavLink to="/dishes">
            <div className="menu-container-menu-menu-item" onClick={toggleMenu}>
              {t("Dishes")}
            </div>
          </NavLink>
          <NavLink to={`/profile/eatingplace`}>
            <div className="menu-container-menu-menu-item" onClick={toggleMenu}>
              {t("Profile")}
            </div>
          </NavLink>
          <NavLink to={`/settings`}>
            <div className="menu-container-menu-menu-item" onClick={toggleMenu}>
              {t("Settings")}
            </div>
          </NavLink>
          <NavLink>
            <div className="menu-container-menu-menu-item" onClick={logout}>
              {t("Logout")}
            </div>
          </NavLink>
          <div className="menu-container-menu-menu-item-select">
            <Select
              options={languages}
              optionsNames="lang"
              changeOption={changeLanguage}
              defaultOption={
                i18n.language ? i18n.language.toUpperCase() : "Select Language"
              }
            ></Select>
          </div>
        </>
      );
    }

    if (user) {
      return (
        <>
          {" "}
          <NavLink to="/main">
            <div
              className="menu-container-menu-menu-item first-child"
              onClick={toggleMenu}
            >
              {t("Main")}
            </div>
          </NavLink>
          <NavLink to="/subscription">
            <div className="menu-container-menu-menu-item" onClick={toggleMenu}>
              {t("Subscription")}
            </div>
          </NavLink>
          <NavLink to={`/settings`}>
            <div className="menu-container-menu-menu-item" onClick={toggleMenu}>
              {t("Settings")}
            </div>
          </NavLink>
          <NavLink>
            <div className="menu-container-menu-menu-item" onClick={logout}>
              {t("Logout")}
            </div>
          </NavLink>
          <div className="menu-container-menu-menu-item-select">
            <Select
              options={languages}
              optionsNames="lang"
              changeOption={changeLanguage}
              defaultOption={
                i18n.language ? i18n.language.toUpperCase() : "Select Language"
              }
            ></Select>
          </div>
        </>
      );
    }

    return (
      <>
        <NavLink to="/main">
          <div
            className="menu-container-menu-menu-item first-child"
            onClick={toggleMenu}
          >
            {t("Main")}
          </div>
        </NavLink>
        <NavLink to="/subscription">
          <div className="menu-container-menu-menu-item" onClick={toggleMenu}>
            {t("Subscription")}
          </div>
        </NavLink>
        <NavLink to="/authentication">
          <div className="menu-container-menu-menu-item" onClick={toggleMenu}>
            {t("Authentication")}
          </div>
        </NavLink>
        <div className="menu-container-menu-menu-item-select">
          <Select
            options={languages}
            optionsNames="lang"
            changeOption={changeLanguage}
            defaultOption={
              i18n.language ? i18n.language.toUpperCase() : "Select Language"
            }
          ></Select>
        </div>
      </>
    );
  };

  return (
    <div className="menu-container">
      <div
        className="menu-container-hamburger"
        onClick={toggleMenu}
        onMouseEnter={openMenu}
      >
        <div className="menu-container-hamburger-line" style={lineStyles}></div>
        <div className="menu-container-hamburger-line" style={lineStyles}></div>
        <div className="menu-container-hamburger-line" style={lineStyles}></div>
      </div>
      <div
        className="menu-container-menu"
        style={menuStyles}
        onMouseLeave={closeMenu}
      >
        <UserProfileOptions />
      </div>
    </div>
  );
};

export default Menu;
