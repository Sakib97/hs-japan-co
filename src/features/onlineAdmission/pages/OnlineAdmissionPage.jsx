import styles from "../styles/OnlineAdmissionPage.module.css";
import OnlineAdmBannerComp from "../components/OnlineAdmBannerComp";
import CourseInfoComp from "../components/CourseInfoComp";
import EnquiryFormComp from "../components/EnquiryFormComp";

const OnlineAdmissionPage = () => {
  return (
    <div className={styles.page}>
      <OnlineAdmBannerComp />
      <CourseInfoComp />
      <EnquiryFormComp />
    </div>
  );
};

export default OnlineAdmissionPage;
