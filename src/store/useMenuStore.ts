import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'ar' | 'en';

export interface MenuItem {
  id: string;
  category_id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  image_url: string;
  is_popular: boolean;
  spice_level: number;
  is_veg: boolean;
  is_available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

interface MenuState {
  language: Language;
  setLanguage: (lang: Language) => void;
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  activeCategory: string | null;
  setActiveCategory: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  whatsappNumber: string;
  setWhatsappNumber: (number: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      language: 'ar',
      setLanguage: (lang) => set({ language: lang }),
      cart: [],
      whatsappNumber: '961XXXXXXXXX',
      setWhatsappNumber: (number) => set({ whatsappNumber: number }),
      isMenuOpen: true,
      setIsMenuOpen: (open) => set({ isMenuOpen: open }),
      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { cart: [...state.cart, { ...item, quantity: 1 }] };
        }),
      removeFromCart: (itemId) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.id !== itemId),
        })),
      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          cart: quantity > 0
            ? state.cart.map((i) => (i.id === itemId ? { ...i, quantity } : i))
            : state.cart.filter((i) => i.id !== itemId),
        })),
      clearCart: () => set({ cart: [] }),
      activeCategory: null,
      setActiveCategory: (id) => set({ activeCategory: id }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'lebanese-saj-menu-storage',
    }
  )
);
