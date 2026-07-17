import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Phone, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Copy, 
  Sparkles, 
  Plane, 
  Globe, 
  Compass, 
  Clock, 
  HeartHandshake 
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function QuickContact() {
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState("Flight");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ pnr: string; service: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Translate helper
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert(t("দয়া করে আপনার নাম এবং মোবাইল নম্বর প্রদান করুন।", "Please provide your name and contact number."));
      return;
    }

    // Phone validation check
    const cleanPhone = phone.replace(/\s+/g, "");
    if (cleanPhone.length < 11) {
      alert(t("দয়া করে একটি সঠিক মোবাইল নম্বর প্রদান করুন (ন্যূনতম ১১ ডিজিট)।", "Please enter a valid mobile number (at least 11 digits)."));
      return;
    }

    setIsSubmitting(true);

    // Simulate database write
    setTimeout(() => {
      const generatedPnr = "PB" + Math.floor(100000 + Math.random() * 900000);
      const serviceLabel = {
        Flight: t("এয়ার টিকিট বুকিং অনুসন্ধান", "Flight Ticket Booking Inquiry"),
        Visa: t("ভিসা প্রসেস ও স্ট্যাম্পিং", "Visa Processing & Stamping Inquiry"),
        Hajj: t("হজ্জ ও ওমরাহ বিশেষ প্যাকেজ", "Hajj & Umrah Premium Packages")
      }[serviceType as "Flight" | "Visa" | "Hajj"] || t("সাধারণ ভ্রমণ জিজ্ঞাসা", "General Travel Inquiry");

      // Save into probas_bookings so it is instantly searchable in Status Check
      const newBooking = {
        pnr: generatedPnr,
        passenger: name.trim(),
        phone: phone.trim(),
        type: serviceLabel,
        status: "প্রক্রিয়াধীন",
        timelineStep: 1,
        date: new Date().toISOString().split('T')[0],
        details: message.trim() || t("তাৎক্ষণিক কাস্টমার ওয়ান-স্টপ কুইক কন্টাক্ট রিকোয়েস্ট", "Instant customer one-stop quick contact request"),
        fileData: null,
        fileName: "",
        updates: [
          {
            title: t("কুইক কন্টাক্ট রিকোয়েস্ট গৃহিত হয়েছে", "Quick Inquiry Received"),
            desc: t(
              "আমাদের কুইক সাপোর্ট ডেস্কে আপনার সফল যোগাযোগ সম্পন্ন হয়েছে। কাস্টমার ম্যানেজার আপনাকে খুব শীঘ্রই কল ব্যাক করবেন।",
              "Your quick contact inquiry has been successfully queued. A support manager will call you back shortly."
            ),
            time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toISOString().split('T')[0],
            step: 1
          }
        ]
      };

      const stored = JSON.parse(localStorage.getItem("probas_bookings") || "[]");
      stored.unshift(newBooking);
      localStorage.setItem("probas_bookings", JSON.stringify(stored));

      // Trigger state updates
      setSubmittedData({ pnr: generatedPnr, service: serviceLabel });
      setIsSubmitting(false);

      // Trigger standard audio notification feedback if available
      try {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-500.wav");
        audio.volume = 0.2;
        audio.play().catch(() => {});
      } catch (e) {}

    }, 1200);
  };

  const copyToClipboard = () => {
    if (submittedData) {
      navigator.clipboard.writeText(submittedData.pnr);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleReset = () => {
    setName("");
    setPhone("");
    setServiceType("Flight");
    setMessage("");
    setSubmittedData(null);
  };

  return (
    <section className="w-full py-16 bg-slate-900 text-white relative overflow-hidden border-t border-b border-emerald-900/30" id="quick-contact-section">
      {/* Arabic and Emerald Themed Vector Patterns & Ambient Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Aesthetic Border Liners */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Core Value Proposition & Marketing Points */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C9A84C]/35 bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A84C] animate-pulse" />
              <span>{t("অনলাইন দ্রুত রেসপন্স সাপোর্ট", "Instant Online Callback")}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {t("সরাসরি কাস্টমার", "Streamlined")}{" "}
              <span className="text-[#C9A84C]">{t("ম্যানেজারের কল পান", "Agent Connection")}</span>
            </h2>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
              {t(
                "কোনো জটিল রেজিস্ট্রেশন ছাড়া মাত্র ৩০ সেকেন্ডে আপনার নাম ও নম্বর জমা দিয়ে টিকিট, ভিসা ও ওমরাহ সংক্রান্ত সঠিক তথ্য ও স্পেশাল ডিসকাউন্ট অফার পেতে আমাদের অভিজ্ঞ টিমের কল ব্যাক রিকোয়েস্ট পাঠান।",
                "Skip the complex forms. Submit your details in under 30 seconds, and our professional managers will call you back with verified rates and custom flight, visa, or Hajj options."
              )}
            </p>

            {/* Quick Benefits Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-100">{t("১০-১৫ মিনিটে কল ব্যাক", "10-15 Min Callback")}</h4>
                  <p className="text-[10px] text-slate-400">{t("সকাল ৯টা - রাত ১১টা", "9 AM - 11 PM Active")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3">
                <div className="w-8 h-8 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-100">{t("বিনামূল্যে পরামর্শ", "Free Consultation")}</h4>
                  <p className="text-[10px] text-slate-400">{t("কোনো লুকানো চার্জ নেই", "No Hidden Charges")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Capture Interactive Card */}
          <div className="lg:col-span-7">
            <div className="bg-slate-800/70 border border-slate-700/85 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              {/* Corner Star Accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-bl-full pointer-events-none" />

              <AnimatePresence mode="wait">
                {!submittedData ? (
                  // Step 1: Active Input Form
                  <motion.form
                    key="input-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    id="quick-contact-inner-form"
                  >
                    <div className="border-b border-slate-700/60 pb-3">
                      <h3 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t("দ্রুত জিজ্ঞাসা ও সাপোর্ট ফরম", "Quick Callback & Support Request")}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {t("সঠিক তথ্য দিন, আমাদের প্রতিনিধি সরাসরি আপনাকে ফোনে সহযোগিতা করবেন।", "Provide your details to get connected with our experts.")}
                      </p>
                    </div>

                    {/* Full Name Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">
                        {t("আপনার পুরো নাম (Full Name) *", "Your Full Name *")}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t("যেমনঃ আলহাজ্ব আলী হাসান", "e.g., Alhaj Ali Hasan")}
                          className="w-full bg-slate-900/90 border border-slate-700/90 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/50 transition-all font-semibold"
                          id="qc-input-name"
                        />
                      </div>
                    </div>

                    {/* Contact Number Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">
                        {t("মোবাইল নম্বর (Mobile Number) *", "Contact Mobile Number *")}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={t("যেমনঃ 017XXXXXXXX", "e.g., 017XXXXXXXX")}
                          className="w-full bg-slate-900/90 border border-slate-700/90 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/50 transition-all font-semibold"
                          id="qc-input-phone"
                        />
                      </div>
                    </div>

                    {/* Service Type Selection Option Grid */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 block">
                        {t("সেবার ধরন (Select Service Type) *", "Service Category *")}
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { key: "Flight", label: t("ফ্লাইট টিকিট", "Flights"), icon: Plane, bg: "hover:border-blue-500/60", activeBg: "border-blue-500 bg-blue-500/10 text-blue-400" },
                          { key: "Visa", label: t("ভিসা প্রসেস", "Visa Pro"), icon: Globe, bg: "hover:border-emerald-500/60", activeBg: "border-emerald-500 bg-emerald-500/10 text-emerald-400" },
                          { key: "Hajj", label: t("হজ্জ ও ওমরাহ", "Hajj & Umrah"), icon: Compass, bg: "hover:border-amber-500/60", activeBg: "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]" }
                        ].map((opt) => {
                          const Icon = opt.icon;
                          const isActive = serviceType === opt.key;
                          return (
                            <button
                              type="button"
                              key={opt.key}
                              onClick={() => setServiceType(opt.key)}
                              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer gap-1.5 focus:outline-none ${
                                isActive 
                                  ? opt.activeBg 
                                  : "border-slate-700 bg-slate-900/30 text-slate-400 hover:text-white " + opt.bg
                              }`}
                              id={`qc-btn-opt-${opt.key}`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="text-[10px] md:text-xs font-bold">{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Extra Notes Optional TextArea */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">
                        {t("অতিরিক্ত তথ্য (Any Specific Request? - Optional)", "Specific Inquiry Details (Optional)")}
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3.5 text-slate-400 pointer-events-none">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <textarea
                          rows={2}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={t(
                            "যেমনঃ ঢাকা থেকে রিয়াদ ওয়ান-ওয়ে টিকিট কত? অথবা ওমরাহ ভিসার ফি কত?",
                            "e.g., Ticket price from Dhaka to Riyadh? Or Umrah visa cost?"
                          )}
                          className="w-full bg-slate-900/90 border border-slate-700/90 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/50 transition-all font-semibold resize-none"
                          id="qc-input-details"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-[#C9A84C] to-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-emerald-900/10 focus:outline-none disabled:opacity-50"
                      id="qc-btn-submit"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin" />
                          <span>{t("অনুরোধ পাঠানো হচ্ছে...", "Sending Callback Request...")}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{t("ফ্রি কল ব্যাক রিকোয়েস্ট পাঠান", "Send Free Callback Request")}</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  // Step 2: Custom Live Tracking Success Card
                  <motion.div
                    key="success-form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-6 space-y-6"
                    id="quick-contact-success-block"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce-slow">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-extrabold text-xl text-white">
                        {t("আপনার অনুরোধটি সফলভাবে জমা হয়েছে!", "Request Submitted Successfully!")}
                      </h3>
                      <p className="text-xs text-slate-300 max-w-md mx-auto">
                        {t(
                          "সম্মানিত গ্রাহক, ধন্যবাদ আমাদের সাথে যোগাযোগ করার জন্য। আপনার জন্য একটি সিকিউর ট্র্যাকিং নম্বর (PNR) তৈরি করা হয়েছে। আমাদের কাস্টমার প্রতিনিধি খুব শীঘ্রই আপনার প্রদত্ত মোবাইল নম্বরে কল করবেন।",
                          "Thank you! A secure tracking number (PNR) has been generated for you. One of our support representatives will call you shortly."
                        )}
                      </p>
                    </div>

                    {/* Unique Tracking PNR Box with Copy Button */}
                    <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 max-w-sm mx-auto space-y-2.5 shadow-inner">
                      <span className="text-[10px] font-bold text-[#C9A84C] tracking-widest uppercase block">
                        {t("আপনার ট্র্যাকিং নাম্বার (Your secure PNR)", "Your Secure Tracking PNR")}
                      </span>
                      
                      <div className="flex items-center justify-center gap-3">
                        <span className="font-mono text-xl md:text-2xl font-extrabold tracking-wider text-emerald-400">
                          {submittedData.pnr}
                        </span>
                        <button
                          onClick={copyToClipboard}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-[#C9A84C] cursor-pointer transition-all focus:outline-none"
                          title="Copy PNR Code"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>

                      {copied && (
                        <span className="text-[10px] font-bold text-[#C9A84C] animate-fade-in block">
                          ✓ {t("ক্লিপবোর্ডে কপি করা হয়েছে!", "Copied to clipboard!")}
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] md:text-xs text-slate-400 max-w-sm mx-auto">
                      ℹ️ {t("এই PNR নাম্বারটি দিয়ে আপনি হোমপেজের 'স্ট্যাটাস চেক' ট্যাব থেকে যেকোনো সময় আপনার আবেদনের লাইভ স্ট্যাটাস দেখতে পারবেন।", "Use this PNR code in our 'Status Check' tool to monitor your callback status live.")}
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={handleReset}
                        className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-[#C9A84C] text-xs font-bold transition-all cursor-pointer focus:outline-none"
                        id="qc-btn-reset"
                      >
                        {t("নতুন আরেকটি আবেদন করুন", "Submit Another Inquiry")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
