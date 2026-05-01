import { useState, useRef } from "react";
import { Modal, Button } from "antd";
import styles from "../../styles/ReceiptPreviewModal.module.css";

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
  const printRef = useRef(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank", "width=800,height=900");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt – ${receiptId}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; }
            .receipt { max-width: 680px; margin: 30px auto; padding: 36px 40px; border: 1px solid #ddd; }
            .header { display: flex; align-items: center; gap: 16px; border-bottom: 2px solid #b91c1c; padding-bottom: 16px; margin-bottom: 20px; }
            .logo { width: 56px; height: 56px; object-fit: contain; }
            .company-name { font-size: 1.25rem; font-weight: 800; color: #b91c1c; }
            .company-sub { font-size: 0.72rem; color: #888; }
            .company-addr { font-size: 0.72rem; color: #555; margin-top: 2px; }
            .receipt-title { text-align: center; font-size: 1rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #333; margin: 16px 0; }
            .meta-row { display: flex; justify-content: space-between; font-size: 0.78rem; color: #666; margin-bottom: 18px; }
            .section-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #aaa; margin-bottom: 6px; }
            .info-box { background: #fafafa; border: 1px solid #eee; border-radius: 6px; padding: 12px 14px; margin-bottom: 14px; }
            .info-row { display: flex; justify-content: space-between; font-size: 0.82rem; padding: 4px 0; border-bottom: 1px dashed #f0f0f0; }
            .info-row:last-child { border-bottom: none; }
            .info-key { color: #666; }
            .info-val { font-weight: 600; color: #111; text-align: right; }
            .amount-block { border: 2px solid #b91c1c; border-radius: 6px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .amount-label { font-size: 0.8rem; font-weight: 700; color: #b91c1c; text-transform: uppercase; letter-spacing: 0.06em; }
            .amount-value { font-size: 1.5rem; font-weight: 800; color: #b91c1c; }
            .field-row { margin-bottom: 12px; }
            .field-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #aaa; margin-bottom: 4px; }
            .field-line { border: none; border-bottom: 1px solid #ccc; width: 100%; font-size: 0.9rem; padding: 4px 0; background: transparent; }
            .footer { border-top: 1px solid #eee; margin-top: 24px; padding-top: 14px; text-align: center; font-size: 0.7rem; color: #aaa; }
            .sig-row { display: flex; justify-content: space-between; margin-top: 36px; }
            .sig-box { text-align: center; width: 160px; }
            .sig-line { border-bottom: 1px solid #999; margin-bottom: 6px; height: 36px; }
            .sig-label { font-size: 0.7rem; color: #777; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
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
          <Button className={styles.printBtn} onClick={handlePrint}>
            <i className="fa-solid fa-print" style={{ marginRight: 6 }}></i>
            Print / Save PDF
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>

      {/* ── Receipt ── */}
      <div className={styles.receiptWrap}>
        <div className={styles.receipt} ref={printRef}>
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
            {additionalInfo && feeType !== "other" && (
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

          {/* Student-fillable fields */}
          <div className={styles.sectionLabel}>
            To be completed by student / payer
          </div>
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

          {/* Signatures */}
          <div className={styles.sigRow}>
            <div className={styles.sigBox}>
              <div className={styles.sigLine}></div>
              <div className={styles.sigLabel}>Student Signature</div>
            </div>
            <div className={styles.sigBox}>
              <div className={styles.sigLine}></div>
              <div className={styles.sigLabel}>Authorized Signatory</div>
            </div>
            <div className={styles.sigBox}>
              <div className={styles.sigLine}></div>
              <div className={styles.sigLabel}>Accounts Department</div>
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
        </div>
      </div>
    </Modal>
  );
};

export default ReceiptPreviewModal;
