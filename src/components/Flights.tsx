import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PageHeader from "./PageHeader";
import ArabicPageShell from "./arabic/ArabicPageShell";
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Clock, 
  Luggage, 
  Users, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Ticket, 
  X,
  Share2,
  Upload,
  FileDown
} from "lucide-react";
import { GOLD, CornerOrnaments } from "./arabic/ArabicDecor";
import { getFlights, getGlobalConfig } from "../utils/dynamicData";
import { downloadReceiptPdf } from "../utils/pdfGenerator";

export default function Flights() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [globalConfig] = useState(getGlobalConfig());

  // Search Fields
  const [from, setFrom] = useState(searchParams.get("from") || "DAC");
  const [to, setTo] = useState(searchParams.get("to") || "JED");
  const [date, setDate] = useState(searchParams.get("date") || "2026-07-15");
  const [cabinClass, setCabinClass] = useState(searchParams.get("class") || "Economy");

  const [hasSearched, setHasSearched] = useState(true);
  const [flightResults, setFlightResults] = useState<any[]>([]);

  // Booking process states
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  
  // Checkout Form fields
  const [passengerName, setPassengerName] = useState("");
  const [passengerPassport, setPassengerPassport] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [passengerFile, setPassengerFile] = useState<File | null>(null);
  const passengerFileRef = useRef<HTMLInputElement>(null);

  // Trigger search on mount/param change
  useEffect(() => {
    handleSearch();
  }, [searchParams, cabinClass, to, from]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasSearched(true);
    
    // Adjust prices slightly based on route to make it feel authentic
    const isSaudi = to === "JED" || to === "RUH";
    const multiplier = to === "DXB" ? 0.85 : to === "MCT" || to === "DOH" ? 0.92 : 1.1;

    const flightsData = getFlights();
    const filtered = flightsData.map(flight => {
      let basePrice = cabinClass === "Economy" ? flight.economyPrice : flight.businessPrice;
      let finalPrice = Math.round(basePrice * multiplier);
      
      return {
        ...flight,
        price: finalPrice
      };
    }).filter(flight => {
      // Simulate Saudia/Biman primarily for Saudi routes, Gulf Air for UAE/Bahrain etc.
      if (isSaudi) return true;
      if (to === "DXB" && flight.code === "SV") return false; // SV doesn't serve direct DAC-DXB in this template
      return true;
    });

    setFlightResults(filtered);
  };

  const startBooking = (flight: any) => {
    setSelectedFlight(flight);
    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerName || !passengerPassport || !passengerPhone) return;

    if (!passengerFile) {
      alert("দয়া করে পাসপোর্টের রঙিন ছবি বা কপি আপলোড করুন। ফাইল আপলোড করা বাধ্যতামূলক।");
      return;
    }

    const pnr = "PBT-" + selectedFlight.code + Math.floor(1000 + Math.random() * 9000) + "-26";
    const booking = {
      pnr,
      type: "এয়ার টিকিট",
      service: `${from} ✈️ ${to} (${selectedFlight.airline})` + ` (সংযুক্ত পাসপোর্ট: ${passengerFile.name})`,
      flightId: selectedFlight.id,
      date: date,
      time: selectedFlight.departure,
      class: cabinClass,
      passenger: passengerName,
      passport: passengerPassport,
      phone: passengerPhone,
      price: selectedFlight.price,
      status: "কনফার্মড (টিকিট ইস্যু সম্পন্ন)",
      baggage: selectedFlight.baggage,
      bookingDate: new Date().toLocaleDateString("bn-BD")
    };

    // Save to localStorage so Status Checker can query it
    const stored = JSON.parse(localStorage.getItem("probas_bookings") || "[]");
    stored.push(booking);
    localStorage.setItem("probas_bookings", JSON.stringify(stored));

    setBookingSuccess(booking);
    setShowCheckoutModal(false);

    // Automatically trigger PDF download
    downloadReceiptPdf({
      title: "এয়ার টিকিট বুকিং রসিদ",
      pnr: booking.pnr,
      passenger: booking.passenger,
      phone: booking.phone,
      passport: booking.passport,
      service: `${booking.service} (ফ্লাইট: ${booking.flightId})`,
      price: `৳ ${booking.price.toLocaleString("bn-BD")}`,
      date: `${booking.date} (${booking.time})`,
      status: booking.status,
      additional: [
        { label: "লাগেজ লিমিট (Baggage):", value: booking.baggage }
      ]
    });
  };

  const resetBooking = () => {
    setSelectedFlight(null);
    setBookingSuccess(null);
    setPassengerName("");
    setPassengerPassport("");
    setPassengerPhone("");
    setPassengerFile(null);
  };

  return (
    <ArabicPageShell>
      <PageHeader title="এয়ার টিকিট বুকিং" subtitle="Air Ticketing Center" icon={Plane} backTo="/" />

      <div className="max-w-6xl mx-auto px-4 pb-12">
        
        {/* Airplane flight banner with overlay details */}
        <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden shadow-xl border-4 border-white mb-8 group">
          <img 
            src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1200" 
            alt="Commercial airliner flying"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#032F1E]/95 via-[#032F1E]/55 to-transparent" />
          
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-center space-y-2 md:space-y-3 z-10">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#C9A84C] bg-[#032F1E] px-3 py-1.5 rounded-full w-max">
              ✈️ প্রবাসবাংলা স্পেশাল বিমান অফার
            </span>
            <h2 className="text-xl md:text-3xl font-extrabold text-white leading-tight">
              কম খরচে নির্ভরযোগ্য এয়ার টিকিট বুকিং
            </h2>
            <p className="text-xs md:text-sm text-slate-200 max-w-md">
              সৌদি আরব, দুবাই, কাতার, কুয়ালালামপুর ও ওমান সহ বিশ্বের যেকোনো রুটের টিকিট বুক করুন সবচেয়ে সাশ্রয়ী দামে। ২৪/৭ কাস্টমার সহায়তা।
            </p>
          </div>

          <div className="absolute bottom-4 right-4 bg-emerald-600 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>১০০% কনফার্মড এয়ারলাইন্স সিট</span>
          </div>
        </div>

        {bookingSuccess ? (
          /* --- BOOKING VOUCHER (SUCCESS SCREEN) --- */
          <div className="max-w-2xl mx-auto bg-white border-2 border-[#C9A84C] rounded-3xl p-6 relative shadow-2xl animate-fadeIn">
            <CornerOrnaments />
            
            <div className="text-center space-y-2 mb-6">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-amber-600">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl text-slate-800">বুকিং সফলভাবে সম্পন্ন হয়েছে!</h3>
              <p className="text-xs text-slate-700">ভ্রমণের জন্য নিচের বুকিং ভাউচারটি সংগ্রহে রাখুন</p>
            </div>

            {/* Simulated Flight Ticket Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-[#C9A84C] text-[#FFFFFF] py-3 px-4 font-bold text-xs flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Ticket className="w-4 h-4" /> অফিশিয়াল ই-ভাউচার (E-Voucher)
                </span>
                <span className="font-mono text-[11px]">PNR: {bookingSuccess.pnr}</span>
              </div>

              <div className="p-5 space-y-4">
                {/* Route Header */}
                <div className="flex justify-between items-center border-b border-dashed border-[#C9A84C]/20 pb-4">
                  <div>
                    <span className="text-[10px] text-slate-600 block">Departure</span>
                    <span className="text-xl font-extrabold text-slate-800 font-mono">{bookingSuccess.service.split(" ✈️ ")[0]}</span>
                    <span className="text-[11px] text-slate-700 block">হযরত শাহজালাল বিমানবন্দর</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Plane className="w-5 h-5 text-[#C9A84C] rotate-90" />
                    <span className="text-[9px] text-[#C9A84C] font-mono mt-1">{bookingSuccess.flightId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-600 block">Arrival</span>
                    <span className="text-xl font-extrabold text-slate-800 font-mono">{bookingSuccess.service.split(" ✈️ ")[1].split(" (")[0]}</span>
                    <span className="text-[11px] text-slate-700 block">আন্তর্জাতিক বিমানবন্দর</span>
                  </div>
                </div>

                {/* Grid Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-600 block">যাত্রীর নাম:</span>
                    <span className="font-bold text-slate-800 block">{bookingSuccess.passenger}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">পাসপোর্ট নম্বর:</span>
                    <span className="font-bold text-slate-800 font-mono block">{bookingSuccess.passport}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">তারিখ ও সময়:</span>
                    <span className="font-bold text-slate-800 block">{bookingSuccess.date} ({bookingSuccess.time})</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">লাগেজ লিমিট:</span>
                    <span className="font-bold text-emerald-700 font-mono block">{bookingSuccess.baggage}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-200">
                  <div>
                    <span className="text-slate-600 block">মোবাইল নম্বর:</span>
                    <span className="font-bold text-slate-800 font-mono block">{bookingSuccess.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">পরিশোধের ধরন:</span>
                    <span className="font-bold text-[#E2C876] block">বিকাশ/নগদ (অগ্রিম পরিশোধিত)</span>
                  </div>
                </div>

                {/* Barcode & Security info */}
                <div className="pt-4 border-t border-dashed border-[#C9A84C]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-500 block leading-none">স্ট্যাটাস</span>
                    <span className="text-xs font-bold text-amber-600 block">✓ {bookingSuccess.status}</span>
                  </div>
                  {/* Mock Barcode visual */}
                  <div className="flex flex-col items-center">
                    <div className="h-7 w-48 bg-slate-200 rounded flex items-center justify-between px-1 border border-[#C9A84C]/40 opacity-70">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="h-full bg-black" 
                          style={{ width: `${Math.floor(1 + Math.random() * 3)}px` }} 
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono text-[#C9A84C] tracking-widest mt-1">PBT-RESERVE-2026</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-3 pt-6">
              <button
                onClick={() => {
                  downloadReceiptPdf({
                    title: "এয়ার টিকিট বুকিং রসিদ",
                    pnr: bookingSuccess.pnr,
                    passenger: bookingSuccess.passenger,
                    phone: bookingSuccess.phone,
                    passport: bookingSuccess.passport,
                    service: `${bookingSuccess.service} (ফ্লাইট: ${bookingSuccess.flightId})`,
                    price: `৳ ${bookingSuccess.price.toLocaleString("bn-BD")}`,
                    date: `${bookingSuccess.date} (${bookingSuccess.time})`,
                    status: bookingSuccess.status,
                    additional: [
                      { label: "লাগেজ লিমিট (Baggage):", value: bookingSuccess.baggage }
                    ]
                  });
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5" /> পিডিএফ রশিদ ডাউনলোড
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/status?pnr=${bookingSuccess.pnr}`);
                  alert("PNR ট্র্যাকিং লিংক কপি হয়েছে! এটি হোয়াটসঅ্যাপে শেয়ার করতে পারেন।");
                }}
                className="px-4 py-2 bg-[#FFFFFF] hover:bg-[#FFFFFF]/60 border border-[#C9A84C]/40 text-slate-800 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" /> শেয়ার লিংক কপি করুন
              </button>
              <button
                onClick={() => window.open(`https://wa.me/${globalConfig.whatsapp}?text=সালামু আলাইকুম। আমি প্রবাসবাংলা অ্যাপ থেকে একটি ফ্লাইট বুক করেছি। আমার PNR: ${bookingSuccess.pnr}। অনুগ্রহ করে কনফার্ম করুন।`, "_blank")}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                হোয়াটসঅ্যাপে টিকিট নিশ্চিত করুন
              </button>
              <button
                onClick={resetBooking}
                className="px-4 py-2 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                নতুন টিকিট বুকিং
              </button>
            </div>
          </div>
        ) : (
          /* --- FLIGHT SEARCH & RESULTS --- */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Search filter left sidebar */}
            <div className="lg:col-span-4 bg-white border border-slate-200 shadow-lg rounded-2xl p-5 shadow-xl relative sticky top-24">
              <CornerOrnaments />
              <h3 className="font-bold text-sm text-slate-900 border-b border-[#C9A84C]/10 pb-2 mb-4 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-[#C9A84C]" /> টিকিট ফিল্টার
              </h3>

              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">কোথা থেকে (From)</label>
                  <select 
                    value={from} 
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#C9A84C]"
                  >
                    <option value="DAC">ঢাকা (DAC) - শাহজালাল ইন্টারন্যাশনাল</option>
                    <option value="CGP">চট্টগ্রাম (CGP) - শাহ আমানত ইন্টারন্যাশনাল</option>
                    <option value="ZYL">সিলেট (ZYL) - ওসমানী ইন্টারন্যাশনাল</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">কোথায় (To)</label>
                  <select 
                    value={to} 
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#C9A84C]"
                  >
                    <option value="JED">জেদ্দা (JED), সৌদি আরব</option>
                    <option value="RUH">রিয়াদ (RUH), সৌদি আরব</option>
                    <option value="DXB">দুবাই (DXB), সংযুক্ত আরব আমিরাত</option>
                    <option value="MCT">মাস্কাট (MCT), ওমান</option>
                    <option value="DOH">দোহা (DOH), কাতার</option>
                    <option value="KUL">কুয়ালালামপুর (KUL), মালয়েশিয়া</option>
                    <option value="SIN">সিঙ্গাপুর (SIN)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">যাত্রার তারিখ</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">কেবিন ক্লাস</label>
                  <div className="flex gap-2">
                    {["Economy", "Business"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCabinClass(c)}
                        className={`flex-1 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${
                          cabinClass === c 
                            ? "bg-[#C9A84C] text-[#FFFFFF]" 
                            : "bg-[#FFFFFF] border border-[#C9A84C]/15 text-slate-600"
                        }`}
                      >
                        {c === "Economy" ? "ইকোনমি" : "বিজনেস"}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  ফ্লাইট খুঁজুন
                </button>
              </form>
            </div>

            {/* Flight Results display column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-700/30 pb-2">
                <span className="text-xs text-slate-600">
                  মোট <span className="font-bold text-[#C9A84C]">{flightResults.length}</span> টি ফ্লাইট পাওয়া গেছে
                </span>
                <span className="text-[10px] text-[#C9A84C] font-semibold">ভাড়া শুরু (সর্বনিম্ন করসহ)</span>
              </div>

              {flightResults.length === 0 ? (
                <div className="p-8 bg-red-50/50 border border-red-200 rounded-2xl text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                  <p className="text-sm text-slate-700">কোন ফ্লাইট পাওয়া যায়নি। অনুগ্রহ করে অন্য রুট বা অন্য তারিখ দিয়ে ট্রাই করুন।</p>
                </div>
              ) : (
                flightResults.map((flight) => (
                  <div 
                    key={flight.id} 
                    className="bg-white border border-slate-200 hover:border-[#C9A84C]/50 shadow-sm hover:border-[#C9A84C]/40 rounded-2xl p-4 md:p-5 transition-all duration-300 flex flex-col md:flex-row justify-between items-stretch gap-4"
                  >
                    {/* Airline details */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[#C9A84C]/20 flex flex-col items-center justify-center font-bold text-lg select-none">
                        {flight.logo}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{flight.airline}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-600">
                          <span className="font-semibold font-mono">{flight.id}</span>
                          <span>•</span>
                          <span>{flight.stopover}</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center justify-between md:justify-center gap-6 flex-grow border-y md:border-y-0 border-slate-100 py-3 md:py-0">
                      <div className="text-left md:text-center">
                        <span className="block font-bold text-base text-slate-800 font-mono leading-none">{flight.departure}</span>
                        <span className="text-[10px] text-slate-600 font-bold uppercase">{from}</span>
                      </div>
                      
                      <div className="flex flex-col items-center flex-grow max-w-[120px] relative">
                        <span className="text-[9px] text-slate-500 font-mono leading-none mb-1">{flight.duration}</span>
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent relative">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <Plane className="w-3.5 h-3.5 text-[#C9A84C]/60 absolute top-2 rotate-90" />
                      </div>

                      <div className="text-right md:text-center">
                        <span className="block font-bold text-base text-slate-800 font-mono leading-none">{flight.arrival}</span>
                        <span className="text-[10px] text-slate-600 font-bold uppercase">{to}</span>
                      </div>
                    </div>

                    {/* Pricing & Call to Action */}
                    <div className="flex md:flex-col justify-between md:justify-center items-center md:items-end gap-2 md:pl-4 md:border-l border-slate-100">
                      <div className="text-left md:text-right">
                        <span className="text-[9px] text-slate-600 block leading-none">ওয়ান-ওয়ে মূল্য</span>
                        <span className="text-base font-extrabold text-emerald-700 font-mono leading-none">
                          ৳ {flight.price.toLocaleString("bn-BD")}
                        </span>
                        <span className="text-[9px] text-amber-600/80 flex items-center gap-0.5 mt-0.5 justify-end">
                          <Luggage className="w-3 h-3" /> লাগেজে {flight.baggage.split(" + ")[0]}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => startBooking(flight)}
                        className="px-4 py-2 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-xl transition-all cursor-pointer shadow shadow-[#C9A84C]/25"
                      >
                        সিট বুক করুন
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}
      </div>

      {/* --- CHECKOUT CONFIRMATION MODAL --- */}
      {showCheckoutModal && selectedFlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#F8FAFC] border border-[#C9A84C]/45 rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
            <CornerOrnaments />
            
            <button 
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-600 hover:text-white rounded-full bg-slate-50 border border-slate-200/80 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-[#C9A84C] tracking-wider uppercase block mb-0.5">যাত্রী ফর্ম ও সিট রিজার্ভেশন</span>
              <h3 className="font-bold text-lg text-slate-800">বুকিং সম্পন্ন করুন</h3>
              
              <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#C9A84C]/10 text-xs text-slate-700 mt-2.5 space-y-1.5">
                <div className="flex justify-between">
                  <span>ফ্লাইট:</span>
                  <span className="font-bold text-slate-800">{selectedFlight.airline} ({selectedFlight.id})</span>
                </div>
                <div className="flex justify-between">
                  <span>রুট:</span>
                  <span className="font-bold text-slate-800 font-mono">{from} ➔ {to}</span>
                </div>
                <div className="flex justify-between">
                  <span>মোট ভাড়া:</span>
                  <span className="font-bold text-emerald-700 font-mono">৳ {selectedFlight.price.toLocaleString("bn-BD")}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
              <div>
                <label className="text-slate-700 text-[11px] block mb-1">যাত্রীর পূর্ণ নাম (পাসপোর্ট অনুযায়ী) *</label>
                <input 
                  type="text" 
                  required
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="উদাঃ MOHAMMAD HABIBUR RAHMAN"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div>
                <label className="text-slate-700 text-[11px] block mb-1">পাসপোর্ট নম্বর *</label>
                <input 
                  type="text" 
                  required
                  value={passengerPassport}
                  onChange={(e) => setPassengerPassport(e.target.value)}
                  placeholder="উদাঃ A01234567"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold font-mono uppercase focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div>
                <label className="text-slate-700 text-[11px] block mb-1">যোগাযোগের মোবাইল নম্বর *</label>
                <input 
                  type="tel" 
                  required
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  placeholder="উদাঃ ০১৩১৬৫৬৭৮২১"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div>
                <label className="text-slate-700 text-[11px] block mb-1">যাত্রীর পাসপোর্টের ছবি/কপি আপলোড করুন *</label>
                <div 
                  onClick={() => passengerFileRef.current?.click()}
                  className="border-2 border-dashed border-[#C9A84C]/25 hover:border-[#C9A84C]/50 rounded-xl p-3 text-center cursor-pointer bg-[#FFFFFF]/60 transition-colors"
                >
                  <Upload className="w-5 h-5 text-[#C9A84C] mx-auto mb-1" />
                  <span className="text-[10px] text-slate-700 block">
                    {passengerFile ? (
                      <span className="text-amber-600 font-semibold">{passengerFile.name} (সংযুক্ত করা হয়েছে)</span>
                    ) : (
                      "ক্লিক করে পাসপোর্টের ছবি বা পিডিএফ ফাইল আপলোড করুন *"
                    )}
                  </span>
                  <span className="text-[8px] text-slate-500 block mt-0.5">ফরম্যাট: JPG, PNG, PDF (সর্বোচ্চ ৫ মেগাবাইট)</span>
                  <input 
                    type="file" 
                    ref={passengerFileRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPassengerFile(e.target.files[0]);
                      }
                    }}
                    className="hidden" 
                  />
                </div>
              </div>

              <div className="p-2.5 bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl text-[10px] text-slate-600 flex items-start gap-1.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                <span>বুকিং কনফার্ম করার পর আমাদের কাস্টমার প্রতিনিধি হোয়াটসঅ্যাপে পেমেন্ট বিবরণী এবং টিকেট ই-মেইল করার জন্য কল করবেন।</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#C9A84C] hover:bg-[#B3933E] text-[#FFFFFF] font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                অনলাইন টিকেট ভাউচার জেনারেট করুন
              </button>
            </form>
          </div>
        </div>
      )}

    </ArabicPageShell>
  );
}
