import { X, Trash2, Plus, Minus, Scale, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { formatGrams } from "../../data/notebookProducts";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    showToast
  } = useCartStore();

  if (!isCartOpen) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalWeightG = cart.reduce((acc, item) => acc + item.totalWeightG, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleCheckoutMock = () => {
    showToast("🎉 Order simulation placed! Total weight logged for scale dispatch.");
    clearCart();
    closeCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCart();
      }}
    >
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-drawer">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Your Weight Cart</h3>
              <p className="text-xs text-slate-500">
                {totalItems} {totalItems === 1 ? "notebook" : "notebooks"} • {formatGrams(totalWeightG)}
              </p>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Scale className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">Your Cart is Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Explore our catalog of notebooks and add them by weight or smart subject bundles.
              </p>
              <button
                onClick={closeCart}
                className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Browse Notebooks
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.productId}
                className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.2 rounded mr-1.5">
                      {item.subject}
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5 line-clamp-1">
                      {item.name}
                    </h5>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {item.gsm} GSM • {item.rulingType} • ₹{item.pricePerKg}/KG
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  {/* Stepper */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Weight & Price */}
                  <div className="text-right">
                    <span className="font-black text-slate-900 text-sm block">
                      ₹{item.totalPrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      ~{formatGrams(item.totalWeightG)} ({item.weightPerNotebookG}g/pc)
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3">
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <Scale className="w-3.5 h-3.5 text-emerald-700" />
                  Total Order Weight:
                </span>
                <span className="font-bold text-slate-900">
                  {formatGrams(totalWeightG)} ({Math.round(totalWeightG)}g)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Notebook Count:</span>
                <span className="font-bold text-slate-900">{totalItems} units</span>
              </div>
              <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-sm">
                <span className="font-extrabold text-slate-900">Estimated Total:</span>
                <span className="font-black text-emerald-700 text-lg">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Weighed on certified industrial scales at dispatch.</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={handleCheckoutMock}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <span>Proceed to Weighed Dispatch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
