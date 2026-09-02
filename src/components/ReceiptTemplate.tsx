import { forwardRef } from "react";
import type { PGConfig } from "../config/pgConfig";
import { formatIndianCurrency } from "../utils/amountToWords";

export interface ReceiptData {
  receiptNo: string;
  residentName: string;
  paymentMonth: string;
  paymentYear: number | string;
  amount: number | string;
  amountInWords: string;
  date: string;
}

interface ReceiptTemplateProps {
  data: ReceiptData;
  config: PGConfig;
  className?: string;
  isPrintOnly?: boolean;
}

export const ReceiptTemplate = forwardRef<HTMLDivElement, ReceiptTemplateProps>(
  ({ data, config, className = "", isPrintOnly = false }, ref) => {
    const numericAmount = typeof data.amount === "string" ? parseFloat(data.amount) || 0 : data.amount;
    const formattedAmount = formatIndianCurrency(numericAmount);

    return (
      <div
        ref={ref}
        className={`bg-white text-slate-900 border border-slate-300 rounded-lg p-6 sm:p-8 shadow-sm font-sans ${
          isPrintOnly ? "print-only" : ""
        } ${className}`}
        style={{
          width: "100%",
          maxWidth: "760px",
          margin: "0 auto",
          boxSizing: "border-box"
        }}
      >
        {/* Receipt Header Border Accent */}
        <div className="border-b-2 border-indigo-900 pb-5 mb-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            {/* PG Logo */}
            {config.logoUrl && (
              <div className="shrink-0">
                <img
                  src={config.logoUrl}
                  alt="PG Logo"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-md border border-slate-200 p-1 bg-white shadow-sm"
                  onError={(e) => {
                    // Fallback to placeholder if image fails
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}

            {/* PG Main Details */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                {config.pgName}
              </h1>
              <div className="text-xs sm:text-sm text-slate-600 mt-1 space-y-0.5 leading-relaxed">
                {config.addressLines.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-700 mt-2 pt-1 border-t border-slate-100">
                {config.proprietorName && (
                  <span>
                    <strong className="font-semibold text-slate-900">Proprietor:</strong>{" "}
                    {config.proprietorName}
                  </span>
                )}
                {config.proprietorPhone && (
                  <span>
                    <strong className="font-semibold text-slate-900">Contact:</strong>{" "}
                    {config.proprietorPhone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Title Banner */}
        <div className="relative flex items-center justify-between bg-slate-50 border-y border-slate-200 px-4 py-2.5 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Receipt No:</span>
            <span className="font-mono font-bold text-base sm:text-lg text-indigo-950">
              {data.receiptNo || "0001"}
            </span>
          </div>

          <div className="text-center font-bold tracking-wider text-sm sm:text-base text-slate-900 uppercase border-b-2 border-slate-900 px-2">
            PAYMENT RECEIPT
          </div>

          <div className="flex items-center gap-2 text-right">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date:</span>
            <span className="text-xs sm:text-sm font-medium text-slate-800 whitespace-nowrap">
              {data.date}
            </span>
          </div>
        </div>

        {/* Receipt Content Body */}
        <div className="space-y-4 text-sm sm:text-base">
          {/* Received From */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-4 items-baseline pb-3 border-b border-slate-100">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase">Received From:</span>
            <span className="sm:col-span-3 text-base sm:text-lg font-bold text-slate-900 tracking-wide">
              {data.residentName || "—"}
            </span>
          </div>

          {/* Payment For */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-4 items-baseline pb-3 border-b border-slate-100">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase">Payment For:</span>
            <span className="sm:col-span-3 font-semibold text-slate-900">
              {data.paymentMonth && data.paymentYear ? `${data.paymentMonth} ${data.paymentYear}` : "—"}
            </span>
          </div>

          {/* Amount Box */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-4 my-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-bold text-emerald-900 uppercase tracking-wider">
                Amount Received:
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tracking-tight">
                {config.currencySymbol}{formattedAmount}
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-4 items-baseline pb-4">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase">Amount in Words:</span>
            <span className="sm:col-span-3 font-medium italic text-slate-800 leading-snug">
              {data.amountInWords || "—"}
            </span>
          </div>
        </div>

        {/* Receipt Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
            <div className="text-center sm:text-left">
              <div className="inline-block bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded font-medium mb-1">
                Received with thanks
              </div>
              <p className="text-[11px] text-slate-400">
                This is a computer generated receipt.
              </p>
            </div>

            {/* Signature Area */}
            <div className="text-center w-48 shrink-0">
              <div className="h-14 border-b border-dashed border-slate-400 mb-2 flex items-center justify-center text-xs text-slate-300">
                {/* Space reserved for seal & sign */}
                [ Seal & Signature ]
              </div>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Authorized Signature
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ReceiptTemplate.displayName = "ReceiptTemplate";
