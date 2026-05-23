import { Link } from "react-router-dom";
import styles from "./VisaPageHeroComp.module.css";

const VisaPageHeroComp = ({ hero }) => {
  const isExternal = hero.primary_button_url?.startsWith("http");

  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${hero.image_url})` }}
    >
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>{hero.title}</h1>
        <p className={styles.subtitle}>{hero.subtitle}</p>
        <div className={styles.buttons}>
          {hero.primary_button_text &&
            (isExternal ? (
              <a
                href={hero.primary_button_url}
                className={styles.btnPrimary}
                target="_blank"
                rel="noopener noreferrer"
              >
                {hero.primary_button_text}
              </a>
            ) : (
              <Link
                to={hero.primary_button_url || "#"}
                className={styles.btnPrimary}
              >
                {hero.primary_button_text}
              </Link>
            ))}
          <a href="#eligibility" className={styles.btnSecondary}>
            View Eligibility
          </a>
        </div>
      </div>
    </section>
  );
};

export default VisaPageHeroComp;
