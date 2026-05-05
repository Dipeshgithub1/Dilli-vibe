import { useState, useEffect } from "react";

interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
  icon: string;
  city: string;
}

// Map area/locality names to recognizable city names for OpenWeatherMap
const getCityForWeather = (area: string): string => {
  const cityMapping: Record<string, string> = {
    "nizamuddin": "Delhi",
    "connaught place": "Delhi",
    "cp": "Delhi",
    "hauz khas": "Delhi",
    "greater kailash": "Delhi",
    "gk": "Delhi",
    "khan market": "Delhi",
    "saket": "Delhi",
    "vasant vihar": "Delhi",
    "dwarka": "Delhi",
    "rohini": "Delhi",
    "pitampura": "Delhi",
    "preet vihar": "Delhi",
    "janakpuri": "Delhi",
    "gurgaon": "Gurgaon",
    "gurugram": "Gurgaon",
    "noida": "Noida",
    "faridabad": "Faridabad",
    "ghaziabad": "Ghaziabad",
  };

  const normalized = area.toLowerCase().trim();
  return cityMapping[normalized] || area;
};

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
          if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
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

        if (!apiKey) {
          console.warn("OpenWeather API key not configured, using fallback");
          const fallbackWeather = getFallbackWeather();
          setWeather(fallbackWeather);
          setLoading(false);
          setError("Weather API not configured");
          return;
        }

        const normalizedCity = getCityForWeather(city);

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(normalizedCity)}&appid=${apiKey}&units=metric`
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
  let baseTemp = 28;

  if (hour >= 0 && hour < 6) baseTemp = 18;
  else if (hour >= 6 && hour < 12) baseTemp = 24;
  else if (hour >= 12 && hour < 17) baseTemp = 32;
  else if (hour >= 17 && hour < 20) baseTemp = 28;
  else baseTemp = 26;

  return {
    temp: baseTemp,
    humidity: 60,
    description: "partly cloudy",
    icon: "02d",
    city: "Delhi",
  };
};
