// src/common/utils/generateCSV_PDF/downloadHelpers.js

import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

/**
 * Download CSV from array of objects
 * @param {Array} data - array of objects
 * @param {string} filename - file name (default: export.csv)
 */
export const downloadCSV = (data, filename = "export.csv") => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","), // header row
    ...data.map((row) => headers.map((h) => `"${row[h] ?? ""}"`).join(",")),
  ];

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  link.click();
};

/**
 * Download PDF from array of objects
 * @param {Array} data - array of objects
 * @param {Array} columns - array of column keys
 * @param {string} filename - file name (default: export.pdf)
 */
export const downloadPDF = (data, columns, filename = "export.pdf") => {
  if (!data || data.length === 0) return;

  const doc = new jsPDF();
  const body = data.map((row) => columns.map((col) => row[col] ?? ""));

  autoTable(doc, {
    head: [columns],
    body,
    startY: 20,
    headStyles: { fillColor: [79, 70, 229], textColor: 255 },
    styles: { fontSize: 10 },
  });

  doc.save(filename);
};

export default { downloadCSV, downloadPDF };
