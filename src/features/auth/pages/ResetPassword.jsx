import { useState, useEffect } from "react";
import styles from "./ResetPassword.module.css";
import { useSearchParams, useNavigate } from "react-router";
import { useFormik } from "formik";
import { ResetPasswordSchema } from "../schema/ResetPasswordSchema";
import { supabase } from "../../../config/supabaseClient";
import { Spin } from "antd";
import { showToast } from "../../../components/layout/CustomToast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [valid, setValid] = useState(false);
  const [validating, setValidating] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const validateToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setValid(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_invite_tokens")
        .select("*")
        .eq("token", token)
        .eq("is_used", false)
        .eq("token_purpose", "password_reset")
        .single();

      if (error || !data || new Date(data.expires_at) < new Date()) {
        setValid(false);
        return;
      }

      setEmail(data.email);
      setRole(data.role);
      setValid(true);
    };

    validateToken().finally(() => setValidating(false));
  }, []);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      const { error: updateError } = await supabase.functions.invoke(
        "reset_password_by_token",
        {
          body: {
            token: searchParams.get("token"),
            newPassword: values.password,
          },
        },
      );

      if (updateError) {
        console.error("Error resetting password:", updateError);
        showToast("Failed to reset password. Please try again.", "error");
        return;
      }

      showToast("Password reset successfully! Please sign in.", "success");
      sessionStorage.setItem("hs_japan_password_reset", "1");

      // 3. Sign out first — clears the auto-session from signUp so
      //    AuthRedirect sees no user and won't flash the dashboard
      await supabase.auth.signOut();
      navigate("/auth/signin");
    },
  });

  if (validating)
    return (
      <div className={styles.centerScreen}>
        <Spin size="large" />
      </div>
    );

  if (!valid)
    return (
      <div className={styles.centerScreen}>
        <p className={styles.invalidMsg}>Invalid or expired reset link !</p>
      </div>
    );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Left Panel */}
        <div className={styles.leftPanel}>
          <div className={styles.leftContent}>
            <h1 className={styles.brandTitle}>HS Japan Academy</h1>
            <p className={styles.brandText}>
              Reset your password to regain access to your account.
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
              <h2 className={styles.formTitle}>Reset Password</h2>
              <p className={styles.formSubtitle}>
                Enter and confirm your new password below
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>New Password*</label>
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
                    placeholder="Enter new password"
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
                    />
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <span className={styles.errorMsg}>
                    {formik.errors.password}
                  </span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Confirm Password*</label>
                <div
                  className={`${styles.inputWrap} ${
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? styles.inputError
                      : ""
                  }`}
                >
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={styles.input}
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
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <span className={styles.errorMsg}>
                      {formik.errors.confirmPassword}
                    </span>
                  )}
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? (
                  <Spin size="small" style={{ marginRight: 8 }} />
                ) : null}
                {formik.isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
