import styles from "../../styles/RecentRecordsComp.module.css";

const STATUS_DOT = {
  approved: styles.dotApproved,
  processing: styles.dotProcessing,
  pending: styles.dotPending,
};

// Placeholder data — replace with useQuery when DB is ready
const RECORDS = [
  {
    id: 1,
    name: "Yuki Sato",
    initials: "YS",
    fee_type_label: "Tuition Fee",
    amount: 450000,
    status: "approved",
  },
  {
    id: 2,
    name: "Akira Ito",
    initials: "AI",
    fee_type_label: "Visa App.",
    amount: 12500,
    status: "approved",
  },
  {
    id: 3,
    name: "Naomi Watanabe",
    initials: "NW",
    fee_type_label: "Hostel Dep.",
    amount: 100000,
    status: "processing",
  },
];

const RecentRecordsComp = () => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>RECENT RECORDS</h3>

      <div className={styles.list}>
        {RECORDS.map((r) => (
          <div key={r.id} className={styles.item}>
            <div className={styles.avatar}>{r.initials}</div>
            <div className={styles.meta}>
              <span className={styles.name}>{r.name}</span>
              <span className={styles.feeType}>{r.fee_type_label}</span>
            </div>
            <div className={styles.right}>
              <span className={styles.amount}>
                ¥{Number(r.amount).toLocaleString()}
              </span>
              <span
                className={`${styles.statusDot} ${STATUS_DOT[r.status] ?? ""}`}
              >
                {r.status?.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRecordsComp;
