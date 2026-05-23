import styles from "./CorePillarsSection.module.css";

const PILLARS = [
  {
    icon: "fi fi-rr-graduation-cap",
    title: "Language Training",
    desc: "Complete JLPT & JLPT N5+ preparation courses, led by certified native-level instructors.",
  },
  {
    icon: "fi fi-rr-handshake",
    title: "Consultancy",
    desc: "Comprehensive guidance on choosing the right universities and vocational schools across Japan.",
  },
  {
    icon: "fi fi-rr-passport",
    title: "Immigration",
    desc: "Expert visa assistance and documentation support for student, work, and dependent visas.",
  },
];

const CorePillarsSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Our Core Pillars</h2>
        <div className={styles.titleBar} />
      </div>
      <div className={styles.cards}>
        {PILLARS.map((p, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.iconWrap}>
              <i className={p.icon} />
            </div>
            <h3 className={styles.cardTitle}>{p.title}</h3>
            <p className={styles.cardDesc}>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CorePillarsSection;
