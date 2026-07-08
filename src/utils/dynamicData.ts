// Dynamic Data Manager for Probas Bangla Agency
// Handles saving/loading from localStorage to make the site fully dynamic and controllable via the Admin Dashboard.

export interface GlobalConfig {
  hotline: string;
  hotlineRaw: string;
  whatsapp: string;
  email: string;
  notice: string;
  stats: Array<{ value: string; label: string; desc: string }>;
}

export interface FlightTemplate {
  id: string;
  airline: string;
  code: string;
  departure: string;
  arrival: string;
  duration: string;
  stopover: string;
  logo: string;
  economyPrice: number;
  businessPrice: number;
  baggage: string;
}

export interface PopularDestination {
  name: string;
  code: string;
  country: string;
  image: string;
  price: string;
}

export interface VisaType {
  name: string;
  duration: string;
  processing: string;
  price: string;
  docs: string[];
}

export interface VisaCountryData {
  country: string;
  flag: string;
  types: VisaType[];
}

export interface HajjUmrahPackage {
  id: string;
  name: string;
  tag: string;
  price: number;
  makkahHotel: string;
  madinahHotel: string;
  duration: string;
  transport: string;
  flights: string;
  features: string[];
}

export interface CitizenServiceInfo {
  title: string;
  subtitle: string;
  desc: string;
  points: string[];
  price: string;
}

// ---------------- DEFAULT DATA DEFINITIONS ----------------

const DEFAULT_GLOBAL_CONFIG: GlobalConfig = {
  hotline: "+৮৮০১৩১৬৫৬৭৮২১",
  hotlineRaw: "+8801316567821",
  whatsapp: "8801316567821",
  email: "support@probasbangla.com",
  notice: "আসসালামু আলাইকুম! ওমরাহ হজ্জ ও মিডল ইস্ট ফ্লাইটের রমজান ও বিশেষ অফার সিজন বুকিং চলছে। আপনার সিট বুক করুন আজই।",
  stats: [
    { value: "১৫,০০০+", label: "সফল যাত্রী", desc: "যারা নিরাপদে ভ্রমণ করেছেন" },
    { value: "৮,৫০০+", label: "ভিসা প্রসেসড", desc: "মিডল ইস্ট ও ইউরোপ" },
    { value: "১২+", label: "এয়ারলাইন পার্টনার", desc: "সেরা মূল্যের নিশ্চয়তা" },
    { value: "২৪/৭", label: "সাপোর্ট", desc: "প্রবাসী ভাইদের সার্বক্ষণিক সেবায়" },
  ]
};

const DEFAULT_FLIGHTS: FlightTemplate[] = [
  { id: "BG-041", airline: "Biman Bangladesh", code: "BG", departure: "18:30", arrival: "22:15", duration: "6h 45m", stopover: "Direct", logo: "🟢🔴", economyPrice: 51200, businessPrice: 94000, baggage: "40kg + 7kg" },
  { id: "SV-805", airline: "Saudi Arabian Airlines", code: "SV", departure: "02:15", arrival: "06:00", duration: "6h 45m", stopover: "Direct", logo: "🇸🇦", economyPrice: 53800, businessPrice: 98500, baggage: "46kg + 7kg" },
  { id: "EK-585", airline: "Emirates Airways", code: "EK", departure: "01:40", arrival: "08:15", duration: "9h 35m", stopover: "1 Stop (DXB)", logo: "🔴", economyPrice: 58500, businessPrice: 112000, baggage: "35kg + 7kg" },
  { id: "QR-643", airline: "Qatar Airways", code: "QR", departure: "11:20", arrival: "17:45", duration: "9h 25m", stopover: "1 Stop (DOH)", logo: "🇶🇦", economyPrice: 59000, businessPrice: 115000, baggage: "35kg + 7kg" },
  { id: "GF-251", airline: "Gulf Air", code: "GF", departure: "05:45", arrival: "11:30", duration: "8h 45m", stopover: "1 Stop (BAH)", logo: "🟡", economyPrice: 48900, businessPrice: 89000, baggage: "30kg + 7kg" },
  { id: "FZ-583", airline: "Flydubai", code: "FZ", departure: "09:15", arrival: "14:45", duration: "7h 30m", stopover: "1 Stop (DXB)", logo: "🔵", economyPrice: 45000, businessPrice: 82000, baggage: "30kg + 7kg" },
];

const DEFAULT_DESTINATIONS: PopularDestination[] = [
  { name: "জেদ্দা (Jeddah)", code: "JED", country: "সৌদি আরব", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600", price: "৳ ৫২,০০০" },
  { name: "রিয়াদ (Riyadh)", code: "RUH", country: "সৌদি আরব", image: "https://images.unsplash.com/photo-1582233479366-6d38bc390a08?q=80&w=600", price: "৳ ৪৯,৫০০" },
  { name: "দুবাই (Dubai)", code: "DXB", country: "ইউএই", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600", price: "৳ ৪৪,০০০" },
  { name: "মাস্কাট (Muscat)", code: "MCT", country: "ওমান", image: "https://images.unsplash.com/photo-1614531341773-3bef8ca77484?q=80&w=600", price: "৳ ৪৭,৫০০" },
  { name: "কুয়ালালামপুর (Kuala Lumpur)", code: "KUL", country: "মালয়েশিয়া", image: "https://images.unsplash.com/photo-1596422846543-75c6fc1f7f67?q=80&w=600", price: "৳ ৪১,০০০" },
  { name: "লন্ডন (London)", code: "LHR", country: "যুক্তরাজ্য", image: "https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?q=80&w=600", price: "৳ ৮৫,০০০" }
];

const DEFAULT_VISA_DATA: Record<string, VisaCountryData> = {
  "Saudi Arabia": {
    country: "সৌদি আরব (Saudi Arabia)",
    flag: "🇸🇦",
    types: [
      { name: "ওমরাহ ইলেকট্রনিক ভিসা (E-Umrah)", duration: "৯৯ দিন", processing: "২৪-৪৮ ঘণ্টা", price: "৳ ১৮,৫০০", docs: ["পাসপোর্টের স্ক্যান কপি", "সাদা ব্যাকগ্রাউন্ডের ছবি", "কোভিড টিকাদান সনদ"] },
      { name: "ফ্যামিলি ভিজিট ভিসা (Family Visit)", duration: "১ বছর (মাল্টিপল)", processing: "৩-৫ কর্মদিবস", price: "৳ ২৯,০০০", docs: ["আবেদনকারীর পাসপোর্ট ও ভিসা কপি", "মেহমানের পাসপোর্ট স্ক্যান কপি", "সম্পর্কের প্রমাণপত্র", "ছবি"] },
      { name: "ব্যক্তিগত ট্যুরিস্ট ভিসা (Tourist)", duration: "১ বছর", processing: "২-৪ কর্মদিবস", price: "৳ ২৪,০০০", docs: ["পাসপোর্টের স্ক্যান কপি", " ছবি", "ব্যাংক সলভেন্সি (কমপক্ষে ১৫০,০০০ টাকা)"] },
      { name: "ওয়ার্ক ভিসা স্ট্যাম্পিং (Work Stamping)", duration: "চুক্তিনুযায়ী", processing: "৭-১০ কর্মদিবস", price: "৳ ৪২,০০০", docs: ["মূল পাসপোর্ট", "মেডিকেল ফিট সার্টিফিকেট", "পুলিশ ক্লিয়ারেন্স", "সৌদি চেম্বার সত্যায়িত ওয়াকালা"] }
    ]
  },
  "UAE": {
    country: "সংযুক্ত আরব আমিরাত (UAE/Dubai)",
    flag: "🇦🇪",
    types: [
      { name: "৩০ দিন ট্যুরিস্ট ভিসা (Single Entry)", duration: "৩০ দিন", processing: "৩-৫ কর্মদিবস", price: "৳ ১৩,৫০০", docs: ["পাসপোর্টের রঙিন স্ক্যান কপি", "সাদা ব্যাকগ্রাউন্ডের ছবি", "NID কার্ড কপি"] },
      { name: "৬০ দিন ট্যুরিস্ট ভিসা (Single Entry)", duration: "৬০ দিন", processing: "৩-৫ কর্মদিবস", price: "৳ ১৯,৫০০", docs: ["পাসপোর্টের রঙিন স্ক্যান কপি", "সাদা ব্যাকগ্রাউন্ডের ছবি", "NID কার্ড কপি", "রিটার্ন এয়ার টিকিট"] },
      { name: "ফ্যামিলি ভিজিট ভিসা (Family)", duration: "৯০ দিন", processing: "৫-৭ কর্মদিবস", price: "৳ ২৭,০০০", docs: ["স্পন্সরের রেসিডেন্স ভিসা কপি", "স্পন্সরের ব্যাংক স্টেটমেন্ট", "মেহমানের পাসপোর্ট ও ছবি"] }
    ]
  },
  "Qatar": {
    country: "কাতার (Qatar)",
    flag: "🇶🇦",
    types: [
      { name: "৩০ দিন অনলাইন ই-ভিসা (E-Visa)", duration: "৩০ দিন", processing: "২-৪ কর্মদিবস", price: "৳ ১৪,৮০০", docs: ["পাসপোর্ট রঙিন কপি", "ছবি", "হোটেল বুকিং কনফার্মেশন", "রিটার্ন বিমান টিকিট"] },
      { name: "ফ্যামিলি ভিজিট ভিসা", duration: "৯০ দিন", processing: "৫-৮ কর্মদিবস", price: "৳ ২২,৫০০", docs: ["আবেদনকারীর কাতার আইডি কপি", "রিলেশন সার্টিফিকেট", "মেহমানের পাসপোর্ট কপি ও ছবি"] }
    ]
  },
  "Oman": {
    country: "ওমান (Oman)",
    flag: "🇴🇲",
    types: [
      { name: "১০ দিন এক্সপ্রেস ভিসা (Tourist)", duration: "১০ দিন", processing: "২৪-৪৮ ঘণ্টা", price: "৳ ৮,৫০০", docs: ["পাসপোর্ট রঙিন কপি", "২ কপি ছবি (নীল/সাদা ব্যাকগ্রাউন্ড)", "টিকিট কপি"] },
      { name: "৩০ দিন ট্যুরিস্ট ভিসা", duration: "৩০ দিন", processing: "২-৩ কর্মদিবস", price: "৳ ১৪,০০০", docs: ["পাসপোর্ট রঙিন কপি", "২ কপি ছবি", "ব্যাংক সলভেন্সি বা স্পন্সর লেটার"] }
    ]
  },
  "Malaysia": {
    country: "মালয়েশিয়া (Malaysia)",
    flag: "🇲🇾",
    types: [
      { name: "অনলাইন ই-ভিসা (E-Visa)", duration: "৩০ দিন", processing: "৩-৫ কর্মদিবস", price: "৳ ৭,৮০০", docs: ["পাসপোর্ট রঙিন স্ক্যান কপি", "১ কপি ছবি (স্টুডিও প্রিন্ট)", "বিগত ৩ মাসের ব্যাংক স্টেটমেন্ট", "রিটার্ন কনফার্ম টিকিট"] }
    ]
  }
};

const DEFAULT_PACKAGES: HajjUmrahPackage[] = [
  {
    id: "PKG-UMR-ECO",
    name: "ইকোনমি ওমরাহ প্যাকেজ (Economy)",
    tag: "সবচেয়ে সাশ্রয়ী",
    price: 145000,
    makkahHotel: "হোটেল ফজর (৬০০ মিটার)",
    madinahHotel: "হোটেল ইয়াসমিন (৪০০ মিটার)",
    duration: "১৪ দিন (৭ দিন মক্কা + ৭ দিন মদিনা)",
    transport: "লাক্সারি এসি বাস",
    flights: "সাউদিয়া / বিমান বাংলাদেশ (কানেক্টিং)",
    features: [
      "ওমরাহ ই-ভিসা ফি ও প্রসেসিং",
      "মক্কা ও মদিনার নিকটবর্তী শেয়ারিং রুম",
      "অভিজ্ঞ আলেম ও গাইড দ্বারা ওমরাহ সম্পাদন",
      "মক্কা ও মদিনার ঐতিহাসিক স্থানে জিয়ারত",
      "জমজম পানি (৫ লিটার) উপহার"
    ]
  },
  {
    id: "PKG-UMR-STD",
    name: "স্ট্যান্ডার্ড ওমরাহ প্যাকেজ (Standard)",
    tag: "বেস্ট সেলিং",
    price: 165000,
    makkahHotel: "হোটেল আনোয়ার আল ডিফা (৩০০ মিটার)",
    madinahHotel: "হোটেল জুয়ার আল সাকিফা (২০০ মিটার)",
    duration: "১৪ দিন (৮ দিন মক্কা + ৬ দিন মদিনা)",
    transport: "লাক্সারি বাউন্ডেড বাস",
    flights: "সাউদিয়া / বিমান বাংলাদেশ (ডাইরেক্ট)",
    features: [
      "ওমরাহ ই-ভিসা ও কমপ্লিট হেলথ ইন্সুরেন্স",
      "৩ তারকা মানের হোটেল সুবিধা (৪ জনের শেয়ারিং)",
      "তিনবেলা খাঁটি বাঙালি খাবার (বুফে স্টাইল)",
      "বিশেষজ্ঞ মুয়াল্লিম গাইড সার্ভিস",
      "আলাদা পরিবার বুকিংয়ে স্পেশাল ডিসকাউন্ট"
    ]
  },
  {
    id: "PKG-UMR-DLX",
    name: "প্রিমিয়াম ডিলাক্স ওমরাহ প্যাকেজ (Deluxe)",
    tag: "আরামদায়ক ও ভিআইপি",
    price: 185000,
    makkahHotel: "হোটেলswiss আল মাকাম (সরাসরি হারাম চত্বর)",
    madinahHotel: "পুলম্যান জমজম মদিনা (১০০ মিটার)",
    duration: "১২ দিন (৬ দিন মক্কা + ৬ দিন মদিনা)",
    transport: "প্রাইভেট জিসিসি কার (GMC)",
    flights: "এমিরেটস / কাতার এয়ারওয়েজ (প্রিমিয়াম)",
    features: [
      "ভিআইপি ওমরাহ ক্যাটাগরি প্রসেস",
      "৫ তারকা বিলাসবহুল হোটেল সুবিধা (ডাবল বা ট্রিপল শেয়ারিং)",
      "ফাইভ স্টার ক্যাটারিং হাফ বোর্ড (সকালের নাস্তা ও রাতের খাবার)",
      "ব্যক্তিগত সার্বক্ষণিক মুয়াল্লিম গাইড",
      "তায়েফ ঐতিহাসিক জিয়ারত ভ্রমণ"
    ]
  }
];

const DEFAULT_SERVICES_INFO: CitizenServiceInfo[] = [
  {
    title: "BMET রেজিস্ট্রেশন ও স্মার্টকার্ড",
    subtitle: "BMET Smart Card",
    desc: "নতুন কর্মী যারা চাকরির ভিসা পেয়ে বিদেশে যাচ্ছেন, তাদের জন্য বিএমইটি স্মার্টকার্ড অত্যন্ত বাধ্যতামূলক। এটি ছাড়া ইমিগ্রেশন পার হওয়া সম্ভব নয়।",
    points: [
      "ভিসা অনুযায়ী সঠিক ক্যাটাগরিতে বিএমইটি রেজিস্ট্রেশন",
      "প্রবাসী কল্যাণ ওয়েলফেয়ার ফান্ড ফি পরিশোধ",
      "PDO (প্রাক-বহির্গমন ওরিয়েন্টেশন) ট্রেনিং স্লট সিডিউলিং",
      "ফাইনাল স্মার্টকার্ড ডাউনলোড সার্ভিস (২৪-৪৮ ঘণ্টায়)"
    ],
    price: "৳ ৩,৫০০ (সরকারি ফিসহ)"
  },
  {
    title: "NID ও জন্ম নিবন্ধন সংশোধন",
    subtitle: "National ID & Birth Certificate",
    desc: "পাসপোর্টের সাথে নামের বানান, জন্ম তারিখ বা মা-বাবার নামের অমিলের কারণে প্রবাসী ভিসায় বড় ধরণের জটিলতা দেখা দেয়। আমরা দ্রুত এটি সংশোধন করে দিই।",
    points: [
      "জাতীয় পরিচয়পত্রের নামের ইংরেজি বানান সংশোধন",
      "অনলাইন ডিজিটাল জন্ম নিবন্ধন সংশোধন ও নতুন আবেদন",
      "পাসপোর্টের সাথে NID তথ্যের সমতা বিধান",
      "হারিয়ে যাওয়া NID কার্ড অনলাইন সংস্করণ উত্তোলন"
    ],
    price: "৳ ২,০০০ থেকে শুরু (কেস অনুযায়ী ভিন্ন)"
  },
  {
    title: "পাসপোর্ট সংশোধন সহায়তা",
    subtitle: "Passport Modification Support",
    desc: "পাসপোর্টের বয়স কমানো বা বাড়ানো, পেশা পরিবর্তন, বৈবাহিক অবস্থা হালনাগাদ বা জরুরি রি-ইস্যু ফিজিক্যাল সাপোর্টের মাধ্যমে সমাধান করা হয়।",
    points: [
      "বয়স সংশোধন সংক্রান্ত এফিডেভিট ও তথ্য ফরম্যাট",
      "পেশা পরিবর্তন (যেমন: সাধারণ থেকে পেশাজীবী ক্যাটাগরি)",
      "জরুরি পাসপোর্ট রিনিউয়াল এবং রি-ইস্যু প্রসেস",
      "বিদেশে অবস্থানরতদের জন্য পাসপোর্টের ডাবল রেকর্ড সমস্যা সমাধান"
    ],
    price: "৳ ৫,০০০ থেকে শুরু"
  }
];

// ---------------- LOCAL STORAGE GETTERS AND SETTERS ----------------

export function getGlobalConfig(): GlobalConfig {
  const data = localStorage.getItem("probas_global_config");
  if (!data) {
    localStorage.setItem("probas_global_config", JSON.stringify(DEFAULT_GLOBAL_CONFIG));
    return DEFAULT_GLOBAL_CONFIG;
  }
  return JSON.parse(data);
}

export function saveGlobalConfig(config: GlobalConfig) {
  localStorage.setItem("probas_global_config", JSON.stringify(config));
}

export function getFlights(): FlightTemplate[] {
  const data = localStorage.getItem("probas_flights");
  if (!data) {
    localStorage.setItem("probas_flights", JSON.stringify(DEFAULT_FLIGHTS));
    return DEFAULT_FLIGHTS;
  }
  return JSON.parse(data);
}

export function saveFlights(flights: FlightTemplate[]) {
  localStorage.setItem("probas_flights", JSON.stringify(flights));
}

export function getDestinations(): PopularDestination[] {
  const data = localStorage.getItem("probas_destinations");
  if (!data) {
    localStorage.setItem("probas_destinations", JSON.stringify(DEFAULT_DESTINATIONS));
    return DEFAULT_DESTINATIONS;
  }
  const parsed = JSON.parse(data);
  if (!Array.isArray(parsed) || parsed.length < 6) {
    localStorage.setItem("probas_destinations", JSON.stringify(DEFAULT_DESTINATIONS));
    return DEFAULT_DESTINATIONS;
  }

  // Auto-heal old or broken images from previous versions or local storage states
  let isModified = false;
  const updatedDestinations = parsed.map((dest: any) => {
    // If the image is the old Dolomite Muscat image or has been corrupted
    if (
      !dest.image || 
      dest.image.includes("photo-1549880181-56a44cf4a9a1") || 
      (dest.code === "MCT" && !dest.image.includes("photo-1614531341773-3bef8ca77484"))
    ) {
      dest.image = "https://images.unsplash.com/photo-1614531341773-3bef8ca77484?q=80&w=600";
      isModified = true;
    }
    if (dest.code === "JED" && dest.image.includes("auto=format&fit=crop")) {
      dest.image = "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600";
      isModified = true;
    }
    if (dest.code === "RUH" && dest.image.includes("auto=format&fit=crop")) {
      dest.image = "https://images.unsplash.com/photo-1582233479366-6d38bc390a08?q=80&w=600";
      isModified = true;
    }
    if (dest.code === "DXB" && dest.image.includes("auto=format&fit=crop")) {
      dest.image = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600";
      isModified = true;
    }
    if (dest.code === "KUL" && dest.image.includes("auto=format&fit=crop")) {
      dest.image = "https://images.unsplash.com/photo-1596422846543-75c6fc1f7f67?q=80&w=600";
      isModified = true;
    }
    if (dest.code === "LHR" && dest.image.includes("auto=format&fit=crop")) {
      dest.image = "https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?q=80&w=600";
      isModified = true;
    }
    return dest;
  });

  if (isModified) {
    localStorage.setItem("probas_destinations", JSON.stringify(updatedDestinations));
    return updatedDestinations;
  }

  return parsed;
}

export function saveDestinations(destinations: PopularDestination[]) {
  localStorage.setItem("probas_destinations", JSON.stringify(destinations));
}

export function getVisaData(): Record<string, VisaCountryData> {
  const data = localStorage.getItem("probas_visa_data");
  if (!data) {
    localStorage.setItem("probas_visa_data", JSON.stringify(DEFAULT_VISA_DATA));
    return DEFAULT_VISA_DATA;
  }
  return JSON.parse(data);
}

export function saveVisaData(visaData: Record<string, VisaCountryData>) {
  localStorage.setItem("probas_visa_data", JSON.stringify(visaData));
}

export function getPackages(): HajjUmrahPackage[] {
  const data = localStorage.getItem("probas_packages");
  if (!data) {
    localStorage.setItem("probas_packages", JSON.stringify(DEFAULT_PACKAGES));
    return DEFAULT_PACKAGES;
  }
  return JSON.parse(data);
}

export function savePackages(packages: HajjUmrahPackage[]) {
  localStorage.setItem("probas_packages", JSON.stringify(packages));
}

export function getServicesInfo(): CitizenServiceInfo[] {
  const data = localStorage.getItem("probas_services_info");
  if (!data) {
    localStorage.setItem("probas_services_info", JSON.stringify(DEFAULT_SERVICES_INFO));
    return DEFAULT_SERVICES_INFO;
  }
  return JSON.parse(data);
}

export function saveServicesInfo(services: CitizenServiceInfo[]) {
  localStorage.setItem("probas_services_info", JSON.stringify(services));
}
