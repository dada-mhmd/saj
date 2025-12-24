'use client';

import { useState, useRef } from 'react';
import { useMenuStore } from '@/store/useMenuStore';
import { cn } from '@/lib/utils';
import { 
  QrCode, 
  Download, 
  Printer, 
  Table, 
  Copy, 
  CheckCircle2, 
  Globe,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

export default function QRManagement() {
  const { language } = useMenuStore();
  const [tableNumber, setTableNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Use the production URL from env, or dynamic origin for local development
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                 (typeof window !== 'undefined' ? window.location.origin : 'https://saj-albaraka.vercel.app');
  
  // Clean trailing slash to avoid double slashes in the final link
  const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
  const menuUrl = tableNumber ? `${baseUrl}/?table=${tableNumber}` : baseUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 100;
      if (ctx) {
        ctx.fillStyle = '#FDFCF8'; // Cream background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        
        ctx.fillStyle = '#704214'; // Saj Brown
        ctx.font = 'bold 16px Cairo, Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          tableNumber 
            ? `${language === 'ar' ? 'طاولة رقم' : 'Table No.'} ${tableNumber}` 
            : (language === 'ar' ? 'امسح المنيو' : 'Scan for Menu'),
          canvas.width / 2,
          img.height + 50
        );

        ctx.font = '12px Cairo, Inter, sans-serif';
        ctx.fillText('Saj Al-Baraka', canvas.width / 2, img.height + 75);

        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `QR-Table-${tableNumber || 'Menu'}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className={cn(
          "text-2xl font-bold text-saj-brown",
          language === 'ar' ? "font-arabic" : "font-english"
        )}>
          {language === 'ar' ? 'إدارة رموز QR' : 'QR Code Management'}
        </h1>
        <p className={cn(
          "text-sm text-charcoal/50",
          language === 'ar' ? "font-arabic" : "font-english"
        )}>
          {language === 'ar' ? 'قم بتوليد رموز QR للطاولات أو للمنيو العام' : 'Generate QR codes for tables or general menu access'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Section */}
        <div className="space-y-6">
          <section className="bg-white p-8 rounded-3xl border border-saj-brown/5 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-saj-brown/5 text-saj-brown rounded-lg">
                <Table size={20} />
              </div>
              <h2 className={cn(
                "text-lg font-bold text-saj-brown",
                language === 'ar' ? "font-arabic" : "font-english"
              )}>
                {language === 'ar' ? 'إعدادات الطاولة' : 'Table Setup'}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className={cn(
                  "text-xs font-bold text-saj-brown/60 uppercase tracking-widest",
                  language === 'ar' ? "font-arabic" : "font-english"
                )}>
                  {language === 'ar' ? 'رقم الطاولة (اختياري)' : 'Table Number (Optional)'}
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: 5' : 'e.g. 5'}
                  className="w-full bg-cream/20 border border-saj-brown/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-saj-brown/20 transition-all font-english"
                />
              </div>

               <div className="space-y-2">
                <label className={cn(
                  "text-xs font-bold text-saj-brown/60 uppercase tracking-widest",
                  language === 'ar' ? "font-arabic" : "font-english"
                )}>
                  {language === 'ar' ? 'عنوان الرابط' : 'Target URL'}
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-cream/10 border border-saj-brown/5 rounded-xl py-3 px-4 text-[10px] text-charcoal/40 truncate flex items-center gap-2 font-english">
                    <Globe size={12} />
                    {menuUrl}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-3 bg-white border border-saj-brown/10 rounded-xl text-saj-brown hover:bg-saj-brown/5 transition-all relative"
                  >
                    {copied ? <CheckCircle2 size={18} className="text-olive" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-olive/5 border border-olive/10 p-6 rounded-3xl">
            <h3 className={cn(
              "text-sm font-bold text-olive mb-2",
              language === 'ar' ? "font-arabic" : "font-english"
            )}>
              {language === 'ar' ? 'نصيحة الطباعة' : 'Printing Tip'}
            </h3>
            <p className={cn(
              "text-xs text-olive/70 leading-relaxed",
              language === 'ar' ? "font-arabic" : "font-english"
            )}>
              {language === 'ar' 
                ? 'للحصول على أفضل النتائج، اطبع الكود بحجم 5x5 سم على الأقل وضعه في مكان واضح لكل طاولة.' 
                : 'For best results, print the code at least 5x5cm and place it in a clearly visible spot on each table.'}
            </p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div
            layout
            className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-saj-brown/5 border border-saj-brown/5 relative"
          >
            <div ref={qrRef} className="bg-white p-4 rounded-2xl border border-saj-brown/5">
              <QRCodeSVG
                value={menuUrl}
                size={200}
                level="H"
                includeMargin={false}
                // imageSettings={{
                //   src: "/next.svg", // Using next.svg as a placeholder logo for the center
                //   x: undefined,
                //   y: undefined,
                //   height: 40,
                //   width: 40,
                //   excavate: true,
                // }}
              />
            </div>
            
            <div className="text-center mt-6">
              <p className={cn(
                "text-lg font-bold text-saj-brown",
                language === 'ar' ? "font-arabic" : "font-english"
              )}>
                {tableNumber 
                  ? `${language === 'ar' ? 'طاولة رقم' : 'Table No.'} ${tableNumber}` 
                  : (language === 'ar' ? 'المنيو العام' : 'General Menu')}
              </p>
              <p className="text-[10px] text-olive uppercase tracking-widest font-bold mt-1">Saj Al-Baraka</p>
            </div>

            {/* Micro-animation dots for aesthetic */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gold rounded-full" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-olive rounded-full" />
          </motion.div>

          <div className="flex gap-4 w-full max-w-sm">
            <button
              onClick={handleDownload}
              className="flex-1 bg-saj-brown hover:bg-saj-brown-light text-cream font-bold py-4 rounded-2xl shadow-xl shadow-saj-brown/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Download size={20} />
              <span className={language === 'ar' ? "font-arabic" : "font-english"}>
                {language === 'ar' ? 'تحميل' : 'Download'}
              </span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-white border border-saj-brown/10 text-saj-brown font-bold py-4 rounded-2xl shadow-sm hover:bg-saj-brown/5 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Printer size={20} />
              <span className={language === 'ar' ? "font-arabic" : "font-english"}>
                {language === 'ar' ? 'طباعة' : 'Print'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
