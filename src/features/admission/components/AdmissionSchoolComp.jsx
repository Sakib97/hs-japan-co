import styles from "../styles/AdmissionSchoolComp.module.css";

const resources = [
  { icon: "fa-solid fa-torii-gate", label: "Access to Japanese Market" },
  { icon: "fa-solid fa-hotel", label: "Tourism and Hospitality" },
  {
    icon: "fa-solid fa-language",
    label: "Translation and Interpretation Services",
  },
];

const AdmissionSchoolComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.content}>
            <h3 className={styles.heading}>
              Japanese Language School Admission (Japan)
            </h3>
            <p className={styles.text}>
              Each Japanese Language School has their own atmosphere and course
              structure, so you need to find a school that fits your study
              style. At HS Japan Academy we work closely with all our partner
              schools to make sure that we find the right school for you based
              on your language level, study habits and which city you want to
              study in.
            </p>
            <p className={styles.text}>
              In Japan there are 4 intakes in a year for the Japanese Language
              School program — January, April, July and October. Deadlines can
              be earlier or at a later time depending on when the school reaches
              its maximum student limit. We always suggest applying early so you
              can secure a spot at your preferred school.
            </p>
          </div>
          <div className={styles.sidebar}>
            <h4 className={styles.sidebarTitle}>Academic Resources</h4>
            <ul className={styles.resourceList}>
              {resources.map((r, i) => (
                <li key={i} className={styles.resourceItem}>
                  <i className={r.icon} />
                  <span>{r.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdmissionSchoolComp;
