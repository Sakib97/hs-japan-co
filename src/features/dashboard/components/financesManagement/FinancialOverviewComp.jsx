import { useQuery } from "@tanstack/react-query";
import styles from "../../styles/FinancialOverviewComp.module.css";
import { supabase } from "../../../../config/supabaseClient";
import { PAYMENT_STATUS } from "../../../../config/statusAndRoleConfig";
import { QK_FINANCIAL_OVERVIEW } from "../../../../config/queryKeyConfig";

const FinancialOverviewComp = () => {
  const { data, isLoading } = useQuery({
    queryKey: [QK_FINANCIAL_OVERVIEW],
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("student_payment")
        .select("payment_status, amount");
      if (error) throw new Error(error.message);

      const total = rows.length;
      const paid = rows.filter(
        (r) => r.payment_status === PAYMENT_STATUS.PAID,
      ).length;
      const pending = rows.filter(
        (r) => r.payment_status === PAYMENT_STATUS.PENDING,
      ).length;
      const verificationPending = rows.filter(
        (r) => r.payment_status === PAYMENT_STATUS.VERIFICATION_PENDING,
      ).length;
      const totalCollected = rows
        .filter((r) => r.payment_status === PAYMENT_STATUS.PAID)
        .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

      return { total, paid, pending, verificationPending, totalCollected };
    },
  });

  const totalCollected = data?.totalCollected ?? 0;
  const receiptsCount = data?.total ?? "—";
  const paidCount = data?.paid ?? "—";
  const pendingCount = data?.pending ?? "—";
  const verificationPendingCount = data?.verificationPending ?? "—";

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <i className="fi fi-rr-chart-mixed-up-circle-dollar"></i>
        </div>
        <div>
          <p className={styles.title}>Financial Overview</p>
          <p className={styles.subtitle}>Aggregate collection data</p>
        </div>
      </div>

      <div className={styles.totalBlock}>
        <span className={styles.totalLabel}>TOTAL COLLECTED</span>
        <span className={styles.totalValue}>
          {isLoading ? "—" : `BDT ${totalCollected.toLocaleString()}`}
        </span>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.blue}`}>
          <i className={`fi fi-rr-receipt ${styles.statIcon}`}></i>
          <span className={styles.statValue}>{receiptsCount}</span>
          <span className={styles.statLabel}>Total Receipts</span>
        </div>
        <div className={`${styles.statCard} ${styles.green}`}>
          <i className={`fi fi-rr-badge-check ${styles.statIcon}`}></i>
          <span className={styles.statValue}>{paidCount}</span>
          <span className={styles.statLabel}>Paid</span>
        </div>
        <div className={`${styles.statCard} ${styles.orange}`}>
          <i className={`fi fi-rr-clock ${styles.statIcon}`}></i>
          <span className={styles.statValue}>{pendingCount}</span>
          <span className={styles.statLabel}>Payment Pending</span>
        </div>
        <div className={`${styles.statCard} ${styles.yellow}`}>
          <i className={`fi fi-rr-search ${styles.statIcon}`}></i>
          <span className={styles.statValue}>{verificationPendingCount}</span>
          <span className={styles.statLabel}>Pending Verification</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverviewComp;
