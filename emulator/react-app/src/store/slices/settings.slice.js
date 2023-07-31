import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    totalCholesterolMin: 0,
    totalCholesterolMax: 0,
    hdlCholesterolMin: 0,
    hdlCholesterolMax: 0,
    vldlCholesterolMin: 0,
    vldlCholesterolMax: 0,
    ldlCholesterolMin: 0,
    ldlCholesterolMax: 0,
    apiKey: "",
  },
  reducers: {
    setAllValues: (state, action) => {
      const numericPayload = Object.entries(action.payload).reduce(
        (acc, [key, value]) => {
          if (key !== "apiKey") {
            acc[key] = Number(value);
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );
      return {
        ...state,
        ...numericPayload,
      };
    },
  },
});

export const { setAllValues } = settingsSlice.actions;

export default settingsSlice.reducer;
