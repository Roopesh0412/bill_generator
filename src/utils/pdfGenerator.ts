import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface PDFGenerationOptions {
  element: HTMLElement;
  receiptNo: string;
  residentName: string;
  paymentMonth: string;
  paymentYear: number | string;
}

/**
 * Sanitize filename to prevent OS file name errors
 */
export function generateSanitizedFilename(
  receiptNo: string,
  residentName: string,
  paymentMonth: string,
  paymentYear: number | string
): string {
  const cleanName = (residentName || "Resident")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_");
  
  const cleanMonth = (paymentMonth || "Month").trim().replace(/[^a-zA-Z0-9]/g, "");
  const cleanYear = String(paymentYear).trim();
  const cleanReceipt = receiptNo.trim().replace(/[^a-zA-Z0-9]/g, "");

  return `PG_Bill_${cleanReceipt}_${cleanName}_${cleanMonth}_${cleanYear}.pdf`;
}

/**
 * Capture receipt element and generate high-resolution A4 PDF
 */
export async function downloadReceiptPDF({
  element,
  receiptNo,
  residentName,
  paymentMonth,
  paymentYear
}: PDFGenerationOptions): Promise<string> {
  const filename = generateSanitizedFilename(
    receiptNo,
    residentName,
    paymentMonth,
    paymentYear
  );

  // Use html2canvas with scale: 2.5 for crystal clear printing quality
  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: 850 // Standardize width during capture
  });

  const imgData = canvas.toDataURL("image/png");

  // Create A4 PDF (210mm x 297mm)
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true
  });

  const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
  const marginX = 14; // 14mm left & right margins
  const contentWidth = pageWidth - marginX * 2; // 182mm
  const contentHeight = (canvas.height * contentWidth) / canvas.width;

  const marginY = 16; // 16mm top margin

  pdf.addImage(
    imgData,
    "PNG",
    marginX,
    marginY,
    contentWidth,
    contentHeight,
    undefined,
    "FAST"
  );

  // Automatically trigger download
  pdf.save(filename);

  return filename;
}
