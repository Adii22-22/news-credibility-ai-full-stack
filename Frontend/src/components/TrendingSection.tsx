import React, { useState, useEffect } from 'react';
import { TrendingArticle } from '../../types';
import { fetchTrendingNews } from '../services/apiService';

interface TrendingSectionProps {
    onCardClick: (headline: string) => void;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ onCardClick }) => {
  const [trendingData, setTrendingData] = useState<TrendingArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrendingNews = async () => {
      setIsLoading(true);
      try {
        const news = await fetchTrendingNews();
        setTrendingData(news);
      } catch (error) {
        console.error('Failed to load trending news:', error);
        setTrendingData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendingNews();
  }, []);
  return (
    <section className="flex flex-col gap-6 opacity-0 animate-[fadeIn_0.5s_ease-out_0.6s_forwards]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-lg">trending_up</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Trending Analysis</h2>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-white/5">
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <button className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-white/5">
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden animate-pulse">
              <div className="h-48 bg-slate-200 dark:bg-slate-700"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : trendingData.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-4xl mb-2">news</span>
          <p>No trending news available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingData.map((item) => (
          <div 
            key={item.id} 
            className="group bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-glow cursor-pointer"
            onClick={() => onCardClick(item.headline)}
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.headline} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-3 right-3 bg-card-dark/90 backdrop-blur border border-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-lg">
                <span className={`size-2 rounded-full ${item.trustScore < 80 ? 'bg-yellow-500' : 'bg-primary'} ${item.trustScore >= 90 ? 'animate-pulse' : ''}`}></span>
                <span className="text-xs font-bold text-white">{item.trustScore}% {item.trustScore < 80 ? 'Review' : 'Trust'}</span>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className={`size-5 rounded ${item.sourceColor} flex items-center justify-center text-white text-[10px] font-bold`}>{item.sourceInitial}</div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.source}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-xs text-slate-400">{item.timeAgo}</span>
              </div>
              
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {item.headline}
              </h3>
              
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-surface-dark text-slate-500 dark:text-slate-400 text-[10px] font-medium border border-gray-200 dark:border-white/5">
                  {item.category}
                </span>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TrendingSection;