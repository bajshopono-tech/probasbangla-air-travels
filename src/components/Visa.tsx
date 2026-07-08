import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PageHeader from "./PageHeader";
import ArabicPageShell from "./arabic/ArabicPageShell";
import { 
  FileText, 
  MapPin, 
  ShieldAlert, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Info, 
  X, 
  Sparkles,
  Upload,
  AlertCircle,
  FileDown
} from "lucide-react";
import { GOLD, CornerOrnaments } from "./arabic/ArabicDecor";
import { getVisaData, getGlobalConfig } from "../utils/dynamicData";
import { downloadReceiptPdf } from "../utils/pdfGenerator";

export default function Visa() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const VISA_DATA = getVisaData();
  const [globalConfig] = useState(getGlobalConfig());

  // Active country toggle
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get("country") || "Saudi Arabia");
  
  // Visa Application Form
  const [applicantName, setApplicantName] = useState("");
  const [applicantPassport, setApplicantPassport] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [visaTypeSelected, setVisaTypeSelected] = useState("");
  const [passportFileMock, setPassportFileMock] = useState<string | null>(null);
  
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState<any>(null);

  // Synchronize dynamic default visa type selection when country changes
  useEffect(() => {
    if (VISA_DATA[selectedCountry]) {
      setVisaTypeSelected(VISA_DATA[selectedCountry].types[0].name);
    }
  }, [selectedCountry]);

  const handleApplyClick = (type: string) => {
    setVisaTypeSelected(type);
    setShowApplyModal(true);
  };

  const handleVisaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPassport || !applicantPhone) return;

    if (!passportFileMock) {
      alert("দয়া করে পাসপোর্টের ১ম পাতার রঙিন ছবি আপলোড করুন। ফাইল আপলোড করা বাধ্যতামূলক।");
      return;
    }

    const trackingId = "PBT-VISA-" + Math.floor(10000 + Math.random() * 90000);
    const newVisaApp = {
      pnr: trackingId,
      type: "ভিসা প্রসেসিং",
      service: `${VISA_DATA[selectedCountry].flag} ${VISA_DATA[selectedCountry].country} - ${visaTypeSelected}`,
      passenger: applicantName,
      passport: applicantPassport,
      phone: applicantPhone,
      price: VISA_DATA[selectedCountry].types.find((t: any) => t.name === visaTypeSelected)?.price || "৳ ১৫,০০০",
      status: "আবেদন প্রাপ্তি (ডকুমেন্ট যাচাই চলছে)",
      bookingDate: new Date().toLocaleDateString("bn-BD"),
      date: "৭ কর্মদিবসের মধ্যে সমাধান",
      time: "N/A"
    };

    // Store in localStorage so Status Checker can query it
    const stored = JSON.parse(localStorage.getItem("probas_bookings") || "[]");
    stored.push(newVisaApp);
    localStorage.setItem("probas_bookings", JSON.stringify(stored));

    setApplySuccessMsg(newVisaApp);
    setShowApplyModal(false);

    // Automatically trigger PDF download
    downloadReceiptPdf({
      title: "ভিসা প্রসেসিং আবেদন রসিদ",
      pnr: newVisaApp.pnr,
      passenger: newVisaApp.passenger,
      phone: newVisaApp.phone,
      passport: newVisaApp.passport,
      service: newVisaApp.service,
      price: newVisaApp.price,
      date: new Date().toLocaleDateString("bn-BD"),
      status: newVisaApp.status,
      additional: [
        { label: "দেশ (Country):", value: VISA_DATA[selectedCountry].country }
      ]
    });
  };

  const resetForm = () => {
    setApplySuccessMsg(null);
    setApplicantName("");
    setApplicantPassport("");
    setApplicantPhone("");
    setPassportFileMock(null);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setPassportFileMock("passport_copy_scan.pdf (জমা নেওয়া হয়েছে)");
  };

  return (
    <ArabicPageShell>
      <PageHeader title="ভিসা প্রসেসিং সেন্টার" subtitle="Middle East Visa Services" icon={FileText} backTo="/" />

      <div className="max-w-6xl mx-auto px-4 pb-12">
        {applySuccessMsg ? (
          /* --- SUCCESS APPLIED SCREEN --- */
          <div className="max-w-xl mx-auto bg-[#F8FAFC]/90 border border-[#C9A84C] rounded-3xl p-6 relative shadow-2xl text-center space-y-5 animate-fadeIn">
            <CornerOrnaments />
            
            <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-amber-600">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-lg text-slate-800">ভিসা আবেদন সফলভাবে গৃহীত হয়েছে!</h3>
              <p className="text-xs text-slate-700">আপনার অ্যাপ্লিকেশন বর্তমানে যাচাইকরণে রয়েছে</p>
            </div>

            <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#C9A84C]/15 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">ট্র্যাকিং নম্বর (ID):</span>
                <span className="font-bold text-slate-800 font-mono">{applySuccessMsg.pnr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">আবেদনকারী:</span>
                <span className="font-bold text-slate-800">{applySuccessMsg.passenger}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">ভিসার ধরন:</span>
                <span className="font-bold text-slate-800">{applySuccessMsg.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">ভিসা ফি:</span>
                <span className="font-bold text-[#E2C876] font-mono">{applySuccessMsg.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">অবস্থা (Status):</span>
                <span className="font-bold text-yellow-400">{applySuccessMsg.status}</span>
              </div>
            </div>

            <div className="p-3 bg-[#C9A84C]/5 border border-[#C9A84C]/25 rounded-xl text-[10px] text-slate-600 flex items-start gap-1.5 text-left leading-relaxed">
              <Info className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" />
              <span>আমাদের এনালিস্ট দল আপনার প্রদত্ত পাসপোর্ট ও ফাইল যাচাই করবেন। কোনো ডকুমেন্টে অমিল বা ভুল থাকলে আপনার মোবাইলে ২৪ ঘণ্টার মধ্যে কল দেওয়া হবে।</span>
            </div>

            <div className="flex gap-2 justify-center pt-2 flex-wrap">
              <button 
                onClick={() => {
                  downloadReceiptPdf({
                    title: "ভিসা প্রসেসিং আবেদন রসিদ",
                    pnr: applySuccessMsg.pnr,
                    passenger: applySuccessMsg.passenger,
                    phone: applySuccessMsg.phone,
                    passport: applySuccessMsg.passport,
                    service: applySuccessMsg.service,
                    price: applySuccessMsg.price,
                    date: new Date().toLocaleDateString("bn-BD"),
                    status: applySuccessMsg.status,
                    additional: [
                      { label: "দেশ (Country):", value: applySuccessMsg.country }
                    ]
                  });
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5" /> পিডিএফ রশিদ ডাউনলোড
              </button>
              <button 
                onClick={() => window.open(`https://wa.me/${globalConfig.whatsapp}?text=সালামু আলাইকুম। আমি ভিসা প্রসেসিং এর আবেদন করেছি। আমার ট্র্যাকিং আইডি: ${applySuccessMsg.pnr}।`, "_blank")}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                হোয়াটসঅ্যাপে আপডেট চান
              </button>
              <button 
                onClick={resetForm}
                className="px-4 py-2 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-lg cursor-pointer"
              >
                নতুন আবেদন করুন
              </button>
            </div>
          </div>
        ) : (
          /* --- MAIN VISA INTERFACE --- */
          <div className="space-y-8">
            
            {/* Country Selector Pills */}
            <div className="flex flex-wrap gap-2.5 justify-center">
              {Object.keys(VISA_DATA).map((countryKey) => (
                <button
                  key={countryKey}
                  onClick={() => setSelectedCountry(countryKey)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer border ${
                    selectedCountry === countryKey 
                      ? "bg-[#C9A84C] text-[#FFFFFF] border-[#C9A84C]" 
                      : "bg-[#F8FAFC]/50 border-[#C9A84C]/15 text-slate-700 hover:text-white hover:bg-[#F8FAFC]/90"
                  }`}
                >
                  <span className="text-base leading-none">{VISA_DATA[countryKey].flag}</span>
                  <span>{VISA_DATA[countryKey].country.split(" (")[0]}</span>
                </button>
              ))}
            </div>

            {/* Selected Country Details Card */}
            <div className="bg-white border border-slate-200 hover:border-[#C9A84C]/50 shadow-sm rounded-3xl p-5 md:p-8 shadow-xl relative overflow-hidden">
              <CornerOrnaments />
              
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                <span className="text-3xl leading-none">{VISA_DATA[selectedCountry].flag}</span>
                <div>
                  <h3 className="font-bold text-lg md:text-xl text-slate-800">{VISA_DATA[selectedCountry].country}</h3>
                  <p className="text-xs text-slate-600">নিশ্চিত ভিসা সাকসেস রেট ও বিশ্বস্ত প্রসেসিং</p>
                </div>
              </div>

              {/* Visa types list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {VISA_DATA[selectedCountry].types.map((type: any, index: number) => (
                  <div 
                    key={index} 
                    className="bg-[#FFFFFF]/80 border border-[#C9A84C]/10 hover:border-[#C9A84C]/30 rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm md:text-base text-slate-800">{type.name}</h4>
                        <span className="px-2.5 py-0.5 bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] font-bold rounded-full border border-[#C9A84C]/15 whitespace-nowrap">
                          {type.processing}
                        </span>
                      </div>

                      {/* Required Documents list */}
                      <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-800/60">
                        <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-wider block">প্রয়োজনীয় কাগজপত্র:</span>
                        <ul className="space-y-1 pl-1 text-[11px] leading-relaxed">
                          {type.docs.map((doc: string, dIdx: number) => (
                            <li key={dIdx} className="flex items-start gap-1">
                              <span className="text-amber-600">✔</span>
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Cost and call-to-action */}
                    <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-slate-600 block leading-none">টোটাল সার্ভিস চার্জ</span>
                        <span className="text-sm font-extrabold text-[#E2C876] font-mono">{type.price}</span>
                      </div>
                      <button
                        onClick={() => handleApplyClick(type.name)}
                        className="px-3 py-1.5 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-[11px] rounded-lg cursor-pointer transition-all shadow shadow-[#C9A84C]/20"
                      >
                        অনলাইন আবেদন
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>

            {/* Note alert */}
            <div className="p-4 bg-yellow-950/20 border border-yellow-500/20 rounded-2xl flex items-start gap-3 text-xs text-slate-700 max-w-4xl mx-auto">
              <ShieldAlert className="w-5 h-5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-[#C9A84C] block mb-0.5">সতর্কতা ও সাধারণ ঘোষণা:</span>
                ভিসা মঞ্জুর বা প্রত্যাখ্যানের সম্পূর্ণ ক্ষমতা সংশ্লিষ্ট দেশের দূতাবাসের উপর নির্ভরশীল। প্রবাসবাংলা ট্রাভেলস অত্যন্ত নির্ভুলভাবে আপনার আবেদনটি ফাইল প্রসেস করে থাকে। কোনো জাল বা ভুল তথ্য প্রদান করলে ভিসা বাতিল হতে পারে।
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- VISA CHECKOUT MODAL --- */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#F8FAFC] border border-[#C9A84C]/45 rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
            <CornerOrnaments />
            
            <button 
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-600 hover:text-white rounded-full bg-slate-50 border border-slate-200/80 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-[#C9A84C] tracking-wider uppercase block mb-0.5">ডিজিটাল ভিসা প্রসেসিং পোর্টাল</span>
              <h3 className="font-bold text-lg text-slate-800">ভিসার আবেদন পূরণ করুন</h3>
              
              <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#C9A84C]/10 text-xs text-slate-700 mt-2.5">
                দেশ: <span className="font-bold text-slate-800">{VISA_DATA[selectedCountry].country}</span><br />
                ক্যাটেগরি: <span className="font-bold text-amber-700">{visaTypeSelected}</span>
              </div>
            </div>

            <form onSubmit={handleVisaSubmit} className="space-y-3.5">
              <div>
                <label className="text-slate-700 text-[11px] block mb-1">আবেদনকারীর পূর্ণ নাম (পাসপোর্ট অনুযায়ী) *</label>
                <input 
                  type="text" 
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="উদাঃ MOHAMMAD HABIBUR RAHMAN"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div>
                <label className="text-slate-700 text-[11px] block mb-1">পাসপোর্ট নম্বর *</label>
                <input 
                  type="text" 
                  required
                  value={applicantPassport}
                  onChange={(e) => setApplicantPassport(e.target.value)}
                  placeholder="উদাঃ A01234567"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold font-mono uppercase focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div>
                <label className="text-slate-700 text-[11px] block mb-1">সক্রিয় মোবাইল নম্বর *</label>
                <input 
                  type="tel" 
                  required
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="উদাঃ ০১৩১৬৫৬৭৮২১"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Drag and drop file field */}
              <div>
                <label className="text-slate-700 text-[11px] block mb-1">পাসপোর্টের ১ম পাতার রঙিন ছবি (Drag & Drop) *</label>
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => setPassportFileMock("passport_copy_scan.pdf (জমা নেওয়া হয়েছে)")}
                  className="border-2 border-dashed border-[#C9A84C]/25 hover:border-[#C9A84C]/50 rounded-xl p-4 text-center cursor-pointer bg-[#FFFFFF]/60 transition-colors"
                >
                  <Upload className="w-6 h-6 text-[#C9A84C] mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-700 block">
                    {passportFileMock ? (
                      <span className="text-amber-600 font-semibold">{passportFileMock}</span>
                    ) : (
                      "এখানে পাসপোর্ট ফাইল ড্র্যাগ করুন অথবা ক্লিক করে আপলোড করুন"
                    )}
                  </span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">ফরম্যাট: PDF, JPG, PNG (সর্বোচ্চ ৫ মেগাবাইট)</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                ভিসা ফাইল প্রসেসিং শুরু করুন
              </button>
            </form>
          </div>
        </div>
      )}

    </ArabicPageShell>
  );
}
