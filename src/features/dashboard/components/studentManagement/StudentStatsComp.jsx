import { Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { QK_STUDENT_STATS } from "../../../../config/queryKeyConfig";
import styles from "../../styles/StudentManagementPage.module.css";

const StudentStatsComp = () => {
  const { data } = useQuery({
    queryKey: [QK_STUDENT_STATS],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_student_stats");
      if (error) throw error;
      return data;
    },
  });

  const statsData = [
    {
      icon: "fi fi-rr-graduation-cap",
      iconBg: "#eff6ff",
      iconColor: "#2563eb",
      label: "TOTAL STUDENTS",
      value: data?.total?.toLocaleString() ?? "—",
      badge: { text: "All Time", color: "blue" },
    },
    {
      icon: "fi fi-rr-chalkboard-user",
      iconBg: "#f0fdf4",
      iconColor: "#16a34a",
      label: "ACTIVELY ENROLLED",
      value: data?.enrolled?.toLocaleString() ?? "—",
      badge: { text: "Active", color: "green" },
    },
    {
      icon: "fi fi-rr-brain-doubt",
      iconBg: "#fffbeb",
      iconColor: "#d97706",
      label: "EXPRESSING INTEREST",
      value: data?.interested?.toLocaleString() ?? "—",
      badge: { text: "Interested", color: "orange" },
    },
    {
      icon: "fi fi-rr-email-pending",
      iconBg: "#f5f3ff",
      iconColor: "#7c3aed",
      label: "ACCOUNT CREATION MAIL SENT",
      value: data?.pending?.toLocaleString() ?? "—",
      badge: { text: "Pending", color: "purple" },
    },
  ];

  return (
    <div className={styles.statsGrid}>
      {statsData.map((stat) => (
        <div key={stat.label} className={styles.statCard}>
          <div className={styles.statTop}>
            <div
              className={styles.statIconWrap}
              style={{ background: stat.iconBg, color: stat.iconColor }}
            >
              <i className={stat.icon} />
            </div>
            <Tag color={stat.badge.color} className={styles.statBadge}>
              {stat.badge.text}
            </Tag>
          </div>
          <div className={styles.statLabel}>{stat.label}</div>
          <div className={styles.statValue}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default StudentStatsComp;
