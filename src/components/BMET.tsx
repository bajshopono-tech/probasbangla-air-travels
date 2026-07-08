import React, { useState, useRef } from "react";
import PageHeader from "./PageHeader";
import ArabicPageShell from "./arabic/ArabicPageShell";
import { 
  ShieldCheck, 
  FileText, 
  Users, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle, 
  Check,
  BookOpen,
  Info,
  X,
  Upload,
  FileDown
} from "lucide-react";
import { GOLD, CornerOrnaments, ArabicDivider } from "./arabic/ArabicDecor";
import { getServicesInfo, getGlobalConfig } from "../utils/dynamicData";
import { downloadReceiptPdf } from "../utils/pdfGenerator";

export default function BMET() {
  const SERVICES_INFO = getServicesInfo();
  const [globalConfig] = useState(getGlobalConfig());

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  
  // Form fields
  const [applicantName, setApplicantName] = useState("");
  const [applicantPassport, setApplicantPassport] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantNid, setApplicantNid] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  const [bmetFile, setBmetFile] = useState<File | null>(null);
  const bmetFileRef = useRef<HTMLInputElement>(null);
  
  const [successMsg, setSuccessMsg] = useState<any>(null);

  const startApplication = (title: string) => {
    setSelectedService(title);
    setShowApplyForm(true);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) return;

    if (!bmetFile) {
      alert("দয়া করে প্রয়োজনীয় ছবি বা ডকুমেন্টটি (যেমনঃ পাসপোর্ট, এনআইডি বা জন্ম নিবন্ধন কপি) আপলোড করুন। ছবি আপলোড করা বাধ্যতামূলক।");
      return;
    }

    const trackingId = "PBT-GOV-" + Math.floor(10000 + Math.random() * 90000);
    const newApp = {
      pnr: trackingId,
      type: "BMET ও অন্যান্য",
      service: `📋 ${selectedService}` + (bmetFile ? ` (সংযুক্ত ডকুমেন্ট: ${bmetFile.name})` : ""),
      passenger: applicantName,
      passport: applicantPassport || "N/A",
      phone: applicantPhone,
      price: "যাচাই সাপেক্ষে ফি ধার্য হবে",
      status: "আবেদন জমা হয়েছে (ডকুমেন্টস রিভিউ পেন্ডিং)",
      bookingDate: new Date().toLocaleDateString("bn-BD"),
      date: "৩-৫ কর্মদিবস",
      time: "N/A"
    };

    // Save to localStorage
    const stored = JSON.parse(localStorage.getItem("probas_bookings") || "[]");
    stored.push(newApp);
    localStorage.setItem("probas_bookings", JSON.stringify(stored));

    setSuccessMsg(newApp);
    setShowApplyForm(false);

    // Automatically trigger PDF download
    downloadReceiptPdf({
      title: "নাগরিক ও বিএমইটি সেবা আবেদন রসিদ",
      pnr: newApp.pnr,
      passenger: newApp.passenger,
      phone: newApp.phone,
      passport: newApp.passport || "N/A",
      service: newApp.service,
      price: "যাচাই সাপেক্ষে নির্ধারিত",
      date: new Date().toLocaleDateString("bn-BD"),
      status: "দাখিলকৃত (Pending Verification)",
      additional: []
    });
  };

  const resetForm = () => {
    setSuccessMsg(null);
    setApplicantName("");
    setApplicantPassport("");
    setApplicantPhone("");
    setApplicantNid("");
    setAdditionalNote("");
    setBmetFile(null);
  };

  return (
    <ArabicPageShell>
      <PageHeader title="BMET ও নাগরিক সেবা" subtitle="BMET & Expat Government Services" icon={ShieldCheck} backTo="/" />

      <div className="max-w-6xl mx-auto px-4 pb-12">
        {successMsg ? (
          /* --- APPLICATION SUCCESS SCREEN --- */
          <div className="max-w-xl mx-auto bg-[#F8FAFC]/90 border border-[#C9A84C] rounded-3xl p-6 relative shadow-2xl text-center space-y-5 animate-fadeIn">
            <CornerOrnaments />
            
            <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-amber-600">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-800">আবেদন সফলভাবে দাখিল হয়েছে!</h3>
              <p className="text-xs text-slate-700">আমাদের কনসালট্যান্ট অতি দ্রুত আবেদনটি পর্যালোচনা করবেন</p>
            </div>

            <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#C9A84C]/15 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">ট্র্যাকিং নম্বর:</span>
                <span className="font-bold text-slate-800 font-mono">{successMsg.pnr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">আবেদনকারী:</span>
                <span className="font-bold text-slate-800">{successMsg.passenger}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">সেবা ক্যাটাগরি:</span>
                <span className="font-bold text-slate-800">{successMsg.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">মোবাইল নম্বর:</span>
                <span className="font-bold text-slate-800 font-mono">{successMsg.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">আনুমানিক সময়:</span>
                <span className="font-bold text-yellow-400">{successMsg.date}</span>
              </div>
            </div>

            <div className="p-3 bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl text-[10px] text-slate-600 flex items-start gap-1.5 text-left leading-relaxed">
              <Info className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" />
              <span>BMET ও পাসপোর্ট সংশোধনের ক্ষেত্রে প্রয়োজনীয় মূল ফাইল (ওরিজিনাল পাসপোর্ট বা NID কপি) স্ক্যান করে আমাদের হোয়াটসঅ্যাপ নাম্বারে পাঠাতে হবে। আমাদের হেল্প ডেস্ক থেকে আপনাকে কল দেওয়া হবে।</span>
            </div>

            <div className="flex gap-2 justify-center pt-2 flex-wrap">
              <button 
                onClick={() => {
                  downloadReceiptPdf({
                    title: "নাগরিক ও বিএমইটি সেবা আবেদন রসিদ",
                    pnr: successMsg.pnr,
                    passenger: successMsg.passenger,
                    phone: successMsg.phone,
                    passport: successMsg.passport || "প্রযোজ্য নয়",
                    service: successMsg.service,
                    price: "যাচাই সাপেক্ষে নির্ধারিত",
                    date: new Date().toLocaleDateString("bn-BD"),
                    status: "দাখিলকৃত (Pending Verification)",
                    additional: []
                  });
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5" /> পিডিএফ রশিদ ডাউনলোড
              </button>
              <button 
                onClick={() => window.open(`https://wa.me/${globalConfig.whatsapp}?text=সালামু আলাইকুম। আমি BMET/নাগরিক সেবা আবেদন করেছি। আমার ট্র্যাকিং আইডি: ${successMsg.pnr}।`, "_blank")}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                হোয়াটসঅ্যাপে কথা বলুন
              </button>
              <button 
                onClick={resetForm}
                className="px-4 py-2 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-lg cursor-pointer"
              >
                নাগরিক সেবা তালিকায় ফিরুন
              </button>
            </div>
          </div>
        ) : (
          /* --- MAIN BMET CARD DISPLAY --- */
          <div className="space-y-10">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {SERVICES_INFO.map((serv, i) => (
                <div 
                  key={i} 
                  className="bg-white border border-slate-200 hover:border-[#C9A84C]/50 shadow-sm hover:border-[#C9A84C]/45 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-base md:text-lg text-slate-800 leading-snug">{serv.title}</h3>
                      <span className="text-[10px] font-mono font-bold text-[#C9A84C] uppercase tracking-wider block mt-0.5">{serv.subtitle}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed italic bg-[#FFFFFF]/50 p-3 rounded-xl border border-slate-800/40">
                      "{serv.desc}"
                    </p>

                    {/* Points covered */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-wider block">যা যা অন্তর্ভুক্ত:</span>
                      <ul className="space-y-1.5 pl-0.5">
                        {serv.points.map((pt, ptIdx) => (
                          <li key={ptIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                            <span className="text-amber-600 mt-0.5">✓</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-600 block leading-none">আনুমানিক ফি</span>
                      <span className="text-xs font-extrabold text-[#E2C876] block leading-normal">{serv.price}</span>
                    </div>
                    <button
                      onClick={() => startApplication(serv.title)}
                      className="px-4 py-2 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-xl cursor-pointer shadow shadow-[#C9A84C]/25"
                    >
                      আবেদন ফরম
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* General Instructions FAQ Accordion */}
            <div className="max-w-3xl mx-auto bg-[#F8FAFC]/40 border border-[#C9A84C]/15 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 border-b border-[#C9A84C]/10 pb-2 mb-2">
                <BookOpen className="w-4.5 h-4.5 text-[#C9A84C]" /> অত্যন্ত জরুরি সাধারণ নির্দেশনাবলী
              </h3>
              
              <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed">
                <div>
                  <span className="font-bold text-[#C9A84C] block mb-0.5">১. বিএমইটি ফি পরিশোধের কতক্ষণ পর স্মার্টকার্ড পাওয়া যায়?</span>
                  সাধারণত প্রবাসী কল্যাণ ব্যাংকের সার্ভার জটিলতা না থাকলে ফি জমা দেওয়ার ৪ থেকে ২৪ ঘণ্টার মধ্যে চূড়ান্ত স্মার্টকার্ড ডাউনলোড করা যায়।
                </div>
                <div>
                  <span className="font-bold text-[#C9A84C] block mb-0.5">২. NID সংশোধনের জন্য কি কি ডকুমেন্টস লাগে?</span>
                  ইংরেজি নাম পরিবর্তনের জন্য এসএসসি সার্টিফিকেট, জন্ম নিবন্ধন এবং মূল পিস অব পাসপোর্ট প্রয়োজন হয়। মা-বাবার নাম ঠিক করতে হলে তাদের NID-এর তথ্যও বাধ্যতামূলক।
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- CIVIL APPLICATION MODAL --- */}
      {showApplyForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#F8FAFC] border border-[#C9A84C]/45 rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
            <CornerOrnaments />
            
            <button 
              onClick={() => setShowApplyForm(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-600 hover:text-white rounded-full bg-slate-50 border border-slate-200/80 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-[#C9A84C] tracking-wider uppercase block mb-0.5">নাগরিক ও বিএমইটি সহায়তা ডেস্ক</span>
              <h3 className="font-bold text-lg text-slate-800">ডকুমেন্ট সংশোধন আবেদন</h3>
              
              <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#C9A84C]/10 text-xs text-slate-700 mt-2.5">
                নির্বাচিত ক্যাটাগরি: <span className="font-bold text-slate-800">{selectedService}</span>
              </div>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3.5">
              <div>
                <label className="text-slate-700 text-[11px] block mb-1">আবেদনকারীর নাম (বাংলা বা ইংরেজি) *</label>
                <input 
                  type="text" 
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="উদাঃ মোঃ হাবিবুর রহমান"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 text-[11px] block mb-1">পাসপোর্ট নম্বর (ঐচ্ছিক)</label>
                  <input 
                    type="text" 
                    value={applicantPassport}
                    onChange={(e) => setApplicantPassport(e.target.value)}
                    placeholder="A01234567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold font-mono uppercase focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 text-[11px] block mb-1">NID নম্বর (ঐচ্ছিক)</label>
                  <input 
                    type="text" 
                    value={applicantNid}
                    onChange={(e) => setApplicantNid(e.target.value)}
                    placeholder="1234567890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold font-mono focus:outline-none"
                  />
                </div>
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

              <div>
                <label className="text-slate-700 text-[11px] block mb-1">অতিরিক্ত বিবরণ বা বিবরণীর ভুল সমূহ</label>
                <textarea 
                  value={additionalNote}
                  onChange={(e) => setAdditionalNote(e.target.value)}
                  placeholder="উদাঃ পাসপোর্টে নাম HABIB আর NID তে HABIBUR আছে।"
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold placeholder-slate-500 focus:outline-none focus:border-[#C9A84C] resize-none"
                />
              </div>

              <div>
                <label className="text-slate-700 text-[11px] block mb-1">প্রয়োজনীয় ডকুমেন্টের ছবি বা ফাইল আপলোড করুন *</label>
                <div 
                  onClick={() => bmetFileRef.current?.click()}
                  className="border-2 border-dashed border-[#C9A84C]/25 hover:border-[#C9A84C]/50 rounded-xl p-3 text-center cursor-pointer bg-[#FFFFFF]/60 transition-colors"
                >
                  <Upload className="w-5 h-5 text-[#C9A84C] mx-auto mb-1" />
                  <span className="text-[10px] text-slate-700 block">
                    {bmetFile ? (
                      <span className="text-amber-600 font-semibold">{bmetFile.name} (সংযুক্ত করা হয়েছে)</span>
                    ) : (
                      "ক্লিক করে পাসপোর্টের ছবি/ডকুমেন্ট ফাইল আপলোড করুন *"
                    )}
                  </span>
                  <span className="text-[8px] text-slate-500 block mt-0.5">ফরম্যাট: JPG, PNG, PDF (সর্বোচ্চ ৫ মেগাবাইট)</span>
                  <input 
                    type="file" 
                    ref={bmetFileRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setBmetFile(e.target.files[0]);
                      }
                    }}
                    className="hidden" 
                  />
                </div>
              </div>

              <div className="p-2 bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl text-[10px] text-slate-600 flex items-start gap-1.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                <span>আবেদন দাখিল সম্পন্ন হলে আমাদের টিম সরকারি সার্ভারে আবেদনের পূর্বে ম্যানুয়াল স্ক্রিনিং এর জন্য আপনাকে কল করবে।</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                আবেদন জমা দিন (Submit)
              </button>
            </form>
          </div>
        </div>
      )}

    </ArabicPageShell>
  );
}
