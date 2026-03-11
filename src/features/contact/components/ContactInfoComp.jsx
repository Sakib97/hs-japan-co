import { useState } from "react";
import styles from "../styles/ContactInfoComp.module.css";

const offices = [
  {
    name: "Japan Office",
    hours: "Office hours are 10am – 6pm Saturday-Thursday",
    address: "1-11-11-301 Dogashiba, Tennoji-ku, Osaka, 543-0033, Japan",
    phones: ["+81 06-6718-6444", "+81 90-8215-9061"],
    email: "honsha@hsjapan.co.jp",
  },
  {
    name: "Khulna office",
    hours: "Office hours are 10am – 6pm Saturday-Thursday",
    address: "A/7 Mojid Shoroni, 3rd Floor Molla Bari More, Sonadanga, Khulna",
    phones: ["+8801755 429 444"],
    email: "khulna@hsjapan.co.jp",
  },
  {
    name: "Dhaka Office",
    hours: "Office hours are 10am – 6pm Saturday-Thursday",
    address: "152/2/J, 3rd Floor, Green Road, Dhaka-1205, Bangladesh",
    phones: ["+8801323 183 993", "+880 2223-371755"],
    email: "dhaka@hsjapan.co.jp",
  },
  {
    name: "Tangail Office",
    hours: "Office hours are 10am – 6pm Saturday-Thursday",
    address: "Bisswas Betka (At Pukur Par) Dhaka Tangail Road, Tangail",
    phones: ["+8801306 340 236"],
    email: "tangail@hsjapan.co.jp",
  },
];

const ContactInfoComp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.mainHeading}>Find Us</h2>

        <div className={styles.layout}>
          {/* ── offices grid ── */}
          <div className={styles.officesGrid}>
            {offices.map((o, idx) => (
              <div key={idx} className={styles.officeBlock}>
                <h3 className={styles.officeName}>{o.name}</h3>

                <div className={styles.infoRow}>
                  <span className={styles.iconCircle}>
                    <i className="fa-solid fa-clock"></i>
                  </span>
                  <span className={styles.infoText}>{o.hours}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.iconCircle}>
                    <i className="fa-solid fa-location-dot"></i>
                  </span>
                  <span className={`${styles.infoText} ${styles.linkText}`}>
                    {o.address}
                  </span>
                </div>

                {o.phones.map((p, i) => (
                  <div key={i} className={styles.infoRow}>
                    <span className={styles.iconCircle}>
                      <i className="fa-solid fa-phone"></i>
                    </span>
                    <span className={styles.infoText}>{p}</span>
                  </div>
                ))}

                <div className={styles.infoRow}>
                  <span className={styles.iconCircle}>
                    <i className="fa-solid fa-envelope"></i>
                  </span>
                  <span className={`${styles.infoText} ${styles.linkText}`}>
                    {o.email}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── enquiry form ── */}
          <div className={styles.formWrapper}>
            <div className={styles.decorCircle}></div>
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>Enquire Now</h3>
              <form onSubmit={handleSubmit} className={styles.form}>
                <input
                  type="text"
                  name="name"
                  placeholder="Complete Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone No"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.input}
                />
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Select Subject</option>
                  <option value="admission">Admission</option>
                  <option value="visa">Visa Enquiry</option>
                  <option value="course">Course Information</option>
                  <option value="general">General Enquiry</option>
                </select>
                <textarea
                  name="message"
                  placeholder="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className={styles.textarea}
                ></textarea>
                <button type="submit" className={styles.submitBtn}>
                  Apply Today
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfoComp;
