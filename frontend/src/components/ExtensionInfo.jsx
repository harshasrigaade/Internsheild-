import React from "react";
import { Globe, Download, CheckCircle, HelpCircle, Shield, RefreshCw } from "lucide-react";

export default function ExtensionInfo() {
  const steps = [
    {
      num: "1",
      title: "Locate Extension Folder",
      desc: "Inside your cloned InternShield project directory, locate the folder named '/extension'. This contains the popup.html, popup.js, popup.css and manifest.json."
    },
    {
      num: "2",
      title: "Open Extension Dashboard",
      desc: "Open Google Chrome and navigate to chrome://extensions/ in the address bar. Press Enter to load the dashboard."
    },
    {
      num: "3",
      title: "Toggle Developer Mode",
      desc: "In the top-right corner of the Extensions dashboard, toggle the switch labeled 'Developer mode' to ON."
    },
    {
      num: "4",
      title: "Load Unpacked Folder",
      desc: "In the top-left corner, click the 'Load unpacked' button. Select the '/extension' folder from your file browser. Done!"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold text-white">Chrome Extension Integrations</h2>
        <p className="text-gray-400 text-sm">
          Audit internships directly on LinkedIn, Glassdoor, and job portals without opening a new tab. Set up our developer extension in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left instructions */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel rounded-xl p-5 border-[#1f2235] space-y-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Installation Steps (Google Chrome / Edge)
            </h3>
            
            <div className="space-y-4">
              {steps.map((s, idx) => (
                <div key={idx} className="flex gap-4 items-start text-left">
                  <span className="w-6 h-6 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {s.num}
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-sm">{s.title}</h4>
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-600/5 border border-blue-500/15 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Ready to Inspect</h4>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed text-left">
                Once loaded, click the extension icon on any active job tab. It queries the local backend running on port 5000 and prints the safety rating inside the pop-up.
              </p>
            </div>
          </div>
        </div>

        {/* Right mock popup preview */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Popup Preview Mock</h4>
          
          {/* Extension Mock UI */}
          <div className="bg-[#0a0b10] border border-[#1f2235] rounded-xl shadow-2xl overflow-hidden w-full max-w-[320px] mx-auto text-left">
            
            {/* Chrome mock titlebar */}
            <div className="bg-gray-900 px-3 py-1.5 flex items-center gap-1 border-b border-[#1f2235] text-[10px] text-gray-500">
              <Shield className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
              <span className="font-bold text-gray-400">InternShield Tooltip</span>
            </div>

            {/* Popup content */}
            <div className="bg-[#121420] p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Current Tab Scan</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>

              {/* URL */}
              <div className="bg-[#0a0b10] p-2.5 rounded border border-[#1f2235] text-[10px] text-gray-400 font-mono truncate">
                https://jobs-hiring.xyz/data-entry
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-4 border-rose-500/30 border-t-rose-500 flex items-center justify-center font-black font-mono text-rose-400 text-sm">
                  3.2
                </div>
                <div>
                  <h5 className="font-black text-white text-xs uppercase tracking-tight">High Risk Scam</h5>
                  <p className="text-[10px] text-gray-500">Uses suspicious budget TLD (.xyz)</p>
                </div>
              </div>

              {/* Advice */}
              <div className="bg-rose-500/5 border border-rose-500/10 p-2.5 rounded text-[10px] text-rose-400 leading-relaxed font-semibold">
                ⚠️ Avoid applying. Demands money for verification kit.
              </div>

              {/* Redirect button */}
              <button className="w-full text-center py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs transition-colors shadow-glow-primary">
                View Full Audit Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
