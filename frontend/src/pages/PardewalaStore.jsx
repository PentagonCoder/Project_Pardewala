import Header from "../components/discovery/Header";
import PricingBanner from "../components/discovery/PricingBanner";
import ProductGrid from "../components/discovery/ProductGrid";
import SmartAddToCartModal from "../components/discovery/SmartAddToCartModal";
import CartDrawer from "../components/discovery/CartDrawer";
import WeightCalculatorModal from "../components/discovery/WeightCalculatorModal";
import { useCartStore } from "../store/cartStore";
import { CheckCircle2, Scale, BookOpen, ShieldCheck } from "lucide-react";

export default function PardewalaStore() {
  const { toastMessage } = useCartStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/40 animate-fade-in">
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-100">{toastMessage}</span>
        </div>
      )}

      {/* 1. Brand Header & Navigation with Search and Cart Count */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
        {/* 1b. Informational Banner explaining KG-based pricing model */}
        <PricingBanner />

        {/* 2. Product Catalogue & Grid with per-notebook weight and piece price transparency */}
        <ProductGrid />

        {/* Trust Badges / Footer Feature Section */}
        <div className="mt-16 pt-10 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-600">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Industrial Scale Calibrated</h4>
              <p className="text-xs text-slate-500 mt-1">
                Each parcel undergoes digital scale verification before dispatch. Every gram is logged on your invoice.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Custom Subject Bundling</h4>
              <p className="text-xs text-slate-500 mt-1">
                Build semester sets across Physics, Chemistry, Biology, and Graph paper with zero weight wasted.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Direct Mill Paper Sourcing</h4>
              <p className="text-xs text-slate-500 mt-1">
                Zero retail middlemen or arbitrary retail packaging fees. Premium 70-90 GSM chlorine-free pages.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800">Pardewala™ E-Commerce</span>
            <span>— The Fair KG-Weight Notebook Platform</span>
          </div>
          <p className="text-slate-400">
            Prototype UI built with React, Tailwind CSS, & Lucide Icons
          </p>
        </div>
      </footer>

      {/* 3. Smart Add-to-Cart Slide-Up Bottom Sheet Modal (Crucial UX) */}
      <SmartAddToCartModal />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Interactive Weight Calculator Modal */}
      <WeightCalculatorModal />
    </div>
  );
}
