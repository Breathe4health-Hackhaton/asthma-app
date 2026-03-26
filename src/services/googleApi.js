// src/services/googleApi.js
// GOOGLE CLOUD API SERVICES

const API_KEY = 'AIzaSyCRTzQHYKJZnFu2fJ8_fbx3AHAEG2BvCUo';

export async function fetchAirQuality(lat, lng) {
  try {
    if (!API_KEY || API_KEY.includes('YOUR_GOOGLE_API_KEY')) {
       console.warn("API Key eksik, mock veriye düşülüyor.");
       return null;
    }

    const response = await fetch(`https://airquality.googleapis.com/v1/currentConditions:lookup?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: { latitude: lat, longitude: lng },
        languageCode: "tr",
        extraComputations: ["HEALTH_RECOMMENDATIONS", "DOMINANT_POLLUTANT_CONCENTRATION", "POLLUTANT_CONCENTRATION", "LOCAL_AQI", "POLLUTANT_ADDITIONAL_INFO"]
      })
    });
    
    if (!response.ok) {
       const errorDetails = await response.text();
       console.error("GOOGLE AIR QUALITY ERROR => ", response.status, errorDetails);
       throw new Error(`Google API Hatası: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("GOOGLE AIR QUALITY BAŞARILI =>", data);
    return data;
    
  } catch (error) {
    console.error("Air Quality İstek Hatası:", error);
    return { error: true, message: error.message };
  }
}

export async function fetchPollen(lat, lng, days = 1) {
  try {
    if (!API_KEY || API_KEY.includes('YOUR_GOOGLE_API_KEY')) {
       return null;
    }

    const response = await fetch(`https://pollen.googleapis.com/v1/forecast:lookup?key=${API_KEY}&location.latitude=${lat}&location.longitude=${lng}&days=${days}&languageCode=tr`);
    
    if (!response.ok) {
       const errorDetails = await response.text();
       console.error("GOOGLE POLLEN ERROR => ", response.status, errorDetails);
       throw new Error(`Pollen API Hatası: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("GOOGLE POLLEN BAŞARILI =>", data);
    return data;
    
  } catch (error) {
    console.error("Pollen İstek Hatası:", error);
    return { error: true, message: error.message };
  }
}
