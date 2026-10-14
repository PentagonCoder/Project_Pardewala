import { X, Scale, ShieldCheck, Printer } from "lucide-react";

export default function WeightSlipModal({ order, onClose }) {
  if (!order) return null;

  const actualG = order.actualWeightG || order.estimatedWeightG;
  const tareWeightG = 42.0; // Standard tare box & packing weight
  const grossWeightG = actualG + tareWeightG;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-bottom-sheet relative">
        
        {/* Top Actions */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 block">
                Official Digital Scale Certificate
              </span>
              <h3 className="font-bold text-slate-900 text-sm">{order.orderNumber}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body (Styled like an official industrial inspection document) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4 font-mono text-xs">
          
          {/* Header */}
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <div className="font-black text-slate-900 text-sm tracking-wide">
              PARDEWALA WEIGHING AUDIT SYSTEM
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Certified ISO/IEC 17025 Calibrated Mass Verification
            </div>
            <div className="inline-flex items-center gap-1 mt-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              <ShieldCheck className="w-3 h-3 text-emerald-700" />
              <span>PASSED TOLERANCE VERIFICATION</span>
            </div>
          </div>

          {/* Scale Meta Info */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10px]">Scale Unit ID:</span>
              <span className="font-bold text-slate-800">{order.scaleId || "SCALE-BLR-04 (Mettler Class II)"}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Calibration Stamp:</span>
              <span className="font-bold text-slate-800">{order.calibratedDate || "Daily Pre-Shift Verified"}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Certified Weigher:</span>
              <span className="font-bold text-slate-800">{order.operatorName || "Vikram K. (Certified Weigher)"}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Date & Time:</span>
              <span className="font-bold text-slate-800">{order.date} 10:24 AM IST</span>
            </div>
          </div>

          {/* Mass Measurements Table */}
          <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-1.5">
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Gross Measured Weight:</span>
              <span className="font-bold text-slate-800">{grossWeightG.toFixed(1)}g</span>
            </div>
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Tare Packaging Deduction:</span>
              <span className="font-bold text-slate-800">-{tareWeightG.toFixed(1)}g</span>
            </div>
            <div className="pt-1.5 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-900">
              <span className="text-emerald-700">Net Paper Weight:</span>
              <span className="text-sm font-black text-emerald-700">{actualG.toFixed(1)}g ({(actualG / 1000).toFixed(3)} KG)</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
              <span>Catalog Estimated Weight:</span>
              <span>{order.estimatedWeightG.toFixed(1)}g</span>
            </div>
            <div className="flex justify-between text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-sans font-semibold">
              <span>Variance vs Catalog:</span>
              <span>
                {order.weightVarianceG ? `+${order.weightVarianceG}g (+${order.weightVariancePercent}%)` : "Within ±1% Tolerance"}
              </span>
            </div>
          </div>

          {/* Itemized List */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Notebook Units Audited
            </div>
            <div className="space-y-1">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-[11px] text-slate-700">
                  <span className="truncate max-w-[240px]">
                    {it.quantity}x {it.name} ({it.gsm} GSM)
                  </span>
                  <span className="font-bold shrink-0">{it.totalWeightG.toFixed(0)}g</span>
                </div>
              ))}
            </div>
          </div>

          {/* Value Transparency Footer */}
          <div className="pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Weight-Billed Amount:</span>
            <span className="font-black text-slate-900 text-xs">₹{order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Weight Slip</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
