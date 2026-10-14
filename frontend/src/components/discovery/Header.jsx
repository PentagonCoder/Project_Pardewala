import { Link } from "react-router-dom";
import { Search, ShoppingBag, Scale, X, Calculator, BookOpen, User, ShieldCheck } from "lucide-react";
import { useCartStore } from "../../store/cartStore";

const CATEGORIES = [
  "All",
  "Science",
  "Mathematics",
  "Graph & Engineering",
  "Commerce",
  "General"
];

export default function Header() {
  const {
    cart,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    toggleCart,
    openWeightCalc
  } = useCartStore();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalWeightG = cart.reduce((acc, item) => acc + item.totalWeightG, 0);
  const totalWeightDisplay =
    totalWeightG >= 1000
      ? `${(totalWeightG / 1000).toFixed(2)} KG`
      : `${Math.round(totalWeightG)}g`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Notification / Trust Bar with Dashboard Links */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">
              <strong>Per-Notebook Weight Transparency:</strong> Certified calibrated industrial weighing • No retail air margins!
            </span>
            <span className="sm:hidden font-bold">
              Fair Notebooks by Weight (KG)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openWeightCalc}
              className="hidden md:flex items-center gap-1 hover:text-emerald-100 transition-colors cursor-pointer text-xs"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Weight Calc</span>
            </button>

            <span className="text-white/40 hidden md:inline">|</span>

            {/* Quick Portal Switchers */}
            <Link
              to="/user/dashboard"
              className="hover:text-emerald-100 flex items-center gap-1 transition-colors text-xs font-semibold bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md"
            >
              <User className="w-3 h-3" />
              <span>Client Dashboard</span>
            </Link>

            <Link
              to="/admin/dashboard"
              className="hover:text-emerald-100 flex items-center gap-1 transition-colors text-xs font-semibold bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              <span>Seller Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Scale className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                  Pardewala
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-300">
                  BY WEIGHT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Pay by KG, Not by Book Markup
              </p>
            </div>
          </Link>

          {/* Prominent Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notebooks by subject (Physics, Chemistry, Graph), GSM, ruling..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-full border border-slate-200 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Actions & Cart Badge */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Weight Calculator Button */}
            <button
              onClick={openWeightCalc}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg border border-slate-200 hover:border-emerald-200 transition-all cursor-pointer"
              title="Estimate cost for total KG weight"
            >
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Weight Calc</span>
            </button>

            {/* Cart Icon Badge */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-md shadow-slate-900/10 active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-slate-950 text-[11px] font-black rounded-full flex items-center justify-center border-2 border-slate-900 animate-in zoom-in-50">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] text-slate-400 font-medium">Cart</span>
                <span className="text-xs font-bold text-emerald-400">
                  {totalItems > 0 ? totalWeightDisplay : "Empty"}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <BookOpen className="w-3.5 h-3.5" /> Filter:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs shadow-emerald-600/30 font-semibold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
