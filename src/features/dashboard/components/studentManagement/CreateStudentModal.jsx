import { Modal, Input, Button } from "antd";
import styles from "../../styles/CreateStudentModal.module.css";
import { supabase } from "../../../../config/supabaseClient";
import { useFormik } from "formik";
import { StudentSchema } from "../../schema/StudentSchema";
import { useQueryClient } from "@tanstack/react-query";
import { showToast } from "../../../../components/layout/CustomToast";
import { useState } from "react";
import { generateToken } from "../../../../utils/generateToken";
import { sendInviteEmail } from "../../../../utils/sendInviteEmail";
import { useAuth } from "../../../../context/AuthProvider";
import {
  QK_STUDENTS,
  QK_STUDENT_STATS,
} from "../../../../config/queryKeyConfig";

const CreateStudentModal = ({ open, onClose }) => {
  const { user } = useAuth();
  const currentUserEmail = user?.email || "";
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleStudentSubmit = async (values) => {
    const { name, email, phone } = values;
    if (!name || !email || !phone) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    const role = "student";
    setLoading(true);
    try {
      // 1. Atomically insert into users_meta + student via DB function
      const { error } = await supabase.rpc("create_student", {
        p_email: email,
        p_name: name,
        p_role: role,
        p_phone: phone,
        p_created_by: currentUserEmail,
      });

      if (error) {
        if (error.message.includes("users_meta_email_key")) {
          showToast("An account with this email already exists.", "error");
        } else if (error.message.includes("student_phone_key")) {
          showToast(
            "An account with this phone number already exists.",
            "error",
          );
        } else {
          showToast("Failed to create Student: " + error.message, "error");
        }
        return;
      }

      // 2. Generate token and expiry
      const token = generateToken();
      const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // 3. Store token
      const { error: tokenError } = await supabase
        .from("user_invite_tokens")
        .insert([
          {
            email,
            token,
            expires_at,
            role,
          },
        ]);
      if (tokenError) {
        showToast(
          "Failed to generate invite token: " + tokenError.message,
          "error",
        );
        return;
      }

      // 4. Send invite email
      try {
        await sendInviteEmail(email, token, name);
        showToast("Student created and invite email sent!", "success");
      } catch (emailError) {
        showToast(
          "Student created but failed to send invite email: " +
            (emailError.text || emailError.message || emailError),
          "error",
        );
      }

      handleClose();

      queryClient.invalidateQueries({ queryKey: [QK_STUDENTS] });
      queryClient.invalidateQueries({ queryKey: [QK_STUDENT_STATS] });
    } catch (err) {
      showToast("Unexpected error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },
    validationSchema: StudentSchema,
    onSubmit: async (values) => {
      await handleStudentSubmit(values);
    },
  });

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title="Create Student"
      footer={null}
      className={styles.modal}
      width={520}
    >
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        {/* Name & Email */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Full Name *</label>
            <Input
              name="name"
              placeholder="e.g. John Doe"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <span className={styles.error}>{formik.errors.name}</span>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Email *</label>
          <Input
            name="email"
            type="email"
            placeholder="student@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <span className={styles.error}>{formik.errors.email}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Phone *</label>
          <Input
            name="phone"
            placeholder="0123456789"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phone && formik.errors.phone && (
            <span className={styles.error}>{formik.errors.phone}</span>
          )}
        </div>

        <div className={styles.footer}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className={styles.submitBtn}
          >
            {loading ? "Creating..." : "Create Student"}
          </Button>
        </div>
      </form>
      <br />
      <span style={{ fontWeight: "bold" }}>
        * A Mail will be sent to the student with instructions to set their
        password and access their dashboard.
      </span>
    </Modal>
  );
};

export default CreateStudentModal;
