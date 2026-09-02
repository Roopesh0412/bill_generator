import { useState, useRef, useEffect } from "react";
import { getPGConfig } from "./config/pgConfig";
import type { PGConfig } from "./config/pgConfig";
import { formatSystemDate, getCurrentMonthName, getCurrentYear } from "./utils/dateUtils";
import {
  peekNextReceiptNumber,
  commitGeneratedBill,
  getBillHistory
} from "./utils/receiptStorage";
import type { BillRecord } from "./utils/receiptStorage";
import { downloadReceiptPDF } from "./utils/pdfGenerator";
import { Header } from "./components/Header";
import { BillForm } from "./components/BillForm";
import { ReceiptTemplate } from "./components/ReceiptTemplate";
import type { ReceiptData } from "./components/ReceiptTemplate";
import { BillHistoryModal } from "./components/BillHistoryModal";
import { SettingsModal } from "./components/SettingsModal";
import { Eye, Printer } from "lucide-react";

export function App() {
  const [pgConfig, setPgConfig] = useState<PGConfig>(getPGConfig());
  const [billHistory, setBillHistory] = useState<BillRecord[]>(getBillHistory());
  const [isGenerating, setIsGenerating] = useState(false);
  const [successReceiptNo, setSuccessReceiptNo] = useState<string | null>(null);

  // Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Active form data for live preview
  const [livePreviewData, setLivePreviewData] = useState<ReceiptData>({
    receiptNo: peekNextReceiptNumber().formatted,
    residentName: "",
    paymentMonth: getCurrentMonthName(),
    paymentYear: getCurrentYear(),
    amount: "",
    amountInWords: "",
    date: formatSystemDate()
  });

  // Dedicated off-screen / fixed-dimension receipt element for high-res PDF generation
  const pdfCaptureRef = useRef<HTMLDivElement>(null);
  // Separate state to render specific bill if re-downloading from history
  const [activeCaptureData, setActiveCaptureData] = useState<ReceiptData>(livePreviewData);

  // Keep live preview receipt number in sync with sequence
  const refreshPreviewReceiptNo = () => {
    const next = peekNextReceiptNumber();
    setLivePreviewData((prev) => ({
      ...prev,
      receiptNo: next.formatted,
      date: formatSystemDate()
    }));
  };

  useEffect(() => {
    refreshPreviewReceiptNo();
    setBillHistory(getBillHistory());
  }, []);

  // Handle live form input changes
  const handleFormChange = (formData: {
    residentName: string;
    paymentMonth: string;
    paymentYear: number;
    amount: string;
    amountInWords: string;
  }) => {
    const currentReceipt = peekNextReceiptNumber();
    setLivePreviewData({
      receiptNo: currentReceipt.formatted,
      residentName: formData.residentName,
      paymentMonth: formData.paymentMonth,
      paymentYear: formData.paymentYear,
      amount: formData.amount,
      amountInWords: formData.amountInWords,
      date: formatSystemDate()
    });
  };

  // Main Bill Generation & Download Flow
  const handleGenerateBill = async (data: {
    residentName: string;
    paymentMonth: string;
    paymentYear: number;
    amount: number;
    amountInWords: string;
  }) => {
    try {
      setIsGenerating(true);
      const { formatted: nextReceiptNo } = peekNextReceiptNumber();
      const todayDate = formatSystemDate();

      const billDataForPDF: ReceiptData = {
        receiptNo: nextReceiptNo,
        residentName: data.residentName,
        paymentMonth: data.paymentMonth,
        paymentYear: data.paymentYear,
        amount: data.amount,
        amountInWords: data.amountInWords,
        date: todayDate
      };

      // Set active capture element data
      setActiveCaptureData(billDataForPDF);

      // Brief wait to ensure capture element DOM is updated
      await new Promise((resolve) => setTimeout(resolve, 60));

      if (!pdfCaptureRef.current) {
        throw new Error("Receipt template capture element not found");
      }

      // Generate & automatically download PDF
      await downloadReceiptPDF({
        element: pdfCaptureRef.current,
        receiptNo: nextReceiptNo,
        residentName: data.residentName,
        paymentMonth: data.paymentMonth,
        paymentYear: data.paymentYear
      });

      // Commit to storage: increments sequence and saves to history
      const savedRecord = commitGeneratedBill({
        residentName: data.residentName,
        paymentMonth: data.paymentMonth,
        paymentYear: data.paymentYear,
        amount: data.amount,
        amountInWords: data.amountInWords,
        generatedDate: todayDate
      });

      // Update history list and success notification
      setBillHistory(getBillHistory());
      setSuccessReceiptNo(savedRecord.receiptNo);
      refreshPreviewReceiptNo();
    } catch (error) {
      console.error("Failed to generate bill PDF:", error);
      alert("An error occurred while generating the PDF receipt. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Re-download an existing bill from history
  const handleDownloadFromHistory = async (bill: BillRecord) => {
    try {
      const historicalData: ReceiptData = {
        receiptNo: bill.receiptNo,
        residentName: bill.residentName,
        paymentMonth: bill.paymentMonth,
        paymentYear: bill.paymentYear,
        amount: bill.amount,
        amountInWords: bill.amountInWords,
        date: bill.generatedDate
      };

      setActiveCaptureData(historicalData);
      await new Promise((resolve) => setTimeout(resolve, 60));

      if (pdfCaptureRef.current) {
        await downloadReceiptPDF({
          element: pdfCaptureRef.current,
          receiptNo: bill.receiptNo,
          residentName: bill.residentName,
          paymentMonth: bill.paymentMonth,
          paymentYear: bill.paymentYear
        });
      }
    } catch (e) {
      console.error("Error re-downloading bill from history:", e);
      alert("Could not download past bill.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Top Header */}
      <Header
        config={pgConfig}
        billCount={billHistory.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-5 w-full">
            <BillForm
              onGenerateBill={handleGenerateBill}
              isGenerating={isGenerating}
              successReceiptNo={successReceiptNo}
              onClearSuccess={() => setSuccessReceiptNo(null)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onUpdateReceiptNumber={() => refreshPreviewReceiptNo()}
              onFormChange={handleFormChange}
            />
          </div>

          {/* Right Column: Live Receipt Preview */}
          <div className="lg:col-span-7 w-full space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-slate-400" />
                Live Receipt Preview
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors no-print"
                title="Print receipt directly"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>

            {/* Rendered Live Receipt Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-2 sm:p-4 overflow-x-auto">
              <ReceiptTemplate
                data={livePreviewData}
                config={pgConfig}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Hidden Off-Screen Container for Pixel-Perfect PDF Capture */}
      <div
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: "794px" // Standard A4 96DPI width representation
        }}
      >
        <ReceiptTemplate
          ref={pdfCaptureRef}
          data={activeCaptureData}
          config={pgConfig}
          className="shadow-none border-0"
        />
      </div>

      {/* Bill History Modal */}
      <BillHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        bills={billHistory}
        onDownloadBill={handleDownloadFromHistory}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentConfig={pgConfig}
        onConfigSaved={(updated) => {
          setPgConfig(updated);
        }}
        onSequenceChanged={() => {
          refreshPreviewReceiptNo();
        }}
      />
    </div>
  );
}

export default App;
