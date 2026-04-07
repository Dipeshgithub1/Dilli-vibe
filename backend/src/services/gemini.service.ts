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

export const getMoodTags = async (input: string): Promise<string[]> => {
  try {
    
    const hour = new Date().getHours();

    let timeContext = "Day";
    if (hour >= 6 && hour < 12) timeContext = "Morning";
    else if (hour >= 12 && hour < 17) timeContext = "Afternoon";
    else if (hour >= 17 && hour < 21) timeContext = "Evening";
    else timeContext = "Night";


    const prompt = `
You are an expert Delhi city guide for the "Dilli-Vibe" app.

Convert the user input into a JSON array of 3 to 6 tags.

User Input: "${input}"
Time Context: ${timeContext} (${hour}:00)

Rules:
- ONLY use tags from this list:
[${ALLOWED_TAGS.join(", ")}]

- Return ONLY a plain JSON array.
- No explanation, no markdown, no backticks.

Example:
["peaceful", "aesthetic", "nature"]
`;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text().trim();

    // 🧹 Extract JSON array safely
    const match = responseText.match(/\[.*\]/s);
    if (!match) {
      console.warn(" No JSON found from Gemini:", responseText);
      return FALLBACK_TAGS;
    }

    let parsed: string[] = [];

    try {
      parsed = JSON.parse(match[0]);
    } catch (err) {
      console.error(" JSON parse error:", err);
      return FALLBACK_TAGS;
    }

    // ✅ Normalize + filter + limit
    const validTags = parsed
      .map(tag => tag.toLowerCase().trim())
      .filter(tag => ALLOWED_TAGS.includes(tag))
      .slice(0, 6);

    //  Final fallback safety
    if (!validTags.length) {
      return FALLBACK_TAGS;
    }

    // 🧪 Debug logs (remove later in prod)
    console.log(" AI Input:", input);
    console.log(" AI Tags:", validTags);

    return validTags;

  } catch (error) {
    console.error(" Gemini Service Error:", error);
    return FALLBACK_TAGS;
  }
};