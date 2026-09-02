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
        {/* Header: Logo in the middle, PG Name below that, Address below that */}
        <div className="text-center border-b-2 border-slate-800 pb-5 mb-5">
          {/* Logo in the middle */}
          {config.logoUrl && (
            <div className="flex justify-center mb-2.5">
              <img
                src={config.logoUrl}
                alt="PG Logo"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-md border border-slate-200 p-1 bg-white shadow-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}

          {/* Below that: PG Name */}
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase">
            {config.pgName}
          </h1>

          {/* Below that: Address */}
          <div className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto leading-relaxed">
            {config.addressLines.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>

          {/* Contact / Proprietor */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-800 font-semibold mt-2 pt-1 border-t border-slate-100 max-w-md mx-auto">
            {config.proprietorPhone && (
              <span>
                <span className="text-slate-500 font-normal">Cell :</span> {config.proprietorPhone}
              </span>
            )}
            {config.proprietorName && (
              <span>
                <span className="text-slate-500 font-normal">Proprietor :</span> {config.proprietorName}
              </span>
            )}
          </div>

          {/* Centered Document Box: RENT RECEIPT */}
          <div className="mt-4">
            <span className="inline-block border-2 border-slate-900 px-6 py-1 font-black text-sm sm:text-base tracking-wider uppercase rounded">
              {config.receiptTitle || "RENT RECEIPT"}
            </span>
          </div>
        </div>

        {/* Metadata Bar: Receipt No & Date */}
        <div className="flex items-center justify-between bg-slate-50 border-y border-slate-200 px-4 py-2.5 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Receipt No:</span>
            <span className="font-mono font-black text-base sm:text-lg text-indigo-950">
              {data.receiptNo || "0001"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-right">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date:</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 whitespace-nowrap">
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
                Total Amount Received:
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tracking-tight">
                {config.currencySymbol}{formattedAmount}
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-4 items-baseline pb-3">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase">The sum of Rupees:</span>
            <span className="sm:col-span-3 font-semibold italic text-slate-800 leading-snug">
              {data.amountInWords || "—"}
            </span>
          </div>
        </div>

        {/* Footer: For PG, Official Seal, Signature Area */}
        <div className="mt-7 pt-5 border-t border-slate-200">
          <div className="text-right mb-3">
            <span className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
              For {config.pgName}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 pt-1">
            {/* Left: Official PG Rubber Stamp Seal */}
            <div className="text-center sm:text-left">
              <div className="inline-block border-2 border-blue-700 bg-blue-50/40 rounded-lg p-2.5 px-3.5 shadow-xs rotate-[-1deg]">
                <div className="text-blue-900 font-extrabold text-xs sm:text-sm tracking-tight">
                  {config.seal?.title || "Sri Gurukottureshwara Gents PG"}
                </div>
                <div className="text-blue-800 font-semibold text-[11px] sm:text-xs mt-0.5">
                  {config.seal?.road || "Rashmi Hostel Road,"}
                </div>
                <div className="text-blue-800 font-semibold text-[11px] sm:text-xs">
                  {config.seal?.cityPin || "Davangere-577006"}
                </div>
                <div className="text-blue-950 font-bold text-[11px] sm:text-xs mt-0.5 tracking-wider">
                  {config.seal?.mob || "Mob : 9986231979"}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Official Seal</p>
            </div>

            {/* Right: Signature area */}
            <div className="text-center w-48 shrink-0">
              <div className="h-12 border-b border-dashed border-slate-400 mb-2 flex items-center justify-center text-xs text-slate-300">
                {/* Reserved for signature image later */}
              </div>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Signature
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ReceiptTemplate.displayName = "ReceiptTemplate";
