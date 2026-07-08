import React, { useState, useEffect } from "react";
import PageHeader from "./PageHeader";
import ArabicPageShell from "./arabic/ArabicPageShell";
import { 
  Lock, 
  Unlock, 
  Settings, 
  Plane, 
  FileText, 
  Compass, 
  ShieldCheck, 
  Users, 
  ClipboardList, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  Mail, 
  Megaphone, 
  PlusCircle, 
  Calendar, 
  List, 
  Sparkles, 
  RefreshCw,
  Clock,
  X,
  UserPlus,
  Upload
} from "lucide-react";
import { CornerOrnaments, ArabicDivider, ProbasBanglaLogo } from "./arabic/ArabicDecor";
import { 
  getGlobalConfig, 
  saveGlobalConfig, 
  getFlights, 
  saveFlights, 
  getDestinations, 
  saveDestinations, 
  getVisaData, 
  saveVisaData, 
  getPackages, 
  savePackages, 
  getServicesInfo, 
  saveServicesInfo,
  GlobalConfig,
  FlightTemplate,
  PopularDestination,
  VisaCountryData,
  HajjUmrahPackage,
  CitizenServiceInfo
} from "../utils/dynamicData";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginErr, setLoginErr] = useState("");

  // Global app configurations
  const [globalConfig, setGlobalConfigState] = useState<GlobalConfig | null>(null);
  const [flights, setFlightsState] = useState<FlightTemplate[]>([]);
  const [destinations, setDestinationsState] = useState<PopularDestination[]>([]);
  const [visaData, setVisaDataState] = useState<Record<string, VisaCountryData>>({});
  const [packages, setPackagesState] = useState<HajjUmrahPackage[]>([]);
  const [servicesInfo, setServicesInfoState] = useState<CitizenServiceInfo[]>([]);

  // User inquiries and bookings database
  const [bookings, setBookings] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);

  // Selected tab
  const [activeTab, setActiveTab] = useState<"bookings" | "global" | "flights" | "visa" | "hajj" | "citizen">("bookings");
  const [statusSuccessMsg, setStatusSuccessMsg] = useState("");

  // Sub-editor state variables
  const [editingFlightId, setEditingFlightId] = useState<string | null>(null);
  const [flightForm, setFlightForm] = useState<Partial<FlightTemplate>>({});

  const [selectedVisaCountry, setSelectedVisaCountry] = useState("Saudi Arabia");
  const [editingVisaTypeIdx, setEditingVisaTypeIdx] = useState<number | null>(null);
  const [visaTypeForm, setVisaTypeForm] = useState<any>({ name: "", duration: "", processing: "", price: "", docs: "" });

  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [pkgForm, setPkgForm] = useState<any>({});

  const [editingServiceIdx, setEditingServiceIdx] = useState<number | null>(null);
  const [serviceForm, setServiceForm] = useState<any>({});

  // Timeline & log history updates
  const [selectedBookingForUpdate, setSelectedBookingForUpdate] = useState<any | null>(null);
  const [newLogMsg, setNewLogMsg] = useState("");
  const [newStatusStep, setNewStatusStep] = useState(1);
  const [newPdfData, setNewPdfData] = useState<string | null>(null);
  const [newPdfName, setNewPdfName] = useState<string | null>(null);

  // Manual Booking Generator
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [manualBookingForm, setManualBookingForm] = useState({
    type: "এয়ার টিকিট",
    service: "DAC ✈️ JED (Manual Admin Booking)",
    passenger: "",
    passport: "",
    phone: "",
    price: "৳ ৫০,০০০",
    status: "কনফার্মড (টিকিট ইস্যু সম্পন্ন)"
  });

  // Load everything
  useEffect(() => {
    // Check if previously logged in this session
    const isAuth = sessionStorage.getItem("probas_admin_authenticated");
    if (isAuth === "true") {
      setIsAuthenticated(true);
    }
    loadData();
  }, []);

  const loadData = () => {
    setGlobalConfigState(getGlobalConfig());
    setFlightsState(getFlights());
    setDestinationsState(getDestinations());
    setVisaDataState(getVisaData());
    setPackagesState(getPackages());
    setServicesInfoState(getServicesInfo());

    // Bookings & enquiries from local storage
    setBookings(JSON.parse(localStorage.getItem("probas_bookings") || "[]"));
    setEnquiries(JSON.parse(localStorage.getItem("probas_enquiries") || "[]"));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin" || passcode === "1234") {
      setIsAuthenticated(true);
      sessionStorage.setItem("probas_admin_authenticated", "true");
      setLoginErr("");
    } else {
      setLoginErr("ভুল পাসকোড! অনুগ্রহ করে 'admin' অথবা '1234' দিয়ে চেষ্টা করুন।");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("probas_admin_authenticated");
  };

  // Helper trigger alerts
  const triggerSuccess = (msg: string) => {
    setStatusSuccessMsg(msg);
    setTimeout(() => setStatusSuccessMsg(""), 5000);
  };

  // ---------------- GENERAL SETTINGS SAVERS ----------------
  const saveGlobalSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalConfig) return;
    saveGlobalConfig(globalConfig);
    triggerSuccess("সাধারণ সেটিংস ও হটলাইন তথ্য সফলভাবে আপডেট হয়েছে!");
  };

  const handleStatChange = (idx: number, field: string, value: string) => {
    if (!globalConfig) return;
    const newStats = [...globalConfig.stats];
    newStats[idx] = { ...newStats[idx], [field]: value };
    setGlobalConfigState({ ...globalConfig, stats: newStats });
  };

  // ---------------- FLIGHTS SAVERS ----------------
  const startEditFlight = (f: FlightTemplate) => {
    setEditingFlightId(f.id);
    setFlightForm(f);
  };

  const saveFlightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = flights.map(f => f.id === editingFlightId ? { ...f, ...flightForm } as FlightTemplate : f);
    setFlightsState(updated);
    saveFlights(updated);
    setEditingFlightId(null);
    triggerSuccess("ফ্লাইট মূল্য ও সময়সূচী সফলভাবে আপডেট হয়েছে!");
  };

  const deleteFlight = (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ফ্লাইটটি বাদ দিতে চান?")) return;
    const filtered = flights.filter(f => f.id !== id);
    setFlightsState(filtered);
    saveFlights(filtered);
    triggerSuccess("ফ্লাইটটি সফলভাবে ডিলিট করা হয়েছে।");
  };

  const addNewFlight = () => {
    const newF: FlightTemplate = {
      id: "FL-" + Math.floor(100 + Math.random() * 900),
      airline: "নতুন এয়ারলাইন",
      code: "XX",
      departure: "12:00",
      arrival: "18:00",
      duration: "6h 00m",
      stopover: "Direct",
      logo: "✈️",
      economyPrice: 45000,
      businessPrice: 85000,
      baggage: "30kg + 7kg"
    };
    const updated = [...flights, newF];
    setFlightsState(updated);
    saveFlights(updated);
    startEditFlight(newF);
    triggerSuccess("নতুন ফ্লাইট রো ডেমো তৈরি হয়েছে, অনুগ্রহ করে এডিট করে সঠিক করুন।");
  };

  // ---------------- VISA SAVERS ----------------
  const startEditVisaType = (idx: number, vt: any) => {
    setEditingVisaTypeIdx(idx);
    setVisaTypeForm({
      ...vt,
      docs: vt.docs.join("\n") // Line separated for editing
    });
  };

  const saveVisaTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVisaTypeIdx === null) return;

    const updatedTypes = [...visaData[selectedVisaCountry].types];
    updatedTypes[editingVisaTypeIdx] = {
      ...visaTypeForm,
      docs: visaTypeForm.docs.split("\n").filter((line: string) => line.trim() !== "")
    };

    const updatedVisaData = {
      ...visaData,
      [selectedVisaCountry]: {
        ...visaData[selectedVisaCountry],
        types: updatedTypes
      }
    };

    setVisaDataState(updatedVisaData);
    saveVisaData(updatedVisaData);
    setEditingVisaTypeIdx(null);
    triggerSuccess("ভিসা প্রসেসিং রিকোয়ারমেন্টস ও মূল্য আপডেট হয়েছে!");
  };

  const deleteVisaType = (idx: number) => {
    if (!confirm("এই ভিসা ক্যাটাগরি কি মুছে ফেলতে চান?")) return;
    const updatedTypes = visaData[selectedVisaCountry].types.filter((_, i) => i !== idx);
    const updatedVisaData = {
      ...visaData,
      [selectedVisaCountry]: {
        ...visaData[selectedVisaCountry],
        types: updatedTypes
      }
    };
    setVisaDataState(updatedVisaData);
    saveVisaData(updatedVisaData);
    triggerSuccess("ভিসা ক্যাটাগরি সফলভাবে ডিলেট করা হয়েছে।");
  };

  const addNewVisaType = () => {
    const newVT = {
      name: "নতুন ভিসা ক্যাটাগরি",
      duration: "৩০ দিন",
      processing: "৩-৫ কর্মদিবস",
      price: "৳ ১৫,০০০",
      docs: ["পাসপোর্ট রঙিন কপি", "২ কপি ছবি"]
    };
    const updatedTypes = [...visaData[selectedVisaCountry].types, newVT];
    const updatedVisaData = {
      ...visaData,
      [selectedVisaCountry]: {
        ...visaData[selectedVisaCountry],
        types: updatedTypes
      }
    };
    setVisaDataState(updatedVisaData);
    saveVisaData(updatedVisaData);
    startEditVisaType(updatedTypes.length - 1, newVT);
    triggerSuccess("নতুন ভিসা প্রসেস এন্ট্রি যোগ করা হয়েছে।");
  };

  // ---------------- HAJJ/UMRAH SAVERS ----------------
  const startEditPkg = (pkg: HajjUmrahPackage) => {
    setEditingPkgId(pkg.id);
    setPkgForm({
      ...pkg,
      features: pkg.features.join("\n")
    });
  };

  const savePkgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = packages.map(p => {
      if (p.id === editingPkgId) {
        return {
          ...p,
          ...pkgForm,
          price: Number(pkgForm.price),
          features: pkgForm.features.split("\n").filter((l: string) => l.trim() !== "")
        };
      }
      return p;
    });
    setPackagesState(updated);
    savePackages(updated);
    setEditingPkgId(null);
    triggerSuccess("ওমরাহ প্যাকেজ তথ্য সফলভাবে আপডেট হয়েছে!");
  };

  const deletePkg = (id: string) => {
    if (!confirm("আপনি কি ওমরাহ প্যাকেজটি মুছে ফেলতে চান?")) return;
    const filtered = packages.filter(p => p.id !== id);
    setPackagesState(filtered);
    savePackages(filtered);
    triggerSuccess("ওমরাহ প্যাকেজ ডিলিট হয়েছে।");
  };

  const addNewPkg = () => {
    const newP: HajjUmrahPackage = {
      id: "PKG-" + Math.floor(100 + Math.random() * 900),
      name: "নতুন ওমরাহ গ্রুপ প্যাকেজ",
      tag: "সীমিত সিট",
      price: 155000,
      makkahHotel: "৩ তারকা হোটেল (৩০০ মিটার)",
      madinahHotel: "৩ তারকা হোটেল (২০০ মিটার)",
      duration: "১৪ দিন",
      transport: "এসি বাস",
      flights: "কানেক্টিং এয়ার",
      features: ["ভিসা প্রসেসিং", "হোটেল ও খাবার", "জিয়ারত"]
    };
    const updated = [...packages, newP];
    setPackagesState(updated);
    savePackages(updated);
    startEditPkg(newP);
    triggerSuccess("নতুন প্যাকেজ তৈরি হয়েছে। অনুগ্রহ করে পরিবর্তন করুন।");
  };

  // ---------------- CITIZEN SERVICES SAVERS ----------------
  const startEditService = (idx: number, serv: CitizenServiceInfo) => {
    setEditingServiceIdx(idx);
    setServiceForm({
      ...serv,
      points: serv.points.join("\n")
    });
  };

  const saveServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingServiceIdx === null) return;
    const updated = [...servicesInfo];
    updated[editingServiceIdx] = {
      ...serviceForm,
      points: serviceForm.points.split("\n").filter((l: string) => l.trim() !== "")
    };
    setServicesInfoState(updated);
    saveServicesInfo(updated);
    setEditingServiceIdx(null);
    triggerSuccess("নাগরিক ও বিএমইটি সেবা বিবরণী আপডেট সম্পন্ন!");
  };

  // ---------------- BOOKING & TRACKING HANDLERS ----------------
  const deleteBooking = (pnr: string, isEnquiry: boolean = false) => {
    if (!confirm(`আপনি কি এই ${isEnquiry ? "অনুসন্ধানটি" : "বুকিংটি"} ডিলিট করতে চান?`)) return;
    if (isEnquiry) {
      const filtered = enquiries.filter(e => e.id !== pnr);
      setEnquiries(filtered);
      localStorage.setItem("probas_enquiries", JSON.stringify(filtered));
    } else {
      const filtered = bookings.filter(b => b.pnr !== pnr);
      setBookings(filtered);
      localStorage.setItem("probas_bookings", JSON.stringify(filtered));
    }
    triggerSuccess("সফলভাবে মুছে ফেলা হয়েছে!");
  };

  const openLogUpdater = (booking: any) => {
    setSelectedBookingForUpdate(booking);
    setNewStatusStep(booking.timelineStep || 1);
    setNewLogMsg("");
    setNewPdfData(booking.pdfData || null);
    setNewPdfName(booking.pdfName || null);
  };

  const submitStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForUpdate) return;

    const isEnquiry = selectedBookingForUpdate.id !== undefined; // Inquiries have id instead of pnr
    
    // Create status updates array if not present
    const updates = selectedBookingForUpdate.updates ? [...selectedBookingForUpdate.updates] : [];
    
    if (newLogMsg.trim()) {
      const newUpd = {
        date: new Date().toLocaleDateString("bn-BD"),
        time: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" }),
        msg: newLogMsg
      };
      updates.unshift(newUpd); // Add to beginning of log
    }

    // Determine status text based on timeline step for client viewing
    let statusText = selectedBookingForUpdate.status;
    if (newStatusStep === 1) statusText = "আবেদন প্রাপ্ত (Submitted)";
    if (newStatusStep === 2) statusText = "নথি যাচাই সম্পন্ন (Verified)";
    if (newStatusStep === 3) statusText = "দূতাবাস / এয়ারলাইন প্রসেসিং চলছে (Processing)";
    if (newStatusStep === 4) statusText = "কনফার্মড (টিকিট/ভিসা ইস্যু সম্পন্ন - Complete)";

    if (isEnquiry) {
      // It's a quick enquiry, map status
      const updated = enquiries.map(e => {
        if (e.id === selectedBookingForUpdate.id) {
          return {
            ...e,
            status: newStatusStep >= 4 ? "সমাধান হয়েছে" : "প্রক্রিয়াধীন",
            timelineStep: newStatusStep,
            updates,
            pdfData: newStatusStep === 4 ? newPdfData : null,
            pdfName: newStatusStep === 4 ? newPdfName : null
          };
        }
        return e;
      });
      setEnquiries(updated);
      localStorage.setItem("probas_enquiries", JSON.stringify(updated));
    } else {
      // It's a main flight/visa/hajj booking
      const updated = bookings.map(b => {
        if (b.pnr === selectedBookingForUpdate.pnr) {
          return {
            ...b,
            status: statusText,
            timelineStep: newStatusStep,
            updates,
            pdfData: newStatusStep === 4 ? newPdfData : null,
            pdfName: newStatusStep === 4 ? newPdfName : null
          };
        }
        return b;
      });
      setBookings(updated);
      localStorage.setItem("probas_bookings", JSON.stringify(updated));
    }

    setSelectedBookingForUpdate(null);
    triggerSuccess("গ্রাহক ট্র্যাকিং টাইমলাইন ও লগ স্ট্যাটাস সফলভাবে আপডেট হয়েছে!");
    loadData(); // Reload stats/view lists
  };

  // ---------------- OFFLINE MANUAL BOOKING ----------------
  const handleManualBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trackingPrefix = manualBookingForm.type === "এয়ার টিকিট" ? "PBT-SV" : manualBookingForm.type === "ভিসা প্রসেসিং" ? "PBT-VISA" : "PBT-GOV";
    const pnr = trackingPrefix + Math.floor(1000 + Math.random() * 9000) + "-MAN";
    
    const newB = {
      pnr,
      type: manualBookingForm.type,
      service: manualBookingForm.service,
      passenger: manualBookingForm.passenger,
      passport: manualBookingForm.passport || "N/A",
      phone: manualBookingForm.phone,
      price: manualBookingForm.price,
      status: manualBookingForm.status,
      bookingDate: new Date().toLocaleDateString("bn-BD"),
      timelineStep: 1,
      updates: [{ date: new Date().toLocaleDateString("bn-BD"), time: "তাৎক্ষণিক", msg: "অফলাইন ম্যানুয়াল বুকিং অ্যাডমিন প্যানেলে নিবন্ধিত হয়েছে।" }]
    };

    const stored = JSON.parse(localStorage.getItem("probas_bookings") || "[]");
    stored.push(newB);
    localStorage.setItem("probas_bookings", JSON.stringify(stored));
    
    setShowManualBookingModal(false);
    setManualBookingForm({
      type: "এয়ার টিকিট",
      service: "DAC ✈️ JED (Manual Admin Booking)",
      passenger: "",
      passport: "",
      phone: "",
      price: "৳ ৫০,০০০",
      status: "কনফার্মড (টিকিট ইস্যু সম্পন্ন)"
    });

    triggerSuccess("নতুন অফলাইন কাস্টমার বুকিং সফলভাবে সিস্টেমে যুক্ত করা হয়েছে!");
    loadData();
  };

  return (
    <ArabicPageShell>
      <PageHeader title="অ্যাডমিন কন্ট্রোল প্যানেল" subtitle="Probas Bangla Agency Live CMS" icon={Settings} backTo="/" />

      <div className="max-w-7xl mx-auto px-4 pb-16">
        
        {/* --- 1. LOGIN WALL --- */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-slate-50 border border-slate-200/90 border-2 border-[#C9A84C]/50 rounded-3xl p-6 md:p-8 relative shadow-2xl space-y-6">
            <CornerOrnaments />
            
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-1">
                <ProbasBanglaLogo className="w-16 h-16 filter drop-shadow-[0_4px_12px_rgba(201,168,76,0.2)]" />
              </div>
              <h2 className="font-bold text-xl text-white">অ্যাডমিন প্রবেশদ্বার (CMS Security)</h2>
              <p className="text-xs text-slate-600">এখান থেকে কোডিং ছাড়াই ওয়েবসাইট এর সকল টিকিট রেট, ওমরাহ প্যাকেজ, নোটিশ এবং কাস্টমার ডাটা পরিবর্তন করতে পারবেন।</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-slate-700 text-xs block mb-1.5 font-semibold">ম্যানেজমেন্ট সিকিউরিটি পাসকোড (Passcode)</label>
                <input 
                  type="password" 
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="পাসকোড লিখুন (যেমন: admin বা 1234)"
                  className="w-full bg-[#FFFFFF] border border-[#C9A84C]/30 rounded-xl px-4 py-3 text-sm text-slate-800 font-bold placeholder-slate-600 focus:outline-none focus:border-[#C9A84C] font-mono text-center tracking-widest"
                />
              </div>

              {loginErr && (
                <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-1.5 leading-snug">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginErr}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-sm rounded-xl cursor-pointer shadow shadow-[#C9A84C]/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Unlock className="w-4 h-4" /> প্রবেশ করুন (Login Console)
              </button>
            </form>

            <div className="text-center pt-2">
              <span className="text-[10px] text-slate-500 font-mono block">সুরক্ষা সতর্কতা: অনুমোদিত ব্যতীত প্রবেশ দণ্ডনীয় অপরাধ।</span>
            </div>
          </div>
        ) : (
          /* --- 2. AUTHENTICATED CONTROL HUB --- */
          <div className="space-y-8 animate-fadeIn">
            
            {/* Success Alert Banner */}
            {statusSuccessMsg && (
              <div className="p-4 bg-slate-900/40 border border-emerald-500/30 text-emerald-300 text-xs md:text-sm rounded-xl flex items-center gap-2 max-w-3xl mx-auto shadow-lg animate-fadeIn">
                <CheckCircle className="w-5 h-5 text-sky-400 shrink-0" />
                <span className="font-semibold leading-relaxed">{statusSuccessMsg}</span>
              </div>
            )}

            {/* Dashboard Sub-Header bar */}
            <div className="bg-slate-50 border border-slate-200/80 border border-[#C9A84C]/25 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/40 text-sky-400 rounded-full flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">প্রবাসবাংলা এজেন্সি লাইভ সিএমএস (Active Session)</h3>
                  <p className="text-[10px] text-slate-600 font-medium">কোড স্পর্শ না করে পুরো এজেন্সির সকল কার্যক্রম পরিচালনা করার কাস্টম কন্ট্রোল ডেস্ক।</p>
                </div>
              </div>
              
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setShowManualBookingModal(true)}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1 shadow"
                >
                  <UserPlus className="w-4 h-4" /> অফলাইন কাস্টমার যোগ করুন
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-red-950/50 hover:bg-red-900 border border-red-500/20 text-red-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  লগআউট (Logout)
                </button>
              </div>
            </div>

            {/* Tabs Selector Rails */}
            <div className="flex overflow-x-auto gap-2 p-1.5 bg-[#FFFFFF]/90 border border-[#C9A84C]/15 rounded-xl no-scrollbar">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === "bookings" ? "bg-[#C9A84C] text-[#FFFFFF]" : "text-slate-600 hover:text-white hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <ClipboardList className="w-4 h-4" /> বুকিং ও ট্র্যাকার ({bookings.length + enquiries.length} টি)
              </button>
              <button
                onClick={() => setActiveTab("global")}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === "global" ? "bg-[#C9A84C] text-[#FFFFFF]" : "text-slate-600 hover:text-white hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <Megaphone className="w-4 h-4" /> সাধারণ নোটিশ ও তথ্য
              </button>
              <button
                onClick={() => setActiveTab("flights")}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === "flights" ? "bg-[#C9A84C] text-[#FFFFFF]" : "text-slate-600 hover:text-white hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <Plane className="w-4 h-4" /> এয়ার টিকিট ও রুট
              </button>
              <button
                onClick={() => setActiveTab("visa")}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === "visa" ? "bg-[#C9A84C] text-[#FFFFFF]" : "text-slate-600 hover:text-white hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <FileText className="w-4 h-4" /> দেশভিত্তিক ভিসা
              </button>
              <button
                onClick={() => setActiveTab("hajj")}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === "hajj" ? "bg-[#C9A84C] text-[#FFFFFF]" : "text-slate-600 hover:text-white hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <Compass className="w-4 h-4" /> ওমরাহ প্যাকেজসমূহ
              </button>
              <button
                onClick={() => setActiveTab("citizen")}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === "citizen" ? "bg-[#C9A84C] text-[#FFFFFF]" : "text-slate-600 hover:text-white hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> BMET ও নাগরিক সেবা
              </button>
            </div>

            {/* --- TAB PANEL CONTENT --- */}
            <div className="bg-slate-50 border border-slate-200/50 border border-[#C9A84C]/15 rounded-3xl p-5 md:p-8 shadow-xl min-h-[400px]">
              
              {/* 1. BOOKINGS & ENQUIRIES TRACKER LIST */}
              {activeTab === "bookings" && (
                <div className="space-y-8">
                  
                  {/* Flight/Visa Bookings Table */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-[#C9A84C] flex items-center gap-1">
                        <ClipboardList className="w-4 h-4" /> অনলাইন টিকেট ও ভিসা বুকিং ডাটাবেজ
                      </h4>
                      <span className="text-[10px] bg-slate-800 text-slate-700 font-mono font-bold px-2 py-0.5 rounded-full">
                        {bookings.length} Records
                      </span>
                    </div>

                    {bookings.length === 0 ? (
                      <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center text-xs text-slate-500">
                        এখনো কোনো টিকিট বা ভিসা বুকিং জমা হয়নি।
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#FFFFFF] border-b border-slate-800 text-slate-600 font-semibold">
                            <tr>
                              <th className="py-3 px-4">ট্র্যাকিং নম্বর (PNR)</th>
                              <th className="py-3 px-4">সেবা</th>
                              <th className="py-3 px-4">যাত্রী / মোবাইল</th>
                              <th className="py-3 px-4">পাসপোর্ট নম্বর</th>
                              <th className="py-3 px-4">ফি/ভাড়া</th>
                              <th className="py-3 px-4">স্ট্যাটাস</th>
                              <th className="py-3 px-4 text-center">অ্যাকশন</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850 text-slate-700">
                            {bookings.map((b, bIdx) => (
                              <tr key={bIdx} className="hover:bg-[#FFFFFF]/40">
                                <td className="py-3 px-4 font-mono font-bold text-sky-400">{b.pnr}</td>
                                <td className="py-3 px-4">
                                  <span className="block font-bold text-white">{b.type}</span>
                                  <span className="text-[10px] text-slate-600 block max-w-[200px] truncate">{b.service}</span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="block font-bold text-white">{b.passenger}</span>
                                  <span className="text-[10px] text-slate-600 font-mono">{b.phone}</span>
                                </td>
                                <td className="py-3 px-4 font-mono uppercase">{b.passport}</td>
                                <td className="py-3 px-4 font-mono font-bold text-[#E2C876]">{b.price}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold inline-block ${
                                    b.timelineStep === 4 ? "bg-slate-900/60 border border-slate-800 text-sky-400" :
                                    b.timelineStep === 3 ? "bg-cyan-950/60 border border-cyan-500/20 text-cyan-400" :
                                    b.timelineStep === 2 ? "bg-yellow-950/60 border border-yellow-500/20 text-yellow-400" :
                                    "bg-slate-850 border border-slate-700/30 text-slate-700"
                                  }`}>
                                    {b.status.split(" (")[0]}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => openLogUpdater(b)}
                                      className="p-1 bg-[#C9A84C]/10 hover:bg-[#C9A84C]/30 border border-[#C9A84C]/25 text-[#C9A84C] rounded font-bold text-[10px] cursor-pointer flex items-center gap-0.5"
                                      title="টাইমলাইন ও ট্র্যাকিং এডিট করুন"
                                    >
                                      <Edit className="w-3 h-3" /> ট্র্যাক করুন
                                    </button>
                                    <button
                                      onClick={() => deleteBooking(b.pnr)}
                                      className="p-1 bg-red-950/20 hover:bg-red-900/60 border border-red-500/20 text-red-400 rounded cursor-pointer"
                                      title="মুছে ফেলুন"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Customer Quick Call-back Enquiries Table */}
                  <div className="space-y-3 pt-6 border-t border-slate-800">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-[#C9A84C] flex items-center gap-1">
                        <Users className="w-4 h-4" /> হোমপেজ কল-ব্যাক রিকোয়েস্ট (Quick Inquiries)
                      </h4>
                      <span className="text-[10px] bg-slate-800 text-slate-700 font-mono font-bold px-2 py-0.5 rounded-full">
                        {enquiries.length} Requests
                      </span>
                    </div>

                    {enquiries.length === 0 ? (
                      <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center text-xs text-slate-500">
                        এখনো কোনো কাস্টমার ইনকোয়ারি জমা হয়নি।
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#FFFFFF] border-b border-slate-800 text-slate-600 font-semibold">
                            <tr>
                              <th className="py-3 px-4">আইডি (ID)</th>
                              <th className="py-3 px-4">গ্রাহকের নাম</th>
                              <th className="py-3 px-4">মোবাইল নম্বর</th>
                              <th className="py-3 px-4">আকাঙ্ক্ষিত সেবা</th>
                              <th className="py-3 px-4">বার্তা/বিবরণ</th>
                              <th className="py-3 px-4">তারিখ</th>
                              <th className="py-3 px-4 text-center">অ্যাকশন</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850 text-slate-700">
                            {enquiries.map((enq, eIdx) => (
                              <tr key={eIdx} className="hover:bg-[#FFFFFF]/40">
                                <td className="py-3 px-4 font-mono font-bold text-[#C9A84C]">{enq.id}</td>
                                <td className="py-3 px-4 font-bold text-white">{enq.name}</td>
                                <td className="py-3 px-4 font-mono font-bold text-slate-200">{enq.phone}</td>
                                <td className="py-3 px-4 font-semibold text-white">
                                  {enq.service === "ticket" ? "🎫 এয়ার টিকিট" :
                                   enq.service === "visa_sa" ? "🇸🇦 সৌদি ভিসা" :
                                   enq.service === "visa_other" ? "🌍 অন্য ভিসা" :
                                   enq.service === "umrah" ? "🕌 ওমরাহ হজ্জ" :
                                   enq.service === "bmet" ? "📋 BMET স্মার্টকার্ড" :
                                   "🛠️ NID/পাসপোর্ট সংশোধন"}
                                </td>
                                <td className="py-3 px-4 max-w-[180px] truncate" title={enq.message}>{enq.message || "কোন বার্তা নেই"}</td>
                                <td className="py-3 px-4 font-mono text-slate-600">{enq.date}</td>
                                <td className="py-3 px-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => openLogUpdater(enq)}
                                      className="p-1 bg-[#C9A84C]/10 hover:bg-[#C9A84C]/30 border border-[#C9A84C]/25 text-[#C9A84C] rounded font-bold text-[10px] cursor-pointer"
                                    >
                                      টাইমলাইন আপডেট
                                    </button>
                                    <button
                                      onClick={() => deleteBooking(enq.id, true)}
                                      className="p-1 bg-red-950/20 hover:bg-red-900/60 border border-red-500/20 text-red-400 rounded cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* 2. GLOBAL APP CONFIGURATION & NOTICE MARQUEE */}
              {activeTab === "global" && globalConfig && (
                <form onSubmit={saveGlobalSettingsSubmit} className="space-y-6">
                  <div className="border-b border-[#C9A84C]/10 pb-3">
                    <h4 className="font-bold text-sm text-[#C9A84C] flex items-center gap-1.5">
                      <Megaphone className="w-4 h-4" /> হটলাইন, হোয়াটসঅ্যাপ ও নোটিশ কনফিগারেশন
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">হোমপেজ ও প্রতিটি সেবার কন্টাক্ট ইনফো এবং স্ক্রলিং নোটিশ পরিবর্তন করুন</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs text-slate-700 block mb-1 font-semibold">হটলাইন মোবাইল (বাংলা হরফে)</label>
                      <input 
                        type="text" 
                        required
                        value={globalConfig.hotline}
                        onChange={(e) => setGlobalConfigState({ ...globalConfig, hotline: e.target.value })}
                        placeholder="+৮৮০১৩১৬৫৬৭৮২১"
                        className="w-full bg-[#FFFFFF] border border-[#C9A84C]/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-700 block mb-1 font-semibold">হটলাইন (ইংরেজি - কলিং লিংক এর জন্য)</label>
                      <input 
                        type="text" 
                        required
                        value={globalConfig.hotlineRaw}
                        onChange={(e) => setGlobalConfigState({ ...globalConfig, hotlineRaw: e.target.value })}
                        placeholder="+8801316567821"
                        className="w-full bg-[#FFFFFF] border border-[#C9A84C]/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs text-slate-700 block mb-1 font-semibold">হোয়াটসঅ্যাপ মোবাইল নম্বর (Country Code সহ, কোনো স্পেস ছাড়া)</label>
                      <input 
                        type="text" 
                        required
                        value={globalConfig.whatsapp}
                        onChange={(e) => setGlobalConfigState({ ...globalConfig, whatsapp: e.target.value })}
                        placeholder="8801316567821"
                        className="w-full bg-[#FFFFFF] border border-[#C9A84C]/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-700 block mb-1 font-semibold">অফিস ইমেইল</label>
                      <input 
                        type="email" 
                        required
                        value={globalConfig.email}
                        onChange={(e) => setGlobalConfigState({ ...globalConfig, email: e.target.value })}
                        placeholder="support@probasbangla.com"
                        className="w-full bg-[#FFFFFF] border border-[#C9A84C]/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-700 block mb-1 font-semibold">টপ নোটিশ বার বা ঘোষণা বার্তা (Scrolling Marquee)</label>
                    <textarea 
                      required
                      value={globalConfig.notice}
                      onChange={(e) => setGlobalConfigState({ ...globalConfig, notice: e.target.value })}
                      rows={3}
                      placeholder="আসসালামু আলাইকুম! ওমরাহ হজ্জ প্রাক-নিবন্ধন চলছে..."
                      className="w-full bg-[#FFFFFF] border border-[#C9A84C]/25 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>

                  {/* Statistics Counters */}
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <h5 className="text-xs font-bold text-white">হোমপেজ পরিসংখ্যান কাউন্টার (Statistics)</h5>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {globalConfig.stats.map((st, sIdx) => (
                        <div key={sIdx} className="bg-[#FFFFFF] border border-[#C9A84C]/15 rounded-xl p-3 space-y-1.5">
                          <span className="text-[10px] text-[#C9A84C] font-mono block">Counter {sIdx + 1}</span>
                          <input 
                            type="text" 
                            value={st.value} 
                            onChange={(e) => handleStatChange(sIdx, "value", e.target.value)}
                            placeholder="১৫,০০০+"
                            className="w-full bg-slate-50 border border-slate-200 border border-slate-800 rounded px-2 py-1 text-xs text-white font-bold text-center"
                          />
                          <input 
                            type="text" 
                            value={st.label} 
                            onChange={(e) => handleStatChange(sIdx, "label", e.target.value)}
                            placeholder="সফল যাত্রী"
                            className="w-full bg-slate-50 border border-slate-200 border border-slate-800 rounded px-2 py-1 text-[10px] text-white font-bold"
                          />
                          <input 
                            type="text" 
                            value={st.desc} 
                            onChange={(e) => handleStatChange(sIdx, "desc", e.target.value)}
                            placeholder="যারা ভ্রমণ করেছেন"
                            className="w-full bg-slate-50 border border-slate-200 border border-slate-800 rounded px-2 py-1 text-[9px] text-slate-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-xl cursor-pointer transition-colors shadow shadow-[#C9A84C]/10"
                  >
                    সেটিংস সংরক্ষণ করুন (Save Configuration)
                  </button>
                </form>
              )}

              {/* 3. FLIGHT RATE & ROUTE MANAGER */}
              {activeTab === "flights" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#C9A84C]/10 pb-3">
                    <div>
                      <h4 className="font-bold text-sm text-[#C9A84C] flex items-center gap-1.5">
                        <Plane className="w-4.5 h-4.5" /> ফ্লাইট তালিকা ও ওয়ান-ওয়ে সিট রেট কনফিগার
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">এয়ারলাইন্সের টিকিট মূল্য, সময়, লাগেজের লিমিট ও ফ্লাইট আইডি পরিবর্তন করুন।</p>
                    </div>
                    
                    <button
                      onClick={addNewFlight}
                      className="px-3 py-1.5 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-4 h-4" /> নতুন ফ্লাইট যোগ করুন
                    </button>
                  </div>

                  {editingFlightId && (
                    /* --- SUB FORM TO EDIT SELECTED FLIGHT --- */
                    <form onSubmit={saveFlightSubmit} className="bg-[#FFFFFF]/90 border border-[#C9A84C]/40 rounded-2xl p-4 md:p-5 space-y-4 animate-fadeIn">
                      <div className="flex justify-between items-center border-b border-[#C9A84C]/15 pb-2 mb-2">
                        <span className="text-xs font-bold text-[#C9A84C]">ফ্লাইট এডিট করুন (ID: {editingFlightId})</span>
                        <button type="button" onClick={() => setEditingFlightId(null)} className="text-slate-600 hover:text-white text-xs">বাতিল</button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">এয়ারলাইন (Airline Name)</label>
                          <input 
                            type="text" 
                            required
                            value={flightForm.airline || ""}
                            onChange={(e) => setFlightForm({ ...flightForm, airline: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">এয়ারলাইন কোড (যেমন: BG, SV)</label>
                          <input 
                            type="text" 
                            required
                            value={flightForm.code || ""}
                            onChange={(e) => setFlightForm({ ...flightForm, code: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white font-mono uppercase"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">ফ্লাইট আইডি (Flight ID)</label>
                          <input 
                            type="text" 
                            required
                            value={flightForm.id || ""}
                            onChange={(e) => setFlightForm({ ...flightForm, id: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white font-mono uppercase"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">ট্রানজিট / স্টপওভার</label>
                          <input 
                            type="text" 
                            required
                            value={flightForm.stopover || ""}
                            onChange={(e) => setFlightForm({ ...flightForm, stopover: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">ডিপার্চার সময় (Departure - 24H)</label>
                          <input 
                            type="text" 
                            required
                            value={flightForm.departure || ""}
                            onChange={(e) => setFlightForm({ ...flightForm, departure: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">অ্যারাইভাল সময় (Arrival)</label>
                          <input 
                            type="text" 
                            required
                            value={flightForm.arrival || ""}
                            onChange={(e) => setFlightForm({ ...flightForm, arrival: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">ফ্লাইট সময়কাল (Duration)</label>
                          <input 
                            type="text" 
                            required
                            value={flightForm.duration || ""}
                            onChange={(e) => setFlightForm({ ...flightForm, duration: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">লাগেজ সীমা (Baggage Allow)</label>
                          <input 
                            type="text" 
                            required
                            value={flightForm.baggage || ""}
                            onChange={(e) => setFlightForm({ ...flightForm, baggage: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">ইকোনমি ওয়ান-ওয়ে ভাড়া (৳)</label>
                          <input 
                            type="number" 
                            required
                            value={flightForm.economyPrice || 0}
                            onChange={(e) => setFlightForm({ ...flightForm, economyPrice: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-[#E2C876] font-bold font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">বিজনেস ক্লাস ওয়ান-ওয়ে ভাড়া (৳)</label>
                          <input 
                            type="number" 
                            required
                            value={flightForm.businessPrice || 0}
                            onChange={(e) => setFlightForm({ ...flightForm, businessPrice: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-[#E2C876] font-bold font-mono"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        ফ্লাইট সেভ করুন (Save Flight)
                      </button>
                    </form>
                  )}

                  {/* Flight List Table */}
                  <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FFFFFF] border-b border-slate-800 text-slate-600 font-semibold">
                        <tr>
                          <th className="py-3 px-4">আইডি</th>
                          <th className="py-3 px-4">এয়ারলাইন</th>
                          <th className="py-3 px-4 font-mono">সময় (DEP-ARR)</th>
                          <th className="py-3 px-4">স্টপওভার</th>
                          <th className="py-3 px-4">ইকোনমি ভাড়া</th>
                          <th className="py-3 px-4">বিজনেস ভাড়া</th>
                          <th className="py-3 px-4">লাগেজ</th>
                          <th className="py-3 px-4 text-center">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850 text-slate-700">
                        {flights.map((f) => (
                          <tr key={f.id} className="hover:bg-[#FFFFFF]/40">
                            <td className="py-3 px-4 font-mono font-bold text-[#C9A84C]">{f.id}</td>
                            <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                              <span>{f.logo}</span>
                              <span>{f.airline}</span>
                            </td>
                            <td className="py-3 px-4 font-mono">{f.departure} - {f.arrival} ({f.duration})</td>
                            <td className="py-3 px-4">{f.stopover}</td>
                            <td className="py-3 px-4 font-mono text-[#E2C876] font-bold">৳ {f.economyPrice.toLocaleString("bn-BD")}</td>
                            <td className="py-3 px-4 font-mono text-[#E2C876] font-bold">৳ {f.businessPrice.toLocaleString("bn-BD")}</td>
                            <td className="py-3 px-4">{f.baggage}</td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex justify-center gap-1">
                                <button
                                  onClick={() => startEditFlight(f)}
                                  className="p-1.5 bg-[#C9A84C]/10 hover:bg-[#C9A84C]/30 border border-[#C9A84C]/25 text-[#C9A84C] rounded cursor-pointer"
                                  title="এডিট"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteFlight(f.id)}
                                  className="p-1.5 bg-red-950/20 hover:bg-red-900/60 border border-red-500/20 text-red-400 rounded cursor-pointer"
                                  title="ডিলিট"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Popular Routes Prices */}
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <h5 className="text-xs font-bold text-white">হোমপেজ জনপ্রিয় রুট ও ওয়ান-ওয়ে সর্বনিম্ন ভাড়া (৳)</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {destinations.map((dest, dIdx) => (
                        <div key={dIdx} className="bg-[#FFFFFF] border border-[#C9A84C]/15 rounded-xl p-3 space-y-1.5">
                          <span className="text-[10px] text-[#C9A84C] font-mono block font-bold">{dest.name}</span>
                          <label className="text-[8px] text-slate-600 block leading-none">ভাড়া টেক্সট</label>
                          <input 
                            type="text" 
                            value={dest.price} 
                            onChange={(e) => {
                              const updated = [...destinations];
                              updated[dIdx] = { ...dest, price: e.target.value };
                              setDestinationsState(updated);
                              saveDestinations(updated);
                            }}
                            placeholder="৳ ৫২,০০০"
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1 text-xs text-[#E2C876] font-bold font-mono"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* 4. COUNTRY-WISE VISA PROPOSALS EDITOR */}
              {activeTab === "visa" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#C9A84C]/10 pb-3">
                    <div>
                      <h4 className="font-bold text-sm text-[#C9A84C] flex items-center gap-1.5">
                        <FileText className="w-4.5 h-4.5" /> দেশভিত্তিক ভিসা রিকোয়ারমেন্টস ও সার্ভিস ফি
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">ভিসা ক্যাটাগরি, প্রয়োজনীয় কাগজের চেকলিস্ট ও প্রসেসিং সময় পরিবর্তন করুন।</p>
                    </div>
                    
                    <button
                      onClick={addNewVisaType}
                      className="px-3 py-1.5 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-4 h-4" /> নতুন ভিসা যুক্ত করুন
                    </button>
                  </div>

                  {/* Active country filter pill inside CMS */}
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(visaData).map((countryKey) => (
                      <button
                        key={countryKey}
                        onClick={() => {
                          setSelectedVisaCountry(countryKey);
                          setEditingVisaTypeIdx(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                          selectedVisaCountry === countryKey 
                            ? "bg-[#C9A84C] text-[#FFFFFF] border-[#C9A84C]" 
                            : "bg-[#FFFFFF] border-slate-800 text-slate-600"
                        }`}
                      >
                        <span>{visaData[countryKey].flag}</span>
                        <span>{visaData[countryKey].country.split(" (")[0]}</span>
                      </button>
                    ))}
                  </div>

                  {/* Editing block */}
                  {editingVisaTypeIdx !== null && (
                    <form onSubmit={saveVisaTypeSubmit} className="bg-[#FFFFFF]/90 border border-[#C9A84C]/40 rounded-2xl p-4 md:p-5 space-y-4 animate-fadeIn">
                      <div className="flex justify-between items-center border-b border-[#C9A84C]/15 pb-2 mb-2">
                        <span className="text-xs font-bold text-[#C9A84C]">ভিসা টাইপ সংশোধন করুন (দেশ: {visaData[selectedVisaCountry].country})</span>
                        <button type="button" onClick={() => setEditingVisaTypeIdx(null)} className="text-slate-600 hover:text-white text-xs">বাতিল</button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">ভিসার নাম (Visa Category Name)</label>
                          <input 
                            type="text" 
                            required
                            value={visaTypeForm.name || ""}
                            onChange={(e) => setVisaTypeForm({ ...visaTypeForm, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">ভিসা মেয়াদ (Stay Duration)</label>
                          <input 
                            type="text" 
                            required
                            value={visaTypeForm.duration || ""}
                            onChange={(e) => setVisaTypeForm({ ...visaTypeForm, duration: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">প্রসেসিং সময় (Processing Duration)</label>
                          <input 
                            type="text" 
                            required
                            value={visaTypeForm.processing || ""}
                            onChange={(e) => setVisaTypeForm({ ...visaTypeForm, processing: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">সার্ভিস ফি ও ট্যাক্স (Price text)</label>
                          <input 
                            type="text" 
                            required
                            value={visaTypeForm.price || ""}
                            onChange={(e) => setVisaTypeForm({ ...visaTypeForm, price: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-[#E2C876] font-bold font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-600 block mb-1">প্রয়োজনীয় কাগজপত্রের তালিকা (প্রতি লাইনে একটি করে ডকুমেন্ট)</label>
                        <textarea 
                          required
                          value={visaTypeForm.docs || ""}
                          onChange={(e) => setVisaTypeForm({ ...visaTypeForm, docs: e.target.value })}
                          rows={4}
                          className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        ভিসা ডাটা সেভ করুন (Save Visa Variant)
                      </button>
                    </form>
                  )}

                  {/* Visa types table */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-white block">সক্রিয় ভিসা প্যাকেজসমূহ ({visaData[selectedVisaCountry]?.country})</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {visaData[selectedVisaCountry]?.types.map((vt: any, index: number) => (
                        <div key={index} className="bg-[#FFFFFF] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h5 className="font-bold text-white text-xs md:text-sm">{vt.name}</h5>
                              <span className="text-[10px] font-bold text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-2 py-0.5 rounded-full">
                                {vt.processing}
                              </span>
                            </div>
                            
                            <p className="text-[10px] text-slate-600">মেয়াদ: {vt.duration} • ফি: <span className="font-bold text-[#E2C876] font-mono">{vt.price}</span></p>
                            
                            <div className="text-[10px] text-slate-700">
                              <span className="font-bold text-[#C9A84C]">ডকুমেন্টস: </span>
                              {vt.docs.join(", ")}
                            </div>
                          </div>

                          <div className="pt-3.5 mt-3.5 border-t border-slate-850 flex justify-end gap-1.5">
                            <button
                              onClick={() => startEditVisaType(index, vt)}
                              className="px-2.5 py-1 bg-[#C9A84C]/10 hover:bg-[#C9A84C]/30 border border-[#C9A84C]/25 text-[#C9A84C] font-bold text-[10px] rounded cursor-pointer"
                            >
                              এডিট করুন
                            </button>
                            <button
                              onClick={() => deleteVisaType(index)}
                              className="p-1 bg-red-950/20 hover:bg-red-900/60 border border-red-500/20 text-red-400 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* 5. HAJJ & UMRAH PACKAGES EDITOR */}
              {activeTab === "hajj" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#C9A84C]/10 pb-3">
                    <div>
                      <h4 className="font-bold text-sm text-[#C9A84C] flex items-center gap-1.5">
                        <Compass className="w-4.5 h-4.5" /> হজ্জ ও ওমরাহ হজ্জ প্যাকেজ সিএমএস
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">ওমরাহ প্যাকেজের হোটেল ক্যাটাগরি, মূল্য, বিমান রুট ও সুবিধা সমুহ এডিট করুন।</p>
                    </div>
                    
                    <button
                      onClick={addNewPkg}
                      className="px-3 py-1.5 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-4 h-4" /> নতুন প্যাকেজ যোগ করুন
                    </button>
                  </div>

                  {editingPkgId && (
                    <form onSubmit={savePkgSubmit} className="bg-[#FFFFFF]/90 border border-[#C9A84C]/40 rounded-2xl p-4 md:p-5 space-y-4 animate-fadeIn">
                      <div className="flex justify-between items-center border-b border-[#C9A84C]/15 pb-2 mb-2">
                        <span className="text-xs font-bold text-[#C9A84C]">প্যাকেজ মডিফাই (ID: {editingPkgId})</span>
                        <button type="button" onClick={() => setEditingPkgId(null)} className="text-slate-600 hover:text-white text-xs">বাতিল</button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">প্যাকেজের নাম (Package Title)</label>
                          <input 
                            type="text" 
                            required
                            value={pkgForm.name || ""}
                            onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">প্যাকেজ ট্যাগ (যেমন: বেস্ট সেলিং, ভিআইপি)</label>
                          <input 
                            type="text" 
                            required
                            value={pkgForm.tag || ""}
                            onChange={(e) => setPkgForm({ ...pkgForm, tag: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">প্যাকেজ মূল্য (জনপ্রতি ৳)</label>
                          <input 
                            type="number" 
                            required
                            value={pkgForm.price || 0}
                            onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-[#E2C876] font-bold font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">ভ্রমণ সময়কাল (যেমন: ১৪ দিন)</label>
                          <input 
                            type="text" 
                            required
                            value={pkgForm.duration || ""}
                            onChange={(e) => setPkgForm({ ...pkgForm, duration: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">মক্কা হোটেল (দূরত্বসহ)</label>
                          <input 
                            type="text" 
                            required
                            value={pkgForm.makkahHotel || ""}
                            onChange={(e) => setPkgForm({ ...pkgForm, makkahHotel: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">মদিনা হোটেল (দূরত্বসহ)</label>
                          <input 
                            type="text" 
                            required
                            value={pkgForm.madinahHotel || ""}
                            onChange={(e) => setPkgForm({ ...pkgForm, madinahHotel: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">এসি ট্রান্সপোর্ট সুবিধা</label>
                          <input 
                            type="text" 
                            required
                            value={pkgForm.transport || ""}
                            onChange={(e) => setPkgForm({ ...pkgForm, transport: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">ব্যবহৃত এয়ারলাইন্স রুট</label>
                          <input 
                            type="text" 
                            required
                            value={pkgForm.flights || ""}
                            onChange={(e) => setPkgForm({ ...pkgForm, flights: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-600 block mb-1">প্যাকেজে অন্তর্ভুক্ত সুবিধাগুলোর চেকলিস্ট (প্রতি লাইনে ১টি)</label>
                        <textarea 
                          required
                          value={pkgForm.features || ""}
                          onChange={(e) => setPkgForm({ ...pkgForm, features: e.target.value })}
                          rows={4}
                          className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        প্যাকেজ সেভ করুন (Save Package)
                      </button>
                    </form>
                  )}

                  {/* Packages grid inside Admin panel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {packages.map((pkg) => (
                      <div key={pkg.id} className="bg-[#FFFFFF] border border-slate-800 rounded-3xl p-5 flex flex-col justify-between relative">
                        <span className="absolute top-4 right-5 px-2.5 py-0.5 bg-[#C9A84C] text-[#FFFFFF] text-[9px] font-bold rounded-full">
                          {pkg.tag}
                        </span>

                        <div className="space-y-3">
                          <div>
                            <h5 className="font-bold text-white text-xs md:text-sm pr-16">{pkg.name}</h5>
                            <span className="text-[10px] text-slate-600 font-mono block mt-0.5">{pkg.duration}</span>
                          </div>

                          <div className="text-xs text-[#E2C876] font-mono font-bold leading-none">
                            ৳ {pkg.price.toLocaleString("bn-BD")} / জনপ্রতি
                          </div>

                          <div className="space-y-1 text-[10px] text-slate-700">
                            <div><span className="text-slate-600">মক্কা হোটেল:</span> {pkg.makkahHotel}</div>
                            <div><span className="text-slate-600">মদিনা হোটেল:</span> {pkg.madinahHotel}</div>
                            <div><span className="text-slate-600">ফ্লাইট ও বাস:</span> {pkg.flights} • {pkg.transport}</div>
                          </div>
                        </div>

                        <div className="pt-3.5 mt-3.5 border-t border-slate-850 flex justify-end gap-1.5">
                          <button
                            onClick={() => startEditPkg(pkg)}
                            className="px-2.5 py-1.5 bg-[#C9A84C]/10 hover:bg-[#C9A84C]/30 border border-[#C9A84C]/25 text-[#C9A84C] font-bold text-[10px] rounded-lg cursor-pointer"
                          >
                            প্যাকেজ এডিট
                          </button>
                          <button
                            onClick={() => deletePkg(pkg.id)}
                            className="p-1.5 bg-red-950/20 hover:bg-red-900/60 border border-red-500/20 text-red-400 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* 6. CITIZEN & GOVERNMENT SERVICES EDITOR */}
              {activeTab === "citizen" && (
                <div className="space-y-6">
                  <div className="border-b border-[#C9A84C]/10 pb-3">
                    <h4 className="font-bold text-sm text-[#C9A84C] flex items-center gap-1.5">
                      <ShieldCheck className="w-4.5 h-4.5" /> BMET স্মার্টকার্ড, NID ও পাসপোর্ট সংশোধন ডেস্ক
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">নাগরিক এবং বিএমইটি সহায়তা সেবাসমূহের মূল্য ও সরকারি বিবরণী সংশোধন করুন।</p>
                  </div>

                  {editingServiceIdx !== null && (
                    <form onSubmit={saveServiceSubmit} className="bg-[#FFFFFF]/90 border border-[#C9A84C]/40 rounded-2xl p-4 md:p-5 space-y-4 animate-fadeIn">
                      <div className="flex justify-between items-center border-b border-[#C9A84C]/15 pb-2 mb-2">
                        <span className="text-xs font-bold text-[#C9A84C]">সেবা বিবরণ সংশোধন</span>
                        <button type="button" onClick={() => setEditingServiceIdx(null)} className="text-slate-600 hover:text-white text-xs">বাতিল</button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">সেবার শিরোনাম (Service Title)</label>
                          <input 
                            type="text" 
                            required
                            value={serviceForm.title || ""}
                            onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">সাবটাইটেল (Subtitle / English name)</label>
                          <input 
                            type="text" 
                            required
                            value={serviceForm.subtitle || ""}
                            onChange={(e) => setServiceForm({ ...serviceForm, subtitle: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">আনুমানিক খরচ / ফি টেক্সট</label>
                          <input 
                            type="text" 
                            required
                            value={serviceForm.price || ""}
                            onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-yellow-400 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">ছোট বর্ণনা (Short Description)</label>
                          <input 
                            type="text" 
                            required
                            value={serviceForm.desc || ""}
                            onChange={(e) => setServiceForm({ ...serviceForm, desc: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-2 py-1.5 text-xs text-slate-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-600 block mb-1">প্রক্রিয়াজাত অন্তর্ভুক্ত কাজের চেকলিস্ট (প্রতি লাইনে ১টি)</label>
                        <textarea 
                          required
                          value={serviceForm.points || ""}
                          onChange={(e) => setServiceForm({ ...serviceForm, points: e.target.value })}
                          rows={4}
                          className="w-full bg-slate-50 border border-slate-200 border border-[#C9A84C]/20 rounded px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        সেবা বিবরণী সেভ করুন
                      </button>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {servicesInfo.map((serv, index) => (
                      <div key={index} className="bg-[#FFFFFF] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-bold text-white text-xs md:text-sm leading-tight">{serv.title}</h5>
                            <span className="text-[10px] text-[#C9A84C] font-mono block mt-0.5">{serv.subtitle}</span>
                          </div>

                          <p className="text-[11px] text-slate-600 leading-normal italic">{serv.desc}</p>
                          <span className="text-[11px] font-bold text-yellow-400 block">{serv.price}</span>
                        </div>

                        <button
                          onClick={() => startEditService(index, serv)}
                          className="px-3 py-1.5 bg-[#C9A84C]/10 hover:bg-[#C9A84C]/30 border border-[#C9A84C]/25 text-[#C9A84C] font-bold text-[10px] rounded-lg cursor-pointer mt-4 self-end"
                        >
                          এডিট বিবরণী
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* --- TIME & LOG HISTORY DIALOG MODAL --- */}
      {selectedBookingForUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-50 border border-slate-200 border border-[#C9A84C]/50 rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
            <CornerOrnaments />
            
            <button 
              onClick={() => setSelectedBookingForUpdate(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-600 hover:text-white rounded-full bg-[#FFFFFF] border border-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-[#C9A84C] tracking-wider uppercase block">লাইভ ট্র্যাকিং ইঞ্জিন (Expat Live Tracker)</span>
              <h3 className="font-bold text-base text-white">গ্রাহক ট্র্যাকিং আপডেট</h3>
              
              <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#C9A84C]/10 text-xs text-slate-700 mt-2.5 space-y-1">
                <div>যাত্রী/আবেদনকারী: <span className="font-bold text-white">{selectedBookingForUpdate.passenger || selectedBookingForUpdate.name}</span></div>
                <div>আইডি / PNR: <span className="font-bold text-[#E2C876] font-mono">{selectedBookingForUpdate.pnr || selectedBookingForUpdate.id}</span></div>
                <div>ক্যাটাগরি: <span className="font-bold text-white">{selectedBookingForUpdate.type}</span></div>
              </div>
            </div>

            <form onSubmit={submitStatusUpdate} className="space-y-4">
              <div>
                <label className="text-slate-700 text-xs block mb-1.5 font-semibold">টাইমলাইন অবস্থান (Timeline Level)</label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { step: 1, label: "আবেদন প্রাপ্ত" },
                    { step: 2, label: "নথি ভেরিফাই" },
                    { step: 3, label: "প্রসেসিং চলছে" },
                    { step: 4, label: "ডকুমেন্ট রেডি" }
                  ].map((m) => (
                    <button
                      key={m.step}
                      type="button"
                      onClick={() => setNewStatusStep(m.step)}
                      className={`py-1.5 px-1 font-bold text-[10px] rounded cursor-pointer border transition-all text-center leading-tight ${
                        newStatusStep === m.step 
                          ? "bg-[#C9A84C] border-[#C9A84C] text-[#FFFFFF]" 
                          : "bg-[#FFFFFF] border-slate-800 text-slate-600 hover:text-white"
                      }`}
                    >
                      <div className="font-bold">{m.step}</div>
                      <div>{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* PDF Upload Section (Only visible if status step is 4 (Completed) */}
              {newStatusStep === 4 && (
                <div className="p-3 bg-[#C9A84C]/5 border border-[#C9A84C]/30 rounded-xl space-y-2 animate-fadeIn text-slate-800">
                  <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#C9A84C]" />
                    <span>কনফার্মড ডকুমেন্ট PDF আপলোড (সর্বোচ্চ ৩ মেগাবাইট)</span>
                  </label>
                  
                  {newPdfName ? (
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-[#C9A84C]/20 text-xs">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{newPdfName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNewPdfData(null);
                          setNewPdfName(null);
                        }}
                        className="text-red-600 hover:text-red-800 font-bold shrink-0 p-1 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                        title="রিমুভ করুন"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-[#C9A84C]/30 hover:border-[#C9A84C]/60 rounded-xl p-4 transition-colors bg-white flex flex-col items-center justify-center cursor-pointer">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 3 * 1024 * 1024) {
                              alert("ফাইলের সাইজ ৩ মেগাবাইটের কম হতে হবে!");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setNewPdfData(event.target.result as string);
                                setNewPdfName(file.name);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload className="w-6 h-6 text-[#C9A84C] mb-1" />
                      <span className="text-[11px] text-slate-600 text-center font-bold">ক্লিক করে কাস্টমারের ই-টিকিট বা ভিসা PDF ফাইলটি আপলোড করুন</span>
                      <span className="text-[9px] text-slate-500 text-center font-mono mt-0.5">PDF ফাইল শুধু (Max 3MB)</span>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="text-slate-700 text-xs block mb-1 font-semibold">নতুন কার্যক্রমের বিবরণী দিন (Log History Line)</label>
                <textarea 
                  value={newLogMsg}
                  onChange={(e) => setNewLogMsg(e.target.value)}
                  placeholder="উদাঃ ভিসা পাসপোর্ট সফলভাবে মতিঝিল হেড অফিসে পৌঁছেছে। আগামীকাল পাসপোর্ট সংগ্রহ করতে পারবেন।"
                  rows={3}
                  className="w-full bg-[#FFFFFF] border border-[#C9A84C]/25 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#C9A84C] resize-none"
                />
                <span className="text-[9px] text-slate-500 leading-none mt-1 block">খালি রাখলে শুধু টাইমলাইন ধাপটি পরিবর্তিত হবে।</span>
              </div>

              {/* Display existing updates history */}
              {selectedBookingForUpdate.updates && selectedBookingForUpdate.updates.length > 0 && (
                <div className="space-y-1.5 max-h-[120px] overflow-y-auto bg-[#FFFFFF] p-2.5 rounded-xl border border-slate-850">
                  <span className="text-[9px] font-bold text-[#C9A84C] block uppercase">ইতিপূর্বের হিস্ট্রি লগ:</span>
                  <div className="space-y-1.5 pl-1.5 border-l border-slate-800 text-[10px]">
                    {selectedBookingForUpdate.updates.map((up: any, uIdx: number) => (
                      <div key={uIdx} className="text-slate-600">
                        <span className="font-mono text-[9px]">{up.date} {up.time}: </span>
                        <span>{up.msg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-xl cursor-pointer"
              >
                টাইমলাইন ও ট্র্যাক লগ আপডেট করুন (Publish Log)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- OFFLINE MANUAL BOOKING CREATOR MODAL --- */}
      {showManualBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-50 border border-slate-200 border border-[#C9A84C]/50 rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
            <CornerOrnaments />
            
            <button 
              onClick={() => setShowManualBookingModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-600 hover:text-white rounded-full bg-[#FFFFFF] border border-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-[#C9A84C] tracking-wider uppercase block">কাস্টমার প্রাক-নিবন্ধন ডেস্ক</span>
              <h3 className="font-bold text-lg text-white">ম্যানুয়াল কাস্টমার বুকিং যোগ করুন</h3>
              <p className="text-[10px] text-slate-600">অফিসিয়াল ফোন কল বা অফলাইন গ্রাহকদের ট্র্যাকিং এর সুবিধার্থে সিস্টেমে রেকর্ড যুক্ত করুন।</p>
            </div>

            <form onSubmit={handleManualBookingSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 text-[10px] block mb-1">সেবার ক্যাটাগরি *</label>
                  <select 
                    value={manualBookingForm.type}
                    onChange={(e) => setManualBookingForm({ ...manualBookingForm, type: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#C9A84C]/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="এয়ার টিকিট">🎫 এয়ার টিকিট</option>
                    <option value="ভিসা প্রসেসিং">🌍 ভিসা প্রসেসিং</option>
                    <option value="হজ্জ ও ওমরাহ">🕌 হজ্জ ও ওমরাহ</option>
                    <option value="BMET ও অন্যান্য">📋 BMET ও নাগরিক</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 text-[10px] block mb-1">নির্দিষ্ট রুট / সেবা নাম *</label>
                  <input 
                    type="text" 
                    required
                    value={manualBookingForm.service}
                    onChange={(e) => setManualBookingForm({ ...manualBookingForm, service: e.target.value })}
                    placeholder="উদাঃ DAC ✈️ JED (Saudia)"
                    className="w-full bg-[#FFFFFF] border border-[#C9A84C]/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 text-[11px] block mb-1">যাত্রী / কাস্টমার এর নাম *</label>
                <input 
                  type="text" 
                  required
                  value={manualBookingForm.passenger}
                  onChange={(e) => setManualBookingForm({ ...manualBookingForm, passenger: e.target.value })}
                  placeholder="উদাঃ MOHAMMAD HABIBUR RAHMAN"
                  className="w-full bg-[#FFFFFF] border border-[#C9A84C]/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 text-[10px] block mb-1">পাসপোর্ট নম্বর (ঐচ্ছিক)</label>
                  <input 
                    type="text" 
                    value={manualBookingForm.passport}
                    onChange={(e) => setManualBookingForm({ ...manualBookingForm, passport: e.target.value })}
                    placeholder="উদাঃ A01234567"
                    className="w-full bg-[#FFFFFF] border border-[#C9A84C]/25 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 text-[10px] block mb-1">মোবাইল নম্বর *</label>
                  <input 
                    type="tel" 
                    required
                    value={manualBookingForm.phone}
                    onChange={(e) => setManualBookingForm({ ...manualBookingForm, phone: e.target.value })}
                    placeholder="উদাঃ ০১৩১৬৫৬৭৮২১"
                    className="w-full bg-[#FFFFFF] border border-[#C9A84C]/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 text-[10px] block mb-1">মোট মূল্য / ফি *</label>
                  <input 
                    type="text" 
                    required
                    value={manualBookingForm.price}
                    onChange={(e) => setManualBookingForm({ ...manualBookingForm, price: e.target.value })}
                    placeholder="৳ ৫৪,৫০০"
                    className="w-full bg-[#FFFFFF] border border-[#C9A84C]/25 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 text-[10px] block mb-1">প্রাথমিক স্ট্যাটাস *</label>
                  <input 
                    type="text" 
                    required
                    value={manualBookingForm.status}
                    onChange={(e) => setManualBookingForm({ ...manualBookingForm, status: e.target.value })}
                    placeholder="কনফার্মড (টিকিট ইস্যু সম্পন্ন)"
                    className="w-full bg-[#FFFFFF] border border-[#C9A84C]/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-xl cursor-pointer"
              >
                সিস্টেমে বুকিং জেনারেট করুন (Generate Booking)
              </button>
            </form>
          </div>
        </div>
      )}

    </ArabicPageShell>
  );
}
