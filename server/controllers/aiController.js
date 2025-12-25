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
      return res.json({
        days: 3,
        nights: 2,
        budget: 15000,
        stayType: "hostel",
        travelMode: "road",
        pace: "balanced"
      });
    }

    console.log(`AI Prefill: ${startCity} -> ${destinationCity} = ${distanceKm.toFixed(0)} km`);

    // ✅ CALCULATE REALISTIC VALUES BASED ON ACTUAL DISTANCE
    let days, nights, budget, stayType, travelMode, pace;

    // Base costs per person
    const foodPerDay = 500;
    const activityPerDay = 400;

    // Distance-based logic
    if (distanceKm < 200) {
      // Short trip (e.g., Mumbai to Pune)
      days = 2;
      nights = 1;
      travelMode = "road";
      pace = "balanced";
      
      const travelCost = Math.round(distanceKm * 10 * travelers); // ₹10/km for short distances
      const stayCost = 600 * nights * travelers; // Hostel
      const foodCost = foodPerDay * days * travelers;
      const activityCost = activityPerDay * days * travelers;
      const buffer = Math.round((travelCost + stayCost + foodCost + activityCost) * 0.15);
      
      budget = travelCost + stayCost + foodCost + activityCost + buffer;
      stayType = "hostel";
      
    } else if (distanceKm < 500) {
      // Medium trip (e.g., Mumbai to Goa)
      days = 3;
      nights = 2;
      travelMode = distanceKm > 300 ? "train" : "road";
      pace = "balanced";
      
      const travelCost = Math.round(distanceKm * 8 * travelers); // ₹8/km
      const stayCost = 800 * nights * travelers; // Better hostel/budget hotel
      const foodCost = foodPerDay * days * travelers;
      const activityCost = activityPerDay * days * travelers;
      const buffer = Math.round((travelCost + stayCost + foodCost + activityCost) * 0.15);
      
      budget = travelCost + stayCost + foodCost + activityCost + buffer;
      stayType = "hostel";
      
    } else if (distanceKm < 1000) {
      // Long trip (e.g., Mumbai to Jaipur)
      days = 4;
      nights = 3;
      travelMode = "train";
      pace = "balanced";
      
      const travelCost = Math.round(distanceKm * 6 * travelers); // ₹6/km for train
      const stayCost = 1000 * nights * travelers; // Decent accommodation
      const foodCost = foodPerDay * days * travelers;
      const activityCost = activityPerDay * days * travelers;
      const buffer = Math.round((travelCost + stayCost + foodCost + activityCost) * 0.15);
      
      budget = travelCost + stayCost + foodCost + activityCost + buffer;
      stayType = "homestay";
      
    } else if (distanceKm < 1500) {
      // Very long trip (e.g., Mumbai to Kolkata)
      days = 5;
      nights = 4;
      travelMode = "train";
      pace = "fast";
      
      const travelCost = Math.round(distanceKm * 5 * travelers); // ₹5/km
      const stayCost = 1200 * nights * travelers;
      const foodCost = foodPerDay * days * travelers;
      const activityCost = activityPerDay * days * travelers;
      const buffer = Math.round((travelCost + stayCost + foodCost + activityCost) * 0.15);
      
      budget = travelCost + stayCost + foodCost + activityCost + buffer;
      stayType = "homestay";
      
    } else {
      // Extremely long trip (e.g., Mumbai to Northeast)
      days = 6;
      nights = 5;
      travelMode = "mixed";
      pace = "fast";
      
      const travelCost = Math.round(distanceKm * 4.5 * travelers); // ₹4.5/km
      const stayCost = 1200 * nights * travelers;
      const foodCost = foodPerDay * days * travelers;
      const activityCost = activityPerDay * days * travelers;
      const buffer = Math.round((travelCost + stayCost + foodCost + activityCost) * 0.2); // 20% buffer for long trips
      
      budget = travelCost + stayCost + foodCost + activityCost + buffer;
      stayType = "homestay";
    }

    // Round to nearest 500
    budget = Math.ceil(budget / 500) * 500;
    
    // Cap budget at max
    budget = Math.min(budget, 500000);

    const hours = Math.round(distanceKm / 60);

    const responseData = {
      days,
      nights,
      budget,
      stayType,
      travelMode,
      pace,
      metadata: {
        actualDistance: Math.round(distanceKm),
        estimatedTravelTime: `${hours} hours`,
        calculatedFrom: "real coordinates"
      }
    };

    console.log("AI Prefill Response:", {
      distance: distanceKm,
      budget: budget,
      travelers: travelers
    });

    res.json(responseData);
  } catch (err) {
    console.error("AI Prefill Error:", err);
    res.status(500).json({ 
      message: "AI prefill failed", 
      error: err.message,
      days: 3,
      nights: 2,
      budget: 15000,
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
      temperature: 0.3,
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