import path from "path";
import express from "express";
import fs from 'fs'; // Import the fs module
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

const __dirname = path.dirname(new URL(import.meta.url).pathname);


import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";

import connectMongoDB from "./db/connectMongoDB.js";


const envPath = path.join(__dirname, "../.env");
dotenv.config({ path: envPath });

// dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("Loading .env from:", path.join(__dirname, "../.env")); // Log the path to check if it's correct


console.log("Mongo URI:", process.env.MONGO_URI || "MONGO_URI not set");



console.log("Loading .env from:", envPath);
console.log("Does .env exist?", fs.existsSync(envPath)); // Check if the file exists

// Check if MONGO_URI is loaded
console.log("Mongo URI:", process.env.MONGO_URI || "MONGO_URI not set");


cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;
//const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" })); // to parse req.body
// limit shouldn't be too high to prevent DOS
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});
