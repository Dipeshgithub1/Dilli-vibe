"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../../lib/axios";
import ViewPlace from "../ViewPlace";
import AIThinkingLoader from "../../../../component/AIThinkingLoader";
import toast from "react-hot-toast";
import { useWeather } from "../../../../lib/useWeather";

interface Place {
  _id: string;
  name: string;
  description: string;
  area: string;
  moods: string[];
  suitableFor: string[];
  budgetPreference: string;
  rating?: number;
  image?: string;
}

export default function PlaceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const placeId = params.id as string;

  const [place, setPlace] = useState<Place | null>(null);
  const [relatedPlaces, setRelatedPlaces] = useState<Place[]>([]);
  const [explanation, setExplanation] = useState<string>("");
  const [bestTime, setBestTime] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allPlaceIds, setAllPlaceIds] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Weather based on place area
  const { weather, loading: weatherLoading, error: weatherError } = useWeather(place?.area || "Delhi");

    // Fetch place details
    useEffect(() => {
      const fetchPlace = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/recommendations/place/${placeId}`);
          const { data, explanation, bestTime } = response.data;
          setPlace(data);
          setExplanation(explanation);
          setBestTime(bestTime);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch place:", error);
          setLoading(false);
          toast.error("Failed to load place details");
        }
      };

      fetchPlace();
    }, [placeId]);

    // Fetch related places
    useEffect(() => {
      if (!placeId) return;
      const fetchRelated = async () => {
        try {
          const response = await api.get(`/related/${placeId}`);
          setRelatedPlaces(response.data.data || []);
        } catch (error) {
          console.error("Failed to fetch related places:", error);
        }
      };

      fetchRelated();
    }, [placeId]);

  const getFavorites = (): Place[] => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  };

  useEffect(() => {
    if (!place) return;
    const favs = getFavorites();
    setIsFavorite(favs.some((p: Place) => p._id === place._id));
  }, [place]);

  const toggleFavorite = () => {
    if (!place) return;
    const favs = getFavorites();
    const exists = favs.some((p: Place) => p._id === place._id);
    let updated: Place[];

    if (exists) {
      updated = favs.filter((p: Place) => p._id !== place._id);
      toast.success(`Removed ${place.name} from favorites`);
    } else {
      updated = [...favs, place];
      toast.success(`Saved ${place.name} to favorites ❤️`);
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!exists);
    window.dispatchEvent(new Event("storage"));
  };

  const sharePlace = async () => {
    if (!place) return;

    const shareText = `Check out ${place.name} in ${place.area}! ${place.description.substring(0, 100)}... 🎯 ${place.budgetPreference} budget • ${place.moods.join(", ")}`;
    const shareUrl = `${window.location.origin}/recommendations/${place._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        if (err !== "AbortError") {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied to clipboard 📋");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleBack = () => {
    router.push("/recommendations");
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      router.push(`/recommendations/${allPlaceIds[currentIndex - 1]}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < allPlaceIds.length - 1) {
      router.push(`/recommendations/${allPlaceIds[currentIndex + 1]}`);
    }
  };

  // Save to recently viewed
  useEffect(() => {
    if (!place) return;
    try {
      const recent = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const filtered = recent.filter((p: Place) => p._id !== place._id);

      // Save full place data with all needed fields
      const placeData = {
        _id: place._id,
        name: place.name,
        area: place.area,
        image: place.image,
        moods: place.moods,
        budgetPreference: place.budgetPreference,
        suitableFor: place.suitableFor,
        rating: place.rating,
      };

      const updated = [placeData, ...filtered].slice(0, 5);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Failed to save recently viewed", err);
    }
  }, [place]);

  if (loading && !place) {
    return <AIThinkingLoader />;
  }

  return (
    <div>
      {place && (
        <ViewPlace
          place={place}
          explanation={explanation}
          bestTime={bestTime}
          onBack={handleBack}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < allPlaceIds.length - 1}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          weather={weather}
          weatherLoading={weatherLoading}
          weatherError={weatherError}
          onShare={sharePlace}
        />
      )}

      {relatedPlaces.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 pb-10">
          <h2 className="text-xl font-semibold mb-6">You may also like ✨</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedPlaces.map((related) => (
              <div
                key={related._id}
                onClick={() => router.push(`/recommendations/${related._id}`)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:border-white transition"
              >
                <img
                  src={related.image || `https://picsum.photos/seed/${related._id}/400/300`}
                  alt={related.name}
                  className="w-full h-24 object-cover rounded-lg mb-3"
                />
                <h3 className="font-medium text-sm group-hover:text-orange-400 transition">{related.name}</h3>
                <p className="text-xs text-zinc-500">{related.area}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}