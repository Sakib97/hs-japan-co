import styles from "../styles/TeamCareerComp.module.css";

const TeamCareerComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* ── text side ── */}
          <div className={styles.textCol}>
            <h2 className={styles.heading}>Start your career</h2>

            <p className={styles.paragraph}>
              Building, developing, training, retaining and engaging the HS
              JAPAN ACADEMY team is a daily commitment. We work hard every day
              to make sure that our people are supported and empowered to
              deliver exceptional results for our clients
            </p>

            <p className={styles.paragraph}>
              Everyone says it, but in our case it&apos;s true: our team is the
              secret to our success. The HS JAPAN ACADEMY team is a tight-knit,
              talented group with a shared vision of delivering consistently
              great results for our clients, as well as ensuring the agency is a
              fun, inclusive, challenging place to work and develop a rewarding
              career.
            </p>

            <ul className={styles.checkList}>
              <li>
                <i className="fa-solid fa-check"></i> Highly Experience
              </li>
              <li>
                <i className="fa-solid fa-check"></i> Highly Committed
              </li>
            </ul>
          </div>

          {/* ── image side ── */}
          <div className={styles.imageCol}>
            <div className={styles.decorCircle}></div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=350&fit=crop"
              alt="Career team"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamCareerComp;
