import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { GOLD, Star8Point, CornerOrnaments } from "./arabic/ArabicDecor";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  backTo?: string;
}

export default function PageHeader({ title, subtitle, icon: Icon, backTo = "/" }: PageHeaderProps) {
  return (
    <div className="relative border-b border-slate-200 py-8 md:py-12 mb-8 overflow-hidden bg-gradient-to-b from-slate-100 to-white shadow-sm">
      
      {/* Decorative Golden Arch / Dome Overlay in background */}
      <div className="absolute inset-0 flex justify-center items-center opacity-[0.08] pointer-events-none">
        <svg width="400" height="200" viewBox="0 0 400 200" fill="none" stroke={GOLD} strokeWidth="1.5">
          <path d="M 0 200 Q 100 100 200 0 Q 300 100 400 200" />
          <path d="M 50 200 Q 125 125 200 50 Q 275 125 350 200" />
          <path d="M 100 200 Q 150 150 200 100 Q 250 150 300 200" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center relative z-10">
        
        {/* Back Button */}
        {backTo && (
          <Link 
            to={backTo} 
            className="absolute top-0 left-4 p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center shadow-sm"
            title="পেছনে যান"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        )}

        {/* Floating 8-point star with Icon inside */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="absolute animate-spin-slow opacity-35">
            <Star8Point className="w-16 h-16" color={GOLD} />
          </div>
          <div className="relative w-12 h-12 rounded-xl bg-white border border-[#C9A84C]/40 flex items-center justify-center shadow-lg shadow-slate-100 text-[#C9A84C]">
            {Icon ? <Icon className="w-6 h-6 animate-pulse" /> : <Star8Point className="w-6 h-6" />}
          </div>
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-900 tracking-wide mb-1 flex items-center gap-2">
          {title}
        </h2>
        
        {subtitle && (
          <p className="text-xs font-mono uppercase tracking-[0.15em] text-[#C9A84C] opacity-90 font-bold">
            {subtitle}
          </p>
        )}

        {/* Decorative Divider */}
        <div className="flex items-center gap-2 mt-4">
          <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C9A84C]/40" />
          <span className="w-1.5 h-1.5 rounded-full rotate-45 border border-[#C9A84C] bg-[#C9A84C]/30" />
          <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#C9A84C]/40" />
        </div>

      </div>
    </div>
  );
}
