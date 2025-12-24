'use client';

import { MenuItem, useMenuStore } from '@/store/useMenuStore';
import { cn, formatPrice } from '@/lib/utils';
import { Plus, Minus, Flame, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { language, cart, addToCart, updateQuantity } = useMenuStore();
  
  const cartItem = cart.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleDecrease = () => {
    if (quantity > 0) {
      updateQuantity(item.id, quantity - 1);
    }
  };

  const name = language === 'ar' ? item.name_ar : item.name_en;
  const description = language === 'ar' ? item.description_ar : item.description_en;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-3 shadow-sm border border-saj-brown/5 flex gap-4 hover:shadow-md transition-all relative group overflow-hidden"
    >
      {/* Popular Badge */}
      {item.is_popular && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-gold text-[10px] font-bold text-white px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
            <span>{language === 'ar' ? 'الأكثر طلباً' : 'Popular'}</span>
          </div>
        </div>
      )}

      {/* Item Image */}
      <div className="relative w-24 h-24 flex-none rounded-xl overflow-hidden bg-cream/50">
        <div className="absolute inset-0 flex items-center justify-center text-saj-brown/20 uppercase font-bold text-[10px]">
          {name}
        </div>
        {/* Using a placeholder for now since I don't have real images yet */}
        <div className="absolute inset-0 bg-linear-to-br from-saj-brown/10 to-olive/10 group-hover:scale-110 transition-transform duration-500" />
      </div>

      {/* Item Details */}
      <div className="flex flex-col flex-1 min-w-0 py-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className={cn(
            "text-base font-bold text-saj-brown truncate",
            language === 'ar' ? "font-arabic" : "font-english"
          )}>
            {name}
          </h3>
        </div>
        
        <p className={cn(
          "text-xs text-charcoal/60 line-clamp-2 mb-2 leading-relaxed h-[2.5em]",
          language === 'ar' ? "font-arabic" : "font-english text-[10px]"
        )}>
          {description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-olive whitespace-nowrap">
            {formatPrice(item.price)}
          </span>

          <div className="flex items-center gap-1">
            {item.is_veg && <Leaf size={14} className="text-olive/60" />}
            {item.spice_level > 0 && Array.from({ length: item.spice_level }).map((_, i) => (
              <Flame key={i} size={14} className="text-red-500/60" />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <AnimatePresence>
              {quantity > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2"
                >
                  <button
                    onClick={handleDecrease}
                    className="w-7 h-7 rounded-full bg-saj-brown/5 text-saj-brown flex items-center justify-center border border-saj-brown/10"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={() => addToCart(item)}
              className="w-7 h-7 rounded-full bg-saj-brown text-cream flex items-center justify-center shadow-md shadow-saj-brown/20 active:scale-95 transition-transform"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
