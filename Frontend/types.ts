export interface CrossReference {
    source: string;
    sourceInitials: string;
    timeAgo: string;
    trustColor: 'primary' | 'yellow' | 'red' | 'gray';
  }
  
  export interface AnalysisResult {
    trustScore: number;
    factualAccuracy: string;
    biasRating: string;
    headline: string;
    summary: string;
    tags: string[];
    crossReferences: CrossReference[];
  }
  
  export interface TrendingArticle {
    id: string;
    image: string;
    trustScore: number;
    source: string;
    sourceColor: string;
    sourceInitial: string;
    timeAgo: string;
    headline: string;
    category: string;
  }
  