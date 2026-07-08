import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Smartphone, 
  Share2, 
  Check, 
  Download, 
  Tv, 
  Laptop, 
  Layers, 
  Info, 
  ArrowRight,
  ShieldAlert,
  Sliders,
  Award,
  Globe2,
  Calendar,
  CheckCircle2,
  User,
  Users,
  Plane,
  Heart,
  BookOpen,
  Map,
  BadgePercent,
  TrendingUp,
  Wallet,
  FileCheck2,
  HelpCircle
} from "lucide-react";

// Types
interface ServiceVideoAdPlayerProps {
  serviceName: string;
  onClose: () => void;
  agentName?: string;
  agentPhone?: string;
}

interface Subtitle {
  time: number;
  text: string;
}

export default function ServiceVideoAdPlayer({ serviceName, onClose, agentName = "", agentPhone = "" }: ServiceVideoAdPlayerProps) {
  // Playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5, 1, 1.5, 2
  const [activeTab, setActiveTab] = useState<"player" | "customizer">("player");

  // Agent customization state
  const [customAgency, setCustomAgency] = useState(agentName || "প্রবাস বাংলা ডিজিটাল");
  const [customPhone, setCustomPhone] = useState(agentPhone || "০১৮৩৯-১৮২৪৪৫");
  const [customAddress, setCustomAddress] = useState("বনানী, ঢাকা, বাংলাদেশ");
  const [videoTheme, setVideoTheme] = useState<"royal" | "cyber" | "neon" | "emerald">("royal");

  // Audio Context & Synthesizer State
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientOscsRef = useRef<OscillatorNode[]>([]);
  const ambientGainRef = useRef<GainNode | null>(null);

  // Subtitle synchronization state
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const lastSpokenTextRef = useRef<string>("");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  // Pre-load voices on mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Animation timeline trigger refs
  const progressInterval = useRef<any>(null);

  // Initialize Web Audio API safely
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  // Synthesize custom sound effects on-demand
  const playSoundEffect = (type: "stamp" | "scan" | "chime" | "takeoff" | "click") => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx || isMuted) return;

      const masterVolume = volume;

      if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.05 * masterVolume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } 
      else if (type === "stamp") {
        // Double punch impact sound (Thump-Clack)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        
        osc1.frequency.setValueAtTime(120, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
        gain1.gain.setValueAtTime(0.4 * masterVolume, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        
        osc1.start();
        osc1.stop(ctx.currentTime + 0.4);

        // High frequency slap
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "triangle";
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.setValueAtTime(800, ctx.currentTime);
        gain2.gain.setValueAtTime(0.15 * masterVolume, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.15);
      } 
      else if (type === "scan") {
        // High frequency sci-fi scanner sweep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        
        // Lowpass filter to make it warmer
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.6);
        osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 1.2);
        
        gain.gain.setValueAtTime(0.08 * masterVolume, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08 * masterVolume, ctx.currentTime + 1.0);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        osc.start();
        osc.stop(ctx.currentTime + 1.25);
      } 
      else if (type === "chime") {
        // Beautiful arpeggiated C-Major chord chime
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.connect(gain);
          gain.connect(ctx.destination);

          const delay = idx * 0.08;
          osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.setValueAtTime(0.15 * masterVolume, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.8);

          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.9);
        });
      } 
      else if (type === "takeoff") {
        // Deep plane engine hum + white noise glide
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 1.5);
        gain.gain.setValueAtTime(0.12 * masterVolume, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.18 * masterVolume, ctx.currentTime + 1.0);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

        osc.start();
        osc.stop(ctx.currentTime + 1.85);
      }
    } catch (e) {
      console.warn("Audio Context Error: ", e);
    }
  };

  // Speaks the subtitle text aloud using Bengali TTS
  const speakText = (text: string) => {
    if (!isVoiceEnabled || isMuted || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop prior narration

      // Remove emojis and leading symbols for beautiful, clean natural speech
      const cleanText = text
        .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "")
        .replace(/^[✈️📅🛫📝🆔👶🛂🕌🎒👨‍👩‍👦🚗📋🎓💰📊🖥️🔍⚙️✅🎟️🌟⚡📞🛡️✨🎉💼⏱️🛑🎨]+/g, "")
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "bn-BD"; // Bengali (Bangladesh)
      
      // Select best Bengali voice
      const voices = window.speechSynthesis.getVoices();
      const bnVoice = voices.find(v => v.lang.toLowerCase().includes("bn"));
      if (bnVoice) {
        utterance.voice = bnVoice;
      }
      
      utterance.rate = 0.95; // Slightly slower for crisp clear delivery
      utterance.pitch = 1.0;
      utterance.volume = volume;
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech Synthesis Error: ", e);
    }
  };

  // Start ambient backing music loop dynamically
  const startMusic = () => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx || isMuted) return;

      // Stop any existing music first
      stopMusic();

      const masterVolume = volume;
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.04 * masterVolume, ctx.currentTime);
      gainNode.connect(ctx.destination);
      ambientGainRef.current = gainNode;

      // Create a chord: Root, Third, Fifth (Warm triangle waves)
      const rootFreq = 196.00; // G3 or dynamic
      const chordNotes = [rootFreq, rootFreq * 1.25, rootFreq * 1.5, rootFreq * 2.0]; // G3, B3, D4, G4

      chordNotes.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.connect(gainNode);
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        // Simple LFO pitch modulation
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.5, ctx.currentTime); // 0.5Hz slow drift
        lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        lfo.start();
        osc.start();

        ambientOscsRef.current.push(osc);
        ambientOscsRef.current.push(lfo as any); // Track to stop later
      });
    } catch (e) {
      console.warn("Music synth error: ", e);
    }
  };

  const stopMusic = () => {
    ambientOscsRef.current.forEach((osc) => {
      try { osc.stop(); } catch(e){}
    });
    ambientOscsRef.current = [];
    if (ambientGainRef.current) {
      try { ambientGainRef.current.disconnect(); } catch(e){}
      ambientGainRef.current = null;
    }
  };

  // Update volume of running background music when volume slider shifts
  useEffect(() => {
    if (ambientGainRef.current && audioCtxRef.current) {
      const targetVol = isMuted ? 0 : 0.04 * volume;
      ambientGainRef.current.gain.setValueAtTime(targetVol, audioCtxRef.current.currentTime);
    }
  }, [volume, isMuted]);

  // Subtitles sequence database for 17 services
  const getSubtitlesForService = (sName: string): Subtitle[] => {
    const defaultSubs = [
      { time: 0, text: "প্রবাস বাংলা ডিজিটালে আপনাকে স্বাগতম!" },
      { time: 10, text: "আপনার কাঙ্ক্ষিত সেবাটি অনলাইনে সহজে আবেদন করুন।" },
      { time: 30, text: "আমরা দিচ্ছি নির্ভরযোগ্য এবং দ্রুততম অনলাইন সলিউশন।" },
      { time: 55, text: "যেকোনো জরুরি প্রয়োজনে আমাদের কল করুন।" },
      { time: 75, text: "প্রবাস বাংলা - প্রবাসীদের বিশ্বস্ত ডিজিটাল সহযোগী।" },
      { time: 92, text: "আজই যোগাযোগ করুন এবং আপনার অর্ডার নিশ্চিত করুন!" }
    ];

    const subsMap: Record<string, Subtitle[]> = {
      "এয়ার টিকিট চেক": [
        { time: 0, text: "✈️ এয়ার টিকিট চেক করছেন? সঠিক তথ্য জানুন সহজেই!" },
        { time: 15, text: "🔍 টিকিট নম্বর ও PNR কোড দিন, রিয়েল-টাইম এয়ারলাইন তথ্য দেখুন।" },
        { time: 35, text: "⚙️ আমাদের স্মার্ট সার্ভার সরাসরি গ্লোবাল ডাটাবেজ যাচাই করে!" },
        { time: 55, text: "✅ জাল বা ভুয়া টিকিট থেকে নিজেকে শতভাগ নিরাপদ রাখুন।" },
        { time: 75, text: "📞 আপনার টিকিট সঠিক কিনা তাৎক্ষণিক নিশ্চিত হতে আমাদের কল করুন।" },
        { time: 92, text: "✨ প্রবাস বাংলা ডিজিটাল - আপনার বিশ্বস্ত টিকিট ভেরিফায়ার!" }
      ],
      "তারিখ পরিবর্তন": [
        { time: 0, text: "📅 ফ্লাইটের তারিখ পরিবর্তন করতে চান? আর কোনো টেনশন নেই!" },
        { time: 18, text: "✈️ যেকোনো এয়ারলাইন্সের টিকিট সহজে নতুন তারিখে রি-ইস্যু করুন।" },
        { time: 38, text: "⚙️ আপনার PNR দিন এবং আপনার কাঙ্ক্ষিত নতুন ভ্রমণের তারিখ জানান।" },
        { time: 58, text: "💼 আমাদের টিম সর্বনিম্ন চার্জে আপনার ভ্রমণ সূচী পরিবর্তন করে দেবে।" },
        { time: 78, text: "📞 ঘরে বসেই মাত্র কয়েক মিনিটে প্রসেসটি সম্পন্ন করতে আজই যোগাযোগ করুন!" },
        { time: 92, text: "🌟 আপনার সুনির্দিষ্ট ও আরামদায়ক ভ্রমণ নিশ্চিত করাই আমাদের লক্ষ্য।" }
      ],
      "নতুন টিকিট বুকিং": [
        { time: 0, text: "🛫 সবচেয়ে কমদামে বিশ্বমানের এয়ারলাইন্সে বিমান টিকিট বুক করুন!" },
        { time: 15, text: "🎟️ ওয়ান-ওয়ে বা রিটার্ন টিকিট কিনুন আকর্ষণীয় ডিসকাউন্টে।" },
        { time: 35, text: "🌟 সৌদি আরব, ওমান, দুবাই, কাতারসহ বিশ্বের যেকোনো রুটের টিকিট রয়েছে।" },
        { time: 55, text: "⚡ কোনো বাড়তি ঝামেলা ছাড়াই দ্রুততম সময়ে পেয়ে যান ই-টিকিট।" },
        { time: 75, text: "📞 বেস্ট লাস্ট-মিনিট ডিল ও বিশেষ ডিসকাউন্ট বুক করতে সরাসরি ফোন দিন!" },
        { time: 92, text: "✈️ শুভ যাত্রা! প্রবাস বাংলা ডিজিটাল-এর সাথে নিরাপদে পাড়ি দিন আকাশে।" }
      ],
      "পাসপোর্ট আবেদন": [
        { time: 0, text: "📝 নতুন পাসপোর্ট করতে চান নাকি রি-ইস্যু বা ভুল সংশোধন?" },
        { time: 18, text: "🌐 নির্ভুলভাবে পাসপোর্ট ফর্ম পূরণ ও পেমেন্ট স্লিপ রেডি করুন আমাদের সাথে।" },
        { time: 38, text: "📂 প্রয়োজনীয় সব কাগজপত্র নিখুঁতভাবে ফাইল সাজাতে আমাদের সাহায্য নিন।" },
        { time: 58, text: "⚡ খুব দ্রুততম সময়ে আপনার পাসপোর্ট প্রসেস করতে আমরা কাজ করি।" },
        { time: 78, text: "📞 পাসপোর্ট আবেদনের যেকোনো তথ্যের জন্য সরাসরি আমাদের কল করুন।" },
        { time: 92, text: "🛡️ প্রবাস বাংলা ডিজিটাল - আপনার পাসপোর্ট সেবার নিখুঁত গাইড।" }
      ],
      "NID আবেদন": [
        { time: 0, text: "🆔 জাতীয় পরিচয়পত্রের নাম, বয়স বা ঠিকানা ভুল? সংশোধন করুন!" },
        { time: 18, text: "🖥️ নতুন ভোটার নিবন্ধন কিংবা হারিয়ে যাওয়া আইডি কার্ডের অনলাইন সেবা।" },
        { time: 38, text: "📑 সাপোর্টিং পেপারস নিখুঁতভাবে আপলোড করুন, কোনো রিজেকশনের ভয় নেই।" },
        { time: 58, text: "⚡ সরকারি পোর্টালের মাধ্যমে দ্রুততম ট্র্যাকিং প্রসেসিং ব্যবস্থা।" },
        { time: 78, text: "📞 আপনার এনআইডি জটিলতার সহজ ও নিরাপদ সমাধান পেতে যোগাযোগ করুন।" },
        { time: 92, text: "✨ যেকোনো সংশোধনের ওয়ান-স্টপ সাপোর্ট - প্রবাস বাংলা।" }
      ],
      "जन्म নিবন্ধন": [
        { time: 0, text: "👶 নতুন জন্ম সনদ আবেদন বা অনলাইন সংশোধন এখন হাতের মুঠোয়!" },
        { time: 18, text: "📝 জন্ম নিবন্ধন অনলাইন করতে সব জটিলতা সহজেই দূর করুন।" },
        { time: 38, text: "📂 আপনার প্রয়োজনীয় সার্টিফিকেট ও পিতা-মাতার আইডি দিয়ে ফর্ম সাবমিট করুন।" },
        { time: 58, text: "🌐 সরকারি অনলাইন সার্ভার ডাটাবেজে আপনার জন্ম সনদ নির্ভুল এন্ট্রি করুন।" },
        { time: 78, text: "📞 জন্ম নিবন্ধন সংক্রান্ত যেকোনো সংশোধনের জন্য আজই আমাদের কল দিন।" },
        { time: 92, text: "🎉 প্রবাস বাংলা ডিজিটাল - আপনার নিরাপদ ভবিষ্যৎ গড়ার সঙ্গী।" }
      ],
      "ভিসা চেক": [
        { time: 0, text: "🛂 আপনার ভিসাটি কি আসলেও সঠিক নাকি ভুয়া? যাচাই করুন!" },
        { time: 15, text: "🔍 সৌদি আরব, দুবাই, কাতার বা ওমানের ভিসা সঠিক সময়ে যাচাই করুন।" },
        { time: 35, text: "🌐 সরাসরি সরকারি এম্বেসি ও ইমিগ্রেশন ডাটাবেজ থেকে রিয়েল স্ট্যাটাস চেক।" },
        { time: 55, text: "🛡️ যেকোনো বড় প্রতারণার হাত থেকে নিজেকে এবং পরিবারকে বাঁচান।" },
        { time: 75, text: "📞 ভিসা যাচাই ও ফাইল ভেরিফিকেশনের জন্য এখনই আমাদের কল করুন।" },
        { time: 92, text: "✅ নিরাপদ বিদেশ যাত্রা ও ভিসার শতভাগ সঠিক তথ্য দিতে আমরা প্রস্তুত!" }
      ],
      "ভিসা রেজিস্ট্রেশন": [
        { time: 0, text: "🛂 নতুন ভিসার স্ট্যাম্পিং ও সরকারি বায়োমেট্রিক আঙ্গুলের ছাপ বুকিং করুন।" },
        { time: 18, text: "📋 সকল প্রয়োজনীয় কাগজপত্র প্রসেস এবং পুলিশ ক্লিয়ারেন্স সাপোর্ট।" },
        { time: 38, text: "⚙️ লাইভ ফিঙ্গারপ্রিন্ট সিডিউল এবং মেডিকেল সেন্টার স্লিপ ইনস্ট্যান্ট বুকিং।" },
        { time: 58, text: "💼 অত্যন্ত বিশ্বস্তভাবে আপনার ফাইলটি এম্বেসির জন্য প্রসেস করা হবে।" },
        { time: 78, text: "📞 দ্রুত এবং ঝামেলামুক্ত ভিসা প্রসেসের জন্য আজই আমাদের পেপারস দিন।" },
        { time: 92, text: "🛡️ আপনার স্বপ্ন পূরণে প্রবাস বাংলা ডিজিটাল কাজ করে সবসময়।" }
      ],
      "হজ্জ ও ওমরাহ": [
        { time: 0, text: "🕌 ২০২৬ ওমরাহ হজ্জের পবিত্র যাত্রা সফল ও নিরাপদ করুন!" },
        { time: 15, text: "🕋 মক্কা ও মদিনার অতি নিকটে লাক্সারি হোটেল ও অভিজ্ঞ গাইড সুবিধা।" },
        { time: 35, text: "✈️ কমদামে কাস্টমাইজড বা গ্রুপ ওমরাহ প্যাকেজ বুকিং চলছে।" },
        { time: 55, text: "🎟️ ভিসা প্রসেসিং, এয়ার টিকিট, ও জিয়ারা ট্রান্সপোর্ট এক প্যাকেজে!" },
        { time: 75, text: "📞 সীমিত সংখ্যক ওমরাহ সিট বুকিংয়ের জন্য আজই আমাদের হটলাইনে কল দিন।" },
        { time: 92, text: "✨ আল্লাহর ঘরের মেহমানদের সেবায় নিয়োজিত - প্রবাস বাংলা।" }
      ],
      "ভিজিট ভিসা": [
        { time: 0, text: "✈️ দুবাই, কাতার বা সৌদি আরব ট্যুরিস্ট ভিসা প্রসেস করুন সহজে!" },
        { time: 18, text: "🎒 ফ্যামিলি ট্যুর বা বিজনেসের জন্য ওয়ান-স্টপ ভিজিট ভিসা সলিউশন।" },
        { time: 38, text: "📑 মাত্র কয়েকটি সহজ ডকুমেন্টে নিশ্চিত করুন আপনার সিঙ্গেল বা মাল্টিপল এন্ট্রি।" },
        { time: 58, text: "⚡ দ্রুততম সময়ে ৩ মাস বা ১ মাসের কমার্শিয়াল ট্যুরিস্ট ভিসা প্রসেস।" },
        { time: 78, text: "📞 আকর্ষণীয় মূল্যে ভিজিট ভিসা পেতে এখনই আমাদের কল করে পেপারস পাঠান।" },
        { time: 92, text: "🌟 আপনার স্বপ্নের দেশে ভ্রমণের আনন্দ বাড়াবে প্রবাস বাংলা ডিজিটাল!" }
      ],
      "ফ্যামিলি ভিসা": [
        { time: 0, text: "👨‍👩‍👦 পরিবারকে বিদেশে নিয়ে যেতে চান? আমরা আছি আপনার পাশে!" },
        { time: 18, text: "📋 ফ্যামিলি স্পন্সর ভিসা ও পেপারস ভেরিফিকেশন প্রসেস সহজ করুন।" },
        { time: 38, text: "📑 ইমিগ্রেশন চেম্বার ও চেম্বার অফ কমার্স এপ্রুভাল ফাইল প্রিপারেশন।" },
        { time: 58, text: "💖 আপনার আপনজনদের ভিসা প্রসেসিং হবে শতভাগ নিখুঁত ও বিশ্বস্ত উপায়ে।" },
        { time: 78, text: "📞 ফ্যামিলি ভিজিট বা রেসিডেন্স ভিসার সম্পূর্ণ তথ্য জানতে যোগাযোগ করুন।" },
        { time: 92, text: "✨ পরিবারকে আপনার কাছে নিয়ে আসার সবচেয়ে দ্রুততম সমাধান!" }
      ],
      "জিয়ারা ভিসা": [
        { time: 0, text: "🕋 সৌদি আরবের পবিত্র জিয়ারা ও ঐতিহাসিক স্থানসমূহ পরিদর্শনের ভিসা!" },
        { time: 18, text: "🕌 মক্কা, মদিনা, তায়েফ ও ঐতিহাসিক বদর যুদ্ধের স্থানসমূহ ভ্রমণ গাইড।" },
        { time: 38, text: "📄 মাত্র কয়েক কার্যদিবসে জিয়ারা ট্রানজিট ভিসা প্রসেসিং নিশ্চিত।" },
        { time: 58, text: "🚗 আরামদায়ক এসি ট্রান্সপোর্ট ও হোটেল বুকিংয়ের স্পেশাল কম্বো প্যাক।" },
        { time: 78, text: "📞 জিয়ারা ভিসার আকর্ষণীয় গ্রুপ বা সিঙ্গেল ডিল বুক করতে ফোন দিন।" },
        { time: 92, text: "✨ আপনার ধর্মীয় ও ঐতিহাসিক সফর বরকতময় হোক - প্রবাস বাংলা।" }
      ],
      "BMET আবেদন": [
        { time: 0, text: "📋 বিদেশগামী কর্মীদের ফাইনাল BMET স্মার্টকার্ড ডাউনলোড ও রেজিস্ট্রেশন!" },
        { time: 18, text: "⚙️ কোনো ভোগান্তি ছাড়াই সরকারি বিএমইটি ফি পরিশোধ ও ফর্ম পূরণ।" },
        { time: 38, text: "💳 ইনস্ট্যান্ট ফিঙ্গারপ্রিন্ট ট্র্যাকিং ও অনলাইন স্মার্টকার্ড ডাউনলোড।" },
        { time: 58, text: "🛡️ ইমিগ্রেশন পারমিট ও বিএমইটি ছাড়পত্রের নির্ভুল ডিজিটাল কপি রেডি।" },
        { time: 78, text: "📞 বিএমইটি স্মার্টকার্ড ও রেজিস্ট্রেশন সহায়তার জন্য আমাদের ফোন করুন।" },
        { time: 92, text: "💼 প্রবাসীদের প্রতিটি পদক্ষেপকে সহজ ও আইনি করতে আমরা প্রতিজ্ঞাবদ্ধ।" }
      ],
      "৩ দিনের ট্রেনিং": [
        { time: 0, text: "🎓 ৩ দিনের প্রি-ডিপার্চার ওরিয়েন্টেশন (PDO) ট্রেনিং বুকিং সেন্টার!" },
        { time: 18, text: "🗓️ আপনার নিকটস্থ ট্রেনিং সেন্টারে কাঙ্ক্ষিত ডেট ও সিট কনফার্ম করুন।" },
        { time: 38, text: "📑 ট্রেনিংয়ের পেমেন্ট ও এডমিট কার্ড ডাউনলোড প্রসেসিং ঝামেলাহীন।" },
        { time: 58, text: "📜 সফলভাবে ৩ দিনের ট্রেনিং শেষে অনলাইন থেকে PDO সার্টিফিকেট উত্তোলন।" },
        { time: 78, text: "📞 ট্রেনিং সেন্টারের সিডিউল ও সিট ফিলাপ সংক্রান্ত তথ্যের জন্য কল দিন।" },
        { time: 92, text: "✨ আপনার সুন্দর কর্মসংস্থান ও আইনি প্রসেসিংয়ের ওয়ান-স্টপ সহযোগী।" }
      ],
      "ডিপোজিট": [
        { time: 0, text: "💰 B2B এজেন্টদের ওয়ালেট ব্যালেন্স ফান্ড অ্যাড করার সুবিধা!" },
        { time: 18, text: "💳 Bkash, Nagad, রকেট বা ব্যাংকিং মাধ্যমে ইনস্ট্যান্ট ডিপোজিট করুন।" },
        { time: 38, text: "⚡ আপনার জমা স্লিপ দিন, ব্যালেন্স দ্রুত ওয়ালেটে যুক্ত হবে।" },
        { time: 58, text: "📈 নিরবচ্ছিন্ন ব্যবসা পরিচালনায় ২৪/৭ রিটেইল পোর্টাল রিচার্জ সেবা।" },
        { time: 78, text: "📞 ডিপোজিট বা ফান্ড ট্রান্সফারে যেকোনো টেকনিক্যাল সাপোর্টে কল করুন।" },
        { time: 92, text: "💼 প্রবাস বাংলা পোর্টাল - এজেন্টদের ব্যবসার সবচেয়ে বিশ্বস্ত পার্টনার।" }
      ],
      "রিটেইলার ব্যালেন্স": [
        { time: 0, text: "📊 আপনার B2B রিটেইলার ব্যালেন্স রিয়েল-টাইমে আপডেট রাখুন।" },
        { time: 18, text: "🔍 প্রতিটি ট্রানজেকশন ট্র্যাকিং এবং বিশদ কমিশন লেজার স্টেটমেন্ট।" },
        { time: 38, text: "💼 আপনার ওয়ালেট ব্যালেন্স চেক এবং সিকিউর ফান্ড উইথড্রয়াল সুবিধা।" },
        { time: 58, text: "⚡ অত্যন্ত নিরাপদ ক্রিপ্টোগ্রাফিক সুরক্ষায় আপনার ওয়ালেট ডাটা সংরক্ষিত।" },
        { time: 78, text: "📞 ওয়ালেট ও রিটেইলার পেমেন্ট সংক্রান্ত জরুরি হেল্পের জন্য যোগাযোগ করুন।" },
        { time: 92, text: "🌟 আপনার বিশ্বস্ত অনলাইন ওয়ালেট সলিউশন - প্রবাস বাংলা।" }
      ],
      "রিটেইলার ড্যাশবোর্ড": [
        { time: 0, text: "🖥️ প্রবাস বাংলা রিটেইলার ড্যাশবোর্ড - এজেন্টদের স্মার্ট কন্ট্রোল প্যানেল!" },
        { time: 15, text: "📈 একটিমাত্র স্ক্রিনেই দেখুন সেলস গ্রাফ, একটিভ কাস্টমার ও বুকিং সামারি।" },
        { time: 35, text: "💰 কাস্টমার প্রতি আকর্ষণীয় কমিশন আয় করুন এবং আয় বাড়ান প্রতি মাসে।" },
        { time: 55, text: "🛡️ সিকিউর পোর্টাল লগইন ও রিয়েল-টাইম ট্রানজেকশন মনিটরিং।" },
        { time: 75, text: "📞 রিটেইলার অ্যাকাউন্ট খুলে ব্যবসা শুরু করতে এখনই আমাদের হটলাইনে কল দিন!" },
        { time: 92, text: "🚀 প্রবাস বাংলা পোর্টাল - আপনার ট্রাভেল ও নাগরিক সেবাকে দেবে ডানা!" }
      ]
    };

    return subsMap[sName] || defaultSubs;
  };

  const subtitles = getSubtitlesForService(serviceName);

  // Sync subtitle as timeline changes
  useEffect(() => {
    const currentText = subtitles
      .filter(s => progress >= s.time)
      .slice(-1)[0]?.text || "প্রবাস বাংলা ডিজিটালে আপনাকে স্বাগতম!";
    setCurrentSubtitle(currentText);

    // Speak text if it actually changed
    if (currentText !== lastSpokenTextRef.current) {
      lastSpokenTextRef.current = currentText;
      if (isPlaying && !isMuted && isVoiceEnabled) {
        speakText(currentText);
      }
    }

    // Audio cues on specific timeline highlights
    if (progress === 0 && isPlaying) {
      playSoundEffect("chime");
    }
    if (progress === 15 || progress === 55) {
      playSoundEffect("scan");
    }
    if (progress === 35 || progress === 75) {
      playSoundEffect("stamp");
    }
    if (progress === 92) {
      playSoundEffect("chime");
    }
  }, [progress, isPlaying]);

  // Sync vocal speech whenever play/pause state or mute/voice state shifts
  useEffect(() => {
    if (isPlaying && !isMuted && isVoiceEnabled) {
      speakText(currentSubtitle);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isPlaying, isVoiceEnabled, isMuted, currentSubtitle]);

  // Video loop handling
  useEffect(() => {
    if (isPlaying) {
      startMusic();
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            playSoundEffect("chime");
            return 0; // Restart Loop
          }
          return prev + (1 * playbackSpeed);
        });
      }, 100);
    } else {
      stopMusic();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      stopMusic();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, playbackSpeed, isMuted]);

  // Handle Close Button / Modal Dismissal
  const handleClose = () => {
    stopMusic();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    onClose();
  };

  // Get current theme styling
  const getThemeStyles = () => {
    switch (videoTheme) {
      case "cyber":
        return {
          bg: "bg-slate-950",
          accent: "text-cyan-400",
          border: "border-cyan-500/30",
          button: "bg-cyan-500 hover:bg-cyan-600 text-slate-950",
          glow: "shadow-[0_0_15px_rgba(34,211,238,0.2)]",
          title: "text-cyan-300 font-mono"
        };
      case "neon":
        return {
          bg: "bg-zinc-950",
          accent: "text-fuchsia-500",
          border: "border-fuchsia-500/30",
          button: "bg-fuchsia-600 hover:bg-fuchsia-700 text-white",
          glow: "shadow-[0_0_15px_rgba(240,46,170,0.2)]",
          title: "text-fuchsia-400 font-extrabold"
        };
      case "emerald":
        return {
          bg: "bg-slate-950",
          accent: "text-emerald-400",
          border: "border-emerald-500/30",
          button: "bg-emerald-500 hover:bg-emerald-600 text-slate-950",
          glow: "shadow-[0_0_15px_rgba(52,211,153,0.2)]",
          title: "text-emerald-300"
        };
      case "royal":
      default:
        return {
          bg: "bg-slate-900",
          accent: "text-[#C9A84C]",
          border: "border-[#C9A84C]/30",
          button: "bg-[#C9A84C] hover:bg-[#b0913e] text-white",
          glow: "shadow-[0_0_15px_rgba(201,168,76,0.15)]",
          title: "text-[#E2C876] font-extrabold"
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row h-[90vh] lg:h-auto max-h-[90vh]">
        
        {/* LEFT COLUMN: THE SIMULATED VIDEO PLAYER */}
        <div className="flex-1 flex flex-col justify-between bg-black relative p-4 border-r border-slate-800">
          
          {/* Bezel Overlay: Live Promo Badge */}
          <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-black/75 px-3 py-1.5 rounded-full border border-slate-700/50">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            <span className="text-[10px] text-red-500 uppercase tracking-widest font-extrabold">REC / LIVE AD</span>
            <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded ml-1">1080p HD</span>
          </div>

          <div className="absolute top-6 right-6 z-20">
            <button 
              onClick={() => {
                playSoundEffect("click");
                setIsMuted(!isMuted);
              }}
              className="p-2 bg-black/75 rounded-full border border-slate-700/50 text-slate-300 hover:text-white cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#C9A84C]" />}
            </button>
          </div>

          {/* MAIN PLAYER VIEWSCREEN PORTAL */}
          <div className={`relative flex-1 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 ${theme.bg} ${theme.glow} transition-colors duration-500 m-2 mt-10 min-h-[280px]`}>
            
            {/* Ambient Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            {/* Interactive Vector Animation Canvas */}
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
              <AnimatePresence mode="wait">
                
                {/* INTRO SCENE (0s to 15s) */}
                {progress < 20 && (
                  <motion.div 
                    key="intro"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4 z-10"
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="inline-block bg-slate-800/50 p-4 rounded-3xl border border-slate-700"
                    >
                      <Tv className={`w-12 h-12 ${theme.accent} filter drop-shadow-[0_0_12px_rgba(201,168,76,0.3)]`} />
                    </motion.div>
                    
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
                      {customAgency} <span className={theme.accent}>উপস্থাপিত</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      স্পেশাল সার্ভিস ভিডিও অ্যাড ও মোশন গ্রাফিক্স
                    </p>
                    <div className="flex justify-center gap-1.5">
                      <span className="h-1.5 w-6 rounded bg-[#C9A84C]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-600 animate-pulse" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                    </div>
                  </motion.div>
                )}

                {/* THE CORE AD CONTENT SCENE (15s to 85s) */}
                {progress >= 20 && progress < 85 && (
                  <motion.div 
                    key="core"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full max-w-md space-y-4 z-10 flex flex-col items-center justify-center"
                  >
                    {/* Visual Storyboard Animation for each service */}
                    
                    {/* Service specific graphic element */}
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      
                      {/* Ambient Glowing Aura */}
                      <div className={`absolute inset-4 rounded-full filter blur-xl opacity-35 bg-radial ${theme.accent === "text-cyan-400" ? "from-cyan-400" : theme.accent === "text-fuchsia-500" ? "from-fuchsia-500" : "from-[#C9A84C]"}`} />

                      {/* Service Specifs Rendering */}
                      {serviceName === "এয়ার টিকিট চেক" && (
                        <>
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                            className="absolute inset-0 border-2 border-dashed border-slate-700/80 rounded-full"
                          />
                          <motion.div 
                            animate={{ 
                              x: [10, 45, 10, -45, 10], 
                              y: [-45, -10, 45, -10, -45],
                              rotate: [0, 90, 180, 270, 360]
                            }}
                            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                            className="absolute text-[#C9A84C]"
                          >
                            <Plane className="w-7 h-7 fill-[#C9A84C]/20" />
                          </motion.div>
                          <motion.div 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: [0.8, 1.05, 0.8] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col items-center space-y-1.5 shadow-xl"
                          >
                            <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">PNR: PB-2026</span>
                            <span className="text-xs font-black text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> CONFIRMED</span>
                          </motion.div>
                        </>
                      )}

                      {serviceName === "তারিখ পরিবর্তন" && (
                        <>
                          <motion.div 
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 5 }}
                            className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center"
                          >
                            <Calendar className={`w-10 h-10 ${theme.accent} mb-1`} />
                            <div className="flex gap-2 items-center">
                              <span className="text-[10px] line-through text-slate-500 font-mono">10 JUL</span>
                              <span className="text-xs text-[#C9A84C] font-bold">➔</span>
                              <motion.span 
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-xs text-emerald-400 font-mono font-black"
                              >
                                25 JUL
                              </motion.span>
                            </div>
                          </motion.div>
                        </>
                      )}

                      {serviceName === "নতুন টিকিট বুকিং" && (
                        <>
                          <motion.div 
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col items-center shadow-xl space-y-2"
                          >
                            <div className="flex gap-2 items-center">
                              <span className="text-xs font-bold text-white font-mono">DAC</span>
                              <Plane className="w-3.5 h-3.5 text-[#C9A84C]" />
                              <span className="text-xs font-bold text-white font-mono">RUH</span>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                              কম ভাড়ার টিকিট রেডি
                            </div>
                          </motion.div>
                        </>
                      )}

                      {serviceName === "পাসপোর্ট আবেদন" && (
                        <>
                          <motion.div 
                            animate={{ rotateY: 360 }}
                            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                            className="bg-emerald-800/90 border border-emerald-500/40 p-5 rounded-xl flex flex-col items-center shadow-2xl w-24 h-32 justify-between"
                          >
                            <Globe2 className="w-8 h-8 text-[#C9A84C]" />
                            <span className="text-[10px] font-bold text-white tracking-widest font-mono">PASSPORT</span>
                            <div className="w-12 h-1 bg-yellow-500 rounded" />
                          </motion.div>
                          <motion.div 
                            animate={{ scale: [0, 1.2, 1], rotate: [0, 15, 10] }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="absolute bottom-2 -right-2 bg-[#C9A84C] text-slate-950 font-black text-[9px] px-2 py-1 rounded shadow-lg uppercase tracking-wide border border-white/20"
                          >
                            APPROVED
                          </motion.div>
                        </>
                      )}

                      {serviceName === "NID আবেদন" && (
                        <>
                          <motion.div 
                            animate={{ scale: [0.95, 1.05, 0.95] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl w-44 h-28 flex flex-col justify-between"
                          >
                            <div className="flex items-start justify-between">
                              <div className="w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                                <User className="w-5 h-5 text-slate-400" />
                              </div>
                              <div className="space-y-1 flex-1 ml-2 text-left">
                                <div className="w-16 h-1.5 bg-slate-600 rounded" />
                                <div className="w-24 h-1 bg-slate-600 rounded" />
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                              <span className="text-[8px] font-mono text-[#C9A84C] font-black">NID CARD VERIFIED</span>
                              <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-white stroke-[4px]" />
                              </div>
                            </div>
                          </motion.div>
                        </>
                      )}

                      {serviceName === "জন্ম নিবন্ধন" && (
                        <>
                          <motion.div 
                            animate={{ rotate: [-3, 3, -3] }}
                            transition={{ repeat: Infinity, duration: 6 }}
                            className="bg-teal-950/80 border border-teal-500/30 p-5 rounded-2xl flex flex-col items-center shadow-xl space-y-2"
                          >
                            <Award className="w-10 h-10 text-teal-400" />
                            <span className="text-[10px] font-bold text-white">জন্ম নিবন্ধন সনদ</span>
                            <span className="text-[8px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-mono">ONLINE REGISTERED</span>
                          </motion.div>
                        </>
                      )}

                      {serviceName === "ভিসা চেক" && (
                        <>
                          <div className="relative">
                            <motion.div 
                              animate={{ scale: [1, 1.03, 1] }}
                              transition={{ repeat: Infinity, duration: 3 }}
                              className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-xl w-36 h-24 flex flex-col justify-between"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-[#C9A84C]">VISA STATUS</span>
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                              </div>
                              <div className="text-[11px] font-mono text-white font-black text-left">VISA: OK (ACTIVE)</div>
                            </motion.div>
                            <motion.div 
                              animate={{ y: [-10, 80, -10] }}
                              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                              className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] z-10"
                            />
                          </div>
                        </>
                      )}

                      {serviceName === "ভিসা রেজিস্ট্রেশন" && (
                        <>
                          <motion.div 
                            animate={{ scale: [0.9, 1.1, 0.9] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-xl flex flex-col items-center space-y-2"
                          >
                            <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-emerald-400 animate-pulse">
                              <span className="text-xl font-bold font-mono">🖨️</span>
                            </div>
                            <span className="text-[10px] text-slate-300 font-bold">ফিঙ্গারপ্রিন্ট ও বায়োমেট্রিক</span>
                            <span className="text-[8px] text-emerald-400 font-mono">BOOKING ASSISTANCE</span>
                          </motion.div>
                        </>
                      )}

                      {serviceName === "হজ্জ ও ওমরাহ" && (
                        <div className="relative">
                          {/* Kaaba Silhouette Shape */}
                          <motion.div 
                            animate={{ scale: [0.98, 1.02, 0.98] }}
                            transition={{ repeat: Infinity, duration: 5 }}
                            className="w-24 h-24 bg-slate-950 border-t-8 border-[#C9A84C] relative flex items-center justify-center rounded-lg shadow-[0_4px_30px_rgba(0,0,0,0.8)] border border-slate-800"
                          >
                            {/* Kaaba Door */}
                            <div className="absolute bottom-0 right-4 w-5 h-10 bg-gradient-to-t from-[#C9A84C] to-[#E2C876] rounded-t flex items-center justify-center border border-white/20">
                              <span className="text-[5px] text-slate-950 font-black">🕋</span>
                            </div>
                            <span className="text-[9px] font-bold text-white/50 tracking-widest mt-[-20px] font-mono">OMRAH 2026</span>
                          </motion.div>
                          <motion.div 
                            animate={{ scale: [0.8, 1.1, 0.8] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="absolute -top-4 -right-4 bg-emerald-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full"
                          >
                            সেরা অফার
                          </motion.div>
                        </div>
                      )}

                      {/* Default layout fallback for others */}
                      {!["এয়ার টিকিট চেক", "তারিখ পরিবর্তন", "নতুন টিকিট বুকিং", "পাসপোর্ট আবেদন", "NID আবেদন", "জন্ম নিবন্ধন", "ভিসা চেক", "ভিসা রেজিস্ট্রেশন", "হজ্জ ও ওমরাহ"].includes(serviceName) && (
                        <>
                          <motion.div 
                            animate={{ rotate: [0, 360] }}
                            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                            className="absolute inset-2 border border-dashed border-slate-800 rounded-full"
                          />
                          <motion.div 
                            animate={{ scale: [0.9, 1.05, 0.9] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center space-y-2 text-center"
                          >
                            {serviceName === "BMET আবেদন" && <Wallet className="w-10 h-10 text-sky-400" />}
                            {serviceName === "৩ দিনের ট্রেনিং" && <BookOpen className="w-10 h-10 text-purple-400" />}
                            {serviceName === "ডিপোজিট" && <TrendingUp className="w-10 h-10 text-rose-400" />}
                            {serviceName === "রিটেইলার ব্যালেন্স" && <Wallet className="w-10 h-10 text-violet-400" />}
                            {serviceName === "রিটেইলার ড্যাশবোর্ড" && <Sliders className="w-10 h-10 text-yellow-500" />}
                            
                            <span className="text-xs font-black text-white leading-tight">{serviceName}</span>
                            <span className="text-[8px] bg-slate-900 text-[#C9A84C] px-2 py-0.5 rounded border border-slate-800">SMART PROCESS</span>
                          </motion.div>
                        </>
                      )}

                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-extrabold text-white">
                        {serviceName} <span className={theme.accent}>সহজ সমাধান</span>
                      </h3>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        আমাদের সাথে সরাসরি যোগাযোগ করুন এবং কোনো ভোগান্তি ছাড়াই সম্পন্ন করুন আপনার কাজ।
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* AD OUTRO CALL-TO-ACTION SCENE (85s to 100s) */}
                {progress >= 85 && (
                  <motion.div 
                    key="outro"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4 z-10 w-full max-w-md bg-slate-900/90 border border-[#C9A84C]/20 p-6 rounded-2xl shadow-2xl relative"
                  >
                    <CornerOrnaments />
                    <div className="w-12 h-12 bg-[#C9A84C]/10 border border-[#C9A84C] rounded-full flex items-center justify-center mx-auto text-[#C9A84C] animate-bounce">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-[10px] bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#E2C876] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                        আজই যোগাযোগ করুন
                      </span>
                      <h4 className="text-lg font-black text-white">{customAgency}</h4>
                      <p className="text-xs text-slate-400">আপনার যেকোনো প্রশ্ন বা হেল্পের জন্য আজই সরাসরি কল বা হোয়াটসঅ্যাপ করুন</p>
                    </div>

                    {/* Contact callout block */}
                    <div className="bg-black/40 border border-slate-800 rounded-xl p-3 space-y-1 text-center font-semibold">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">হটলাইন / মোবাইল নম্বর</div>
                      <div className="text-base font-extrabold text-[#E2C876] font-mono tracking-wider">{customPhone}</div>
                      <div className="text-[9px] text-slate-400 font-medium">{customAddress}</div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* SYNCED BANGLA CAPTION OVERLAY OVER PLAYBACK */}
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/80 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2 text-center min-h-[48px] flex items-center justify-center">
              <span className="text-xs md:text-sm font-bold text-white leading-normal tracking-wide animate-fade-in">
                {currentSubtitle}
              </span>
            </div>

          </div>

          {/* PLAYER CONTROLS PANEL */}
          <div className="space-y-3 px-2 mt-2">
            
            {/* Timeline Progress Slider */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-slate-400">{Math.floor((progress / 100) * 15)}s</span>
              <div className="flex-1 relative group py-2 cursor-pointer">
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => {
                    playSoundEffect("click");
                    setProgress(parseInt(e.target.value));
                  }}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
                />
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-[#C9A84C] pointer-events-none rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400">15s</span>
            </div>

            {/* Core Control Buttons */}
            <div className="flex items-center justify-between">
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    playSoundEffect("click");
                    setIsPlaying(!isPlaying);
                  }}
                  className="w-9 h-9 bg-slate-850 hover:bg-slate-800 border border-slate-700/60 rounded-xl flex items-center justify-center text-white cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400 fill-emerald-400/10" />}
                </button>

                <button 
                  onClick={() => {
                    playSoundEffect("click");
                    setProgress(0);
                    setIsPlaying(true);
                  }}
                  className="w-9 h-9 bg-slate-850 hover:bg-slate-800 border border-slate-700/60 rounded-xl flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                  title="আবার প্রথম থেকে দেখুন"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Voice Synthesis toggle on player bar */}
                <button 
                  onClick={() => {
                    playSoundEffect("click");
                    setIsVoiceEnabled(!isVoiceEnabled);
                  }}
                  className={`w-9 h-9 border rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                    isVoiceEnabled 
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-300" 
                      : "bg-slate-850 border-slate-700/60 text-slate-500"
                  }`}
                  title={isVoiceEnabled ? "ভয়েস ওভার বন্ধ করুন" : "ভয়েস ওভার চালু করুন"}
                >
                  <Volume2 className={`w-4 h-4 ${isVoiceEnabled && isPlaying ? 'animate-bounce' : ''}`} />
                </button>
              </div>

              {/* Speed Controller Selector */}
              <div className="flex items-center gap-1">
                {[0.5, 1, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => {
                      playSoundEffect("click");
                      setPlaybackSpeed(speed);
                    }}
                    className={`px-2.5 py-1 text-[10px] font-mono rounded font-bold cursor-pointer transition-all border ${
                      playbackSpeed === speed 
                        ? "bg-[#C9A84C] border-[#C9A84C] text-slate-950" 
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: MARKETING CUSTOMIZER PANEL */}
        <div className="w-full lg:w-80 bg-slate-900 p-5 flex flex-col justify-between overflow-y-auto">
          
          <div className="space-y-4">
            
            {/* Header Tabs switcher */}
            <div className="flex bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
              <button 
                onClick={() => { playSoundEffect("click"); setActiveTab("player"); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "player" 
                    ? "bg-slate-850 text-white shadow-sm border border-slate-700/30" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Tv className="w-3.5 h-3.5 text-[#C9A84C]" /> প্লেয়ার কন্ট্রোল
              </button>
              <button 
                onClick={() => { playSoundEffect("click"); setActiveTab("customizer"); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "customizer" 
                    ? "bg-slate-850 text-white shadow-sm border border-slate-700/30" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> বিজ্ঞাপন এডিটর
              </button>
            </div>

            {activeTab === "player" ? (
              <div className="space-y-4 pt-1">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">চলতি সার্ভিস বিজ্ঞাপন</h4>
                  <p className="text-base font-extrabold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C9A84C]" /> {serviceName}
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2">
                  <h5 className="text-[10px] font-bold text-[#E2C876] uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" /> বিজ্ঞাপন প্রযুক্তি পরিচিতি
                  </h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    এটি একটি ইন্টারেক্টিভ ওয়ান-ক্লিক মোশন অ্যানিমেশন ভিডিও প্লেয়ার। আপনি চাইলে এখান থেকে টেক্সট ও মোবাইল নম্বর এডিট করে আপনার নিজের এজেন্সির ব্র্যান্ড নামে অফার বানিয়ে সোশ্যাল মিডিয়াতে শেয়ার করতে পারেন।
                  </p>
                </div>

                {/* Interactive Voice Narration Card */}
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Volume2 className={`w-4 h-4 ${isVoiceEnabled && isPlaying ? 'animate-bounce' : ''}`} />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-white">ভয়েস ওভার (কথা বলা)</h5>
                      <p className="text-[9px] text-slate-500">সেবাটি নিয়ে মুখে রিডিং পড়বে</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      playSoundEffect("click");
                      setIsVoiceEnabled(!isVoiceEnabled);
                    }}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                      isVoiceEnabled 
                        ? "bg-[#C9A84C] border-[#C9A84C] text-slate-950 shadow-sm" 
                        : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    {isVoiceEnabled ? "চালু আছে" : "বন্ধ"}
                  </button>
                </div>

                {/* Subtitle / Caption List displayer */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">সিঙ্ক করা সাবটাইটেল সমূহ</h5>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {subtitles.map((sub, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          playSoundEffect("click");
                          setProgress(sub.time);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex justify-between items-center ${
                          progress >= sub.time && (idx === subtitles.length - 1 || progress < subtitles[idx + 1].time)
                            ? "bg-[#C9A84C]/10 border-[#C9A84C]/30 text-[#E2C876]" 
                            : "bg-slate-950 border-slate-800/80 text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        <span className="truncate flex-1">{sub.text}</span>
                        <span className="font-mono text-[9px] opacity-75">{Math.floor((sub.time / 100) * 15)}s</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Audio status */}
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
                      <Sparkles className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-white">সাউন্ড জেনারেটর</div>
                      <div className="text-[8px] text-slate-500 font-medium font-mono">Web Audio Synthesizer: 22kHz</div>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded-full uppercase tracking-widest animate-pulse">ACTIVE</span>
                </div>

              </div>
            ) : (
              <div className="space-y-4 pt-1">
                
                {/* Visual Customization Form */}
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">এজেন্সির নাম (Agency Name)</label>
                    <input 
                      type="text" 
                      value={customAgency}
                      onChange={(e) => setCustomAgency(e.target.value)}
                      placeholder="যেমনঃ সততা ট্রাভেলস"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">মোবাইল / হোয়াটসঅ্যাপ নম্বর</label>
                    <input 
                      type="text" 
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      placeholder="যেমনঃ ০১৭০০-০০০০০০"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">ঠিকানা / স্লোগান</label>
                    <input 
                      type="text" 
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      placeholder="যেমনঃ বনানী, ঢাকা, বাংলাদেশ"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>

                  {/* Theme Presets */}
                  <div>
                    <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1.5">ভিডিও ডিজাইন থিম</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: "royal", label: "👑 Royal Gold" },
                        { id: "cyber", label: "🛸 Cyber Blue" },
                        { id: "neon", label: "🌸 Neon Pink" },
                        { id: "emerald", label: "🌴 Emerald Green" }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            playSoundEffect("click");
                            setVideoTheme(t.id as any);
                          }}
                          className={`py-1.5 text-[10px] font-bold rounded-lg cursor-pointer border transition-all ${
                            videoTheme === t.id 
                              ? "bg-slate-950 border-[#C9A84C] text-white" 
                              : "bg-slate-950/40 border-slate-850 text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl p-3 text-[10px] text-[#E2C876] leading-relaxed font-bold">
                  ⚠️ লক্ষ্য করুন: এডিট করা ব্রান্ডিংটি বিজ্ঞপ্তির শেষ অংশে (CTA Outro) সরাসরি যুক্ত হবে। স্ক্রাব করে বা সম্পূর্ণ ভিডিও দেখে আউটপুট চেক করতে পারেন।
                </div>

              </div>
            )}

          </div>

          {/* Bottom Footer Actions */}
          <div className="space-y-2 pt-4 border-t border-slate-800/80">
            <button 
              onClick={() => {
                playSoundEffect("chime");
                alert("আপনার কাস্টমাইজড ডিজিটাল বিজ্ঞাপনটির ফ্রেম ডাউনলোড করা হয়েছে! ফেসবুক, হোয়াটসঅ্যাপ ও গ্রুপে শেয়ার করে নতুন ক্লায়েন্ট পান।");
              }}
              className={`w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${theme.button}`}
            >
              <Download className="w-4 h-4" /> কাস্টম বিজ্ঞাপন ডাউনলোড
            </button>
            <button 
              onClick={handleClose}
              className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all text-center"
            >
              প্লেয়ার বন্ধ করুন
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

// Subcomponent: Decorative Islamic / Arabic Corners
function CornerOrnaments() {
  return (
    <>
      <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-[#C9A84C]/50 rounded-tl" />
      <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-[#C9A84C]/50 rounded-tr" />
      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-[#C9A84C]/50 rounded-bl" />
      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-[#C9A84C]/50 rounded-br" />
    </>
  );
}
