import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  // Cart items state
  cart: [],
  isCartOpen: false,
  activeModalProduct: null,
  isWeightCalcOpen: false,
  toastMessage: null,

  // Discovery Filters
  searchQuery: "",
  selectedCategory: "All",
  sortBy: "featured",

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSortBy: (sortBy) => set({ sortBy }),

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  openBottomSheet: (product) => set({ activeModalProduct: product }),
  closeBottomSheet: () => set({ activeModalProduct: null }),

  openWeightCalc: () => set({ isWeightCalcOpen: true }),
  closeWeightCalc: () => set({ isWeightCalcOpen: false }),

  showToast: (message) => {
    set({ toastMessage: message });
    setTimeout(() => {
      if (get().toastMessage === message) {
        set({ toastMessage: null });
      }
    }, 3200);
  },

  // Add individual or multiple items
  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existingIndex = state.cart.findIndex((item) => item.productId === product.id);
      const piecePrice = (product.pricePerKg * product.weightPerNotebookG) / 1000;
      
      let newCart = [...state.cart];
      if (existingIndex > -1) {
        const item = newCart[existingIndex];
        const newQty = item.quantity + quantity;
        newCart[existingIndex] = {
          ...item,
          quantity: newQty,
          totalWeightG: Number((newQty * item.weightPerNotebookG).toFixed(2)),
          totalPrice: Number((newQty * item.piecePrice).toFixed(2)),
        };
      } else {
        newCart.push({
          productId: product.id,
          name: product.name,
          brand: product.brand,
          subject: product.subject,
          gsm: product.gsm,
          rulingType: product.rulingType,
          pricePerKg: product.pricePerKg,
          weightPerNotebookG: product.weightPerNotebookG,
          piecePrice: Number(piecePrice.toFixed(2)),
          quantity,
          totalWeightG: Number((quantity * product.weightPerNotebookG).toFixed(2)),
          totalPrice: Number((quantity * piecePrice).toFixed(2)),
        });
      }

      return { cart: newCart };
    });
  },

  // Add a complete bundle (primary item + related items)
  addBundleToCart: (primaryProduct, primaryQty, relatedItems) => {
    // relatedItems: Array of { product, quantity }
    set((state) => {
      let newCart = [...state.cart];

      const addItem = (product, qty) => {
        if (qty <= 0) return;
        const existingIndex = newCart.findIndex((item) => item.productId === product.id);
        const piecePrice = (product.pricePerKg * product.weightPerNotebookG) / 1000;

        if (existingIndex > -1) {
          const item = newCart[existingIndex];
          const newQty = item.quantity + qty;
          newCart[existingIndex] = {
            ...item,
            quantity: newQty,
            totalWeightG: Number((newQty * item.weightPerNotebookG).toFixed(2)),
            totalPrice: Number((newQty * item.piecePrice).toFixed(2)),
          };
        } else {
          newCart.push({
            productId: product.id,
            name: product.name,
            brand: product.brand,
            subject: product.subject,
            gsm: product.gsm,
            rulingType: product.rulingType,
            pricePerKg: product.pricePerKg,
            weightPerNotebookG: product.weightPerNotebookG,
            piecePrice: Number(piecePrice.toFixed(2)),
            quantity: qty,
            totalWeightG: Number((qty * product.weightPerNotebookG).toFixed(2)),
            totalPrice: Number((qty * piecePrice).toFixed(2)),
          });
        }
      };

      // Add primary
      addItem(primaryProduct, primaryQty);

      // Add all related items
      relatedItems.forEach(({ product, quantity }) => {
        addItem(product, quantity);
      });

      return { cart: newCart, activeModalProduct: null };
    });

    const totalAddedCount = primaryQty + relatedItems.reduce((acc, curr) => acc + curr.quantity, 0);
    get().showToast(`✨ Added ${totalAddedCount} notebooks bundle to your weight cart!`);
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        return { cart: state.cart.filter((item) => item.productId !== productId) };
      }
      return {
        cart: state.cart.map((item) => {
          if (item.productId === productId) {
            return {
              ...item,
              quantity,
              totalWeightG: Number((quantity * item.weightPerNotebookG).toFixed(2)),
              totalPrice: Number((quantity * item.piecePrice).toFixed(2)),
            };
          }
          return item;
        }),
      };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.productId !== productId),
    }));
  },

  clearCart: () => set({ cart: [] }),

  // Computed helper getters
  getTotalItems: () => {
    return get().cart.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalWeightGrams: () => {
    return get().cart.reduce((total, item) => total + item.totalWeightG, 0);
  },

  getTotalPrice: () => {
    return get().cart.reduce((total, item) => total + item.totalPrice, 0);
  },
}));
