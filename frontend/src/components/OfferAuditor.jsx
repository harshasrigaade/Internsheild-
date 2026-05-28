import React, { useState } from "react";
import { Upload, FileText, CheckCircle2, ShieldAlert, AlertTriangle, FileCode, Printer, RefreshCw } from "lucide-react";

export default function OfferAuditor() {
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setTextInput(""); // Clear text if file is uploaded
    }
  };

  const handleAudit = async (e) => {
    e.preventDefault();
    if (!file && !textInput.trim()) return;

    setLoading(true);
    setReport(null);

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else {
      formData.append("text", textInput);
    }

    try {
      const apiHost = window.location.port === "5173"
        ? (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : `http://${window.location.hostname}:5000`)
        : window.location.origin;
      const response = await fetch(`${apiHost}/api/analyze-offer`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setReport(data);
      } else {
        alert(data.error || "Failed to audit document.");
      }
    } catch (err) {
      alert("Failed to reach the audit server. Verify the Node backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const resetAudit = () => {
    setFile(null);
    setTextInput("");
    setReport(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2 no-print">
        <h2 className="text-3xl font-extrabold text-white">Offer Letter Safety Auditor</h2>
        <p className="text-gray-400 text-sm">
          Upload PDF agreements or paste written offer letters. We check for financial traps, phishing details, and formatting abnormalities.
        </p>
      </div>

      {!report && (
        <div className="glass-panel rounded-xl p-6 border-[#1f2235] max-w-3xl mx-auto no-print">
          <form onSubmit={handleAudit} className="space-y-6">
            
            {/* File Drag zone */}
            <div className="border-2 border-dashed border-[#1f2235] hover:border-blue-500/40 rounded-lg p-8 text-center transition-colors cursor-pointer relative bg-[#0a0b10]/40">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center space-y-3">
                <Upload className="w-10 h-10 text-gray-500" />
                <div>
                  <span className="text-sm font-semibold text-gray-300">
                    {file ? file.name : "Drag & drop offer PDF / TXT here"}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Supports PDF or plain text contracts (max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Pasting divider */}
            {!file && (
              <>
                <div className="flex items-center justify-between text-xs text-gray-600 font-semibold uppercase tracking-wider">
                  <div className="h-px bg-[#1f2235] flex-1"></div>
                  <span className="px-3">Or Paste Contract Text</span>
                  <div className="h-px bg-[#1f2235] flex-1"></div>
                </div>

                {/* Paste Area */}
                <div>
                  <textarea
                    rows="8"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste the full text of your offer letter, salary clauses, or email agreement details here..."
                    className="w-full bg-[#0a0b10] border border-[#1f2235] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg p-3 text-xs sm:text-sm text-gray-200 placeholder-gray-600 focus:outline-none"
                  ></textarea>
                </div>
              </>
            )}

            {/* Audit Submit Button */}
            <div className="flex justify-end gap-2">
              {(file || textInput) && (
                <button
                  type="button"
                  onClick={resetAudit}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-5 py-2.5 rounded-lg text-sm transition-colors border border-gray-700"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                disabled={loading || (!file && !textInput.trim())}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2 shadow-glow-primary"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Auditing Agreement
                  </>
                ) : (
                  "Run Audit"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Progress Auditor */}
      {loading && (
        <div className="glass-panel rounded-xl p-8 border-[#1f2235] max-w-xl mx-auto text-center space-y-4 no-print">
          <FileCode className="w-12 h-12 text-blue-500 animate-bounce mx-auto" />
          <div>
            <h3 className="font-bold text-white text-md">Scanning Document Signatures</h3>
            <p className="text-gray-400 text-xs mt-1">Analyzing legal clauses, security demands, and sender domains...</p>
          </div>
          <div className="w-full bg-[#0a0b10] h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-2/3 animate-pulse rounded-full"></div>
          </div>
        </div>
      )}

      {/* Audit Report Result */}
      {report && (
        <div className="space-y-6">
          {/* Certificate Style Visual Seal Card */}
          <div className={`relative border-4 border-double rounded-2xl bg-[#121420]/80 p-8 shadow-2xl overflow-hidden print-card ${
            report.safetyScore >= 8 ? "border-emerald-500/40" :
            report.safetyScore >= 5 ? "border-amber-500/40" :
            "border-rose-500/40"
          }`}>
            {/* Watermark in background */}
            <div className="absolute right-[-40px] bottom-[-40px] opacity-5 pointer-events-none text-9xl">🛡️</div>

            {/* Audit Status seal badge on right */}
            <div className="absolute top-6 right-6 flex flex-col items-center">
              <div className={`w-20 h-20 rounded-full border-4 border-dashed flex flex-col items-center justify-center font-black ${
                report.safetyScore >= 8 ? "border-emerald-500 text-emerald-400 fill-emerald-500/10" :
                report.safetyScore >= 5 ? "border-amber-500 text-amber-400 fill-amber-500/10" :
                "border-rose-500 text-rose-400 fill-rose-500/10"
              }`}>
                <span className="text-xl font-mono">{report.safetyScore}</span>
                <span className="text-[7px] uppercase tracking-wider font-bold">Safety rating</span>
              </div>
              <span className={`text-[10px] font-black uppercase mt-1.5 ${
                report.safetyScore >= 8 ? "text-emerald-400" :
                report.safetyScore >= 5 ? "text-amber-400" :
                "text-rose-400"
              }`}>
                {report.auditLevel}
              </span>
            </div>

            {/* Title / Header of the seal */}
            <div className="space-y-1">
              <span className="text-blue-500 text-[10px] font-bold tracking-widest uppercase font-mono">
                InternShield Audit Seal
              </span>
              <h3 className="text-2xl font-extrabold text-white">Employment Veracity Certificate</h3>
              <p className="text-gray-500 text-xs">
                Audited file: <strong className="text-gray-400 font-mono">{report.sourceName}</strong>
              </p>
            </div>

            {/* Main Verdict info */}
            <div className="mt-8 max-w-xl space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Veracity Assessment</span>
                <p className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                  {report.safetyScore >= 8 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : report.safetyScore >= 5 ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  )}
                  {report.verdict}
                </p>
              </div>

              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed border-l-2 border-blue-500/30 pl-3">
                {report.scamWarning}
              </p>
            </div>

            {/* Flags detailed listing */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#1f2235]">
              {/* Suspicious signals */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Suspicious Clauses ({report.redFlags.length})
                </h4>
                <ul className="space-y-2">
                  {report.redFlags.map((flag, idx) => (
                    <li key={idx} className="text-xs text-gray-300 leading-relaxed flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">&bull;</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Standard clauses */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Standard / Positive Clauses ({report.greenFlags.length})
                </h4>
                <ul className="space-y-2">
                  {report.greenFlags.map((flag, idx) => (
                    <li key={idx} className="text-xs text-gray-300 leading-relaxed flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">&bull;</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer action */}
            <div className="mt-8 pt-4 border-t border-[#1f2235] flex justify-between items-center no-print">
              <button
                onClick={resetAudit}
                className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-semibold"
              >
                &larr; Scan Another Document
              </button>
              <button
                onClick={() => window.print()}
                className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 font-bold px-4 py-2 rounded-lg text-xs transition-colors border border-blue-500/20 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
