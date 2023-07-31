import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = useContext(AuthContext);

  const request = useCallback(
    async (
      url,
      method = "GET",
      body = null,
      headers = {},
      credentials = "same-origin",
      files = undefined
    ) => {
      setLoading(true);
      try {      
        if (body && !files) {
          body = JSON.stringify(body);
          headers["Content-Type"] = "application/json";
        }
        let formData = undefined;
        if (files) {
          if (body) {
            const { files, ...newObject } = JSON.parse(JSON.stringify(body));
   
            formData = new FormData();
            for (let key in newObject) {
              formData.append(key, JSON.stringify(newObject[key]));
            }
          }
          if (files) {
            for (let i = 0; i < files.length; i++) {
              formData.append("files", files[i]);
            }
          }
          body = formData;
        }

        let response = await fetch(url, {
          method,
          body,
          headers,
          credentials,
        });

        let data = await response.json();

        if (data.status === 401 && data.message === "Unauthorised") {
          const refreshTokenResponse = await fetch(
            "/api/refresh-token/refresh",
            {
              method: "GET",
              body: null,
              headers: {},
              credentials: "include",
            }
          );
          if (refreshTokenResponse.ok) {
            const refreshTokenResponseJson = await refreshTokenResponse.json();
            auth.login(refreshTokenResponseJson.data);
            headers.Authorization = `Bearer ${refreshTokenResponseJson.data}`;
            response = await fetch(url, {
              method,
              body,
              headers,
              credentials,
            });
            data = await response.json();
          } else {
            auth.logout();
          }
        }

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        setLoading(false);

        return data;
      } catch (e) {
        setLoading(false);
        console.log(e.message);
        setError(e.message);
        throw e;
      }
    },
    [auth]
  );

  const clearError = useCallback(() => setError(null), []);
  return { loading, request, error, clearError };
};
