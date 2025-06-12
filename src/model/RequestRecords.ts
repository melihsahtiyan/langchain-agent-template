import { Schema } from "mongoose";

type ObjectId = Schema.Types.ObjectId;

export class RequestRecord {
  id: ObjectId;
  body: string;
  filePath: string;
  isSuccess: boolean;
  createdOnUtc: Date;

  constructor(body: string, filePath: string, isSuccess: boolean) {
    this.body = body;
    this.filePath = filePath;
    this.isSuccess = isSuccess;
    this.createdOnUtc = new Date(Date.now());
  }
}
