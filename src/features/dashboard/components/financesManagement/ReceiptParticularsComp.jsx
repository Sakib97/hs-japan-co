import { useState } from "react";
import { Select, DatePicker, Button } from "antd";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { QK_FEE_TYPES } from "../../../../config/queryKeyConfig";
import styles from "../../styles/ReceiptParticularsComp.module.css";
import { showToast } from "../../../../components/layout/CustomToast";
import { generateReceiptId } from "../../../../utils/generateToken";
import ReceiptPreviewModal from "./ReceiptPreviewModal";

const ReceiptParticularsComp = ({
  studentName,
  studentEmail,
  studentPhone,
  studentAvatar,
}) => {
  const [feeType, setFeeType] = useState(null);
  const [otherText, setOtherText] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [receiptId, setReceiptId] = useState("");

  const { data: feeTypesData = [] } = useQuery({
    queryKey: [QK_FEE_TYPES],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fee_type")
        .select("fee_type_title, view_order")
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

  const handleSend = async () => {
    if (!isFormValid) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    setSending(true);
    // TODO: insert into receipts table + send notification email
    showToast("Receipt sent successfully", "success");
    setSending(false);
  };

  const handleViewReceipt = () => {
    if (!isFormValid) return;
    setReceiptId(generateReceiptId());
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
          <label className={styles.label}>ADDITIONAL INFO (OPTIONAL)</label>
          <input
            style={{ marginTop: "-2px" }}
            className={`${styles.amountInput} ${styles.otherInput}`}
            type="text"
            placeholder="Additional info about the fee (optional)"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            autoFocus
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
          SEND RECEIPT &amp; NOTIFY STUDENT
        </Button>
      </div>

      <ReceiptPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        receiptId={receiptId}
        studentName={studentName}
        studentEmail={studentEmail}
        studentPhone={studentPhone}
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
