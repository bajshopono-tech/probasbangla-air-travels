import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Home from "./components/Home";
import Flights from "./components/Flights";
import Visa from "./components/Visa";
import HajjUmrah from "./components/HajjUmrah";
import BMET from "./components/BMET";
import StatusCheck from "./components/StatusCheck";
import Policy from "./components/Policy";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/visa" element={<Visa />} />
          <Route path="/hajj-umrah" element={<HajjUmrah />} />
          <Route path="/bmet" element={<BMET />} />
          <Route path="/status" element={<StatusCheck />} />
          <Route path="/policy/:type" element={<Policy />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

