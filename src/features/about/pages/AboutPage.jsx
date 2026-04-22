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

const fetchAboutPageData = async () => {
  const { data, error } = await supabase.from("about_page").select("*");
  if (error) throw new Error(error.message);
  return data ?? [];
};

const AboutPage = () => {
  const { user, userMeta } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: aboutData = [], isLoading: aboutLoading } = useQuery({
    queryKey: ["about-page"],
    queryFn: fetchAboutPageData,
  });

  return (
    <div className={styles.page}>
      {aboutLoading ? (
        <div className={styles.loadingOverlay}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
        </div>
      ) : (
        <>
          {user && userMeta?.role === "admin" && (
            <EditModeToggleBtn
              isEditMode={isEditMode}
              onToggle={() => setIsEditMode(!isEditMode)}
            />
          )}
          {isEditMode && (
            <div className={styles.editGuideline}>
              <i className="fa-solid fa-circle-info" />
              <span>
                Max image size: <strong>2 MB</strong> &nbsp;|&nbsp; Preferred
                resolution: <strong> 400 × 400 px</strong>
              </span>
            </div>
          )}
          {/* Top section: sidebar + chairman/features */}
          <section className={styles.topSection}>
            <div className={styles.container}>
              <div className={styles.layout}>
                <aside className={styles.sidebar}>
                  <AcademicCoursesComp
                    isEditMode={isEditMode}
                    data={aboutData}
                    isLoading={aboutLoading}
                  />
                  {/* <OnlineCourseComp /> */}
                  <AdmissionProcessComp
                    isEditMode={isEditMode}
                    data={aboutData}
                    isLoading={aboutLoading}
                  />
                </aside>
                <div className={styles.mainContent}>
                  <ChairmanComp
                    isEditMode={isEditMode}
                    data={aboutData}
                    isLoading={aboutLoading}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Map section */}
          <MapComp />

          {/* Gallery section */}
          {/* <GalleryComp /> */}
        </>
      )}
    </div>
  );
};

export default AboutPage;
