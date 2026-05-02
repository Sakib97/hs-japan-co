import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const COMPANY = {
  name: "HS Japan Academy",
  tagline: "Your Door to the Better Future",
  address: "123 Academy Road, Dhaka-1200, Bangladesh",
  email: "info@hsjapanacademy.com",
  phone: "+880 1XXXXXXXXX",
};

const RED = "#b91c1c";
const LIGHT_RED = "#fff5f5";
const GREY_BORDER = "#e8e8e8";
const GREY_TEXT = "#666666";
const LIGHT_BG = "#fafafa";

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 14,
    color: "#111111",
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 44,
    backgroundColor: "#ffffff",
  },

  /* ── Header ── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomWidth: 2,
    borderBottomColor: RED,
    borderBottomStyle: "solid",
    paddingBottom: 12,
    marginBottom: 14,
  },
  logo: {
    width: 52,
    height: 52,
    objectFit: "contain",
  },
  companyBlock: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: RED,
    marginBottom: 2,
  },
  companyTagline: {
    fontSize: 9,
    color: "#888888",
    fontStyle: "italic",
    marginBottom: 2,
  },
  companyAddr: {
    fontSize: 7,
    color: GREY_TEXT,
  },

  /* ── Title ── */
  receiptTitle: {
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 3,
    color: "#333333",
    borderTopWidth: 1,
    borderTopColor: GREY_BORDER,
    borderTopStyle: "dashed",
    borderBottomWidth: 1,
    borderBottomColor: GREY_BORDER,
    borderBottomStyle: "dashed",
    paddingVertical: 7,
    marginBottom: 10,
  },

  /* ── Meta row ── */
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metaText: {
    fontSize: 8,
    color: GREY_TEXT,
  },
  metaBold: {
    fontFamily: "Helvetica-Bold",
    color: "#333333",
  },

  /* ── Section label ── */
  sectionLabel: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: "#aaaaaa",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 5,
  },

  /* ── Info box ── */
  infoBox: {
    backgroundColor: LIGHT_BG,
    borderWidth: 1,
    borderColor: GREY_BORDER,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    borderBottomStyle: "dashed",
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoKey: {
    color: GREY_TEXT,
    fontSize: 8.5,
  },
  infoVal: {
    fontFamily: "Helvetica-Bold",
    color: "#111111",
    fontSize: 8.5,
    textAlign: "right",
  },

  /* ── Amount block ── */
  amountBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: RED,
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: LIGHT_RED,
    marginBottom: 18,
  },
  amountLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: RED,
    letterSpacing: 1,
  },
  amountValue: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: RED,
  },

  /* ── Divider ── */
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: GREY_BORDER,
    borderBottomStyle: "dashed",
    marginBottom: 14,
    marginTop: 2,
  },
  dividerLabel: {
    textAlign: "center",
    fontSize: 6.5,
    color: "#000000",
    letterSpacing: 1,
    marginBottom: 10,
  },

  /* ── Fill grid ── */
  fillGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },
  fillField: {
    width: "47%",
  },
  fillLabel: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  fillLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#bbbbbb",
    borderBottomStyle: "solid",
    paddingBottom: 4,
    fontSize: 8.5,
    color: "#333333",
    minHeight: 18,
  },
  fillLineEmpty: {
    color: "#cccccc",
  },

  /* ── Signature row ── */
  sigRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 28,
  },
  sigBox: {
    alignItems: "center",
    width: "28%",
  },
  sigLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#999999",
    width: "100%",
    marginBottom: 5,
    height: 32,
  },
  sigLabel: {
    fontSize: 7,
    color: "#000000",
    textAlign: "center",
  },

  /* ── UNPAID watermark ── */
  watermarkWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    // zIndex: 999,
  },
  watermarkCartouche: {
    borderWidth: 4,
    borderColor: "#b91c1c",
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 12,
    transform: "rotate(-30deg)",
    opacity: 0.12,
  },
  watermarkText: {
    fontFamily: "Helvetica-Bold",
    color: "#b91c1c",
    textAlign: "center",
  },

  /* ── QR code section ── */
  qrSection: {
    alignItems: "center",
    marginBottom: 12,
  },
  qrImage: {
    width: 72,
    height: 72,
  },
  qrCaption: {
    fontSize: 6.5,
    color: "#aaaaaa",
    letterSpacing: 0.5,
    marginTop: 4,
    textAlign: "center",
  },
  qrUrl: {
    fontSize: 6,
    color: "#bbbbbb",
    textAlign: "center",
    marginTop: 2,
  },

  /* ── Footer ── */
  footer: {
    borderTopWidth: 1,
    borderTopColor: GREY_BORDER,
    paddingTop: 10,
    alignItems: "center",
    marginTop: 4,
  },
  footerText: {
    fontSize: 7,
    color: "#aaaaaa",
    marginBottom: 2,
    textAlign: "center",
  },
  footerNote: {
    fontSize: 6.5,
    color: "#cccccc",
    fontStyle: "italic",
    marginTop: 3,
    textAlign: "center",
  },
});

const InfoRow = ({ label, value, last }) => (
  <View style={[s.infoRow, last && s.infoRowLast]}>
    <Text style={s.infoKey}>{label}</Text>
    <Text style={s.infoVal}>{value}</Text>
  </View>
);

const FillField = ({ label, value }) => (
  <View style={s.fillField}>
    <Text style={s.fillLabel}>{label}</Text>
    <View style={s.fillLine}>
      {value ? (
        <Text style={{ fontSize: 8.5, color: "#111" }}>{value}</Text>
      ) : (
        <Text style={{ fontSize: 8.5 }}> </Text>
      )}
    </View>
  </View>
);

const ReceiptPDFDocument = ({
  receiptId,
  issuedDate,
  studentName,
  studentEmail,
  studentPhone,
  feeType,
  otherText,
  formattedDueDate,
  amount,
  additionalInfo,
  paymentMode,
  paymentDate,
  transactionId,
  remarks,
  logoBase64,
  watermarkText = "UNPAID",
  qrCodeSrc = null,
}) => (
  <Document title={`Receipt – ${receiptId}`} author={COMPANY.name}>
    <Page size="A4" style={s.page}>
      {/* Header */}
      <View style={s.header}>
        {logoBase64 ? <Image style={s.logo} src={logoBase64} /> : null}
        <View style={s.companyBlock}>
          <Text style={s.companyName}>{COMPANY.name}</Text>
          <Text style={s.companyTagline}>{COMPANY.tagline}</Text>
          <Text style={s.companyAddr}>
            {COMPANY.address} | {COMPANY.email} | {COMPANY.phone}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text style={s.receiptTitle}>FEE RECEIPT</Text>

      {/* Meta */}
      <View style={s.metaRow}>
        <Text style={s.metaText}>
          <Text style={s.metaBold}>Receipt ID: </Text>
          {receiptId}
        </Text>
        <Text style={s.metaText}>
          <Text style={s.metaBold}>Issued: </Text>
          {issuedDate}
        </Text>
      </View>

      {/* Student info */}
      <Text style={s.sectionLabel}>Student Information</Text>
      <View style={s.infoBox}>
        <InfoRow label="Full Name" value={studentName || "—"} />
        <InfoRow label="Email" value={studentEmail || "—"} />
        {studentPhone ? (
          <InfoRow label="Phone" value={studentPhone} last />
        ) : (
          <InfoRow label="Email" value={studentEmail || "—"} last />
        )}
      </View>

      {/* Fee details */}
      <Text style={s.sectionLabel}>Fee Details</Text>
      <View style={s.infoBox}>
        <InfoRow
          label="Fee Type"
          value={feeType === "other" ? otherText || "Other" : feeType}
        />
        <InfoRow
          label="Due Date"
          value={formattedDueDate}
          last={!additionalInfo}
        />
        {additionalInfo ? (
          <InfoRow label="Additional Info" value={additionalInfo} last />
        ) : null}
      </View>

      {/* Amount */}
      <View style={s.amountBlock}>
        <Text style={s.amountLabel}>TOTAL AMOUNT DUE</Text>
        <Text style={s.amountValue}>
          BDT {Number(amount).toLocaleString("en-BD")}
        </Text>
      </View>

      {/* Divider */}
      <View style={s.divider} />
      <Text style={s.dividerLabel}>TO BE FILLED BY STUDENT / PAYER</Text>
      <View style={s.divider} />

      {/* Fillable fields */}
      <View style={s.fillGrid}>
        <FillField label="Mode of Payment" value={paymentMode} />
        <FillField label="Payment Date" value={paymentDate} />
        <FillField label="Transaction / Reference ID" value={transactionId} />
        <FillField label="Remarks" value={remarks} />
      </View>


      {/* QR code */}
      {qrCodeSrc ? (
        <View style={s.qrSection}>
          <Image style={s.qrImage} src={qrCodeSrc} />
          <Text style={s.qrCaption}>SCAN TO VERIFY PAYMENT</Text>
          {/* <Text style={s.qrUrl}>/payment/verify/{receiptId}</Text> */}
        </View>
      ) : null}

      {/* Footer */}
      <View style={s.footer}>
        <Text style={s.footerText}>
          {COMPANY.name} • {COMPANY.address}
        </Text>
        <Text style={s.footerText}>
          {COMPANY.email} • {COMPANY.phone}
        </Text>
        <Text style={s.footerNote}>
          This is a computer-generated receipt. Please retain for your records.
        </Text>
      </View>

      {/* Watermark */}
      <View style={s.watermarkWrap}>
        <View style={s.watermarkCartouche}>
          <Text
            style={[
              s.watermarkText,
              watermarkText.length > 6
                ? { fontSize: 26, letterSpacing: 4 }
                : { fontSize: 64, letterSpacing: 12 },
            ]}
          >
            {watermarkText}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default ReceiptPDFDocument;
