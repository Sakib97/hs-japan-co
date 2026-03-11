import styles from "../styles/CourseInfoComp.module.css";

const CourseInfoComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>JAPANESE LANGUAGE COURSE</h2>
        <p className={styles.text}>
          Students can apply any time during the year. There is no application
          deadline for the Japanese Language Course. A member of HS Japan
          Academy Student Recruitment Team will assist you to complete your
          admission application. We aim to make your admissions process as
          simple and easy as possible.
        </p>
        <p className={styles.text}>
          Students have to submit all necessary academic documents to our office
          or may email scanned copies of these to our mail. Students will be
          informed about their eligibility for being admitted once these
          documents have been scrutinized and evaluated.
        </p>
      </div>
    </section>
  );
};

export default CourseInfoComp;
