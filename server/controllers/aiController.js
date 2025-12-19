import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateItinerary = async (req, res) => {
  const { destination, days, budget } = req.body;

  const prompt = `
Create a ${days}-day budget travel itinerary to ${destination}
within ₹${budget}. Focus on student-friendly places,
cheap food, and minimal travel fatigue.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  res.json({
    itinerary: response.choices[0].message.content,
  });
};
