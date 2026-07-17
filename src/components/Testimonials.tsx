import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Star, Quote, ShieldCheck, HeartHandshake, MapPin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface Testimonial {
  id: number;
  name: { bn: string; en: string };
  role: { bn: string; en: string };
  location: { bn: string; en: string };
  rating: number;
  image: string;
  feedback: { bn: string; en: string };
  packageType: { bn: string; en: string };
}

export default function Testimonials() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: { bn: "আলহাজ্ব মোহাম্মদ আবদুর রহমান", en: "Alhaj Mohammad Abdur Rahman" },
      role: { bn: "অবসরপ্রাপ্ত সরকারি কর্মকর্তা", en: "Retired Government Official" },
      location: { bn: "উত্তরা, ঢাকা", en: "Uttara, Dhaka" },
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&fit=crop",
      feedback: {
        bn: "বিগত রমজানে ওমরাহ করার জন্য এদের সার্ভিস গ্রহণ করেছিলাম। হোটেলের দূরত্ব হারাম শরীফ থেকে মাত্র ৩ মিনিটের হাঁটা পথ ছিল। খাবার অত্যন্ত সুস্বাদু এবং ঘরোয়া বাঙালি স্বাদের ছিল। গাইড বা মুয়াল্লিমের ব্যবহার ছিল অসাধারণ। ওমরাহ প্যাকেজের প্রতিটি প্রতিশ্রুতি তারা রক্ষা করেছেন। আলহামদুলিল্লাহ!",
        en: "I took their service for Umrah last Ramadan. The hotel was only a 3-minute walk from Haram Sharif. The food was very delicious with a homely Bengali taste. The guide's behavior was exceptional. They fulfilled every single promise of the Umrah package. Alhamdulillah!"
      },
      packageType: { bn: "রমজান ওমরাহ প্রিমিয়াম প্যাকেজ", en: "Ramadan Premium Umrah" }
    },
    {
      id: 2,
      name: { bn: "ড. ফাতেমা জোহরা", en: "Dr. Fatema Zohra" },
      role: { bn: "সহকারী অধ্যাপক, ইডেন কলেজ", en: "Assistant Professor, Eden College" },
      location: { bn: "ধানমন্ডি, ঢাকা", en: "Dhanmondi, Dhaka" },
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&h=300&fit=crop",
      feedback: {
        bn: "মহিলাদের জন্য আলাদা গাইডেন্স ও নিরাপত্তা নিশ্চিত করায় আমি একা ওমরাহ করতে গিয়েও কোনো অসুবিধায় পড়িনি। জেদ্দা এয়ারপোর্ট থেকে শুরু করে মক্কা ও মদিনার হোটেলগুলোতে আমাদের সার্বক্ষণিক যত্ন নেওয়া হয়েছিল। আমি অত্যন্ত সন্তুষ্ট এবং পরবর্তীতে হজ্জের জন্যও তাদের মাধ্যমেই যাব ইনশাআল্লাহ।",
        en: "With dedicated female guidance and security, I felt completely safe traveling alone for Umrah. From Jeddah airport to the hotels in Makkah and Madinah, we were taken care of at every step. I am highly satisfied and will surely book with them for Hajj next time, InshaAllah."
      },
      packageType: { bn: "মহিলা স্পেশাল ওমরাহ গ্রুপ", en: "Ladies Special Umrah Group" }
    },
    {
      id: 3,
      name: { bn: "জনাব ইঞ্জিঃ মোস্তফা কামাল", en: "Engr. Mostafa Kamal" },
      role: { bn: "ব্যবস্থাপনা পরিচালক, ক্রিয়েটিভ সফট", en: "Managing Director, Creative Soft" },
      location: { bn: "হালিশহর, চট্টগ্রাম", en: "Halishahar, Chittagong" },
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&h=300&fit=crop",
      feedback: {
        bn: "বাবা-মাকে ওমরাহ করানোর জন্য প্রিমিয়াম ডাবল শেয়ারিং প্যাকেজটি নিয়েছিলাম। তারা বয়স্ক হওয়ায় আমার অনেক দুশ্চিন্তা ছিল। কিন্তু এদের হুইলচেয়ার অ্যাসিস্ট্যান্স ও মক্কা-মদিনা যাতায়াতের ভিআইপি এসি বাস সার্ভিসের কারণে বাবা-মা খুবই স্বাচ্ছন্দ্যে পুরো সফর সম্পন্ন করেছেন। আন্তরিক ধন্যবাদ পুরো টিমকে!",
        en: "I booked the Premium Double Sharing Package for my parents' Umrah. I was worried since they are elderly. But thanks to their outstanding wheelchair assistance and VIP AC bus service, my parents completed their entire journey comfortably. Sincere thanks to the whole team!"
      },
      packageType: { bn: "প্যারেন্টস ভিআইপি ওমরাহ প্যাকেজ", en: "Parents VIP Umrah Package" }
    },
    {
      id: 4,
      name: { bn: "মাওলানা আবদুল্লাহ আল-মামুন", en: "Maulana Abdullah Al-Mamun" },
      role: { bn: "খতিব ও ধর্মীয় গবেষক", en: "Khatib & Islamic Researcher" },
      location: { bn: "সিলেট সদর", en: "Sylhet Sadar" },
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&h=300&fit=crop",
      feedback: {
        bn: "তাদের হজ্জ ও ওমরাহ গাইডের সঠিক ধর্মীয় জ্ঞান এবং আন্তরিকতা অত্যন্ত প্রশংসনীয়। প্রতিটি হজ্জের নিয়ম ও রুকনসমূহ নিখুঁতভাবে আদায়ের জন্য আমাদের অভিজ্ঞ মুয়াল্লিম সাহেব সার্বক্ষণিক দিকনির্দেশনা দিয়েছেন। ধর্মীয় আবেগ বজায় রেখে আরামদায়ক সফরের জন্য এটি সেরা মাধ্যম।",
        en: "Their guide's sound Islamic knowledge and sincerity are highly commendable. Our expert Muallim provided constant guidance to ensure every ritual of Hajj and Umrah was performed perfectly. This is the best platform for a comfortable and spiritually fulfilling journey."
      },
      packageType: { bn: "ভিআইপি হজ্জ প্যাকেজ ২০২৬", en: "VIP Hajj Package 2026" }
    }
  ];

  // Auto-play feature
  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoplay]);

  const handlePrev = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden border-t border-slate-200/60" id="testimonials-section">
      {/* Visual Accents - Emerald Gold Theme */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A84C]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Top Arch Border Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-12 space-y-3" id="testimonials-header">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-[#C9A84C]/35 bg-amber-50 text-amber-800 text-xs font-bold shadow-sm">
            <HeartHandshake className="w-4 h-4 text-[#C9A84C]" />
            <span>{language === "bn" ? "হজ্জ ও ওমরাহ হাজীদের অভিজ্ঞতা" : "Pilgrims' Testimonials"}</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight" id="testimonials-title">
            {language === "bn" ? (
              <>
                আমাদের হাজীদের <span className="text-emerald-700">সত্যিকারের প্রতিক্রিয়া</span>
              </>
            ) : (
              <>
                What Our <span className="text-emerald-700">Pilgrims Say</span> About Us
              </>
            )}
          </h2>
          
          <p className="text-xs md:text-sm text-slate-600 max-w-xl mx-auto">
            {language === "bn" 
              ? "পবিত্র মক্কা ও মদিনা শরিফে আমাদের উন্নত সেবা নিয়ে সম্মানিত হাজীদের মূল্যবান মতামত যা আমাদের পথচলার সবচেয়ে বড় শক্তি।"
              : "Valuable feedback from our respected pilgrims regarding their premium comfort and spiritual journey in Makkah & Madinah."}
          </p>
        </div>

        {/* Carousel Slider Panel */}
        <div className="relative max-w-4xl mx-auto" id="testimonials-carousel-wrapper">
          <div className="overflow-hidden min-h-[320px] md:min-h-[260px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full bg-white border border-slate-150 rounded-3xl p-6 md:p-10 shadow-lg shadow-emerald-950/5 relative flex flex-col md:flex-row gap-6 md:gap-8 items-center"
              >
                {/* Decorative Giant Quote Icon in background */}
                <div className="absolute top-4 right-6 text-slate-100 pointer-events-none">
                  <Quote className="w-20 h-20 rotate-180" />
                </div>

                {/* Left: Avatar with golden ring & country badge */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#C9A84C] shadow-md relative z-10">
                    <img 
                      src={testimonials[currentIndex].image} 
                      alt={testimonials[currentIndex].name[language]} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Decorative Islamic Star Pattern back outline */}
                  <div className="absolute -inset-2 rounded-full border border-dashed border-emerald-500/20 animate-spin-slow pointer-events-none" />
                </div>

                {/* Right: Feedback content */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                  {/* Stars */}
                  <div className="flex items-center justify-center md:justify-start gap-1">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C9A84C] text-[#C9A84C]" />
                    ))}
                  </div>

                  {/* Testimonial Quote Text */}
                  <p className="text-slate-700 italic text-sm md:text-base leading-relaxed font-medium">
                    "{testimonials[currentIndex].feedback[language]}"
                  </p>

                  {/* Author Details with Premium Package Tag */}
                  <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-slate-100">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 tracking-tight">
                        {testimonials[currentIndex].name[language]}
                      </h4>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 text-xs text-slate-500 font-medium">
                        <span>{testimonials[currentIndex].role[language]}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#C9A84C]" />
                          {testimonials[currentIndex].location[language]}
                        </span>
                      </div>
                    </div>

                    {/* Service Package Badge */}
                    <span className="inline-flex self-center md:self-end px-3 py-1 rounded-xl bg-emerald-550 bg-emerald-50 text-emerald-800 border border-emerald-500/20 text-xs font-bold tracking-tight">
                      🕋 {testimonials[currentIndex].packageType[language]}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Left/Right Carousel Controls */}
          <div className="flex justify-center md:justify-between items-center mt-6 md:absolute md:-inset-x-6 md:top-1/2 md:-translate-y-1/2 md:mt-0 gap-4 pointer-events-none z-20">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-[#C9A84C] hover:text-[#C9A84C] shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer pointer-events-auto hover:scale-105 active:scale-95 focus:outline-none"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-[#C9A84C] hover:text-[#C9A84C] shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer pointer-events-auto hover:scale-105 active:scale-95 focus:outline-none"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Indicators dots */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setAutoplay(false);
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? "w-6 bg-[#C9A84C]" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* trust badging below carousel */}
        <div className="mt-12 text-center" id="testimonials-badge-wrapper">
          <div className="inline-flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500 bg-white shadow-sm border border-slate-200/60 rounded-2xl py-3.5 px-6">
            <span className="font-bold text-slate-700">{language === "bn" ? "নিরাপদ ও নির্ভরযোগ্য হজ্ব সেবার বিশ্বস্ত অংশীদার" : "Your Trusted Partner for Safe & Divine Pilgrimage"}</span>
            <div className="hidden sm:block text-slate-200">|</div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === "bn" ? "১০০% কাস্টমার সন্তুষ্টি" : "100% Verified Customer Reviews"}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
