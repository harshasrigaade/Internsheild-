import React, { useState } from "react";
import { Shield, Settings, Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, darkMode, toggleDarkMode, apiKey, setApiKey }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [keyInput, setKeyInput] = useState(apiKey || "");

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "auditor", label: "Offer Auditor" },
    { id: "scanner", label: "Poster Scanner" },
    { id: "chatbot", label: "Safety Bot" },
    { id: "community", label: "Community Board" },
    { id: "learn", label: "Learn Hub" },
    { id: "extension", label: "Extension" }
  ];

  const handleSaveKey = () => {
    localStorage.setItem("internshield_gemini_key", keyInput);
    setApiKey(keyInput);
    setShowSettings(false);
  };

  const handleClearKey = () => {
    localStorage.removeItem("internshield_gemini_key");
    setApiKey("");
    setKeyInput("");
    setShowSettings(false);
  };

  return (
    <nav className="border-b border-[#1f2235] bg-[#121420]/90 sticky top-0 z-40 backdrop-blur-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <Shield className="w-8 h-8 text-blue-500 fill-blue-500/10 animate-pulse-glow" />
            <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              INTERNSHIELD
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Toolbar */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* API Settings */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 transition-colors flex items-center gap-1.5"
              title="API Key Configuration"
            >
              <Settings className="w-5 h-5" />
              {apiKey && <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping absolute -mt-3 ml-3"></span>}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-md text-gray-400"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-1.5 rounded-md text-gray-400"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-[#1f2235] bg-[#121420] px-2 pt-2 pb-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 rounded-md text-base font-semibold ${
                activeTab === item.id
                  ? "bg-blue-500/10 text-blue-400 border-l-4 border-blue-500"
                  : "text-gray-400 hover:bg-gray-800/40 hover:text-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121420] border border-[#1f2235] rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-6 h-6 text-blue-400" />
              <h3 className="font-bold text-lg text-white">AI Configuration</h3>
            </div>

            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              InternShield analyzes listings using a rule-based heuristics engine out of the box. Paste your 
              <strong> Google Gemini API Key</strong> to activate live deep-learning scanner details and conversational AI chat.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Paste AI key here (e.g. AIzaSy...)"
                  className="w-full bg-[#0a0b10] border border-[#1f2235] rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {apiKey ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveKey}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-sm transition-colors"
                  >
                    Update Key
                  </button>
                  <button
                    onClick={handleClearKey}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium px-4 rounded-lg text-sm transition-colors border border-red-500/20"
                  >
                    Clear Key
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSaveKey}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-sm transition-colors"
                >
                  Save API Key
                </button>
              )}

              <div className="text-center">
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-400 hover:underline"
                >
                  Get a free Gemini API Key from Google AI Studio &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
