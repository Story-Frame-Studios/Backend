import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDatabse from "./config/connectDatabse.js";
import indexRoute from "./routes/indexRoute.js";

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json()); 
const port = process.env.PORT || 4000;

app.use("/storyframestudio",indexRoute);


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
