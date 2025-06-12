import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import logger from "./middleware/loggingHandler";
import { healthCheck } from "./middleware/healthcheck";
import { collectDefaultMetrics } from "prom-client";
import cors from "cors";
import { errorHandlingMiddleware } from "./middleware/errorHandling";
import { register } from "./config/metrics";
import { connectToDatabase } from "./config/database";
import chatRoutes from "./chat/chat.routes";

// Load environment variables
dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT || "3000", 10);

// Initialize Prometheus metrics collection
collectDefaultMetrics();

const corsOptions = {
  //TODO: Change origin to your domain
  origin: "*",
  methods: "GET, POST, PUT, PATCH, DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));

// Initialize middlewares
app.use(errorHandlingMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  logger.info(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.body,
  });
  next();
});

// Health check endpoints
app.get("/health", healthCheck());

// Metrics endpoint for Prometheus
app.get("/metrics", async (req: Request, res: Response) => {
  try {
    const metrics = await register.metrics();
    res.set("Content-Type", register.contentType);
    res.send(metrics);
  } catch (error) {
    logger.error("Error collecting metrics", { error });
    res.status(500).send("Error collecting metrics");
  }
});

app.use('/api/chat', chatRoutes); 

// Start server
const startServer = async () => {
  try {
    app.listen(port, "0.0.0.0", async () => {
      logger.info("Initializing database connection...");

      // Connect to MongoDB using our connection function
      await connectToDatabase();
      
      logger.info(`Server is running on http://0.0.0.0:${port}`);

      // Check if the model is loaded
      healthCheck();
    });
  } catch (error) {
    logger.error("Error starting the server:", { error });
    process.exit(1);
  }
};

startServer();

export default app;
