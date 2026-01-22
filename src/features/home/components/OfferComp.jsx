import React from "react";
import styles from "../styles/OfferComp.module.css";

const OfferComp = () => {
  const offers = [
    "Basic Japanese Learning Program",
    "Intensive Japanese Learning Program",
    "Learning Materials",
    "Career Language Training",
    "Specified Skilled Worker (SSW) Program",
    "Job Placement",
    "Student Visa Processing",
    "Technical Intern Visa Processing",
  ];

  return (
    <section className={styles.offerSection}>
      {/* Background Image Overlay */}
      <img
        src="https://picsum.photos/1920/1080?grayscale"
        alt="Background"
        className={styles.backgroundImage}
      />

      <div className={styles.container}>
        <div className={styles.contentSide}>
          <h2 className={styles.title}>What We Offer</h2>

          <div className={styles.offerList}>
            {offers.map((offer, index) => (
              <div key={index} className={styles.offerItem}>
                <div className={styles.checkIcon}>
                  <i className="fa-solid fa-check"></i>
                </div>
                <span>{offer}</span>
              </div>
            ))}
          </div>

          <a href="#ssw" className={styles.ctaButton}>
            <div className={styles.iconCircle}>
              <i className="fa-solid fa-chevron-right"></i>
            </div>
            Learn About SSW
          </a>
        </div>

        <div className={styles.imageSide}>
          <div className={styles.yellowShape}></div>
          {/* Using a specific person-like image ID from picsum */}
          <img
            src="https://picsum.photos/id/1005/300/550"
            alt="Professional"
            className={styles.personImage}
          />
        </div>
      </div>
    </section>
  );
};

export default OfferComp;
