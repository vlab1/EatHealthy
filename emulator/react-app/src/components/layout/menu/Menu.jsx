import React, { useState } from "react";
import "./Menu.scss";
import { NavLink } from "react-router-dom";
import Select from "../select/Select";
import { useTranslation } from "react-i18next";

const Menu = () => {
  const { t, i18n } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const [lineStyles, setLineStyles] = useState(undefined);

  const [menuStyles, setMenuStyles] = useState(undefined);

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

  const [languages, setLanguages] = useState(["uk", "en"]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
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
        <NavLink to="/control">
          <div
            className="menu-container-menu-menu-item first-child"
            onClick={toggleMenu}
          >
            {t("Control")}
          </div>
        </NavLink>
        <NavLink to="/send">
          <div className="menu-container-menu-menu-item" onClick={toggleMenu}>
            {t("Send")}
          </div>
        </NavLink>
        <NavLink to="/settings">
          <div className="menu-container-menu-menu-item" onClick={toggleMenu}>
            {t("Settings")}
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
      </div>
    </div>
  );
};

export default Menu;
