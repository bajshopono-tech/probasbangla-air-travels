import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import PageHeader from "./PageHeader";
import ArabicPageShell from "./arabic/ArabicPageShell";
import { 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ClipboardList, 
  ArrowRight, 
  ShieldAlert, 
  MapPin, 
  PhoneCall, 
  Ticket,
  FileText,
  Download,
  ExternalLink,
  RefreshCw,
  User,
  Phone
} from "lucide-react";
import { GOLD, CornerOrnaments } from "./arabic/ArabicDecor";

// Pre-seeded default records to demonstrate the tracker
const PRESEEDED_RECORDS = [
  {
    pnr: "PBT-SV409-26",
    type: "এয়ার টিকিট",
    service: "DAC ✈️ JED (Saudi Arabian Airlines)",
    flightId: "SV-805",
    passenger: "MD ABUL KASEM",
    passport: "B09182392",
    phone: "01712345678",
    price: "৳ ৫৩,৮০০",
    status: "কনফার্মড (টিকিট ইস্যু সম্পন্ন)",
    baggage: "৪৬ কেজি (২ টি ব্যাগ)",
    date: "2026-07-20",
    time: "02:15 AM",
    bookingDate: "০২/০৭/২০২৬",
    timelineStep: 4, // 1: Submitted, 2: Verified, 3: Processing, 4: Complete
    updates: [
      { date: "০৪/০৭/২০২৬", time: "১০:৩০ AM", msg: "ই-টিকিট গ্রাহকের ইমেইল ও হোয়াটসঅ্যাপে পাঠানো হয়েছে।" },
      { date: "০৩/০৭/২০২৬", time: "০৪:১৫ PM", msg: "পেমেন্ট সফলভাবে বিকাশ মার্চেন্ট অ্যাকাউন্টে প্রাপ্ত হয়েছে।" },
      { date: "০২/০৭/২০২৬", time: "১১:০০ AM", msg: "যাত্রী বিবরণী ও পাসপোর্ট কপি সিস্টেমে রেজিস্টার করা হয়েছে।" }
    ]
  },
  {
    pnr: "PBT-VISA-9921",
    type: "ভিসা প্রসেসিং",
    service: "🇸🇦 সৌদি আরব - ফ্যামিলি ভিজিট ভিসা স্ট্যাম্পিং",
    passenger: "Mst Rahima Begum",
    passport: "A02948123",
    phone: "01987654321",
    price: "৳ ২৯,০০০",
    status: "ভিসা স্ট্যাম্পিং শেষ (ডকুমেন্টস রেডি)",
    date: "ডেলিভারি প্রস্তুত",
    time: "N/A",
    bookingDate: "২৮/০৬/২০২৬",
    timelineStep: 4,
    updates: [
      { date: "০৩/০৭/২০২৬", time: "০২:০০ PM", msg: "দূতাবাস থেকে পাসপোর্ট সফলভাবে স্ট্যাম্পড অবস্থায় মতিঝিল অফিসে পৌঁছেছে।" },
      { date: "৩০/০৬/২০২৬", time: "০৯:০০ AM", msg: "সৌদি দূতাবাস উইজার্ডে ফাইল স্ট্যাম্পিং এর জন্য জমা দেওয়া হয়েছে।" },
      { date: "২৮/০৬/২০২৬", time: "০৫:৩০ PM", msg: "আবেদনকারীর প্রয়োজনীয় কাগজপত্র ও রিলেশন সার্টিফিকেট স্ক্যান সফল।" }
    ]
  },
  {
    pnr: "PBT-GOV-2210",
    type: "BMET ও অন্যান্য",
    service: "📋 BMET রেজিস্ট্রেশন ও স্মার্টকার্ড ডাউনলোড",
    passenger: "KAMRUL HASAN",
    passport: "A10294811",
    phone: "01311223344",
    price: "৳ ৩,৫০০",
    status: "আবেদন জমা হয়েছে (ডকুমেন্টস রিভিউ পেন্ডিং)",
    date: "৩ কর্মদিবসের মধ্যে সমাধান",
    time: "N/A",
    bookingDate: "০৪/০৭/২০২৬",
    timelineStep: 2,
    updates: [
      { date: "০৪/০৭/২০২৬", time: "০৬:৪৫ PM", msg: "প্রবাসী কল্যাণ ব্যাংক সার্ভারে ম্যানুয়াল স্ক্রিনিং চলছে।" },
      { date: "০৪/০৭/২০২৬", time: "০৩:০০ PM", msg: "স্মার্টকার্ড আবেদনের প্রয়োজনীয় ওরিয়েন্টেশন ট্রেনিং তথ্য আপলোড সম্পন্ন।" }
    ]
  }
];

export default function StatusCheck() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryCode, setQueryCode] = useState(searchParams.get("pnr") || searchParams.get("id") || "");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [err, setErr] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper to normalize Bengali digits to English
  const cleanPhone = (phoneStr: string) => {
    if (!phoneStr) return "";
    const bToE: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    let clean = phoneStr.replace(/[০-৯]/g, d => bToE[d] || d);
    clean = clean.replace(/\D/g, "");
    // Normalize country prefix to extract root mobile number
    if (clean.startsWith("880")) clean = clean.substring(3);
    else if (clean.startsWith("88")) clean = clean.substring(2);
    if (clean.startsWith("0")) clean = clean.substring(1);
    return clean;
  };

  // Dynamically load all active records
  const getAllRecords = () => {
    const localBookings = JSON.parse(localStorage.getItem("probas_bookings") || "[]");
    const localEnquiries = JSON.parse(localStorage.getItem("probas_enquiries") || "[]");
    return [
      ...localBookings,
      ...localEnquiries.map((enq: any) => ({
        ...enq,
        pnr: enq.id || `PBT-ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
        type: "ইনকোয়ারি",
        service: `📞 কাস্টমার কল-ব্যাক: ${enq.service === 'ticket' ? 'এয়ার টিকিট' : enq.service === 'umrah' ? 'ওমরাহ হজ্জ' : 'ভিসা প্রসেস'}`,
        passenger: enq.name,
        price: "N/A",
        timelineStep: enq.status === 'নতুন আবেদন' ? 1 : 2,
        updates: [{ date: enq.date, time: "তাৎক্ষণিক", msg: "আবেদনটি কল-ব্যাক কিউতে জমা করা হয়েছে।" }]
      })),
      ...PRESEEDED_RECORDS
    ];
  };

  // Dynamic Suggestion autocomplete items
  const suggestions = useMemo(() => {
    const trimmed = queryCode.trim();
    if (trimmed.length < 2) return [];

    const code = trimmed.toUpperCase();
    const cleanQuery = cleanPhone(trimmed);
    const allRecords = getAllRecords();

    return allRecords.filter(rec => {
      const pnrMatch = rec.pnr && rec.pnr.toUpperCase().includes(code);
      const passportMatch = rec.passport && rec.passport.toUpperCase().includes(code);
      const nameMatch = rec.passenger && rec.passenger.toUpperCase().includes(code);
      
      const recCleanPhone = cleanPhone(rec.phone || "");
      const phoneMatch = cleanQuery && recCleanPhone.includes(cleanQuery);

      return pnrMatch || passportMatch || nameMatch || phoneMatch;
    }).slice(0, 5);
  }, [queryCode]);

  // Handle outside click to hide suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Trigger search on mount or url parameter changes
  useEffect(() => {
    const pnrParam = searchParams.get("pnr") || searchParams.get("id");
    if (pnrParam) {
      setQueryCode(pnrParam);
      handleSearch(null, pnrParam);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent | null, forcedQuery?: string) => {
    if (e) e.preventDefault();
    setSearched(true);
    setErr("");
    setShowSuggestions(false);

    const targetQuery = (forcedQuery !== undefined ? forcedQuery : queryCode).trim();
    if (!targetQuery) {
      setSearchResults([]);
      return;
    }

    const code = targetQuery.toUpperCase();
    const cleanQuery = cleanPhone(targetQuery);
    const allRecords = getAllRecords();

    // Try finding an exact match
    const exactMatches = allRecords.filter(rec => {
      const pnrMatch = rec.pnr && rec.pnr.trim().toUpperCase() === code;
      const passportMatch = rec.passport && rec.passport.trim().toUpperCase() === code;
      
      const recCleanPhone = cleanPhone(rec.phone || "");
      const phoneMatch = cleanQuery && recCleanPhone === cleanQuery;

      return pnrMatch || passportMatch || phoneMatch;
    });

    if (exactMatches.length > 0) {
      setSearchResults(exactMatches);
    } else {
      // Friendly fallback: Try partial matching if exact matches fail
      const partialMatches = allRecords.filter(rec => {
        const pnrMatch = rec.pnr && rec.pnr.toUpperCase().includes(code);
        const passportMatch = rec.passport && rec.passport.toUpperCase().includes(code);
        const nameMatch = rec.passenger && rec.passenger.toUpperCase().includes(code);
        
        const recCleanPhone = cleanPhone(rec.phone || "");
        const phoneMatch = cleanQuery && recCleanPhone.includes(cleanQuery);

        return pnrMatch || passportMatch || nameMatch || phoneMatch;
      });

      if (partialMatches.length > 0) {
        setSearchResults(partialMatches);
      } else {
        setSearchResults([]);
        setErr("দুঃখিত! এই ট্র্যাকিং আইডি, পাসপোর্ট বা মোবাইল নম্বরের বিপরীতে কোনো বুকিং পাওয়া যায়নি। অনুগ্রহ করে সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।");
      }
    }
  };

  const selectSuggestion = (rec: any) => {
    setQueryCode(rec.pnr);
    setSearchResults([rec]);
    setSearched(true);
    setErr("");
    setShowSuggestions(false);
  };

  return (
    <ArabicPageShell>
      <PageHeader title="স্ট্যাটাস ট্র্যাকার" subtitle="Booking & Application Tracking" icon={ClipboardList} backTo="/" />

      <div className="max-w-4xl mx-auto px-4 pb-12 space-y-8">
        
        {/* Live Admin Tester Notification Panel */}
        <div className="bg-gradient-to-r from-amber-500/10 via-[#C9A84C]/5 to-emerald-500/10 border border-[#C9A84C]/25 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] shrink-0 animate-pulse">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-800">রিয়েল-টাইম ডাইনামিক লাইভ আপডেট টেস্ট করুন!</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                আরেকটি ট্যাবে <Link to="/admin" target="_blank" className="text-[#C9A84C] font-bold hover:underline inline-flex items-center gap-0.5">অ্যাডমিন প্যানেলে (পাসকোড: admin)<ExternalLink className="w-3 h-3" /></Link> গিয়ে যেকোনো বুকিংয়ের বর্তমান অবস্থা আপডেট করুন, এবং তা এখানে সাথে সাথে লাইভ দেখুন।
              </p>
            </div>
          </div>
          <Link 
            to="/admin" 
            target="_blank"
            className="px-4 py-2 bg-[#C9A84C] hover:bg-[#B3933E] text-white text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
          >
            অ্যাডমিন প্যানেল খুলুন
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Search Console */}
        <div ref={dropdownRef} className="bg-white border border-slate-200 shadow-lg rounded-2xl p-5 md:p-6 relative">
          <CornerOrnaments />
          <h3 className="font-heading font-bold text-slate-800 text-sm mb-3">বুকিং, ভিসা বা পাসপোর্ট স্ট্যাটাস অনুসন্ধান করুন</h3>
          
          <form onSubmit={(e) => handleSearch(e)} className="flex flex-col sm:flex-row gap-3 relative z-30">
            <div className="relative flex-grow">
              <input 
                type="text" 
                value={queryCode}
                onChange={(e) => {
                  setQueryCode(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="PNR, পাসপোর্ট নম্বর বা মোবাইল নম্বর লিখুন..."
                className="w-full bg-slate-50 border border-slate-200 hover:border-[#C9A84C]/40 rounded-xl pl-10 pr-4 py-3 text-xs md:text-sm text-slate-800 font-semibold placeholder-slate-500 focus:outline-none focus:border-[#C9A84C] font-mono"
              />
              <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />

              {/* Suggestions Dropdown panel */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-40 animate-fadeIn">
                  <div className="p-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    মিল পাওয়া গেছে ({suggestions.length})
                  </div>
                  <div className="divide-y divide-slate-100">
                    {suggestions.map((rec) => (
                      <div 
                        key={rec.pnr}
                        onClick={() => selectSuggestion(rec)}
                        className="p-3 hover:bg-[#C9A84C]/10 cursor-pointer transition-colors flex items-center justify-between text-left"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs text-slate-800 font-mono">{rec.pnr}</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/10 text-amber-700 font-bold rounded">
                              {rec.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{rec.passenger}</span>
                            {rec.phone && (
                              <>
                                <span className="text-slate-300">|</span>
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span className="font-mono">{rec.phone}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-emerald-600 block">
                            {rec.status}
                          </span>
                          <span className="text-[9px] text-slate-500 block">
                            {rec.bookingDate || "তারিখ নাই"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="px-6 py-3 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs md:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-[#C9A84C]/15"
            >
              অনুসন্ধান করুন
            </button>
          </form>

          {/* Quick seeded hints */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-600 font-medium">সহজে টেস্ট করার ডেমো আইডি সমূহ:</span>
            {PRESEEDED_RECORDS.map((rec) => (
              <button
                key={rec.pnr}
                onClick={() => {
                  setQueryCode(rec.pnr);
                  setSearchResults([rec]);
                  setSearched(true);
                  setErr("");
                  setShowSuggestions(false);
                }}
                className="px-2.5 py-1 bg-slate-50 hover:bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C] font-mono text-[10px] font-bold rounded-md transition-colors cursor-pointer"
              >
                {rec.pnr}
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {err && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-fadeIn max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-semibold">{err}</span>
          </div>
        )}

        {/* Search Results Display */}
        {searched && searchResults.length > 0 && (
          <div className="space-y-8 animate-fadeIn">
            {searchResults.map((rec, index) => {
              const step = rec.timelineStep || 1;
              return (
                <div 
                  key={index} 
                  className="bg-white border border-[#C9A84C]/25 rounded-3xl overflow-hidden shadow-xl relative"
                >
                  <CornerOrnaments />

                  {/* Header metadata bar */}
                  <div className="bg-[#FFFFFF] border-b border-[#C9A84C]/15 py-3.5 px-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-wider block leading-none mb-1">{rec.type}</span>
                      <h4 className="font-extrabold text-sm text-slate-800">{rec.service}</h4>
                    </div>
                    <div className="text-left sm:text-right font-mono text-xs">
                      <span className="text-slate-500 font-medium">ট্র্যাকিং ID: </span>
                      <span className="font-bold text-[#C9A84C]">{rec.pnr}</span>
                    </div>
                  </div>

                  <div className="p-5 md:p-6 space-y-8">
                    
                    {/* Primary Info Sheet */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-slate-500 block mb-0.5 font-medium">যাত্রী / আবেদনকারী:</span>
                        <span className="font-bold text-slate-800 block">{rec.passenger}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5 font-medium">পাসপোর্ট নম্বর:</span>
                        <span className="font-bold text-slate-800 font-mono block uppercase">{rec.passport}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5 font-medium">নিবন্ধন তারিখ:</span>
                        <span className="font-bold text-slate-800 block">{rec.bookingDate || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5 font-medium">সার্ভিস ফি:</span>
                        <span className="font-bold text-emerald-600 font-mono block">{rec.price}</span>
                      </div>
                    </div>

                    {/* Timeline Tracker visualization */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-wider block">প্রসেসিং অগ্রগতি (Live Timeline)</span>
                      
                      <div className="relative pt-4 pb-2">
                        {/* Connecting Line */}
                        <div className="absolute top-7 left-3.5 right-3.5 h-1 bg-slate-100 rounded pointer-events-none" />
                        <div 
                          className="absolute top-7 left-3.5 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded pointer-events-none transition-all duration-1000" 
                          style={{ width: `${((step - 1) / 3) * 100}%` }}
                        />

                        {/* Milestones */}
                        <div className="relative flex justify-between items-center text-center">
                          {[
                            { title: "আবেদন প্রাপ্ত", label: "Submitted" },
                            { title: "নথি যাচাই", label: "Verified" },
                            { title: "দূতাবাস / এয়ারলাইন", label: "Processing" },
                            { title: "ইস্যু সম্পন্ন", label: "Issued" }
                          ].map((milestone, idx) => {
                            const stepIdx = idx + 1;
                            const isPast = stepIdx < step;
                            const isCurrent = stepIdx === step;
                            const isFuture = stepIdx > step;
                            
                            return (
                              <div key={idx} className="flex flex-col items-center relative z-10 flex-1">
                                <div 
                                  className={`w-7 h-7 rounded-full flex items-center justify-center border font-bold text-xs transition-all duration-500 ${
                                    isPast 
                                      ? "bg-emerald-600 border-emerald-500 text-white" 
                                      : isCurrent 
                                        ? "bg-[#C9A84C] border-[#C9A84C] text-[#FFFFFF] scale-110 shadow-lg shadow-[#C9A84C]/20" 
                                        : "bg-white border-slate-200 text-slate-400"
                                  }`}
                                >
                                  {isPast ? "✓" : stepIdx}
                                </div>
                                <span className={`text-[10px] md:text-xs font-bold mt-2.5 block ${isFuture ? "text-slate-400" : "text-slate-800"}`}>
                                  {milestone.title}
                                </span>
                                <span className="text-[8px] md:text-[9px] text-slate-500 font-mono tracking-wider block">
                                  {milestone.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* PDF Download Section (Only visible if completed and PDF was uploaded) */}
                    {rec.timelineStep === 4 && rec.pdfData && (
                      <div className="p-4 bg-emerald-50 border border-emerald-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                        <div className="flex items-center gap-3 text-center sm:text-left">
                          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md shrink-0">
                            <FileText className="w-6 h-6 text-[#C9A84C]" />
                          </div>
                          <div>
                            <h5 className="font-extrabold text-slate-900 text-sm">আপনার ই-টিকিট / ভিসা ডকুমেন্ট প্রস্তুত!</h5>
                            <p className="text-xs text-slate-500 font-medium">নিচে ক্লিক করে আপনার মূল PDF ফাইলটি ডাউনলোড করুন।</p>
                          </div>
                        </div>
                        <a
                          href={rec.pdfData}
                          download={rec.pdfName || `probasbangla_document_${rec.pnr}.pdf`}
                          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer shrink-0"
                        >
                          <Download className="w-4 h-4" />
                          <span>ডাউনলোড করুন (PDF)</span>
                        </a>
                      </div>
                    )}

                    {/* Step log history updates */}
                    {rec.updates && rec.updates.length > 0 && (
                      <div className="pt-5 border-t border-dashed border-slate-200 space-y-3">
                        <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-wider block">কার্যক্রমের বিবরণী (Log History)</span>
                        <div className="space-y-3 pl-1.5 border-l-2 border-[#C9A84C]/20">
                          {rec.updates.map((upd: any, uIdx: number) => (
                            <div key={uIdx} className="relative pl-4 space-y-0.5 text-xs">
                              {/* Left dot */}
                              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] absolute left-[-4px] top-1.5" />
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                                <span>{upd.date}</span>
                                <span>•</span>
                                <span>{upd.time}</span>
                              </div>
                              <p className="text-slate-700 font-medium leading-relaxed">{upd.msg}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Operational advice action */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                        <span>সর্বশেষ আপডেট: <span className="font-mono text-slate-600">তাৎক্ষণিক</span></span>
                      </div>
                      
                      <button 
                        onClick={() => window.open(`https://wa.me/8801316567821?text=সালামু আলাইকুম। আমার ট্র্যাকিং আইডি: ${rec.pnr}। এর বর্তমান আপডেট কি?`, "_blank")}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1 transition-all"
                      >
                        হোয়াটসঅ্যাপে সরাসরি বলুন
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Advice banner */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-slate-700 max-w-2xl mx-auto">
          <ShieldAlert className="w-4.5 h-4.5 text-[#C9A84C] shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            যদি আপনার আবেদনের পর ২৪ ঘণ্টার বেশি অতিবাহিত হয়ে থাকে এবং এখানে কোনো আপডেট না দেখতে পান, তবে অনুগ্রহ করে আমাদের জরুরি কাস্টমার হটলাইন নাম্বারে <span className="font-bold text-[#C9A84C] font-mono">+৮৮০১৩১৬৫৬৭৮২১</span> কল করুন।
          </p>
        </div>

      </div>
    </ArabicPageShell>
  );
}
