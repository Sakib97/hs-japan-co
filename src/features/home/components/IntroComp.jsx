import { Link } from "react-router-dom";
import styles from "../styles/IntroComp.module.css";

const STATS = [
  { value: "2,500+", label: "Students Enrolled" },
  { value: "98%", label: "JLPT Pass Rate" },
  { value: "12+", label: "Years of Excellence" },
  { value: "40+", label: "Expert Instructors" },
];

const IntroComp = () => {
  return (
    <section className={styles.section}>
      {/* Background decoration */}
      <span className={styles.bgCircle1} aria-hidden="true" />
      <span className={styles.bgCircle2} aria-hidden="true" />
      <span className={styles.bgLine} aria-hidden="true" />

      <div className={styles.container}>
        {/* Left: text */}
        <div className={styles.textCol}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Certified Japanese Language School
          </p>

          <h1 className={styles.headline}>
            Your Journey to <span className={styles.highlight}>Japanese</span>{" "}
            Fluency Starts Here
          </h1>

          <p className={styles.sub}>
            We offer structured JLPT-aligned programmes from N5 to N1, taught by
            native and certified instructors — online and on-campus.
          </p>

          <div className={styles.actions}>
            <Link to="/admission" className={styles.primaryBtn}>
              Apply Now
            </Link>
            <Link to="/about" className={styles.ghostBtn}>
              Learn More
            </Link>
          </div>
        </div>

        {/* Right: minimalist figures / stats */}
        <div className={styles.figuresCol}>
          {/* Calligraphy glyph decoration */}
          <div className={styles.kanji} aria-hidden="true">
            <span>日</span>
            <span>本</span>
            <span>語</span>
          </div>

          {/* Stats grid */}
          <div className={styles.statsGrid}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.statCard}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroComp;
