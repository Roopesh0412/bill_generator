import type { FC } from "react";
import type { BillRecord } from "../utils/receiptStorage";
import { formatIndianCurrency } from "../utils/amountToWords";
import { X, Receipt, Download, Calendar, User, Clock } from "lucide-react";

interface BillHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bills: BillRecord[];
  onDownloadBill?: (bill: BillRecord) => void;
}

export const BillHistoryModal: FC<BillHistoryModalProps> = ({
  isOpen,
  onClose,
  bills,
  onDownloadBill
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-900 rounded-lg">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Generated Bills History</h3>
              <p className="text-xs text-slate-500">
                {bills.length} {bills.length === 1 ? "receipt" : "receipts"} saved locally on this device
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 divide-y divide-slate-100">
          {bills.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600">No bills generated yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Bills will appear here automatically when you generate them.
              </p>
            </div>
          ) : (
            bills.map((bill) => (
              <div
                key={bill.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 -mx-2 px-3 rounded-lg transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded border border-indigo-100">
                      #{bill.receiptNo}
                    </span>
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {bill.residentName}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {bill.paymentMonth} {bill.paymentYear}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {bill.generatedDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-base font-extrabold text-emerald-800">
                    ₹{formatIndianCurrency(bill.amount)}
                  </span>
                  {onDownloadBill && (
                    <button
                      type="button"
                      onClick={() => onDownloadBill(bill)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
