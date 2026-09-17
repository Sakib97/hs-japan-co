import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  ShadingType,
  VerticalAlign,
  UnderlineType,
  PageOrientation,
  Footer,
  PageNumber,
} from "docx";
import { saveAs } from "file-saver";
import { DAILY_TASK_STATUS_OPTIONS } from "../../../../config/statusAndRoleConfig";

const taskStatusLabelMap = Object.fromEntries(
  DAILY_TASK_STATUS_OPTIONS.map(({ value, label }) => [value, label]),
);

const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

const formatExportDate = (d) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const FONT = "Calibri";

const CELL_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
};

const CELL_MARGINS = { top: 40, bottom: 40, left: 80, right: 80 };

const COL_WIDTHS = [5, 11, 25, 15, 14, 14, 16];

const makeHeaderCell = (text, widthPct) =>
  new TableCell({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text,
            bold: true,
            size: 18,
            color: "FFFFFF",
            font: FONT,
          }),
        ],
      }),
    ],
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: "333333" },
    verticalAlign: VerticalAlign.CENTER,
    borders: CELL_BORDERS,
    margins: CELL_MARGINS,
  });

const textPara = (text) =>
  new Paragraph({
    children: [new TextRun({ text: text || "-", size: 18, font: FONT })],
  });

const makeDataCell = (paragraphs, widthPct) =>
  new TableCell({
    children: paragraphs.length ? paragraphs : [textPara("-")],
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    borders: CELL_BORDERS,
    margins: CELL_MARGINS,
  });

const buildDataRow = (task, index) => {
  const reporterParagraphs = [];
  if (task.created_by_name)
    reporterParagraphs.push(textPara(task.created_by_name));
  if (task.created_by_email)
    reporterParagraphs.push(textPara(task.created_by_email));

  return new TableRow({
    children: [
      makeDataCell([textPara(String(index + 1))], COL_WIDTHS[0]),
      makeDataCell(
        [textPara(formatExportDate(task.created_at))],
        COL_WIDTHS[1],
      ),
      makeDataCell([textPara(stripHtml(task.content))], COL_WIDTHS[2]),
      makeDataCell(reporterParagraphs, COL_WIDTHS[3]),
      makeDataCell([textPara(task.verification_comments)], COL_WIDTHS[4]),
      makeDataCell([textPara(task.verified_by)], COL_WIDTHS[5]),
      makeDataCell(
        [textPara(taskStatusLabelMap[task.status] ?? task.status)],
        COL_WIDTHS[6],
      ),
    ],
  });
};

const footer = new Footer({
  children: [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun("Page "),
        new TextRun({
          children: [PageNumber.CURRENT],
        }),
        new TextRun(" of "),
        new TextRun({
          children: [PageNumber.TOTAL_PAGES],
        }),
      ],
    }),
  ],
});

const exportTasksToDocx = async (tasks, filterInfo = {}) => {
  const now = new Date();
  const downloadedAt = formatExportDate(now);
  const { statusFilter, dateFilter, searchFilter } = filterInfo;

  const statusLabel = statusFilter
    ? (DAILY_TASK_STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ??
      statusFilter)
    : "All";
  const dateLabel = dateFilter || "All";
  const reporterLabel = searchFilter || "All";

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      makeHeaderCell("SL", COL_WIDTHS[0]),
      makeHeaderCell("Date", COL_WIDTHS[1]),
      makeHeaderCell("Task Summary", COL_WIDTHS[2]),
      makeHeaderCell("Reported By", COL_WIDTHS[3]),
      makeHeaderCell("Performance Review", COL_WIDTHS[4]),
      makeHeaderCell("Reviewed By", COL_WIDTHS[5]),
      makeHeaderCell("Performance Status", COL_WIDTHS[6]),
    ],
  });

  const dataRows = tasks.map((task, i) => buildDataRow(task, i));

  const table = new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { orientation: PageOrientation.LANDSCAPE },
          },
        },
        footers: {
          default: footer,
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "HS Japan Academy",
                bold: true,
                size: 36,
                font: FONT,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: "Employee Task Report Summary",
                bold: true,
                size: 28,
                font: FONT,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 10 },
            children: [
              new TextRun({
                text: "Downloaded at: ",
                bold: true,
                size: 18,
                font: FONT,
              }),
              new TextRun({
                text: downloadedAt,
                size: 18,
                font: FONT,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            },
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: "Filters:",
                bold: true,
                underline: { type: UnderlineType.SINGLE },
                size: 20,
                font: FONT,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 20 },
            children: [
              new TextRun({
                text: "Status: ",
                bold: true,
                size: 18,
                font: FONT,
              }),
              new TextRun({ text: statusLabel, size: 18, font: FONT }),
            ],
          }),
          new Paragraph({
            spacing: { after: 20 },
            children: [
              new TextRun({
                text: "Date: ",
                bold: true,
                size: 18,
                font: FONT,
              }),
              new TextRun({ text: dateLabel, size: 18, font: FONT }),
            ],
          }),
          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: "Reporter Name / Email: ",
                bold: true,
                size: 18,
                font: FONT,
              }),
              new TextRun({ text: reporterLabel, size: 18, font: FONT }),
            ],
          }),
          table,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `HS_Japan_Task_Report_${now.toISOString().slice(0, 10)}.docx`);
};

export default exportTasksToDocx;
