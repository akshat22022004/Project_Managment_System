import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.js";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB(); // connect to MongoDB first
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to database", err);
    process.exit(1);
  }
};

startServer();
