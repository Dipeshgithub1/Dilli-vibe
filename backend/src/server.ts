import dotenv from "dotenv";
dotenv.config(); // 

import app from "./app";
import { connectDb } from "./config/db";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDb();

  app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
  });
};

startServer();
