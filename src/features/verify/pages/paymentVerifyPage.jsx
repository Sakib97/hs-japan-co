import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Spin, Tag } from "antd";
import { supabase } from "../../../config/supabaseClient";
import {
  PAYMENT_STATUS,
  PAYMENT_STATUS_COLOR,
} from "../../../config/statusAndRoleConfig";
import { QK_VERIFY_RECEIPT } from "../../../config/queryKeyConfig";
import styles from "../styles/PaymentVerifyPage.module.css";

const COMPANY = {
  name: "HS Japan Academy",
  tagline: "Your Door to the Better Future",
  logo: "/assets/logo_cut_nobg.png",
};

const STATUS_META = {
  [PAYMENT_STATUS.PAID]: {
    icon: "fi fi-rr-badge-check",
    label: "Payment Verified",
    sub: "This receipt has been verified and marked as paid.",
    cls: "paid",
  },
  [PAYMENT_STATUS.PENDING]: {
    icon: "fi fi-rr-clock",
    label: "Payment Pending",
    sub: "This payment has not been processed yet.",
    cls: "pending",
  },
  [PAYMENT_STATUS.VERIFICATION_PENDING]: {
    icon: "fi fi-rr-search",
    label: "Verification Pending",
    sub: "Payment has been submitted and is under review.",
    cls: "verification_pending",
  },
  [PAYMENT_STATUS.FAILED]: {
    icon: "fi fi-rr-circle-xmark",
    label: "Payment Failed",
    sub: "This transaction was unsuccessful.",
    cls: "failed",
  },
  [PAYMENT_STATUS.REFUNDED]: {
    icon: "fi fi-rr-undo",
    label: "Payment Refunded",
    sub: "This transaction has been refunded.",
    cls: "refunded",
  },
};

const formatDate = (d) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Row = ({ label, value, full = false }) => (
  <div className={full ? styles.gridItemFull : styles.gridItem}>
    <p className={styles.itemKey}>{label}</p>
    {value ? (
      <p className={styles.itemVal}>{value}</p>
    ) : (
      <p className={styles.itemValMuted}>—</p>
    )}
  </div>
);

const PaymentVerifyPage = () => {
  const { receiptId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: [QK_VERIFY_RECEIPT, receiptId],
    queryFn: async () => {
      // Fetch payment record
      const { data: payment, error: payErr } = await supabase
        .from("student_payment")
        .select("*")
        .eq("receipt_id", receiptId)
        .single();

      if (payErr || !payment) throw new Error("Receipt not found.");

      // Fetch student name + avatar
      const { data: student } = await supabase
        .from("student")
        .select("name, avatar_url")
        .eq("email", payment.student_email)
        .single();

      return { payment, student: student ?? null };
    },
    enabled: !!receiptId,
    retry: false,
  });

  const payment = data?.payment;
  const student = data?.student;
  const statusMeta =
    STATUS_META[payment?.payment_status] ?? STATUS_META[PAYMENT_STATUS.PENDING];

  const initials = (student?.name ?? payment?.student_email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <img
          src={COMPANY.logo}
          alt={COMPANY.name}
          className={styles.logo}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <div className={styles.headerText}>
          <p className={styles.brandName}>{COMPANY.name}</p>
          <p className={styles.brandTagline}>{COMPANY.tagline}</p>
        </div>
      </div>

      {isLoading && (
        <div className={styles.loadingWrap}>
          <Spin size="large" />
          <span>Loading receipt...</span>
        </div>
      )}

      {isError && (
        <div className={styles.errorWrap}>
          <i className={`${styles.errorIcon} fi fi-rr-triangle-warning`} />
          <span>Receipt not found or invalid QR code.</span>
          <span style={{ fontSize: "0.72rem", color: "#bbb" }}>
            ID: {receiptId}
          </span>
        </div>
      )}

      {payment && (
        <div className={styles.container}>
          {/* Status Banner */}
          <div className={`${styles.statusBanner} ${styles[statusMeta.cls]}`}>
            <i className={`${styles.statusIcon} ${statusMeta.icon}`} />
            <p className={styles.statusLabel}>{statusMeta.label}</p>
            <p className={styles.statusSub}>{statusMeta.sub}</p>
          </div>

          {/* Student Info */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>Student</p>
            <div className={styles.studentRow}>
              {student?.avatar_url ? (
                <img
                  src={student.avatar_url}
                  alt={student.name}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarFallback}>{initials}</div>
              )}
              <div>
                <p className={styles.studentName}>{student?.name ?? "—"}</p>
                <p className={styles.studentMeta}>
                  {payment.student_email}
                  {payment.student_phone && (
                    <> &middot; {payment.student_phone}</>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>Transaction Details</p>
            <div className={styles.grid}>
              <Row
                label="Receipt ID"
                value={
                  <span className={styles.receiptId}>{payment.receipt_id}</span>
                }
              />
              <Row
                label="Status"
                value={
                  <Tag
                    color={
                      PAYMENT_STATUS_COLOR[payment.payment_status] ?? "default"
                    }
                  >
                    {payment.payment_status?.replace(/_/g, " ").toUpperCase() ??
                      "—"}
                  </Tag>
                }
              />
              <Row
                label="Amount (BDT)"
                value={
                  payment.amount != null ? (
                    <span className={styles.amount}>
                      BDT {Number(payment.amount).toLocaleString()}
                    </span>
                  ) : null
                }
              />
              <Row label="Fee Type" value={payment.fee_type_title} />
              {payment.fee_type_xtra_info && (
                <Row
                  label="Additional Info"
                  value={payment.fee_type_xtra_info}
                  full
                />
              )}
              {/* <Row
                label="Date Issued"
                value={formatDate(payment.receipt_gen_date)}
              />
              <Row label="Due Date" value={formatDate(payment.due_date)} /> */}
              {payment.payment_date && (
                <Row
                  label="Payment Date"
                  value={formatDate(payment.payment_date)}
                />
              )}
              {payment.payment_mode && (
                <Row label="Payment Mode" value={payment.payment_mode} />
              )}
              {payment.trxn_id && (
                <Row label="Transaction ID" value={payment.trxn_id} full />
              )}
              {payment.remarks_by_student && (
                <Row
                  label="Student Remarks"
                  value={payment.remarks_by_student}
                  full
                />
              )}
              <Row label="Generated By" value={payment.receipt_gen_by_email} />
              <Row
                label="Verified By"
                value={payment.receipt_verified_by_email}
              />
            </div>
          </div>

          {/* Footer */}
          <p className={styles.footer}>
            This is an auto-generated verification page for receipt{" "}
            <strong>{payment.receipt_id}</strong>.
            <br />
            For queries, contact {COMPANY.name}.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentVerifyPage;
