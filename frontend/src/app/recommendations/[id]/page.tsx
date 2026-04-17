"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../../lib/axios";
import ViewPlace from "../ViewPlace";
import AIThinkingLoader from "../../../../component/AIThinkingLoader";

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

  useEffect(() => {
    const fetchPlaceAndRelated = async () => {
      try {
        const [placeRes, relatedRes] = await Promise.all([
          api.get(`/recommendations/place/${placeId}`),
          api.get(`/recommendations/related/${placeId}?limit=3`),
        ]);

        setPlace(placeRes.data.data);
        setRelatedPlaces(relatedRes.data.data || []);
        setExplanation(placeRes.data.explanation || "");
        setBestTime(placeRes.data.bestTime || "");
      } catch (err) {
        console.error("Failed to fetch place", err);
        router.push("/recommendations");
      } finally {
        setLoading(false);
      }
    };

    if (placeId) {
      fetchPlaceAndRelated();
    }
  }, [placeId, router]);

  const handleBack = () => {
    router.push("/recommendations");
  };

  if (loading || !place) {
    return <AIThinkingLoader />;
  }

  return (
    <div>
      <ViewPlace
        place={place}
        explanation={explanation}
        bestTime={bestTime}
        onBack={handleBack}
      />

      {relatedPlaces.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 pb-10">
          <h2 className="text-xl font-semibold mb-6">Related Places</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedPlaces.map((related) => (
              <div
                key={related._id}
                onClick={() => router.push(`/recommendations/${related._id}`)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:border-white transition"
              >
                <img
                  src={related.image || "https://source.unsplash.com/400x300/?delhi,cafe"}
                  alt={related.name}
                  className="w-full h-24 object-cover rounded-lg mb-3"
                />
                <h3 className="font-medium text-sm">{related.name}</h3>
                <p className="text-xs text-zinc-500">{related.area}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}