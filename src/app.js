import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import mainRoutes from "./Routes/file_route.js";

import { configDotenv } from "dotenv";
configDotenv();

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", mainRoutes);

app.listen(PORT, () => {
  console.log("Server is Running on Port", PORT);
  mongoose.connect(uri);
  console.log("DB Connected");
});
