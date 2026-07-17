import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import ArabicPageShell from "./arabic/ArabicPageShell";
import { 
  Plane, 
  ShieldCheck, 
  Clock, 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  PhoneCall, 
  Award, 
  ArrowRight,
  FileText,
  Search,
  CheckCircle2,
  ChevronDown,
  Settings,
  PlusCircle,
  Briefcase,
  DollarSign,
  AlertTriangle,
  FileSpreadsheet,
  X,
  CreditCard,
  UserPlus,
  RefreshCw,
  TrendingUp,
  UserCheck,
  CheckCircle,
  Bot,
  Upload,
  AlertCircle
} from "lucide-react";
import { GOLD, CornerOrnaments, ArabicDivider } from "./arabic/ArabicDecor";
import { getGlobalConfig, getDestinations } from "../utils/dynamicData";
import AIChatbot from "./AIChatbot";
import { useLanguage } from "../context/LanguageContext";
import ServiceVideoAdPlayer from "./ServiceVideoAdPlayer";
import FAQs from "./FAQs";
import Testimonials from "./Testimonials";
import QuickContact from "./QuickContact";

// Icons specifically for the 17 services
import { 
  CheckSquare, 
  CalendarRange, 
  FileEdit, 
  UserPlus2, 
  Globe2, 
  Luggage, 
  Map, 
  Users2, 
  Milestone, 
  GraduationCap, 
  Download, 
  Wallet, 
  LayoutDashboard,
  Tv
} from "lucide-react";

interface VisaCircular {
  id: string;
  country: string;
  flag: string;
  title: string;
  role: string;
  salary: string;
  vaccancies: string;
  docs: string;
  date: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [globalConfig, setGlobalConfig] = useState(getGlobalConfig());
  const [destinations, setDestinations] = useState(getDestinations());
  const { language } = useLanguage();
  const homeT = (bn: string, en: string) => (language === "bn" ? bn : en);

  // Visa Circulars State
  const [circulars, setCirculars] = useState<VisaCircular[]>([
    {
      id: "circ-1",
      country: "Saudi Arabia",
      flag: "🇸🇦",
      title: "ফ্রি ভিসা নিয়োগ (সৌদি আরব)",
      role: "কনস্ট্রাকশন লেবার",
      salary: "৳ ৪২,০০০ - ৫০,০০০ + ওভারটাইম",
      vaccancies: "২৫ জন",
      docs: "মূল পাসপোর্ট (৬ মাস মেয়াদ), মেডিকেল ফিট সার্টিফিকেট, ৪ কপি ছবি",
      date: "2026-07-01",
    },
    {
      id: "circ-2",
      country: "UAE",
      flag: "🇦🇪",
      title: "দুবাই প্রফেশনাল ড্রাইভার",
      role: "লাইট ড্রাইভার (লাইসেন্সধারী)",
      salary: "৳ ৫৫,০০০ - ৭০,০০০ + টিপস",
      vaccancies: "১২ জন",
      docs: "দুবাই ভ্যালিড ড্রাইভিং লাইসেন্স কপি, পাসপোর্ট, পুলিশ ক্লিয়ারেন্স",
      date: "2026-07-03",
    }
  ]);

  // Loading circulars from Express API or fallback
  useEffect(() => {
    fetch("/api/circulars")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then(data => setCirculars(data))
      .catch(() => {
        // use fallback if backend is slow
      });
  }, []);

  // Hot Reload triggers
  useEffect(() => {
    setGlobalConfig(getGlobalConfig());
    setDestinations(getDestinations());
  }, []);

  // UI Modal States
  const [showAddCircularModal, setShowAddCircularModal] = useState(false);
  const [showRetailerPortalModal, setShowRetailerPortalModal] = useState(false);
  const [activeServiceModal, setActiveServiceModal] = useState<string | null>(null);
  const [activeVideoAdService, setActiveVideoAdService] = useState<string | null>(null);

  // Success Notification banner
  const [successMsg, setSuccessMsg] = useState("");

  // Hero Background Slideshow State for Iconic Travel Backdrops (Plane, Dubai, Saudi, USA)
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const heroBackgrounds = [
    {
      url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600",
      titleBn: "বিমান ভ্রমণ",
      titleEn: "Air Travel",
      pos: "center 30%"
    },
    {
      url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600",
      titleBn: "দুবাই সিটি স্কাইলাইন",
      titleEn: "Dubai Skyline",
      pos: "center center"
    },
    {
      url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600",
      titleBn: "সৌদি আরব মক্কা টাওয়ার",
      titleEn: "Saudi Arabia (Makkah)",
      pos: "center 40%"
    },
    {
      url: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=1600",
      titleBn: "আমেরিকা নিউ ইয়র্ক সিটি",
      titleEn: "USA Skyline",
      pos: "center center"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // 17-Service Specific Interactive Modal Form States
  const [serviceFormName, setServiceFormName] = useState("");
  const [serviceFormPhone, setServiceFormPhone] = useState("");
  const [serviceFormPassport, setServiceFormPassport] = useState("");
  const [serviceFormExtra, setServiceFormExtra] = useState("");
  const [serviceFormNumberInput, setServiceFormNumberInput] = useState<number>(0);
  const [serviceFormSelect, setServiceFormSelect] = useState("");
  const [serviceFormFile, setServiceFormFile] = useState<File | null>(null);
  const serviceFileRef = useRef<HTMLInputElement>(null);

  // States for services search & filtering
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState("ALL");

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 7000);
  };

  // B2B Retailer States
  const [retailerBalance, setRetailerBalance] = useState(() => {
    const saved = localStorage.getItem("probas_retailer_balance");
    return saved ? parseInt(saved, 10) : 25500;
  });

  const [retailerUsername, setRetailerUsername] = useState("");
  const [retailerPassword, setRetailerPassword] = useState("");
  const [isRetailerLoggedIn, setIsRetailerLoggedIn] = useState(() => {
    return sessionStorage.getItem("probas_retailer_auth") === "true";
  });

  const handleRetailerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (retailerUsername && retailerPassword) {
      setIsRetailerLoggedIn(true);
      sessionStorage.setItem("probas_retailer_auth", "true");
      triggerSuccess("সাফল্যের সাথে রিটেইলার পোর্টালে লগইন করা হয়েছে!");
    }
  };

  const handleRetailerLogout = () => {
    setIsRetailerLoggedIn(false);
    sessionStorage.removeItem("probas_retailer_auth");
    triggerSuccess("রিটেইলার পোর্টাল থেকে লগআউট করা হয়েছে।");
  };

  // Add Visa Circular form state
  const [newCircCountry, setNewCircCountry] = useState("Saudi Arabia");
  const [newCircTitle, setNewCircTitle] = useState("");
  const [newCircRole, setNewCircRole] = useState("");
  const [newCircSalary, setNewCircSalary] = useState("");
  const [newCircVaccancies, setNewCircVaccancies] = useState("");
  const [newCircDocs, setNewCircDocs] = useState("");

  const handleAddCircular = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircTitle || !newCircRole) return;

    const flagMap: Record<string, string> = {
      "Saudi Arabia": "🇸🇦",
      "UAE": "🇦🇪",
      "Qatar": "🇶🇦",
      "Oman": "🇴🇲",
      "Malaysia": "🇲🇾",
      "Kuwait": "🇰🇼"
    };

    const payload = {
      country: newCircCountry,
      flag: flagMap[newCircCountry] || "✈️",
      title: newCircTitle,
      role: newCircRole,
      salary: newCircSalary || "আলোচনা সাপেক্ষে",
      vaccancies: newCircVaccancies || "১০ জন",
      docs: newCircDocs || "মূল পাসপোর্ট, মেডিকেল রিপোর্ট এবং প্রয়োজনীয় ছবি।"
    };

    try {
      const res = await fetch("/api/circulars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setCirculars(prev => [data, ...prev]);
        triggerSuccess("নতুন ভিসা সার্কুলারটি সাফল্যের সাথে যোগ করা হয়েছে!");
      } else {
        const localNew = {
          id: "circ-" + Math.floor(Math.random() * 100000),
          ...payload,
          date: new Date().toISOString().split('T')[0]
        };
        setCirculars(prev => [localNew, ...prev]);
        triggerSuccess("নতুন ভিসা সার্কুলারটি সাফল্যের সাথে যোগ করা হয়েছে!");
      }
    } catch (err) {
      const localNew = {
        id: "circ-" + Math.floor(Math.random() * 100000),
        ...payload,
        date: new Date().toISOString().split('T')[0]
      };
      setCirculars(prev => [localNew, ...prev]);
      triggerSuccess("নতুন ভিসা সার্কুলারটি সাফল্যের সাথে যোগ করা হয়েছে!");
    }

    setShowAddCircularModal(false);
    setNewCircTitle("");
    setNewCircRole("");
  };

  // General handler to submit a custom service booking to the global tracker
  const handleServiceSubmit = (serviceName: string, customDetails: string) => {
    if (!serviceFormName || !serviceFormPhone) {
      alert("দয়া করে নাম এবং সচল মোবাইল নম্বর প্রদান করুন।");
      return;
    }

    if (serviceName !== "রিটেইলার ব্যালেন্স" && !serviceFormFile) {
      alert("দয়া করে প্রয়োজনীয় ছবি বা ডকুমেন্টটি (যেমনঃ পাসপোর্ট, টিকিট বা এনআইডি) আপলোড করুন।");
      return;
    }

    const saveBooking = (fileData: string | null = null, fileName: string = "") => {
      const newBooking = {
        pnr: "PB" + Math.floor(100000 + Math.random() * 900000),
        passenger: serviceFormName,
        phone: serviceFormPhone,
        type: serviceName,
        status: "প্রক্রিয়াধীন",
        timelineStep: 1,
        date: new Date().toISOString().split('T')[0],
        details: customDetails || `${serviceName} এর জন্য তাৎক্ষণিক ওয়ান-স্টপ কাস্টমার রিকোয়েস্ট প্রসেস`,
        fileData: fileData,
        fileName: fileName,
        updates: [
          {
            title: "আবেদন গৃহিত হয়েছে",
            desc: `${serviceName} এর জন্য আবেদনপত্র ও প্রয়োজনীয় কাগজপত্র আমাদের অনলাইন পোর্টালে জমা করা হয়েছে।`,
            time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toISOString().split('T')[0],
            step: 1
          }
        ]
      };

      const stored = JSON.parse(localStorage.getItem("probas_bookings") || "[]");
      stored.unshift(newBooking);
      localStorage.setItem("probas_bookings", JSON.stringify(stored));

      triggerSuccess(`অভিনন্দন! আপনার ${serviceName} আবেদনটি সফলভাবে জমা হয়েছে। ট্র্যাক করার জন্য আপনার সিকিউর PNR নাম্বারটি লিখে রাখুন: ${newBooking.pnr}`);
      
      // Clear form
      setServiceFormName("");
      setServiceFormPhone("");
      setServiceFormFile(null);
      setServiceFormExtra("");
      setActiveServiceModal(null);
    };

    if (serviceFormFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        saveBooking(fileReader.result as string, serviceFormFile.name);
      };
      fileReader.readAsDataURL(serviceFormFile);
    } else {
      saveBooking(null, "");
    }
  };

  // 17 Services definition list with icons, color coding and metadata
  const CORE_SERVICES = [
    { id: "s1", category: "TICKET", name: homeT("এয়ার টিকিট চেক", "Air Ticket Check"), desc: homeT("PNR স্ট্যাটাস ও ফ্লাইটের সত্যতা যাচাই করুন", "Verify PNR status and ticket authenticity"), icon: CheckSquare, color: "text-[#C9A84C] bg-[#C9A84C]/10 border-[#C9A84C]/20" },
    { id: "s2", category: "TICKET", name: homeT("তারিখ পরিবর্তন", "Change Travel Date"), desc: homeT("যেকোনো বুক করা টিকিটের ভ্রমণের তারিখ পরিবর্তন করুন", "Change flight dates for any booked air ticket"), icon: CalendarRange, color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
    { id: "s3", category: "TICKET", name: homeT("নতুন টিকিট বুকিং", "New Ticket Booking"), desc: homeT("কমদামে নতুন ওয়ান-вей বা রিটার্ন টিকিট বুকিং", "Book low fare new one-way or return flight tickets"), icon: FileEdit, color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    { id: "s4", category: "CITIZEN", name: homeT("পাসপোর্ট আবেদন", "Passport Application"), desc: homeT("নতুন পাসপোর্ট বা রি-ইস্যু সংশোধনের অনলাইন সার্ভিস", "New passport or re-issue correction online assistance"), icon: UserPlus2, color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
    { id: "s5", category: "CITIZEN", name: homeT("NID আবেদন", "NID Application"), desc: homeT("জাতীয় পরিচয়পত্র সংশোধন বা নতুন ভোটার অনলাইন হেল্প", "NID correction, loss replacement or new registration support"), icon: Milestone, color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
    { id: "s6", category: "CITIZEN", name: homeT("জন্ম নিবন্ধন", "Birth Registration"), desc: homeT("নতুন জন্ম সনদ এবং অনলাইন তথ্যের সংশোধন", "New birth certificates and online information corrections"), icon: FileText, color: "text-teal-400 bg-teal-400/10 border-teal-400/20" },
    { id: "s7", category: "VISA", name: homeT("ভিসা চেক", "Visa Authenticity Check"), desc: homeT("সৌদি আরব, দুবাই বা ওমানের ভিসা সঠিক আছে কিনা দেখুন", "Check if visas for Saudi Arabia, Dubai, or Oman are valid"), icon: Globe2, color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" },
    { id: "s8", category: "VISA", name: homeT("ভিসা রেজিস্ট্রেশন", "Visa Registration"), desc: homeT("সরকারি নিয়ম মেনে নতুন স্ট্যাম্পিং বা প্রসেস রেজিস্ট্রেশন", "Stamping, paper verification, and fingerprint booking"), icon: CheckCircle2, color: "text-lime-400 bg-lime-400/10 border-lime-400/20" },
    { id: "s9", category: "TICKET", name: homeT("হজ্জ ও ওমরাহ", "Hajj & Umrah"), desc: homeT("সেরা মূল্যে ও অভিজ্ঞ গাইডসহ হজ্জ ও ওমরাহ ২০২৬ প্যাকেজ", "Hajj & Umrah 2026 packages with guides at best price"), icon: Compass, color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
    { id: "s10", category: "VISA", name: homeT("ভিজিট ভিসা", "Visit Visa Processing"), desc: homeT("দুবাই, কাতার ও সৌদি ট্যুরিস্ট ভিসার ওয়ান-স্টপ প্রসেসিং", "One-stop tourist visa processing for UAE, Qatar & KSA"), icon: Luggage, color: "text-sky-400 bg-sky-400/10 border-sky-400/20" },
    { id: "s11", category: "VISA", name: homeT("ফ্যামিলি ভিসা", "Family Visa"), desc: homeT("পরিবারকে বিদেশে নিয়ে যাওয়ার ফ্যামিলি ভিজিট ভিসা প্রসেস", "Bring family members abroad with our family visa service"), icon: Users2, color: "text-pink-400 bg-pink-400/10 border-pink-400/20" },
    { id: "s12", category: "VISA", name: homeT("জিয়ারা ভিসা", "Ziyarah Visa"), desc: homeT("সৌদি আরবের জিয়ারা ও ধর্মীয় স্থান পরিদর্শনের স্পেশাল ভিসা", "Special visas for Ziyarah & holy site tours in Saudi"), icon: Map, color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
    { id: "s13", category: "CITIZEN", name: homeT("BMET আবেদন", "BMET Smartcard"), desc: homeT("विदेशগামী কর্মীদের তাৎক্ষণিক স্মার্টকার্ড ও ফি প্রদান", "Instant BMET registration and smartcard fee payment"), icon: ShieldCheck, color: "text-sky-500 bg-emerald-500/10 border-slate-100" },
    { id: "s14", category: "CITIZEN", name: homeT("৩ দিনের ট্রেনিং", "3-Day PDO Training"), desc: homeT("স্মার্টকার্ড পাওয়ার জন্য ৩ দিনের PDO ট্রেনিং সেন্টার বুকিং", "3-day Pre-Departure Orientation (PDO) training center booking"), icon: GraduationCap, color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
    { id: "s15", category: "AGENT", name: homeT("ডিপোজিট", "B2B Wallet Deposit"), desc: homeT("B2B এজেন্টদের রিটেইলার ব্যালেন্সে ফান্ড অ্যাড করার সুবিধা", "Deposit funds to your B2B wallet instantly"), icon: Wallet, color: "text-rose-400 bg-rose-400/10 border-rose-400/20" },
    { id: "s16", category: "AGENT", name: homeT("রিটেইলার ব্যালেন্স", "Retailer Balance"), desc: homeT("আপনার B2B ওয়ালেট ব্যালেন্স চেক ও ফান্ড রিপোর্ট", "Check B2B wallet balance and transaction reports"), icon: Download, color: "text-violet-400 bg-violet-400/10 border-violet-400/20" },
    { id: "s17", category: "AGENT", name: homeT("রিটেইলার ড্যাশবোর্ড", "Retailer Dashboard"), desc: homeT("এজেন্টদের সেলস, কাস্টমার বুকিং ও কমিশন সামারি", "Agent dashboard for sales, customer bookings, and commissions"), icon: LayoutDashboard, color: "text-[#C9A84C] bg-[#C9A84C]/10 border-[#C9A84C]/25" }
  ];

  // Live air tickets sample price listings
  const LIVE_TICKET_PRICES = [
    { from: homeT("ঢাকা (DAC)", "Dhaka (DAC)"), to: homeT("জেদ্দা (JED)", "Jeddah (JED)"), airline: homeT("সাউদিয়া এয়ারলাইন্স", "Saudia Airlines"), price: homeT("৳ ৪৪,৫০০", "৳ 44,500"), seats: homeT("৩টি সিট খালি", "3 Seats Left"), type: homeT("ওয়ান-ওয়ে", "One-Way") },
    { from: homeT("ঢাকা (DAC)", "Dhaka (DAC)"), to: homeT("রিয়াদ (RUH)", "Riyadh (RUH)"), airline: homeT("বিমান বাংলাদেশ", "Biman Bangladesh"), price: homeT("৳ ৪২,০০০", "৳ 42,000"), seats: homeT("৫টি সিট খালি", "5 Seats Left"), type: homeT("ওয়ান-ওয়ে", "One-Way") },
    { from: homeT("ঢাকা (DAC)", "Dhaka (DAC)"), to: homeT("দুবাই (DXB)", "Dubai (DXB)"), airline: homeT("ফ্লাইদুবাই", "FlyDubai"), price: homeT("৳ ৩৮,০০০", "৳ 38,000"), seats: homeT("২টি সিট খালি", "2 Seats Left"), type: homeT("ওয়ান-ওয়ে", "One-Way") },
    { from: homeT("চট্টগ্রাম (CGP)", "Chittagong (CGP)"), to: homeT("জেদ্দা (JED)", "Jeddah (JED)"), airline: homeT("সাউদিয়া এয়ারলাইন্স", "Saudia Airlines"), price: homeT("৳ ৪৫,০০০", "৳ 45,000"), seats: homeT("শেষ সিট", "Last Seat Left"), type: homeT("ওয়ান-ওয়ে", "One-Way") },
    { from: homeT("সিলেট (ZYL)", "Sylhet (ZYL)"), to: homeT("লন্ডন (LHR)", "London (LHR)"), airline: homeT("বিমান বাংলাদেশ", "Biman Bangladesh"), price: homeT("৳ ৮২,০০০", "৳ 82,000"), seats: homeT("৭টি সিট খালি", "7 Seats Left"), type: homeT("ওয়ান-ওয়ে", "One-Way") }
  ];

  const [ticketFilter, setTicketFilter] = useState("ALL");

  return (
    <ArabicPageShell>
      {/* Dynamic Success Toast Message */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4"
          >
            <div className="p-4 bg-slate-900 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-start gap-3 shadow-2xl shadow-[#F8FAFC]/80">
              <CheckCircle className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block text-sm">অনলাইন সিস্টেম কনফার্মেশন</span>
                <p className="leading-relaxed font-semibold">{successMsg}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Premium Bilingual Header Hero with Rotating Iconic Travel Backdrop */}
      <section className="relative w-full overflow-hidden flex items-center justify-center border-b border-slate-200/80 bg-slate-50 py-16 md:py-24">
        {/* Unsplash beautiful airplane photo and international landmark backdrops overlayed with a dark glassy blur */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Rotating Backdrop Layers */}
          {heroBackgrounds.map((bg, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 bg-cover transition-all duration-1000 ease-in-out brightness-[1.0] opacity-[0.06] grayscale contrast-125 ${
                idx === currentBgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
              style={{ 
                backgroundImage: `url('${bg.url}')`,
                backgroundPosition: bg.pos,
                transitionProperty: "opacity, transform"
              }}
            />
          ))}
          {/* Subtle overlay of iconic international destinations */}
          <div 
            className="absolute inset-0 opacity-[0.06] mix-blend-color-dodge bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200')` // Premium travel luxury aesthetic
            }}
          />
          {/* Radial dark gradient mask to give depth to the typography */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-white to-slate-50" />
        </div>

        <div className="absolute top-8 left-8 opacity-25 pointer-events-none hidden lg:block">
          <CornerOrnaments />
        </div>
        <div className="absolute bottom-8 right-8 opacity-25 rotate-180 pointer-events-none hidden lg:block">
          <CornerOrnaments />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Typography and CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight font-heading"
            >
              {homeT("প্রবাসীদের জন্য ", "The Ultimate ")}
              <span style={{ color: GOLD }} className="bg-gradient-to-r from-[#EED994] via-[#C9A84C] to-[#EED994] bg-clip-text text-transparent drop-shadow-sm font-black">
                {homeT("সেরা ও আস্থার", "Trusted & Reliable")}
              </span>{" "}
              {homeT("সেবা প্রদানকারী", "Expatriate Partner")}
            </motion.h1>

            <p className="text-xs md:text-base text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {homeT(
                "সবচেয়ে কমদামী এয়ার টিকিট, পাসপোর্ট রিনিউয়াল, ভিসা প্রসেসিং, BMET রেজিস্ট্রেশন এবং হজ্জ-ওমরাহ প্যাকেজ সহ সকল প্রবাসী ডিজিটাল সেবা এক নির্ভরযোগ্য প্লাটফর্মে।",
                "Access guaranteed lowest international airfares, direct passport assistance, Middle East visa processing, instant BMET cards, and premium Hajj & Umrah tours on one supreme portal."
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => window.open(`tel:${globalConfig.hotlineRaw}`, "_self")}
                className="w-full sm:w-auto px-6 py-3 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs md:text-sm rounded-xl transition-all shadow-xl shadow-slate-200/50 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <PhoneCall className="w-4 h-4" /> {homeT("কল করুন", "Call Hotline")} ({globalConfig.hotline})
              </button>
              <button
                onClick={() => window.open(`https://wa.me/${globalConfig.whatsapp}`, "_blank")}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-xl shadow-slate-200/50 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Users className="w-4 h-4" /> {homeT("হোয়াটসঅ্যাপে কন্টাক্ট করুন", "Connect on WhatsApp")}
              </button>
            </div>

            {/* Premium Quick Destination Selectors */}
            <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3">
              {heroBackgrounds.map((bg, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBgIndex(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 border cursor-pointer backdrop-blur-md ${
                    idx === currentBgIndex
                      ? "bg-[#C9A84C] text-[#FFFFFF] border-[#C9A84C] shadow-lg shadow-[#C9A84C]/25 scale-105"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {idx === 0 && <Plane className="w-3.5 h-3.5" />}
                  {idx === 1 && <Globe2 className="w-3.5 h-3.5 text-[#C9A84C]" />}
                  {idx === 2 && <Compass className="w-3.5 h-3.5 text-amber-500" />}
                  {idx === 3 && <Map className="w-3.5 h-3.5 text-sky-500" />}
                  <span>{homeT(bg.titleBn, bg.titleEn)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Beautiful Dynamic Image Showcase of Planes & Countries */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            <motion.div 
              key={currentBgIndex}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-sm md:max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-8 ring-[#C9A84C]/10 bg-slate-50 group"
            >
              <img 
                src={heroBackgrounds[currentBgIndex].url} 
                alt={heroBackgrounds[currentBgIndex].titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              {/* Glassmorphism Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold font-mono">গন্তব্য / Destination</span>
                  <span className="text-sm font-extrabold text-slate-900">{homeT(heroBackgrounds[currentBgIndex].titleBn, heroBackgrounds[currentBgIndex].titleEn)}</span>
                </div>
                <div className="px-3 py-1 bg-[#C9A84C] text-white rounded-lg text-xs font-bold flex items-center gap-1">
                  <Plane className="w-3.5 h-3.5 animate-pulse" />
                  <span>লাইভ ফ্লাইট</span>
                </div>
              </div>

              {/* Top floating ribbon */}
              <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>নিরাপদ ও সরাসরি ফ্লাইট</span>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. Three Horizontal Portal Panels under the Banner */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Admin Dashboard Portal */}
          <Link 
            to="/admin" 
            className="group bg-white border border-slate-200 shadow-md shadow-slate-100 hover:shadow-lg hover:border-[#C9A84C]/65 rounded-xl p-5 shadow-xl transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-sm md:text-base leading-none">অ্যাডমিন ড্যাশবোর্ড</h4>
                <p className="text-[10px] text-slate-600">অফিসিয়াল ফাইল কন্ট্রোল ও ম্যানেজার পোর্টাল</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1.5 transition-transform" />
          </Link>

          {/* Card 2: Retailer Portal B2B Login */}
          <button 
            onClick={() => setShowRetailerPortalModal(true)}
            className="group text-left bg-white border border-slate-200 shadow-md shadow-slate-100 hover:shadow-lg hover:border-[#C9A84C]/65 rounded-xl p-5 shadow-xl transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users2 className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-sm md:text-base leading-none">
                  {isRetailerLoggedIn ? "রিটেইলার ড্যাশবোর্ড" : "B2B রিটেইলার পোর্টাল"}
                </h4>
                <p className="text-[10px] text-slate-600">
                  {isRetailerLoggedIn ? `ব্যালেন্স: ৳ ${retailerBalance.toLocaleString("bn-BD")}` : "এজেন্টদের লগইন ও ব্যালেন্স রিচার্জ"}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1.5 transition-transform" />
          </button>

          {/* Card 3: Check Application Status Check */}
          <Link 
            to="/status" 
            className="group bg-white border border-slate-200 shadow-md shadow-slate-100 hover:shadow-lg hover:border-[#C9A84C]/65 rounded-xl p-5 shadow-xl transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-sm md:text-base leading-none">আবেদনের স্ট্যাটাস দেখুন</h4>
                <p className="text-[10px] text-slate-600">ভিসা, টিকিট ও স্মার্টকার্ড লাইভ ট্র্যাকিং</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1.5 transition-transform" />
          </Link>

        </div>
      </section>

      {/* 3. Job Circulars & Visa Circulars Section with "+ যোগ করুন" */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2 justify-center sm:justify-start">
                <Briefcase className="w-5 h-5 text-[#C9A84C]" /> ভিসা সার্কুলার ও নিয়োগ বিজ্ঞপ্তি
              </h3>
              <p className="text-xs text-slate-600">বিভিন্ন দেশে অনুমোদিত চাকরির নিয়োগপত্র ও প্রসেসিং সার্ভিস</p>
            </div>
            <button
              onClick={() => setShowAddCircularModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#C9A84C] to-[#E2C876] hover:from-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <PlusCircle className="w-4.5 h-4.5" /> সার্কুলার যোগ করুন
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {circulars.map((circ) => (
              <div 
                key={circ.id}
                className="bg-[#FFFFFF]/90 border border-slate-100 hover:border-[#C9A84C]/30 p-5 rounded-xl transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C9A84C] px-2.5 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center gap-1">
                    <span>{circ.flag}</span> {circ.country}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{circ.date}</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm md:text-base mb-1">{circ.title}</h4>
                  <p className="text-xs text-slate-600">পদবী: {circ.role}</p>
                </div>
                <div className="p-3 bg-white border border-slate-200/60 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">মাসিক বেতন:</span>
                    <span className="font-bold text-[#E2C876]">{circ.salary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">মোট শূন্যপদ:</span>
                    <span className="font-semibold text-slate-800">{circ.vaccancies}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed pt-1">
                  <span className="text-amber-500 font-semibold block mb-0.5">প্রয়োজনীয় কাগজপত্র:</span>
                  {circ.docs}
                </div>
                <button
                  onClick={() => {
                    setServiceFormSelect(circ.country);
                    setServiceFormExtra(`পদবী: ${circ.role}, বেতন: ${circ.salary}`);
                    setActiveServiceModal("ভিসা রেজিস্ট্রেশন");
                  }}
                  className="w-full py-2 bg-[#032F1E] hover:bg-[#C9A84C] hover:text-[#FFFFFF] border border-[#C9A84C]/20 text-[#C9A84C] font-bold text-xs rounded-lg transition-all cursor-pointer text-center block"
                >
                  আবেদন করুন
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Core 17 Services Section & Live Ticket price widget (Grid side-by-side) */}
      <section className="py-8 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: 17 Services Grid */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-1.5 text-center lg:text-left">
              <h2 className="text-2xl font-black text-slate-900 tracking-wide">আমাদের সেবাসমূহ (Our Services)</h2>
              <p className="text-xs text-slate-600">প্রবাসী সেবাগ্রহীতা ও এজেন্টদের জন্য ১৭টি স্পেশাল ওয়ান-স্টপ সলিউশন</p>
              <div className="w-16 h-1 bg-[#C9A84C] mt-2 rounded mx-auto lg:mx-0" />
            </div>

            {/* --- Service search bar and interactive category tabs --- */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-4 shadow-sm">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={serviceSearchQuery}
                  onChange={(e) => setServiceSearchQuery(e.target.value)}
                  placeholder="আপনার কাঙ্ক্ষিত সেবাটি খুঁজুন... (যেমনঃ পাসপোর্ট, টিকিট, ভিসা, BMET)"
                  className="w-full bg-white border border-slate-200 focus:border-[#C9A84C] rounded-xl pl-10 pr-10 py-3 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#C9A84C] font-semibold"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                {serviceSearchQuery && (
                  <button
                    onClick={() => setServiceSearchQuery("")}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-1 font-bold text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mr-1">ক্যাটাগরি ফিল্টার:</span>
                {[
                  { id: "ALL", label: "সব সেবা (All)", count: CORE_SERVICES.length },
                  { id: "TICKET", label: "✈️ টিকিট ও হজ্জ (Tickets)", count: CORE_SERVICES.filter(x => x.category === "TICKET").length },
                  { id: "VISA", label: "🛂 ভিসা প্রসেস (Visa)", count: CORE_SERVICES.filter(x => x.category === "VISA").length },
                  { id: "CITIZEN", label: "📋 নাগরিক সেবা (Citizen)", count: CORE_SERVICES.filter(x => x.category === "CITIZEN").length },
                  { id: "AGENT", label: "👥 B2B এজেন্ট (Agent)", count: CORE_SERVICES.filter(x => x.category === "AGENT").length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setServiceCategoryFilter(tab.id)}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer border flex items-center gap-1.5 ${
                      serviceCategoryFilter === tab.id
                        ? "bg-[#C9A84C] border-[#C9A84C] text-[#FFFFFF] shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:border-[#C9A84C]/45 hover:text-slate-800"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${serviceCategoryFilter === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Services Grid Rendered */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {CORE_SERVICES.filter(s => {
                const matchesCategory = serviceCategoryFilter === "ALL" || s.category === serviceCategoryFilter;
                const searchLower = serviceSearchQuery.toLowerCase();
                const matchesSearch = s.name.toLowerCase().includes(searchLower) || s.desc.toLowerCase().includes(searchLower);
                return matchesCategory && matchesSearch;
              }).map((s) => {
                const Icon = s.icon;
                return (
                  <div 
                    key={s.id}
                    onClick={() => {
                      setActiveServiceModal(s.name);
                      setServiceFormExtra("");
                    }}
                    className="group relative bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-[#C9A84C]/50 shadow-sm rounded-xl p-4 transition-all duration-300 text-left space-y-3 shadow-md cursor-pointer flex flex-col justify-between h-full overflow-hidden"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color} group-hover:scale-105 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveVideoAdService(s.name);
                          }}
                          className="px-2 py-1 text-[9px] font-extrabold rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 transition-all flex items-center gap-1 cursor-pointer z-10"
                          title="অ্যানিমেশন বিজ্ঞাপন দেখুন"
                        >
                          <Tv className="w-3 h-3 animate-pulse" /> ভিডিও অ্যাড
                        </button>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm group-hover:text-[#C9A84C] transition-colors leading-tight">
                          {s.name}
                        </h4>
                        <p className="text-[10px] text-slate-600 leading-normal line-clamp-2">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-2 flex items-center gap-1 text-[10px] font-bold text-[#C9A84C]/80 group-hover:text-[#C9A84C] transition-colors mt-auto">
                      <span>আবেদন করুন</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}

              {CORE_SERVICES.filter(s => {
                const matchesCategory = serviceCategoryFilter === "ALL" || s.category === serviceCategoryFilter;
                const searchLower = serviceSearchQuery.toLowerCase();
                const matchesSearch = s.name.toLowerCase().includes(searchLower) || s.desc.toLowerCase().includes(searchLower);
                return matchesCategory && matchesSearch;
              }).length === 0 && (
                <div className="col-span-full py-12 text-center text-xs text-slate-500 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  দুঃখিত! আপনার অনুসন্ধানকৃত কীওয়ার্ড অনুযায়ী কোনো সেবা পাওয়া যায়নি।
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Live Air Ticket Prices Widget */}
          <div className="lg:col-span-4 bg-white border border-slate-200 shadow-sm rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#C9A84C] animate-pulse" />
                <h3 className="font-bold text-slate-900 text-sm md:text-base">লাইভ টিকিট দাম (Live Price)</h3>
              </div>
              <span className="text-[9px] bg-emerald-500/10 text-sky-400 border border-emerald-500/25 px-2 py-0.5 rounded-full font-bold">লাইভ রেট</span>
            </div>

            {/* Price Filter Toggle */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-[10px] font-bold">
              <button 
                onClick={() => setTicketFilter("ALL")} 
                className={`flex-1 py-1.5 text-center rounded transition-all cursor-pointer ${ticketFilter === "ALL" ? "bg-[#C9A84C] text-[#FFFFFF]" : "text-slate-600"}`}
              >
                সব রুট
              </button>
              <button 
                onClick={() => setTicketFilter("DAC")} 
                className={`flex-1 py-1.5 text-center rounded transition-all cursor-pointer ${ticketFilter === "DAC" ? "bg-[#C9A84C] text-[#FFFFFF]" : "text-slate-600"}`}
              >
                ঢাকা (DAC)
              </button>
              <button 
                onClick={() => setTicketFilter("CGP")} 
                className={`flex-1 py-1.5 text-center rounded transition-all cursor-pointer ${ticketFilter === "CGP" ? "bg-[#C9A84C] text-[#FFFFFF]" : "text-slate-600"}`}
              >
                চট্টগ্রাম (CGP)
              </button>
            </div>

            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {LIVE_TICKET_PRICES.filter(t => ticketFilter === "ALL" || t.from.includes(ticketFilter)).map((ticket, i) => (
                <div 
                  key={i}
                  className="bg-[#FFFFFF] border border-slate-100 hover:border-[#C9A84C]/15 p-3 rounded-xl transition-all space-y-2.5"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-900 font-bold">{ticket.from} ✈️ {ticket.to}</span>
                    <span className="text-[9px] font-semibold text-slate-600 bg-slate-800 px-2 py-0.5 rounded">{ticket.type}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-600 text-[10px]">{ticket.airline}</span>
                    <span className="text-sky-400 font-mono text-[10px] flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                      {ticket.seats}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100/60">
                    <div>
                      <span className="text-[9px] text-slate-500 block leading-none">আনুমানিক ভাড়া</span>
                      <span className="text-xs font-bold font-mono text-[#E2C876]">{ticket.price}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveServiceModal("নতুন টিকিট বুকিং");
                        setServiceFormExtra(`রুট: ${ticket.from} থেকে ${ticket.to}, এয়ারলাইন্স: ${ticket.airline}`);
                      }}
                      className="px-3 py-1.5 bg-[#C9A84C]/10 hover:bg-[#C9A84C] text-[#C9A84C] hover:text-[#FFFFFF] border border-[#C9A84C]/30 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                    >
                      টিকিট কাটুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4.5. Popular Destinations & International Gateways Section */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="space-y-2 text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <Plane className="w-7 h-7 text-[#C9A84C] animate-pulse" />
            <span>জনপ্রিয় ফ্লাইট গন্তব্যসমূহ (Popular Destinations)</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-600 max-w-2xl mx-auto">
            সবচেয়ে কম ও সাশ্রয়ী বিমান ভাড়ায় সরাসরি ফ্লাইটের বুকিং টিকিট ও ভিসা কনফার্মেশন প্রসেস করুন। প্রবাসীদের প্রিয় দেশগুলোর জনপ্রিয় বিমান রুট সমূহ।
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, i) => (
            <div 
              key={i}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-[#C9A84C]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                
                {/* Price Badge */}
                <span className="absolute top-4 right-4 bg-[#032F1E]/90 backdrop-blur-sm border border-[#C9A84C]/45 text-[#C9A84C] font-bold text-xs px-3 py-1.5 rounded-xl font-mono shadow-md">
                  {dest.price} থেকে
                </span>

                {/* Country Badge */}
                <span className="absolute bottom-4 left-4 bg-white/95 text-slate-900 font-extrabold text-[10px] px-2.5 py-1 rounded-lg">
                  {dest.country}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-lg group-hover:text-[#C9A84C] transition-colors leading-tight">
                    {dest.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold font-mono">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>রুট কোড: DAC ✈️ {dest.code}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/flights?from=DAC&to=${dest.code}`)}
                  className="w-full py-2.5 bg-[#032F1E] hover:bg-[#C9A84C] hover:text-white border border-[#C9A84C]/25 text-[#C9A84C] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plane className="w-4 h-4" />
                  <span>ফ্লাইট টিকিট বুক করুন</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Dynamic Stats Summary Section */}
      <section className="py-12 bg-slate-100/60 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-1">
              <span className="block text-2xl md:text-3xl font-extrabold font-mono text-[#C9A84C]">১৫,০০০+</span>
              <span className="block text-xs md:text-sm font-bold text-slate-800">হ্যাপি কাস্টমার</span>
              <span className="block text-[10px] text-slate-600">বিগত ৩ বছরে টিকিট ও ভিসা সেবাগ্রহীতা</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl md:text-3xl font-extrabold font-mono text-[#C9A84C]">৩৫০+</span>
              <span className="block text-xs md:text-sm font-bold text-slate-800">B2B রিটেইলার</span>
              <span className="block text-[10px] text-slate-600">সারা বাংলাদেশে ছড়িয়ে থাকা রিটেইলার নেটওয়ার্ক</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl md:text-3xl font-extrabold font-mono text-[#C9A84C]">৯৯.৮%</span>
              <span className="block text-xs md:text-sm font-bold text-slate-800">ভিসা সাকসেস রেট</span>
              <span className="block text-[10px] text-slate-600">সৌদি আরব ও ওমরাহ ভিসা প্রক্রিয়াকরণ</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl md:text-3xl font-extrabold font-mono text-[#C9A84C]">২৪/৭</span>
              <span className="block text-xs md:text-sm font-bold text-slate-800">লাইভ কল সাপোর্ট</span>
              <span className="block text-[10px] text-slate-600">প্রবাসী ভাইদের সহায়তায় হটলাইন নম্বর</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 Premium Customer Testimonials Section */}
      <Testimonials />

      {/* 5.8 Quick Contact Form Section */}
      <QuickContact />

      {/* 6. FAQs Accordion Section */}
      <FAQs />

      {/* MODAL 1: Add Job/Visa Circular Modal */}
      <AnimatePresence>
        {showAddCircularModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200/80 shadow-2xl rounded-2xl w-full max-w-lg p-6 relative shadow-2xl"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base font-bold">নতুন ভিসা সার্কুলার যোগ করুন</h3>
                <button onClick={() => setShowAddCircularModal(false)} className="text-slate-600 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddCircular} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 text-[10px] block mb-1">দেশ নির্বাচন করুন *</label>
                    <select 
                      value={newCircCountry} 
                      onChange={(e) => setNewCircCountry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    >
                      <option value="Saudi Arabia">সৌদি আরব (Saudi Arabia)</option>
                      <option value="UAE">সংযুক্ত আরব আমিরাত (UAE)</option>
                      <option value="Qatar">কাতার (Qatar)</option>
                      <option value="Oman">ওমান (Oman)</option>
                      <option value="Malaysia">মালয়েশিয়া (Malaysia)</option>
                      <option value="Kuwait">কুয়েত (Kuwait)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-600 text-[10px] block mb-1">বিজ্ঞপ্তির শিরোনাম *</label>
                    <input 
                      type="text" 
                      required 
                      value={newCircTitle}
                      onChange={(e) => setNewCircTitle(e.target.value)}
                      placeholder="যেমন: সৌদি আরবে লেবার নিয়োগ"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 text-[10px] block mb-1">কাজের পদবী *</label>
                    <input 
                      type="text" 
                      required 
                      value={newCircRole}
                      onChange={(e) => setNewCircRole(e.target.value)}
                      placeholder="যেমন: কনস্ট্রাকশন হেল্পার"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 text-[10px] block mb-1">আনুমানিক মাসিক বেতন</label>
                    <input 
                      type="text" 
                      value={newCircSalary}
                      onChange={(e) => setNewCircSalary(e.target.value)}
                      placeholder="যেমন: ৳ ৪৫,০০০"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 text-[10px] block mb-1">মোট শূন্যপদ</label>
                    <input 
                      type="text" 
                      value={newCircVaccancies}
                      onChange={(e) => setNewCircVaccancies(e.target.value)}
                      placeholder="যেমন: ২৫ জন"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 text-[10px] block mb-1">প্রয়োজনীয় কাগজপত্রাদি</label>
                    <input 
                      type="text" 
                      value={newCircDocs}
                      onChange={(e) => setNewCircDocs(e.target.value)}
                      placeholder="যেমন: মূল পাসপোর্ট, ২ কপি ল্যাব ছবি"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-[#C9A84C] to-[#E2C876] text-[#FFFFFF] font-bold text-xs rounded-xl hover:from-[#B3933E] transition-all cursor-pointer"
                >
                  বিজ্ঞপ্তি প্রকাশ করুন
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Retailer B2B Portal Modal */}
      <AnimatePresence>
        {showRetailerPortalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200/80 shadow-2xl rounded-2xl w-full max-w-md p-6 relative shadow-2xl"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base font-bold">B2B রিটেইলার পোর্টাল কনসোল</h3>
                <button onClick={() => setShowRetailerPortalModal(false)} className="text-slate-600 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              {!isRetailerLoggedIn ? (
                <form onSubmit={handleRetailerLogin} className="space-y-4 pt-5">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] rounded-lg">
                    • রিটেইলার একাউন্ট থাকলে সরাসরি ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন। <br />
                    • নতুন এজেন্টের জন্য যেকোনো ডেমো আইডি/পাসকোড দিয়ে লগইন করা যাবে।
                  </div>
                  <div>
                    <label className="text-slate-600 text-[10px] block mb-1">এজেন্ট ইউজারনেম *</label>
                    <input 
                      type="text" 
                      required 
                      value={retailerUsername}
                      onChange={(e) => setRetailerUsername(e.target.value)}
                      placeholder="যেমন: pb-agent99"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 text-[10px] block mb-1">নিরাপত্তা পাসকোড *</label>
                    <input 
                      type="password" 
                      required 
                      value={retailerPassword}
                      onChange={(e) => setRetailerPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs rounded-xl hover:from-amber-600 transition-all cursor-pointer"
                  >
                    রিটেইলার পোর্টালে প্রবেশ করুন
                  </button>
                </form>
              ) : (
                <div className="space-y-5 pt-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 text-xs">এজেন্ট আইডি:</span>
                      <span className="text-xs font-bold font-mono text-white">{retailerUsername || "pb-agent-demo"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 text-xs">চলতি ওয়ালেট ব্যালেন্স:</span>
                      <span className="text-sm font-extrabold font-mono text-[#C9A84C]">৳ {retailerBalance.toLocaleString("bn-BD")}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-sky-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        সংযুক্ত এজেন্ট গেটওয়ে
                      </span>
                      <span className="text-slate-600">কমিশন রেট: ৩%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setShowRetailerPortalModal(false);
                        setActiveServiceModal("ডিপোজিট");
                      }}
                      className="py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-all text-center cursor-pointer"
                    >
                      ওয়ালেট ডিপোজিট করুন
                    </button>
                    <button
                      onClick={() => {
                        setShowRetailerPortalModal(false);
                        setActiveServiceModal("রিটেইলার ড্যাশবোর্ড");
                      }}
                      className="py-2 bg-[#032F1E] hover:bg-[#C9A84C]/20 border border-[#C9A84C]/45 text-[#C9A84C] text-xs font-bold rounded-lg transition-all text-center cursor-pointer"
                    >
                      ওয়ালেট লেনদেন
                    </button>
                  </div>

                  <button
                    onClick={handleRetailerLogout}
                    className="w-full py-2 bg-rose-950/40 hover:bg-rose-950 border border-rose-500/20 text-rose-300 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center"
                  >
                    লগআউট করুন
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: 17 Services Dynamic Interactive Modals */}
      <AnimatePresence>
        {activeServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-md p-6 relative shadow-2xl"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base font-bold flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#C9A84C] animate-pulse" /> {activeServiceModal} আবেদন
                </h3>
                <button onClick={() => setActiveServiceModal(null)} className="text-slate-600 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              {/* Dynamic instruction box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 text-[11px] text-slate-750 rounded-xl my-4 border border-slate-100 flex flex-col justify-between">
                <div>
                  {activeServiceModal === "এয়ার টিকিট চেক" && "✈️ আপনার টিকিট কনফার্মেশন, PNR, এবং এয়ারলাইন্স বুকিং স্ট্যাটাস চেক করতে টিকিট নম্বর বা রেফারেন্স জমা দিন।"}
                  {activeServiceModal === "তারিখ পরিবর্তন" && "📅 আপনার ভ্রমণ সূচী পরিবর্তন করতে আপনার টিকিট নম্বর ও কাঙ্ক্ষিত নতুন ভ্রমণের তারিখ সাবমিট করুন।"}
                  {activeServiceModal === "নতুন টিকিট বুকিং" && "🛫 আপনার গন্তব্য, যাত্রার তারিখ এবং এয়ারলাইন্স পছন্দ লিখে পাঠান, আমাদের কাস্টমার প্রতিনিধি সাশ্রয়ী অফার কল করে নিশ্চিত করবেন।"}
                  {activeServiceModal === "পাসপোর্ট আবেদন" && "📝 নতুন পাসপোর্ট প্রসেসিং, রি-ইস্যু বা নামের বানান/বয়স সংশোধনের জন্য আপনার মূল তথ্য জমা দিন।"}
                  {activeServiceModal === "NID আবেদন" && "🆔 ভোটার আইডি সংশোধন, হারানো কার্ড বা নতুন ভোটার নিবন্ধনের আবেদন হেল্প প্রসেসিং।"}
                  {activeServiceModal === "জন্ম নিবন্ধন" && "👶 নতুন জন্ম নিবন্ধন আবেদন অথবা পুরাতন জন্ম সনদের তথ্য সংশোধন হেল্প।"}
                  {activeServiceModal === "ভিসা চেক" && "🛂 সৌদি আরব বা মিডল ইস্টের যেকোনো ভিসার সত্যতা এবং লাইভ ফাইল স্ট্যাটাস আমাদের সিস্টেমে চেক করুন।"}
                  {activeServiceModal === "ভিসা রেজিস্ট্রেশন" && "🛂 ভিসার স্ট্যাম্পিং, পেপারস ভেরিফিকেশন ও সরকারি নিয়মে বায়োমেট্রিক আঙ্গুলের ছাপ বুকিং।"}
                  {activeServiceModal === "হজ্জ ও ওমরাহ" && "🕌 ওমরাহ হজ্জের প্যাকেজ নিশ্চিতকরণ এবং গ্রুপের সাথে সিট বুকিং সুবিধা। ওমরাহ প্যাকেজ মাত্র ১,৪৫,০০০ টাকা থেকে শুরু!"}
                  {activeServiceModal === "ভিজিট ভিসা" && "✈️ সৌদি আরব, দুবাই বা ওমানের কমার্শিয়াল বা ফ্যামিলি ট্যুরিস্ট ভিসা প্রসেস।"}
                  {activeServiceModal === "ফ্যামিলি ভিসা" && "👨‍👩‍👦 সৌদি আরব ফ্যামিলি ভিসা স্পন্সর ফর্ম ও পেপারস বুকিং।"}
                  {activeServiceModal === "জিয়ারা ভিসা" && "🕋 সৌদি আরবের জিয়ারা ও ট্রানজিট উমরাহ ভিসা প্রসেস।"}
                  {activeServiceModal === "BMET আবেদন" && "📋 বিদেশগামী কর্মীদের ফাইনাল স্মার্টকার্ড ডাউনলোড, ফি পেমেন্ট ও বিএমইটি রেজিস্ট্রেশন।"}
                  {activeServiceModal === "৩ দিনের ট্রেনিং" && "🎓 বিদেশগামী নতুন কর্মীদের ৩ দিনের PDO ট্রেনিং এবং সার্টিফিকেট তোলার জন্য সেন্টার বুকিং।"}
                  {activeServiceModal === "ডিপোজিট" && "💰 B2B এজেন্টদের ওয়ালেট ব্যালেন্স বাড়াতে Bkash, Nagad বা ব্যাংকে টাকা জমা দিয়ে ট্রানজেকশন স্লিপ সাবমিট করুন।"}
                  {activeServiceModal === "রিটেইলার ব্যালেন্স" && "📊 আপনার B2B রিটেইলার ব্যালেন্স রিপোর্ট দেখুন এবং সংশোধন করুন।"}
                  {activeServiceModal === "রিটেইলার ড্যাশবোর্ড" && "🖥️ আপনার এজেন্ট সেলস কমিশন ও রিটেইল পোর্টালে কাস্টমারদের বুকিং সংক্রান্ত রিপোর্ট।"}
                </div>
                
                <button 
                  onClick={() => setActiveVideoAdService(activeServiceModal)}
                  className="w-full mt-3 py-2 px-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Tv className="w-4 h-4 animate-pulse text-white" /> এই সার্ভিসের ভিডিও অ্যাড / অ্যানিমেশন দেখুন
                </button>
              </div>

              {/* Service Forms Field Renderings */}
              <div className="space-y-4">
                <div>
                  <label className="text-slate-600 text-[10px] block mb-1">আবেদনকারী/যাত্রীর পুরো নাম *</label>
                  <input 
                    type="text" 
                    required 
                    value={serviceFormName}
                    onChange={(e) => setServiceFormName(e.target.value)}
                    placeholder="উদাঃ মোঃ আব্দুল আলীম"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 text-[10px] block mb-1">মোবাইল নম্বর *</label>
                    <input 
                      type="tel" 
                      required 
                      value={serviceFormPhone}
                      onChange={(e) => setServiceFormPhone(e.target.value)}
                      placeholder="উদাঃ ০১৭xxxxxxxx"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 text-[10px] block mb-1">পাসপোর্ট নম্বর (ঐচ্ছিক)</label>
                    <input 
                      type="text" 
                      value={serviceFormPassport}
                      onChange={(e) => setServiceFormPassport(e.target.value)}
                      placeholder="উদাঃ A02345678"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                </div>

                {/* Conditional Fields based on service */}
                {activeServiceModal === "এয়ার টিকিট চেক" && (
                  <div>
                    <label className="text-slate-600 text-[10px] block mb-1">টিকিট নম্বর বা PNR কোড (ঐচ্ছিক)</label>
                    <input 
                      type="text" 
                      placeholder="উদাঃ PNR-X99201"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                      onChange={(e) => setServiceFormExtra(`PNR/Ticket: ${e.target.value}`)}
                    />
                  </div>
                )}

                {activeServiceModal === "তারিখ পরিবর্তন" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-600 text-[10px] block mb-1">বর্তমান ভ্রমণের তারিখ</label>
                      <input 
                        type="date"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 text-[10px] block mb-1">নতুন কাঙ্ক্ষিত তারিখ</label>
                      <input 
                        type="date"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        onChange={(e) => setServiceFormExtra(`নতুন তারিখ: ${e.target.value}`)}
                      />
                    </div>
                  </div>
                )}

                {activeServiceModal === "নতুন টিকিট বুকিং" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-600 text-[10px] block mb-1">কোথা থেকে (Origin)</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        onChange={(e) => setServiceFormSelect(e.target.value)}
                      >
                        <option value="DAC">ঢাকা (DAC)</option>
                        <option value="CGP">চট্টগ্রাম (CGP)</option>
                        <option value="ZYL">সিলেট (ZYL)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-600 text-[10px] block mb-1">কোথায় যাবেন (Destination)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="যেমন: জেদ্দা (JED)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        onChange={(e) => setServiceFormExtra(`গন্তব্য: ${e.target.value}`)}
                      />
                    </div>
                  </div>
                )}

                {activeServiceModal === "হজ্জ ও ওমরাহ" && (
                  <div>
                    <label className="text-slate-600 text-[10px] block mb-1">কাঙ্ক্ষিত প্যাকেজ নির্বাচন করুন</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setServiceFormNumberInput(val);
                        setServiceFormExtra(val === 145000 ? "ইকোনমি ওমরাহ" : "প্রিমিয়াম ওমরাহ");
                      }}
                    >
                      <option value="">বাছাই করুন</option>
                      <option value="145000">ইকোনমি ওমরাহ প্যাকেজ (৳ ১,৪৫,০০০ / ব্যক্তি)</option>
                      <option value="185000">প্রিমিয়াম ওমরাহ প্যাকেজ (৳ ১,৮৫,০০০ / ব্যক্তি)</option>
                    </select>
                  </div>
                )}

                {activeServiceModal === "ডিপোজিট" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-600 text-[10px] block mb-1">পেমেন্ট মেথড *</label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          onChange={(e) => setServiceFormSelect(e.target.value)}
                        >
                          <option value="bKash">বিকাশ (Bkash)</option>
                          <option value="Nagad">নগদ (Nagad)</option>
                          <option value="Bank Transfer">ব্যাংক ট্রান্সফার (Bank)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-600 text-[10px] block mb-1">ডিপোজিট পরিমাণ (৳) *</label>
                        <input 
                          type="number" 
                          required
                          placeholder="যেমন: ১০,০০০"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setServiceFormNumberInput(val);
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-600 text-[10px] block mb-1">ট্রানজেকশন আইডি / রেফারেন্স স্লিপ নম্বর *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="যেমন: TRX99182312"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        onChange={(e) => setServiceFormExtra(`টাকা জমা গেটওয়ে: ${serviceFormSelect}, ট্রানজেকশন: ${e.target.value}`)}
                      />
                    </div>
                  </div>
                )}

                {activeServiceModal === "রিটেইলার ব্যালেন্স" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
                      <span className="text-[10px] text-slate-600 block">চলতি B2B রিটেইলার ব্যালেন্স</span>
                      <span className="text-xl font-bold font-mono text-[#C9A84C]">৳ {retailerBalance.toLocaleString("bn-BD")}</span>
                    </div>
                    <div>
                      <label className="text-slate-600 text-[10px] block mb-1">ওয়ালেট ব্যালেন্স সংশোধন করুন (৳) *</label>
                      <input 
                        type="number" 
                        required
                        placeholder="যেমন: ২৫৫০০"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setServiceFormNumberInput(val);
                        }}
                      />
                    </div>
                  </div>
                )}

                {activeServiceModal === "৩ দিনের ট্রেনিং" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-600 text-[10px] block mb-1">PDO ট্রেনিং সেন্টার</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        onChange={(e) => setServiceFormSelect(e.target.value)}
                      >
                        <option value="Dhaka TTC">ঢাকা টিটিসি (Dhaka TTC)</option>
                        <option value="Chittagong TTC">চট্টগ্রাম টিটিসি (CGP TTC)</option>
                        <option value="Sylhet TTC">সিলেট টিটিসি (ZYL TTC)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-600 text-[10px] block mb-1">ট্রেনিং শুরুর তারিখ</label>
                      <input 
                        type="date" 
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        onChange={(e) => setServiceFormExtra(`PDO ট্রেনিং সেন্টার: ${serviceFormSelect}, তারিখ: ${e.target.value}`)}
                      />
                    </div>
                  </div>
                )}

                {/* Fallback extra input info */}
                {!["এয়ার টিকিট চেক", "তারিখ পরিবর্তন", "নতুন টিকিট বুকিং", "হজ্জ ও ওমরাহ", "ডিপোজিট", "রিটেইলার ব্যালেন্স", "৩ দিনের ট্রেনিং"].includes(activeServiceModal) && (
                  <div>
                    <label className="text-slate-600 text-[10px] block mb-1">অতিরিক্ত বিবরণ বা সংশোধনীর তথ্য</label>
                    <textarea 
                      rows={2}
                      value={serviceFormExtra}
                      onChange={(e) => setServiceFormExtra(e.target.value)}
                      placeholder="সংশোধনের বিবরণ বা জরুরি তথ্য এখানে লিখুন..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                )}

                {activeServiceModal !== "রিটেইলার ব্যালেন্স" && (
                  <div>
                    <label className="text-slate-600 text-[10px] block mb-1">প্রয়োজনীয় ডকুমেন্টের ছবি বা ফাইল আপলোড করুন *</label>
                    <div 
                      onClick={() => serviceFileRef.current?.click()}
                      className="border-2 border-dashed border-[#C9A84C]/25 hover:border-[#C9A84C]/50 rounded-xl p-3 text-center cursor-pointer bg-[#FFFFFF]/60 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-[#C9A84C] mx-auto mb-1" />
                      <span className="text-[10px] text-slate-700 block">
                        {serviceFormFile ? (
                          <span className="text-sky-400 font-semibold">{serviceFormFile.name} (সংযুক্ত করা হয়েছে)</span>
                        ) : (
                          "ক্লিক করে পাসপোর্টের ছবি/ডকুমেন্ট ফাইল আপলোড করুন *"
                        )}
                      </span>
                      <span className="text-[8px] text-slate-500 block mt-0.5">ফরম্যাট: JPG, PNG, PDF (সর্বোচ্চ ৫ মেগাবাইট)</span>
                      <input 
                        type="file" 
                        ref={serviceFileRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setServiceFormFile(e.target.files[0]);
                          }
                        }}
                        className="hidden" 
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (activeServiceModal === "রিটেইলার ব্যালেন্স") {
                      if (serviceFormNumberInput > 0) {
                        setRetailerBalance(serviceFormNumberInput);
                        localStorage.setItem("probas_retailer_balance", serviceFormNumberInput.toString());
                        triggerSuccess(`রিটেইলার ওয়ালেট ব্যালেন্স সাফল্যের সাথে ৳ ${serviceFormNumberInput.toLocaleString("bn-BD")} টাকা হিসেবে সংশোধন করা হয়েছে!`);
                        setActiveServiceModal(null);
                      } else {
                        alert("সঠিক পরিমাণ উল্লেখ করুন");
                      }
                      return;
                    }
                    if (activeServiceModal === "ডিপোজিট" && serviceFormNumberInput > 0) {
                      const newBal = retailerBalance + serviceFormNumberInput;
                      setRetailerBalance(newBal);
                      localStorage.setItem("probas_retailer_balance", newBal.toString());
                    }
                    handleServiceSubmit(activeServiceModal, serviceFormExtra || "তাৎক্ষণিক ওয়ান-স্টপ কাস্টমার রিকোয়েস্ট প্রসেস");
                  }}
                  className="w-full py-3 bg-gradient-to-r from-[#C9A84C] to-[#E2C876] text-[#FFFFFF] font-bold text-xs rounded-xl hover:from-[#B3933E] transition-all cursor-pointer shadow-md shadow-[#C9A84C]/10 text-center"
                >
                  {activeServiceModal === "রিটেইলার ব্যালেন্স" ? "ব্যালেন্স পরিবর্তন করুন" : "অনলাইন আবেদন জমা দিন"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Service Video Ad Player Modal */}
      <AnimatePresence>
        {activeVideoAdService && (
          <ServiceVideoAdPlayer 
            serviceName={activeVideoAdService}
            onClose={() => setActiveVideoAdService(null)}
          />
        )}
      </AnimatePresence>

      {/* Floating AI Assistant Chatbot widget */}
      <AIChatbot />

    </ArabicPageShell>
  );
}
