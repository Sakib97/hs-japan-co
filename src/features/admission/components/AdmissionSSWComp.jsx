import styles from "../styles/AdmissionSSWComp.module.css";

const resources = [
  { icon: "fa-solid fa-graduation-cap", label: "Admission Opportunity" },
  { icon: "fa-solid fa-clock", label: "Part-time Job Opportunity" },
  { icon: "fa-solid fa-award", label: "Graduate Programme" },
];

const AdmissionSSWComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.content}>
            <h3 className={styles.heading}>
              Specified Skilled Workers (Japan)
            </h3>
            <p className={styles.text}>
              The purpose of the Japan training visa is to allow an applicant
              from any country to come to Japan under Technical Intern Training
              Program and train in an implementing organization in order to
              acquire technology, skills, and knowledge. Upon return from Japan,
              participants are expected to utilize their newly learned
              technology, skills, and knowledge in their home countries.
            </p>
            <p className={styles.text}>
              Trainees are able to choose from 137 jobs in 77 categories. For
              example, agriculture, construction and machinery work, food
              processing, etc. We have vast connections with Japanese companies
              who need technical interns. We process and give guidance to those
              who want to get a technical intern visa in Japan.
            </p>

            <div className={styles.videoWrapper}>
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=340&fit=crop"
                alt="Video Thumbnail"
                className={styles.videoThumb}
              />
              <a
                href="https://youtu.be/pEQlcsNAVmc"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.playButton}
              >
                <i className="fa-solid fa-play" />
              </a>
            </div>
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

            <div className={styles.sidebarImage}>
              <img
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=300&h=300&fit=crop"
                alt="About"
                className={styles.sideImage}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdmissionSSWComp;
