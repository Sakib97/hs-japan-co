import styles from "../styles/AdmissionSchoolComp.module.css";
import AdmissionSectionContent, {
  ADMISSION_DEFAULTS,
} from "./AdmissionSectionContent";
import AdmissionSectionSidebar from "./AdmissionSectionSidebar";
import { ADMISSION_SECTION_KEYS } from "../utils/admissionPageUtils";

const AdmissionSchoolComp = ({ isEditMode, data }) => {
  const defaults = ADMISSION_DEFAULTS.language_school;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <AdmissionSectionContent
            isEditMode={isEditMode}
            data={data}
            sectionKey={ADMISSION_SECTION_KEYS.LANGUAGE_SCHOOL}
            defaults={defaults}
            styles={styles}
          />
          <AdmissionSectionSidebar
            isEditMode={isEditMode}
            data={data}
            sectionKey={ADMISSION_SECTION_KEYS.LANGUAGE_SCHOOL}
            defaultTitle={defaults.sidebarTitle}
            defaultItems={defaults.sidebarItems}
            styles={styles}
          />
        </div>
      </div>
    </section>
  );
};

export default AdmissionSchoolComp;
