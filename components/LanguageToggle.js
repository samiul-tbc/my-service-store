'use client';
import { useLanguage } from '../context/LanguageContext';
import LiquidSeg from './LiquidSeg';

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();
  return (
    <LiquidSeg
      options={[{ value: 'bn', label: 'BN' }, { value: 'en', label: 'EN' }]}
      value={lang}
      onChange={(v) => toggleLanguage(v)}
      height={30}
      fontSize={11}
    />
  );
}
