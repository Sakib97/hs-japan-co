import { useState } from "react";
import ContactInfoComp from "../components/ContactInfoComp";
import ContactMapBDComp from "../components/ContactMapBDComp";
import ContactMapJPComp from "../components/ContactMapJPComp";
import EditModeToggleBtn from "../../../components/common/EditModeToggleBtn";
import { useAuth } from "../../../context/AuthProvider";
import styles from "../styles/ContactPage.module.css";

const ContactPage = () => {
  const { user, userMeta } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className={styles.contactPage}>
      {user && userMeta?.role === "admin" && (
        <EditModeToggleBtn
          isEditMode={isEditMode}
          onToggle={() => setIsEditMode((v) => !v)}
        />
      )}
      <ContactInfoComp isEditMode={isEditMode} />
      <ContactMapBDComp />
      <ContactMapJPComp />
    </div>
  );
};

export default ContactPage;
