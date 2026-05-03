import { Tag } from "antd";
import styles from "../../styles/EmployeeManagementPage.module.css";

const statsData = [
  // {
  //   icon: "fi fi-tr-employees",
  //   iconBg: "#fef2f2",
  //   iconColor: "#b91c1c",
  //   label: "TOTAL EMPLOYEES",
  //   value: "1,284",
  //   badge: { text: "", color: "" },
  // },
  // {
  //   icon: "fi fi-tr-graduation-cap",
  //   iconBg: "#eff6ff",
  //   iconColor: "#2563eb",
  //   label: "ACTIVE TODAY",
  //   value: "942",
  //   badge: { text: "Stable", color: "default" },
  // },
  // {
  //   icon: "fi fi-tr-chalkboard-user",
  //   iconBg: "#f0fdfa",
  //   iconColor: "#0d9488",
  //   label: "TRAINING SPECIALISTS",
  //   value: "48",
  //   badge: { text: "High Demand", color: "orange" },
  // },
  // {
  //   icon: "fi fi-tr-file-signature",
  //   iconBg: "#f5f3ff",
  //   iconColor: "#1e293b",
  //   label: "VISA OFFICERS",
  //   value: "156",
  //   badge: { text: "Cap Met", color: "default" },
  // },
];

const EmployeeStatsComp = () => {
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

export default EmployeeStatsComp;
