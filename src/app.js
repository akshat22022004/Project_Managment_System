import express from "express";
import cors from "cors";

const app = express();

// basic configurations
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({limit: "16kb"}))
app.use(express.static("public")) // to use my  static files 


//cors configurations
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
    credentials: true,
    method: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
 // import the routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.route.js";

app.use("/api/v1/auth", authRouter);
app.use(express.json());
app.use("/api/v1/healthcheck", healthCheckRouter);

app.get("/", (req, res) => {
    res.send("Hello World")
})
export default app
