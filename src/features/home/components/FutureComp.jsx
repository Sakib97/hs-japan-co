import React from "react";
import styles from "../styles/FutureComp.module.css";

const FutureComp = () => {
  const imageItems = [
    {
      src: "https://picsum.photos/seed/class1/640/400",
      alt: "Students in classroom",
      className: styles.img1,
    },
    {
      src: "https://picsum.photos/seed/class2/400/560",
      alt: "Group discussion",
      className: styles.img2,
    },
    {
      src: "https://picsum.photos/seed/class3/760/480",
      alt: "Group photo",
      className: styles.img3,
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageSide}>
          <div className={styles.backgroundShape}></div>

          {imageItems.map(({ src, alt, className }) => (
            <div key={alt} className={`${styles.imageWrapper} ${className}`}>
              <img src={src} alt={alt} />
            </div>
          ))}
        </div>

        <div className={styles.contentSide}>
          <h2 className={styles.title}>Develop Your Future</h2>

          <div className={styles.mobileImageStack}>
            {imageItems.map(({ src, alt }, index) => (
              <img
                key={`${alt}-${index}`}
                src={src}
                alt={alt}
                className={styles.mobileStackImage}
              />
            ))}
          </div>

          <p className={styles.description}>
            HS Japan Academy is a client-focused based and result driven private
            language school that provides broad-based learning approaches and
            experience at an affordable fee. We will offer some standard and
            professional language teaching services in a highly secured and
            conducive learning environment. We also some offer different
            learning programs that may help to get jobs in Japan.
          </p>
          <p className={styles.description}>
            HS Japan Academy offers a variety of courses including Japanese
            language courses for all proficiency levels, specialized skills
            training in fields such as technology, healthcare, and business, as
            well as cultural immersion programs.
          </p>
          <p className={styles.description}>
            Our language courses use a combination of traditional classroom
            instruction, interactive activities, immersive language practice,
            and modern e-learning tools to ensure a comprehensive learning
            experience.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FutureComp;
