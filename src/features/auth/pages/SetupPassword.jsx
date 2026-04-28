import { useState, useEffect } from "react";
import styles from "../styles/SetupPassword.module.css";
import { useSearchParams, useNavigate } from "react-router";
import { useFormik } from "formik";
import { SetupPasswordSchema } from "../schema/SetupPasswordSchema";
import { supabase } from "../../../config/supabaseClient";
import { Spin } from "antd";
import { showToast } from "../../../components/layout/CustomToast";

const SetupPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
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

      const { data, error } = await supabase
        .from("user_invite_tokens")
        .select("*")
        .eq("token", token)
        .eq("is_used", false)
        .single();

      if (error || !data || new Date(data.expires_at) < new Date()) {
        setValid(false);
        return;
      }

      console.log("data:: ", data);

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
    validationSchema: SetupPasswordSchema,
    onSubmit: async (values) => {
      // 1. Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/signin`,
        },
      });

      if (error) {
        console.error("Error creating user:", error);
        showToast("Failed to set password. Please try again.", "error");
        return;
      }

      // 1.5 if user role is student,
      // make student table's status = "enrolled"
      if (data?.user && role === "student") {
        const { error: updateError } = await supabase
          .from("student")
          .update({ status: "enrolled" })
          .eq("email", email);
        if (updateError) {
          console.error("Error updating student status:", updateError);
          showToast(
            "Failed to update student status. Please contact support.",
            "error",
          );
        }
      }

      // a trigger is called in supabase to Link the new auth UID to users_meta by matching email
      // and mark the token as used so it can't be reused

      // 2. Store success flag in sessionStorage BEFORE signing out so it
      //    survives the redirect chain (query param gets lost when AuthRedirect
      //    briefly bounces through /dashboard)
      sessionStorage.setItem("hs_japan_password_set", "1");

      // 3. Sign out first — clears the auto-session from signUp so
      //    AuthRedirect sees no user and won't flash the dashboard
      await supabase.auth.signOut();

      // 4. Redirect to login
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
        <p className={styles.invalidMsg}>Invalid or expired invitation link.</p>
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

            <form onSubmit={formik.handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Password*</label>
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
                    placeholder="Confirm your password"
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
                {formik.isSubmitting ? "Setting Password..." : "Set Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupPassword;
