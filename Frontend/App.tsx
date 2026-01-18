import React, { useState } from "react";
import Navbar from "./src/components/Navbar";
import HeroSection from "./src/components/HeroSection";
import Dashboard from "./src/components/Dashboard";
import TrendingSection from "./src/components/TrendingSection";
import { AnalysisResult } from "./types";
import { analyzeContent } from "./src/services/apiService";

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (input: string) => {
    if (!input.trim()) {
      setError("Please enter a headline, URL, or claim to analyze");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeContent(input.trim());
      setAnalysisResult(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to analyze content. Please ensure the backend is running.";
      setError(errorMessage);
      console.error("Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrendingClick = (headline: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    handleAnalyze(headline);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12 mb-12">
        <HeroSection onAnalyze={handleAnalyze} isLoading={isLoading} />

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-800 dark:text-red-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {isLoading && !analysisResult && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 dark:text-slate-400">
                Analyzing with AI...
              </p>
            </div>
          </div>
        )}

        {analysisResult && !isLoading && <Dashboard data={analysisResult} />}

        <TrendingSection onCardClick={handleTrendingClick} />
      </main>

      <footer className="w-full border-t border-gray-200 dark:border-white/5 mt-auto bg-background-light dark:bg-background-dark py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            © 2026 Verifi.ai Inc. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-slate-400 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                feed
              </span>
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                alternate_email
              </span>
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                code
              </span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;
