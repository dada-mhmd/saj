'use client';

import { CATEGORIES } from '@/data/menuData';
import { useMenuStore } from '@/store/useMenuStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // I'll need to create this util

export default function CategoryTabs() {
  const { activeCategory, setActiveCategory, language } = useMenuStore();

  return (
    <div className="sticky top-[65px] z-40 bg-background/95 backdrop-blur-sm border-b border-saj-brown/5 overflow-x-auto no-scrollbar py-3 px-4 flex gap-3">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id === activeCategory ? null : category.id)}
          className={cn(
            "flex-none flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300",
            activeCategory === category.id
              ? "bg-saj-brown text-cream border-saj-brown shadow-md shadow-saj-brown/20"
              : "bg-white text-saj-brown border-saj-brown/10 hover:border-saj-brown/30"
          )}
        >
          <span className="text-lg">{category.icon}</span>
          <span className={cn(
            "text-sm font-bold whitespace-nowrap",
            language === 'ar' ? "font-arabic" : "font-english"
          )}>
            {language === 'ar' ? category.name_ar : category.name_en}
          </span>
          
          {activeCategory === category.id && (
            <motion.div
              layoutId="activeCategory"
              className="absolute inset-0 rounded-full border-2 border-saj-brown -m-px"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
