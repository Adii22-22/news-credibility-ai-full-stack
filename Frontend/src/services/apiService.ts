import { AnalysisResult, TrendingArticle } from "../../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface BackendAnalysisResponse extends AnalysisResult {
  status: string;
  input: string;
}

interface BackendNewsResponse {
  articles: Array<{
    title: string;
    link: string;
    summary: string;
    published: string;
  }>;
}

/**
 * Analyzes content using the backend API
 * Returns structured data directly from AI analysis
 */
export const analyzeContent = async (text: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `API error: ${response.statusText}`);
    }

    const data: BackendAnalysisResponse = await response.json();

    if (data.status === "error") {
      throw new Error((data as any).message || "Analysis failed");
    }

    // Return the structured data directly (already matches AnalysisResult)
    return {
      trustScore: data.trustScore,
      factualAccuracy: data.factualAccuracy,
      biasRating: data.biasRating,
      headline: data.headline,
      summary: data.summary,
      tags: data.tags,
      crossReferences: data.crossReferences,
    };
  } catch (error) {
    console.error("Backend API Error:", error);
    throw error; // Re-throw to let the UI handle it properly
  }
};

/**
 * Fetches trending news from the backend
 */
export const fetchTrendingNews = async (): Promise<TrendingArticle[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/news`);

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data: BackendNewsResponse = await response.json();

    // Transform backend news format to TrendingArticle format
    return data.articles.slice(0, 12).map((article, idx) => {
      // Generate a placeholder image URL (you can enhance this later)
      const imageUrl = `https://picsum.photos/400/300?random=${idx}`;

      // Extract source from link or title
      const sourceMatch = article.link.match(/https?:\/\/(?:www\.)?([^\/]+)/);
      const sourceDomain = sourceMatch
        ? sourceMatch[1].replace("www.", "")
        : "Unknown";
      const sourceName = sourceDomain.split(".")[0];
      const sourceInitial = sourceName.charAt(0).toUpperCase();

      // Generate trust score (you could enhance this with actual analysis)
      const trustScore = 85 + Math.floor(Math.random() * 15);

      // Determine source color based on domain
      const sourceColors: Record<string, string> = {
        reuters: "bg-[#0056B3]",
        bbc: "bg-[#BB0000]",
        cnn: "bg-[#CC0000]",
        bloomberg: "bg-black",
        wsj: "bg-[#0056B3]",
      };
      const sourceColor =
        sourceColors[sourceName.toLowerCase()] || "bg-slate-600";

      // Extract category from title or summary
      const categories = [
        "Technology",
        "Finance",
        "Politics",
        "Science",
        "Health",
        "Sports",
        "Entertainment",
      ];
      const category =
        categories.find(
          (cat) =>
            article.title.toLowerCase().includes(cat.toLowerCase()) ||
            article.summary.toLowerCase().includes(cat.toLowerCase())
        ) || categories[Math.floor(Math.random() * categories.length)];

      // Calculate time ago from published date
      let timeAgo = "1h ago";
      try {
        const pubDate = new Date(article.published);
        const now = new Date();
        const diffHours = Math.floor(
          (now.getTime() - pubDate.getTime()) / (1000 * 60 * 60)
        );
        if (diffHours < 1) timeAgo = "Just now";
        else if (diffHours === 1) timeAgo = "1h ago";
        else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
        else {
          const diffDays = Math.floor(diffHours / 24);
          timeAgo = `${diffDays}d ago`;
        }
      } catch (e) {
        // Keep default
      }

      return {
        id: `trending-${idx}`,
        image: imageUrl,
        trustScore,
        source: sourceName.charAt(0).toUpperCase() + sourceName.slice(1),
        sourceColor,
        sourceInitial,
        timeAgo,
        headline: article.title,
        category,
      };
    });
  } catch (error) {
    console.error("Failed to fetch trending news:", error);
    return [];
  }
};
