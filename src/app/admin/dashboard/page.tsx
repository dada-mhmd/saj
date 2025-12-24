'use client';

import { useMenuStore } from '@/store/useMenuStore';
import { cn } from '@/lib/utils';
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Eye,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { language, menuItems, isMenuOpen, setIsMenuOpen } = useMenuStore();
  const router = useRouter();

  const activeItemsCount = menuItems.filter(i => i.is_available).length;

  const stats = [
    { label: language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders', value: '1,280', icon: ShoppingBag, color: 'bg-saj-brown', trend: '+12%' },
    { label: language === 'ar' ? 'زوار اليوم' : 'Today\'s Visitors', value: '450', icon: Users, color: 'bg-olive', trend: '+5%' },
    { label: language === 'ar' ? 'الأصناف النشطة' : 'Active Items', value: activeItemsCount.toString(), icon: TrendingUp, color: 'bg-gold', trend: 'Live' },
    { label: language === 'ar' ? 'مشاهدات المنيو' : 'Menu Views', value: '3,120', icon: Eye, color: 'bg-charcoal', trend: '+18%' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn(
            "text-2xl font-bold text-saj-brown",
            language === 'ar' ? "font-arabic" : "font-english"
          )}>
            {language === 'ar' ? 'صباح الخير، المدير' : 'Good Morning, Admin'}
          </h1>
          <p className={cn(
            "text-sm text-charcoal/50",
            language === 'ar' ? "font-arabic" : "font-english"
          )}>
            {language === 'ar' ? 'إليك ما يحدث في مطعمك اليوم' : 'Here\'s what\'s happening in your restaurant today'}
          </p>
        </div>
        
        <button
          onClick={() => router.push('/admin/menu')}
          className="bg-saj-brown text-cream px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-saj-brown/20 hover:bg-saj-brown-light transition-all active:scale-95"
        >
          <Plus size={18} />
          <span className={language === 'ar' ? "font-arabic" : "font-english"}>
            {language === 'ar' ? 'إضافة صنف جديد' : 'Add New Item'}
          </span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-saj-brown/5 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-3 rounded-2xl text-white shadow-lg", stat.color)}>
                <stat.icon size={20} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-olive bg-olive/5 px-2 py-1 rounded-full uppercase tracking-wider">
                <ArrowUpRight size={12} />
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <p className={cn(
                "text-xs text-charcoal/40 font-bold uppercase tracking-[0.2em]",
                language === 'ar' ? "font-arabic" : "font-english"
              )}>
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-saj-brown">
                {stat.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions / Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-3xl border border-saj-brown/5 shadow-sm">
          <h2 className={cn(
            "text-lg font-bold text-saj-brown mb-6",
            language === 'ar' ? "font-arabic" : "font-english"
          )}>
            {language === 'ar' ? 'الأصناف الأكثر طلباً' : 'Most Popular Items'}
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-cream/20 rounded-2xl border border-saj-brown/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-saj-brown text-xs font-bold shadow-sm">
                    IMG
                  </div>
                  <div>
                    <p className="font-bold text-saj-brown">Saj Chicken</p>
                    <p className="text-[10px] text-olive uppercase tracking-widest font-bold">Category: Saj</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-saj-brown">450 Orders</p>
                  <p className="text-[10px] text-olive font-bold">+5%</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-8 rounded-3xl border border-saj-brown/5 shadow-sm">
          <h2 className={cn(
            "text-lg font-bold text-saj-brown mb-6",
            language === 'ar' ? "font-arabic" : "font-english"
          )}>
            {language === 'ar' ? 'حالة المنيو' : 'Menu Status'}
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <span className={cn(
                "text-sm font-bold text-charcoal/60",
                language === 'ar' ? "font-arabic" : "font-english"
              )}>
                {language === 'ar' ? 'ظهور المنيو للزبائن' : 'Menu Visible to Customers'}
              </span>
              <button
                onClick={async () => await setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  isMenuOpen ? "bg-olive" : "bg-gray-300"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                  isMenuOpen ? (language === 'ar' ? "left-1" : "right-1") : (language === 'ar' ? "right-1" : "left-1")
                )} />
              </button>
            </div>
            <div className="p-4 bg-saj-brown/5 rounded-2xl">
              <p className={cn(
                "text-xs text-saj-brown/60 italic",
                language === 'ar' ? "font-arabic" : "font-english"
              )}>
                {language === 'ar' 
                  ? 'ملاحظة: يمكنك إيقاف ظهور المنيو مؤقتاً في حال الصيانة أو خارج أوقات الدوام' 
                  : 'Note: You can temporarily hide the menu during maintenance or after hours.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
