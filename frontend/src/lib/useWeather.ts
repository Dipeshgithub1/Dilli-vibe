import { useState, useEffect } from "react";

interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
  icon: string;
  city: string;
}

export const useWeather = (city: string = "Delhi") => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      // Check cache first
      const cached = localStorage.getItem(`weather_${city.toLowerCase()}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < 30 * 60 * 1000) { // 30 min cache
            setWeather(parsed.data);
            setLoading(false);
            return;
          }
        } catch {
          // Invalid cache, continue to fetch
        }
      }

      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

        // If no API key, use fallback weather data
        if (!apiKey) {
          console.warn("OpenWeather API key not configured, using fallback");
          const fallbackWeather = getFallbackWeather();
          setWeather(fallbackWeather);
          setLoading(false);
          setError("Weather API not configured");
          return;
        }

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
        );

        if (!res.ok) {
          throw new Error(`Weather fetch failed: ${res.status}`);
        }

        const data = await res.json();
        const weatherData: WeatherData = {
          temp: Math.round(data.main.temp),
          humidity: data.main.humidity,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          city: data.name,
        };

        setWeather(weatherData);
        localStorage.setItem(`weather_${city.toLowerCase()}`, JSON.stringify({
          data: weatherData,
          timestamp: Date.now(),
        }));
        setError(null);
      } catch (err: any) {
        console.error("Weather fetch error:", err);
        setError(err.message || "Failed to load weather");

        // Set fallback weather on error
        const fallbackWeather = getFallbackWeather();
        setWeather(fallbackWeather);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  return { weather, loading, error };
};

// Fallback weather data when API is unavailable
const getFallbackWeather = (): WeatherData => {
  const hour = new Date().getHours();
  let baseTemp = 28; // Delhi average

  if (hour >= 0 && hour < 6) baseTemp = 18; // Night
  else if (hour >= 6 && hour < 12) baseTemp = 24; // Morning
  else if (hour >= 12 && hour < 17) baseTemp = 32; // Afternoon
  else if (hour >= 17 && hour < 20) baseTemp = 28; // Evening
  else baseTemp = 26; // Night

  return {
    temp: baseTemp,
    humidity: 60,
    description: "partly cloudy",
    icon: "02d",
    city: "Delhi",
  };
};
