import styles from "../styles/ContactMapBDComp.module.css";

const ContactMapBDComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Bangladesh Office</h2>
        <div className={styles.mapWrapper}>
          <iframe
            title="Bangladesh Office"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.263598058498!2d90.38241791536306!3d23.739127984588967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8f5b8faa64d%3A0x2c2b25d4512a4b8d!2sGreen%20Road%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1680000000000!5m2!1sen!2sbd"
            className={styles.iframe}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactMapBDComp;
