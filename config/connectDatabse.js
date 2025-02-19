import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDatabse = () => {
  return mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

export default connectDatabse;
