'use client';

import { useEffect } from 'react';
import { useMenuStore } from '@/store/useMenuStore';

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = useMenuStore((state) => state.language);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return <>{children}</>;
}
