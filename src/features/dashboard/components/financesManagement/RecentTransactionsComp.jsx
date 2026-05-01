import { Table, Tag } from "antd";
import { Link } from "react-router-dom";
import styles from "../../styles/RecentTransactionsComp.module.css";

const STATUS_COLOR = {
  paid: "success",
  pending: "warning",
  overdue: "error",
  processing: "processing",
};

const columns = [
  {
    title: "DATE",
    dataIndex: "date",
    key: "date",
    render: (v) => <span className={styles.cell}>{v ?? "—"}</span>,
  },
  {
    title: "STUDENT",
    dataIndex: "student_name",
    key: "student_name",
    render: (v) => <span className={styles.cellBold}>{v ?? "—"}</span>,
  },
  {
    title: "FEE TYPE",
    dataIndex: "fee_type_label",
    key: "fee_type_label",
    render: (v) => <span className={styles.cellLink}>{v ?? "—"}</span>,
  },
  {
    title: "AMOUNT (JPY)",
    dataIndex: "amount",
    key: "amount",
    render: (v) => (
      <span className={styles.cell}>
        {v != null ? `¥${Number(v).toLocaleString()}` : "—"}
      </span>
    ),
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    render: (v) => (
      <Tag color={STATUS_COLOR[v?.toLowerCase()] ?? "default"}>
        + {v?.toUpperCase() ?? "—"}
      </Tag>
    ),
  },
];

// Placeholder rows — replace with a real useQuery when DB is ready
const PLACEHOLDER = [
  {
    id: 1,
    date: "Nov 15, 2023",
    student_name: "Haruki Murakami",
    fee_type_label: "Tuition Fee (Sem 1)",
    amount: 450000,
    status: "paid",
  },
  {
    id: 2,
    date: "Nov 14, 2023",
    student_name: "Yuki Sato",
    fee_type_label: "Visa Application",
    amount: 12500,
    status: "paid",
  },
  {
    id: 3,
    date: "Nov 12, 2023",
    student_name: "Akira Ito",
    fee_type_label: "Hostel Deposit",
    amount: 100000,
    status: "pending",
  },
  {
    id: 4,
    date: "Nov 08, 2023",
    student_name: "Naomi Watanabe",
    fee_type_label: "Tuition Fee (Sem 1)",
    amount: 450000,
    status: "overdue",
  },
];

const RecentTransactionsComp = () => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>Recent Transactions</h3>
        <Link className={styles.viewAll} to="#">
          View All →
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={PLACEHOLDER}
        rowKey="id"
        pagination={false}
        size="small"
        className={styles.table}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default RecentTransactionsComp;
