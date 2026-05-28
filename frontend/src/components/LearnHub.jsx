import React, { useState } from "react";
import { BookOpen, ShieldCheck, HelpCircle, Award, Sparkles } from "lucide-react";

export default function LearnHub() {
  const [activeSubSection, setActiveSubSection] = useState("tips");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);

  const quizQuestions = [
    {
      q: "A recruiter reaches out via WhatsApp, offers a job with no interview, and invites you to a Telegram group to receive coding tasks. Safe or Scam?",
      options: [
        "Safe. Startups move fast and use chat tools for remote speed.",
        "Scam. Reputable companies do not hire without video/voice screens, nor do they run onboarding in anonymous chat apps."
      ],
      correct: 1,
      explanation: "Telegram and WhatsApp are heavily favored by scammers because they provide end-to-end anonymity. Real companies use branded portals, professional emails, and face-to-face video conferences for screening."
    },
    {
      q: "You get an offer letter stating you must pay a $40 'refundable portal security deposit' to activate your credentials. What do you do?",
      options: [
        "Pay it immediately. It's only $40 and they promised to return it on my first paycheck.",
        "Withdraw immediately. Legitimate companies cover all onboarding software costs and never charge candidates to work."
      ],
      correct: 1,
      explanation: "This is an 'Advance-Fee' scam. Once you pay, they will claim you need to pay additional insurance or verification costs. No real company makes employees pay to join."
    },
    {
      q: "An internship offers no training, but promises a certificate only if you sell 10 licenses of their software to your classmates. What is this?",
      options: [
        "A standard commission-based sales internship with concrete rewards.",
        "An unpaid certificate trap / Multi-Level Marketing (MLM) scheme exploiting student networks."
      ],
      correct: 1,
      explanation: "Certificate trapping uses the student's desperation for credentials to force unpaid sales labor. If there is no mentor and the primary focus is selling to personal networks, avoid it."
    }
  ];

  const handleAnswerSubmit = (idx) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    if (idx === quizQuestions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setAnswered(false);
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Finished
      setCurrentQuestion(quizQuestions.length); // trigger end screen
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setQuizStarted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-[#1f2235] pb-6 justify-between flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider">Education & Quiz Hub</h2>
          </div>
          <p className="text-gray-400 text-sm">
            Learn the security tricks scammers use and test your hiring safety knowledge in our interactive threat quiz.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubSection("tips")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
              activeSubSection === "tips"
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Safety Tips
          </button>
          <button
            onClick={() => { setActiveSubSection("quiz"); setQuizStarted(false); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
              activeSubSection === "quiz"
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Threat Quiz
          </button>
        </div>
      </div>

      {/* Safety Tips Cards */}
      {activeSubSection === "tips" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Resume safety */}
            <div className="glass-panel rounded-xl p-5 border-[#1f2235] space-y-4">
              <h4 className="font-bold text-white text-base flex items-center gap-2 border-b border-[#1f2235] pb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Resume Safety Checklist
              </h4>
              <ul className="space-y-3.5">
                <li className="text-xs text-gray-300 leading-relaxed text-left">
                  <strong>Minimize Address:</strong> Never put your full house address on resumes uploaded to public boards. Only list <span className="text-blue-400">City, State</span>.
                </li>
                <li className="text-xs text-gray-300 leading-relaxed text-left">
                  <strong>Omit References:</strong> Don't list references' contact numbers on your public resume. Scammers scrape these numbers for robocalls. Write <em>"References available upon request"</em>.
                </li>
                <li className="text-xs text-gray-300 leading-relaxed text-left">
                  <strong>Dedicated Mailbox:</strong> Set up a separate, professional email (e.g. \`john.jobs@gmail.com\`) specifically for job applications.
                </li>
                <li className="text-xs text-gray-300 leading-relaxed text-left">
                  <strong>Hide Personal Details:</strong> Omit Date of Birth, gender, or national registry IDs (SSN, Aadhaar) from job boards.
                </li>
              </ul>
            </div>

            {/* Common scams description */}
            <div className="glass-panel rounded-xl p-5 border-[#1f2235] space-y-4">
              <h4 className="font-bold text-white text-base flex items-center gap-2 border-b border-[#1f2235] pb-2">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
                Key Recruitment Scams to Spot
              </h4>
              <ul className="space-y-3.5">
                <li className="text-xs text-gray-300 leading-relaxed text-left">
                  <strong>Task Arbitrage:</strong> Promises high hourly rates for clicking links, captcha typing, or rating videos. Requires deposit money to access tasks.
                </li>
                <li className="text-xs text-gray-300 leading-relaxed text-left">
                  <strong>Fake Check Scams:</strong> Sent a check to purchase equipment from a special portal. The check bounces after you transfer real funds to their seller.
                </li>
                <li className="text-xs text-gray-300 leading-relaxed text-left">
                  <strong>Certificate traps:</strong> Promises a valuable certificate but makes you perform commission sales work for friends. The certificate is issued by a fake entity.
                </li>
                <li className="text-xs text-gray-300 leading-relaxed text-left">
                  <strong>Domain Impersonation:</strong> Scammers buy domains like \`@wipro-hiring.com\` to look official. Check WHOIS records to ensure domain is over 1 year old.
                </li>
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* Threat Quiz Section */}
      {activeSubSection === "quiz" && (
        <div className="max-w-2xl mx-auto glass-panel rounded-xl p-6 border-[#1f2235] space-y-6">
          {!quizStarted ? (
            <div className="text-center py-6 space-y-4">
              <HelpCircle className="w-16 h-16 text-blue-400 mx-auto animate-pulse" />
              <div>
                <h3 className="text-xl font-bold text-white">Interactive Recruitment Safety Quiz</h3>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed max-w-md mx-auto">
                  Take a quick 3-question quiz simulating modern recruitment scams to check if you are vulnerable to certificate trap or phishing setups.
                </p>
              </div>
              <button
                onClick={() => setQuizStarted(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-2.5 rounded-lg text-sm transition-colors shadow-glow-primary"
              >
                Start Quiz
              </button>
            </div>
          ) : currentQuestion < quizQuestions.length ? (
            <div className="space-y-4 text-left">
              {/* Question progress */}
              <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span>Correct Score: {score}</span>
              </div>

              {/* Question text */}
              <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
                {quizQuestions[currentQuestion].q}
              </h4>

              {/* Answer options */}
              <div className="space-y-2 pt-2">
                {quizQuestions[currentQuestion].options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleAnswerSubmit(oIdx)}
                    disabled={answered}
                    className={`w-full text-left p-3.5 rounded-lg text-xs sm:text-sm border transition-all ${
                      answered
                        ? oIdx === quizQuestions[currentQuestion].correct
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold"
                          : selectedAnswer === oIdx
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-400 font-semibold"
                            : "bg-[#0a0b10] border-[#1f2235] text-gray-500"
                        : "bg-[#0a0b10] hover:bg-[#121420] border-[#1f2235] hover:border-blue-500/30 text-gray-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Explanation section */}
              {answered && (
                <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 space-y-2 mt-4">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Security Explanation
                  </span>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{quizQuestions[currentQuestion].explanation}</p>
                  <button
                    onClick={handleNext}
                    className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded text-xs transition-colors self-end"
                  >
                    Next Question &rarr;
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Results screen
            <div className="text-center py-6 space-y-4">
              <Award className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <div>
                <h3 className="text-xl font-bold text-white">Quiz Completed!</h3>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  You scored <strong className="text-emerald-400">{score} out of {quizQuestions.length}</strong> correct.
                </p>
                <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                  {score === quizQuestions.length 
                    ? "Congratulations! You have excellent security hygiene and can identify job phishing and payment traps perfectly."
                    : "Review the safety tips checklists on the previous screen to lock down your recruitment safety."}
                </p>
              </div>
              <button
                onClick={restartQuiz}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-lg text-xs transition-colors shadow-glow-primary"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
