'use client';

import Header from '@/components/Header';
import CategoryTabs from '@/components/CategoryTabs';
import MenuItemCard from '@/components/MenuItemCard';
import { useMenuStore } from '@/store/useMenuStore';
import { MENU_ITEMS, CATEGORIES } from '@/data/menuData';
import { Search as SearchIcon, X, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuContent />
    </Suspense>
  );
}

function MenuContent() {
  const { language, activeCategory, searchQuery, setSearchQuery, menuItems, fetchSettings } = useMenuStore();
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get('table');

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory ? item.category_id === activeCategory : true;
    const name = language === 'ar' ? item.name_ar : item.name_en;
    const description = language === 'ar' ? item.description_ar : item.description_en;
    const matchesSearch = searchQuery
      ? name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />
      
      <main className="max-w-xl mx-auto px-4">
        {/* Search Bar */}
        <div className="mt-6 mb-4">
          <div className="relative group">
            <SearchIcon 
              size={18} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-saj-brown/40 group-focus-within:text-saj-brown transition-colors" 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث عن وجبتك المفضلة...' : 'Search for your favorite meal...'}
              className={cn(
                "w-full bg-white border border-saj-brown/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-saj-brown/20 focus:border-saj-brown/30 transition-all shadow-sm",
                language === 'ar' ? "font-arabic" : "font-english"
              )}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-saj-brown/5 rounded-full transition-colors"
              >
                <X size={16} className="text-saj-brown/40" />
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation */}
        <div className="-mx-4 mb-6">
          <CategoryTabs />
        </div>

        {/* Menu Items */}
        <div className="space-y-8">
          {CATEGORIES.filter(cat => activeCategory ? cat.id === activeCategory : true).map((category) => {
            const categoryItems = filteredItems.filter(item => item.category_id === category.id);
            if (categoryItems.length === 0) return null;

            return (
              <section key={category.id} className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <span className="text-xl">{category.icon}</span>
                  <h2 className={cn(
                    "text-xl font-bold text-saj-brown",
                    language === 'ar' ? "font-arabic" : "font-english"
                  )}>
                    {language === 'ar' ? category.name_ar : category.name_en}
                  </h2>
                  <div className="flex-1 h-px bg-saj-brown/10 ml-2" />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {categoryItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            );
          })}

          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center space-y-4"
            >
              <div className="text-5xl font-arabic text-saj-brown/20">🍽️</div>
              <p className={cn(
                "text-charcoal/40 text-sm",
                language === 'ar' ? "font-arabic" : "font-english"
              )}>
                {language === 'ar' ? 'لا يوجد نتائج، جرب بحثاً آخر' : 'No results found, try another search'}
              </p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Floating Action Button for WhatsApp Order will go here */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50">
        <OrderButton tableNumber={tableNumber} />
      </div>
    </div>
  );
}

function OrderButton({ tableNumber }: { tableNumber: string | null }) {
  const { cart, language, whatsappNumber } = useMenuStore();
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  if (cart.length === 0) return null;

  const handleOrder = () => {
    // 1. Sanitize number: remove any non-digit characters
    let cleanNumber = whatsappNumber.replace(/\D/g, '');
    
    // 2. Remove international leading zeros (00...)
    if (cleanNumber.startsWith('00')) {
      cleanNumber = cleanNumber.substring(2);
    }
    
    // 3. Precise Lebanon Auto-Fix (961)
    if (cleanNumber.startsWith('961')) {
      // Already correct
    } else {
      // If it starts with 0, remove it (e.g., 03 -> 3)
      if (cleanNumber.startsWith('0')) {
        cleanNumber = cleanNumber.substring(1);
      }
      // Prepend 961 if not there
      cleanNumber = '961' + cleanNumber;
    }

    const orderText = cart.map(i => `${i.quantity}x ${language === 'ar' ? i.name_ar : i.name_en}`).join('\n');
    const message = `Hello, I want to order:\n\n${orderText}\n\nTable: ${tableNumber || 'General'}\nTotal: ${totalPrice.toLocaleString('en-LB')} LBP`;
    const encodedMessage = encodeURIComponent(message);
    
    // 4. Using api.whatsapp.com/send?phone=... is most reliable for starting chats with unknown numbers
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`;
    
    // 5. Use location.href for direct redirection (avoids "popup blocked" or "new tab" breaks on mobile)
    window.location.href = whatsappUrl;
  };

  return (
    <motion.button
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onClick={handleOrder}
      className="w-full bg-olive hover:bg-olive-light text-cream rounded-2xl p-4 shadow-xl shadow-olive/30 flex items-center justify-between group transition-all active:scale-95"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
          <ShoppingCart size={20} className="text-white" />
        </div>
        <div className="text-left flex flex-col">
          <span className={cn(
            "text-xs opacity-80 uppercase tracking-widest font-bold",
            language === 'ar' ? "font-arabic" : "font-english"
          )}>
            {language === 'ar' ? 'إتمام الطلب' : 'Complete Order'}
          </span>
          <span className="text-lg font-bold">
            {totalPrice.toLocaleString('en-LB')} LBP
          </span>
        </div>
      </div>
      
      <div className={cn(
        "bg-white/20 px-4 py-2 rounded-xl font-bold text-sm",
        language === 'ar' ? "font-arabic" : "font-english"
      )}>
        {language === 'ar' ? 'اطلب الآن' : 'Order Now'}
      </div>
    </motion.button>
  );
}
