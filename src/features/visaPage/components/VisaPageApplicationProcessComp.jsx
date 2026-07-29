import styles from "./VisaPageApplicationProcessComp.module.css";

const VisaPageApplicationProcessComp = ({ section, steps }) => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{section.title}</h2>
        <p className={styles.subtitle}>{section.subtitle}</p>
      </div>

      <div className={styles.timeline}>
        {steps.map((step, i) => (
          <div key={step.id ?? i} className={styles.step}>
            <div className={`${styles.side} ${styles.left}`}>
              {(step.title_en || step.subtitle_en) && (
                <div className={styles.card}>
                  {step.title_en && (
                    <h3 className={styles.cardTitle}>{step.title_en}</h3>
                  )}
                  {step.subtitle_en && (
                    <p className={styles.cardSubtitle}>{step.subtitle_en}</p>
                  )}
                </div>
              )}
            </div>

            <div className={styles.circle}>{i + 1}</div>

            <div className={`${styles.side} ${styles.right}`}>
              {(step.title || step.subtitle) && (
                <div className={styles.card}>
                  {step.title && (
                    <h3 className={styles.cardTitle}>{step.title}</h3>
                  )}
                  {step.subtitle && (
                    <p className={styles.cardSubtitle}>{step.subtitle}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VisaPageApplicationProcessComp;
