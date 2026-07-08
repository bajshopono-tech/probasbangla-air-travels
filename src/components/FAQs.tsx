import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronDown, Award, ShieldCheck, HeartHandshake } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface FAQItem {
  question: { bn: string; en: string };
  answer: { bn: string; en: string };
}

export default function FAQs() {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqList: FAQItem[] = [
    {
      question: {
        bn: "কীভাবে আমি আমার টিকিট বা আবেদনের স্ট্যাটাস ট্র্যাক করব?",
        en: "How do I track my ticket or application status?"
      },
      answer: {
        bn: "হোমপেজের 'স্ট্যাটাস চেক' ট্যাবে গিয়ে আপনার ট্র্যাকিং নম্বর (PNR) অথবা পাসপোর্ট নম্বর দিয়ে মুহূর্তেই আবেদনের সর্বশেষ অবস্থা দেখতে পারবেন। এছাড়াও প্রতিটি আবেদনের পর একটি ইউনিক ট্র্যাকিং লিংক পাঠানো হয়।",
        en: "Go to the 'Status Check' tab on our homepage, enter your Tracking Number (PNR) or Passport number to instantly see the latest status. A unique tracking link is also provided upon application."
      }
    },
    {
      question: {
        bn: "টিকেট বুকিং বা আবেদন করার পর টিকিট কতক্ষণে পাওয়া যাবে?",
        en: "How long does it take to receive the ticket after booking?"
      },
      answer: {
        bn: "বুকিং কনফার্ম হওয়ার পর আমাদের টিম ১৫ থেকে ৩০ মিনিটের মধ্যে আপনার সাথে যোগাযোগ করবে। পেমেন্ট সম্পন্ন হওয়ার পর সর্বোচ্চ ১ ঘণ্টার মধ্যে আপনার ইমেইল ও হোয়াটসঅ্যাপ নম্বরে অফিশিয়াল ই-টিকিট পাঠিয়ে দেওয়া হবে।",
        en: "Once booking is confirmed, our team will contact you within 15 to 30 minutes. Upon payment confirmation, the official e-ticket will be sent to your email and WhatsApp within 1 hour."
      }
    },
    {
      question: {
        bn: "ওমরাহ প্যাকেজের সাথে কী কী সুবিধা দেওয়া হয়?",
        en: "What facilities are included in the Umrah packages?"
      },
      answer: {
        bn: "আমাদের ওমরাহ প্যাকেজে ট্রিপল/কোয়াড হোটেল শেয়ারিং সুবিধা, সরাসরি ফ্লাইট টিকিট, ওমরাহ ভিসা ও ইন্সুরেন্স, অভিজ্ঞ মুয়াল্লিম বা গাইড, হারামাইনে যাতায়াতের জন্য এসি বাস এবং তিনবেলা সুস্বাদু বাঙালি খাবারের ব্যবস্থা থাকে।",
        en: "Our Umrah packages include Triple/Quad hotel sharing, direct flight tickets, Umrah visa & insurance, expert guide support, AC transportation within Haramain, and daily delicious Bengali meals."
      }
    },
    {
      question: {
        bn: "বিএমইটি (BMET) স্মার্টকার্ড ও ইমিগ্রেশন ক্লিয়ারেন্স পেতে কতদিন লাগে?",
        en: "How long does it take to get BMET Smartcard & Immigration Clearance?"
      },
      answer: {
        bn: "সাধারণ সরকারি ফি এবং প্রয়োজনীয় নথিপত্র (ভিসা, আকামা, পাসপোর্ট কপি) সঠিক থাকলে ৩ থেকে ৫ কর্মদিবসের মধ্যে বিএমইটি ক্লিয়ারেন্স ও ডিজিটাল স্মার্টকার্ড প্রস্তুত হয়ে যায়।",
        en: "If all documents (Visa, Iqama, Passport) are valid and fees are processed, the BMET clearance and digital smartcard are issued within 3 to 5 business days."
      }
    },
    {
      question: {
        bn: "ভিসা প্রসেসিং-এর জন্য কী কী কাগজপত্র জমা দিতে হবে?",
        en: "What documents are required for visa processing?"
      },
      answer: {
        bn: "সাধারণত ন্যূনতম ৬ মাসের মেয়াদসহ মূল পাসপোর্ট, ২ কপি সাদা ব্যাকগ্রাউন্ডের ছবি, এবং দেশভেদে আকামা কপি বা স্পন্সর লেটার প্রয়োজন হয়। আমাদের টিম যেকোনো অতিরিক্ত কাগজপত্রের জন্য আপনাকে গাইড করবে।",
        en: "Generally, an original passport with at least 6 months validity, 2 copies of white-background photos, and depending on the country, an Iqama or Sponsor Letter is required. Our team will guide you if any other documents are needed."
      }
    },
    {
      question: {
        bn: "পাসপোর্ট বা এনআইডি সংশোধনে আপনারা কীভাবে সাহায্য করেন?",
        en: "How do you assist with Passport or NID correction?"
      },
      answer: {
        bn: "আমরা আপনার জমা দেওয়া ডকুমেন্ট পর্যালোচনা করে ভুলগুলো চিহ্নিত করি এবং সরকারি নিয়ম মেনে সঠিক আবেদন ফরম পূরণ, পেমেন্ট স্লিপ এবং এম্বাসি সত্যায়ন কার্যক্রমে অভিজ্ঞ কনসালটেন্ট দ্বারা ওয়ান-স্টপ সাপোর্ট প্রদান করি।",
        en: "We review your submitted documents to identify errors, fill out correct government forms, process fee payments, and provide one-stop expert assistance for embassy attestations and updates."
      }
    }
  ];

  const toggleIndex = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full py-16 bg-slate-50 relative overflow-hidden" id="faq-section-wrapper">
      {/* Decorative Arabic geometric accents or glow circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#C9A84C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-12 space-y-3" id="faq-header-block">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-50/70 text-emerald-700 text-xs font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{language === "bn" ? "জিজ্ঞাসিত প্রশ্ন ও উত্তর" : "Frequently Asked Questions"}</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight" id="faq-title">
            {language === "bn" ? (
              <>
                প্রবাসী ভাইদের <span className="text-[#C9A84C]">সাধারণ জিজ্ঞাসাসমূহ</span>
              </>
            ) : (
              <>
                Common <span className="text-[#C9A84C]">Travel Questions</span> & Answers
              </>
            )}
          </h2>
          
          <p className="text-xs md:text-sm text-slate-600 max-w-xl mx-auto">
            {language === "bn" 
              ? "এয়ার টিকিট বুকিং, ভিসা প্রসেসিং, ওমরাহ এবং অন্যান্য অনলাইন নাগরিক সেবা সম্পর্কিত আপনার মনে থাকা যাবতীয় প্রশ্নের উত্তর এখানে পাবেন।"
              : "Find answers to all your questions regarding flight bookings, visa processing, Umrah services, and other online expatriate support."}
          </p>
        </div>

        {/* FAQs Accordion Container */}
        <div className="space-y-4" id="faq-accordion-container">
          {faqList.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? "border-[#C9A84C] bg-white shadow-md shadow-emerald-500/5" 
                    : "border-slate-200/80 bg-white hover:border-[#C9A84C]/50 hover:shadow-sm"
                }`}
                id={`faq-item-card-${index}`}
              >
                {/* Header/Question Trigger Button */}
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full px-5 py-4 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  id={`faq-btn-trigger-${index}`}
                  aria-expanded={isOpen}
                >
                  <div className="flex gap-3">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-lg bg-emerald-50 border border-emerald-500/20 flex items-center justify-center text-emerald-700 font-bold text-[10px]">
                      {index + 1}
                    </span>
                    <span className={`font-bold text-sm md:text-base tracking-tight transition-colors duration-200 ${
                      isOpen ? "text-[#C9A84C]" : "text-slate-800 hover:text-slate-900"
                    }`}>
                      {language === "bn" ? item.question.bn : item.question.en}
                    </span>
                  </div>
                  <span className={`mt-1 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#C9A84C]" : "text-slate-500"}`}>
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </button>

                {/* Answer Collapsible Section */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-slate-700 leading-relaxed border-t border-slate-100 flex gap-3">
                        <div className="flex-shrink-0 w-5 flex justify-center">
                          <HelpCircle className="w-4 h-4 text-[#C9A84C] mt-0.5" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium text-slate-700">
                            {language === "bn" ? item.answer.bn : item.answer.en}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                            <HeartHandshake className="w-3.5 h-3.5" />
                            <span>
                              {language === "bn" 
                                ? "কোনো প্রশ্ন থাকলে সরাসরি আমাদের হটলাইনে যোগাযোগ করতে পারেন।" 
                                : "Got questions? Feel free to contact our direct helpline."}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Trust Badge Footer below Accordion */}
        <div className="mt-12 text-center" id="faq-footer-block">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl py-3 px-6">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#C9A84C]" />
              <span className="font-semibold text-slate-800">
                {language === "bn" ? "ধর্ম মন্ত্রণালয় অনুমোদিত ওমরাহ এজেন্সি" : "Govt Approved Ministry Agency"}
              </span>
            </div>
            <div className="hidden sm:block text-slate-300">|</div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-800">
                {language === "bn" ? "১০০% বিশ্বস্ত ও নিরাপদ সেবা" : "100% Trusted & Secure Service"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
