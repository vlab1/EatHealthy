import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Send from "./components/pages/send/Send";
import Settings from "./components/pages/settings/Settings";
import Control from "./components/pages/control/Control";

export const useRoutes = () => {
  return (
    <Routes>
      <Route path="/control" exact element={<Control />} />
      <Route path="/settings" exact element={<Settings />} />
      <Route path="/send" exact element={<Send />} />
      <Route path="/*" element={<Navigate replace to="/control" />} />
    </Routes>
  );
};
