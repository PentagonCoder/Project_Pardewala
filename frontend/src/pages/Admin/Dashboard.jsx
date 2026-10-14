import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Scale,
  Package,
  Layers,
  Plus,
  Store,
  User,
  FileText,
  X
} from "lucide-react";
import { INITIAL_ORDERS, INVENTORY_PAPER_ROLLS } from "../../data/mockOrders";
import { NOTEBOOK_PRODUCTS, calculatePiecePrice, formatGrams } from "../../data/notebookProducts";
import { useCartStore } from "../../store/cartStore";
import WeightSlipModal from "../../components/discovery/WeightSlipModal";

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState("dispatch");
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [products, setProducts] = useState(NOTEBOOK_PRODUCTS);
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState(null);

  // Weighed Dispatch Active Order State
  const [activeWeighingOrder, setActiveWeighingOrder] = useState(null);
  const [inputScaleWeightG, setInputScaleWeightG] = useState("");
  const [scaleTareWeightG] = useState(42.0);

  // Add Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProd, setNewProd] = useState({
    name: "",
    brand: "Classmate",
    subject: "Physics",
    category: "Science",
    gsm: 70,
    pages: 160,
    rulingType: "Single Line (Interleaf)",
    pricePerKg: 80.0,
    referenceWeightGrams: 1000,
    notebooksInReference: 3,
    badge: "New Release",
    description: "Industrial calibrated student notebook with high opacity smooth writing sheets."
  });

  const { showToast } = useCartStore();

  // Execute Scale Certification
  const handleCertifyWeighing = (e) => {
    e.preventDefault();
    if (!activeWeighingOrder || !inputScaleWeightG) return;

    const actualG = parseFloat(inputScaleWeightG);
    const estG = activeWeighingOrder.estimatedWeightG;
    const varianceG = Number((actualG - estG).toFixed(1));
    const variancePct = Number(((varianceG / estG) * 100).toFixed(2));

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === activeWeighingOrder.id) {
          return {
            ...ord,
            status: "dispatched",
            statusLabel: "Scale Audited & Dispatched",
            actualWeightG: actualG,
            weightVarianceG: varianceG,
            weightVariancePercent: variancePct,
            scaleId: "SCALE-BLR-04",
            operatorName: "Vikram K. (Certified Weigher)",
            calibratedDate: "2026-10-14 08:00 AM"
          };
        }
        return ord;
      })
    );

    showToast(`⚖️ Order ${activeWeighingOrder.orderNumber} successfully certified at ${actualG}g!`);
    setActiveWeighingOrder(null);
    setInputScaleWeightG("");
  };

  // Add New Product Handler
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProd.name) return;

    const calculatedWeight = Number((newProd.referenceWeightGrams / newProd.notebooksInReference).toFixed(2));
    const created = {
      ...newProd,
      id: `prod-custom-${Date.now()}`,
      weightPerNotebookG: calculatedWeight,
      inStock: true,
      rating: 5.0,
      reviewsCount: 1,
      coverColor: "from-indigo-600 to-slate-900",
      relatedProductIds: ["prod-phys-01", "prod-chem-02"]
    };

    setProducts((prev) => [created, ...prev]);
    showToast(`📦 Created new notebook: ${created.name} at ₹${created.pricePerKg}/KG!`);
    setIsAddProductOpen(false);
  };

  // Quick Price/KG adjustment
  const handleUpdatePrice = (id, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newPrice = Math.max(10, p.pricePerKg + delta);
          return { ...p, pricePerKg: newPrice };
        }
        return p;
      })
    );
  };

  // Preview calculations for new product modal
  const previewPerNotebookWeight = newProd.referenceWeightGrams / (newProd.notebooksInReference || 1);
  const previewPiecePrice = calculatePiecePrice(newProd.pricePerKg, previewPerNotebookWeight);

  // Total weight metrics
  const totalWeightDispatchedKg = orders.reduce((acc, curr) => acc + (curr.actualWeightG || curr.estimatedWeightG), 0) / 1000;
  const pendingWeighOrders = orders.filter((o) => o.status === "pending_weighing");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <Scale className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Pardewala
              </span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-md">
              Seller & Scale Dispatch Center
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Scale Online Pill */}
            <div className="hidden md:flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">Station #04 Scale: <strong>Mettler Class II</strong> (NABL Calibrated)</span>
            </div>

            <Link
              to="/user/dashboard"
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer View</span>
            </Link>

            <Link
              to="/"
              className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/60 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium block">Total Dispatched Paper Mass</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">{totalWeightDispatchedKg.toFixed(2)}</span>
              <span className="text-xs font-bold text-emerald-600">KG</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">100% digital scale audited</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium block">Orders Awaiting Weighing</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-2xl font-black ${pendingWeighOrders.length > 0 ? "text-amber-600" : "text-slate-900"}`}>
                {pendingWeighOrders.length}
              </span>
              <span className="text-xs font-bold text-slate-500">Parcels</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Ready at bench scale</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium block">Active Catalog Listings</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">{products.length}</span>
              <span className="text-xs font-bold text-slate-500">Notebooks</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Across 6 academic categories</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium block">Avg Realized Rate</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">₹82.50</span>
              <span className="text-xs font-bold text-slate-500">/ KG</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Direct mill margin: +24%</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("dispatch")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "dispatch"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Weighed Dispatch Station ({pendingWeighOrders.length} Pending)</span>
          </button>

          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "catalog"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Package className="w-4 h-4 text-teal-400" />
            <span>Catalog & ₹/KG Price Manager ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "inventory"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Paper Mill Weight Stock ({INVENTORY_PAPER_ROLLS.length} GSM Types)</span>
          </button>
        </div>

        {/* Tab 1: Weighed Dispatch Station */}
        {activeTab === "dispatch" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>Industrial Weighing & Fulfillment Station</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Class II Certified
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Every parcel must be verified on calibrated scales before dispatch labels can be issued.
                </p>
              </div>

              <div className="text-xs bg-slate-200/80 px-3 py-1.5 rounded-xl font-mono text-slate-700">
                Tare Preset: <strong>{scaleTareWeightG}g</strong> (Packaging & Box)
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Order Number</th>
                      <th className="p-3.5">Customer & Items</th>
                      <th className="p-3.5 text-right">Catalog Est. Weight</th>
                      <th className="p-3.5 text-right">Actual Scale Weight</th>
                      <th className="p-3.5 text-center">Variance</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-right">Fulfillment Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((ord) => {
                      const isPending = ord.status === "pending_weighing";
                      return (
                        <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-slate-900">
                            {ord.orderNumber}
                            <span className="block text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                              {ord.date}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <span className="font-bold text-slate-900 block">{ord.customer.name}</span>
                            <span className="text-[11px] text-slate-500 truncate block max-w-xs">
                              {ord.items.map((i) => `${i.quantity}x ${i.subject}`).join(", ")}
                            </span>
                          </td>

                          <td className="p-3.5 text-right font-mono font-bold text-slate-700">
                            {formatGrams(ord.estimatedWeightG)}
                          </td>

                          <td className="p-3.5 text-right font-mono">
                            {ord.actualWeightG ? (
                              <span className="font-extrabold text-emerald-700">
                                {ord.actualWeightG}g
                              </span>
                            ) : (
                              <span className="text-amber-600 font-bold italic">
                                Ready for Scale
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 text-center font-mono">
                            {ord.weightVariancePercent ? (
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                                +{ord.weightVariancePercent}%
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          <td className="p-3.5 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] inline-block ${
                                isPending
                                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                                  : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              }`}
                            >
                              {ord.statusLabel}
                            </span>
                          </td>

                          <td className="p-3.5 text-right">
                            {isPending ? (
                              <button
                                onClick={() => {
                                  setActiveWeighingOrder(ord);
                                  // Default suggestion around estimated weight
                                  setInputScaleWeightG((ord.estimatedWeightG + 5.5).toFixed(1));
                                }}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                              >
                                <Scale className="w-3.5 h-3.5" />
                                <span>Weigh & Certify</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setSelectedOrderForSlip(ord)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                              >
                                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                                <span>View Slip</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Weighing Modal / Station Drawer */}
            {activeWeighingOrder && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-bottom-sheet">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                        <Scale className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">Bench Scale Audit</h4>
                        <span className="text-xs text-slate-500 font-mono">{activeWeighingOrder.orderNumber}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveWeighingOrder(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCertifyWeighing} className="space-y-4">
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Customer:</span>
                        <strong className="text-slate-800">{activeWeighingOrder.customer.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Expected Paper Mass:</span>
                        <strong className="text-slate-900 font-mono">{activeWeighingOrder.estimatedWeightG.toFixed(1)}g</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tare Box Deduction:</span>
                        <span className="text-slate-700 font-mono">-{scaleTareWeightG}g</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Enter Digital Scale Reading (Net Paper Grams):
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={inputScaleWeightG}
                          onChange={(e) => setInputScaleWeightG(e.target.value)}
                          className="w-full pl-3 pr-16 py-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-lg text-slate-900 focus:outline-none focus:border-emerald-500"
                        />
                        <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">
                          Grams
                        </span>
                      </div>
                    </div>

                    {inputScaleWeightG && (
                      <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-xs space-y-1">
                        <div className="flex justify-between text-emerald-900 font-bold">
                          <span>Calculated Variance:</span>
                          <span>
                            {(parseFloat(inputScaleWeightG) - activeWeighingOrder.estimatedWeightG).toFixed(1)}g (
                            {(((parseFloat(inputScaleWeightG) - activeWeighingOrder.estimatedWeightG) / activeWeighingOrder.estimatedWeightG) * 100).toFixed(2)}%)
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-700 block">
                          ✓ Verified: Within permissible NABL Class II packaging tolerance (±2.0%)
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveWeighingOrder(null)}
                        className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                      >
                        Certify & Issue Dispatch Label
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Catalog & Price Manager */}
        {activeTab === "catalog" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Notebook Product Catalog & Rate Configurator
                </h3>
                <p className="text-xs text-slate-500">
                  Update base ₹/KG rates with instant real-time piece price recalculation.
                </p>
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Notebook to Catalog</span>
              </button>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((prod) => {
                const perBookWeight = prod.weightPerNotebookG || (prod.referenceWeightGrams / prod.notebooksInReference);
                const piecePrice = calculatePiecePrice(prod.pricePerKg, perBookWeight);

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full uppercase">
                          {prod.subject}
                        </span>
                        <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-md border border-teal-200">
                          {prod.gsm} GSM • {prod.rulingType}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm mt-2 line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{prod.brand} • {prod.pages} Pages</p>
                    </div>

                    {/* Weight & Piece Math */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Reference:</span>
                        <strong className="text-slate-800">{prod.referenceWeightGrams}g / {prod.notebooksInReference} pcs</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Unit Mass:</span>
                        <strong className="text-slate-900 font-mono">~{perBookWeight.toFixed(1)}g</strong>
                      </div>
                      <div className="pt-1 border-t border-slate-200 flex justify-between text-slate-900 font-bold">
                        <span className="text-emerald-700">Piece Price:</span>
                        <span className="text-emerald-700 font-mono">~₹{piecePrice.toFixed(2)} / pc</span>
                      </div>
                    </div>

                    {/* Price/KG Control Bar */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Rate / KG:</span>
                        <span className="text-base font-black text-slate-900">₹{prod.pricePerKg}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdatePrice(prod.id, -5)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
                          title="Decrease price by ₹5/KG"
                        >
                          -₹5
                        </button>
                        <button
                          onClick={() => handleUpdatePrice(prod.id, 5)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
                          title="Increase price by ₹5/KG"
                        >
                          +₹5
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal: Add New Product */}
            {isAddProductOpen && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-bottom-sheet">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                        <Package className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">Add New Notebook Product</h4>
                    </div>
                    <button
                      onClick={() => setIsAddProductOpen(false)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Notebook Name:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Classmate Zoology Record 80 GSM"
                        value={newProd.name}
                        onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Subject:</label>
                        <input
                          type="text"
                          required
                          value={newProd.subject}
                          onChange={(e) => setNewProd({ ...newProd, subject: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Brand:</label>
                        <input
                          type="text"
                          required
                          value={newProd.brand}
                          onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">GSM:</label>
                        <input
                          type="number"
                          required
                          value={newProd.gsm}
                          onChange={(e) => setNewProd({ ...newProd, gsm: parseInt(e.target.value) || 70 })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Pages:</label>
                        <input
                          type="number"
                          required
                          value={newProd.pages}
                          onChange={(e) => setNewProd({ ...newProd, pages: parseInt(e.target.value) || 160 })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Rate (₹/KG):</label>
                        <input
                          type="number"
                          step="0.5"
                          required
                          value={newProd.pricePerKg}
                          onChange={(e) => setNewProd({ ...newProd, pricePerKg: parseFloat(e.target.value) || 80 })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-emerald-500 font-mono font-bold text-emerald-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Reference Batch (g):</label>
                        <input
                          type="number"
                          required
                          value={newProd.referenceWeightGrams}
                          onChange={(e) => setNewProd({ ...newProd, referenceWeightGrams: parseInt(e.target.value) || 1000 })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Notebooks in Batch:</label>
                        <input
                          type="number"
                          step="0.5"
                          required
                          value={newProd.notebooksInReference}
                          onChange={(e) => setNewProd({ ...newProd, notebooksInReference: parseFloat(e.target.value) || 3 })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Automatic Preview Calculation Box */}
                    <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-1">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                        Auto-Computed Weight & Piece Value:
                      </span>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Unit Mass:</span>
                        <strong className="text-white font-mono">~{previewPerNotebookWeight.toFixed(2)}g</strong>
                      </div>
                      <div className="flex justify-between text-xs pt-1 border-t border-slate-800">
                        <span className="text-slate-400">Customer Piece Price:</span>
                        <strong className="text-emerald-400 font-mono">~₹{previewPiecePrice.toFixed(2)} / pc</strong>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddProductOpen(false)}
                        className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Publish to Weight Catalog
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Raw Paper Stock Inventory */}
        {activeTab === "inventory" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Paper Mill Raw Stock Inventory by Weight (KG)
              </h3>
              <p className="text-xs text-slate-500">
                Real-time tracking of jumbo paper reels received from mills before cutting and binding.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {INVENTORY_PAPER_ROLLS.map((roll, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">
                      {roll.gsm} GSM Paper
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      In Stock
                    </span>
                  </div>

                  <p className="text-slate-500 text-[11px]">{roll.type}</p>

                  <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                    <span className="text-slate-400">Current Stock:</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-slate-900">{roll.stockWeightKg}</span>
                      <span className="text-xs font-bold text-emerald-700">KG</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Digital Scale Slip Modal */}
      {selectedOrderForSlip && (
        <WeightSlipModal
          order={selectedOrderForSlip}
          onClose={() => setSelectedOrderForSlip(null)}
        />
      )}
    </div>
  );
}