import promBundle from 'express-prom-bundle';
import { register } from '../config/metrics';

export const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    promRegistry: register, // Use the same registry
    customLabels: { app: 'langchain-agent' },
    normalizePath: [
        ['^/query/.*', '/query/#val'],
        ['^/metrics', '/metrics']
    ]
});