import express from "express";
import authRoutes from "./route/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app=express();

app.use(express.json()); //middleware to read JSON
app.use(cookieParser()); //able to read cookies

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth",authRoutes);

app.get("/", (_req, res) => {
  res.send("API is running 🚀");
});


export default app;