"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../../lib/axios";
import ViewPlace from "../ViewPlace";
import AIThinkingLoader from "../../../../component/AIThinkingLoader";
import toast from "react-hot-toast";

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

  useEffect(() => {
    if (!placeId) return;

    const fetchPlaceAndRelated = async () => {
      try {
        setLoading(true);

        const storedIds = localStorage.getItem("recommendationPlaceIds");
        let placeIds = storedIds ? JSON.parse(storedIds) : [];

        if (placeIds.length === 0 || !placeIds.includes(placeId)) {
          const searchText = localStorage.getItem("lastSearch") || "";
          const allRes = await api.post("/recommendations?page=1&limit=100", { searchText });
          const allPlaces = allRes.data.data || [];
          placeIds = allPlaces.map((p: Place) => p._id);
          localStorage.setItem("recommendationPlaceIds", JSON.stringify(placeIds));
        }

        const idx = placeIds.indexOf(placeId);
        const [placeRes, relatedRes] = await Promise.all([
          api.get(`/recommendations/place/${placeId}`),
          api.get(`/recommendations/related/${placeId}?limit=3`),
        ]);

        setPlace(placeRes.data.data);
        setRelatedPlaces(relatedRes.data.data || []);
        setExplanation(placeRes.data.explanation || "");
        setBestTime(placeRes.data.bestTime || "");
        setCurrentIndex(idx >= 0 ? idx : 0);
        setAllPlaceIds(placeIds);
      } catch (err) {
        console.error("Failed to fetch place", err);
        router.push("/recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceAndRelated();
  }, [placeId, router]);

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

  if (loading && !place) {
    return <AIThinkingLoader />;
  }

  return (
    <div>
      {place &&(
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