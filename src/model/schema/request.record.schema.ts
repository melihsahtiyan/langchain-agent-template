import mongoose, { Schema } from "mongoose";
import { RequestRecord } from "../RequestRecords";

export type RequestRecordDoc = mongoose.Document & RequestRecord;

export const RequestRecordSchema = new mongoose.Schema<RequestRecordDoc>({
  body: { type: String, required: true },
  filePath: { type: String, required: false, default: "" },
  isSuccess: { type: Boolean, required: true, default: false },
  createdOnUtc: { type: Date, default: Date.now },
});

const requestRecords = mongoose.model<RequestRecordDoc>(
  "request.records",
  RequestRecordSchema
);

export { requestRecords };
