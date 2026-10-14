import { Plus, Scale, Layers, Check } from "lucide-react";
import { calculatePiecePrice } from "../../data/notebookProducts";
import { useCartStore } from "../../store/cartStore";

export default function ProductCard({ product }) {
  const { openBottomSheet, cart } = useCartStore();

  // Automatic calculations
  const perNotebookWeight = product.weightPerNotebookG || (product.referenceWeightGrams / product.notebooksInReference);
  const estimatedPiecePrice = calculatePiecePrice(product.pricePerKg, perNotebookWeight);

  // Check if item is already in cart
  const cartItem = cart.find((item) => item.productId === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Top Banner & Badge */}
      <div className={`h-32 bg-gradient-to-r ${product.coverColor || "from-slate-700 to-slate-900"} p-4 relative flex flex-col justify-between text-white overflow-hidden`}>
        {/* Subtle decorative lined pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex flex-wrap gap-1.5">
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-white/25">
              {product.subject}
            </span>
            {product.badge && (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          <div className="bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-mono font-medium border border-white/20">
            {product.pages} Pages
          </div>
        </div>

        {/* Notebook Cover Mock Title Preview */}
        <div className="relative z-10">
          <span className="text-[11px] text-white/80 font-medium tracking-wide uppercase">
            {product.brand}
          </span>
          <h3 className="text-white font-bold text-sm line-clamp-1 leading-snug drop-shadow-xs">
            {product.name}
          </h3>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
        
        {/* Technical Specs: GSM & Ruling */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              {product.gsm} GSM Paper
            </span>
            <span className="text-slate-500 text-[11px] bg-slate-100 px-2 py-0.5 rounded-md font-medium">
              {product.rulingType}
            </span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Weight & Transparent Math Box */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
          {/* Reference Weight & Count */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-teal-600" />
              Reference Batch:
            </span>
            <span className="font-bold text-slate-800 bg-teal-50 text-teal-800 px-2 py-0.5 rounded-md border border-teal-200/60 text-[11px]">
              {product.referenceWeightGrams}g for {product.notebooksInReference} notebooks
            </span>
          </div>

          {/* Computed per-notebook weight and piece price */}
          <div className="pt-2 border-t border-slate-200/70 grid grid-cols-2 gap-2 text-left">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                Approx. Weight
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                ~{perNotebookWeight.toFixed(2)}g
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                Estimated Price
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-emerald-700">
                ~₹{estimatedPiecePrice.toFixed(2)} <span className="text-[10px] font-normal text-slate-500">/ pc</span>
              </span>
            </div>
          </div>
        </div>

        {/* Pricing & Add Action Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          {/* Base Weight Rate */}
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">
              Base Weight Rate
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-slate-900">
                ₹{product.pricePerKg}
              </span>
              <span className="text-xs font-bold text-emerald-600">/ KG</span>
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={() => openBottomSheet(product)}
            className="flex-1 max-w-[130px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all cursor-pointer group-hover:bg-emerald-600"
          >
            {inCartQty > 0 ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add More ({inCartQty})</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
