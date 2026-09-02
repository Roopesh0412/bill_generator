import { useState, useEffect } from "react";
import type { FC, FormEvent } from "react";
import { PAYMENT_MONTHS, getAvailableYears, getCurrentMonthName, getCurrentYear } from "../utils/dateUtils";
import { numberToWordsIndian } from "../utils/amountToWords";
import { peekNextReceiptNumber } from "../utils/receiptStorage";
import { FileDown, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from "lucide-react";

export interface FormData {
  residentName: string;
  paymentMonth: string;
  paymentYear: number;
  amount: string;
}

interface BillFormProps {
  onGenerateBill: (data: {
    residentName: string;
    paymentMonth: string;
    paymentYear: number;
    amount: number;
    amountInWords: string;
  }) => Promise<void>;
  isGenerating: boolean;
  successReceiptNo: string | null;
  onClearSuccess: () => void;
  onFormChange?: (data: {
    residentName: string;
    paymentMonth: string;
    paymentYear: number;
    amount: string;
    amountInWords: string;
  }) => void;
}

export const BillForm: FC<BillFormProps> = ({
  onGenerateBill,
  isGenerating,
  successReceiptNo,
  onClearSuccess,
  onFormChange
}) => {
  const [residentName, setResidentName] = useState("");
  const [paymentMonth, setPaymentMonth] = useState(getCurrentMonthName());
  const [paymentYear, setPaymentYear] = useState(getCurrentYear());
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<{ name?: string; amount?: string }>({});

  const availableYears = getAvailableYears();
  const nextReceipt = peekNextReceiptNumber();

  // Calculate amount in words in real-time
  const numericAmount = parseFloat(amount);
  const amountInWords = (!isNaN(numericAmount) && numericAmount > 0)
    ? numberToWordsIndian(numericAmount)
    : "";

  // Notify parent of live changes for the preview card
  useEffect(() => {
    if (onFormChange) {
      onFormChange({
        residentName,
        paymentMonth,
        paymentYear,
        amount,
        amountInWords
      });
    }
  }, [residentName, paymentMonth, paymentYear, amount, amountInWords]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    onClearSuccess();

    const newErrors: { name?: string; amount?: string } = {};

    if (!residentName.trim()) {
      newErrors.name = "Please enter the resident name.";
    }

    const parsedAmount = parseFloat(amount.trim());
    if (!amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = "Please enter a valid amount.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    await onGenerateBill({
      residentName: residentName.trim(),
      paymentMonth,
      paymentYear,
      amount: parsedAmount,
      amountInWords
    });
  };

  const handleResetForNext = () => {
    setResidentName("");
    setAmount("");
    onClearSuccess();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-7">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Generate Receipt</h2>
          <p className="text-xs text-slate-500 mt-0.5">Fill in the resident payment details below</p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Next Bill No</span>
          <span className="font-mono text-sm sm:text-base font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
            #{nextReceipt.formatted}
          </span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successReceiptNo && (
        <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start justify-between gap-3 text-emerald-900 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-sm sm:text-base">
                Bill generated successfully — Receipt No. {successReceiptNo}
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                The PDF has downloaded automatically.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetForNext}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline whitespace-nowrap pt-0.5"
          >
            Create Next Bill
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor="residentName" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
            Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="residentName"
            type="text"
            value={residentName}
            onChange={(e) => {
              setResidentName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="e.g. Rahul"
            autoComplete="off"
            className={`w-full px-3.5 py-2.5 sm:py-3 text-base rounded-lg border transition-colors ${
              errors.name
                ? "border-rose-400 focus:ring-2 focus:ring-rose-200 focus:border-rose-500"
                : "border-slate-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
            }`}
          />
          {errors.name && (
            <p className="flex items-center gap-1 text-xs text-rose-600 mt-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Payment Period: Month & Year Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Payment Month */}
          <div>
            <label htmlFor="paymentMonth" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Payment Month <span className="text-rose-500">*</span>
            </label>
            <select
              id="paymentMonth"
              value={paymentMonth}
              onChange={(e) => setPaymentMonth(e.target.value)}
              className="w-full px-3.5 py-2.5 sm:py-3 text-base rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 cursor-pointer"
            >
              {PAYMENT_MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Year */}
          <div>
            <label htmlFor="paymentYear" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Payment Year <span className="text-rose-500">*</span>
            </label>
            <select
              id="paymentYear"
              value={paymentYear}
              onChange={(e) => setPaymentYear(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 sm:py-3 text-base rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 cursor-pointer"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount Field */}
        <div>
          <label htmlFor="amount" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
            Amount <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-base font-bold text-slate-500 pointer-events-none">
              ₹
            </span>
            <input
              id="amount"
              type="number"
              min="1"
              step="any"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
              placeholder="e.g. 8500"
              className={`w-full pl-8 pr-3.5 py-2.5 sm:py-3 text-base font-semibold rounded-lg border transition-colors ${
                errors.amount
                  ? "border-rose-400 focus:ring-2 focus:ring-rose-200 focus:border-rose-500"
                  : "border-slate-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
              }`}
            />
          </div>
          {errors.amount && (
            <p className="flex items-center gap-1 text-xs text-rose-600 mt-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.amount}
            </p>
          )}
        </div>

        {/* Amount in Words Display (Immediate automatic update) */}
        <div className="rounded-lg p-3.5 bg-slate-50 border border-slate-200/90 transition-all">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Amount in Words:
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 italic min-h-[1.4rem]">
            {amountInWords ? (
              amountInWords
            ) : (
              <span className="text-slate-400 not-italic font-normal">
                Enter an amount above to see words
              </span>
            )}
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full h-12 sm:h-14 bg-indigo-900 hover:bg-indigo-950 active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating Receipt & PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                <span>GENERATE BILL & DOWNLOAD PDF</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
