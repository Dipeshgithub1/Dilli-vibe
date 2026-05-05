import express from "express"
import cookieParser from "cookie-parser";
import cors  from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes"
import userRoute from "./routes/user.routes"
import recommendationRoutes from "./routes/recommendation.routes";



const app = express();
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

app.use(cookieParser());

app.use(express.json({limit: "10kb"}));

//auth register login me logout
app.use("/api/auth",authRoutes)

//user  onboarding
app.use("/api/users",userRoute)

//users gets recommended
app.use("/api/recommendations", recommendationRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.get("/",(req,res) => {
   res.send("Welcome to Dilli-Vibe API 🚀");
})

export default app;