import { useState, useRef } from "react";
import { flushSync } from "react-dom";
import {
  Table,
  Tag,
  Input,
  Modal,
  Select,
  Button,
  Descriptions,
  Tooltip,
  Dropdown,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pdf } from "@react-pdf/renderer";
import { ReactQRCode } from "@lglab/react-qr-code";
import styles from "../../styles/AllTransactionsComp.module.css";
import { supabase } from "../../../../config/supabaseClient";
import {
  PAYMENT_STATUS,
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_STATUS_COLOR,
  NOTIFICATION_TYPE,
} from "../../../../config/statusAndRoleConfig";
import {
  QK_ALL_TRANSACTIONS,
  QK_FEE_TYPES,
  QK_NOTIFICATIONS,
} from "../../../../config/queryKeyConfig";
import { showToast } from "../../../../components/layout/CustomToast";
import { useAuth } from "../../../../context/AuthProvider";
import ReceiptPDFDocument from "./ReceiptPDFDocument";

const PAGE_SIZE = 10;

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

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

const AllTransactionsComp = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [viewRecord, setViewRecord] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [qrDownloadUrl, setQrDownloadUrl] = useState(null);
  const qrRef = useRef(null);

  const [statusRecord, setStatusRecord] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedPaymentMonth, setSelectedPaymentMonth] = useState(null);
  const [selectedFeeType, setSelectedFeeType] = useState(null);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null);

  const { data: feeTypesData = [] } = useQuery({
    queryKey: [QK_FEE_TYPES],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fee_type")
        .select("fee_type_title")
        .order("view_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const feeTypeItems = [
    {
      key: "__all__",
      label: <span>All Fee Types</span>,
      onClick: () => {
        setSelectedFeeType(null);
        setCurrentPage(1);
      },
    },
    ...feeTypesData.map((ft) => ({
      key: ft.fee_type_title,
      label: <span>{ft.fee_type_title}</span>,
      onClick: () => {
        setSelectedFeeType(ft.fee_type_title);
        setCurrentPage(1);
      },
    })),
    {
      key: "__other__",
      label: <span>Other</span>,
      onClick: () => {
        setSelectedFeeType("__other__");
        setCurrentPage(1);
      },
    },
  ];

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      QK_ALL_TRANSACTIONS,
      currentPage,
      searchQuery,
      selectedMonth,
      selectedPaymentMonth,
      selectedFeeType,
      selectedPaymentStatus,
    ],
    queryFn: async () => {
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("student_payment")
        .select("*", { count: "exact" })
        .order("receipt_gen_date", { ascending: false })
        .range(from, to);

      if (searchQuery) {
        // Search by email, phone or receipt using ILIKE for partial matches
        query = query.or(
          `student_email.ilike.%${searchQuery}%,student_phone.ilike.%${searchQuery}%,receipt_id.ilike.%${searchQuery}%`,
        );
      }

      if (selectedMonth) {
        const start = selectedMonth.startOf("month").format("YYYY-MM-DD");
        const end = selectedMonth.endOf("month").format("YYYY-MM-DD");
        query = query
          .gte("receipt_gen_date", start)
          .lte("receipt_gen_date", end);
      }

      if (selectedPaymentMonth) {
        const start = selectedPaymentMonth
          .startOf("month")
          .format("YYYY-MM-DD");
        const end = selectedPaymentMonth.endOf("month").format("YYYY-MM-DD");
        query = query.gte("payment_date", start).lte("payment_date", end);
      }

      if (selectedPaymentStatus) {
        query = query.eq("payment_status", selectedPaymentStatus);
      }

      if (selectedFeeType) {
        if (selectedFeeType === "__other__") {
          const knownTitles = feeTypesData.map((ft) => ft.fee_type_title);
          if (knownTitles.length > 0) {
            query = query.not(
              "fee_type_title",
              "in",
              `(${knownTitles.map((t) => `"${t}"`).join(",")})`,
            );
          }
        } else {
          query = query.eq("fee_type_title", selectedFeeType);
        }
      }

      const { data: payments, error, count } = await query;
      if (error) throw new Error(error.message);

      // Enrich with student names via batch lookup
      const rows = payments ?? [];
      const emails = [
        ...new Set(rows.map((r) => r.student_email).filter(Boolean)),
      ];
      let nameMap = {};
      if (emails.length > 0) {
        const { data: students } = await supabase
          .from("student")
          .select("email, name")
          .in("email", emails);
        (students ?? []).forEach((s) => {
          nameMap[s.email] = s.name;
        });
      }

      return {
        rows: rows.map((r) => ({
          ...r,
          student_name: nameMap[r.student_email] ?? null,
        })),
        total: count ?? 0,
      };
    },
  });

  const { mutate: updateStatus, isPending: statusUpdating } = useMutation({
    mutationFn: async ({ receipt_id, payment_status, verified_by_email }) => {
      const { error } = await supabase
        .from("student_payment")
        .update({
          payment_status,
          receipt_verified_by_email: verified_by_email,
        })
        .eq("receipt_id", receipt_id);
      if (error) throw new Error(error.message);
    },
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QK_ALL_TRANSACTIONS] });
      const { receipt_id, payment_status, student_email } = variables;
      const statusLabel =
        paymentStatusLabelMap[payment_status] ?? payment_status;
      try {
        await supabase.from("notifications").insert({
          recipient_email: student_email,
          title: "Payment Status Updated",
          message: `Your payment status for receipt ${receipt_id} has been updated to "${statusLabel}". Visit My Finances for details.`,
          type: NOTIFICATION_TYPE.PAYMENT,
          redirection_link: "/dashboard/my-finances",
          recipient_user_type: "student",
        });
        queryClient.invalidateQueries({
          queryKey: [QK_NOTIFICATIONS, student_email],
        });
      } catch (_err) {
        // silent — notification is non-critical
      }
      showToast("Payment status updated.", "success");
      setStatusRecord(null);
      setSelectedStatus(null);
    },
    onError: (err) => {
      showToast(err.message || "Failed to update status.", "error");
    },
  });

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
          studentName={record.student_name || record.student_email}
          studentEmail={record.student_email}
          studentPhone={record.student_phone || ""}
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
      showToast("Failed to download receipt.", "error");
    } finally {
      setDownloadingId(null);
    }
  };

  const columns = [
    {
      title: "RECEIPT ID",
      dataIndex: "receipt_id",
      key: "receipt_id",
      render: (v) => <span className={styles.cell}>{v ?? "—"}</span>,
    },
    {
      title: "DATE ISSUED",
      dataIndex: "receipt_gen_date",
      key: "receipt_gen_date",
      render: (v) => <span className={styles.cell}>{formatDate(v)}</span>,
    },
    {
      title: "STUDENT",
      key: "student",
      render: (_, r) => (
        <div>
          <div className={styles.cellBold}>
            {r.student_name ?? r.student_email ?? "—"}
          </div>
          <div className={styles.cellSub}>{r.student_email}</div>
          {r.student_phone && (
            <div className={styles.cellSub}>{r.student_phone}</div>
          )}
        </div>
      ),
    },
    {
      title: "FEE TYPE",
      key: "fee_type",
      render: (_, r) => (
        <div>
          <div className={styles.cellLink}>{r.fee_type_title ?? "—"}</div>
          {r.fee_type_xtra_info && (
            <div className={styles.cellSub}>{r.fee_type_xtra_info}</div>
          )}
        </div>
      ),
    },
    {
      title: "AMOUNT (BDT)",
      dataIndex: "amount",
      key: "amount",
      render: (v) => (
        <span className={styles.cell}>
          {v != null ? `BDT ${Number(v).toLocaleString()}` : "—"}
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
      title: "ACTIONS",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Tooltip title="View Details">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => setViewRecord(record)}
            />
          </Tooltip>
          <Tooltip title="Change Status">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setStatusRecord(record);
                setSelectedStatus(record.payment_status);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  const onIssuedMonthChange = (date) => {
    setSelectedMonth(date ?? null);
    setCurrentPage(1);
  };

  const onPaymentMonthChange = (date) => {
    setSelectedPaymentMonth(date ?? null);
    setCurrentPage(1);
  };

  return (
    <div className={styles.card}>
      {/* Hidden QR used during PDF generation */}
      <div
        style={{ position: "absolute", left: -9999, top: -9999 }}
        ref={qrRef}
      >
        {qrDownloadUrl && <ReactQRCode value={qrDownloadUrl} size={200} />}
      </div>

      <div className={styles.cardHeader}>
        <h3 className={styles.title}>Transactions</h3>
        <Button
          type=""
          value="Refresh"
          icon={<i className="fi fi-rr-refresh"></i>}
          size={"medium"}
          onClick={() => {
            setCurrentPage(1);
            queryClient.invalidateQueries({ queryKey: [QK_ALL_TRANSACTIONS] });
          }}
        >
          Refresh
        </Button>
        <Dropdown menu={{ items: feeTypeItems }} placement="bottomLeft">
          <Button
            type={selectedFeeType ? "primary" : ""}
            icon={<i className="fi fi-rr-filter"></i>}
            size={"medium"}
          >
            {selectedFeeType === "__other__"
              ? "Other"
              : (selectedFeeType ?? "Fee Type")}
          </Button>
        </Dropdown>

        <Dropdown
          menu={{
            items: [
              {
                key: "__all__",
                label: <span>All Statuses</span>,
                onClick: () => {
                  setSelectedPaymentStatus(null);
                  setCurrentPage(1);
                },
              },
              ...PAYMENT_STATUS_OPTIONS.map((opt) => ({
                key: opt.value,
                label: <span>{opt.label}</span>,
                onClick: () => {
                  setSelectedPaymentStatus(opt.value);
                  setCurrentPage(1);
                },
              })),
            ],
          }}
          placement="bottomLeft"
        >
          <Button
            type={selectedPaymentStatus ? "primary" : ""}
            icon={<i className="fi fi-rr-filter"></i>}
            size={"medium"}
          >
            {PAYMENT_STATUS_OPTIONS.find(
              (o) => o.value === selectedPaymentStatus,
            )?.label ?? "Payment Status"}
          </Button>
        </Dropdown>

        <DatePicker
          placeholder="Filter By Payment Month"
          className={styles.searchMonthPicker}
          onChange={onPaymentMonthChange}
          picker="month"
          value={selectedPaymentMonth}
        />

        <Input
          placeholder="Search by student email, phone or receipt ID..."
          prefix={<SearchOutlined />}
          className={styles.searchInput}
          allowClear
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          value={searchQuery}
        />
      </div>

      <Table
        columns={columns}
        dataSource={rows}
        rowKey="receipt_id"
        loading={isLoading || isFetching}
        size="small"
        className={styles.table}
        scroll={{ x: "max-content" }}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          total,
          onChange: (page) => setCurrentPage(page),
          showTotal: (t) => `${t} records`,
          showSizeChanger: false,
        }}
      />

      {/* ── View Details Modal ── */}
      <Modal
        open={!!viewRecord}
        onCancel={() => setViewRecord(null)}
        title="Transaction Details"
        bodyStyle={{ maxHeight: "65vh", overflowY: "auto", paddingRight: 4 }}
        footer={[
          <Button
            key="download"
            type="primary"
            loading={downloadingId === viewRecord?.receipt_id}
            onClick={() => handleDownload(viewRecord)}
            icon={<DownloadOutlined />}
          >
            Download Receipt
          </Button>,
          <Button key="close" onClick={() => setViewRecord(null)}>
            Close
          </Button>,
        ]}
        width={700}
        className={styles.transactionDetailsModal}
      >
        {viewRecord && (
          <Descriptions
            column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }}
            size="small"
            bordered
            style={{ marginTop: 12 }}
          >
            <Descriptions.Item label="Receipt ID">
              {viewRecord.receipt_id ?? "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Date Issued">
              {formatDate(viewRecord.receipt_gen_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Student Name">
              {viewRecord.student_name ?? "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Student Email">
              {viewRecord.student_email ?? "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Student Phone">
              {viewRecord.student_phone ?? "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Fee Type">
              {viewRecord.fee_type_title ?? "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Extra Info">
              {viewRecord.fee_type_xtra_info ?? "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Amount (BDT)">
              {viewRecord.amount != null
                ? `BDT ${Number(viewRecord.amount).toLocaleString()}`
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Mode">
              {viewRecord.payment_mode ?? "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Transaction ID">
              {viewRecord.trxn_id ?? "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Due Date">
              {formatDate(viewRecord.due_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Date">
              {formatDate(viewRecord.payment_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  PAYMENT_STATUS_COLOR[viewRecord.payment_status] ?? "default"
                }
              >
                {paymentStatusLabelMap[viewRecord.payment_status] ??
                  viewRecord.payment_status ??
                  "—"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Generated By">
              {viewRecord.receipt_gen_by_email ?? "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Verified By">
              {viewRecord.receipt_verified_by_email ?? "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Student Remarks" span={2}>
              {viewRecord.remarks_by_student ?? "—"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* ── Change Status Modal ── */}
      <Modal
        open={!!statusRecord}
        onCancel={() => {
          setStatusRecord(null);
          setSelectedStatus(null);
        }}
        title="Change Payment Status"
        footer={[
          <Button
            key="save"
            type="primary"
            loading={statusUpdating}
            disabled={
              !selectedStatus || selectedStatus === statusRecord?.payment_status
            }
            onClick={() =>
              updateStatus({
                receipt_id: statusRecord.receipt_id,
                payment_status: selectedStatus,
                verified_by_email: user?.email ?? null,
                student_email: statusRecord.student_email,
              })
            }
          >
            Save
          </Button>,
          <Button
            key="cancel"
            onClick={() => {
              setStatusRecord(null);
              setSelectedStatus(null);
            }}
          >
            Cancel
          </Button>,
        ]}
      >
        {statusRecord && (
          <div style={{ padding: "8px 0" }}>
            <p style={{ marginBottom: 12, fontSize: "0.85rem", color: "#555" }}>
              Receipt: <strong>{statusRecord.receipt_id}</strong>
            </p>
            <Select
              style={{ width: "100%" }}
              options={PAYMENT_STATUS_OPTIONS}
              value={selectedStatus}
              onChange={setSelectedStatus}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllTransactionsComp;
