import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NavigationBar from "./components/layout/NavigationBar.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import HomePage from "./features/home/pages/HomePage.jsx";
import AboutPage from "./features/about/pages/AboutPage.jsx";
import AdmissionPage from "./features/admission/pages/AdmissionPage.jsx";
import OnlineAdmissionPage from "./features/onlineAdmission/pages/OnlineAdmissionPage.jsx";
import WhyJapanPage from "./features/whyJapan/pages/WhyJapanPage.jsx";
import GalleryPage from "./features/gallery/pages/GalleryPage.jsx";
import TeamPage from "./features/team/pages/TeamPage.jsx";
import ContactPage from "./features/contact/pages/ContactPage.jsx";
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import RegisterPage from "./features/auth/pages/RegisterPage.jsx";
import FooterComp from "./features/home/components/FooterComp.jsx";

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admission" element={<AdmissionPage />} />
        <Route path="/online-admission" element={<OnlineAdmissionPage />} />
        <Route path="/why-japan" element={<WhyJapanPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/auth/signin" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
      </Routes>
      <ScrollToTop />
      <FooterComp />
    </BrowserRouter>
  );
}

export default App;
