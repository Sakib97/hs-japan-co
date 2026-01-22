import React from "react";
import styles from "../styles/AboutComp.module.css";

const AboutComp = () => {
  const services = [
    "Employment Opportunities",
    "Research and Education",
    "Access to Japanese Market",
    "Specified Skilled Worker (SSW)",
    "IT Professional Job",
    "Document Services",
  ];

  return (
    <section className={styles.aboutSection}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <div className={styles.decorationIcon}></div>
          <h2 className={styles.title}>About Us</h2>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.textContent}>
            <p>
              We began our journey by opening our first office in Osaka, Japan,
              under the name Helping Society (HS) Japan. Our goal was to help
              Bangladeshi students study, work, and settle in Japan. Since we
              started, we have helped over 400 students pursue education and
              settle in Japan. Later, we opened our first office in Khulna,
              Bangladesh, called HS Japan Academy. HS Japan is committed to
              providing quality services to students, workers, and anyone who
              wants to live and build a career in Japan. We offer Japanese
              language classes taught by highly qualified instructors, including
              native Japanese speakers. Our Khulna office has two Japanese
              instructors who can speak both Bangla and Japanese. Due to high
              success rates and demand, we opened more branch offices in Dhaka,
              Tangail, and Kushtia across Bangladesh. All branch offices are
              managed by our head office in Japan and offer basic Japanese
              language courses, career language training, intensive Japanese
              programs, student visa processing, technical intern visa
              processing, the Specified Skilled Worker (SSW) program, and job
              placement services.
            </p>
          </div>

          <div className={styles.servicesList}>
            {services.map((service, index) => (
              <div key={index} className={styles.serviceItem}>
                <i
                  className={`fa-solid fa-caret-right ${styles.arrowIcon}`}
                ></i>
                <span className={styles.serviceText}>{service}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutComp;
