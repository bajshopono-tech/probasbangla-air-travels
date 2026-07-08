import React, { useState, useRef } from "react";
import PageHeader from "./PageHeader";
import ArabicPageShell from "./arabic/ArabicPageShell";
import { 
  Compass, 
  MapPin, 
  Hotel, 
  Award, 
  CheckCircle, 
  Info, 
  X, 
  Users, 
  Calendar,
  AlertCircle,
  Upload,
  FileDown
} from "lucide-react";
import { GOLD, CornerOrnaments, ArabicDivider } from "./arabic/ArabicDecor";
import { getPackages, getGlobalConfig } from "../utils/dynamicData";
import { downloadReceiptPdf } from "../utils/pdfGenerator";

export default function HajjUmrah() {
  const PACKAGES = getPackages();
  const [globalConfig] = useState(getGlobalConfig());

  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<any>(null);
  
  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [travelMonth, setTravelMonth] = useState("2026-08");
  const [hajjFile, setHajjFile] = useState<File | null>(null);
  const hajjFileRef = useRef<HTMLInputElement>(null);
  const [successMsg, setSuccessMsg] = useState<any>(null);

  const startBooking = (pkg: any) => {
    setSelectedPkg(pkg);
    setShowEnquiryModal(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    if (!hajjFile) {
      alert("দয়া করে প্রয়োজনীয় ছবি বা ডকুমেন্টটি (যেমনঃ পাসপোর্ট বা ওমরাহ যাত্রীর ছবি) আপলোড করুন। ছবি আপলোড করা বাধ্যতামূলক।");
      return;
    }

    const trackingId = "PBT-UMR-" + Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      pnr: trackingId,
      type: "হজ্জ ও ওমরাহ",
      service: `🕌 ${selectedPkg.name} (যাত্রী সংখ্যা: ${passengers} জন)` + (hajjFile ? ` (সংযুক্ত পাসপোর্ট: ${hajjFile.name})` : ""),
      passenger: name,
      passport: "প্রক্রিয়াধীন",
      phone,
      price: `৳ ${(selectedPkg.price * parseInt(passengers)).toLocaleString("bn-BD")}`,
      status: "আবেদন জমা হয়েছে (বুকিং স্লট লক)",
      bookingDate: new Date().toLocaleDateString("bn-BD"),
      date: `ভ্রমণ মাস: ${travelMonth}`,
      time: "N/A"
    };

    // Store in localStorage
    const stored = JSON.parse(localStorage.getItem("probas_bookings") || "[]");
    stored.push(newBooking);
    localStorage.setItem("probas_bookings", JSON.stringify(stored));

    setSuccessMsg(newBooking);
    setShowEnquiryModal(false);
  };

  const resetForm = () => {
    setSuccessMsg(null);
    setName("");
    setPhone("");
    setPassengers("1");
    setHajjFile(null);
  };

  return (
    <ArabicPageShell>
      <PageHeader title="ওমরাহ ও হজ্জ প্যাকেজসমূহ" subtitle="Hajj & Umrah Packages 2026" icon={Compass} backTo="/" />

      <div className="max-w-6xl mx-auto px-4 pb-12">
        {successMsg ? (
          /* --- BOOKING SUCCESS --- */
          <div className="max-w-xl mx-auto bg-[#F8FAFC]/90 border border-[#C9A84C] rounded-3xl p-6 relative shadow-2xl text-center space-y-5 animate-fadeIn">
            <CornerOrnaments />
            
            <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-amber-600">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-800">ওমরাহ বুকিং প্রাক-নিবন্ধন সম্পন্ন!</h3>
              <p className="text-xs text-slate-700">আপনার ওমরাহ বুকিং স্লট সাময়িকভাবে লক করা হয়েছে</p>
            </div>

            <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#C9A84C]/15 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">ট্র্যাকিং আইডি:</span>
                <span className="font-bold text-slate-800 font-mono">{successMsg.pnr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">আবেদনকারী:</span>
                <span className="font-bold text-slate-800">{successMsg.passenger}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">প্যাকেজ:</span>
                <span className="font-bold text-slate-800">{successMsg.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">আনুমানিক মোট খরচ:</span>
                <span className="font-bold text-emerald-700 font-mono">{successMsg.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">প্রস্তাবিত সময়:</span>
                <span className="font-bold text-slate-800">{successMsg.date}</span>
              </div>
            </div>

            <div className="p-3 bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl text-[10px] text-slate-600 flex items-start gap-1.5 text-left leading-relaxed">
              <Info className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" />
              <span>ওমরাহ কনফার্ম করার জন্য পাসপোর্টের কপি ও অগ্রিম বুকিং মানি (প্রতি জন ২০,০০০ টাকা) নিয়ে আমাদের অফিসে যোগাযোগ করুন অথবা আমাদের ব্যাংক অ্যাকাউন্টে জমা দিন।</span>
            </div>

            <div className="flex gap-2 justify-center pt-2 flex-wrap">
              <button 
                onClick={() => {
                  downloadReceiptPdf({
                    title: "ওমরাহ হজ্জ প্রাক-নিবন্ধন রশিদ",
                    pnr: successMsg.pnr,
                    passenger: successMsg.passenger,
                    phone: successMsg.phone,
                    passport: "যাচাইয়ের সময় সংগৃহীত হবে",
                    service: successMsg.service,
                    price: successMsg.price,
                    date: new Date().toLocaleDateString("bn-BD"),
                    status: "প্রাক-নিবন্ধন সম্পন্ন (Pre-registered)",
                    additional: [
                      { label: "প্রস্তাবিত সময় (Travel Month):", value: successMsg.date }
                    ]
                  });
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5" /> পিডিএফ রশিদ ডাউনলোড
              </button>
              <button 
                onClick={() => window.open(`https://wa.me/${globalConfig.whatsapp}?text=সালামু আলাইকুম। আমি ওমরাহ প্যাকেজ বুকিং দিয়েছি। আমার আইডি: ${successMsg.pnr}। অনুগ্রহ করে কথা বলুন।`, "_blank")}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                হোয়াটসঅ্যাপে মুয়াল্লিম কথা বলুন
              </button>
              <button 
                onClick={resetForm}
                className="px-4 py-2 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-lg cursor-pointer"
              >
                প্যাকেজ তালিকায় ফিরুন
              </button>
            </div>
          </div>
        ) : (
          /* --- MAIN LISTING --- */
          <div className="space-y-12">
            
            {/* Packages Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {PACKAGES.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className="bg-white border border-slate-200 hover:border-[#C9A84C]/50 shadow-sm hover:border-[#C9A84C]/45 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between relative shadow-xl"
                >
                  <span className="absolute top-4 right-5 px-2.5 py-0.5 bg-[#C9A84C] text-[#FFFFFF] text-[9px] font-extrabold rounded-full">
                    {pkg.tag}
                  </span>

                  <div className="space-y-5">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800 pr-16 leading-tight">{pkg.name}</h3>
                      <span className="text-xs font-semibold text-slate-600 font-mono block mt-1">{pkg.duration}</span>
                    </div>

                    {/* Price banner */}
                    <div className="bg-[#FFFFFF] border border-[#C9A84C]/10 rounded-2xl p-3.5 text-center">
                      <span className="text-[10px] text-slate-600 block mb-0.5">প্যাকেজ মূল্য (জনপ্রতি)</span>
                      <span className="text-xl font-black text-emerald-700 font-mono">৳ {pkg.price.toLocaleString("bn-BD")}</span>
                    </div>

                    {/* Hotels and logistics */}
                    <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
                      <div className="flex items-start gap-2">
                        <Hotel className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-600 block text-[10px]">মক্কা হোটেল:</span>
                          <span className="font-bold text-slate-800">{pkg.makkahHotel}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Hotel className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-600 block text-[10px]">মদিনা হোটেল:</span>
                          <span className="font-bold text-slate-800">{pkg.madinahHotel}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Compass className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-600 block text-[10px]">পরিবহন ও ফ্লাইট:</span>
                          <span className="font-bold text-slate-800">{pkg.transport} • {pkg.flights}</span>
                        </div>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-1.5 text-xs text-slate-700 pt-4 border-t border-slate-800/60">
                      <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-wider block mb-1">প্যাকেজের অন্তর্ভুক্ত সেবাসমূহ:</span>
                      <ul className="space-y-1.5 pl-1 text-[11px] leading-relaxed">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-600">✔</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  <button
                    onClick={() => startBooking(pkg)}
                    className="w-full py-2.5 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-xl transition-all cursor-pointer mt-6 shadow-md shadow-[#C9A84C]/20"
                  >
                    বুকিং স্লট রিজার্ভ করুন
                  </button>

                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* --- ENQUIRY MODAL --- */}
      {showEnquiryModal && selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#F8FAFC] border border-[#C9A84C]/45 rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
            <CornerOrnaments />
            
            <button 
              onClick={() => setShowEnquiryModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-600 hover:text-white rounded-full bg-slate-50 border border-slate-200/80 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-[#C9A84C] tracking-wider uppercase block mb-0.5">ওমরাহ হজ্জ প্রাক-নিবন্ধন</span>
              <h3 className="font-bold text-lg text-slate-800">সিট বুকিং স্লট কনফার্ম করুন</h3>
              
              <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#C9A84C]/10 text-xs text-slate-700 mt-2.5">
                প্যাকেজ: <span className="font-bold text-slate-800">{selectedPkg.name}</span><br />
                বেস রেট: <span className="font-bold text-emerald-700 font-mono">৳ {selectedPkg.price.toLocaleString("bn-BD")} / জনপ্রতি</span>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3.5">
              <div>
                <label className="text-slate-700 text-[11px] block mb-1">আপনার নাম (পাসপোর্ট অনুযায়ী) *</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="উদাঃ MD JAHANGIR ALOM"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 text-[11px] block mb-1">যাত্রী সংখ্যা *</label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#C9A84C]"
                  >
                    <option value="1">১ জন (সিঙ্গেল)</option>
                    <option value="2">২ জন (ডাবল)</option>
                    <option value="3">৩ জন (ট্রিপল)</option>
                    <option value="4">৪ জন বা ততোধিক</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 text-[11px] block mb-1">ভ্রমণ মাস *</label>
                  <input 
                    type="month" 
                    required
                    value={travelMonth}
                    onChange={(e) => setTravelMonth(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 text-[11px] block mb-1">যোগাযোগের মোবাইল নম্বর *</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="উদাঃ ০১৩১৬৫৬৭৮২১"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div>
                <label className="text-slate-700 text-[11px] block mb-1">প্রয়োজনীয় ডকুমেন্টের ছবি বা ফাইল আপলোড করুন *</label>
                <div 
                  onClick={() => hajjFileRef.current?.click()}
                  className="border-2 border-dashed border-[#C9A84C]/25 hover:border-[#C9A84C]/50 rounded-xl p-3 text-center cursor-pointer bg-[#FFFFFF]/60 transition-colors"
                >
                  <Upload className="w-5 h-5 text-[#C9A84C] mx-auto mb-1" />
                  <span className="text-[10px] text-slate-700 block">
                    {hajjFile ? (
                      <span className="text-amber-600 font-semibold">{hajjFile.name} (সংযুক্ত করা হয়েছে)</span>
                    ) : (
                      "ক্লিক করে পাসপোর্ট বা ওমরাহ যাত্রীর ছবি আপলোড করুন *"
                    )}
                  </span>
                  <span className="text-[8px] text-slate-500 block mt-0.5">ফরম্যাট: JPG, PNG, PDF (সর্বোচ্চ ৫ মেগাবাইট)</span>
                  <input 
                    type="file" 
                    ref={hajjFileRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setHajjFile(e.target.files[0]);
                      }
                    }}
                    className="hidden" 
                  />
                </div>
              </div>

              <div className="p-2 bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl text-[10px] text-slate-600 flex items-start gap-1.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                <span>স্লট বুকিং এর কোনো চার্জ নেই। বুকিং জমা দেওয়ার পর আমাদের ওমরাহ মুয়াল্লিম গাইড ফোন করে পাসপোর্ট জমার তারিখ নির্ধারণ করবেন।</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                প্রাক-নিবন্ধন স্লট বুক করুন
              </button>
            </form>
          </div>
        </div>
      )}

    </ArabicPageShell>
  );
}
