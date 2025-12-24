'use client';

import { useState, useEffect } from 'react';
import { MenuItem, useMenuStore } from '@/store/useMenuStore';
import { CATEGORIES } from '@/data/menuData';
import { cn } from '@/lib/utils';
import { X, Save, Upload, Flame, Leaf, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<MenuItem>) => void;
  initialData?: MenuItem | null;
}

export default function MenuFormModal({ isOpen, onClose, onSave, initialData }: MenuFormModalProps) {
  const { language } = useMenuStore();
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    price: 0,
    category_id: CATEGORIES[0].id,
    is_available: true,
    is_popular: false,
    is_veg: true,
    spice_level: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name_ar: '',
        name_en: '',
        description_ar: '',
        description_en: '',
        price: 0,
        category_id: CATEGORIES[0].id,
        is_available: true,
        is_popular: false,
        is_veg: true,
        spice_level: 0,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-saj-brown/20 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="p-6 border-b border-saj-brown/5 flex items-center justify-between bg-cream/20">
            <h2 className={cn(
              "text-xl font-bold text-saj-brown",
              language === 'ar' ? "font-arabic" : "font-english"
            )}>
              {initialData 
                ? (language === 'ar' ? 'تعديل الوجبة' : 'Edit Dish') 
                : (language === 'ar' ? 'إضافة وجبة جديدة' : 'Add New Dish')}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-saj-brown/5 rounded-full transition-colors">
              <X size={20} className="text-saj-brown" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
            {/* Image Upload Area */}
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-saj-brown/10 rounded-2xl bg-cream/5 hover:bg-cream/10 transition-colors cursor-pointer group">
              <Upload size={32} className="text-saj-brown/20 group-hover:text-saj-brown/40 transition-colors mb-2" />
              <p className="text-xs font-bold text-saj-brown/40 uppercase tracking-widest text-center">
                {language === 'ar' ? 'تحميل صورة الوجبة' : 'Upload dish image'}
              </p>
              <p className="text-[10px] text-olive/40 mt-1 uppercase">Max 2MB • JPG, PNG</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Arabic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-saj-brown/60 uppercase tracking-widest font-arabic">اسم الوجبة (عربي)</label>
                  <input
                    required
                    dir="rtl"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    className="w-full bg-white border border-saj-brown/10 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-saj-brown/20 font-arabic"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-saj-brown/60 uppercase tracking-widest font-arabic">الوصف (عربي)</label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    className="w-full bg-white border border-saj-brown/10 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-saj-brown/20 font-arabic resize-none"
                  />
                </div>
              </div>

              {/* English Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-saj-brown/60 uppercase tracking-widest font-english">Dish Name (EN)</label>
                  <input
                    required
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="w-full bg-white border border-saj-brown/10 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-saj-brown/20 font-english"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-saj-brown/60 uppercase tracking-widest font-english">Description (EN)</label>
                  <textarea
                    rows={3}
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    className="w-full bg-white border border-saj-brown/10 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-saj-brown/20 font-english resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-saj-brown/60 uppercase tracking-widest">
                  {language === 'ar' ? 'السعر (LBP)' : 'Price (LBP)'}
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-white border border-saj-brown/10 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-saj-brown/20 font-english"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-saj-brown/60 uppercase tracking-widest">
                  {language === 'ar' ? 'التصنيف' : 'Category'}
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full bg-white border border-saj-brown/10 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-saj-brown/20"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {language === 'ar' ? cat.name_ar : cat.name_en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {/* Availability Toggle */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_available: !formData.is_available })}
                className={cn(
                  "p-3 rounded-2xl border transition-all flex flex-col items-center gap-1",
                  formData.is_available ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
                )}
              >
                <Package size={16} />
                <span className="text-[10px] font-bold uppercase">{language === 'ar' ? 'متوفر' : 'Stock'}</span>
              </button>

              {/* Popular Toggle */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_popular: !formData.is_popular })}
                className={cn(
                  "p-3 rounded-2xl border transition-all flex flex-col items-center gap-1",
                  formData.is_popular ? "bg-gold border-gold text-white" : "bg-white border-saj-brown/10 text-saj-brown/40"
                )}
              >
                <Flame size={16} />
                <span className="text-[10px] font-bold uppercase">{language === 'ar' ? 'مميز' : 'Popular'}</span>
              </button>

              {/* Veg Toggle */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_veg: !formData.is_veg })}
                className={cn(
                  "p-3 rounded-2xl border transition-all flex flex-col items-center gap-1",
                  formData.is_veg ? "bg-olive text-white border-olive" : "bg-white border-saj-brown/10 text-saj-brown/40"
                )}
              >
                <Leaf size={16} />
                <span className="text-[10px] font-bold uppercase">{language === 'ar' ? 'نباتي' : 'Veg'}</span>
              </button>

               {/* Spice Level */}
               <div className="flex flex-col items-center gap-1 p-3 border border-saj-brown/10 rounded-2xl bg-white">
                 <div className="flex gap-1">
                   {[1, 2].map((level) => (
                     <button
                       key={level}
                       type="button"
                       onClick={() => setFormData({ ...formData, spice_level: formData.spice_level === level ? 0 : level })}
                       className={cn(
                         "transition-all",
                         formData.spice_level! >= level ? "text-red-500 scale-110" : "text-gray-300"
                       )}
                     >
                       <Flame size={14} />
                     </button>
                   ))}
                 </div>
                 <span className="text-[10px] font-bold text-saj-brown/40 uppercase tracking-widest">{language === 'ar' ? 'حرارة' : 'Spice'}</span>
               </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-saj-brown hover:bg-saj-brown-light text-cream font-bold py-4 rounded-2xl shadow-xl shadow-saj-brown/20 transition-all flex items-center justify-center gap-2 group"
              >
                <Save size={20} className="group-hover:scale-110 transition-transform" />
                <span className={language === 'ar' ? "font-arabic" : "font-english"}>
                   {initialData ? (language === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (language === 'ar' ? 'إضافة الوجبة' : 'Add Dish')}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
