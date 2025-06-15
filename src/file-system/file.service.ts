import { v4 as uuidv4 } from "uuid";
import IFileService from "./IFileService";
import fs from "fs/promises";
import path from "path";
import { Document } from "langchain/document";
import pdfParse from "pdf-parse";
import OperationalError from "../middleware/OperationalError";

export default class FileService implements IFileService {
  private readonly uploadDir: string;

  constructor() {
    // Define upload directory relative to project root
    this.uploadDir = path.join(process.cwd(), "uploads");
    this.ensureUploadDirectory();
  }
  async extractPdfText(
    file: Express.Multer.File
  ): Promise<{ filePath: string; doc: Document }> {
    const filePath = await this.handleUpload(file, "invoices");
    const fullPath = path.join(process.cwd(), "uploads", filePath);

    const fileBuffer = await fs.readFile(fullPath);
    const pdfData = await pdfParse(fileBuffer);

    let cleanedText = pdfData.text
      .replace(/\r/g, "")
      .replace(/\t/g, " ")
      .replace(/[\u200B\uFEFF]/g, "") // zero-width characters
      .replace(/\s{2,}/g, " ") // collapse multiple spaces
      .replace(/\n{2,}/g, "\n") // collapse multiple newlines
      .trim();

    // Remove known footer-like patterns (adjust as needed)
    const footerPatterns = [
      /IBAN.*?(?=\n|$)/gi,
      /T[ae]slim [AE]lan.*?(?=\n|$)/gi,
      /Web Sitesi:.*?(?=\n|$)/gi,
      /Fax:.*?(?=\n|$)/gi,
      /E-Posta:.*?(?=\n|$)/gi,
      /TICARETSICILNO:.*?(?=\n|$)/gi,
      /\b\d{2,}[.,]?\d*\s*(TRY|TL|USD|EUR)\b/gi, // trailing currency leftovers
    ];
    for (const pattern of footerPatterns) {
      cleanedText = cleanedText.replace(pattern, "");
    }

    cleanedText = cleanedText.trim();

    return {
      filePath: fullPath,
      doc: new Document({
        pageContent: cleanedText,
        metadata: {
          source: filePath,
          numpages: pdfData.numpages,
        },
      }),
    };
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async handleUpload(
    file: Express.Multer.File,
    folder: string
  ): Promise<string> {
    try {
      if (!file) {
        throw new OperationalError("No file provided", 400);
      }

      const folderPath = path.join(this.uploadDir, folder);
      await fs.mkdir(folderPath, { recursive: true });

      // Get file extension from original name
      const fileExt = path.extname(file.originalname);
      // Generate random filename with original extension
      const uniqueFileName = `${uuidv4()}${fileExt}`;
      const filePath = path.join(folderPath, uniqueFileName);

      // Move the file from temp location to target location
      await fs.writeFile(filePath, file.buffer);

      console.log(`File uploaded to: ${filePath}`);

      // Return the full path of the saved file
      return filePath;
    } catch (error) {
      throw new OperationalError(`File upload failed: ${error.message}`, 500);
    }
  }

  async handleDelete(filePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.uploadDir, filePath);

      // Check if file exists
      await fs.access(fullPath);

      // Delete the file
      await fs.unlink(fullPath);

      // Try to remove empty folder
      const folder = path.dirname(fullPath);
      const files = await fs.readdir(folder);
      if (files.length === 0) {
        await fs.rmdir(folder);
      }

      return true;
    } catch (error) {
      if (error.code === "ENOENT") {
        throw new OperationalError("File not found", 404);
      }
      throw new OperationalError(`File deletion failed: ${error.message}`, 500);
    }
  }
}
