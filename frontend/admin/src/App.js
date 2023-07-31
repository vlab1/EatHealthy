import { React } from "react";
import { Admin } from "react-admin";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/login/Login";
import { authProvider } from "./authProvider/authProvider";
import { Resource } from "react-admin";
import user from "./components/user";
import { dataProvider } from "./dataProvider/dataProvider";
import patient from "./components/patient";
import dietitian from "./components/dietitian";
import eatingPlace from "./components/eatingPlace";
import polyglotI18nProvider from "ra-i18n-polyglot";
import en from "ra-language-english";
import ukrainianMessages from "ra-language-ukrainian";
import "./App.css";
import myEnTranslations from "./i18n/en";
import myUkTranslations from "./i18n/uk";
import { useTranslate } from "react-admin";
const translations = {
  en: { ...en, ...myEnTranslations },
  uk: { ...ukrainianMessages, ...myUkTranslations },
};

const i18nProvider = polyglotI18nProvider(
  (locale) => {
    return translations[locale];
  },
  "en",
  [
    { locale: "en", name: "English" },
    { locale: "uk", name: "Ukrainian" },
  ]
);

const App = () => {
  const t = useTranslate();
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      dashboard={Dashboard}
      loginPage={Login}
    >
      <Resource name="user" {...user} options={{ label: t("users") }}/>
      <Resource name="patient" {...patient}options={{ label: t("patients") }}/>
      <Resource name="dietitian" {...dietitian} options={{ label: t("dietitians") }}/>
      <Resource name="eating-place" {...eatingPlace} options={{ label: t("eatingPlaces") }}/>
    </Admin>
  );
};

export default App;
