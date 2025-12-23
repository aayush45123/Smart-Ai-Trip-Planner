import axios from "axios";

// ✅ This should be called from BACKEND ONLY
// For frontend, use the /api/geocode endpoints instead

export async function geocodeCity(cityName) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      cityName
    )}&limit=1`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "SmartTripPlanner/1.0",
      },
      timeout: 5000,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error(`City not found: ${cityName}`);
    }

    const result = response.data[0];

    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name,
    };
  } catch (error) {
    console.error(`Geocoding error for ${cityName}:`, error.message);
    throw error;
  }
}

export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "SmartTripPlanner/1.0",
      },
      timeout: 5000,
    });

    const address = response.data.address;

    return (
      address.city ||
      address.town ||
      address.village ||
      address.state ||
      address.county ||
      "Unknown Location"
    );
  } catch (error) {
    console.error("Reverse geocoding error:", error.message);
    throw error;
  }
}
