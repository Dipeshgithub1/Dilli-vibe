import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

  const completeOnboarding = async () => {
    await api.patch("/users/onboarding", {
      preferredVibes: ["chill", "food"],
      budgetPreference: "medium",
      companyType: "friends",
    });

    navigate("/recommendations");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Tell us your vibe</h1>
      <button
        onClick={completeOnboarding}
        className="bg-primary px-4 py-2 rounded"
      >
        Show recommendations
      </button>
    </div>
  );
}
