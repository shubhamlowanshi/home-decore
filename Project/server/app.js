import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import buyerRoutes from "./routes/buyer.routes.js";
import emailRoutes from "./routes/email.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log(
  "Google API key loaded:",
  Boolean(process.env.GOOGLE_API_KEY)
);

console.log(
  "Google API key prefix:",
  process.env.GOOGLE_API_KEY
    ? `${process.env.GOOGLE_API_KEY.slice(0, 8)}...`
    : "MISSING"
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Running"
  });
});

app.use("/api/buyers", buyerRoutes);
app.use("/api/email", emailRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();