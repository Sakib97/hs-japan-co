import { Tag, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { QK_STUDENT_PERSONAL } from "../../../../config/queryKeyConfig";
import {
  STUDENT_STATUS_COLOR,
  STUDENT_STATUS_OPTIONS,
} from "../../../../config/statusAndRoleConfig";
import styles from "../../styles/StudentManagementPage.module.css";
import { useAuth } from "../../../../context/AuthProvider";


const statusLabelMap = Object.fromEntries(
  STUDENT_STATUS_OPTIONS.map(({ value, label }) => [value, label]),
);

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const StudentEnrollmentStatusComp = ({ email }) => {
  const { studentStatus } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: [QK_STUDENT_PERSONAL, email, "enrollment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student")
        .select("status, created_at")
        .eq("email", email)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!email,
  });

  if (isLoading) {
    return (
      <div className={styles.enrollCard}>
        <Spin size="small" />
      </div>
    );
  }

  const statusColor = STUDENT_STATUS_COLOR[studentStatus ?? data?.status] ?? "default";
  const statusLabel = statusLabelMap[studentStatus ?? data?.status] ?? studentStatus ?? data?.status ?? "—";

  return (
    <div className={styles.enrollCard}>
      <p className={styles.enrollSectionLabel}>Enrollment</p>
      <div className={styles.enrollRow}>
        <div className={styles.enrollItem}>
          <span className={styles.enrollKey}>Current Status</span>
          <Tag color={statusColor} className={styles.enrollTag}>
            {statusLabel}
          </Tag>
        </div>
        <div className={styles.enrollDivider} />
        <div className={styles.enrollItem}>
          <span className={styles.enrollKey}>Registered On</span>
          <span className={styles.enrollValue}>
            {formatDate(data?.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentEnrollmentStatusComp;
