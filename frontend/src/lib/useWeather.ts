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
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 30 * 60 * 1000) { // 30 min cache
          setWeather(parsed.data);
          setLoading(false);
          return;
        }
      }

      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        if (!apiKey) {
          setError("Weather API key not configured");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!res.ok) throw new Error("Weather fetch failed");

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
      } catch (err) {
        setError("Failed to load weather");
        console.error("Weather error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  return { weather, loading, error };
};
