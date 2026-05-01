import { useState } from "react";
import { Select, Progress } from "antd";
import { CaretUpOutlined } from "@ant-design/icons";
import styles from "../../styles/FinancialOverviewComp.module.css";

const MONTH_OPTIONS = [
  { value: "2023-11", label: "NOV 2023" },
  { value: "2023-10", label: "OCT 2023" },
  { value: "2023-09", label: "SEP 2023" },
];

const FinancialOverviewComp = () => {
  const [month, setMonth] = useState("2023-11");

  // Placeholder data — replace with useQuery when DB is ready
  const totalCollected = 12450000;
  const growthPercent = 14.2;
  const receiptsCount = 284;
  const pendingCount = 12;
  const targetProgress = 78;
  const target = "¥16M";

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.overviewLabel}>FINANCIAL</p>
          <p className={styles.overviewLabel}>OVERVIEW</p>
          <p className={styles.overviewSub}>Aggregate collection data.</p>
        </div>
        <Select
          className={styles.monthSelect}
          value={month}
          onChange={setMonth}
          options={MONTH_OPTIONS}
          size="small"
        />
      </div>

      <div className={styles.totalBlock}>
        <span className={styles.totalLabel}>TOTAL COLLECTED</span>
        <span className={styles.totalValue}>
          ¥{totalCollected.toLocaleString()}
        </span>
        <span className={styles.growth}>
          <CaretUpOutlined className={styles.growthIcon} />+{growthPercent}%
          FROM LAST MONTH
        </span>
      </div>

      <div className={styles.statRow}>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{receiptsCount}</span>
          <span className={styles.statLabel}>RECEIPTS</span>
        </div>
        <div className={`${styles.statBox} ${styles.statBoxRight}`}>
          <span className={styles.statValue}>{pendingCount}</span>
          <span className={styles.statLabel}>PENDING</span>
        </div>
      </div>

      <div className={styles.progressSection}>
        <span className={styles.progressLabel}>TARGET PROGRESS</span>
        <Progress
          percent={targetProgress}
          showInfo={false}
          strokeColor="#e8533a"
          trailColor="#f0f0f0"
          size={["100%", 6]}
        />
        <div className={styles.progressMeta}>
          <span>Current: {targetProgress}%</span>
          <span>Target: {target}</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverviewComp;
