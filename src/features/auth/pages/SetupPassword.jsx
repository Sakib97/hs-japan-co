import { useState } from "react";
import styles from "../styles/SetupPassword.module.css";
import { useSearchParams } from "react-router";

const SetupPassword = () => {

const [searchParams, setSearchParams] = useSearchParams();

const token = searchParams.get("token");
// console.log("Token from URL:", token);

  const [formData, setFormData] = useState({
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
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Setup password:", formData);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Left Panel */}
        <div className={styles.leftPanel}>
          <div className={styles.leftContent}>
            <h1 className={styles.brandTitle}>HS Japan Academy</h1>
            <p className={styles.brandText}>
              Set up your password to secure your account and get started with
              HS Japan Academy.
            </p>
            <div className={styles.decorDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className={styles.rightPanel}>
          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Setup Password</h2>
              <p className={styles.formSubtitle}>
                Create a secure password for your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Password</label>
                <div className={styles.inputWrap}>
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
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
                    />
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
                    placeholder="Confirm your password"
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
                    />
                  </button>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Set Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupPassword;
