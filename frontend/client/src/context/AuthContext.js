import { createContext } from "react";

function noop() {}

export const AuthContext = createContext({
  accessToken: null,
  login: noop,
  logout: noop,
  user: null,
  setUser: noop
});
