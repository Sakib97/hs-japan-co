import styles from "../styles/BetterFutureComp.module.css";

const BetterFutureComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.imageWrapper}>
            <img
              src="https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=500&h=350&fit=crop"
              alt="Japan cityscape with flag"
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <h2 className={styles.heading}>Prepared You For a Better Future</h2>
            <p className={styles.text}>
              Did you know that learning a new language could actually make you
              smarter? Scientific research into language learning suggests that
              when you tackle a new language, it causes brain growth. If you
              want to take advantage of increased brain power, you&apos;ll no
              doubt be wondering what language to learn. If you&apos;re
              seriously undecided, know that Japanese is a very popular choice
              for language learners.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BetterFutureComp;
