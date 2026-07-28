import styles from "../styles/ContactMapJPComp.module.css";

const ContactMapJPComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Japan Office</h2>
        <div className={styles.mapWrapper}>
          <iframe
            title="Japan Office"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13128.952241134508!2d135.490415096283!3d34.64869036184748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000dd8d67fda411%3A0x1d0d083c44f090c8!2z44Gm44KT44GX44GwIGk6bmHvvIjjgqTjg7zjg4rvvIk!5e0!3m2!1sen!2sbd!4v1785248896907!5m2!1sen!2sbd"
            className={styles.iframe}
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactMapJPComp;
