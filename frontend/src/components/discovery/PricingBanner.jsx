import { Scale, CheckCircle2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { useCartStore } from "../../store/cartStore";

export default function PricingBanner() {
  const { openWeightCalc } = useCartStore();

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 my-6 shadow-xl relative overflow-hidden border border-emerald-500/20">
      {/* Decorative background glow & pattern */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Info */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>THE PARDEWALA WEIGHT REVOLUTION</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
              Why Buy Notebooks By Weight (₹/KG)?
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Traditional stores charge printed MRP with over 40% markup for brand covers.
              At Pardewala, notebooks are weighed directly on calibrated digital scales.
              You pay strictly for <strong className="text-emerald-300">actual paper mass (e.g. ₹80 / KG)</strong> with full per-notebook gram transparency.
            </p>

            {/* Three key pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2 bg-white/5 rounded-xl p-2.5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Accurate Grams</span>
                  <span className="text-slate-400 text-[11px]">Exact weight verified per reference batch</span>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-white/5 rounded-xl p-2.5 border border-white/10 backdrop-blur-xs">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Zero Paper Gouging</span>
                  <span className="text-slate-400 text-[11px]">Save up to ₹25 per book vs retail MRP</span>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-white/5 rounded-xl p-2.5 border border-white/10 backdrop-blur-xs">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Smart Bundling</span>
                  <span className="text-slate-400 text-[11px]">Mix Physics, Chem & Math in one weight pool</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transparent Formula Card & Action */}
          <div className="lg:w-80 shrink-0 bg-slate-950/70 border border-emerald-500/30 rounded-xl p-4 shadow-inner flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-medium flex items-center gap-1 text-emerald-400">
                  <Scale className="w-3.5 h-3.5" /> Transparent Pricing Formula
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  Batch Audited
                </span>
              </div>

              <div className="bg-slate-900/90 rounded-lg p-3 font-mono text-xs border border-slate-800 space-y-1.5">
                <div className="text-slate-400 text-[11px]">
                  Estimated Piece Price =
                </div>
                <div className="text-emerald-300 font-bold text-sm">
                  (Notebook Weight in g ÷ 1000) × ₹/KG
                </div>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  e.g., 333.33g at ₹80/KG = <strong className="text-white">₹26.67</strong> / piece
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={openWeightCalc}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <span>Calculate Your Weight Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
