import styles from "../styles/OnlineCourseComp.module.css";

const OnlineCourseComp = () => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Online Course</h3>
      <p className={styles.subtitle}>You can join with our online platform</p>
      <div className={styles.imageWrapper}>
        <img
          src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=300&h=200&fit=crop"
          alt="Online Course"
          className={styles.image}
        />
      </div>
    </div>
  );
};

export default OnlineCourseComp;
