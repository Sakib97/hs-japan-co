import { useState, useEffect } from "react";
import { Select, DatePicker, Button, Modal } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import {
  QK_FEE_TYPES,
  QK_NOTIFICATIONS,
  QK_ALL_TRANSACTIONS,
  QK_MY_PAYMENTS,
  QK_SESSIONS,
} from "../../../../config/queryKeyConfig";
import {
  PAYMENT_STATUS,
  NOTIFICATION_TYPE,
} from "../../../../config/statusAndRoleConfig";
import styles from "../../styles/ReceiptParticularsComp.module.css";
import { showToast } from "../../../../components/layout/CustomToast";
import { generateReceiptId } from "../../../../utils/generateToken";
import { useAuth } from "../../../../context/AuthProvider";
import ReceiptPreviewModal from "./ReceiptPreviewModal";

const ReceiptParticularsComp = ({
  studentName,
  studentEmail,
  studentPhone,
  studentAvatar,
  studentSession,
}) => {
  const [feeType, setFeeType] = useState(null);
  const [otherText, setOtherText] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [receiptId, setReceiptId] = useState(() => generateReceiptId());
  const [sessionValue, setSessionValue] = useState(studentSession ?? null);

  useEffect(() => {
    setSessionValue(studentSession ?? null);
  }, [studentSession]);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: sessionsData = [] } = useQuery({
    queryKey: [QK_SESSIONS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("session")
        .select("session_name")
        .eq("is_active", true)
        .order("order", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const { data: feeTypesData = [] } = useQuery({
    queryKey: [QK_FEE_TYPES, "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fee_type")
        .select("fee_type_title, view_order")
        .eq("is_active", true)
        .order("view_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const feeTypeOptions = [
    ...feeTypesData.map((ft) => ({
      value: ft.fee_type_title,
      label: ft.fee_type_title,
    })),
    { value: "other", label: "Other" },
  ];

  const isOtherSelected = feeType === "other";
  const isFormValid =
    !!studentEmail &&
    !!feeType &&
    (!isOtherSelected || otherText.trim() !== "") &&
    !!dueDate &&
    !!amount;

  const doSend = async () => {
    setSending(true);
    try {
      const feeTitle = feeType === "other" ? otherText.trim() : feeType;
      const dueDateStr = dueDate
        ? typeof dueDate === "string"
          ? dueDate
          : (dueDate.format?.("YYYY-MM-DD") ?? String(dueDate))
        : null;

      const { error } = await supabase.from("student_payment").insert({
        receipt_id: receiptId,
        student_email: studentEmail,
        student_phone: studentPhone || null,
        session: sessionValue,
        receipt_gen_date: new Date().toISOString(),
        fee_type_title: feeTitle,
        fee_type_xtra_info: additionalInfo.trim() || null,
        amount: Number(amount),
        due_date: dueDateStr,
        receipt_gen_by_email: user?.email ?? null,
        payment_status: PAYMENT_STATUS.PENDING,
      });

      if (error) throw error;

      await supabase.from("notifications").insert({
        recipient_email: studentEmail,
        title: "New Payment Due",
        message: `A payment receipt of BDT ${Number(amount).toLocaleString()} for "${feeTitle}" has been issued. Due date: ${dueDateStr ?? "—"}. Refresh Finances page to view details !`,
        type: NOTIFICATION_TYPE.PAYMENT,
        redirection_link: "/dashboard/my-finances",
        recipient_user_type: "student",
      });
      queryClient.invalidateQueries({
        queryKey: [QK_NOTIFICATIONS, studentEmail],
      });
      queryClient.invalidateQueries({
        queryKey: [QK_ALL_TRANSACTIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QK_MY_PAYMENTS, studentEmail],
      });

      showToast("Receipt sent successfully!", "success");
      // Reset form and generate a fresh receipt ID for the next receipt
      setFeeType(null);
      setOtherText("");
      setDueDate(null);
      setAmount("");
      setAdditionalInfo("");
      setReceiptId(generateReceiptId());
    } catch (err) {
      console.error("Failed to save receipt:", err);
      showToast("Failed to send receipt. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  const handleSend = () => {
    if (!isFormValid) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    Modal.confirm({
      title: "Send Receipt",
      content: `Send receipt ${receiptId} to ${studentEmail}?`,
      okText: "Send",
      okType: "primary",
      cancelText: "Cancel",
      onOk: doSend,
    });
  };

  const handleViewReceipt = () => {
    if (!isFormValid) return;
    setPreviewOpen(true);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrap}>
          <i className="fi fi-rr-receipt"></i>
        </div>
        <div>
          <h3 className={styles.title}>Receipt Particulars</h3>
          <p className={styles.subtitle}>Enter transaction details below</p>
        </div>
      </div>

      {/* Faint receipt watermark — behind all content */}
      <div className={styles.watermark}>
        <i className="fa-solid fa-receipt"></i>
      </div>

      {/* Student profile strip */}
      {studentEmail ? (
        <>
          <div
            style={{
              marginBottom: "2px",
              fontSize: "0.78rem",
              color: "#000000",
              fontWeight: "500",
            }}
          >
            Send receipt to:
          </div>
          <div className={styles.studentProfile}>
            <div className={styles.profileAvatar}>
              {studentAvatar ? (
                <img
                  src={studentAvatar}
                  alt={studentName}
                  className={styles.avatarImg}
                />
              ) : (
                <span className={styles.avatarInitials}>
                  {studentName ? studentName.charAt(0).toUpperCase() : "?"}
                </span>
              )}
            </div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>{studentName || "—"}</span>
              <span className={styles.profileMeta}>{studentEmail}</span>
              {studentPhone && (
                <span className={styles.profileMeta}>{studentPhone}</span>
              )}
              {studentSession && (
                <span className={styles.profileMeta}>
                  Session: <strong>{studentSession}</strong>
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.studentProfileEmpty}>
          <i className="fa-solid fa-user-slash"></i>
          <span>No student selected</span>
        </div>
      )}

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.label}>FEE TYPE *</label>
          <Select
            className={styles.select}
            placeholder="Select fee type"
            options={feeTypeOptions}
            value={feeType}
            onChange={(val) => {
              setFeeType(val);
              setOtherText("");
            }}
          />
          {isOtherSelected && (
            <input
              className={`${styles.amountInput} ${styles.otherInput}`}
              type="text"
              placeholder="Describe the fee type (required)"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              autoFocus
            />
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>DUE DATE *</label>
          <DatePicker
            className={styles.datePicker}
            value={dueDate}
            onChange={setDueDate}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>SESSION</label>
          <Select
            className={styles.select}
            placeholder="Select session"
            allowClear
            value={sessionValue}
            onChange={setSessionValue}
            options={sessionsData.map((s) => ({
              value: s.session_name,
              label: s.session_name,
            }))}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>ADDITIONAL INFO (OPTIONAL)</label>
          <input
            className={`${styles.amountInput} ${styles.otherInput}`}
            type="text"
            placeholder="Additional info about the fee (optional)"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>AMOUNT (BDT) *</label>
        <div className={styles.amountWrap}>
          <span className={styles.currencySymbol}>BDT</span>
          <input
            className={styles.amountInput}
            type="number"
            min={0}
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.btnRow}>
        <Button
          className={styles.viewBtn}
          onClick={handleViewReceipt}
          disabled={!isFormValid}
        >
          View Receipt
        </Button>

        <Button
          type="primary"
          className={styles.sendBtn}
          onClick={handleSend}
          loading={sending}
          disabled={!isFormValid}
        >
          SEND RECEIPT TO STUDENT
        </Button>
      </div>

      <ReceiptPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        receiptId={receiptId}
        studentName={studentName}
        studentEmail={studentEmail}
        studentPhone={studentPhone}
        studentSession={sessionValue}
        feeType={feeType}
        dueDate={dueDate}
        amount={amount}
        additionalInfo={additionalInfo}
        otherText={otherText}
      />
    </div>
  );
};

export default ReceiptParticularsComp;
