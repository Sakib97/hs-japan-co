import styles from "../styles/AboutPage.module.css";
import AcademicCoursesComp from "../components/AcademicCoursesComp";
import ChairmanComp from "../components/ChairmanComp";
import OnlineCourseComp from "../components/OnlineCourseComp";
import AdmissionProcessComp from "../components/AdmissionProcessComp";
import MapComp from "../components/MapComp";
import GalleryComp from "../components/GalleryComp";

const AboutPage = () => {
  return (
    <div className={styles.page}>
      {/* Top section: sidebar + chairman/features */}
      <section className={styles.topSection}>
        <div className={styles.container}>
          <div className={styles.layout}>
            <aside className={styles.sidebar}>
              <AcademicCoursesComp />
              <OnlineCourseComp />
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
      <GalleryComp />
    </div>
  );
};

export default AboutPage;
