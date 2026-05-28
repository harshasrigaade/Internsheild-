import React, { useState, useEffect } from "react";
import { Users, AlertOctagon, ThumbsUp, Search, PlusCircle, ArrowRight, ShieldAlert, X } from "lucide-react";

export default function CommunityReports() {
  const apiHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : `http://${window.location.hostname}:5000`;
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // New report form states
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [url, setUrl] = useState("");
  const [scamType, setScamType] = useState("Typing / Data Entry Scam");
  const [details, setDetails] = useState("");

  const fetchReports = async () => {
    try {
      const response = await fetch(`${apiHost}/api/reports`);
      const data = await response.json();
      if (response.ok) {
        setReports(data);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpvote = async (id) => {
    try {
      const response = await fetch(`${apiHost}/api/reports/${id}/upvote`, {
        method: "POST"
      });
      const data = await response.json();
      if (response.ok) {
        // Update state locally
        setReports(prev => prev.map(r => r.id === id ? { ...r, upvotes: data.upvotes } : r));
      }
    } catch (err) {
      console.error("Failed to upvote report:", err);
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!companyName || !details) return;

    setLoading(true);
    try {
      const response = await fetch(`${apiHost}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          companyName,
          role,
          url,
          scamType,
          details
        })
      });

      const data = await response.json();
      if (response.ok) {
        setReports(prev => [data, ...prev]);
        setShowForm(false);
        // Reset fields
        setCompanyName("");
        setRole("");
        setUrl("");
        setDetails("");
        alert("Thank you! Your anonymous report has been published to protect others.");
      } else {
        alert(data.error || "Failed to submit report.");
      }
    } catch (err) {
      alert("Failed to submit report. Verify connection to backend.");
    } finally {
      setLoading(false);
    }
  };

  // Filter reports
  const filteredReports = reports.filter(r => 
    r.companyName.toLowerCase().includes(search.toLowerCase()) ||
    r.details.toLowerCase().includes(search.toLowerCase()) ||
    r.scamType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1f2235] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider">Community Threat Board</h2>
          </div>
          <p className="text-gray-400 text-sm">
            Read alerts filed anonymously by other job seekers. Reported links are processed into our security engine.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-colors flex items-center gap-2 shadow-glow-primary self-stretch sm:self-auto justify-center"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          Report a Scam
        </button>
      </div>

      {/* Grid containing reports lists and search bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search reports by company name or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121420]/80 border border-[#1f2235] rounded-lg pl-10 pr-4 py-2.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Reports Feed */}
        {filteredReports.length === 0 ? (
          <div className="glass-panel rounded-xl p-12 text-center text-gray-500 border-[#1f2235]">
            <AlertOctagon className="w-10 h-10 mx-auto text-gray-600 mb-3" />
            <h4 className="font-bold text-gray-400 text-sm">No Scam Reports Found</h4>
            <p className="text-xs text-gray-500 mt-1">Try searching another company name or file a new report if you have been targeted.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((report) => (
              <div 
                key={report.id} 
                className="glass-panel rounded-xl p-5 border-[#1f2235] hover:border-red-500/20 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-base leading-snug">{report.companyName}</h4>
                      <span className="text-xs text-gray-400 font-semibold">{report.role}</span>
                    </div>
                    <span className="text-[9px] font-black uppercase bg-red-500/10 border border-red-500/20 text-rose-400 px-2 py-0.5 rounded-full">
                      {report.scamType}
                    </span>
                  </div>

                  {report.url && (
                    <div className="text-xs text-blue-400 truncate hover:underline font-mono" title={report.url}>
                      Link: {report.url}
                    </div>
                  )}

                  <p className="text-xs text-gray-400 leading-relaxed bg-[#0a0b10]/40 p-3 rounded-lg border border-[#1f2235]/40 text-left">
                    {report.details}
                  </p>
                </div>

                {/* Footer details (Upvote, reported date) */}
                <div className="flex items-center justify-between border-t border-[#1f2235]/60 pt-3 mt-4 text-[10px] text-gray-500">
                  <span>Reported: {new Date(report.reportedAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => handleUpvote(report.id)}
                    className="flex items-center gap-1.5 bg-[#1f2235]/40 hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 border border-[#1f2235] hover:border-blue-500/20 px-3 py-1.5 rounded-md transition-all font-bold"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Upvote ({report.upvotes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report submission modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121420] border border-[#1f2235] rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
              <h3 className="font-bold text-lg text-white">Report Internship / Job Scam</h3>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Zenith Coding Inc"
                    className="w-full bg-[#0a0b10] border border-[#1f2235] rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Remote Content Creator"
                    className="w-full bg-[#0a0b10] border border-[#1f2235] rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                  Job URL / Recruiter Domain Link
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g. https://careers-zenith.online/form"
                  className="w-full bg-[#0a0b10] border border-[#1f2235] rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                  Scam Category
                </label>
                <select
                  value={scamType}
                  onChange={(e) => setScamType(e.target.value)}
                  className="w-full bg-[#0a0b10] border border-[#1f2235] rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Typing / Data Entry Scam">Typing / Data Entry Scam</option>
                  <option value="Advance-Fee / Training Cost">Advance-Fee / Training Cost</option>
                  <option value="Certificate Trap / Unpaid Work">Certificate Trap / Unpaid Work</option>
                  <option value="Phishing Google Form">Phishing Google Form</option>
                  <option value="WhatsApp / Telegram Impersonation">WhatsApp / Telegram Impersonation</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                  Scam Details (How it happened) *
                </label>
                <textarea
                  rows="4"
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide warning details. What tasks did they assign? How did they ask for payment? Which chat apps did they use? (Do NOT include your own private credit card or personal identity information)"
                  className="w-full bg-[#0a0b10] border border-[#1f2235] rounded-lg p-3 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-xs border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2 rounded-lg text-xs transition-colors shadow-glow-danger"
                >
                  Submit Incident Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
