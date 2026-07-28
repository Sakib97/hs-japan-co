import styles from "../styles/MapComp.module.css";

const MapComp = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.mapWrapper}>
          <iframe
            title="Bangladesh Office"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7303.791847965267!2d90.3762548935791!3d23.75109050000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9002de9210f%3A0x3ac6dae2600c162a!2sHS%20Japan%20Academy!5e0!3m2!1sen!2sbd!4v1785248672743!5m2!1sen!2sbd"
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

export default MapComp;
