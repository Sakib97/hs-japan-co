import styles from "../styles/CourseInfoComp.module.css";

const CourseInfoComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.decorCorner} />
      <div className={styles.headingWrap}>
        <span className={styles.line} />
        <h2 className={styles.heading}>JAPANESE LANGUAGE COURSE</h2>
        <span className={styles.line} />
      </div>
      <p className={styles.text}>
        Students can apply any time during the year. There is no application
        deadline for the Japanese Language Course.
      </p>
      <p className={styles.text}>
        A member of <strong>HS Japan Academy Student Recruitment Team</strong>{" "}
        will assist you to complete your admission application. We aim to make
        your admissions process as simple and easy as possible.
      </p>
      <blockquote className={styles.quote}>
        &ldquo;Our mission is to bridge cultures through linguistic excellence
        and disciplined learning.&rdquo;
      </blockquote>
      <p className={styles.text}>
        Students have to submit all necessary academic documents to our office
        or may email scanned copies of these to our mail. Students will be
        informed about their eligibility for being admitted once these documents
        have been scrutinized and evaluated.
      </p>
    </section>
  );
};

export default CourseInfoComp;
