import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, ShieldAlert, AlertCircle, Sparkles, CornerDownLeft } from "lucide-react";

export default function Chatbot({ apiKey }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "🛡️ **Welcome to the InternShield Safety Advisor!**\n\nI can help you review recruitment behaviors, verify offer contract requirements, and spot internship certificate traps.\n\nAsk me anything, or try clicking one of the common concerns below!",
      suggestions: [
        "Is paying for training normal?",
        "Recruiter uses a Gmail address",
        "I was hired without an interview"
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chats
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Add user message
    const userMsg = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      // Map history format for API
      const historyPayload = messages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        text: m.text
      }));

      const apiHost = window.location.port === "5173"
        ? (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : `http://${window.location.hostname}:5000`)
        : window.location.origin;
      const response = await fetch(`${apiHost}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          apiKey: apiKey
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, {
          role: "bot",
          text: data.text,
          suggestions: data.suggestions || []
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: "bot",
          text: "⚠️ **System Error:** I was unable to compile a secure response. Please check your connection."
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "bot",
        text: "🔌 **Network Failure:** Failed to reach the local threat advisor server. Ensure the backend server is running on port 5000."
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format bot responses with basic bolding/bullet marks
  const formatMessageText = (text) => {
    return text.split("\n").map((line, idx) => {
      let content = line;
      // Handle Bold markdown: **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        // Add preceding text
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        // Add bolded text
        parts.push(<strong key={match.index} className="font-bold text-white">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      const formattedLine = parts.length > 0 ? parts : content;

      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-gray-300 py-0.5 text-xs sm:text-sm">
            {formattedLine.length > 0 ? parts : line.substring(2)}
          </li>
        );
      }

      if (line.trim().startsWith("1. ") || line.trim().startsWith("2. ") || line.trim().startsWith("3. ")) {
        return (
          <p key={idx} className="text-gray-300 text-xs sm:text-sm leading-relaxed pl-2 py-0.5">
            {formattedLine}
          </p>
        );
      }

      return (
        <p key={idx} className={`${line.trim() === "" ? "h-2" : "text-xs sm:text-sm leading-relaxed py-0.5"}`}>
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-8rem)] flex flex-col">
      {/* Bot Chat Card */}
      <div className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden relative border-[#1f2235]">
        
        {/* Header banner */}
        <div className="border-b border-[#1f2235] bg-[#121420]/80 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Threat Advisor Bot</h3>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] text-gray-400 font-semibold">Active Shields</span>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-2.5 py-1 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Scam Alerts Active</span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-xl p-4 border transition-all ${
                m.role === "user"
                  ? "bg-blue-600/10 border-blue-500/20 text-gray-200 rounded-tr-none shadow-[0_0_15px_rgba(59,130,246,0.05)]"
                  : "bg-[#0a0b10]/60 border-[#1f2235] text-gray-300 rounded-tl-none"
              }`}>
                <div className="space-y-1 text-left">
                  {m.role === "bot" ? formatMessageText(m.text) : <p className="text-xs sm:text-sm">{m.text}</p>}
                </div>

                {/* Suggestions triggers */}
                {m.role === "bot" && m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#1f2235] flex flex-wrap gap-2">
                    {m.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSend(sug)}
                        className="bg-[#1f2235]/40 hover:bg-[#1f2235]/90 border border-[#1f2235] text-blue-400 hover:text-blue-300 text-[11px] font-semibold px-2.5 py-1 rounded transition-colors text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Loading bubble */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#0a0b10]/60 border border-[#1f2235] rounded-xl rounded-tl-none p-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#1f2235] bg-[#121420]/80">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2 relative"
          >
            <input
              type="text"
              placeholder="Ask safety bot about an offer, interview channel, or recruiter name..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#0a0b10] border border-[#1f2235] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg pl-3 pr-20 py-3 text-xs sm:text-sm text-gray-200 placeholder-gray-600 focus:outline-none"
            />
            <div className="absolute right-2 top-2 flex items-center gap-1 bg-[#0a0b10]">
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md transition-colors disabled:opacity-50"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>
          </form>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-500 justify-center">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Do not share credit cards or high-privacy details with any chatbot.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
