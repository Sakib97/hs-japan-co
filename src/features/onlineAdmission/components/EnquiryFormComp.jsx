import { useState } from "react";
import styles from "../styles/EnquiryFormComp.module.css";

const initialValues = {
  completeName: "",
  fatherName: "",
  motherName: "",
  dateOfBirth: "",
  nationality: "",
  presentAddress: "",
  permanentAddress: "",
  phoneNumber: "",
  email: "",
  educationQualification: "",
  institution: "",
  board: "",
  university: "",
  subject: "",
  passingYear: "",
  gpaClass: "",
  jobExperience: "",
  declaration: false,
};

const EnquiryFormComp = () => {
  const [form, setForm] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    setForm(initialValues);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Decorative crescent */}
        <div className={styles.crescent} />

        <div className={styles.formCard}>
          <h2 className={styles.heading}>Enquire Now</h2>
          <p className={styles.subtitle}>
            Creating the right learning environment to get the most out of each
            learning session.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <input
                type="text"
                name="completeName"
                placeholder="Complete Name"
                value={form.completeName}
                onChange={handleChange}
                className={styles.input}
                required
              />
              <input
                type="text"
                name="fatherName"
                placeholder="Father Name"
                value={form.fatherName}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.row}>
              <input
                type="text"
                name="motherName"
                placeholder="Mother Name"
                value={form.motherName}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="date"
                name="dateOfBirth"
                placeholder="Date Of Birth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.row}>
              <input
                type="text"
                name="nationality"
                placeholder="Nationality"
                value={form.nationality}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="presentAddress"
                placeholder="Present Address"
                value={form.presentAddress}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.row}>
              <input
                type="text"
                name="permanentAddress"
                placeholder="Permanent Address"
                value={form.permanentAddress}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.row}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                // className={`${styles.input} ${styles.inputHighlight}`}
                className={styles.input}
                required
              />
              <input
                type="text"
                name="educationQualification"
                placeholder="Education Qualification"
                value={form.educationQualification}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.row}>
              <input
                type="text"
                name="institution"
                placeholder="Institution"
                value={form.institution}
                onChange={handleChange}
                // className={`${styles.input} ${styles.inputHighlight}`}
                className={styles.input}
              />
              <input
                type="text"
                name="board"
                placeholder="Board"
                value={form.board}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.row}>
              <input
                type="text"
                name="university"
                placeholder="University"
                value={form.university}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                // className={`${styles.input} ${styles.inputHighlight}`}
                className={styles.input}
              />
            </div>

            <div className={styles.row}>
              <input
                type="text"
                name="passingYear"
                placeholder="Passing Year"
                value={form.passingYear}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="gpaClass"
                placeholder="GPA / CLASS"
                value={form.gpaClass}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.rowSingle}>
              <input
                type="text"
                name="jobExperience"
                placeholder="Job Experience"
                value={form.jobExperience}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="declaration"
                checked={form.declaration}
                onChange={handleChange}
                className={styles.checkbox}
                required
              />
              <span className={styles.checkboxText}>
                I hereby declare that all the information given by me in this
                application is true and correct to the best of my knowledge and
                belief. I also note that if any of the above statements are
                found to be incorrect or false or any information or particulars
                have been suppressed or omitted there from, I am liable to be
                disqualified and my admission may be cancelled.
              </span>
            </label>

            <button type="submit" className={styles.submitBtn}>
              Apply Today
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EnquiryFormComp;
