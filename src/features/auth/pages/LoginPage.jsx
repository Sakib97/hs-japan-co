import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { LoginSchema } from "../schema/LoginSchema";
import styles from "../styles/LoginPage.module.css";
import { supabase } from "../../../config/supabaseClient";
import { Spin, Modal } from "antd";
import { showToast } from "../../../components/layout/CustomToast";

const LoginPage = () => {
  const navigate = useNavigate();

  const [passwordSet] = useState(() => {
    const flag = sessionStorage.getItem("hs_japan_password_set") === "1";
    if (flag) sessionStorage.removeItem("hs_japan_password_set");
    return flag;
  });

  const [showPassword, setShowPassword] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      const { email, password } = values;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showToast("Login failed: " + error.message, "error");
        return;
      }

      // Check if account is active
      const { data: userMeta } = await supabase
        .from("users_meta")
        .select("is_active")
        .eq("uid", data.user.id)
        .single();

      if (!userMeta || userMeta.is_active === false) {
        await supabase.auth.signOut();
        showToast(
          "Your account has been deactivated. Please contact an administrator.",
          "error",
        );
        return;
      }

      navigate("/dashboard");
    },
  });

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

            {passwordSet && (
              <div className={styles.successBanner}>
                <i className="fa-solid fa-circle-check"></i>
                Password set successfully! You can now sign in.
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email Address</label>
                <div
                  className={`${styles.inputWrap} ${
                    formik.touched.email && formik.errors.email
                      ? styles.inputError
                      : ""
                  }`}
                >
                  <i className="fa-solid fa-envelope"></i>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={styles.input}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <span className={styles.errorMsg}>{formik.errors.email}</span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Password</label>
                <div
                  className={`${styles.inputWrap} ${
                    formik.touched.password && formik.errors.password
                      ? styles.inputError
                      : ""
                  }`}
                >
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={styles.input}
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
                {formik.touched.password && formik.errors.password && (
                  <span className={styles.errorMsg}>
                    {formik.errors.password}
                  </span>
                )}
              </div>

              <div className={styles.options}>
                <label className={styles.checkLabel}>
                  <input type="checkbox" className={styles.checkbox} />
                  Remember me
                </label>
                <button
                  type="button"
                  className={styles.forgotLink}
                  onClick={() => setForgotModalOpen(true)}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? (
                  <Spin size="small" style={{ marginRight: 8 }} />
                ) : null}
                {formik.isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* <div className={styles.divider}>
              <span>or continue with</span>
            </div> */}

            {/* <div className={styles.socialRow}>
              <button className={styles.socialBtn}>
                <i className="fa-brands fa-google"></i>
              </button>
              <button className={styles.socialBtn}>
                <i className="fa-brands fa-facebook-f"></i>
              </button>
              <button className={styles.socialBtn}>
                <i className="fa-brands fa-linkedin-in"></i>
              </button>
            </div> */}

            {/* <p className={styles.switchText}>
              Don&apos;t have an account?{" "}
              <Link to="/auth/register" className={styles.switchLink}>
                Register
              </Link>
            </p> */}
          </div>
        </div>
      </div>

      <Modal
        open={forgotModalOpen}
        onCancel={() => setForgotModalOpen(false)}
        footer={null}
        title="Reset Password"
        centered
      >
        <div style={{ padding: "8px 0 4px", textAlign: "center" }}>
          <i
            className="fa-solid fa-headset"
            style={{ fontSize: 40, color: "#4f46e5", marginBottom: 16 }}
          ></i>
          <p style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 8 }}>
            Need help with your password?
          </p>
          <p style={{ fontSize: "0.875rem", color: "#555", marginBottom: 0 }}>
            Please contact the <strong>Admin</strong> or reach out to our{" "}
            <strong>Help Center</strong> to request a password reset.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default LoginPage;
