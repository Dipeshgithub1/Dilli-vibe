import { motion } from "framer-motion";

export default function RecommendationCard({ place }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 p-4 rounded-xl"
    >
      <h3 className="text-lg font-semibold">{place.name}</h3>
      <p className="text-sm text-zinc-400">{place.area}</p>
      <p className="mt-2 text-sm">{place.description}</p>
    </motion.div>
  );
}
