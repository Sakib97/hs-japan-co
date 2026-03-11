import styles from "../styles/ChairmanComp.module.css";

const ChairmanComp = () => {
  return (
    <div className={styles.wrapper}>
      {/* Chairman Bio Section */}
      <div className={styles.bioSection}>
        <div className={styles.photoWrapper}>
          <img
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=350&fit=crop"
            alt="Chairman"
            className={styles.photo}
          />
        </div>
        <div className={styles.bioContent}>
          <h3 className={styles.name}>Chairman</h3>
          <p className={styles.designation}>Hs Japan Limited</p>
          <p className={styles.bio}>
            With immense pride and great pleasure, I welcome you to the HS JAPAN
            ACADEMY. HS JAPAN ACADEMY is a Bangladesh based company specialized
            in Japanese language training courses, education consultancy and
            immigration services. You could be a parent, a student, a staff
            member, or anyone interested in getting deeper insights into our
            exciting world&apos;s transforming and learning environment. Right
            from its inception to now, our institution has committed itself to
            spread the light of education and earn the faith of academic
            excellence for every student.
          </p>
          <p className={styles.bio}>
            To students we thank our heart to you. You are our sole reason and
            we made all our efforts on you. We cannot see the future instead of
            we could you for the future. The knowledge that you will gain, the
            qualities that you will imbibe, and the technical skills you will
            learn to apply will transform to your parents, country and the
            nation. These are strong challenges to grasp but also raises common
            goals. Without these, the chain of education breaks. We want you to
            make the fruit of success even earlier the end of your life, you
            will never study.
          </p>
          <p className={styles.bio}>
            To parents we guarantee you: that we are an important partner in
            your children&apos;s whole educational and training journey. Your
            dedication and endless cooperation in progressing your
            children&apos;s education and learning are vital to our mutual
            objectives. We are keen on strengthening the communication between
            us to practice and implement brighter for our students.
          </p>
          <p className={styles.bio}>
            Again, would like to thank our students, staff members and our
            partner institutions in Japan for choosing to support us. Thanks for
            the trust and confidence you have shown in HS JAPAN ACADEMY.
          </p>
        </div>
      </div>

      {/* School Features Section */}
      <div className={styles.featuresSection}>
        <h3 className={styles.featuresTitle}>School Features</h3>
        <div className={styles.featuresDivider} />

        <div className={styles.feature}>
          <h4 className={styles.featureHeading}>Class advisor system</h4>
          <p className={styles.featureText}>
            Class advisors give support and provide consultations on every-day
            life other than study and career guidance.
          </p>
        </div>

        <div className={styles.feature}>
          <h4 className={styles.featureHeading}>
            Support for University/Graduate school
          </h4>
          <p className={styles.featureText}>
            Individual consultations and support for higher studies including
            teaching and research plans and guide for university entrance.
            Interactive technique, training in data available.
          </p>
        </div>

        <div className={styles.feature}>
          <h4 className={styles.featureHeading}>
            Japanese Language Proficiency Test
          </h4>
          <p className={styles.featureText}>
            We provide advanced and entry-level effective support for success.
          </p>
          <ul className={styles.featureList}>
            <li>Most suitable learning facilities</li>
            <li>
              We have installed free WIFI in each classroom. In addition to the
              library, there are famous Japanese books and manga so you can
              easily read after classes.
            </li>
            <li>Convenient living environment</li>
            <li>
              Osaka is the second largest city next to Tokyo. Stand and easy
              train access to Osaka&apos;s tourist quarters such as Namba,
              Umeda, Shinsaibashi and more. Living costs in Osaka are also lower
              than Tokyo.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChairmanComp;
