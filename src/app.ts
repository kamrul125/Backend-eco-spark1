import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // ✅ এটি অবশ্যই লাগবে যদি credentials: true ব্যবহার করেন
import router from "./routes";

const app: Application = express();

// ✅ ১. CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://eco-spark-hub.vercel.app", // 👈 আপনার ফ্রন্টএন্ডের আসল লাইভ লিঙ্কটি এখানে দিন
    ],
    credentials: true, // ✅ কুকি বা টোকেন আদান-প্রদানের জন্য এটি জরুরি
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
  })
);

// ✅ ২. Middlewares
app.use(cookieParser()); // ✅ কুকি রিড করার জন্য এটি লাগবেই
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ ৩. API Routes
app.use("/api/v1", router);

// ✅ ৪. Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "🚀 Eco Spark Hub Backend Running Perfectly",
  });
});

// ✅ ৫. 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route Not Found: ${req.originalUrl}`,
  });
});

// ✅ ৬. Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  const message = err.message || "Something went wrong!";

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err : null, // প্রোডাকশনে এরর ডিটেইলস হাইড করা থাকবে
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
});

export default app;