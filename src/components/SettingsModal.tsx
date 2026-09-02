import { useState } from "react";
import type { FC, FormEvent } from "react";
import { savePGConfig, resetPGConfigToDefaults } from "../config/pgConfig";
import type { PGConfig } from "../config/pgConfig";
import { setReceiptSequence, peekNextReceiptNumber } from "../utils/receiptStorage";
import { X, Building2, Save, RotateCcw, Stamp } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: PGConfig;
  onConfigSaved: (newConfig: PGConfig) => void;
  onSequenceChanged: () => void;
}

export const SettingsModal: FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onConfigSaved,
  onSequenceChanged
}) => {
  const [pgName, setPgName] = useState(currentConfig.pgName);
  const [addressLine1, setAddressLine1] = useState(currentConfig.addressLines[0] || "");
  const [addressLine2, setAddressLine2] = useState(currentConfig.addressLines[1] || "");
  const [addressLine3, setAddressLine3] = useState(currentConfig.addressLines[2] || "");
  const [proprietorName, setProprietorName] = useState(currentConfig.proprietorName);
  const [proprietorPhone, setProprietorPhone] = useState(currentConfig.proprietorPhone);
  const [receiptTitle, setReceiptTitle] = useState(currentConfig.receiptTitle || "RENT RECEIPT");

  // Seal details
  const [sealTitle, setSealTitle] = useState(currentConfig.seal?.title || "Sri Gurukottureshwara Gents PG");
  const [sealRoad, setSealRoad] = useState(currentConfig.seal?.road || "Rashmi Hostel Road,");
  const [sealCityPin, setSealCityPin] = useState(currentConfig.seal?.cityPin || "Davangere-577006");
  const [sealMob, setSealMob] = useState(currentConfig.seal?.mob || "Mob : 9986231979");

  const currentNext = peekNextReceiptNumber();
  const [nextSeq, setNextSeq] = useState(currentNext.rawNumber);

  if (!isOpen) return null;

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const updated = savePGConfig({
      pgName: pgName.trim(),
      addressLines: [addressLine1, addressLine2, addressLine3].filter(Boolean),
      proprietorName: proprietorName.trim(),
      proprietorPhone: proprietorPhone.trim(),
      receiptTitle: receiptTitle.trim(),
      seal: {
        title: sealTitle.trim(),
        road: sealRoad.trim(),
        cityPin: sealCityPin.trim(),
        mob: sealMob.trim()
      }
    });

    if (nextSeq > 0 && nextSeq !== currentNext.rawNumber) {
      setReceiptSequence(nextSeq - 1);
      onSequenceChanged();
    }

    onConfigSaved(updated);
    onClose();
  };

  const handleReset = () => {
    if (confirm("Reset all PG details and settings to default?")) {
      const def = resetPGConfigToDefaults();
      setPgName(def.pgName);
      setAddressLine1(def.addressLines[0] || "");
      setAddressLine2(def.addressLines[1] || "");
      setAddressLine3(def.addressLines[2] || "");
      setProprietorName(def.proprietorName);
      setProprietorPhone(def.proprietorPhone);
      setReceiptTitle(def.receiptTitle);
      setSealTitle(def.seal.title);
      setSealRoad(def.seal.road);
      setSealCityPin(def.seal.cityPin);
      setSealMob(def.seal.mob);
      onConfigSaved(def);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-200 text-slate-800 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Edit PG Details & Settings</h3>
              <p className="text-xs text-slate-500">
                Customized values save directly to this browser / device
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

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Next Receipt Number Setting */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wide">
                Next Receipt Sequence Number
              </label>
              <span className="text-xs font-mono font-bold text-indigo-700">
                Current: #{currentNext.formatted}
              </span>
            </div>
            <input
              type="number"
              min="1"
              value={nextSeq}
              onChange={(e) => setNextSeq(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-indigo-200 bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-600 font-mono font-bold text-indigo-950"
            />
            <p className="text-[11px] text-indigo-600/80 mt-1">
              Change this anytime if using the link on a new phone or account (e.g. 1756).
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              PG Name
            </label>
            <input
              type="text"
              value={pgName}
              onChange={(e) => setPgName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              PG Address Lines
            </label>
            <input
              type="text"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="Door No. / Building"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
            />
            <input
              type="text"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Locality / Landmark"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
            />
            <input
              type="text"
              value={addressLine3}
              onChange={(e) => setAddressLine3(e.target.value)}
              placeholder="City, State, Pincode"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Proprietor Name
              </label>
              <input
                type="text"
                value={proprietorName}
                onChange={(e) => setProprietorName(e.target.value)}
                placeholder="Kottresh C"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Cell / Phone Number
              </label>
              <input
                type="text"
                value={proprietorPhone}
                onChange={(e) => setProprietorPhone(e.target.value)}
                placeholder="9986231979"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Receipt Header Title
            </label>
            <input
              type="text"
              value={receiptTitle}
              onChange={(e) => setReceiptTitle(e.target.value)}
              placeholder="RENT RECEIPT"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 font-semibold"
            />
          </div>

          {/* Official Seal Details */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase">
              <Stamp className="w-4 h-4 text-blue-700" />
              Official Rubber Stamp / Seal Text
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 block">Seal Line 1 (Name)</span>
                <input
                  type="text"
                  value={sealTitle}
                  onChange={(e) => setSealTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Seal Line 2 (Road)</span>
                <input
                  type="text"
                  value={sealRoad}
                  onChange={(e) => setSealRoad(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Seal Line 3 (City & Pin)</span>
                <input
                  type="text"
                  value={sealCityPin}
                  onChange={(e) => setSealCityPin(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Seal Line 4 (Mobile)</span>
                <input
                  type="text"
                  value={sealMob}
                  onChange={(e) => setSealMob(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-950 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
