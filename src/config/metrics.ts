import client from 'prom-client';

// Create a single Registry instance
export const register = new client.Registry();

// Add default metrics
client.collectDefaultMetrics({ register });

// Custom metrics
export const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5],
});

export const modelInferenceDuration = new client.Histogram({
    name: 'model_inference_duration_seconds',
    help: 'Duration of model inference in seconds',
    labelNames: ['model_type'],
    buckets: [0.1, 0.5, 1, 2, 5, 10],
    registers: [register]
});

export const modelMemoryUsage = new client.Gauge({
    name: 'model_memory_usage_bytes',
    help: 'Memory usage of the model in bytes',
    labelNames: ['model_type'],
    registers: [register]
});