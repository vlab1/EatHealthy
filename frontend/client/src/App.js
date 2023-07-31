import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { useRoutes } from "./routes";
import Menu from "./components/layout/menu/Menu";
import Loader from "./components/layout/loader/Loader.jsx";
import { useAuth } from "./hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";
import Banner from "./components/layout/banner/Banner";

function App() {
  const { accessToken, login, logout, ready, user, setUser } = useAuth();
  const routes = useRoutes(user);

  if (!ready) {
    return <Loader />;
  }
  return (
    <AuthContext.Provider
      value={{
        accessToken,
        login,
        logout,
        user,
        setUser,
      }}
    >
      <BrowserRouter>
        <Banner />
        <Menu></Menu>
        <div className="page">{routes}</div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
