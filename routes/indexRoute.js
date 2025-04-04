import express from "express";
import authenticationRoute from "./authenticationRoute.js";
import userRoutes from "./userRoute.js";
import jobRoutes from "./jobRoutes.js";
import applicationRoute from "./applicationRoute.js";
const router = express.Router();

// Mount authentication and user routes with the prefix '/auth' and '/users'
router.use("/auth", authenticationRoute);
router.use("/users", userRoutes);
router.use("/jobPosting",jobRoutes);
router.use("/application",applicationRoute);

export default router;
