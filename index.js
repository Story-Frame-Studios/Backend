import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDatabse from "./config/connectDatabse.js";
import indexRoute from "./routes/indexRoute.js";
import Redis from "ioredis";

dotenv.config();

// Redis client setup
let redisClient = null;
const REDIS_ENABLED = process.env.REDIS_ENABLED === "true";

if (REDIS_ENABLED) {
  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    });
    
    redisClient.on('connect', () => {
      console.log('Redis client connected');
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
      redisClient = null; // Set to null to trigger fallback
    });
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    redisClient = null;
  }
}

// Make Redis client available throughout the app
export const getRedisClient = () => redisClient;
export const isRedisCachingEnabled = () => REDIS_ENABLED && redisClient !== null;

const app = express();
app.use(cors());
app.use(express.json()); 
const port = process.env.PORT || 4000;

app.use("/storyframestudio", indexRoute);

// Database connection first
connectDatabse()
  .then(() => {
    console.log("Database connected successfully");

     
    app.use(cookieParser());

    app.get("/", (req, res) => {
      res.send("Hello, world!");
    }); 

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err.message);
    process.exit(1); // Exit if database connection fails
  });
