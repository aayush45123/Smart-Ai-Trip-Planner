import { getGroqClient } from "../utils/groqClient.js";

/**
 * AI Trip Prefill
 */
export const aiPrefillTrip = async (req, res) => {
  try {
    const groq = getGroqClient();

    const { startCity, destinationCity, travelers } = req.body;

    const prompt = `You are a travel planning expert. Based on the following trip details, suggest optimal trip parameters.

Trip Details:
- From: ${startCity}
- To: ${destinationCity}
- Number of travelers: ${travelers}

Provide a JSON response with the following structure (ONLY JSON, no other text):
{
  "days": <number between 3-7>,
  "nights": <number, should be days-1>,
  "budget": <number in INR, between 5000-50000>,
  "stayType": "<one of: hostel, hotel, homestay>",
  "travelMode": "<one of: road, train, mixed>",
  "pace": "<one of: relaxed, balanced, fast>"
}

Consider:
- Distance between cities
- Number of travelers
- Typical costs in India
- Reasonable trip duration`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a helpful travel planning assistant. Always respond with valid JSON only, no additional text or markdown formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    let responseText = completion.choices[0].message.content.trim();
    
    // Remove markdown code blocks if present
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to parse the JSON
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Response text:", responseText);
      
      // Return default values if parsing fails
      return res.json({
        days: 3,
        nights: 2,
        budget: 10000,
        stayType: "hostel",
        travelMode: "road",
        pace: "balanced"
      });
    }

    // Validate and sanitize the response
    const validatedData = {
      days: Math.max(1, Math.min(15, parseInt(parsedData.days) || 3)),
      nights: Math.max(0, Math.min(14, parseInt(parsedData.nights) || 2)),
      budget: Math.max(2000, Math.min(500000, parseInt(parsedData.budget) || 10000)),
      stayType: ['hostel', 'hotel', 'homestay'].includes(parsedData.stayType) 
        ? parsedData.stayType 
        : 'hostel',
      travelMode: ['road', 'train', 'mixed'].includes(parsedData.travelMode)
        ? parsedData.travelMode
        : 'road',
      pace: ['relaxed', 'balanced', 'fast'].includes(parsedData.pace)
        ? parsedData.pace
        : 'balanced'
    };

    res.json(validatedData);
  } catch (err) {
    console.error("AI Prefill Error:", err);
    res.status(500).json({ 
      message: "AI prefill failed", 
      error: err.message,
      // Return default values on error
      days: 3,
      nights: 2,
      budget: 10000,
      stayType: "hostel",
      travelMode: "road",
      pace: "balanced"
    });
  }
};

/**
 * AI Destination Recommendations
 */
export const aiDestinationTips = async (req, res) => {
  try {
    const groq = getGroqClient();

    const { destinationCity } = req.body;

    const prompt = `You are a local travel expert for ${destinationCity}, India.

Provide travel recommendations in the following JSON format (ONLY JSON, no other text):

{
  "mustVisit": ["place1", "place2", "place3"],
  "localFood": ["food1", "food2", "food3"],
  "bestAreasToStay": ["area1", "area2", "area3"],
  "safetyTips": ["tip1", "tip2", "tip3"],
  "bestTimeToExplore": "description of best time",
  "extraTips": ["tip1", "tip2"]
}

Provide specific, actionable recommendations for ${destinationCity}.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a helpful travel guide. Always respond with valid JSON only, no additional text or markdown formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 1000,
    });

    let responseText = completion.choices[0].message.content.trim();
    
    // Remove markdown code blocks if present
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Response text:", responseText);
      
      // Return default structure if parsing fails
      return res.json({
        mustVisit: ["Local attractions", "Historical sites", "Popular landmarks"],
        localFood: ["Local cuisine", "Street food", "Traditional dishes"],
        bestAreasToStay: ["City center", "Tourist area", "Budget-friendly zone"],
        safetyTips: ["Stay aware of surroundings", "Keep valuables secure", "Use trusted transportation"],
        bestTimeToExplore: ["Early morning or evening for pleasant weather"],
        extraTips: ["Book accommodations in advance", "Learn basic local phrases"]
      });
    }

    res.json(parsedData);
  } catch (err) {
    console.error("AI Tips Error:", err);
    res.status(500).json({ 
      message: "AI tips failed", 
      error: err.message 
    });
  }
};