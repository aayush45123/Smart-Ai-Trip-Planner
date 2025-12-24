import { getGroqClient } from "../utils/groqClient.js";

/**
 * AI Trip Prefill
 */
export const aiPrefillTrip = async (req, res) => {
  try {
    const groq = getGroqClient(); // ✅ called AFTER dotenv is loaded

    const { startCity, destinationCity, travelers } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Suggest optimal trip for ${travelers} people from ${startCity} to ${destinationCity}`,
        },
      ],
      temperature: 0.3,
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (err) {
    res.status(500).json({ message: "AI prefill failed", error: err.message });
  }
};

/**
 * AI Destination Recommendations
 */
export const aiDestinationTips = async (req, res) => {
  try {
    const groq = getGroqClient();

    const { destinationCity } = req.body;

    const prompt = `
You are a local travel expert.

Give recommendations for ${destinationCity} in JSON ONLY:

{
  "mustVisit": [],
  "localFood": [],
  "bestAreasToStay": [],
  "safetyTips": [],
  "bestTimeToExplore": "",
  "extraTips": []
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (err) {
    res.status(500).json({ message: "AI tips failed", error: err.message });
  }
};
