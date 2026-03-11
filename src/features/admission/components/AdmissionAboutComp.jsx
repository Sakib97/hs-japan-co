import styles from "../styles/AdmissionAboutComp.module.css";

const resources = [
  { icon: "fa-solid fa-briefcase", label: "Employment Opportunities" },
  { icon: "fa-solid fa-flask", label: "Research and Education" },
  { icon: "fa-solid fa-chart-line", label: "Business and Trade Opportunities" },
];

const AdmissionAboutComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.content}>
            <h3 className={styles.heading}>About Academic</h3>
            <p className={styles.text}>
              Students can apply any time during the year. There is no
              application deadline for the Japanese Language Course. A member of
              HS Japan Academy Student Recruitment Team will assist you to
              complete your admission application. We aim to make your
              admissions process as simple and easy as possible.
            </p>
            <p className={styles.text}>
              Students have to submit all necessary academic documents to our
              office or may email scanned copies of these to our mail. Students
              will be informed about their eligibility for being admitted once
              these documents have been scrutinized and evaluated.
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

export default AdmissionAboutComp;
