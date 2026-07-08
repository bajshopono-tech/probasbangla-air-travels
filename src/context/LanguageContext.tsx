import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "bn" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<string, Record<Language, string>> = {
  // Navigation
  home: { bn: "হোম", en: "Home" },
  flights: { bn: "এয়ার টিকিট", en: "Air Ticket" },
  visa: { bn: "ভিসা প্রসেসিং", en: "Visa Processing" },
  hajjUmrah: { bn: "হজ্জ ও ওমরাহ", en: "Hajj & Umrah" },
  bmet: { bn: "BMET ও অন্যান্য", en: "BMET & Others" },
  statusCheck: { bn: "স্ট্যাটাস চেক", en: "Status Check" },
  onlineBooking: { bn: "অনলাইন বুকিং", en: "Online Booking" },
  callUs: { bn: "কল করুন", en: "Call Us" },
  support247: { bn: "২৪/৭ কাস্টমার সাপোর্ট", en: "24/7 Customer Support" },
  govApproved: { bn: "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত ট্রাভেল এজেন্সি", en: "Govt. Approved Trusted Travel Agency" },
  whatsapp: { bn: "হোয়াটসঅ্যাপ", en: "WhatsApp" },
  registrationNo: { bn: "নিবন্ধন নম্বর", en: "Registration No" },
  headOffice: { bn: "প্রধান কার্যালয়", en: "Head Office" },
  address: { bn: "মতিঝিল প্লাজা (৪র্থ তলা), মতিঝিল বা/এ, ঢাকা-১০০০, বাংলাদেশ", en: "Motijheel Plaza (4th Floor), Motijheel C/A, Dhaka-1000, Bangladesh" },
  copyright: { bn: "© ২০২৬ প্রবাসবাংলা এয়ার ট্রাভেলস। সর্বস্বত্ব সংরক্ষিত।", en: "© 2026 Probasbangla Air Travels. All Rights Reserved." },
  adminPortal: { bn: "অ্যাডমিন পোর্টাল (Admin)", en: "Admin Portal" },
  devBy: { bn: "প্রবাসবাংলা আইটি সেল", en: "Probasbangla IT Cell" },
  version: { bn: "সংস্করণ ২.৪", en: "Version 2.4" },
  ourServices: { bn: "আমাদের সেবাসমূহ", en: "Our Services" },
  policies: { bn: "নীতিমালা ও কোম্পানি", en: "Policies & Company" },
  aboutUs: { bn: "আমাদের সম্পর্কে (About Us)", en: "About Us" },
  terms: { bn: "ব্যবহারের শর্তাবলী (Terms & Conditions)", en: "Terms & Conditions" },
  privacy: { bn: "গোপনীয়তা নীতি (Privacy Policy)", en: "Privacy Policy" },
  refund: { bn: "রিফান্ড পলিসি (Refund Policy)", en: "Refund Policy" },
  emi: { bn: "EMI কিস্তি পলিসি (EMI Policy)", en: "EMI Policy" },
  careers: { bn: "ট্যালেন্ট ও কালচার (Careers)", en: "Careers" },

  // Home Page Banner & Titles
  heroTitle1: { bn: "নিরাপদ ও বিশ্বস্ত", en: "Safe & Trusted" },
  heroTitle2: { bn: "প্রবাসী ভ্রমণ সেবা", en: "Expatriate Travel Services" },
  heroSubtitle: { bn: "সৌদি আরব, দুবাই ও ওমান সহ মধ্যপ্রাচ্যের যেকোনো রুটে সেরা মূল্যে এয়ার টিকিট, ই-ভিসা, হজ্জ-ওমরাহ এবং নির্ভরযোগ্য ইমিগ্রেশন সাপোর্ট প্রবাসবাংলা অ্যাপে।", en: "Get the best deals on Air Tickets, E-Visas, Hajj-Umrah packages, and trusted immigration support for Saudi Arabia, Dubai, Oman, and Middle East destinations with Probasbangla App." },
  searchFlightPlaceholder: { bn: "কোথায় যাবেন? যেমন: জেদ্দা, রিয়াদ, দুবাই...", en: "Where do you want to go? e.g., Jeddah, Riyadh, Dubai..." },
  searchBtn: { bn: "ফ্লাইট খুঁজুন 🔍", en: "Search Flights 🔍" },
  trustedAgency: { bn: "১৫,০০০+ প্রবাসীর প্রথম পছন্দ", en: "Preferred Choice of 15,000+ Expats" },

  // Home Page Sections
  servicesTitle: { bn: "আমাদের ডিজিটাল সেবাসমূহ", en: "Our Digital Services" },
  servicesSubtitle: { bn: "আপনার প্রয়োজনীয় সেবাটি নির্বাচন করুন এবং ঘরে বসেই আবেদন করুন", en: "Select your desired service and apply from the comfort of your home" },
  statisticsTitle: { bn: "সংখ্যায় আমাদের অর্জন", en: "Our Achievements in Numbers" },
  statisticsSubtitle: { bn: "দীর্ঘদিন ধরে প্রবাসী ভাইদের আস্থার সাথে সেবা দিয়ে আসছি", en: "Serving our expatriate brothers with dedication and trust for years" },
  destinationsTitle: { bn: "জনপ্রিয় গন্তব্যসমূহ", en: "Popular Destinations" },
  destinationsSubtitle: { bn: "প্রবাসী ভাইদের পছন্দের রুটে স্পেশাল ডিসকাউন্টে এয়ার টিকিট বুকিং চলছে", en: "Special discount flight ticket bookings ongoing for favorite expatriate routes" },
  destinationPriceFrom: { bn: "ভাড়া শুরু", en: "Fares from" },
  destinationBookBtn: { bn: "টিকিট বুক করুন", en: "Book Ticket" },

  // Home services list names
  s1_name: { bn: "এয়ার টিকিট চেক", en: "Air Ticket Checker" },
  s1_desc: { bn: "PNR স্ট্যাটাস ও ফ্লাইটের সত্যতা যাচাই করুন", en: "Verify PNR status and flight authenticity" },
  s2_name: { bn: "সৌদি ওমরাহ ভিসা", en: "Saudi Umrah Visa" },
  s2_desc: { bn: "অনলাইন ই-ওমরাহ ভিসা প্রসেসিং ও ইন্সুরেন্স", en: "Online E-Umrah visa processing & insurance" },
  s3_name: { bn: "ভিসা চেক ও স্ট্যাম্পিং", en: "Visa Verification & Stamping" },
  s3_desc: { bn: "সরকারি পোর্টাল থেকে ভিসা স্ট্যাটাস চেক", en: "Check visa status from official portals" },
  s4_name: { bn: "বিএমইটি স্মার্টকার্ড", en: "BMET Smartcard" },
  s4_desc: { bn: "BMET কার্ডের আবেদন ও ফি পেমেন্ট সেবা", en: "BMET card application & fee payment service" },
  s5_name: { bn: "ম্যানপাওয়ার ও ফিঙ্গার", en: "Manpower & Fingerprint" },
  s5_desc: { bn: "সরকারি ম্যানপাওয়ার ছাড়পত্র ও ফিঙ্গারপ্রিন্ট গাইড", en: "Govt manpower clearance & fingerprint guidance" },
  s6_name: { bn: "হজ্জ ও ওমরাহ বুকিং", en: "Hajj & Umrah Booking" },
  s6_desc: { bn: "গ্রুপ বা কাস্টমাইজড প্যাকেজ বুকিং করুন", en: "Book group or customized packages" },
  s7_name: { bn: "রিনিউ পাসপোর্ট ও রি-ইস্যু", en: "Passport Renewal & Re-issue" },
  s7_desc: { bn: "জরুরি পাসপোর্ট রিনিউয়াল ও সংশোধন সহায়তা", en: "Urgent passport renewal & correction support" },
  s8_name: { bn: "মেডিকেল স্লট বুকিং", en: "Medical Slot Booking" },
  s8_desc: { bn: "মিডল ইস্টের জন্য গামকা মেডিকেল স্লট বুকিং", en: "GAMCA medical slot booking for Middle East" },
  s9_name: { bn: "জন্ম নিবন্ধন সংশোধন", en: "Birth Certificate Correction" },
  s9_desc: { bn: "অনলাইন ডিজিটাল জন্ম নিবন্ধন সংশোধন", en: "Online digital birth certificate correction" },
  s10_name: { bn: "NID কার্ড সংশোধন", en: "NID Card Correction" },
  s10_desc: { bn: "জাতীয় পরিচয়পত্রের ভুল সংশোধন সহায়তা", en: "National ID card error correction support" },
  s11_name: { bn: "পুলিশ ক্লিয়ারেন্স", en: "Police Clearance" },
  s11_desc: { bn: "বিদেশ যাত্রার জন্য পুলিশ ছাড়পত্র আবেদন", en: "Police clearance application for foreign travel" },
  s12_name: { bn: "আকামা স্ট্যাটাস ও চেক", en: "Iqama Status Check" },
  s12_desc: { bn: "আবশির ও মুকিম পোর্টালে আকামা যাচাই", en: "Verify Iqama on Absher and Muqeem portals" },
  s13_name: { bn: "ইনস্যুরেন্স ও মেডিকেল", en: "Insurance & Medical" },
  s13_desc: { bn: "বিদেশগামী কর্মীদের হেলথ ইন্সুরেন্স সেবা", en: "Health insurance services for outgoing workers" },
  s14_name: { bn: "অনলাইন জিডি ও ট্র্যাকিং", en: "Online GD & Tracking" },
  s14_desc: { bn: "পাসপোর্ট হারালে দ্রুত অনলাইন জিডি সাপোর্ট", en: "Quick online GD support if passport is lost" },
  s15_name: { bn: "রিটেইলার ব্যালেন্স", en: "Retailer Balance" },
  s15_desc: { bn: "রিটেইলারদের জন্য অ্যাকাউন্ট ব্যালেন্স রিচার্জ", en: "Account balance recharge for retailers" },
  s16_name: { bn: "এম্বাসি সত্যায়ন", en: "Embassy Attestation" },
  s16_desc: { bn: "নথিপত্র ও সার্টিফিকেটের এম্বাসি ভেরিফিকেশন", en: "Embassy verification of documents & certificates" },
  s17_name: { bn: "অন্যান্য অনলাইন সেবা", en: "Other Online Services" },
  s17_desc: { bn: "যেকোনো ধরণের সরকারি অনলাইন কাজের সমাধান", en: "Solutions for any government online tasks" },

  // Flights Page
  flightSearchTitle: { bn: "সেরা মূল্যে এয়ার টিকিট বুকিং", en: "Book Flight Tickets at Best Rates" },
  flightSearchSubtitle: { bn: "বিশ্বের যেকোনো রুটের টিকিট বুক করুন ঘরে বসেই সবচেয়ে কম দামে", en: "Book tickets for any route worldwide at the lowest price from home" },
  from: { bn: "কোথা থেকে (From)", en: "From" },
  to: { bn: "কোথায় যাবেন (To)", en: "To" },
  departureDate: { bn: "ভ্রমণের তারিখ (Date)", en: "Travel Date" },
  searchFlightBtn: { bn: "ফ্লাইট খুঁজুন", en: "Search Flights" },
  searchResultsTitle: { bn: "উপলব্ধ ফ্লাইট সমূহ", en: "Available Flights" },
  searchResultsCount: { bn: "টি ফ্লাইট পাওয়া গেছে", en: "flights found" },
  stopsDirect: { bn: "সরাসরি (Direct)", en: "Direct" },
  economy: { bn: "ইকোনমি (Economy)", en: "Economy" },
  business: { bn: "বিজনেস (Business)", en: "Business" },
  baggageAllowance: { bn: "ব্যাগেজ সীমা:", en: "Baggage Allowance:" },
  selectFlightBtn: { bn: "বুক করুন", en: "Book Flight" },
  flightNotFound: { bn: "দুঃখিত! এই রুটে কোনো সরাসরি ফ্লাইট খুঁজে পাওয়া যায়নি। অন্য তারিখ বা গন্তব্য চেষ্টা করুন।", en: "Sorry! No flights found for this route on this date. Please try another date or destination." },
  bookingFormTitle: { bn: "যাত্রীর বিবরণী ও বুকিং কনফার্মেশন", en: "Passenger Details & Booking Confirmation" },
  passengerName: { bn: "যাত্রীর নাম (পাসপোর্ট অনুযায়ী) *", en: "Passenger Name (As in Passport) *" },
  passengerNamePlaceholder: { bn: "উদাঃ মোঃ আব্দুর রহমান", en: "e.g., Md. Abdur Rahman" },
  passportNumber: { bn: "পাসপোর্ট নম্বর *", en: "Passport Number *" },
  passportNumberPlaceholder: { bn: "উদাঃ EF1234567", en: "e.g., EF1234567" },
  contactPhone: { bn: "যোগাযোগের মোবাইল নম্বর *", en: "Contact Mobile Number *" },
  contactPhonePlaceholder: { bn: "উদাঃ ০১৭xxxxxxxx", en: "e.g., 017xxxxxxxx" },
  uploadPassportCopy: { bn: "যাত্রীর পাসপোর্টের ছবি/কপি আপলোড করুন *", en: "Upload Passenger Passport Copy/Photo *" },
  uploadPassportDesc: { bn: "ফরম্যাট: JPG, PNG, PDF (সর্বোচ্চ ৫ মেগাবাইট)", en: "Format: JPG, PNG, PDF (Max 5MB)" },
  uploadPassportSuccess: { bn: "সংযুক্ত করা হয়েছে", en: "Uploaded Successfully" },
  uploadPassportPrompt: { bn: "ক্লিক করে পাসপোর্টের ছবি বা পিডিএফ ফাইল আপলোড করুন *", en: "Click to upload Passport photo or PDF file *" },
  bookingWarning: { bn: "বুকিং কনফার্ম করার পর আমাদের কাস্টমার প্রতিনিধি হোয়াটসঅ্যাপে পেমেন্ট বিবরণী এবং টিকেট ই-মেইল করার জন্য কল করবেন।", en: "After confirming, our agent will contact you on WhatsApp to share payment details and email your e-ticket." },
  confirmBookingBtn: { bn: "বুকিং নিশ্চিত করুন ✈️", en: "Confirm Booking Now ✈️" },
  bookingSuccessTitle: { bn: "🎉 ফ্লাইট বুকিং রিকোয়েস্ট সফল হয়েছে!", en: "🎉 Flight Booking Request Successful!" },
  bookingSuccessSub: { bn: "আপনার বুকিংটি সফলভাবে সিস্টেমে তালিকাভুক্ত করা হয়েছে। আমাদের কাস্টমার প্রতিনিধি আগামী ১৫-৩০ মিনিটের মধ্যে আপনার সাথে যোগাযোগ করবেন।", en: "Your booking has been listed. Our customer representative will contact you within 15-30 minutes." },
  pnrCode: { bn: "ট্র্যাকিং নম্বর (PNR):", en: "Tracking Number (PNR):" },
  copyPnrBtn: { bn: "PNR কপি করুন 📋", en: "Copy PNR 📋" },
  shareWhatsappBtn: { bn: "হোয়াটসঅ্যাপে নিশ্চিত করুন 💬", en: "Confirm on WhatsApp 💬" },
  doneBtn: { bn: "সম্পন্ন", en: "Done" },

  // Visa Page
  visaHeroTitle: { bn: "বিশ্বস্ত ভিসা প্রসেসিং ও গাইড", en: "Trusted Visa Processing & Guidance" },
  visaHeroSubtitle: { bn: "সৌদি আরব, দুবাই, কাতার, ওমান সহ বিভিন্ন দেশের সঠিক ক্যাটাগরির ওমরাহ ও ওয়ার্ক ভিসা প্রসেস করুন প্রবাসবাংলা টিমের মাধ্যমে", en: "Process authentic Umrah, Tourist, and Work Visas for Saudi Arabia, Dubai, Qatar, Oman and Middle East destinations with Probasbangla" },
  selectCountry: { bn: "দেশ নির্বাচন করুন:", en: "Select Country:" },
  visaDuration: { bn: "মেয়াদ:", en: "Validity:" },
  processingTime: { bn: "প্রসেসিং সময়:", en: "Processing Time:" },
  visaPrice: { bn: "খরচ:", en: "Fee/Cost:" },
  requiredDocs: { bn: "প্রয়োজনীয় কাগজপত্র:", en: "Required Documents:" },
  applyVisaBtn: { bn: "আবেদন করুন", en: "Apply Now" },
  visaFormTitle: { bn: "ভিসা প্রসেসিং আবেদন ফরম", en: "Visa Processing Application Form" },
  applicantName: { bn: "আবেদনকারীর নাম (ইংরেজি) *", en: "Applicant Name (In English) *" },
  applicantNamePlaceholder: { bn: "উদাঃ Md. Karim Uddin", en: "e.g., Md. Karim Uddin" },
  uploadVisaDocs: { bn: "পাসপোর্টের ১ম পাতার রঙিন ছবি আপলোড করুন *", en: "Upload Passport First Page Colored Photo *" },
  uploadVisaDocsPrompt: { bn: "ক্লিক করে পাসপোর্টের ১ম পাতার রঙিন ছবি আপলোড করুন *", en: "Click to upload Passport 1st Page colored photo *" },
  visaFormWarning: { bn: "ভিসা আবেদন জমা হওয়ার পর আমাদের টিম প্রয়োজনীয় ডকুমেন্টস ভেরিফাই করার জন্য ফোন করবে। পেমেন্ট কাস্টমার প্রতিনিধির নির্দেশনা অনুযায়ী করতে হবে।", en: "After submission, our verification team will call you to verify documents. Payments are made securely per agent instructions." },
  submitVisaBtn: { bn: "আবেদন দাখিল করুন 🛂", en: "Submit Application 🛂" },
  visaSuccessTitle: { bn: "🎉 ভিসা প্রসেসিং আবেদন জমা হয়েছে!", en: "🎉 Visa Processing Application Submitted!" },
  visaSuccessSub: { bn: "আপনার আবেদন সফলভাবে রিসিভ করা হয়েছে। ১৫-৩০ মিনিটের মধ্যে কাস্টমার ম্যানেজার আপনাকে ফোন করে পরবর্তী করণীয় জানিয়ে দিবেন।", en: "Your application is received. An expert visa manager will contact you within 15-30 minutes." },

  // Hajj & Umrah Page
  hajjHeroTitle: { bn: "পবিত্র হজ্জ ও ওমরাহ সেবা", en: "Sacred Hajj & Umrah Services" },
  hajjHeroSubtitle: { bn: "হারামাইন শরীফাইনের মেহমানদের সেবায় নিয়োজিত। সেরা মানের হোটেল, বাঙালি খাবার ও সার্বক্ষণিক বিশ্বস্ত গাইড সহ প্রিমিয়াম প্যাকেজ বুক করুন", en: "Dedicated to serving the guests of Haramain. Book premium packages featuring standard hotels, Bengali meals, and expert guides" },
  makkahHotel: { bn: "মক্কা হোটেল:", en: "Makkah Hotel:" },
  madinahHotel: { bn: "মদিনা হোটেল:", en: "Madinah Hotel:" },
  packageDuration: { bn: "সময়সীমা:", en: "Duration:" },
  packageTransport: { bn: "যাতায়াত:", en: "Transport:" },
  packageFlights: { bn: "ফ্লাইট:", en: "Flights:" },
  packageInclude: { bn: "প্যাকেজে অন্তর্ভুক্ত সুবিধা সমূহ:", en: "Included Features & Facilities:" },
  bookPackageBtn: { bn: "প্যাকেজ বুক করুন 🕌", en: "Book Package Now 🕌" },
  hajjFormTitle: { bn: "ওমরাহ/হজ্জ প্যাকেজ বুকিং ফরম", en: "Umrah/Hajj Package Booking" },
  paxCount: { bn: "যাত্রী সংখ্যা (জন) *", en: "Total Passengers *" },
  travelMonth: { bn: "ভ্রমণের সম্ভাব্য মাস *", en: "Expected Travel Month *" },
  uploadHajjDocs: { bn: "প্রয়োজনীয় ডকুমেন্টের ছবি বা ফাইল আপলোড করুন *", en: "Upload Required Document Copy (Passport/Photo) *" },
  uploadHajjDocsPrompt: { bn: "ক্লিক করে পাসপোর্ট বা ওমরাহ যাত্রীর ছবি আপলোড করুন *", en: "Click to upload passport or passenger photo *" },
  hajjFormWarning: { bn: "স্লট বুকিং এর কোনো চার্জ নেই। বুকিং জমা দেওয়ার পর আমাদের ওমরাহ মুয়াল্লিম গাইড ফোন করে পাসপোর্ট জমার তারিখ নির্ধারণ করবেন।", en: "There are no booking charges. Our Umrah Guide will call you to schedule passport submission." },
  submitHajjBtn: { bn: "বুকিং স্লট বুক করুন 🕌", en: "Book Booking Slot 🕌" },

  // BMET Page
  bmetHeroTitle: { bn: "বিএমইটি স্মার্টকার্ড ও নাগরিক সেবা", en: "BMET Smartcard & Citizen Services" },
  bmetHeroSubtitle: { bn: "বিদেশগামী প্রবাসী কর্মীদের বিএমইটি স্মার্টকার্ডের আবেদন, জন্ম নিবন্ধন সংশোধন ও এনআইডি সংশোধন অত্যন্ত দ্রুততা ও বিশ্বস্ততার সাথে করে দেওয়া হয়", en: "Fast & trusted support for BMET Smartcard registrations, Birth Certificate corrections, and National ID updates for expatriates" },
  selectServicePrompt: { bn: "আবেদন করার জন্য সেবাটি নির্বাচন করুন:", en: "Select a Service to Apply:" },
  bmetInclude: { bn: "সেবাটির অন্তর্ভুক্ত কাজসমূহ:", en: "Scope of Service & Checklist:" },
  nidPlaceholder: { bn: "NID নম্বর (প্রযোজ্য ক্ষেত্রে)", en: "NID Number (If Applicable)" },
  bmetFormWarning: { bn: "আবেদন দাখিল সম্পন্ন হলে আমাদের টিম সরকারি সার্ভারে আবেদনের পূর্বে ম্যানুয়াল স্ক্রিনিং এর জন্য আপনাকে কল করবে।", en: "After submitting, our team will call you for manual pre-screening before uploading to government servers." },
  submitBmetBtn: { bn: "আবেদন সম্পন্ন করুন 📋", en: "Complete Application 📋" },
  bmetSuccessTitle: { bn: "🎉 সেবা আবেদনটি সফল হয়েছে!", en: "🎉 Service Request Successful!" },
  bmetSuccessSub: { bn: "আপনার নাগরিক সেবা আবেদনটি প্রবাসবাংলা সিস্টেমে নথিভুক্ত হয়েছে। আমাদের কাস্টমার এক্সিকিউটিভ দ্রুত যোগাযোগ করে সরকারি ফি পেমেন্ট ও পরবর্তী বিবরণ জানাবেন।", en: "Your request is registered. Our executive will call you to share fee details and process steps." },

  // Status Check Page
  statusHeroTitle: { bn: "বুকিং ও আবেদন ট্র্যাকিং সিস্টেম", en: "Booking & Application Tracking System" },
  statusHeroSubtitle: { bn: "আপনার বিমান টিকিট বুকিং, ভিসা প্রসেস অথবা সরকারি সেবা আবেদনের সর্বশেষ অগ্রগতি জানতে ট্র্যাকিং আইডি বা পাসপোর্ট নম্বর দিয়ে সার্চ করুন", en: "Track real-time progress of your flight bookings, visa processing, or citizen service requests using PNR or Passport details" },
  searchTrackingLabel: { bn: "ট্র্যাকিং নম্বর বা পাসপোর্ট নম্বর লিখুন", en: "Enter Tracking Number or Passport Number" },
  searchTrackingPlaceholder: { bn: "PNR নম্বর (যেমন: PBT-SV409-26) অথবা মোবাইল নম্বর লিখুন", en: "Enter PNR (e.g., PBT-SV409-26) or Mobile number" },
  searchTrackingBtn: { bn: "স্ট্যাটাস খুঁজুন 🔍", en: "Search Status 🔍" },
  statusResultTitle: { bn: "আবেদনের বিবরণী", en: "Application Details" },
  statusNoResult: { bn: "দুঃখিত! এই তথ্য দিয়ে কোনো সচল আবেদন বা বুকিং খুঁজে পাওয়া যায়নি। সঠিক ট্র্যাকিং আইডি বা মোবাইল নম্বর দিয়ে পুনরায় চেষ্টা করুন।", en: "Sorry! No active application or booking found with these details. Please verify your tracking ID or Mobile number and try again." },
  bookingId: { bn: "আবেদন আইডি:", en: "Application ID:" },
  serviceType: { bn: "সেবার ধরণ:", en: "Service Type:" },
  details: { bn: "বিবরণ:", en: "Details:" },
  applicant: { bn: "আবেদনকারী / যাত্রী:", en: "Applicant / Passenger:" },
  passportNo: { bn: "পাসপোর্ট:", en: "Passport:" },
  phoneNo: { bn: "মোবাইল নম্বর:", en: "Mobile No:" },
  currentStatus: { bn: "বর্তমান অবস্থা:", en: "Current Status:" },
  applyDate: { bn: "আবেদনের তারিখ:", en: "Application Date:" },

  // Shared Service Request Modal Home Page
  serviceRequestModalTitle: { bn: "সেবা আবেদন এবং পরামর্শ ফরম", en: "Service Request & Consultation" },
  extraPromptHome: { bn: "অতিরিক্ত তথ্য বা বিশেষ অনুরোধ", en: "Additional Notes or Special Requests" },
  uploadHomePrompt: { bn: "প্রয়োজনীয় ডকুমেন্টের ছবি বা ফাইল আপলোড করুন *", en: "Upload Required Document Copy (Passport/Photo) *" },
  submitHomeBtn: { bn: "অনুরোধ পাঠান 📤", en: "Send Request 📤" },
  successHomeTitle: { bn: "🎉 সেবা অনুরোধ সফলভাবে জমা হয়েছে!", en: "🎉 Service Request Submitted Successfully!" },
  successHomeSub: { bn: "আপনার অনুরোধটি গৃহীত হয়েছে। আগামী ১৫ মিনিটের মধ্যে আমাদের প্রতিনিধি আপনাকে ফোন করবেন।", en: "Your request is received. Our agent will call you within 15 minutes." },
  requiredDocsAlert: { bn: "দয়া করে প্রয়োজনীয় ছবি বা ডকুমেন্টটি (যেমনঃ পাসপোর্ট, টিকিট বা এনআইডি কপি) আপলোড করুন। ছবি আপলোড করা বাধ্যতামূলক।", en: "Please upload the required document photo (e.g., Passport, Ticket or NID copy). Document upload is mandatory." },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("probas_lang");
    return (saved as Language) || "bn";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("probas_lang", lang);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || key;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
