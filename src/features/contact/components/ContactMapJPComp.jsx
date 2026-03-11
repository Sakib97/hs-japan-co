import styles from "../styles/ContactMapJPComp.module.css";

const ContactMapJPComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Japan Office</h2>
        <div className={styles.mapWrapper}>
          <iframe
            title="Japan Office"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.844539034372!2d135.5170651153258!3d34.64839038044254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000dd3d3bbf7e03%3A0x5e8fc1b1b9c3e15c!2sTennoji-ku%2C%20Osaka!5e0!3m2!1sen!2sjp!4v1680000000000!5m2!1sen!2sjp"
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

export default ContactMapJPComp;
