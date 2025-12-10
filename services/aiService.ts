import { EmailData, AnalysisResult } from "../types";

// Helper to call the Python backend
const getPhishingScore = async (
  email: EmailData,
  log: (msg: string) => void
): Promise<number> => {
  try {
    log(`POST http://localhost:8000/predict`);
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(email),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    log(`Received score: ${data.score}`);
    return data.score;
  } catch (error) {
    console.error("Error fetching phishing score:", error);
    log(`Error fetching score: ${error}`);
    throw error;
  }
};

// Ollama helper
const getAIAnalysis = async (
  email: EmailData,
  score: number,
  log: (msg: string) => void
): Promise<string> => {
  const prompt = `
You are a cybersecurity expert assistant.
Analyze this email and the phishing score (0-1, where 1 is high risk).

Phishing Score: ${score.toFixed(2)}

Email:
From: ${email.sender}
Subject: ${email.subject}
Body: ${email.content}

Provide a concise, user-friendly explanation of the risk.
If the score is high, explain why (e.g., suspicious sender, urgency).
If low, check again if it looks safe by measuring suspicious metrics (sender address way too long, many URLs, emotional manipulation, etc.)
Do not use markdown formatting.
`;

  try {
    log(`Preparing LLM prompt...`);
    log(`POST http://localhost:11434/api/generate (model: smollm2)`);

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "smollm2",
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      log(`AI Service unavailable: ${response.status}`);
      console.warn("AI Service unavailable, status:", response.status);
      return "AI analysis unavailable. Please ensure the local AI service is running.";
    }

    const result = await response.json();
    log(`LLM Response received (${result.response.length} chars)`);
    return result.response;
  } catch (error) {
    log(`AI Analysis failed: ${error}`);
    console.error("AI Analysis failed:", error);
    return "AI analysis unavailable. Please ensure the local AI service is running.";
  }
};

export const analyzeEmail = async (
  email: EmailData,
  onLog?: (message: string) => void
): Promise<AnalysisResult> => {
  const log = (msg: string) => {
    if (onLog) {
      onLog(`[${new Date().toLocaleTimeString()}] ${msg}`);
    }
  };

  log("Starting analysis workflow...");
  log(`Target: ${email.sender}`);

  log("Step 1: Quantitative Analysis (XGBoost)");
  const score = await getPhishingScore(email, log);

  log("Step 2: Qualitative Analysis (GenAI)");
  const aiText = await getAIAnalysis(email, score, log);

  log("Step 3: Risk Classification");
  let riskLevel: "Safe" | "Suspicious" | "Dangerous" = "Safe";
  if (score > 0.75) riskLevel = "Dangerous";
  else if (score > 0.4) riskLevel = "Suspicious";

  log(`Result: ${riskLevel} (Score: ${score.toFixed(4)})`);
  log("Analysis complete.");

  return {
    xgboostScore: score,
    riskLevel,
    aiAnalysis: aiText,
    timestamp: new Date(),
  };
};
