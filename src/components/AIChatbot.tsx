import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, X, Bot, Sparkles, User, RefreshCw, Compass, ArrowRight, ShieldCheck } from "lucide-react";
import { GOLD } from "./arabic/ArabicDecor";

interface Message {
  role: "user" | "model";
  text: string;
  time: string;
}

const PRESETS = [
  "ভিসা চেক করার নিয়ম কি?",
  "ওমরাহ প্যাকেজের খরচ কত?",
  "BMET স্মার্টকার্ড করতে কি কি লাগে?",
  "টিকিট বুকিং করার সঠিক নিয়ম",
  "NID ও পাসপোর্ট সংশোধনের খরচ"
];

const LOCAL_FALLBACK_ANSWERS: Record<string, string> = {
  "ভিসা": "সৌদি আরব, দুবাই, কাতার, ওমান সহ মিডল ইস্টের ভিসা চেক করতে আমাদের হোমপেজের 'ভিসা চেক' সেকশনে যান। সেখানে আপনার পাসপোর্ট নম্বর ও প্রয়োজনীয় তথ্য দিয়ে সরাসরি সরকারি সাইট থেকে চেক করতে পারবেন। বিস্তারিত জানতে কল করুন: ০১৩১৬৫৬৭৮২১।",
  "ওমরাহ": "আমাদের ২০২৬ সালের ওমরাহ প্যাকেজসমূহ অত্যন্ত জনপ্রিয়! ইকোনমি ওমরাহ প্যাকেজ শুরু মাত্র ১,৪৫,০০০ টাকা থেকে এবং প্রিমিয়াম ওমরাহ প্যাকেজ ১,৮৫,০০০ টাকা। মক্কা ও মদিনার অত্যন্ত কাছে হোটেল, ৩ বেলা বাঙালি খাবার ও অভিজ্ঞ গাইড থাকবে। বিস্তারিত প্যাকেজ অপশনে দেখুন।",
  "bmet": "BMET রেজিস্ট্রেশন এবং স্মার্টকার্ডের জন্য আপনার মূল পাসপোর্ট কপি, ভিসা কপি, ৩০০ টাকা কল্যাণ ফি পেমেন্ট স্লিপ এবং ৩ দিনের ট্রেনিং সার্টিফিকেট (PDO) প্রয়োজন। আমাদের 'BMET আবেদন' কার্ডে ক্লিক করে সরাসরি ফরম পূরণ করুন।",
  "স্মার্টকার্ড": "BMET রেজিস্ট্রেশন এবং স্মার্টকার্ডের জন্য আপনার মূল পাসপোর্ট কপি, ভিসা কপি, ৩০০ টাকা কল্যাণ ফি পেমেন্ট স্লিপ এবং ৩ দিনের ট্রেনিং সার্টিফিকেট (PDO) প্রয়োজন। আমাদের 'BMET আবেদন' কার্ডে ক্লিক করে সরাসরি ফরম পূরণ করুন।",
  "টিকিট": "নতুন টিকিট বুকিং করার জন্য আমাদের হোমপেজে 'নতুন টিকিট বুকিং' ফরমটি ব্যবহার করুন। আপনি কোথা থেকে কোথায় যাবেন, তারিখ এবং কেবিন ক্লাস নির্বাচন করে 'ফ্লাইট ভাড়া ও বুকিং' বাটনে ক্লিক করুন। আমরা আপনাকে সঠিক ভাড়া জানিয়ে কল দিব!",
  "nid": "জাতীয় পরিচয়পত্র (NID) সংশোধন বা নতুন আবেদনের জন্য জন্ম নিবন্ধন কপি, শিক্ষাগত যোগ্যতা সার্টিফিকেট এবং পিতা/মাতার NID প্রয়োজন। আমাদের 'NID আবেদন' সেকশনে ক্লিক করে আপনার প্রয়োজনীয় সংশোধনীর তথ্য জমা দিন।",
  "পাসপোর্ট": "পাসপোর্ট সংশোধন বা রি-ইস্যু করতে পাসপোর্ট নম্বর, জাতীয় পরিচয়পত্র বা জন্ম নিবন্ধনের কপি প্রয়োজন। আমাদের হটলাইন নম্বরে (০১৩১৬৫৬৭৮২১) যোগাযোগ করলে আমাদের প্রতিনিধি আপনার ফাইল রেডি করতে সাহায্য করবে।"
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "আসসালামু আলাইকুম! আমি প্রবাসবাংলা এআই সহকারী। এয়ার টিকিট, সৌদি ভিসা, ওমরাহ প্যাকেজ, পাসপোর্ট বা BMET স্মার্টকার্ড সহ যেকোনো প্রবাসী সেবা সম্পর্কে জানতে আমাকে প্রশ্ন করুন। আমি আপনাকে তাৎক্ষণিক সহায়তা করতে প্রস্তুত।",
      time: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMsg: Message = {
      role: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role === "model" ? "model" : "user",
        text: m.text
      }));

      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend, history: chatHistory })
      });

      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();
      
      const botMsg: Message = {
        role: "model",
        text: data.text || "দুঃখিত, আমি এই মুহূর্তে উত্তর তৈরি করতে পারছি না। দয়া করে আমাদের সরাসরি হটলাইনে কল করুন: ০১৩১৬৫৬৭৮২১।",
        time: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("AI Error, using local fallback matcher:", err);
      
      // Match local fallback answers
      let foundAnswer = "";
      const lowerText = textToSend.toLowerCase();
      
      for (const [key, value] of Object.entries(LOCAL_FALLBACK_ANSWERS)) {
        if (lowerText.includes(key)) {
          foundAnswer = value;
          break;
        }
      }

      if (!foundAnswer) {
        foundAnswer = "আসসালামু আলাইকুম! প্রবাসবাংলা এয়ার ট্রাভেলস এআই সহকারীতে আপনাকে স্বাগতম। আপনার প্রশ্নটির জন্য সরাসরি আমাদের কাস্টমার এজেন্টের সাথে কথা বলুন। হটলাইন ও হোয়াটসঅ্যাপ নম্বর: ০১৩১৬৫৬৭৮২১। আমরা আপনাকে সর্বোচ্চ সহযোগিতা করব।";
      }

      const botMsg: Message = {
        role: "model",
        text: foundAnswer,
        time: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })
      };
      
      // Delay response slightly to simulate thinking
      setTimeout(() => {
        setMessages((prev) => [...prev, botMsg]);
        setLoading(false);
      }, 800);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-[360px] sm:w-[400px] h-[520px] bg-[#FFFFFF]/95 border border-[#C9A84C]/30 rounded-2xl flex flex-col shadow-2xl overflow-hidden backdrop-blur-md mb-4"
          >
            {/* Header */}
            <div className="bg-slate-50 border border-slate-200 border-b border-[#C9A84C]/20 p-4 flex justify-between items-center relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C9A84C] to-[#E2C876] flex items-center justify-center text-[#FFFFFF] shadow-inner">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 text-xs sm:text-sm flex items-center gap-1.5 leading-none">
                    প্রবাসবাংলা <span style={{ color: GOLD }}>এআই সহকারী</span>
                  </h4>
                  <span className="text-[10px] text-sky-400 font-semibold flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    অনলাইন সাপোর্ট অ্যাসিস্ট্যান্ট
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-600 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div 
              ref={scrollRef}
              className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-emerald-800"
            >
              {messages.map((m, i) => (
                <div 
                  key={i} 
                  className={`flex gap-2.5 items-start max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    m.role === "user" ? "bg-[#C9A84C]/10 text-[#C9A84C]" : "bg-slate-900/60 text-sky-400 border border-slate-800"
                  }`}>
                    {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className="space-y-1">
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      m.role === "user" 
                        ? "bg-[#C9A84C] text-[#FFFFFF] rounded-tr-none font-semibold" 
                        : "bg-slate-50 border border-slate-200/80 text-slate-200 rounded-tl-none border border-[#C9A84C]/10"
                    }`}>
                      {m.text}
                    </div>
                    <span className="block text-[8px] text-slate-500 text-right font-mono px-1">
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5 items-start max-w-[80%]">
                  <div className="w-7 h-7 rounded-lg bg-slate-900/60 text-sky-400 border border-slate-800 flex items-center justify-center flex-shrink-0 animate-spin-slow">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200/60 text-slate-600 rounded-2xl rounded-tl-none border border-[#C9A84C]/5 text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-150" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-300" />
                    এআই সহকারী ভাবছে...
                  </div>
                </div>
              )}
            </div>

            {/* Presets and Suggestions Slider */}
            <div className="px-4 py-2 border-t border-slate-800/40 bg-[#FFFFFF]/60 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="inline-block px-2.5 py-1 text-[10px] font-medium text-slate-700 bg-slate-50 border border-slate-200 hover:bg-[#C9A84C]/15 border border-[#C9A84C]/10 hover:border-[#C9A84C]/30 rounded-full transition-all cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-3 bg-slate-50 border border-slate-200 border-t border-[#C9A84C]/15 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                placeholder="এয়ার টিকিট বা ভিসা সংক্রান্ত যেকোনো প্রশ্ন লিখুন..."
                className="flex-grow bg-[#F8FAFC] border border-[#C9A84C]/15 focus:border-[#C9A84C] text-xs text-slate-800 font-semibold placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={loading || !input.trim()}
                className="p-2.5 bg-[#C9A84C] hover:bg-[#B3933E] disabled:bg-slate-700/50 disabled:text-slate-600 text-[#FFFFFF] rounded-xl transition-all cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#C9A84C] to-[#E2C876] flex items-center justify-center text-[#FFFFFF] shadow-xl shadow-[#C9A84C]/25 cursor-pointer relative"
      >
        <span className="absolute inset-0 rounded-full border border-[#C9A84C] animate-ping opacity-25" />
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
