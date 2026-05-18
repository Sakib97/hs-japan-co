import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Button, Select } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import styles from "../styles/EnquiryFormComp.module.css";
import { showToast } from "../../../components/layout/CustomToast";
import { supabase } from "../../../config/supabaseClient";
import {
  STUDENT_STATUS,
  STUDENT_INTERESTS,
  STUDENT_INTERESTS_OPTIONS,
} from "../../../config/statusAndRoleConfig";
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
  interests: Yup.string().required("Please select your interest"),
  otherInterest: Yup.string().when("interests", {
    is: STUDENT_INTERESTS.OTHER,
    then: (schema) => schema.required("Please specify your interest"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const EnquiryFormComp = () => {
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      address: "",
      phone: "",
      interests: "",
      otherInterest: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const admissionInterest =
        values.interests === STUDENT_INTERESTS.OTHER
          ? values.otherInterest
          : values.interests;

      const { error } = await supabase.from("student").insert({
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        present_address: values.address,
        status: STUDENT_STATUS.STUDENT_EXPRESSED_INTEREST,
        admission_interest: admissionInterest,
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

  const field = (name, label, placeholder, extra = {}) => (
    <div className={styles.fieldWrap}>
      <label className={styles.label}>{label}</label>
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

  const selectField = (name, label, placeholder) => (
    <div className={styles.fieldWrap}>
      <label className={styles.label}>{label}</label>
      <Select
        placeholder={placeholder}
        className={styles.formSelect}
        style={{ width: "100%" }}
        value={formik.values[name] || undefined}
        onChange={(val) => formik.setFieldValue(name, val)}
        onBlur={() => formik.setFieldTouched(name, true)}
        options={STUDENT_INTERESTS_OPTIONS}
        status={formik.touched[name] && formik.errors[name] ? "error" : ""}
      />
      {formik.touched[name] && formik.errors[name] && (
        <p className={styles.errorMsg}>{formik.errors[name]}</p>
      )}
    </div>
  );

  return (
    <section className={styles.section}>
      <h2 className={styles.formTitle}>Registration Form</h2>
      <p className={styles.formSubtitle}>
        Join over <strong>1,500 students</strong> currently enrolled.
      </p>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <div className={styles.fieldRow}>
          {field("fullName", "Full Name *", "e.g. John Doe")}
          {field("email", "Email Address *", "john.doe@example.com", {
            type: "email",
          })}
        </div>
        {field("address", "Current Address *", "Street, City, Country")}
        <div className={styles.fieldRow}>
          {field("phone", "Phone No *", "012345678910", { type: "tel" })}
          {selectField(
            "interests",
            "What are you interested in? *",
            "Select an interest",
          )}
        </div>
        {formik.values.interests === STUDENT_INTERESTS.OTHER &&
          field(
            "otherInterest",
            "Please specify your interest *",
            "Tell us more...",
          )}
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={formik.isSubmitting}
          className={styles.submitButton}
        >
          Submit Application &rarr;
        </Button>
        <p className={styles.termsText}>
          By submitting, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </section>
  );
};

export default EnquiryFormComp;
