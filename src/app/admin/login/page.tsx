'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useMenuStore } from '@/store/useMenuStore';
import { cn } from '@/lib/utils';
import { Lock, Mail, Loader2, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { language } = useMenuStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl shadow-saj-brown/5 border border-saj-brown/5"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-saj-brown rounded-2xl flex items-center justify-center text-cream mb-4 shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
            <ChefHat size={32} />
          </div>
          <h1 className={cn(
            "text-2xl font-bold text-saj-brown",
            language === 'ar' ? "font-arabic" : "font-english"
          )}>
            {language === 'ar' ? 'لوحة التحكم' : 'Admin Terminal'}
          </h1>
          <p className={cn(
            "text-sm text-charcoal/50 mt-1",
            language === 'ar' ? "font-arabic" : "font-english"
          )}>
            {language === 'ar' ? 'سجل الدخول لإدارة مطعمك' : 'Sign in to manage your restaurant'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className={cn(
              "text-xs font-bold text-saj-brown/60 ml-1 uppercase tracking-widest",
              language === 'ar' ? "font-arabic" : "font-english"
            )}>
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-saj-brown/30" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@saj-albaraka.com"
                className="w-full bg-cream/30 border border-saj-brown/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-saj-brown/20 transition-all font-english"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={cn(
              "text-xs font-bold text-saj-brown/60 ml-1 uppercase tracking-widest",
              language === 'ar' ? "font-arabic" : "font-english"
            )}>
              {language === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-saj-brown/30" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cream/30 border border-saj-brown/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-saj-brown/20 transition-all font-english"
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 italic"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-saj-brown hover:bg-saj-brown-light text-cream font-bold py-4 rounded-xl shadow-lg shadow-saj-brown/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <span className={language === 'ar' ? "font-arabic" : "font-english"}>
                {language === 'ar' ? 'دخول' : 'Sign In'}
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-saj-brown/5 text-center">
          <p className={cn(
            "text-[10px] text-olive/40 font-medium uppercase tracking-[0.2em]",
            language === 'ar' ? "font-arabic" : "font-english"
          )}>
            Powered by Lebanese Saj QR Menu System
          </p>
        </div>
      </motion.div>
    </div>
  );
}
