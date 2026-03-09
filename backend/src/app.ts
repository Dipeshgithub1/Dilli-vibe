import express from "express"
import cors  from "cors";
import authRoutes from "./routes/auth.routes"
import userRoute from "./routes/user.routes"
import recommendationRoutes from "./routes/recommendation.routes";

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

//auth register login me logout
app.use("/api/auth",authRoutes)

//user  onboarding
app.use("/api/users",userRoute)

//users gets recommended
app.use("/api/recommendations", recommendationRoutes);

app.get("/",(req,res) => {
   res.send("Welcome to Dilli-Vibe API 🚀");
})

export default app;