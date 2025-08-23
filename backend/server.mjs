// server.mjs
import express from "express";
import dotenv from "dotenv";
import connectDB from "./dbconnect.mjs";
import cors from "cors";   // ✅ Add cors

import userRoutes from "./routes/userRoutes.mjs";
import groupRoutes from "./routes/groupRoutes.mjs";
import messageRoutes from "./routes/messageRoutes.mjs";

dotenv.config();
const app = express();

// ✅ Middleware to parse JSON
app.use(cors());           // ✅ Enable CORS (default allows all origins)

app.use(express.json());

// ✅ Connect Database
connectDB();

// ✅ Routes
app.use("/api/auth", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Home route
app.get("/", (req, res) => {
  res.send("🚀 Chat App API is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
