'use client';

import { useMenuStore } from '@/store/useMenuStore';
import { ShoppingCart, Globe, Menu as MenuIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const { language, setLanguage, cart } = useMenuStore();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-saj-brown/10 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-saj-brown rounded-full flex items-center justify-center text-cream font-bold text-xl shadow-lg">
          S
        </div>
        <div className="flex flex-col">
          <h1 className="font-arabic font-bold text-lg leading-tight text-saj-brown">
            {language === 'ar' ? 'صاج البركة' : 'Saj Al-Baraka'}
          </h1>
          <span className="text-[10px] text-olive font-medium uppercase tracking-wider">
            {language === 'ar' ? 'أصيل وشهي' : 'Authentic & Delicious'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleLanguage}
          className="p-2 hover:bg-saj-brown/5 rounded-full transition-colors flex items-center gap-1 text-sm font-medium"
          aria-label="Toggle Language"
        >
          <Globe size={18} className="text-olive" />
          <span className={language === 'ar' ? 'font-english' : 'font-arabic'}>
            {language === 'ar' ? 'EN' : 'عربي'}
          </span>
        </button>

        <button
          className="relative p-2 hover:bg-saj-brown/5 rounded-full transition-colors"
          aria-label="View Cart"
        >
          <ShoppingCart size={22} className="text-saj-brown" />
          {cartItemsCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 w-5 h-5 bg-olive text-cream text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background"
            >
              {cartItemsCount}
            </motion.span>
          )}
        </button>
      </div>
    </header>
  );
}
