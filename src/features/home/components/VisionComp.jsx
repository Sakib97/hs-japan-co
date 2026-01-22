import React from "react";
import styles from "../styles/VisionComp.module.css";

const VisionComp = () => {
  return (
    <section className={styles.section}>
      {/* Background decoration */}
      <div className={styles.yellowShape}></div>

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.decorationIcon}></div>
          <h2 className={styles.title}>Our Vision and Mission</h2>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.imageSide}>
            <div className={styles.dotsDecorationLeft}></div>
            <div className={styles.mainImageWrapper}>
              <img
                src="https://picsum.photos/seed/vision/800/600"
                alt="Students with flag"
                className={styles.mainImage}
              />
            </div>
          </div>

          <div className={styles.textSide}>
            {/* Right side dots decoration could be inside or absolute */}
            <div className={styles.dotsDecorationRight}></div>

            <p className={styles.description}>
              Our vision is to build a highly competitive Japanese language
              school that will become the number one choice for students in
              Bangladesh. Our vision reflects our values: integrity, service,
              excellence and teamwork. Our mission is to provide professional
              and conducive learning environment to students at different levels
              of learning as it relates to the language of their choice.
            </p>

            <div className={styles.profileCard}>
              <img
                src="https://picsum.photos/seed/director/100/100"
                alt="Director"
                className={styles.profileImage}
              />
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>Md Faysal Hossain</span>
                <span className={styles.profileTitle}>
                  DIRECTOR, DHAKA BRANCH
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionComp;
