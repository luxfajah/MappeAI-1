import OpenAI from "openai";
import { Research, ReportContent } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key-for-development"
});

/**
 * Analyzes the research data and identifies relevant competitors using AI
 */
export async function analyzeCompetitors(research: Research): Promise<string[]> {
  const prompt = `
    I need to identify the main competitors for a business with the following details:
    - Product/Service: ${research.product}
    - Industry/Sector: ${research.sector}
    - Geographic location: ${research.location}
    
    Please provide a list of 5 major competitors in this space. 
    Return ONLY the names of the companies as a JSON array of strings.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return Array.isArray(result.competitors) ? result.competitors : [];
  } catch (error) {
    console.error("Error analyzing competitors:", error);
    // Return some default competitors as fallback
    return ["Competitor 1", "Competitor 2", "Competitor 3", "Competitor 4", "Competitor 5"];
  }
}

/**
 * Generates a comprehensive competition analysis report
 */
export async function generateReport(research: Research, competitors: string[]): Promise<ReportContent> {
  // If competitors came from the research competitors field, parse them
  const competitorsArray = competitors.length > 0 
    ? competitors 
    : research.competitors?.split(",").map(c => c.trim()) || [];

  const aspectsToAnalyze = Array.isArray(research.aspectsToAnalyze) 
    ? research.aspectsToAnalyze 
    : [];

  const prompt = `
    Generate a comprehensive competitive analysis report for:
    - Product/Service: ${research.product}
    - Industry/Sector: ${research.sector}
    - Geographic location: ${research.location}
    - Competitors: ${competitorsArray.join(", ")}
    
    Aspects to analyze: ${aspectsToAnalyze.join(", ")}
    
    Generate a detailed report with the following sections:
    1. Competitor profiles
    2. Price comparison
    3. Feature comparison
    4. Market positioning
    5. Market share
    6. Conclusions and recommendations
    
    Return the data in the following JSON format:
    {
      "competitors": [
        {"name": "Competitor 1", "website": "example.com", "description": "Brief description"}
      ],
      "priceComparison": {
        "data": [
          {"competitor": "Competitor 1", "price": 99}
        ],
        "analysis": "Price comparison analysis text"
      },
      "featureComparison": {
        "features": ["Feature 1", "Feature 2"],
        "data": [
          {"competitor": "Competitor 1", "hasFeature": [true, false]}
        ],
        "analysis": "Feature comparison analysis text"
      },
      "marketPositioning": {
        "data": [
          {"competitor": "Competitor 1", "x": 0.5, "y": 0.7, "marketShare": 0.3}
        ],
        "analysis": "Market positioning analysis text"
      },
      "marketShare": {
        "data": [
          {"competitor": "Competitor 1", "share": 0.3}
        ],
        "analysis": "Market share analysis text"
      },
      "conclusions": {
        "findings": ["Key finding 1", "Key finding 2"],
        "opportunities": ["Opportunity 1", "Opportunity 2"],
        "recommendations": ["Recommendation 1", "Recommendation 2"]
      }
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result as ReportContent;
  } catch (error) {
    console.error("Error generating report:", error);
    
    // Return fallback report with minimal data
    return {
      competitors: competitorsArray.map(name => ({ name })),
      conclusions: {
        findings: ["Analysis could not be completed successfully"],
        opportunities: ["Try again later or contact support for assistance"],
        recommendations: ["Review input data and try again"]
      }
    };
  }
}
