import { useState, useCallback, useEffect } from "react";

const storageName = "accessToken";

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);

  const login = useCallback(async (jwtToken) => {
    setAccessToken(jwtToken);
    localStorage.setItem(storageName, JSON.stringify(jwtToken));
    try {
      const response = await fetch("/api/user", {
        method: "GET",
        body: null,
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const data = await response.json();
      setUser(data.data);
    } catch (error) {}
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/refresh-token/delete", {
        method: "DELETE",
        credentials: "include",
      });
      setAccessToken(null);
      localStorage.removeItem(storageName);
      setUser(null);
    } catch (error) {}
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = JSON.parse(localStorage.getItem(storageName));
      if (data) {
        await login(data);
      }
      setReady(true);
    };
  
    fetchData();
  }, [login]);
  

  return {
    login,
    logout,
    accessToken,
    ready,
    user, setUser
  };
};
