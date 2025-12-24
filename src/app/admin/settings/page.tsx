'use client';

import { useState, useEffect } from 'react';
import { useMenuStore } from '@/store/useMenuStore';
import { cn } from '@/lib/utils';
import { 
  Phone, 
  Eye, 
  EyeOff, 
  Save, 
  Globe,
  Store,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSettings() {
  const { 
    language, 
    whatsappNumber, 
    setWhatsappNumber, 
    isMenuOpen, 
    setIsMenuOpen,
    setLanguage,
    fetchSettings
  } = useMenuStore();

  const [localWhatsapp, setLocalWhatsapp] = useState(whatsappNumber);
  const [localIsMenuOpen, setLocalIsMenuOpen] = useState(isMenuOpen);
  const [saving, setSaving] = useState(false);

  // Initial sync from DB
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Sync local state if store changes externally (e.g., after fetchSettings)
  useEffect(() => {
    setLocalWhatsapp(whatsappNumber);
    setLocalIsMenuOpen(isMenuOpen);
  }, [whatsappNumber, isMenuOpen]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setWhatsappNumber(localWhatsapp);
      await setIsMenuOpen(localIsMenuOpen);
      alert(language === 'ar' ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully');
    } catch (error) {
      console.error('Save failed:', error);
      alert(language === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className={cn(
          "text-2xl font-bold text-saj-brown",
          language === 'ar' ? "font-arabic" : "font-english"
        )}>
          {language === 'ar' ? 'إعدادات المتجر' : 'Store Settings'}
        </h1>
        <p className={cn(
          "text-sm text-charcoal/50",
          language === 'ar' ? "font-arabic" : "font-english"
        )}>
          {language === 'ar' ? 'إدارة معلومات التواصل وحالة المنيو' : 'Manage contact info and menu visibility'}
        </p>
      </div>

      <div className="space-y-6">
        {/* WhatsApp Configuration */}
        <section className="bg-white p-8 rounded-3xl border border-saj-brown/5 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <MessageSquare size={20} />
            </div>
            <h2 className={cn(
              "text-lg font-bold text-saj-brown",
              language === 'ar' ? "font-arabic" : "font-english"
            )}>
              {language === 'ar' ? 'إعدادات واتساب' : 'WhatsApp Integration'}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className={cn(
                "text-xs font-bold text-saj-brown/60 uppercase tracking-widest",
                language === 'ar' ? "font-arabic" : "font-english"
              )}>
                {language === 'ar' ? 'رقم الهاتف للطلبات' : 'Order WhatsApp Number'}
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-saj-brown/30" />
                <input
                  type="text"
                  value={localWhatsapp}
                  onChange={(e) => setLocalWhatsapp(e.target.value)}
                  placeholder="961XXXXXXXXX"
                  className="w-full bg-cream/20 border border-saj-brown/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-saj-brown/20 transition-all font-english"
                />
              </div>
              <p className="text-[10px] text-charcoal/40 italic">
                {language === 'ar' 
                  ? 'يرجى إدخال الرقم مع رمز الدولة (مثال: 96170123456)' 
                  : 'Enter number with country code (e.g., 96170123456)'}
              </p>
            </div>
          </div>
        </section>

        {/* Menu Visibility */}
        <section className="bg-white p-8 rounded-3xl border border-saj-brown/5 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-charcoal/5 text-charcoal rounded-lg">
              <Store size={20} />
            </div>
            <h2 className={cn(
              "text-lg font-bold text-saj-brown",
              language === 'ar' ? "font-arabic" : "font-english"
            )}>
              {language === 'ar' ? 'حالة المنيو' : 'Menu Availability'}
            </h2>
          </div>

          <div className="flex items-center justify-between p-4 bg-cream/20 rounded-2xl border border-saj-brown/5">
            <div className="flex items-center gap-3">
              {localIsMenuOpen ? <Eye size={18} className="text-olive" /> : <EyeOff size={18} className="text-red-500" />}
              <span className={cn(
                "text-sm font-bold",
                localIsMenuOpen ? "text-olive" : "text-red-500"
              )}>
                {localIsMenuOpen 
                  ? (language === 'ar' ? 'المنيو منشور للعامة' : 'Menu is Public') 
                  : (language === 'ar' ? 'المنيو مخفي حالياً' : 'Menu is Hidden')}
              </span>
            </div>
            
            <button
              onClick={() => setLocalIsMenuOpen(!localIsMenuOpen)}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                localIsMenuOpen ? "bg-olive" : "bg-gray-300"
              )}
            >
              <motion.div
                animate={{ x: localIsMenuOpen ? 24 : 4 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
        </section>

        {/* Localization */}
        <section className="bg-white p-8 rounded-3xl border border-saj-brown/5 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold/10 text-gold rounded-lg">
              <Globe size={20} />
            </div>
            <h2 className={cn(
              "text-lg font-bold text-saj-brown",
              language === 'ar' ? "font-arabic" : "font-english"
            )}>
              {language === 'ar' ? 'اللغة الافتراضية' : 'Default Language'}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {['ar', 'en'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang as any)}
                className={cn(
                  "p-4 rounded-2xl border transition-all text-sm font-bold flex flex-col items-center gap-2",
                  language === lang
                    ? "bg-saj-brown text-cream border-saj-brown shadow-lg shadow-saj-brown/20"
                    : "bg-white text-saj-brown border-saj-brown/10 hover:border-saj-brown/30"
                )}
              >
                <span className="text-xs opacity-60 uppercase">{lang}</span>
                <span>{lang === 'ar' ? 'العربية' : 'English'}</span>
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-saj-brown hover:bg-saj-brown-light text-cream font-bold py-4 rounded-2xl shadow-xl shadow-saj-brown/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Save size={20} /></motion.div> : <Save size={20} />}
          <span className={language === 'ar' ? "font-arabic" : "font-english"}>
            {language === 'ar' ? 'حفظ التغييرات' : 'Save All Changes'}
          </span>
        </button>
      </div>
    </div>
  );
}
