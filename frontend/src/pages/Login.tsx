import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email: "teo@gmail.com",
        password: "password123",
      });

      console.log('Login success:', res.data);
      localStorage.setItem("token", res.data.data.token);
      navigate("/onboarding");
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      alert(`Login failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={handleLogin}
        className="bg-primary px-6 py-3 rounded-xl text-black"
      >
        Continue
      </button>
    </div>
  );
}
