import React, { useEffect, useState } from 'react';
import { AnalysisResult } from '../../types';

interface DashboardProps {
  data: AnalysisResult;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Simple animation for the score
    const timer = setTimeout(() => {
      setAnimatedScore(data.trustScore);
    }, 300);
    return () => clearTimeout(timer);
  }, [data.trustScore]);

  // Calculate stroke dashoffset for SVG circle
  // r=42, circumference = 2 * pi * 42 ≈ 264
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColorClass = (colorType: string) => {
     switch(colorType) {
        case 'primary': return 'bg-primary';
        case 'yellow': return 'bg-yellow-500';
        case 'red': return 'bg-red-500';
        default: return 'bg-slate-400';
     }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full animate-fade-in">
      {/* Trust Score Card */}
      <div className="lg:col-span-4 xl:col-span-3">
        <div className="glass-panel h-full rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <div className="w-full flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Trust Score</h3>
            <span className="material-symbols-outlined text-primary">verified</span>
          </div>

          <div className="relative size-48 flex items-center justify-center mb-6">
            <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
              <circle className="text-slate-200 dark:text-white/5" strokeWidth="6" stroke="currentColor" fill="transparent" r={radius} cx="50" cy="50" />
              <circle 
                className="text-primary progress-ring__circle" 
                strokeWidth="6" 
                strokeDasharray={circumference} 
                strokeDashoffset={offset} 
                strokeLinecap="round" 
                stroke="currentColor" 
                fill="transparent" 
                r={radius} 
                cx="50" 
                cy="50" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{animatedScore}</span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                {data.trustScore >= 90 ? 'Excellent' : data.trustScore >= 70 ? 'Good' : 'Caution'}
              </span>
            </div>
          </div>

          <div className="w-full space-y-3">
            <div className="flex justify-between items-center text-sm p-3 bg-white/50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
              <span className="text-slate-600 dark:text-slate-300">Factual Accuracy</span>
              <span className={`font-bold ${data.factualAccuracy === 'High' ? 'text-primary' : 'text-yellow-500'}`}>
                {data.factualAccuracy}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm p-3 bg-white/50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
              <span className="text-slate-600 dark:text-slate-300">Bias Rating</span>
              <span className="font-bold text-emerald-400">{data.biasRating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Main Card */}
      <div className="lg:col-span-8 xl:col-span-6">
        <div className="bg-white dark:bg-card-dark h-full rounded-2xl p-8 border border-gray-200 dark:border-white/5 shadow-sm relative flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <span className="material-symbols-outlined">auto_stories</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Analysis</h2>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-white/5">
                <span className="material-symbols-outlined text-[20px]">content_copy</span>
              </button>
              <button className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-white/5">
                <span className="material-symbols-outlined text-[20px]">share</span>
              </button>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none flex-1">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 leading-snug">
              {data.headline}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 whitespace-pre-wrap">
              {data.summary}
            </p>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5 flex gap-3 flex-wrap">
            {data.tags.map((tag, idx) => (
               <span key={idx} className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-surface-dark text-slate-600 dark:text-slate-300 text-xs font-medium border border-gray-200 dark:border-white/5">
                 #{tag}
               </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cross Reference Sidebar */}
      <div className="lg:col-span-12 xl:col-span-3 flex flex-col gap-6">
        <div className="bg-white dark:bg-card-dark flex-1 rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Cross-Reference</h3>
            <button className="text-xs font-semibold text-primary hover:text-primary/80">View All</button>
          </div>
          
          <div className="space-y-4">
            {data.crossReferences.map((ref, idx) => (
                <div key={idx}>
                    <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-1 rounded-lg transition-colors -mx-1">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center overflow-hidden">
                        <span className="font-serif font-bold text-xs">{ref.sourceInitials}</span>
                        </div>
                        <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{ref.source}</span>
                        <span className="text-xs text-slate-500">{ref.timeAgo}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${getColorClass(ref.trustColor)}`}></span>
                        <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
                    </div>
                    </div>
                    {idx < data.crossReferences.length - 1 && (
                        <div className="h-px bg-gray-100 dark:bg-white/5 w-full my-2"></div>
                    )}
                </div>
            ))}
          </div>
        </div>

        <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-background-dark mb-3">
              <span className="material-symbols-outlined">extension</span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Browser Extension</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">Verify news directly on any website.</p>
            <a href="#" className="text-xs font-bold text-primary hover:underline">Install Now -&gt;</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;