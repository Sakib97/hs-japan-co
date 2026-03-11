import styles from "../styles/TeamMembersComp.module.css";

const chairman = {
  name: "Muhammad Rofiqul Islam",
  role: "Chairman, HS Japan Limited",
  image:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
};

const members = [
  {
    name: "Dr. Fakir Sharif Hossain",
    role: "CHIEF ADVISOR",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Mamiko Ogura",
    role: "ADVISOR, STUDENT COUNCILING",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Md Faysal Hossain",
    role: "DIRECTOR, DHAKA BRANCH",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Re Yamashita",
    role: "DIRECTOR, KHULNA BRANCH",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Md Mostafa Kamal",
    role: "DIRECTOR, KHULNA BRANCH",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Md AL Asmaul Karim",
    role: "DIRECTOR, KHULNA BRANCH",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face",
  },
];

const TeamMembersComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* ── decorative dot + heading ── */}
        <div className={styles.headerArea}>
          <span className={styles.decorDot}></span>
          <h2 className={styles.heading}>Our Qualified Team</h2>
        </div>

        {/* ── chairman card ── */}
        <div className={styles.chairmanWrapper}>
          <div className={styles.chairmanCard}>
            <div className={styles.chairmanImgWrap}>
              <img
                src={chairman.image}
                alt={chairman.name}
                className={styles.chairmanImg}
              />
            </div>
            <h3 className={styles.chairmanName}>{chairman.name}</h3>
            <p className={styles.chairmanRole}>{chairman.role}</p>
          </div>
        </div>

        {/* ── members grid ── */}
        <div className={styles.grid}>
          {members.map((m, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardInfo}>
                  <h4 className={styles.memberName}>{m.name}</h4>
                  <p className={styles.memberRole}>{m.role}</p>
                </div>
              </div>
              <div className={styles.memberImgWrap}>
                <img src={m.image} alt={m.name} className={styles.memberImg} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamMembersComp;
