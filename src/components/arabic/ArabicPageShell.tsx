import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, CheckCircle, Globe, Menu, X, Landmark, Compass, Calendar, Award, AlertCircle } from "lucide-react";
import { GOLD, IslamicPatternBackground, Star8Point, ProbasBanglaLogo } from "./ArabicDecor";
import { getGlobalConfig } from "../../utils/dynamicData";
import { useLanguage } from "../../context/LanguageContext";

interface ArabicPageShellProps {
  children: React.ReactNode;
}

export default function ArabicPageShell({ children }: ArabicPageShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [globalConfig, setGlobalConfig] = useState(getGlobalConfig());
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    setGlobalConfig(getGlobalConfig());
  }, []);

  const handleCall = () => {
    window.open(`tel:${globalConfig.hotlineRaw}`, "_self");
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${globalConfig.whatsapp}`, "_blank");
  };

  return (
    <div 
      className="min-h-screen text-slate-800 flex flex-col font-sans relative overflow-x-hidden selection:bg-[#C9A84C]/30 selection:text-[#C9A84C]"
      style={{
        background: "linear-gradient(to bottom, #FFFFFF 0%, #F1F5F9 100%)"
      }}
    >
      {/* Premium Background Travel Imagery Overlays - Plane, Dubai, Saudi, USA */}
      {/* 1. Airplane Top Right */}
      <div 
        className="absolute top-0 right-0 w-1/2 h-[600px] opacity-[0.05] pointer-events-none mix-blend-overlay bg-cover bg-center z-0" 
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800')`,
          maskImage: "radial-gradient(ellipse at center, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 75%)"
        }}
      />
      {/* 2. Dubai Skyline Top Left */}
      <div 
        className="absolute top-0 left-0 w-1/2 h-[600px] opacity-[0.04] pointer-events-none mix-blend-soft-light bg-cover bg-center z-0" 
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800')`,
          maskImage: "radial-gradient(ellipse at center, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 75%)"
        }}
      />
      {/* 3. Saudi Makkah Tower Middle Right */}
      <div 
        className="absolute top-[500px] right-0 w-1/2 h-[600px] opacity-[0.04] pointer-events-none mix-blend-overlay bg-cover bg-center z-0" 
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800')`,
          maskImage: "radial-gradient(ellipse at center, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 75%)"
        }}
      />
      {/* 4. USA NYC Skyline Middle Left */}
      <div 
        className="absolute top-[500px] left-0 w-1/2 h-[600px] opacity-[0.03] pointer-events-none mix-blend-soft-light bg-cover bg-center z-0" 
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&q=80&w=800')`,
          maskImage: "radial-gradient(ellipse at center, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 75%)"
        }}
      />

      {/* Background Islamic Pattern Grid */}
      <IslamicPatternBackground />

      {/* Dynamic Announcement Notice Banner */}
      {globalConfig.notice && (
        <div className="bg-[#9B1C1C]/90 text-white text-[11px] py-1.5 px-4 font-semibold border-b border-red-900/30 overflow-hidden relative z-50">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-300 flex-shrink-0 animate-pulse" />
            <div className="overflow-hidden relative w-full h-4">
              <div className="absolute whitespace-nowrap animate-marquee left-0">
                {globalConfig.notice}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner with Contact Details & Status Indicators */}
      <div className="bg-slate-100 border-b border-slate-200/80 text-xs py-2 px-4 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t("support247")}
            </span>
            <span className="text-[#C9A84C] font-semibold hidden md:inline">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-600">
              <Award className="w-3.5 h-3.5 text-[#C9A84C]" />
              {t("govApproved")}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <button 
              onClick={handleWhatsApp} 
              className="hover:text-[#C9A84C] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="text-sky-400 font-bold">{t("whatsapp")}:</span> {globalConfig.hotline}
            </button>
            <span className="text-[#C9A84C]/40">|</span>
            <button 
              onClick={handleCall} 
              className="hover:text-[#C9A84C] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Phone className="w-3 h-3 text-[#C9A84C]" /> {t("callUs")} ({globalConfig.hotline})
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex justify-between items-center">
          
          {/* Logo & Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <ProbasBanglaLogo className="w-12 h-12" />
            <div>
              <h1 className="font-heading font-bold text-base leading-none text-slate-900 tracking-wide flex items-center gap-1">
                প্রবাসবাংলা <span style={{ color: GOLD }}>এয়ার ট্রাভেলস</span>
              </h1>
              <p className="text-[10px] text-slate-600/80 uppercase tracking-widest mt-0.5">Probasbangla Air Travels</p>
            </div>
          </Link>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="text-slate-600 hover:text-[#C9A84C] transition-colors">{t("home")}</Link>
            <Link to="/flights" className="text-slate-600 hover:text-[#C9A84C] transition-colors">{t("flights")}</Link>
            <Link to="/visa" className="text-slate-600 hover:text-[#C9A84C] transition-colors">{t("visa")}</Link>
            <Link to="/hajj-umrah" className="text-slate-600 hover:text-[#C9A84C] transition-colors">{t("hajjUmrah")}</Link>
            <Link to="/bmet" className="text-slate-600 hover:text-[#C9A84C] transition-colors">{t("bmet")}</Link>
            <Link to="/status" className="text-slate-600 hover:text-[#C9A84C] transition-colors">{t("statusCheck")}</Link>
          </nav>

          {/* Language Toggle and Quick Action Button */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Bilingual Switcher Pill */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-0.5 relative z-50">
              <button 
                onClick={() => setLanguage("bn")}
                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all duration-300 cursor-pointer ${
                  language === "bn" 
                    ? "bg-[#C9A84C] text-[#FFFFFF] shadow" 
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                বাংলা
              </button>
              <button 
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all duration-300 cursor-pointer ${
                  language === "en" 
                    ? "bg-[#C9A84C] text-[#FFFFFF] shadow" 
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={handleWhatsApp}
              className="px-4 py-2 text-xs font-semibold rounded-full border border-[#C9A84C]/45 hover:bg-[#C9A84C]/10 text-[#C9A84C] transition-all duration-300 cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              {t("onlineBooking")}
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            
            {/* Language Switcher for Mobile Header */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-0.5">
              <button 
                onClick={() => setLanguage(language === "bn" ? "en" : "bn")}
                className="px-2.5 py-0.5 text-[9px] font-bold text-[#C9A84C] rounded-full transition-all cursor-pointer"
              >
                {language === "bn" ? "EN" : "বাং"}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="p-2 text-slate-600 hover:text-[#C9A84C] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white shadow-lg border-b border-slate-200 border-b border-[#C9A84C]/15 p-4 animate-fadeIn relative z-40">
            <div className="flex flex-col gap-3 text-sm">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-2.5 px-3 rounded-lg hover:bg-white/5 text-slate-600 hover:text-[#C9A84C] transition-all"
              >
                {t("home")}
              </Link>
              <Link 
                to="/flights" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-2.5 px-3 rounded-lg hover:bg-white/5 text-slate-600 hover:text-[#C9A84C] transition-all"
              >
                {t("flights")}
              </Link>
              <Link 
                to="/visa" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-2.5 px-3 rounded-lg hover:bg-white/5 text-slate-600 hover:text-[#C9A84C] transition-all"
              >
                {t("visa")}
              </Link>
              <Link 
                to="/hajj-umrah" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-2.5 px-3 rounded-lg hover:bg-white/5 text-slate-600 hover:text-[#C9A84C] transition-all"
              >
                {t("hajjUmrah")}
              </Link>
              <Link 
                to="/bmet" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-2.5 px-3 rounded-lg hover:bg-white/5 text-slate-600 hover:text-[#C9A84C] transition-all"
              >
                {t("bmet")}
              </Link>
              <Link 
                to="/status" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-2.5 px-3 rounded-lg hover:bg-white/5 text-slate-600 hover:text-[#C9A84C] transition-all"
              >
                {t("statusCheck")}
              </Link>
              
              {/* Mobile Language Switcher Segment */}
              <div className="py-2 px-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs text-slate-600">Language / ভাষা</span>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => { setLanguage("bn"); setMobileMenuOpen(false); }}
                    className={`px-3 py-1 text-xs rounded-full ${language === "bn" ? "bg-[#C9A84C] text-[#FFFFFF] font-bold" : "text-slate-600"}`}
                  >
                    বাংলা
                  </button>
                  <button 
                    onClick={() => { setLanguage("en"); setMobileMenuOpen(false); }}
                    className={`px-3 py-1 text-xs rounded-full ${language === "en" ? "bg-[#C9A84C] text-[#FFFFFF] font-bold" : "text-slate-600"}`}
                  >
                    English
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleWhatsApp();
                  }}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs rounded-lg text-center cursor-pointer"
                >
                  {t("whatsapp")}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleCall();
                  }}
                  className="w-full py-2 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-lg text-center cursor-pointer"
                >
                  {t("callUs")}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative z-10">
        {children}
      </main>

      {/* Decorative Golden Fringe Divider */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent w-full" />

      {/* Footer Component */}
      <footer className="bg-slate-50 text-slate-600 border-t border-slate-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            
            {/* Branding & Mission */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <ProbasBanglaLogo className="w-9 h-9" />
                <span className="font-heading font-bold text-lg text-slate-900">
                  প্রবাসবাংলা <span style={{ color: GOLD }}>এয়ার ট্রাভেলস</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === "bn" 
                  ? "প্রবাসী ভাই ও বোনদের আস্থার প্রতীক। আমরা অত্যন্ত দক্ষতা ও বিশ্বস্ততার সাথে এয়ার টিকিট, ভিসা প্রসেসিং, হজ্জ-ওমরাহ এবং অন্যান্য অনলাইন সেবা প্রদান করছি।" 
                  : "Symbol of trust for Bangladeshi expatriates worldwide. We provide professional and reliable Air Ticket, Visa Processing, Hajj-Umrah and multiple other online services."
                }
              </p>
            </div>

            {/* Quick Links to Core Services */}
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-200/80 shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" /> {t("ourServices")}
              </h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link to="/flights" className="hover:text-[#C9A84C] transition-colors block">✈️ {language === "bn" ? "অভ্যন্তরীণ ও আন্তর্জাতিক টিকিট" : "Domestic & International Tickets"}</Link>
                </li>
                <li>
                  <Link to="/visa" className="hover:text-[#C9A84C] transition-colors block">🛂 {language === "bn" ? "সৌদি আরব ও মিডল ইস্ট ভিসা প্রসেসিং" : "Saudi & Middle East Visa Processing"}</Link>
                </li>
                <li>
                  <Link to="/hajj-umrah" className="hover:text-[#C9A84C] transition-colors block">🕌 {language === "bn" ? "প্রিমিয়াম ওমরাহ ও হজ্জ প্যাকেজ" : "Premium Umrah & Hajj Packages"}</Link>
                </li>
                <li>
                  <Link to="/bmet" className="hover:text-[#C9A84C] transition-colors block">📋 {language === "bn" ? "BMET স্মার্টকার্ড ও ফি পেমেন্ট" : "BMET Smartcard & Fee Payments"}</Link>
                </li>
                <li>
                  <Link to="/bmet" className="hover:text-[#C9A84C] transition-colors block">🆔 {language === "bn" ? "জন্ম নিবন্ধন ও NID সংশোধন" : "Birth Certificate & NID Correction"}</Link>
                </li>
              </ul>
            </div>

            {/* Legal / Policy Links */}
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-200/80 shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" /> {t("policies")}
              </h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link to="/policy/about-us" className="hover:text-[#C9A84C] transition-colors block">📖 {t("aboutUs")}</Link>
                </li>
                <li>
                  <Link to="/policy/terms" className="hover:text-[#C9A84C] transition-colors block">📝 {t("terms")}</Link>
                </li>
                <li>
                  <Link to="/policy/privacy" className="hover:text-[#C9A84C] transition-colors block">🔒 {t("privacy")}</Link>
                </li>
                <li>
                  <Link to="/policy/refund" className="hover:text-[#C9A84C] transition-colors block">🔄 {t("refund")}</Link>
                </li>
                <li>
                  <Link to="/policy/emi" className="hover:text-[#C9A84C] transition-colors block">💳 {t("emi")}</Link>
                </li>
                <li>
                  <Link to="/policy/talent-culture" className="hover:text-[#C9A84C] transition-colors block">👥 {t("careers")}</Link>
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-200/80 shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" /> {t("headOffice")}
              </h3>
              <ul className="space-y-3 text-xs">
                <li className="flex items-center gap-2">
                  <span className="text-[#C9A84C]">📞</span>
                  <button onClick={handleCall} className="hover:text-[#C9A84C] transition-colors font-mono cursor-pointer">{globalConfig.hotline}</button>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#C9A84C]">💬</span>
                  <button onClick={handleWhatsApp} className="hover:text-[#C9A84C] transition-colors font-mono cursor-pointer">{globalConfig.hotline} ({t("whatsapp")})</button>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
            <p className="text-xs text-slate-600 font-medium">
              {t("copyright")}
            </p>
            <div className="flex gap-3 text-[10px] text-slate-600">
              <Link to="/admin" className="hover:text-[#C9A84C] transition-colors flex items-center gap-1">
                ⚙️ {t("adminPortal")}
              </Link>
              <span>•</span>
              <span>{t("devBy")}</span>
              <span>•</span>
              <span>{t("version")}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
