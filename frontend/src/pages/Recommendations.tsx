import { useEffect, useState } from "react";
import api from "../api/axios";
import RecommendationCard from "../component/RecommendationCard";

export default function Recommendations() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    api.get("/recommendations").then((res) => {
      setData(res.data.data);
    });
  }, []);

  return (
    <div className="p-6 space-y-4">
      {data.map((place) => (
        <RecommendationCard key={place._id} place={place} />
      ))}
    </div>
  );
}
