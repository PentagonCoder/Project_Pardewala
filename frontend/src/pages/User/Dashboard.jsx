import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Scale,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  RotateCcw,
  Store,
  Layers,
  Award
} from "lucide-react";
import { INITIAL_ORDERS, SAVED_PRESETS } from "../../data/mockOrders";
import { NOTEBOOK_PRODUCTS, formatGrams } from "../../data/notebookProducts";
import { useCartStore } from "../../store/cartStore";
import WeightSlipModal from "../../components/discovery/WeightSlipModal";

export default function DashboardUser() {
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState(null);
  const [orderFilter, setOrderFilter] = useState("all");

  const { addBundleToCart, showToast } = useCartStore();

  // Reorder an existing bundle
  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    const [first, ...rest] = order.items;
    const primaryProd = NOTEBOOK_PRODUCTS.find((p) => p.id === first.productId) || {
      id: first.productId,
      name: first.name,
      brand: "Classmate",
      subject: first.subject,
      gsm: first.gsm,
      rulingType: first.rulingType,
      pricePerKg: 80.0,
      weightPerNotebookG: first.weightPerNotebookG
    };

    const relatedPayload = rest.map((item) => {
      const prod = NOTEBOOK_PRODUCTS.find((p) => p.id === item.productId) || {
        id: item.productId,
        name: item.name,
        brand: "Classmate",
        subject: item.subject,
        gsm: item.gsm,
        rulingType: item.rulingType,
        pricePerKg: 85.0,
        weightPerNotebookG: item.weightPerNotebookG
      };
      return { product: prod, quantity: item.quantity };
    });

    addBundleToCart(primaryProd, first.quantity, relatedPayload);
    showToast(`📦 Order ${order.orderNumber} re-added to your active weight cart!`);
  };

  // Add preset to cart
  const handleLoadPreset = (preset) => {
    const productsInPreset = preset.items.map((pi) => {
      const p = NOTEBOOK_PRODUCTS.find((np) => np.id === pi.productId);
      return { product: p, quantity: pi.quantity };
    }).filter((x) => x.product);

    if (productsInPreset.length > 0) {
      const [first, ...rest] = productsInPreset;
      addBundleToCart(first.product, first.quantity, rest);
      showToast(`✨ Preset "${preset.name}" loaded to your weight cart!`);
    }
  };

  const filteredOrders = INITIAL_ORDERS.filter((ord) => {
    if (orderFilter === "delivered") return ord.status === "delivered";
    if (orderFilter === "transit") return ord.status === "dispatched" || ord.status === "pending_weighing";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
                <Scale className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                Pardewala
              </span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
              Customer Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span>Browse Catalog</span>
            </Link>
            <Link
              to="/admin/dashboard"
              className="text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>Seller Portal</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-8 -mr-8 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-700/60 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 mb-2">
                <Award className="w-3.5 h-3.5 text-emerald-300" />
                <span>Tier: Gold Weight Saver Member</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, Rahul Verma
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
                Track your certified paper shipments, verify industrial scale weight slips, and re-order custom subject bundles.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 text-xs shrink-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center font-black">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-emerald-200 block text-[11px]">Audit Guarantee:</span>
                <span className="font-extrabold text-white text-sm">100% Calibrated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lifetime Weight & Savings Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium block">Total Paper Mass Purchased</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">12.85</span>
              <span className="text-xs font-bold text-emerald-600">KG</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Across 6 semester orders</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium block">Notebooks Received</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">38</span>
              <span className="text-xs font-bold text-slate-500">Units</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Zero retail packaging waste</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium block">Lifetime MRP Savings</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-emerald-700">₹395.00</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">~32% cheaper than printed MRP</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium block">Certified Weight Accuracy</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-teal-700">±0.6%</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Within NABL Class II standards</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "orders"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Weighed Orders & Digital Slips ({INITIAL_ORDERS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("presets")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "presets"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Saved Subject Presets ({SAVED_PRESETS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "analytics"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Weight Pricing vs Retail MRP</span>
          </button>
        </div>

        {/* Tab 1: Orders and Weight Slips */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {/* Filter buttons */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setOrderFilter("all")}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    orderFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                  }`}
                >
                  All Orders
                </button>
                <button
                  onClick={() => setOrderFilter("transit")}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    orderFilter === "transit" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                  }`}
                >
                  In Transit
                </button>
                <button
                  onClick={() => setOrderFilter("delivered")}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    orderFilter === "delivered" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                  }`}
                >
                  Delivered
                </button>
              </div>

              <span className="text-xs text-slate-400 font-medium hidden sm:block">
                All weights verified by industrial bench scales
              </span>
            </div>

            {/* Orders list */}
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isDelivered = order.status === "delivered";
                const isDispatched = order.status === "dispatched";

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow"
                  >
                    {/* Header bar of order card */}
                    <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {order.orderNumber}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{order.date}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-slate-600 font-medium">
                          {order.trackingNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1.5 ${
                            isDelivered
                              ? "bg-emerald-100 text-emerald-800"
                              : isDispatched
                              ? "bg-teal-100 text-teal-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isDelivered && <CheckCircle2 className="w-3 h-3" />}
                          {isDispatched && <Clock className="w-3 h-3" />}
                          {!isDelivered && !isDispatched && <Scale className="w-3 h-3" />}
                          <span>{order.statusLabel}</span>
                        </span>
                      </div>
                    </div>

                    {/* Order Body Details */}
                    <div className="p-4 sm:p-5 space-y-4">
                      {/* Weight Comparison & Verification Banner */}
                      <div className="bg-gradient-to-r from-emerald-50/60 to-teal-50/60 rounded-xl p-3.5 border border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <Scale className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                              Scale Verification Record
                            </span>
                            <div className="flex items-center gap-2 text-slate-800">
                              <span>Estimated: <strong>{formatGrams(order.estimatedWeightG)}</strong></span>
                              <span>•</span>
                              <span>Actual Scale: <strong className="text-emerald-800">{order.actualWeightG ? `${order.actualWeightG}g` : "Pending Weigher"}</strong></span>
                              {order.weightVariancePercent && (
                                <span className="bg-emerald-200/60 text-emerald-900 text-[10px] px-1.5 py-0.2 rounded font-bold">
                                  +{order.weightVariancePercent}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrderForSlip(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Digital Scale Slip</span>
                          </button>
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="border border-slate-100 rounded-xl overflow-hidden text-xs">
                        <div className="bg-slate-50 px-3 py-2 font-semibold text-slate-500 border-b border-slate-100 grid grid-cols-12">
                          <span className="col-span-6">Notebook Item & Specs</span>
                          <span className="col-span-2 text-center">Qty</span>
                          <span className="col-span-2 text-right">Weight</span>
                          <span className="col-span-2 text-right">Price</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="px-3 py-2.5 grid grid-cols-12 items-center">
                              <div className="col-span-6">
                                <span className="font-bold text-slate-900 block truncate">
                                  {item.name}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {item.subject} • {item.gsm} GSM • {item.rulingType}
                                </span>
                              </div>
                              <span className="col-span-2 text-center font-bold text-slate-700">
                                {item.quantity}x
                              </span>
                              <span className="col-span-2 text-right text-slate-600 font-medium">
                                {item.totalWeightG.toFixed(0)}g
                              </span>
                              <span className="col-span-2 text-right font-bold text-slate-900">
                                ₹{item.totalPrice.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer: Totals & Reorder Button */}
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                        <div className="text-xs text-slate-500">
                          <span>Delivery to: </span>
                          <strong className="text-slate-700">{order.customer.address}</strong>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Total Billed:</span>
                            <span className="text-base font-black text-slate-900">
                              ₹{order.totalPrice.toFixed(2)}
                            </span>
                          </div>

                          <button
                            onClick={() => handleReorder(order)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reorder Weight Bundle</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Saved Presets */}
        {activeTab === "presets" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Your Saved Subject Presets</h3>
              <p className="text-xs text-slate-500">
                Pre-configured notebook sets optimized for full academic semesters with zero paper weight wasted.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAVED_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {preset.itemsCount} Notebook Bundle
                      </span>
                      <span className="font-extrabold text-xs text-emerald-700">
                        ~{preset.estimatedWeightKg}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {preset.name}
                    </h4>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Bundle Price:</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-slate-900">
                          ₹{preset.estimatedPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{preset.retailPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLoadPreset(preset)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add Bundle to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Weight Savings Analytics */}
        {activeTab === "analytics" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Transparency Report: How Much Did You Save?</h3>
              <p className="text-xs text-slate-500">
                A mathematical breakdown comparing Pardewala's mass-based pricing vs typical retail printed MRP.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80">
                <span className="text-xs font-bold text-emerald-800 block">Total Paper Mass</span>
                <span className="text-2xl font-black text-emerald-950 mt-1 block">12.85 KG</span>
                <p className="text-[11px] text-emerald-700 mt-1">
                  Equivalent to 38 laboratory records and registers verified on calibrated industrial scales.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <span className="text-xs font-bold text-slate-600 block">Pardewala Price Paid</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">₹1,028.00</span>
                <p className="text-[11px] text-slate-500 mt-1">
                  Strictly billed at an average of ₹80/KG without retail packaging markup.
                </p>
              </div>

              <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200">
                <span className="text-xs font-bold text-rose-800 block">Estimated Retail Store MRP</span>
                <span className="text-2xl font-black text-rose-950 mt-1 block">₹1,423.00</span>
                <p className="text-[11px] text-rose-700 mt-1">
                  Retail stationery shops charge ~₹35 to ₹55 per piece, creating a 38% hidden mark-up.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Zero Gouging Guarantee
                </span>
                <h4 className="text-lg font-bold mt-0.5">
                  Your Net Academic Savings: ₹395.00
                </h4>
                <p className="text-slate-300 text-xs mt-1 max-w-lg">
                  Every notebook batch you purchase directly supports student budget equity through exact digital scale calibration.
                </p>
              </div>

              <Link
                to="/"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shrink-0 transition-colors"
              >
                Buy More Notebooks by Weight
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Digital Scale Verification Slip Modal */}
      {selectedOrderForSlip && (
        <WeightSlipModal
          order={selectedOrderForSlip}
          onClose={() => setSelectedOrderForSlip(null)}
        />
      )}
    </div>
  );
}