import styles from "../styles/AdmissionAboutComp.module.css";
import AdmissionSectionContent, {
  ADMISSION_DEFAULTS,
} from "./AdmissionSectionContent";
import AdmissionSectionSidebar from "./AdmissionSectionSidebar";
import { ADMISSION_SECTION_KEYS } from "../utils/admissionPageUtils";

const AdmissionAboutComp = ({ isEditMode, data }) => {
  const defaults = ADMISSION_DEFAULTS.about_academic;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <AdmissionSectionContent
            isEditMode={isEditMode}
            data={data}
            sectionKey={ADMISSION_SECTION_KEYS.ABOUT_ACADEMIC}
            defaults={defaults}
            styles={styles}
          />
          <AdmissionSectionSidebar
            isEditMode={isEditMode}
            data={data}
            sectionKey={ADMISSION_SECTION_KEYS.ABOUT_ACADEMIC}
            defaultTitle={defaults.sidebarTitle}
            defaultItems={defaults.sidebarItems}
            styles={styles}
          />
        </div>
      </div>
    </section>
  );
};

export default AdmissionAboutComp;
