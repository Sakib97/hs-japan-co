import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NavigationBar from "./components/layout/NavigationBar.jsx";
import { BrowserRouter } from "react-router-dom";
import HomePage from "./features/home/pages/HomePage.jsx";

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <HomePage></HomePage>
    </BrowserRouter>
  );
}

export default App;
