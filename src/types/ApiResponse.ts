import { Schema } from "mongoose";

type ObjectId = Schema.Types.ObjectId;

export interface ApiResponse<T = any> {
    statusCode: number;
    message: string;
    jobId?: string;
    data?: T;
}