import React, { useState } from "react";
import { Upload, FileImage, ShieldAlert, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";

export default function ImageScanner() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const apiHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : `http://${window.location.hostname}:5000`;
      const response = await fetch(`${apiHost}/api/analyze-screenshot`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        alert(data.error || "Failed to scan image.");
      }
    } catch (err) {
      alert("Failed to connect to the OCR server. Verify the Node server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const clearScanner = () => {
    setImage(null);
    setImagePreview(null);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold text-white">Poster Screenshot Scanner</h2>
        <p className="text-gray-400 text-sm">
          Have an Instagram, WhatsApp, or College group job flyer? Upload it here. Our OCR scans the flyer for scam marketing traps and free contact accounts.
        </p>
      </div>

      {!result && (
        <div className="glass-panel rounded-xl p-6 border-[#1f2235] max-w-2xl mx-auto">
          <form onSubmit={handleScan} className="space-y-6">
            
            {/* Drag Zone */}
            <div className="border-2 border-dashed border-[#1f2235] hover:border-blue-500/40 rounded-lg p-8 text-center transition-colors cursor-pointer relative bg-[#0a0b10]/40">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {imagePreview ? (
                <div className="flex flex-col items-center space-y-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 rounded object-contain border border-[#1f2235]"
                  />
                  <span className="text-xs text-gray-400 font-semibold">{image.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <FileImage className="w-10 h-10 text-gray-500" />
                  <div>
                    <span className="text-sm font-semibold text-gray-300">Upload screenshot / flyer image</span>
                    <p className="text-xs text-gray-500 mt-1">Supports PNG, JPG, or JPEG (max 4MB)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {image && (
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={clearScanner}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-5 py-2 transition-colors rounded-lg text-sm border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 shadow-glow-primary"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Scanning Text (OCR)
                    </>
                  ) : (
                    "Extract & Audit"
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Loading Radar */}
      {loading && (
        <div className="glass-panel rounded-xl p-8 border-[#1f2235] max-w-md mx-auto text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
          <div>
            <h3 className="font-bold text-white text-md">Reading Image Text</h3>
            <p className="text-gray-400 text-xs mt-1">Applying OCR templates to parse hiring keywords...</p>
          </div>
        </div>
      )}

      {/* OCR Results */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left image display */}
          <div className="md:col-span-2 glass-panel rounded-xl p-4 border-[#1f2235] flex flex-col items-center justify-center space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 self-start">Source Image</h4>
            <img
              src={imagePreview}
              alt="Source"
              className="max-h-72 object-contain rounded border border-[#1f2235]"
            />
            <button
              onClick={clearScanner}
              className="w-full text-center py-2 bg-gray-800/40 hover:bg-gray-800 text-gray-300 text-xs font-semibold rounded-lg border border-gray-700"
            >
              Scan Another Image
            </button>
          </div>

          {/* Right report details */}
          <div className="md:col-span-3 glass-panel rounded-xl p-6 border-[#1f2235] space-y-6">
            {/* Header Score */}
            <div className="flex items-center justify-between border-b border-[#1f2235] pb-4">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold font-mono">Poster Scan Results</span>
                <h3 className="text-xl font-extrabold text-white">{result.sourceName}</h3>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-2xl font-black font-mono ${
                  result.safetyScore >= 8 ? "text-emerald-400" :
                  result.safetyScore >= 5 ? "text-amber-400" :
                  "text-rose-400"
                }`}>
                  {result.safetyScore}/10
                </span>
                <span className="text-[9px] text-gray-500 uppercase font-bold">Safety rating</span>
              </div>
            </div>

            {/* Extracted Text Box */}
            <div className="space-y-1.5">
              <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Extracted OCR Content</h5>
              <div className="bg-[#0a0b10] border border-[#1f2235] p-3 rounded-lg max-h-36 overflow-y-auto font-mono text-xs text-gray-400 leading-relaxed">
                {result.extractedText}
              </div>
            </div>

            {/* Flags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Reds */}
              <div className="space-y-2 bg-red-500/5 border border-red-500/10 p-3 rounded-lg">
                <h5 className="font-bold text-xs uppercase tracking-wider text-rose-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Red Flags
                </h5>
                <ul className="space-y-1.5">
                  {result.redFlags.map((f, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex items-start gap-1">
                      <span className="text-rose-500 mt-0.5">&bull;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Greens */}
              <div className="space-y-2 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg">
                <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Green Flags
                </h5>
                <ul className="space-y-1.5">
                  {result.greenFlags.map((f, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex items-start gap-1">
                      <span className="text-emerald-500 mt-0.5">&bull;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
