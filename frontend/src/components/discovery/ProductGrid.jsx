import { SlidersHorizontal, RefreshCcw } from "lucide-react";
import ProductCard from "./ProductCard";
import { NOTEBOOK_PRODUCTS } from "../../data/notebookProducts";
import { useCartStore } from "../../store/cartStore";

export default function ProductGrid() {
  const { searchQuery, selectedCategory, sortBy, setSortBy, setSearchQuery, setSelectedCategory } = useCartStore();

  // Filter products based on search and category
  const filteredProducts = NOTEBOOK_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.rulingType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.gsm.toString().includes(searchQuery);

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.pricePerKg - b.pricePerKg;
    if (sortBy === "price-high") return b.pricePerKg - a.pricePerKg;
    if (sortBy === "weight-low") return a.weightPerNotebookG - b.weightPerNotebookG;
    if (sortBy === "weight-high") return b.weightPerNotebookG - a.weightPerNotebookG;
    if (sortBy === "gsm-high") return b.gsm - a.gsm;
    return 0; // Default featured
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar: Results Count & Sort Dropdown */}
      <div className="flex flex-col sm:row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Notebook Catalog</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {sortedProducts.length} {sortedProducts.length === 1 ? "Product" : "Products"} Available
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Select any notebook to view weight tiers and build custom bundles
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs self-end sm:self-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-emerald-500 text-xs shadow-2xs"
          >
            <option value="featured">Featured & Recommended</option>
            <option value="price-low">Price per KG: Low to High</option>
            <option value="price-high">Price per KG: High to Low</option>
            <option value="weight-low">Weight per Unit: Lightest first</option>
            <option value="weight-high">Weight per Unit: Heaviest first</option>
            <option value="gsm-high">Paper Thickness: Highest GSM</option>
          </select>
        </div>
      </div>

      {/* Grid Display */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <RefreshCcw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No notebooks match your search</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search terms or clearing selected category filters.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
