/**
 * LocalStorage persistence for sequential receipt numbering and bill history.
 */

export interface BillRecord {
  id: string;
  receiptNo: string; // e.g. "0001"
  rawNumber: number; // e.g. 1
  residentName: string;
  paymentMonth: string;
  paymentYear: number;
  amount: number;
  amountInWords: string;
  generatedDate: string; // e.g. "02 September 2026"
  createdAt: string; // ISO string
}

const STORAGE_KEYS = {
  CURRENT_SEQUENCE: "pg_bill_receipt_sequence",
  BILL_HISTORY: "pg_bill_history"
};

/**
 * Format a number as 4-digit zero-padded string (e.g. 1 -> "0001")
 */
export function formatReceiptNumber(num: number): string {
  return String(num).padStart(4, "0");
}

/**
 * Get the next preview receipt number without incrementing it yet.
 */
export function peekNextReceiptNumber(): { rawNumber: number; formatted: string } {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_SEQUENCE);
    const current = saved ? parseInt(saved, 10) : 0;
    const next = isNaN(current) || current < 0 ? 1 : current + 1;
    return {
      rawNumber: next,
      formatted: formatReceiptNumber(next)
    };
  } catch (e) {
    console.error("Error reading receipt sequence:", e);
    return { rawNumber: 1, formatted: "0001" };
  }
}

/**
 * Commits a generated bill: increments sequence counter and stores in bill history.
 */
export function commitGeneratedBill(billData: Omit<BillRecord, "id" | "receiptNo" | "rawNumber" | "createdAt">): BillRecord {
  const { rawNumber, formatted } = peekNextReceiptNumber();
  
  const newRecord: BillRecord = {
    ...billData,
    id: `bill_${Date.now()}_${rawNumber}`,
    rawNumber,
    receiptNo: formatted,
    createdAt: new Date().toISOString()
  };

  try {
    // 1. Persist the incremented sequence
    localStorage.setItem(STORAGE_KEYS.CURRENT_SEQUENCE, String(rawNumber));

    // 2. Persist to history
    const history = getBillHistory();
    history.unshift(newRecord); // latest first
    localStorage.setItem(STORAGE_KEYS.BILL_HISTORY, JSON.stringify(history.slice(0, 100))); // keep last 100
  } catch (e) {
    console.error("Error saving bill record:", e);
  }

  return newRecord;
}

/**
 * Retrieve saved bill history
 */
export function getBillHistory(): BillRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.BILL_HISTORY);
    if (!saved) return [];
    return JSON.parse(saved);
  } catch (e) {
    console.error("Error reading bill history:", e);
    return [];
  }
}

/**
 * Optional helper to reset sequence (if proprietor ever needs to set custom start)
 */
export function setReceiptSequence(newSequenceNumber: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SEQUENCE, String(Math.max(0, newSequenceNumber)));
  } catch (e) {
    console.error("Error updating receipt sequence:", e);
  }
}
