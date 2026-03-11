import styles from "../styles/AdmissionPage.module.css";
import AdmissionBannerComp from "../components/AdmissionBannerComp";
import AdmissionAboutComp from "../components/AdmissionAboutComp";
import AdmissionSchoolComp from "../components/AdmissionSchoolComp";
import AdmissionSSWComp from "../components/AdmissionSSWComp";
import SubscribeComp from "../components/SubscribeComp";

const AdmissionPage = () => {
  return (
    <div className={styles.page}>
      <AdmissionBannerComp />
      <div style={{ textAlign: "center", padding: "50px 20px 0" }}>
        <h2 className={styles.sectionHeading}>
          Student Admission &amp; SSW Job Placement
        </h2>
      </div>
      <AdmissionAboutComp />
      <hr className={styles.divider} />
      <AdmissionSchoolComp />
      <hr className={styles.divider} />
      <AdmissionSSWComp />
      <SubscribeComp />
    </div>
  );
};

export default AdmissionPage;
