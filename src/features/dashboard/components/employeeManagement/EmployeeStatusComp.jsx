import { Tag, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { QK_EMPLOYEES } from "../../../../config/queryKeyConfig";
import {
  EMP_ACCOUNT_STATUS_COLOR,
  EMP_ACCOUNT_STATUS_OPTIONS,
} from "../../../../config/statusAndRoleConfig";
import styles from "./EmployeeStatusComp.module.css";
import { useAuth } from "../../../../context/AuthProvider";

const statusLabelMap = Object.fromEntries(
  EMP_ACCOUNT_STATUS_OPTIONS.map(({ value, label }) => [value, label]),
);

const EmployeeStatusComp = ({ email }) => {
  const { employeeStatus } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: [QK_EMPLOYEES, email, "status"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("activity_status, department_name, designation_name")
        .eq("email", email)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!email,
  });

  if (isLoading) {
    return (
      <div className={styles.card}>
        <Spin size="small" />
      </div>
    );
  }

  const status = employeeStatus ?? data?.activity_status ?? null;
  const statusColor = EMP_ACCOUNT_STATUS_COLOR[status] ?? "default";
  const statusLabel = statusLabelMap[status] ?? status ?? "—";

  return (
    <div className={styles.card}>
      <p className={styles.sectionLabel}>Employment</p>
      <div className={styles.row}>
        <div className={styles.item}>
          <span className={styles.key}>Employment Status</span>
          <Tag color={statusColor} className={styles.tag}>
            {statusLabel}
          </Tag>
        </div>
        <div className={styles.divider} />
        <div className={styles.item}>
          <span className={styles.key}>Department</span>
          <span className={styles.value}>{data?.department_name ?? "—"}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.item}>
          <span className={styles.key}>Designation</span>
          <span className={styles.value}>{data?.designation_name ?? "—"}</span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeStatusComp;
