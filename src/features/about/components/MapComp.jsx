import styles from "../styles/MapComp.module.css";

const MapComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.mapWrapper}>
          <iframe
            title="HS Japan Academy Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902!2d90.389!3d23.750!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ1JzAwLjAiTiA5MMKwMjMnMjAuNCJF!5e0!3m2!1sen!2sbd!4v1234567890"
            className={styles.map}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

export default MapComp;
