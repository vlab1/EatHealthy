import "./App.css";
import { HashRouter, BrowserRouter } from "react-router-dom";
import { useRoutes } from "./routes";
import Menu from "./components/layout/menu/Menu";

function App() {
  const routes = useRoutes();

  return (
    <BrowserRouter>
      <Menu></Menu>
      <div className="page">{routes}</div>
    </BrowserRouter>
  );
}

export default App;
