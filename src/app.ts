import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import router from './routes'; 

const app: Application = express();

// ✅ আপডেট করা CORS কনফিগারেশন
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://localhost:5173",
    "https://ecospark-frontend-f5vj44lhg-md-kamruzzamans-projects-8608facf.vercel.app", // আপনার স্পেসিফিক ফ্রন্টএন্ড লিংক
    /\.vercel\.app$/ // সব ভেরসেল সাব-ডোমেইন সাপোর্ট করবে
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// API Routes
app.use('/api/v1', router); 

// Root Route
app.get('/', (req: Request, res: Response) => {
  res.send('Eco Spark Hub Server Running 🚀');
});

// 404 Handler (যদি রাউট খুঁজে না পায়)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found - ${req.originalUrl}`, // কোন ইউআরএল পাচ্ছে না সেটা দেখাবে
  });
});

// Global Error Handler (লগইন বা ডাটাবেজ এরর ডিবাগ করতে)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error Log:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong!",
    errorDetails: err,
  });
});

export default app;