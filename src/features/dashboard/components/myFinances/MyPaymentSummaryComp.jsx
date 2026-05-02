import { PAYMENT_STATUS } from "../../../../config/statusAndRoleConfig";
import styles from "../../styles/MyPaymentSummaryComp.module.css";

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatBDT = (num) => `BDT ${Number(num).toLocaleString("en-BD")}`;

const MyPaymentSummaryComp = ({ payments, loading }) => {
  if (loading) {
    return (
      <div className={styles.summaryRow}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.card}>
            <div className={styles.skeleton} />
          </div>
        ))}
      </div>
    );
  }

  const totalPaid = payments
    .filter((p) => p.payment_status === PAYMENT_STATUS.PAID)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const pendingBalance = payments
    .filter((p) => p.payment_status === PAYMENT_STATUS.PENDING)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const nextDue =
    payments
      .filter((p) => p.payment_status === PAYMENT_STATUS.PENDING && p.due_date)
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))[0] ?? null;

  return (
    <div className={styles.summaryRow}>
      {/* Total Paid */}
      <div className={styles.card}>
        <div className={styles.cardIcon}>
          <i className="fa-solid fa-circle-check"></i>
        </div>
        <div className={styles.cardLabel}>TOTAL PAID</div>
        <div className={styles.cardValue}>{formatBDT(totalPaid)}</div>
      </div>

      {/* Pending Balance */}
      <div className={styles.card}>
        <div className={`${styles.cardIcon} ${styles.pendingIcon}`}>
          <i className="fa-solid fa-hourglass-half"></i>
        </div>
        <div className={styles.cardLabel}>PENDING BALANCE</div>
        <div className={`${styles.cardValue} ${styles.pendingValue}`}>
          {formatBDT(pendingBalance)}
        </div>
      </div>

      {/* Next Payment Due */}
      <div className={`${styles.card} ${styles.nextDueCard}`}>
        <div className={styles.cardIcon}>
          <i className="fa-solid fa-calendar-days"></i>
        </div>
        <div className={`${styles.cardLabel} ${styles.nextDueLabel}`}>
          NEXT PAYMENT DUE
        </div>
        {nextDue ? (
          <>
            <div className={`${styles.cardValue} ${styles.nextDueValue}`}>
              {formatDate(nextDue.due_date)}
            </div>
            <div className={styles.nextDueDesc}>{nextDue.fee_type_title}</div>
          </>
        ) : (
          <div className={`${styles.cardValue} ${styles.nextDueValue}`}>
            No pending dues
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPaymentSummaryComp;
