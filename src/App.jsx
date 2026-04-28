import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useState } from "react";
import NavigationBar from "./components/layout/NavigationBar.jsx";
import SplashScreen from "./components/layout/SplashScreen.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import ScrollToTopOnNav from "./components/common/ScrollToTopOnNav.jsx";
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
import DashboardPage from "./features/dashboard/pages/DashboardPage.jsx";
import StudentManagementPage from "./features/dashboard/pages/StudentManagementPage.jsx";
import CourseManagementPage from "./features/dashboard/pages/CourseManagementPage.jsx";
import EmployeeManagementPage from "./features/dashboard/pages/EmployeeManagementPage.jsx";
import FinancesPage from "./features/dashboard/pages/FinancesPage.jsx";
import ProfilePage from "./features/dashboard/pages/ProfilePage.jsx";
import { Toaster } from "react-hot-toast";
import SetupPassword from "./features/auth/pages/SetupPassword.jsx";
import AuthRedirect from "./components/common/AuthRedirect.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import NotFound from "./components/common/NotFound.jsx";
import AdminOnlyRoute from "./components/common/AdminOnlyRoute.jsx";
import StudentOnlyRoute from "./components/common/StudentOnlyRoute.jsx";
import AssetsManagementPage from "./features/dashboard/pages/AssetsManagementPage.jsx";
import CourseDetailsPage from "./features/CourseDetails/pages/CourseDetailsPage.jsx";
import MyCoursesPage from "./features/dashboard/pages/MyCoursesPage.jsx";
import MyFinancesPage from "./features/dashboard/pages/MyFinancesPage.jsx";

const SPLASH_KEY = "hs_japan_splash_shown";

function App() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem(SPLASH_KEY),
  );

  const handleSplashDone = () => {
    sessionStorage.setItem(SPLASH_KEY, "true");
    setShowSplash(false);
  };

  return (
    <BrowserRouter>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      <ScrollToTopOnNav />
      <NavigationBar />
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admission" element={<AdmissionPage />} />
        <Route path="/online-admission" element={<OnlineAdmissionPage />} />
        <Route path="/why-japan" element={<WhyJapanPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/courses/:id" element={<CourseDetailsPage />} />
        <Route
          path="/auth/signin"
          element={
            <AuthRedirect>
              <LoginPage />
            </AuthRedirect>
          }
        />
        {/* <Route path="/auth/register" element={<AuthRedirect><RegisterPage /></AuthRedirect>} /> */}
        <Route
          path="/auth/setup-password"
          element={
            <AuthRedirect>
              <SetupPassword />
            </AuthRedirect>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfilePage />} />
          <Route
            path="student-management"
            element={<StudentManagementPage />}
          />
          <Route path="course-management" element={<CourseManagementPage />} />
          <Route
            path="employee-management"
            element={
              <AdminOnlyRoute>
                <EmployeeManagementPage />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="finances"
            element={
              // <AdminOnlyRoute>
                <FinancesPage />
              // </AdminOnlyRoute>
            }
          />
          <Route
            path="assets-management"
            element={
              <AdminOnlyRoute>
                <AssetsManagementPage />
              </AdminOnlyRoute>
            }
          />

          <Route
            path="my-courses"
            element={
              <StudentOnlyRoute>
                <MyCoursesPage />
              </StudentOnlyRoute>
            }
          />

          <Route
            path="my-finances"
            element={
              <StudentOnlyRoute>
                <MyFinancesPage />
              </StudentOnlyRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
        <Route path="/404" element={<NotFound />} />
      </Routes>
      <ScrollToTop />
      <FooterComp />
    </BrowserRouter>
  );
}

export default App;
