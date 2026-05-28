document.addEventListener("DOMContentLoaded", () => {
  const scanBtn = document.getElementById("scan-btn");
  const welcomePanel = document.getElementById("welcome-panel");
  const loadingPanel = document.getElementById("loading-panel");
  const resultPanel = document.getElementById("result-panel");
  const scoreValue = document.getElementById("score-value");
  const verdictTitle = document.getElementById("verdict-title");
  const riskBadge = document.getElementById("risk-badge");
  const adviceBox = document.getElementById("advice-box");
  const redFlagsList = document.getElementById("red-flags-list");

  scanBtn.addEventListener("click", () => {
    // Show loading
    welcomePanel.classList.add("hidden");
    loadingPanel.classList.remove("hidden");

    // Get active tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        showError("Unable to retrieve current browser tab.");
        return;
      }

      const activeTab = tabs[0];
      const activeUrl = activeTab.url;

      if (!activeUrl || activeUrl.startsWith("chrome://") || activeUrl.startsWith("about:")) {
        showError("Cannot scan system-internal pages. Go to a job board or website first.");
        return;
      }

      // Submit to backend
      fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: activeUrl })
      })
      .then(res => {
        if (!res.ok) throw new Error("Server responded with error status");
        return res.json();
      })
      .then(data => {
        renderResults(data);
      })
      .catch(err => {
        console.error(err);
        showError("Failed to reach InternShield server. Make sure the backend Node server is running on port 5000.");
      });
    });
  });

  function renderResults(data) {
    loadingPanel.classList.add("hidden");
    resultPanel.classList.remove("hidden");

    // Populate data
    scoreValue.textContent = data.trustScore;
    verdictTitle.textContent = data.hostname;
    verdictTitle.title = data.hostname;

    // Badge styling
    riskBadge.textContent = `${data.riskLevel} RISK`;
    riskBadge.className = "badge"; // Reset classes
    if (data.riskLevel === "Low") {
      riskBadge.classList.add("badge-low");
    } else if (data.riskLevel === "Medium") {
      riskBadge.classList.add("badge-medium");
    } else {
      riskBadge.classList.add("badge-high");
    }

    // Recommendation advice
    adviceBox.innerHTML = `<strong>Verdict: ${data.recommendation}</strong><br>${data.explanation}`;

    // Populate flags
    redFlagsList.innerHTML = "";
    if (data.redFlags && data.redFlags.length > 0 && !data.redFlags[0].includes("No immediate")) {
      data.redFlags.forEach(flag => {
        const li = document.createElement("li");
        li.textContent = flag;
        redFlagsList.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No urgent red flags discovered on this domain.";
      li.style.color = "#9ca3af";
      redFlagsList.appendChild(li);
    }
  }

  function showError(msg) {
    loadingPanel.classList.add("hidden");
    resultPanel.classList.remove("hidden");
    scoreValue.textContent = "!";
    verdictTitle.textContent = "Scan Failure";
    riskBadge.textContent = "ALERT";
    riskBadge.className = "badge badge-high";
    adviceBox.innerHTML = `⚠️ ${msg}`;
    redFlagsList.innerHTML = "<li>Restart the backend Node server or check configuration parameters.</li>";
  }
});
