import { Modal, Input, Select, Button, Tabs, Spin } from "antd";
import styles from "./CreateEmployeeModal.module.css";
import { supabase } from "../../../../config/supabaseClient";
import { useFormik } from "formik";
import { AdminSchema } from "../../schema/AdminSchema";
import { EmployeeSchema } from "../../schema/EmployeeSchema";
import { useQuery } from "@tanstack/react-query";
import { LoadingOutlined } from "@ant-design/icons";
import { generateToken } from "../../../../utils/generateToken";
import { sendInviteEmail } from "../../../../utils/sendInviteEmail";
import { showToast } from "../../../../components/layout/CustomToast";
import { useState } from "react";

const CreateEmployeeModal = ({ open, onClose }) => {
  const [adminLoading, setAdminLoading] = useState(false);
  const {
    data: fetchDepartments,
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("id, department_name")
        .eq("is_active", true);

      if (error) {
        throw new Error("Error fetching departments: " + error.message);
      }
      return data;
    },
  });

  const {
    data: fetchDesignations,
    isLoading: designationsLoading,
    error: designationsError,
  } = useQuery({
    queryKey: ["designations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("designations")
        .select("id, designation_name")
        .eq("is_active", true);

      if (error) {
        throw new Error("Error fetching designations: " + error.message);
      }
      return data;
    },
  });

  const departmentOptions = fetchDepartments
    ? fetchDepartments.map((dept) => ({
        value: dept.id,
        label: dept.department_name,
      }))
    : [];

  const designationOptions = fetchDesignations
    ? fetchDesignations.map((desig) => ({
        value: desig.id,
        label: desig.designation_name,
      }))
    : [];
  const handleClose = () => {
    adminFormik.resetForm();
    employeeFormik.resetForm();
    onClose();
  };

  const handleAdminSubmit = async (values) => {
    const { email, name } = values;
    const role = "admin";
    // const uid = crypto.randomUUID();

    setAdminLoading(true);
    try {
      // 1. Insert into users_meta
      const { error } = await supabase
        .from("users_meta")
        .insert([{ email, name, role, 
            // uid 
        }]);

      if (error) {
        if (error.message.includes("users_meta_email_key")) {
          showToast("An account with this email already exists.", "error");
        } else {
          showToast("Failed to create admin: " + error.message, "error");
        }
        return;
      }

      // 2. Generate token and expiry
      const token = generateToken();
      const expires_at = new Date(Date.now() + 2 * 60 * 60 * 1000);

      // 3. Store token
      const { error: tokenError } = await supabase
        .from("user_invite_tokens")
        .insert([{ email, token, role, expires_at }]);

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
        showToast("Admin created and invite email sent!", "success");
      } catch {
        showToast("Admin created but email sending failed.", "warning");
      }

      handleClose();
    } catch (err) {
      showToast("Unexpected error: " + err.message, "error");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleEmployeeSubmit = (values) => {
    console.log("Create employee:", values);
    handleClose();
  };

  const adminFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    validationSchema: AdminSchema,
    onSubmit: async (values) => {
      handleAdminSubmit(values);
    },
  });

  const employeeFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      designation: "",
      department: "",
    },
    validationSchema: EmployeeSchema,
    onSubmit: async (values) => {
      handleEmployeeSubmit(values);
    },
  });

  const items = [
    {
      key: "1",
      label: "New Admin",
      children: (
        <form onSubmit={adminFormik.handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>FULL NAME</label>
            <Input
              name="name"
              placeholder="e.g. Kenji Tanaka"
              size="large"
              value={adminFormik.values.name}
              onChange={adminFormik.handleChange}
              onBlur={adminFormik.handleBlur}
              status={
                adminFormik.touched.name && adminFormik.errors.name
                  ? "error"
                  : ""
              }
            />
            {adminFormik.touched.name && adminFormik.errors.name && (
              <div className={styles.error}>{adminFormik.errors.name}</div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>EMAIL ADDRESS</label>
            <Input
              name="email"
              type="email"
              placeholder="k.tanaka@consulate.gov"
              size="large"
              value={adminFormik.values.email}
              onChange={adminFormik.handleChange}
              onBlur={adminFormik.handleBlur}
              status={
                adminFormik.touched.email && adminFormik.errors.email
                  ? "error"
                  : ""
              }
            />
            {adminFormik.touched.email && adminFormik.errors.email && (
              <div className={styles.error}>{adminFormik.errors.email}</div>
            )}
          </div>

          <div className={styles.footer}>
            <Button onClick={handleClose} size="large" disabled={adminLoading}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className={styles.submitBtn}
              loading={adminLoading}
              disabled={adminLoading}
            >
              {adminLoading ? "Creating..." : "Create Admin"}
            </Button>
          </div>
          <div>
            <span className={styles.note}>
              *New admin will receive an email with login instructions.
            </span>
          </div>
        </form>
      ),
    },
    {
      key: "2",
      label: "New Employee",
      children: (
        <form onSubmit={employeeFormik.handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>FULL NAME</label>
            <Input
              name="name"
              placeholder="e.g. Kenji Tanaka"
              size="large"
              value={employeeFormik.values.name}
              onChange={employeeFormik.handleChange}
              onBlur={employeeFormik.handleBlur}
              status={
                employeeFormik.touched.name && employeeFormik.errors.name
                  ? "error"
                  : ""
              }
            />
            {employeeFormik.touched.name && employeeFormik.errors.name && (
              <div className={styles.error}>{employeeFormik.errors.name}</div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>EMAIL ADDRESS</label>
            <Input
              name="email"
              type="email"
              placeholder="k.tanaka@consulate.gov"
              size="large"
              value={employeeFormik.values.email}
              onChange={employeeFormik.handleChange}
              onBlur={employeeFormik.handleBlur}
              status={
                employeeFormik.touched.email && employeeFormik.errors.email
                  ? "error"
                  : ""
              }
            />
            {employeeFormik.touched.email && employeeFormik.errors.email && (
              <div className={styles.error}>{employeeFormik.errors.email}</div>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>DESIGNATION</label>
              <Select
                placeholder="Select Role"
                options={designationOptions}
                size="large"
                className={styles.select}
                loading={designationsLoading}
                suffixIcon={
                  designationsLoading ? <LoadingOutlined spin /> : undefined
                }
                value={employeeFormik.values.designation || undefined}
                onChange={(val) =>
                  employeeFormik.setFieldValue("designation", val)
                }
                onBlur={() =>
                  employeeFormik.setFieldTouched("designation", true)
                }
                status={
                  employeeFormik.touched.designation &&
                  employeeFormik.errors.designation
                    ? "error"
                    : ""
                }
              />
              {employeeFormik.touched.designation &&
                employeeFormik.errors.designation && (
                  <div className={styles.error}>
                    {employeeFormik.errors.designation}
                  </div>
                )}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>DEPARTMENT</label>
              <Select
                placeholder="Select Dept"
                options={departmentOptions}
                size="large"
                className={styles.select}
                loading={departmentsLoading}
                suffixIcon={
                  departmentsLoading ? <LoadingOutlined spin /> : undefined
                }
                value={employeeFormik.values.department || undefined}
                onChange={(val) =>
                  employeeFormik.setFieldValue("department", val)
                }
                onBlur={() =>
                  employeeFormik.setFieldTouched("department", true)
                }
                status={
                  employeeFormik.touched.department &&
                  employeeFormik.errors.department
                    ? "error"
                    : ""
                }
              />
              {employeeFormik.touched.department &&
                employeeFormik.errors.department && (
                  <div className={styles.error}>
                    {employeeFormik.errors.department}
                  </div>
                )}
            </div>
          </div>

          <div className={styles.footer}>
            <Button onClick={handleClose} size="large">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className={styles.submitBtn}
            >
              Create Account
            </Button>
          </div>
          <div>
            <span className={styles.note}>
              * New employee will receive an email with login instructions.
            </span>
          </div>
        </form>
      ),
    },
  ];

  return (
    <Modal
      title="Create New Account"
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      centered
      className={styles.modal}
      width={480}
      zIndex={1100}
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Modal>
  );
};

export default CreateEmployeeModal;
