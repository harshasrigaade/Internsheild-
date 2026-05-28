import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Chatbot from "./components/Chatbot";
import OfferAuditor from "./components/OfferAuditor";
import ImageScanner from "./components/ImageScanner";
import CommunityReports from "./components/CommunityReports";
import LearnHub from "./components/LearnHub";
import ExtensionInfo from "./components/ExtensionInfo";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(true);
  const [apiKey, setApiKey] = useState("");

  // Load API Key and Theme preference on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("internshield_gemini_key");
    if (savedKey) setApiKey(savedKey);

    const savedTheme = localStorage.getItem("internshield_theme");
    if (savedTheme === "light") {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const nextState = !darkMode;
    setDarkMode(nextState);
    if (nextState) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("internshield_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("internshield_theme", "light");
    }
  };

  // Render active workspace tabs
  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard apiKey={apiKey} />;
      case "auditor":
        return <OfferAuditor />;
      case "scanner":
        return <ImageScanner />;
      case "chatbot":
        return <Chatbot apiKey={apiKey} />;
      case "community":
        return <CommunityReports />;
      case "learn":
        return <LearnHub />;
      case "extension":
        return <ExtensionInfo />;
      default:
        return <Dashboard apiKey={apiKey} />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0a0b10] text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      {/* Background Grid Accent for dark cyber mode */}
      {darkMode && <div className="fixed inset-0 pointer-events-none cyber-grid z-0"></div>}

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          apiKey={apiKey}
          setApiKey={setApiKey}
        />

        {/* Content Panel */}
        <main className="flex-1">
          {renderTab()}
        </main>

        {/* Cyber Footer */}
        <footer className="border-t border-[#1f2235] bg-[#121420]/60 py-6 text-center text-xs text-gray-500 font-medium no-print mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4.5 h-4.5 text-blue-500 fill-blue-500/10" />
              <span>&copy; {new Date().getFullYear()} InternShield. All rights reserved.</span>
            </div>
            
            {/* Quick Metrics */}
            <div className="flex items-center gap-6 font-mono text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Scams Prevented: 24,982</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span>Active Threats: 148</span>
              </div>
            </div>

            <div className="flex gap-4">
              <a href="#privacy" className="hover:underline hover:text-gray-400">Privacy Policy</a>
              <a href="#terms" className="hover:underline hover:text-gray-400">Security Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
