import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/LoginPage.module.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", formData);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ── left panel ── */}
        <div className={styles.leftPanel}>
          <div className={styles.leftContent}>
            <h1 className={styles.brandTitle}>HS Japan Academy</h1>
            <p className={styles.brandText}>
              Your gateway to Japanese education and career opportunities. Sign
              in to access your student dashboard, track applications, and stay
              connected with HS Japan Academy.
            </p>
            <div className={styles.decorDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        {/* ── right panel (form) ── */}
        <div className={styles.rightPanel}>
          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Welcome Back</h2>
              <p className={styles.formSubtitle}>Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
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
                    ></i>
                  </button>
                </div>
              </div>

              <div className={styles.options}>
                <label className={styles.checkLabel}>
                  <input type="checkbox" className={styles.checkbox} />
                  Remember me
                </label>
                <Link to="/auth/forgot-password" className={styles.forgotLink}>
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Sign In
              </button>
            </form>

            <div className={styles.divider}>
              <span>or continue with</span>
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
              Don&apos;t have an account?{" "}
              <Link to="/auth/register" className={styles.switchLink}>
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
