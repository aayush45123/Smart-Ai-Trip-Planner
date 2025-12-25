import { getGroqClient } from "../utils/groqClient.js";
import { geocodeCity } from "../utils/geoCode.js";
import { getDistance } from "../utils/distance.js";

/**
 * AI Trip Prefill - Uses REAL distance and location data
 */
export const aiPrefillTrip = async (req, res) => {
  try {
    const { startCity, destinationCity, travelers } = req.body;

    // ✅ GET REAL COORDINATES AND DISTANCE
    let startCoords, endCoords, distanceKm;
    
    try {
      startCoords = await geocodeCity(startCity);
      endCoords = await geocodeCity(destinationCity);
      distanceKm = getDistance(
        startCoords.lat,
        startCoords.lng,
        endCoords.lat,
        endCoords.lng
      );
    } catch (geoError) {
      console.error("Geocoding failed:", geoError);
      // Fallback to defaults if geocoding fails
      return res.json({
        days: 3,
        nights: 2,
        budget: 10000,
        stayType: "hostel",
        travelMode: "road",
        pace: "balanced"
      });
    }

    // ✅ CALCULATE REALISTIC VALUES BASED ON ACTUAL DISTANCE
    const hours = distanceKm / 60; // Assuming 60 km/h average
    
    let days, nights, budget, stayType, travelMode, pace;

    // Distance-based logic
    if (distanceKm < 200) {
      days = 2;
      nights = 1;
      budget = Math.round(3000 + (distanceKm * 10) * travelers);
      travelMode = "road";
      pace = "balanced";
    } else if (distanceKm < 500) {
      days = 3;
      nights = 2;
      budget = Math.round(6000 + (distanceKm * 8) * travelers);
      travelMode = distanceKm > 300 ? "train" : "road";
      pace = "balanced";
    } else if (distanceKm < 1000) {
      days = 4;
      nights = 3;
      budget = Math.round(10000 + (distanceKm * 6) * travelers);
      travelMode = "train";
      pace = "balanced";
    } else {
      days = 5;
      nights = 4;
      budget = Math.round(15000 + (distanceKm * 5) * travelers);
      travelMode = "mixed";
      pace = "fast";
    }

    // Budget-based stay type
    const budgetPerPerson = budget / travelers;
    if (budgetPerPerson < 5000) {
      stayType = "hostel";
    } else if (budgetPerPerson < 15000) {
      stayType = "homestay";
    } else {
      stayType = "hotel";
    }

    // Cap budget at max
    budget = Math.min(budget, 500000);

    const responseData = {
      days,
      nights,
      budget,
      stayType,
      travelMode,
      pace,
      metadata: {
        actualDistance: Math.round(distanceKm),
        estimatedTravelTime: `${Math.round(hours)} hours`,
        calculatedFrom: "real coordinates"
      }
    };

    console.log("AI Prefill Response:", responseData);

    res.json(responseData);
  } catch (err) {
    console.error("AI Prefill Error:", err);
    res.status(500).json({ 
      message: "AI prefill failed", 
      error: err.message,
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
 * AI Destination Recommendations - Uses real location context
 */
export const aiDestinationTips = async (req, res) => {
  try {
    const groq = getGroqClient();
    const { destinationCity } = req.body;

    // ✅ GET REAL COORDINATES to provide context to AI
    let coords;
    try {
      coords = await geocodeCity(destinationCity);
    } catch (geoError) {
      console.error("Geocoding failed for destination:", geoError);
    }

    const locationContext = coords 
      ? `The destination ${destinationCity} is located at coordinates (${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)}).`
      : "";

    const prompt = `You are a knowledgeable travel guide for India. Provide REAL, SPECIFIC recommendations for ${destinationCity}, India.

${locationContext}

Research and provide accurate, well-known places in ${destinationCity}. If you don't know specific places, say so - do not make up fake places.

Respond ONLY with valid JSON in this exact format:
{
  "mustVisit": ["specific landmark 1", "specific landmark 2", "specific landmark 3"],
  "localFood": ["specific dish 1", "specific dish 2", "specific dish 3"],
  "bestAreasToStay": ["specific area 1", "specific area 2", "specific area 3"],
  "safetyTips": ["practical tip 1", "practical tip 2", "practical tip 3"],
  "bestTimeToExplore": "specific time recommendation with reason",
  "extraTips": ["useful tip 1", "useful tip 2"]
}

Use real place names, real dishes, and real neighborhoods. Be specific and accurate.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a travel expert with extensive knowledge of Indian cities. Provide only accurate, real information. If you don't know specific details, provide general but accurate advice. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more factual responses
      max_tokens: 1000,
    });

    let responseText = completion.choices[0].message.content.trim();
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Response text:", responseText);
      
      // Return location-aware defaults
      return res.json({
        mustVisit: [`Historic sites in ${destinationCity}`, `Local markets`, `Cultural centers`],
        localFood: ["Regional specialties", "Street food", "Traditional restaurants"],
        bestAreasToStay: ["City center", "Near major attractions", "Well-connected areas"],
        safetyTips: ["Use registered transportation", "Keep valuables secure", "Stay in well-lit areas at night"],
        bestTimeToExplore: ["Early morning (6-10 AM) or evening (4-7 PM) for pleasant weather"],
        extraTips: ["Book accommodations in advance", "Learn basic local phrases", "Carry cash for local vendors"]
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