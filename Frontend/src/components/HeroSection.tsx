import React, { useState } from 'react';

interface HeroSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onAnalyze, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAnalyze = () => {
    if (inputValue.trim()) {
      onAnalyze(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <section className="flex flex-col items-center justify-center max-w-3xl mx-auto text-center w-full space-y-8 animate-fade-in-up">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          System Online
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Verify the truth behind<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">every headline.</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Instantly analyze credibility, bias, and factual accuracy with our minimalist AI engine.
        </p>
      </div>

      <div className="w-full relative group z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-emerald-500/30 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative flex items-center bg-white dark:bg-card-dark rounded-full shadow-lg dark:shadow-none border border-gray-200 dark:border-white/10 h-16 px-2 transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
          <div className="pl-5 pr-3 text-slate-400 dark:text-slate-500">
            <span className="material-symbols-outlined text-[28px]">link</span>
          </div>
          <input 
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-base md:text-lg text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 h-full w-full focus:ring-0" 
            placeholder="Paste article URL to analyze..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={handleAnalyze}
            disabled={isLoading}
            className={`bg-primary hover:bg-primary/90 text-background-dark font-bold rounded-full h-12 px-6 ml-2 transition-all transform active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/20 ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
          >
            {isLoading ? (
               <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
               <span className="material-symbols-outlined">auto_awesome</span>
            )}
            <span className="hidden sm:inline">{isLoading ? 'Analyzing...' : 'Analyze'}</span>
          </button>
        </div>
      </div>

      <div className="flex gap-6 pt-4 justify-center text-sm text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">bolt</span> Real-time Analysis</span>
        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">public</span> Global Sources</span>
        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">lock</span> Private & Secure</span>
      </div>
    </section>
  );
};

export default HeroSection;