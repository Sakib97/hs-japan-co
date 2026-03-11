import styles from "../styles/TechnologyComp.module.css";

const TechnologyComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.content}>
            <h2 className={styles.heading}>Access to Advanced Technology</h2>
            <p className={styles.text}>
              Japan has long been known as a world leader in technology. One of
              the biggest advantages of going to Japan for your work or for your
              education is that you get access to advanced technology. The
              country makes some of the most advanced products in the world.
              Also, their scientific research is among the best in the world. So
              you can get a lot of experience and learn a lot while you are in
              Japan.
            </p>
          </div>
          <div className={styles.imageWrapper}>
            <img
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=350&fit=crop"
              alt="Tokyo night cityscape"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyComp;
