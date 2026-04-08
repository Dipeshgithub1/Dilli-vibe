import { geminiModel } from "../config/gemini";


const ALLOWED_TAGS = [
  "peaceful",
  "nature",
  "quiet",
  "low-crowd",
  "outdoor",
  "music",
  "crowded",
  "nightlife",
  "party",
  "aesthetic",
  "cozy",
  "romantic",
  "cafe",
  "food",
  "street-food",
  "historic",
  "shopping",
  "luxury",
  "budget",
  "photography",
  "culture",
  "hangout",
];


const FALLBACK_TAGS = ["peaceful", "outdoor"];

//in memory case 
const cache = new Map<string,string[]>();

const callGemini = async (prompt: string, retries = 2): Promise<string | null> => {
  try {
    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (err: any) {
    if (retries > 0 && (err.status === 503 || err.message?.includes("timeout"))) {
      
      await new Promise((res) => setTimeout(res, 1000));
      return callGemini(prompt, retries - 1);
    }
    return null;
  }
};

export const getMoodTags = async (input: string): Promise<string[]> => {
  try {

    const cleanInput = input.toLowerCase().trim();

    // ⚡ 1. Cache hit
    if (cache.has(cleanInput)) {
     
      return cache.get(cleanInput)!;
    }

    // ⚡ 2. Skip AI for simple input
    if (cleanInput.split(" ").length <= 2) {
      return FALLBACK_TAGS;
    }
    
    const hour = new Date().getHours();

    let timeContext = "Day";
    if (hour >= 6 && hour < 12) timeContext = "Morning";
    else if (hour >= 12 && hour < 17) timeContext = "Afternoon";
    else if (hour >= 17 && hour < 21) timeContext = "Evening";
    else timeContext = "Night";


     const prompt = `
You are an expert Delhi city guide.

Convert the user input into EXACTLY 3 to 6 relevant tags.

STRICT RULES:
- ONLY use tags from this list:
[${ALLOWED_TAGS.join(", ")}]

- Avoid irrelevant tags (e.g. no "nightlife" for chill/romantic)
- Output ONLY JSON array
- No explanation

User Input: "${cleanInput}"
Time: ${timeContext}

Example:
["romantic","cozy","quiet"]
`;
// // ⏱️ Timeout protection (5 sec)
//     const result = await Promise.race([
//       geminiModel.generateContent(prompt),
//       new Promise((_, reject) =>
//         setTimeout(() => reject(new Error("Gemini timeout")), 10000)
//       ),
//     ]);
    
    
    // ⏱️ Call Gemini with retry
    const responseText = await callGemini(prompt);

    if (!responseText) {
      
      return FALLBACK_TAGS;
    }

    // 🧹 Extract JSON
    const match = responseText.match(/\[.*\]/s);
    if (!match) return FALLBACK_TAGS;

    let parsed: string[] = [];

    try {
      parsed = JSON.parse(match[0]);
    } catch {
      return FALLBACK_TAGS;
    }

    // ✅ Clean + filter + dedupe
    let validTags = [...new Set(
      parsed
        .map(tag => tag.toLowerCase().trim())
        .filter(tag => ALLOWED_TAGS.includes(tag))
    )].slice(0, 6);

    // 🔥 Smart filter (remove conflicts)
    if (cleanInput.includes("chill") || cleanInput.includes("peaceful")) {
      validTags = validTags.filter(tag => !["nightlife","crowded","party"].includes(tag));
    }

    if (cleanInput.includes("romantic")) {
      validTags = validTags.filter(tag => tag !== "crowded");
    }

    if (!validTags.length) {
      return FALLBACK_TAGS;
    }

    // 💾 Save to cache
    cache.set(cleanInput, validTags);

    console.log("🧠 AI Input:", cleanInput);
    console.log("🏷️ AI Tags:", validTags);

    return validTags;

  } catch (error) {
    
    return FALLBACK_TAGS;
  }
};