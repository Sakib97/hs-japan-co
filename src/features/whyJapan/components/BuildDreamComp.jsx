import styles from "../styles/BuildDreamComp.module.css";

const cards = [
  {
    icon: "fa-solid fa-industry",
    title: "Technical Intern Training Programme",
    text: "The Technical Intern Training Program (TITP) is a government initiative that allows foreign workers to learn skills and techniques in Japan.",
  },
  {
    icon: "fa-solid fa-graduation-cap",
    title: "Student Platform",
    text: "Japan offers excellent educational programs with world-class universities and institutions that provide quality education and research opportunities.",
  },
  {
    icon: "fa-solid fa-briefcase",
    title: "Job",
    text: "Japan has a growing job market that welcomes skilled foreign workers across various industries including IT, engineering, and healthcare.",
  },
  {
    icon: "fa-solid fa-user-gear",
    title: "Specified Skill Worker",
    text: "The Specified Skilled Worker (SSW) visa allows foreign nationals with certain expertise to work in designated industries facing labor shortages.",
  },
];

const BuildDreamComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Build Your Dream in Japan</h2>
        <div className={styles.grid}>
          {cards.map((card, idx) => (
            <div className={styles.card} key={idx}>
              <div className={styles.iconCircle}>
                <i className={card.icon}></i>
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardText}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuildDreamComp;
