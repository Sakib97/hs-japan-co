import styles from "../styles/OnlineAdmissionPage.module.css";
import OnlineAdmBannerComp from "../components/OnlineAdmBannerComp";
import CourseInfoComp from "../components/CourseInfoComp";
import EnquiryFormComp from "../components/EnquiryFormComp";

const OnlineAdmissionPage = () => {
  return (
    <div className={styles.page}>
      <OnlineAdmBannerComp />
      <div className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.twoCol}>
            <CourseInfoComp />
            <EnquiryFormComp />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineAdmissionPage;
