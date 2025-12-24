import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

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
  fetchSettings: () => Promise<void>;
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (itemId: string) => void;
}

import { MENU_ITEMS } from '@/data/menuData';

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      language: 'ar',
      setLanguage: (lang) => set({ language: lang }),
      cart: [],
      whatsappNumber: '961XXXXXXXXX',
      setWhatsappNumber: async (number) => {
        set({ whatsappNumber: number });
        // Persist to Supabase
        await supabase.from('settings').upsert({ id: '1', whatsapp_number: number });
      },
      isMenuOpen: true,
      setIsMenuOpen: async (open) => {
        set({ isMenuOpen: open });
        // Persist to Supabase
        await supabase.from('settings').upsert({ id: '1', is_menu_open: open });
      },
      fetchSettings: async () => {
        try {
          const { data, error } = await supabase.from('settings').select('*').eq('id', '1').single();
          if (data && !error) {
            set({ 
              whatsappNumber: data.whatsapp_number || '961XXXXXXXXX',
              isMenuOpen: data.is_menu_open ?? true 
            });
          }
        } catch (err) {
          console.error('Failed to fetch settings from Supabase:', err);
        }
      },
      menuItems: MENU_ITEMS,
      setMenuItems: (items) => set({ menuItems: items }),
      addMenuItem: (item) => set((state) => ({ menuItems: [item, ...state.menuItems] })),
      updateMenuItem: (item) => set((state) => ({
        menuItems: state.menuItems.map((i) => (i.id === item.id ? item : i)),
      })),
      deleteMenuItem: (itemId) => set((state) => ({
        menuItems: state.menuItems.filter((i) => i.id !== itemId),
      })),
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
      // Only persist local-specific state to localStorage
      partialize: (state) => ({
        language: state.language,
        cart: state.cart,
      }),
    }
  )
);
