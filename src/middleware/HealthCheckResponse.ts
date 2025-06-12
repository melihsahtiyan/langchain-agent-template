export interface HealthCheckResponse {
    status: string;
    timestamp: string;
    uptime: number;
    modelStatus?: string;
    model: any;
    memory: {
        total: number;
        free: number;
        used: number;
    };
}
