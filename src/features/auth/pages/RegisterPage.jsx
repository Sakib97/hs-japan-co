import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/RegisterPage.module.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register:", formData);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ── left panel ── */}
        <div className={styles.leftPanel}>
          <div className={styles.leftContent}>
            <h1 className={styles.brandTitle}>HS Japan Academy</h1>
            <p className={styles.brandText}>
              Create your account and begin your journey towards studying and
              working in Japan. Join thousands of students who trust HS Japan
              Academy for their future.
            </p>
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <i className="fa-solid fa-graduation-cap"></i>
                <span>JLPT Preparation</span>
              </div>
              <div className={styles.featureItem}>
                <i className="fa-solid fa-plane-departure"></i>
                <span>Visa Assistance</span>
              </div>
              <div className={styles.featureItem}>
                <i className="fa-solid fa-briefcase"></i>
                <span>Job Placement</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── right panel (form) ── */}
        <div className={styles.rightPanel}>
          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Create Account</h2>
              <p className={styles.formSubtitle}>
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name</label>
                <div className={styles.inputWrap}>
                  <i className="fa-solid fa-user"></i>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Email Address</label>
                <div className={styles.inputWrap}>
                  <i className="fa-solid fa-envelope"></i>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Phone Number</label>
                <div className={styles.inputWrap}>
                  <i className="fa-solid fa-phone"></i>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+880 1XXX-XXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Password</label>
                  <div className={styles.inputWrap}>
                    <i className="fa-solid fa-lock"></i>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={`fa-solid ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Confirm Password</label>
                  <div className={styles.inputWrap}>
                    <i className="fa-solid fa-lock"></i>
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      <i
                        className={`fa-solid ${
                          showConfirm ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>
              </div>

              <label className={styles.checkLabel}>
                <input type="checkbox" className={styles.checkbox} required />I
                agree to the{" "}
                <a href="#" className={styles.termsLink}>
                  Terms &amp; Conditions
                </a>
              </label>

              <button type="submit" className={styles.submitBtn}>
                Create Account
              </button>
            </form>

            <div className={styles.divider}>
              <span>or sign up with</span>
            </div>

            <div className={styles.socialRow}>
              <button className={styles.socialBtn}>
                <i className="fa-brands fa-google"></i>
              </button>
              <button className={styles.socialBtn}>
                <i className="fa-brands fa-facebook-f"></i>
              </button>
              <button className={styles.socialBtn}>
                <i className="fa-brands fa-linkedin-in"></i>
              </button>
            </div>

            <p className={styles.switchText}>
              Already have an account?{" "}
              <Link to="/auth/signin" className={styles.switchLink}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
