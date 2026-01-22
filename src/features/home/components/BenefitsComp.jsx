import React from "react";
import styles from "../styles/BenefitComp.module.css";

const BenefitsComp = () => {
  const benefits = [
    { label: "Business", img: "https://picsum.photos/seed/biz/200" },
    { label: "Education", img: "https://picsum.photos/seed/edu/200" },
    { label: "Management", img: "https://picsum.photos/seed/manage/200" },
    { label: "Technology", img: "https://picsum.photos/seed/tech/200" },
    { label: "Tech & Coding", img: "https://picsum.photos/seed/code/200" },
    { label: "Medical Health", img: "https://picsum.photos/seed/med/200" },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.decorationIcon}></div>
          <h2 className={styles.title}>Benefits of Japanese language</h2>
          <p className={styles.description}>
            Proficiency in the Japanese language can open up various job
            opportunities, both in Japan and internationally. Many multinational
            companies have a presence in Japan or conduct business with Japanese
            companies, requiring employees with Japanese language skills.
            Industries such as technology, automotive, finance, tourism, and
            manufacturing often seek individuals with Japanese language
            proficiency.
          </p>
        </div>

        <div className={styles.grid}>
          {benefits.map((item, index) => (
            <div key={index} className={styles.item}>
              <div className={styles.imageContainer}>
                <img
                  src={item.img}
                  alt={item.label}
                  className={styles.benefitImage}
                />
              </div>
              <span className={styles.label}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsComp;
