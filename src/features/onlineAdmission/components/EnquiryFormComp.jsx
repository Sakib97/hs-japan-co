import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Button, Card } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import styles from "../styles/EnquiryFormComp.module.css";
import { showToast } from "../../../components/layout/CustomToast";
import { supabase } from "../../../config/supabaseClient";
import { STUDENT_STATUS } from "../../../config/statusAndRoleConfig";
import { QK_STUDENTS, QK_STUDENT_STATS } from "../../../config/queryKeyConfig";

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  address: Yup.string().required("Address is required"),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]{7,15}$/, "Please enter a valid phone number")
    .required("Phone number is required"),
});

const EnquiryFormComp = () => {
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: { fullName: "", email: "", address: "", phone: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const { error } = await supabase.from("student").insert({
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        present_address: values.address,
        status: STUDENT_STATUS.STUDENT_EXPRESSED_INTEREST,
      });

      if (error) {
        if (error.code === "23505") {
          showToast("This Phone / Email is already registered.", "error");
        } else {
          showToast(
            error.message || "Submission failed. Please try again.",
            "error",
          );
        }
      } else {
        queryClient.invalidateQueries({ queryKey: [QK_STUDENTS] });
        queryClient.invalidateQueries({ queryKey: [QK_STUDENT_STATS] });
        showToast("Thank you! We'll get back to you soon.", "success");
        resetForm();
      }
      setSubmitting(false);
    },
  });

  const field = (name, placeholder, extra = {}) => (
    <div className={styles.fieldWrap}>
      <Input
        {...extra}
        placeholder={placeholder}
        className={styles.formInput}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name={name}
        status={formik.touched[name] && formik.errors[name] ? "error" : ""}
      />
      {formik.touched[name] && formik.errors[name] && (
        <p className={styles.errorMsg}>{formik.errors[name]}</p>
      )}
    </div>
  );

  return (
    <section className={styles.section}>
      <div className={styles.formContainer}>
        <div className={styles.yellowCircle}></div>
        <Card className={styles.contactCard} bordered={false}>
          <Card.Meta
            title={
              <div className={styles.cardTitle}>
                Join over{" "}
                <span className={styles.highlightText}>1500 students</span>{" "}
                who've now registered for their courses. Don't miss out. <br />
                {/* <span style={{ fontSize: "30px", fontWeight: "bold" }}>
                  Interested ?{" "}
                </span>{" "} */}
                <br />
                Drop us your contact details &amp; we will get back to you very
                soon.
              </div>
            }
          />
          <form onSubmit={formik.handleSubmit} className={styles.form}>
            {field("fullName", "Enter Your Full Name *")}
            {field("email", "Email Address *", { type: "email" })}
            {field("address", "Current Address *")}
            {field("phone", "Phone No *", { type: "tel" })}

            <div className={styles.submitItem}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={formik.isSubmitting}
                className={styles.submitButton}
              >
                Apply Today
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default EnquiryFormComp;
