// ✅ CORRECT VERSION - Uses backend proxy to avoid CORS
import api from "../services/api.js";

export async function getCityFromCoords(lat, lon) {
  try {
    // Use your backend proxy instead of calling Nominatim directly
    const url = `/geocode/reverse?lat=${lat}&lon=${lon}`;

    const res = await api.get(url);

    const address = res.data.address;

    return (
      address.city ||
      address.town ||
      address.village ||
      address.state ||
      address.county ||
      ""
    );
  } catch (error) {
    console.error("Failed to get city from coords:", error);
    throw error; // Let the calling code handle the fallback
  }
}

export async function geocodeCity(cityName) {
  try {
    // If you need forward geocoding, add this endpoint to your backend too
    const url = `/geocode/search?q=${encodeURIComponent(cityName)}`;

    const res = await api.get(url);

    if (res.data && res.data.length > 0) {
      return {
        lat: parseFloat(res.data[0].lat),
        lng: parseFloat(res.data[0].lon),
        name: res.data[0].display_name,
      };
    }

    throw new Error("City not found");
  } catch (error) {
    console.error("Failed to geocode city:", error);
    throw error;
  }
}
