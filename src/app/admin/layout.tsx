'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { useMenuStore } from '@/store/useMenuStore';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Settings, 
  LogOut, 
  ChevronRight,
  PlusCircle,
  Package,
  QrCode
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useMenuStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-saj-brown border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (pathname === '/admin/login') return <>{children}</>;

  const menuItems = [
    { name: language === 'ar' ? 'نظرة عامة' : 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: language === 'ar' ? 'إدارة المنيو' : 'Menu Management', icon: UtensilsCrossed, path: '/admin/menu' },
    { name: language === 'ar' ? 'الأصناف' : 'Categories', icon: Package, path: '/admin/categories' },
    { name: language === 'ar' ? 'رموز QR' : 'QR Codes', icon: QrCode, path: '/admin/qr' },
    { name: language === 'ar' ? 'الإعدادات' : 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 bg-white border-e border-saj-brown/5 flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-saj-brown rounded-xl flex items-center justify-center text-cream font-bold text-xl">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-saj-brown">Saj Al-Baraka</span>
            <span className="text-[10px] text-olive uppercase tracking-widest font-bold">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                pathname === item.path
                  ? "bg-saj-brown text-cream shadow-lg shadow-saj-brown/20"
                  : "text-charcoal/60 hover:bg-saj-brown/5 hover:text-saj-brown"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className={cn(
                  "font-bold text-sm",
                  language === 'ar' ? "font-arabic" : "font-english"
                )}>
                  {item.name}
                </span>
              </div>
              <ChevronRight size={16} className={cn(
                "opacity-0 transition-opacity",
                pathname === item.path && "opacity-100",
                language === 'ar' && "rotate-180"
              )} />
            </button>
          ))}
        </nav>

        <button
          onClick={handleSignOut}
          className="mt-auto flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-sm"
        >
          <LogOut size={20} />
          <span className={language === 'ar' ? "font-arabic" : "font-english"}>
            {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
          </span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-saj-brown/5 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-saj-brown rounded-lg flex items-center justify-center text-cream font-bold text-lg">
              S
            </div>
            <span className="font-bold text-saj-brown text-sm">Admin</span>
          </div>
          <button className="p-2 bg-saj-brown/5 rounded-lg">
            <UtensilsCrossed size={20} className="text-saj-brown" />
          </button>
        </header>

        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
