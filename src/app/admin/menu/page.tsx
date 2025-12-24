'use client';

import { useState } from 'react';
import { useMenuStore, MenuItem } from '@/store/useMenuStore';
import { MENU_ITEMS as initialItems } from '@/data/menuData';
import { cn, formatPrice } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import MenuFormModal from '@/components/MenuFormModal';

export default function AdminMenu() {
  const { 
    language, 
    menuItems, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem 
  } = useMenuStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' ? true : item.category_id === activeCategory;
    const name = language === 'ar' ? item.name_ar : item.name_en;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSave = (itemData: Partial<MenuItem>) => {
    if (editingItem) {
      updateMenuItem({ ...editingItem, ...itemData } as MenuItem);
    } else {
      const newItem = {
        ...itemData,
        id: `id-${Date.now()}`,
      } as MenuItem;
      addMenuItem(newItem);
    }
    setEditingItem(null);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const toggleAvailability = (id: string) => {
    const item = menuItems.find(i => i.id === id);
    if (item) {
      updateMenuItem({ ...item, is_available: !item.is_available });
    }
  };

  const deleteItem = (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الوجبة؟' : 'Are you sure you want to delete this dish?')) {
      deleteMenuItem(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={cn(
            "text-2xl font-bold text-saj-brown",
            language === 'ar' ? "font-arabic" : "font-english"
          )}>
            {language === 'ar' ? 'إدارة المنيو' : 'Menu Management'}
          </h1>
          <p className={cn(
            "text-sm text-charcoal/50",
            language === 'ar' ? "font-arabic" : "font-english"
          )}>
            {language === 'ar' ? 'أضف أو عدل الوجبات التي تظهر للزبائن' : 'Add or edit items shown to customers'}
          </p>
        </div>

        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-saj-brown text-cream px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-saj-brown/20 hover:bg-saj-brown-light transition-all active:scale-95"
        >
          <Plus size={20} />
          <span className={language === 'ar' ? "font-arabic" : "font-english"}>
            {language === 'ar' ? 'وجبة جديدة' : 'New Dish'}
          </span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-saj-brown/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث باسم الوجبة...' : 'Search by dish name...'}
            className="w-full bg-white border border-saj-brown/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-saj-brown/20 transition-all shadow-sm"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="bg-white border border-saj-brown/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saj-brown/20 transition-all shadow-sm min-w-[140px]"
          >
            <option value="all">{language === 'ar' ? 'جميع التصنيف' : 'All Categories'}</option>
            <option value="saj">{language === 'ar' ? 'سندويشات صاج' : 'Saj'}</option>
            <option value="sides">{language === 'ar' ? 'مقبلات' : 'Sides'}</option>
            <option value="drinks">{language === 'ar' ? 'مشروبات' : 'Drinks'}</option>
          </select>
        </div>
      </div>

      {/* Items Table / List */}
      <div className="bg-white rounded-3xl border border-saj-brown/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/20 text-saj-brown/60 text-[10px] font-bold uppercase tracking-widest border-b border-saj-brown/5 text-right">
                <th className="px-6 py-4 text-left">{language === 'ar' ? 'الوجبة' : 'Dish'}</th>
                <th className="px-6 py-4">{language === 'ar' ? 'التصنيف' : 'Category'}</th>
                <th className="px-6 py-4">{language === 'ar' ? 'السعر' : 'Price'}</th>
                <th className="px-6 py-4">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-4">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-saj-brown/5">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.tr
                    layout
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-saj-brown/1 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cream/50 rounded-xl flex-none overflow-hidden border border-saj-brown/5">
                          {/* Image Placeholder */}
                          <div className="w-full h-full bg-linear-to-br from-saj-brown/10 to-olive/10 flex items-center justify-center text-[10px] text-saj-brown/20 font-bold">
                            IMG
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-saj-brown truncate">
                            {language === 'ar' ? item.name_ar : item.name_en}
                          </p>
                          <p className="text-[10px] text-charcoal/40 truncate italic max-w-[200px]">
                             {language === 'ar' ? item.description_ar : item.description_en}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-olive bg-olive/5 px-3 py-1 rounded-full border border-olive/10">
                        {item.category_id.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-saj-brown font-english">
                        {formatPrice(item.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold transition-all",
                          item.is_available 
                            ? "bg-green-100 text-green-700 hover:bg-green-200" 
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        )}
                      >
                        {item.is_available ? <Eye size={12} /> : <EyeOff size={12} />}
                        {item.is_available 
                          ? (language === 'ar' ? 'متوفر' : 'In Stock') 
                          : (language === 'ar' ? 'نفذ' : 'Out of Stock')}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-2 text-charcoal/40 hover:text-saj-brown hover:bg-saj-brown/5 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="p-2 text-charcoal/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filteredItems.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-charcoal/40 text-sm font-arabic">لا توجد وجبات تطابق البحث</p>
          </div>
        )}
      </div>

      <MenuFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        onSave={handleSave}
        initialData={editingItem}
      />
    </div>
  );
}
