import { useState, useRef } from "react";
import { flushSync } from "react-dom";
import { Table, Tag, Button, Tooltip } from "antd";
import { pdf } from "@react-pdf/renderer";
import { ReactQRCode } from "@lglab/react-qr-code";
import styles from "../../styles/MyPaymentHistoryComp.module.css";
import {
  PAYMENT_STATUS,
  PAYMENT_STATUS_COLOR,
  PAYMENT_STATUS_OPTIONS,
} from "../../../../config/statusAndRoleConfig";
import ReceiptPDFDocument from "../financesManagement/ReceiptPDFDocument";
import { showToast } from "../../../../components/layout/CustomToast";
import PayNowModal from "./PayNowModal";

const paymentStatusLabelMap = Object.fromEntries(
  PAYMENT_STATUS_OPTIONS.map(({ value, label }) => [value, label]),
);

const WATERMARK_TEXT = {
  [PAYMENT_STATUS.PENDING]: "UNPAID",
  [PAYMENT_STATUS.VERIFICATION_PENDING]: "VERIFICATION PENDING",
  [PAYMENT_STATUS.PAID]: "PAID",
  [PAYMENT_STATUS.FAILED]: "FAILED",
  [PAYMENT_STATUS.REFUNDED]: "REFUNDED",
};

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

const MyPaymentHistoryComp = ({
  payments,
  loading,
  studentName,
  studentPhone,
}) => {
  const [downloadingId, setDownloadingId] = useState(null);
  const [payNowRecord, setPayNowRecord] = useState(null);
  const [qrDownloadUrl, setQrDownloadUrl] = useState(null);
  const qrRef = useRef(null);

  const handleDownload = async (record) => {
    setDownloadingId(record.receipt_id);
    try {
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
        // logo optional
      }

      let qrCodeSrc = null;
      if (record.payment_status !== PAYMENT_STATUS.PENDING) {
        const qrUrl = `${window.location.origin}/payment/verify/${record.receipt_id}`;
        flushSync(() => setQrDownloadUrl(qrUrl));
        qrCodeSrc = await svgContainerToDataUrl(qrRef.current);
        setQrDownloadUrl(null);
      }

      const blob = await pdf(
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
          paymentMode={record.payment_mode || ""}
          paymentDate={
            record.payment_date ? formatDate(record.payment_date) : ""
          }
          transactionId={record.trxn_id || ""}
          remarks={record.remarks_by_student || ""}
          logoBase64={logoBase64}
          watermarkText={WATERMARK_TEXT[record.payment_status] ?? "UNPAID"}
          qrCodeSrc={qrCodeSrc}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${record.receipt_id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
      showToast("Failed to download receipt.", "error");
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePay = (record) => {
    setPayNowRecord(record);
  };

  const columns = [
    {
      title: "RECEIPT ID",
      dataIndex: "receipt_id",
      key: "receipt_id",
      render: (v) => <span className={styles.receiptId}>{v}</span>,
    },
    {
      title: "DESCRIPTION",
      key: "description",
      render: (_, r) => (
        <div>
          <div className={styles.cellBold}>{r.fee_type_title}</div>
          {r.fee_type_xtra_info && (
            <div className={styles.cellSub}>{r.fee_type_xtra_info}</div>
          )}
        </div>
      ),
    },
    {
      title: "DATE ISSUED",
      dataIndex: "receipt_gen_date",
      key: "receipt_gen_date",
      render: (v) => <span className={styles.cell}>{formatDate(v)}</span>,
    },
    {
      title: "DUE DATE",
      dataIndex: "due_date",
      key: "due_date",
      render: (v) => <span className={styles.cell}>{formatDate(v)}</span>,
    },
    {
      title: "AMOUNT (BDT)",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (v) => (
        <span className={styles.cellBold}>
          {v != null ? Number(v).toLocaleString("en-BD") : "—"}
        </span>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (v) => (
        <Tag color={PAYMENT_STATUS_COLOR[v] ?? "default"}>
          {paymentStatusLabelMap[v] ?? v ?? "—"}
        </Tag>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <div className={styles.actionCell}>
          <Tooltip title="Download Receipt PDF">
            <Button
              size="small"
              className={styles.downloadBtn}
              loading={downloadingId === record.receipt_id}
              onClick={() => handleDownload(record)}
              icon={<i className="fi fi-rr-download"></i>}
            >
              Receipt
            </Button>
          </Tooltip>
          {record.payment_status === PAYMENT_STATUS.PENDING && (
            <Tooltip title="Submit payment details">
              <Button
                size="small"
                type="primary"
                className={styles.payBtn}
                onClick={() => handlePay(record)}
                icon={<i className="fi fi-rr-credit-card"></i>}
              >
                Pay Now
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Hidden QR renderer for PDF extraction */}
      <div
        style={{
          position: "absolute",
          top: -9999,
          left: -9999,
          pointerEvents: "none",
        }}
        ref={qrRef}
      >
        {qrDownloadUrl && (
          <ReactQRCode
            // imageSettings={{
            //   src: "/public/assets/logo_cut_bg.png",
            //   width: 60,
            //   height: 60,
            //   excavate: true,
            //   opacity: 1,
            // }}
            value={qrDownloadUrl}
            size={200}
          />
        )}
      </div>
      <PayNowModal
        open={!!payNowRecord}
        onClose={() => setPayNowRecord(null)}
        record={payNowRecord}
        studentName={studentName}
        studentPhone={studentPhone}
      />
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.title}>Payment History</h3>
            <p className={styles.subtitle}>
              All receipts issued to your account
            </p>
          </div>
          <span className={styles.countBadge}>{payments.length} records</span>
        </div>
        <Table
          className={styles.table}
          dataSource={payments}
          columns={columns}
          rowKey="receipt_id"
          loading={loading}
          pagination={{ pageSize: 10, size: "small", showSizeChanger: false }}
          scroll={{ x: "max-content" }}
          size="small"
          locale={{ emptyText: "No payment records found." }}
        />
      </div>
    </>
  );
};

export default MyPaymentHistoryComp;
