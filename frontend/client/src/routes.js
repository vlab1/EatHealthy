import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Authentication from "./components/pages/authentication/Authentication";
import Main from "./components/pages/main/Main.jsx";
import Success from "./components/pages/payment/Success.jsx";
import Canceled from "./components/pages/payment/Canceled.jsx";
import Subscription from "./components/pages/subscription/Subscription";
import DietitianProfile from "./components/pages/profiles/dietitian/DietitianProfile";
import EatingPlaceProfile from "./components/pages/profiles/eatingPlace/EatingPlaceProfile";
import Patient from "./components/pages/patient/Patient";
import AppoinmentsList from "./components/pages/appoinments/appoinmentsList/AppoinmentsList";
import AppoinmentCreate from "./components/pages/appoinments/appoinmentCreate/AppoinmentCreate";
import AppoinmentUpdate from "./components/pages/appoinments/appoinmentUpdate/AppoinmentUpdate";
import DishesList from "./components/pages/dishes/dishesList/DishesList";
import DishCreate from "./components/pages/dishes/dishCreate/DishCreate";
import DishUpdate from "./components/pages/dishes/dishUpdate/DishUpdate";
import Settings from "./components/pages/settings/Settings";
import EatingPlaceVisit from "./components/pages/eatingPlaceVisit/EatingPlaceVisit";
import DishVisit from "./components/pages/dishes/dishVisit/DishVisit";
import GroupedDishes from "./components/pages/dishes/groupedDishes/GroupedDishes";
import DishesFilterList from "./components/pages/dishes/dishesFilterList/DishesFilterList";
import AllPatientAppoinments from "./components/pages/appoinments/allPatientAppoinments/AllPatientAppoinments";

export const useRoutes = (user) => {
  const isAuthenticated = user;
  const isProfileExists = user?.profileId;
  const isEatingPlace = user?.profileModel === "EatingPlaces";
  const isDietitian = user?.profileModel === "Dietitians";

  return (
    <Routes>
      <Route path="/*" element={<Navigate replace to="/main" />} />
      <Route path="/main" exact element={<Main />} />

      {!isProfileExists && (
        <Route path="/subscription" exact element={<Subscription />} />
      )}

      {isAuthenticated && (
        <Route path="/canceled/:key/:product" exact element={<Canceled />} />
      )}
      {isAuthenticated && (
        <Route path="/success/:key/:product" exact element={<Success />} />
      )}
      {isAuthenticated && (
        <Route path="/settings" exact element={<Settings />} />
      )}
      {isAuthenticated && (
        <Route
          path="/eatingplace/visit/:id"
          exact
          element={<EatingPlaceVisit />}
        />
      )}

      {!isAuthenticated && (
        <Route path="/authentication" exact element={<Authentication />} />
      )}

      {isProfileExists && isEatingPlace && (
        <Route
          path="/profile/eatingplace"
          exact
          element={<EatingPlaceProfile />}
        />
      )}
      {isProfileExists && isEatingPlace && (
        <Route path="/dishes" exact element={<DishesList />} />
      )}
      {isProfileExists && isEatingPlace && (
        <Route path="/dish/create" exact element={<DishCreate />} />
      )}
      {isProfileExists && isEatingPlace && (
        <Route path="/dish/update/:id" exact element={<DishUpdate />} />
      )}

      {isProfileExists && isDietitian && (
        <Route path="/profile/dietitian" exact element={<DietitianProfile />} />
      )}
      {isProfileExists && isDietitian && (
        <Route path="/dishes/filter" exact element={<DishesFilterList />} />
      )}
      {isProfileExists && isDietitian && (
        <Route path="/appoinments" exact element={<AppoinmentsList />} />
      )}
      {isProfileExists && isDietitian && (
        <Route
          path="/patient/appoinments/:patientId"
          exact
          element={<AllPatientAppoinments />}
        />
      )}
      {isProfileExists && isDietitian && (
        <Route path="/dish/visit/:id" exact element={<DishVisit />} />
      )}
      {isProfileExists && isDietitian && (
        <Route path="/dish/grouped" exact element={<GroupedDishes />} />
      )}
      {isProfileExists && isDietitian && (
        <Route path="/patient/:id" exact element={<Patient />} />
      )}
      {isProfileExists && isDietitian && (
        <Route path="/appoinment/create" exact element={<AppoinmentCreate />} />
      )}
      {isProfileExists && isDietitian && (
        <Route
          path="/appoinment/update/:id"
          exact
          element={<AppoinmentUpdate />}
        />
      )}
    </Routes>
  );
};
