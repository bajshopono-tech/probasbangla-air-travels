import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client
  let ai: GoogleGenAI | null = null;
  const getAiClient = () => {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      ai = new GoogleGenAI({
        apiKey: apiKey || "",
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return ai;
  };

  // API Route for Gemini AI Chatbot
  app.post("/api/gemini/generate", async (req: any, res: any) => {
    try {
      const { prompt, history } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
        // Return a mock/fallback smart response if API key is not present so the app doesn't crash
        return res.json({
          text: `আসসালামু আলাইকুম! প্রবাসবাংলা এয়ার ট্রাভেলস এআই সহকারীতে আপনাকে স্বাগতম। (ডেমো মোড) আপনার প্রশ্নের উত্তর: আমি আপনাকে এয়ার টিকিট বুকিং, সৌদি আরব ভিসা প্রসেসিং, ওমরাহ প্যাকেজ, BMET স্মার্টকার্ড আবেদন, পাসপোর্ট সংশোধন বা NID আপডেট সহ যেকোনো প্রবাসী সেবা সংক্রান্ত তথ্যে সাহায্য করতে পারি। দয়া করে আমাদের হটলাইনে কল করতে পারেন: ০১৩১৬৫৬৭৮২১।`
        });
      }

      const client = getAiClient();
      const systemInstruction = `
        You are "প্রবাসবাংলা এআই সহকারী" (Probasbangla AI Assistant), a highly welcoming, supportive, and knowledgeable travel concierge chatbot for "Probasbangla Air Travels" (প্রবাসবাংলা এয়ার ট্রাভেলস).
        Your purpose is to assist expatriates, B2B retailers, and travelers with their questions about the agency's 17 services:
        1. এয়ার টিকিট চেক (Checking flight PNR, ticket status)
        2. তারিখ পরিবর্তন (Flight date changes)
        3. নতুন টিকিট বুকিং (New flight bookings)
        4. পাসপোর্ট আবেদন (Passport applications & corrections)
        5. NID আবেদন (National Identity Card application and corrections)
        6. জন্ম নিবন্ধন (Birth registration issues)
        7. ভিসা চেক (Visa validation checks)
        8. ভিসা রেজিস্ট্রেশন (Visa registrations)
        9. হজ্জ ও ওমরাহ (Hajj & Umrah package options, starting at 1,45,000 BDT)
        10. ভিজিট ভিসা (Visit visa processing for Middle East)
        11. ফ্যামিলি ভিসা (Family visit visas)
        12. জিয়ারা ভিসা (Ziyarah/Tourism visa)
        13. BMET আবেদন (Bureau of Manpower, Employment and Training card)
        14. ৩ দিনের ট্রেনিং (PDO Training for expats)
        15. ডিপোজিট (Retailer wallet deposit procedure)
        16. রিটেইলার ব্যালেন্স (Checking/Updating retailer balance)
        17. রিটেইলার ড্যাশবোর্ড (B2B agent control panel)

        Tone: Warm, polite, hospitable, using native Bengali. Speak like a professional Bengali agent who deeply respects Remittance Warriors (প্রবাসী রেমিটেন্স যোদ্ধা). Always provide concise, reassuring, and highly accurate answers.
        If users ask about hotlines or WhatsApp:
        Hotline/WhatsApp: ০১৩১৬৫৬৭৮২১ (or dynamically refer them to the support button).
        Keep answers helpful and encourage them to click on the specific service cards or contact buttons on the screen!
      `;

      // Structure contents with history for chat experience if provided
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        }
      }
      // Add the final user prompt
      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // API route for circulars (persisted in server memory)
  let visaCirculars = [
    {
      id: "circ-1",
      country: "Saudi Arabia",
      flag: "🇸🇦",
      title: "ফ্রি ভিসা নিয়োগ (সৌদি আরব)",
      role: "কনস্ট্রাকশন লেবার",
      salary: "৳ ৪২,০০০ - ৫০,০০০ + ওভারটাইম",
      vaccancies: "২৫ জন",
      docs: "মূল পাসপোর্ট, মেডিকেল ফিট সার্টিফিকেট, ছবি",
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
      docs: "দুবাই ড্রাইভিং লাইসেন্স কপি, পাসপোর্ট, পুলিশ ক্লিয়ারেন্স",
      date: "2026-07-03",
    }
  ];

  app.get("/api/circulars", (req, res) => {
    res.json(visaCirculars);
  });

  app.post("/api/circulars", (req, res) => {
    const { country, flag, title, role, salary, vaccancies, docs } = req.body;
    if (!country || !title) {
      return res.status(400).json({ error: "Country and Title are required" });
    }
    const newCirc = {
      id: "circ-" + Math.floor(Math.random() * 100000),
      country,
      flag: flag || "✈️",
      title,
      role: role || "সাধারণ কর্মী",
      salary: salary || "আলোচনা সাপেক্ষে",
      vaccancies: vaccancies || "অনির্দিষ্ট",
      docs: docs || "সাধারণ ডকুমেন্টস",
      date: new Date().toISOString().split('T')[0]
    };
    visaCirculars.unshift(newCirc);
    res.status(201).json(newCirc);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
