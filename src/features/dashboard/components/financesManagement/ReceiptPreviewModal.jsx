import { useState } from "react";
import { Modal, Button, Divider } from "antd";
import { pdf } from "@react-pdf/renderer";
import styles from "../../styles/ReceiptPreviewModal.module.css";
import ReceiptPDFDocument from "./ReceiptPDFDocument";

const COMPANY = {
  name: "HS Japan Academy",
  tagline: "Your Door to the Better Future",
  address: "123 Academy Road, Dhaka-1200, Bangladesh",
  email: "info@hsjapanacademy.com",
  phone: "+880 1XXXXXXXXX",
  logo: "/assets/logo_cut_nobg.png",
};

const PAYMENT_MODES = [
  "Cash",
  "Bank Transfer",
  "Mobile Banking (bKash)",
  "Mobile Banking (Nagad)",
  "Cheque",
  "Online Gateway",
  "Other",
];

const ReceiptPreviewModal = ({
  open,
  onClose,
  receiptId,
  studentName,
  studentEmail,
  studentPhone,
  studentSession,
  feeType,
  otherText,
  dueDate,
  amount,
  additionalInfo,
}) => {
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // fetch logo and convert to base64 so react-pdf can embed it
      let logoBase64 = null;
      try {
        const res = await fetch("/assets/logo_cut_nobg.png");
        const blob = await res.blob();
        logoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (_) {
        // logo optional — proceed without it
      }

      const blob = await pdf(
        <ReceiptPDFDocument
          receiptId={receiptId}
          issuedDate={issuedDate}
          studentName={studentName}
          studentEmail={studentEmail}
          studentPhone={studentPhone}
          studentSession={studentSession}
          feeType={feeType}
          otherText={otherText}
          formattedDueDate={formattedDueDate}
          amount={amount}
          additionalInfo={additionalInfo}
          paymentMode={paymentMode}
          paymentDate={paymentDate}
          transactionId={transactionId}
          remarks={remarks}
          logoBase64={logoBase64}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${receiptId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const formattedDueDate = dueDate
    ? typeof dueDate === "string"
      ? dueDate
      : (dueDate.format?.("DD MMM YYYY") ?? String(dueDate))
    : "—";

  const issuedDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      title={null}
      className={styles.modal}
      destroyOnClose
    >
      {/* ── Action bar ── */}
      <div className={styles.actionBar}>
        <span className={styles.actionTitle}>
          <i className="fa-solid fa-receipt" style={{ marginRight: 6 }}></i>
          Receipt Preview
        </span>
        <div className={styles.actionBtns}>
          <Button
            className={styles.printBtn}
            onClick={handleDownloadPDF}
            loading={downloading}
          >
            <i className="fi fi-rr-down-to-line" style={{ fontSize: 16, marginRight: 1 }}></i>
            Download PDF
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>

      {/* ── Receipt ── */}
      <div className={styles.receiptWrap}>
        <div className={styles.receipt}>
          {/* Header */}
          <div className={styles.header}>
            <img src={COMPANY.logo} alt="Logo" className={styles.logo} />
            <div className={styles.companyInfo}>
              <div className={styles.companyName}>{COMPANY.name}</div>
              <div className={styles.companyTagline}>{COMPANY.tagline}</div>
              <div className={styles.companyAddr}>
                {COMPANY.address} &nbsp;|&nbsp; {COMPANY.email} &nbsp;|&nbsp;{" "}
                {COMPANY.phone}
              </div>
            </div>
          </div>

          {/* Receipt title + meta */}
          <div className={styles.receiptTitle}>FEE RECEIPT</div>
          <div className={styles.metaRow}>
            <span>
              <strong>Receipt ID:</strong> {receiptId}
            </span>
            <span>
              <strong>Issued:</strong> {issuedDate}
            </span>
          </div>

          {/* Student info */}
          <div className={styles.sectionLabel}>Student Information</div>
          <div className={styles.infoBox}>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>Full Name</span>
              <span className={styles.infoVal}>{studentName || "—"}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>Email</span>
              <span className={styles.infoVal}>{studentEmail || "—"}</span>
            </div>
            {studentPhone && (
              <div className={styles.infoRow}>
                <span className={styles.infoKey}>Phone</span>
                <span className={styles.infoVal}>{studentPhone}</span>
              </div>
            )}
            {studentSession && (
              <div className={styles.infoRow}>
                <span className={styles.infoKey}>Session</span>
                <span className={styles.infoVal}>{studentSession}</span>
              </div>
            )}
          </div>

          {/* Fee details */}
          <div className={styles.sectionLabel}>Fee Details</div>
          <div className={styles.infoBox}>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>Fee Type</span>
              <span className={styles.infoVal}>
                {feeType === "other" ? otherText || "Other" : feeType}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>Due Date</span>
              <span className={styles.infoVal}>{formattedDueDate}</span>
            </div>
            {additionalInfo && (
              <div className={styles.infoRow}>
                <span className={styles.infoKey}>Additional Info</span>
                <span className={styles.infoVal}>{additionalInfo}</span>
              </div>
            )}
          </div>

          {/* Amount */}
          <div className={styles.amountBlock}>
            <span className={styles.amountLabel}>Total Amount Due</span>
            <span className={styles.amountValue}>
              BDT {Number(amount).toLocaleString("en-BD")}
            </span>
          </div>

          <Divider
            variant="dashed"
            style={{
              borderColor: "#000000",
              margin: "0 0 30px 0",
              fontSize: "12px",
            }}
            dashed
          >
            TO BE FILLED BY STUDENT / PAYER
          </Divider>

          {/* Student-fillable fields */}
          {/* <div className={styles.sectionLabel}>
            To be completed by student / payer
          </div> */}
          <div className={styles.fillGrid}>
            <div className={styles.fillField}>
              <label className={styles.fillLabel}>Mode of Payment</label>
              <select
                className={styles.fillSelect}
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="">— Select —</option>
                {PAYMENT_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.fillField}>
              <label className={styles.fillLabel}>Payment Date</label>
              <input
                className={styles.fillInput}
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
            <div className={styles.fillField}>
              <label className={styles.fillLabel}>
                Transaction / Reference ID
              </label>
              <input
                className={styles.fillInput}
                type="text"
                placeholder="e.g. TXN123456789"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>
            <div className={styles.fillField}>
              <label className={styles.fillLabel}>Remarks (optional)</label>
              <input
                className={styles.fillInput}
                type="text"
                placeholder="Any additional remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>


          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.footerText}>
              {COMPANY.name} &nbsp;&bull;&nbsp; {COMPANY.address}
            </div>
            <div className={styles.footerText}>
              {COMPANY.email} &nbsp;&bull;&nbsp; {COMPANY.phone}
            </div>
            <div className={styles.footerNote}>
              This is a computer-generated receipt. Please retain for your
              records.
            </div>
          </div>

          {/* UNPAID watermark */}
          <div className={styles.watermark}>
            <span className={styles.watermarkText}>UNPAID</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiptPreviewModal;
