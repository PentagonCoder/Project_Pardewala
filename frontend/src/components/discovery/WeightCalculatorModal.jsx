import { useState } from "react";
import { X, Calculator, Sparkles } from "lucide-react";
import { useCartStore } from "../../store/cartStore";

export default function WeightCalculatorModal() {
  const { isWeightCalcOpen, closeWeightCalc } = useCartStore();
  const [targetWeightKg, setTargetWeightKg] = useState(2.0);
  const [avgPricePerKg, setAvgPricePerKg] = useState(80);

  if (!isWeightCalcOpen) return null;

  const totalGrams = targetWeightKg * 1000;
  // Standard notebook is approx 333g (3 notebooks per 1000g)
  const estimatedBooks333g = Math.round(totalGrams / 333.33);
  // Heavy register is approx 500g
  const estimatedRegisters500g = Math.round(totalGrams / 500);
  // Estimated total cost
  const estimatedCost = targetWeightKg * avgPricePerKg;
  // Typical retail MRP comparison (traditional stores charge ~₹45 for a 333g book, so ~₹135/KG)
  const retailComparison = targetWeightKg * 135;
  const savings = Math.max(0, retailComparison - estimatedCost);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeWeightCalc();
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-bottom-sheet">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Weight & Budget Calculator</h3>
              <p className="text-xs text-slate-500">Estimate notebook volume by weight</p>
            </div>
          </div>
          <button
            onClick={closeWeightCalc}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slider Controls */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
              <span>Target Weight (KG):</span>
              <span className="text-emerald-700 font-extrabold text-sm">{targetWeightKg} KG ({totalGrams}g)</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={targetWeightKg}
              onChange={(e) => setTargetWeightKg(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>0.5 KG</span>
              <span>2.5 KG</span>
              <span>5.0 KG</span>
              <span>10.0 KG</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
              <span>Assumed Paper Rate (₹/KG):</span>
              <span className="text-slate-900 font-bold">₹{avgPricePerKg}/KG</span>
            </div>
            <div className="flex gap-2">
              {[60, 80, 85, 95].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setAvgPricePerKg(rate)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border cursor-pointer transition-colors ${
                    avgPricePerKg === rate
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  ₹{rate}/KG
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Estimated Cost:</span>
            <span className="text-2xl font-black text-emerald-400">₹{estimatedCost.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
            <div className="bg-slate-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Standard Notebooks (~333g)</span>
              <span className="font-extrabold text-white text-sm">~{estimatedBooks333g} notebooks</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Heavy Registers (~500g)</span>
              <span className="font-extrabold text-white text-sm">~{estimatedRegisters500g} registers</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Est. Savings vs Retail MRP:
            </span>
            <span className="font-bold text-white bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">
              Save ~₹{savings.toFixed(0)}
            </span>
          </div>
        </div>

        <button
          onClick={closeWeightCalc}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          Close Calculator & View Products
        </button>
      </div>
    </div>
  );
}
