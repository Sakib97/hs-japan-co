import { useState, useRef, useEffect } from "react";
import { Modal, Button, Select, DatePicker, Input, Checkbox } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { pdf } from "@react-pdf/renderer";
import { useQueryClient } from "@tanstack/react-query";
import { ReactQRCode } from "@lglab/react-qr-code";
import dayjs from "dayjs";
import { supabase } from "../../../../config/supabaseClient";
import { QK_MY_PAYMENTS } from "../../../../config/queryKeyConfig";
import { IMAGE_SIZES } from "../../../../config/imageSizeConfig";
import { showToast } from "../../../../components/layout/CustomToast";
import { uploadImage } from "../../../../utils/handleImage";
import ReceiptPDFDocument from "../financesManagement/ReceiptPDFDocument";
import styles from "../../styles/PayNowModal.module.css";

const { TextArea } = Input;

const PAYMENT_MODES = [
  "Cash",
  "Bank Transfer",
  "Mobile Banking (bKash)",
  "Mobile Banking (Nagad)",
  "Cheque",
  "Online Gateway",
  //   "Other",
];

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const svgContainerToDataUrl = (container) =>
  new Promise((resolve) => {
    if (!container) return resolve(null);
    const svg = container.querySelector("svg");
    if (!svg) return resolve(null);
    const svgString = new XMLSerializer().serializeToString(svg);
    const svgDataUrl = `data:image/svg+xml;base64,${btoa(
      unescape(encodeURIComponent(svgString)),
    )}`;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 200, 200);
      ctx.drawImage(img, 0, 0, 200, 200);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(svgDataUrl);
    img.src = svgDataUrl;
  });

const PayNowModal = ({ open, onClose, record, studentName, studentPhone }) => {
  const queryClient = useQueryClient();
  const qrRef = useRef(null);
  const fileInputRef = useRef(null);

  const [paymentMode, setPaymentMode] = useState(null);
  const [paymentDate, setPaymentDate] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [verified, setVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const MAX_PROOF_SIZE = IMAGE_SIZES.PAYMENT_PROOF.maxBytes;
  const MAX_PROOF_LABEL = IMAGE_SIZES.PAYMENT_PROOF.label;

  useEffect(() => {
    if (!open) {
      setPaymentMode(null);
      setPaymentDate(null);
      setTransactionId("");
      setRemarks("");
      setVerified(false);
      setPaymentProofFile(null);
      setPaymentProofPreview(null);
    }
  }, [open]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Invalid file type. Please upload an image.", "error");
      return;
    }
    if (file.size > MAX_PROOF_SIZE) {
      showToast(`Image too large. Max allowed: ${MAX_PROOF_LABEL}.`, "error");
      return;
    }
    setPaymentProofFile(file);
    setPaymentProofPreview(URL.createObjectURL(file));
  };

  const handleRemoveProof = () => {
    setPaymentProofFile(null);
    setPaymentProofPreview(null);
  };

  if (!record) return null;

  const qrValue = `${window.location.origin}/payment/verify/${record.receipt_id}`;
  const isFormValid = !!paymentMode && !!paymentDate && verified;

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setSubmitting(true);
    try {
      const paymentDateStr = paymentDate.format("YYYY-MM-DD");
      let payment_proof_image_url = null;
      let payment_proof_image_size = null;

      // Upload payment proof image if provided
      if (paymentProofFile) {
        setUploading(true);
        try {
          payment_proof_image_url = await uploadImage(
            paymentProofFile,
            "combined_page_images",
            "payment_proof",
          );
          payment_proof_image_size = paymentProofFile.size;
        } catch (imgErr) {
          console.error("Image upload failed:", imgErr);
          showToast("Failed to upload payment proof image.", "error");
          setUploading(false);
          setSubmitting(false);
          return;
        }
        setUploading(false);
      }

      const { error } = await supabase.rpc("submit_student_payment", {
        p_receipt_id: record.receipt_id,
        p_payment_mode: paymentMode,
        p_trxn_id: transactionId.trim(),
        p_payment_date: paymentDateStr,
        p_remarks: remarks.trim(),
        p_payment_proof_image_url: payment_proof_image_url,
        p_payment_proof_image_size: payment_proof_image_size,
      });

      if (error) {
        if (error.message?.includes("PAYMENT_NOT_FOUND")) {
          showToast(
            "Payment record not found or you are not authorized to submit it.",
            "error",
          );
          return;
        }
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: [QK_MY_PAYMENTS] });

      // Generate QR code data URL from hidden SVG
      let qrCodeSrc = null;
      try {
        qrCodeSrc = await svgContainerToDataUrl(qrRef.current);
      } catch (_) {}

      // Fetch logo
      let logoBase64 = null;
      try {
        const res = await fetch("/assets/logo_cut_nobg.png");
        const blob = await res.blob();
        logoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (_) {}

      // Download updated PDF
      const pdfBlob = await pdf(
        <ReceiptPDFDocument
          receiptId={record.receipt_id}
          issuedDate={formatDate(record.receipt_gen_date)}
          studentName={studentName || record.student_email}
          studentEmail={record.student_email}
          studentPhone={record.student_phone || studentPhone || ""}
          feeType={record.fee_type_title}
          otherText=""
          formattedDueDate={formatDate(record.due_date)}
          amount={record.amount}
          additionalInfo={record.fee_type_xtra_info || ""}
          paymentMode={paymentMode}
          paymentDate={paymentDate.format("DD MMM YYYY")}
          transactionId={transactionId.trim()}
          remarks={remarks.trim()}
          logoBase64={logoBase64}
          watermarkText="VERIFICATION PENDING"
          qrCodeSrc={qrCodeSrc}
        />,
      ).toBlob();

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${record.receipt_id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      showToast("Payment submitted for verification!", "success");
      onClose();
    } catch (err) {
      console.error("Payment submission failed:", err);
      showToast("Failed to submit payment. Please try again.", "error");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <>
      {/* Hidden QR code rendered for PDF extraction */}
      <div className={styles.hiddenQr} ref={qrRef}>
        <ReactQRCode
          // imageSettings={{
          //     src: "/assets/logo_cut_nobg.png",
          //     width: 40,
          //     height: 40,
          //     excavate: true,
          // }}
          value={qrValue}
          size={200}
        />
      </div>

      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width={520}
        // centered
        title={
          <div className={styles.modalHeader}>
            <i
              className="fa-solid fa-credit-card"
              style={{ color: "#b91c1c" }}
            />
            <span className={styles.modalTitle}>Submit Payment</span>
          </div>
        }
        closable
        // destroyOnClose
        destroyOnHidden
        className={styles.modal}
        styles={{
          body: {
            maxHeight: "80vh",
            overflowY: "auto",
          },
        }}
      >
        {/* Header */}
        {/* <div className={styles.modalHeader}>
          <i className="fa-solid fa-credit-card" style={{ color: "#b91c1c" }} />
          <span className={styles.modalTitle}>Submit Payment</span>
        </div> */}

        {/* Receipt summary */}
        <div className={styles.summaryBox}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Receipt ID</span>
            <span className={styles.summaryVal}>{record.receipt_id}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Fee</span>
            <span className={styles.summaryVal}>{record.fee_type_title}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Session</span>
            <span className={styles.summaryVal}>{record.session}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Due Date</span>
            <span className={styles.summaryVal}>
              {formatDate(record.due_date)}
            </span>
          </div>
          <div className={`${styles.summaryRow} ${styles.summaryAmountRow}`}>
            <span className={styles.summaryKey}>Amount</span>
            <span className={styles.summaryAmount}>
              BDT {Number(record.amount).toLocaleString("en-BD")}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className={styles.form}>
          <div className={styles.formRow}>
            <label className={styles.label}>
              Mode of Payment <span className={styles.req}>*</span>
            </label>
            <Select
              className={styles.select}
              placeholder="Select payment mode"
              value={paymentMode}
              onChange={setPaymentMode}
              options={PAYMENT_MODES.map((m) => ({ value: m, label: m }))}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>
              Payment Date <span className={styles.req}>*</span>
            </label>
            <DatePicker
              className={styles.datePicker}
              placeholder="Select date"
              value={paymentDate}
              onChange={setPaymentDate}
              disabledDate={(d) => d && d.isAfter(dayjs(), "day")}
              format="DD MMM YYYY"
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Transaction / Reference ID</label>
            <Input
              placeholder="e.g. TXN123456"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Remarks</label>
            <TextArea
              rows={2}
              placeholder="Optional notes about the payment"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Payment Proof</label>
            {paymentProofPreview ? (
              <div className={styles.proofWrapper}>
                <img
                  src={paymentProofPreview}
                  className={styles.proofPreview}
                  alt="payment proof"
                  onClick={() => fileInputRef.current.click()}
                />
                <button
                  className={styles.proofRemoveBtn}
                  onClick={handleRemoveProof}
                  type="button"
                  title="Remove image"
                >
                  <CloseOutlined />
                </button>
              </div>
            ) : (
              <div
                className={styles.proofUploadBox}
                onClick={() => fileInputRef.current.click()}
              >
                <div className={styles.proofPlaceholder}>
                  + Add Payment Proof
                </div>
              </div>
            )}
            <span className={styles.sizeHint}>
              Optional · Max {MAX_PROOF_LABEL} · Recommended: 800 × 600 px
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.hiddenInput}
              onChange={handleFileChange}
            />
          </div>

          <div className={styles.verifyRow}>
            <Checkbox
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
            >
              <span className={styles.verifyText}>
                I confirm that all the above information is correct and
                accurate.
              </span>
            </Checkbox>
          </div>
        </div>

        {/* Footer actions */}
        <div className={styles.actions}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="primary"
            className={styles.submitBtn}
            disabled={!isFormValid}
            loading={submitting || uploading}
            onClick={handleSubmit}
          >
            Submit &amp; Download Receipt
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default PayNowModal;
