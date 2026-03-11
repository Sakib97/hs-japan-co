import ContactInfoComp from "../components/ContactInfoComp";
import ContactMapBDComp from "../components/ContactMapBDComp";
import ContactMapJPComp from "../components/ContactMapJPComp";
import styles from "../styles/ContactPage.module.css";

const ContactPage = () => {
  return (
    <div className={styles.contactPage}>
      <ContactInfoComp />
      <ContactMapBDComp />
      <ContactMapJPComp />
    </div>
  );
};

export default ContactPage;
