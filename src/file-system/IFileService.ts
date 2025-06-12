import { Document } from "langchain/document";

export default interface IFileService {
  extractPdfText(
    file: Express.Multer.File
  ): Promise<{ filePath: string; doc: Document }>;
  handleUpload(file: Express.Multer.File, folder: string): Promise<string>;
  handleDelete(path: string): Promise<boolean>;
}
