import { Request, Response } from "express";
import { HealthCheckResponse } from "./HealthCheckResponse";
import dotenv from "dotenv";
import { Ollama } from "@langchain/ollama";

dotenv.config();

export const healthCheck = () => async (req: Request, res: Response) => {
  try {
    const memoryUsage = process.memoryUsage();

    const model = new Ollama({
      baseUrl: process.env.LM_MODEL_URL,
      model: process.env.LM_MODEL_NAME,
      temperature: parseInt(process.env.LM_MODEL_TEMPERATURE),
    });

    const healthCheckResponse: HealthCheckResponse = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      modelStatus: model ? "loaded" : "not_loaded",
      model: model
        ? {
            model: model.model,
            temperature: model.temperature,
            baseUrl: model.baseUrl,
          }
        : null,
      memory: {
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        free: Math.round(
          (memoryUsage.heapTotal - memoryUsage.heapUsed) / 1024 / 1024
        ),
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      },
    };

    res.status(200).json(healthCheckResponse);
  } catch (error) {
    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: "Service unavailable",
    });
  }
};
