import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./slices/settings.slice";
import controlReducer from "./slices/control.slice";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
};

const reducer = combineReducers({
  settings: settingsReducer,
  control: controlReducer
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});



export const persistor = persistStore(store);
