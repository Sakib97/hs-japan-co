import styles from "./VisaPageApplicationProcessComp.module.css";

const VisaPageApplicationProcessComp = ({ section, steps }) => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{section.title}</h2>
        <p className={styles.subtitle}>{section.subtitle}</p>
      </div>

      <div className={styles.timeline}>
        {steps.map((step, i) => {
          const isOdd = i % 2 === 0; // odd steps (1st, 3rd…) go right
          return (
            <div key={i} className={styles.step}>
              <div className={`${styles.side} ${styles.left}`}>
                {!isOdd && (
                  <div className={styles.card}>
                    <h3 className={styles.cardTitle}>{step.title}</h3>
                    <p className={styles.cardSubtitle}>{step.subtitle}</p>
                  </div>
                )}
              </div>

              <div className={styles.circle}>{i + 1}</div>

              <div className={`${styles.side} ${styles.right}`}>
                {isOdd && (
                  <div className={styles.card}>
                    <h3 className={styles.cardTitle}>{step.title}</h3>
                    <p className={styles.cardSubtitle}>{step.subtitle}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VisaPageApplicationProcessComp;
