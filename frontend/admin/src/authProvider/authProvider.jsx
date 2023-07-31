export const authProvider = {
  login: async ({ email, password }) => {
    const loginRequest = new Request(
      `${process.env.REACT_APP_URL}api/admin/login`,
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "include",
      }
    );
    try {
      const loginResponse = await fetch(loginRequest);

      if (loginResponse.status < 200 || loginResponse.status >= 300) {
        throw new Error(loginResponse.statusText);
      }
      const { data } = await loginResponse.json();

      const refreshTokenRequest = new Request(
        `${process.env.REACT_APP_URL}api/refresh-token/create`,
        {
          method: "POST",
          body: null,
          headers: new Headers({ Authorization: `Bearer ${data}` }),
          credentials: "include",
        }
      );

      const refreshTokenResponse = await fetch(refreshTokenRequest);

      if (
        refreshTokenResponse.status < 200 ||
        refreshTokenResponse.status >= 300
      ) {
        throw new Error(refreshTokenResponse.statusText);
      }

      localStorage.setItem("accessToken", data);
    } catch (error) {
      throw new Error("Network error");
    }
  },

  logout: async () => {
    const request = new Request(
      `${process.env.REACT_APP_URL}api/refresh-token/delete`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    try {
      localStorage.removeItem("accessToken");
      await fetch(request);
      return Promise.resolve();
    } catch (error) {
      throw new Error("Network error");
    }
  },

  checkError: async ({ status, message }) => {
    const request = new Request(
      `${process.env.REACT_APP_URL}api/refresh-token/refresh`,
      {
        method: "GET",
        body: null,
        headers: {},
        credentials: "include",
      }
    );
    try {
      if (status === 401 && message === "Unauthorised") {
        const refreshTokenResponse = await fetch(request);
        if (refreshTokenResponse.ok) {
          const refreshTokenResponseJson = await refreshTokenResponse.json();
          localStorage.setItem("accessToken", refreshTokenResponseJson.data);
        } else {
          throw new Error("Network error");
        }
      }
    } catch (error) {     
      throw new Error("Network error");
    }
  },


  checkAuth: async () => {
    const request = new Request(`${process.env.REACT_APP_URL}api/admin`, {
      method: "GET",
      body: null,
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      }),
    });
  
    try {
      const response = await fetch(request);
  
      if (!response.ok) {
        if (response.status === 401) {
          const refreshRequest = new Request(
            `${process.env.REACT_APP_URL}api/refresh-token/refresh`,
            {
              method: "GET",
              body: null,
              headers: {},
              credentials: "include",
            }
          );
          const refreshResponse = await fetch(refreshRequest);
  
          if (refreshResponse.ok) {
            const refreshTokenResponseJson = await refreshResponse.json();
            localStorage.setItem("accessToken", refreshTokenResponseJson.data);
            return authProvider.checkAuth();
          } else {
            throw new Error("Network error");
          }
        } else {
          throw new Error("Network error");
        }
      }
    } catch (error) {
      throw new Error("Network error");
    }
  },

  getIdentity: async () => {
    const request = new Request(`${process.env.REACT_APP_URL}api/admin`, {
      method: "GET",
      body: null,
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      }),
    });
  
    try {
      const response = await fetch(request);
      const data = await response.json();
  
      if (!response.ok) {
        if (response.status === 401) {
          const refreshRequest = new Request(
            `${process.env.REACT_APP_URL}api/refresh-token/refresh`,
            {
              method: "GET",
              body: null,
              headers: {},
              credentials: "include",
            }
          );
          const refreshResponse = await fetch(refreshRequest);
  
          if (refreshResponse.ok) {
            const refreshTokenResponseJson = await refreshResponse.json();
            localStorage.setItem("accessToken", refreshTokenResponseJson.data);
            // Повторный запрос с новым accessToken
            return authProvider.getIdentity();
          } else {
            throw new Error("Network error");
          }
        } else {
          throw new Error(data.message || "Something went wrong");
        }
      }
  
      return data;
    } catch (error) {
      throw new Error("Network error");
    }
  },

  getPermissions: async () => {
    const request = new Request(`${process.env.REACT_APP_URL}api/admin`, {
      method: "GET",
      body: null,
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      }),
    });

    try {
      const response = await fetch(request);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
 
      throw new Error("Network error");
    }
  },
};
