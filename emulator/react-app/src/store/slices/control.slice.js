import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalCholesterol: 0,
  hdlCholesterol: 0,
  vldlCholesterol: 0,
  ldlCholesterol: 0,
  warnings: [],
  date: new Date().toISOString(),
};

const controlSlice = createSlice({
  name: "control",
  initialState,
  reducers: {
    setAllValues: (state, action) => {
      const numericPayload = Object.entries(action.payload).reduce(
        (acc, [key, value]) => {
          if (key !== "date" && key !== "warnings") {
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
    reset: () => initialState,
  },
});

export const { setAllValues, reset } = controlSlice.actions;

export default controlSlice.reducer;
