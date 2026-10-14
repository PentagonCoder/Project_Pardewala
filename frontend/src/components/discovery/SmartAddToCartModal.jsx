import { useState } from "react";
import {
  X,
  Scale,
  Plus,
  Minus,
  BookOpen,
  CheckCircle2,
  PackageCheck
} from "lucide-react";
import { NOTEBOOK_PRODUCTS, calculatePiecePrice, formatGrams } from "../../data/notebookProducts";
import { useCartStore } from "../../store/cartStore";

function ModalContent({ product, onClose }) {
  const { addBundleToCart } = useCartStore();
  const [primaryQty, setPrimaryQty] = useState(1);

  // Initialize related selections map: id -> { selected: boolean, quantity: number }
  const [relatedSelections, setRelatedSelections] = useState(() => {
    const initialRelated = {};
    const relatedIds = product.relatedProductIds || [];
    relatedIds.forEach((id) => {
      initialRelated[id] = { selected: false, quantity: 1 };
    });
    return initialRelated;
  });

  const primaryUnitWeight = product.weightPerNotebookG;
  const primaryPiecePrice = calculatePiecePrice(product.pricePerKg, primaryUnitWeight);

  // Get related product objects
  const relatedProducts = (product.relatedProductIds || [])
    .map((id) => NOTEBOOK_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  // Toggle selection of related product
  const toggleRelated = (id) => {
    setRelatedSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        selected: !prev[id]?.selected,
        quantity: prev[id]?.quantity || 1
      }
    }));
  };

  // Adjust quantity of related product
  const changeRelatedQty = (id, delta) => {
    setRelatedSelections((prev) => {
      const current = prev[id] || { selected: true, quantity: 1 };
      const newQty = Math.max(1, (current.quantity || 1) + delta);
      return {
        ...prev,
        [id]: {
          selected: true,
          quantity: newQty
        }
      };
    });
  };

  // Quick Select All Related
  const toggleSelectAllRelated = () => {
    const allSelected = relatedProducts.every((rp) => relatedSelections[rp.id]?.selected);
    const updated = {};
    relatedProducts.forEach((rp) => {
      updated[rp.id] = {
        selected: !allSelected,
        quantity: relatedSelections[rp.id]?.quantity || 1
      };
    });
    setRelatedSelections(updated);
  };

  // Weight Tiers calculations for Primary Product
  const weightTiers = [
    { qty: 1, label: "1 Unit", weight: primaryUnitWeight, highlight: false },
    { qty: 2, label: "2 Units", weight: primaryUnitWeight * 2, highlight: false },
    {
      qty: Math.max(1, Math.round(product.notebooksInReference)),
      label: `~1 KG Pack (${Math.round(product.notebooksInReference)} pcs)`,
      weight: primaryUnitWeight * Math.round(product.notebooksInReference),
      highlight: true
    },
    {
      qty: Math.max(2, Math.round(product.notebooksInReference * 2)),
      label: `~2 KG Pack (${Math.round(product.notebooksInReference * 2)} pcs)`,
      weight: primaryUnitWeight * Math.round(product.notebooksInReference * 2),
      highlight: false
    }
  ];

  // Dynamic calculations:
  // Primary
  const primaryTotalWeight = primaryQty * primaryUnitWeight;
  const primaryTotalPrice = primaryQty * primaryPiecePrice;

  // Related
  let relatedTotalWeight = 0;
  let relatedTotalPrice = 0;
  let totalRelatedItemsCount = 0;

  const selectedRelatedPayload = [];

  relatedProducts.forEach((rp) => {
    const sel = relatedSelections[rp.id];
    if (sel?.selected) {
      const q = sel.quantity || 1;
      const piecePrice = calculatePiecePrice(rp.pricePerKg, rp.weightPerNotebookG);
      relatedTotalWeight += q * rp.weightPerNotebookG;
      relatedTotalPrice += q * piecePrice;
      totalRelatedItemsCount += q;
      selectedRelatedPayload.push({
        product: rp,
        quantity: q
      });
    }
  });

  // Combined totals
  const totalCombinedWeightG = primaryTotalWeight + relatedTotalWeight;
  const totalCombinedPrice = primaryTotalPrice + relatedTotalPrice;
  const totalAllNotebooksCount = primaryQty + totalRelatedItemsCount;

  // Handle Add to Cart submission
  const handleAddToCart = () => {
    addBundleToCart(product, primaryQty, selectedRelatedPayload);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal / Bottom Sheet Panel */}
      <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] border border-slate-200 animate-bottom-sheet">
        
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-full pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {product.subject}
              </span>
              <span className="bg-slate-200 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {product.brand}
              </span>
              <span className="bg-teal-50 text-teal-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-teal-200">
                {product.gsm} GSM • {product.rulingType}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <span className="font-semibold text-emerald-700">
                Base Rate: ₹{product.pricePerKg}/KG
              </span>
              <span>•</span>
              <span>~{primaryUnitWeight.toFixed(2)}g / notebook</span>
              <span>•</span>
              <span className="text-slate-700 font-medium">~₹{primaryPiecePrice.toFixed(2)} / pc</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors cursor-pointer shrink-0 ml-3"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="px-5 py-4 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          
          {/* Section 1: Weight-Tier Quantity Selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="font-bold text-slate-900 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-600" />
                <span>1. Select Notebook Weight Tier</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                Priced by actual paper mass
              </span>
            </div>

            {/* Quick Weight-Tier Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {weightTiers.map((tier) => {
                const isSelected = primaryQty === tier.qty;
                const tierPrice = tier.qty * primaryPiecePrice;
                return (
                  <button
                    key={tier.qty}
                    type="button"
                    onClick={() => setPrimaryQty(tier.qty)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60"
                    }`}
                  >
                    {tier.highlight && (
                      <span className="absolute -top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                        Value Pack
                      </span>
                    )}
                    <div>
                      <span className={`text-xs font-bold block ${isSelected ? "text-emerald-950" : "text-slate-800"}`}>
                        {tier.label}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        ~{formatGrams(tier.weight)}
                      </span>
                    </div>
                    <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        ₹{tierPrice.toFixed(2)}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Quantity Stepper */}
            <div className="mt-3 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-xs font-medium text-slate-600">
                Or choose custom notebook quantity:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPrimaryQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 cursor-pointer font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={primaryQty}
                  onChange={(e) => setPrimaryQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center font-bold text-sm bg-white border border-slate-200 rounded-lg py-1 text-slate-900 outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setPrimaryQty((q) => q + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 cursor-pointer font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Related Notebooks Selection (Admin-Defined Related Subjects) */}
          {relatedProducts.length > 0 && (
            <div className="pt-2 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-teal-600" />
                    <span>2. Smart Bundle: Add Related Subjects</span>
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Pair lab records & practical notebooks together in a single weight shipment
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleSelectAllRelated}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-2 cursor-pointer"
                >
                  {relatedProducts.every((rp) => relatedSelections[rp.id]?.selected)
                    ? "Deselect All"
                    : "Select All Bundle"}
                </button>
              </div>

              {/* Related Products List / Chips */}
              <div className="space-y-2 mt-2">
                {relatedProducts.map((relProd) => {
                  const isChecked = !!relatedSelections[relProd.id]?.selected;
                  const qty = relatedSelections[relProd.id]?.quantity || 1;
                  const relUnitWeight = relProd.weightPerNotebookG;
                  const relPiecePrice = calculatePiecePrice(relProd.pricePerKg, relUnitWeight);
                  const relLinePrice = qty * relPiecePrice;
                  const relLineWeight = qty * relUnitWeight;

                  return (
                    <div
                      key={relProd.id}
                      className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isChecked
                          ? "bg-teal-50/50 border-teal-400 ring-1 ring-teal-400/20"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {/* Checkbox & Item Info */}
                      <label className="flex items-start gap-3 cursor-pointer select-none flex-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleRelated(relProd.id)}
                          className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer accent-emerald-600"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                              {relProd.name}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px] text-slate-500">
                            <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                              {relProd.subject}
                            </span>
                            <span>{relProd.gsm} GSM</span>
                            <span>•</span>
                            <span>~{relUnitWeight.toFixed(2)}g / pc</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-bold">
                              ₹{relProd.pricePerKg}/KG
                            </span>
                          </div>
                        </div>
                      </label>

                      {/* Quantity & Price control for this related item */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-7 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        {isChecked && (
                          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => changeRelatedQty(relProd.id, -1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-slate-800">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => changeRelatedQty(relProd.id, 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900 block">
                            +₹{relLinePrice.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            ~{formatGrams(relLineWeight)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Live Dynamic Weight & Price Calculation Summary */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-lg border border-slate-700 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold flex items-center gap-1.5 text-emerald-400">
                <Scale className="w-4 h-4" /> Live Weight & Price Calculation
              </span>
              <span className="text-[10px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Exact Paper Mass Audited
              </span>
            </div>

            {/* Weight Breakdown Pill */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-700/60">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium">Selected Breakdown:</span>
                <div className="text-slate-200 text-xs">
                  {product.subject}: {primaryQty} bk (~{formatGrams(primaryTotalWeight)})
                  {totalRelatedItemsCount > 0 && (
                    <span className="text-emerald-400 font-semibold">
                      {" "}+ Bundle: {totalRelatedItemsCount} bk (~{formatGrams(relatedTotalWeight)})
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-medium">
                  Total Bundle Weight:
                </span>
                <span className="text-sm font-black text-emerald-400">
                  {formatGrams(totalCombinedWeightG)}
                </span>
              </div>
            </div>

            {/* Total Estimated Price and Note */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[11px] text-slate-400 block">
                  Total Estimated Price ({totalAllNotebooksCount} {totalAllNotebooksCount === 1 ? "notebook" : "notebooks"}):
                </span>
                <span className="text-2xl font-black text-white">
                  ₹{totalCombinedPrice.toFixed(2)}
                </span>
              </div>

              <div className="text-right text-[11px] text-slate-400 max-w-[200px] leading-tight hidden sm:block">
                Zero arbitrary margins. Includes certified accurate scale dispatch.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sheet Action Bar */}
        <div className="p-4 bg-white border-t border-slate-200/80 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="hidden sm:inline-flex px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <PackageCheck className="w-4 h-4" />
            <span>
              Add Selected to Cart • {totalAllNotebooksCount} {totalAllNotebooksCount === 1 ? "Book" : "Books"} ({formatGrams(totalCombinedWeightG)}) • ₹{totalCombinedPrice.toFixed(2)}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default function SmartAddToCartModal() {
  const { activeModalProduct, closeBottomSheet } = useCartStore();

  if (!activeModalProduct) return null;

  return (
    <ModalContent
      key={activeModalProduct.id}
      product={activeModalProduct}
      onClose={closeBottomSheet}
    />
  );
}
