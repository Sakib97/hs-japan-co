import styles from "./VisaPageEligibilityComp.module.css";

const VisaPageEligibilityComp = ({ section, items }) => {
  return (
    <section id="eligibility" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{section.title}</h2>
        <p className={styles.subtitle}>{section.subtitle}</p>
      </div>
      <div className={styles.grid}>
        {items.map((item, i) => (
          <div key={i} className={styles.card}>
            {item.icon && (
              <div className={styles.iconWrap}>
                <i className={item.icon} />
              </div>
            )}
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardSubtitle}>{item.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VisaPageEligibilityComp;
