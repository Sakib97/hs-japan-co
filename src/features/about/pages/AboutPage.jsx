import styles from "../styles/AboutPage.module.css";
import AcademicCoursesComp from "../components/AcademicCoursesComp";
import ChairmanComp from "../components/ChairmanComp";
import OnlineCourseComp from "../components/OnlineCourseComp";
import AdmissionProcessComp from "../components/AdmissionProcessComp";
import MapComp from "../components/MapComp";
import GalleryComp from "../components/GalleryComp";
import { Spin } from "antd";
import { supabase } from "../../../config/supabaseClient";
import { showToast } from "../../../components/layout/CustomToast";
import { useAuth } from "../../../context/AuthProvider";
import { LoadingOutlined } from "@ant-design/icons";
import EditModeToggleBtn from "../../../components/common/EditModeToggleBtn";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const AboutPage = () => {
  const { user, userMeta } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className={styles.page}>
      {user && userMeta?.role === "admin" && (
        <EditModeToggleBtn
          isEditMode={isEditMode}
          onToggle={() => setIsEditMode(!isEditMode)}
        />
      )}
      {/* Top section: sidebar + chairman/features */}
      <section className={styles.topSection}>
        <div className={styles.container}>
          <div className={styles.layout}>
            <aside className={styles.sidebar}>
              <AcademicCoursesComp />
              {/* <OnlineCourseComp /> */}
              <AdmissionProcessComp />
            </aside>
            <div className={styles.mainContent}>
              <ChairmanComp />
            </div>
          </div>
        </div>
      </section>

      {/* Map section */}
      <MapComp />

      {/* Gallery section */}
      {/* <GalleryComp /> */}
    </div>
  );
};

export default AboutPage;
