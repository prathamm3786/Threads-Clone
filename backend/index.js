import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDb.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/UserRoutes.js";
import postRoutes from "./routes/PostRoutes.js";
import messageRoutes from "./routes/MessageRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import {app,server} from "./socket/socket.js";
import cors from "cors";
dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages",messageRoutes);

server.listen(PORT, () => console.log("Server is running on port"));
