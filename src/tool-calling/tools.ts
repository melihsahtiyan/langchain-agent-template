import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import {
  DuckDuckGoSearch,
  SafeSearchType,
} from "@langchain/community/tools/duckduckgo_search";
import { GoogleCustomSearch } from "@langchain/community/tools/google_custom_search";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatOllama } from "@langchain/ollama";
import { splitDocsIntoChunks } from "../rag/embedder";
import dotenv from "dotenv";

dotenv.config();

// DuckDuckGo search tool
export const duckDuckGoSearchTool = new DynamicStructuredTool({
  name: "duckduckgo-search",
  description:
    "Search the web using DuckDuckGo. Use this tool when you need to find current information, news, or facts from the internet.",
  schema: z.object({
    query: z.string().describe("The search query to look up on DuckDuckGo"),
  }),
  func: async ({ query }) => {
    try {
      const searchTool = new DuckDuckGoSearch({
        maxResults: 5,
      });

      const results = await searchTool.invoke(query);

      if (!results || results.length === 0) {
        return "No results found for your query.";
      }

      return results;
    } catch (error) {
      console.error("DuckDuckGo search error:", error);

      return "An error occurred while searching. The search service may be temporarily unavailable.";
    }
  },
});

export const googleSearchTool = new DynamicStructuredTool({
  name: "google-search",
  description:
    "Search the web using Google Custom Search API. Use this tool when you need to find current information, news, or facts from the internet.",
  schema: z.object({
    query: z.string().describe("The search query to look up on Google"),
  }),
  func: async ({ query }) => {
    try {
      if (!process.env.GOOGLE_SEARCH_API_KEY || !process.env.GOOGLE_CSE_ID) {
        return "Google search is not configured. Please set GOOGLE_SEARCH_API_KEY and GOOGLE_CSE_ID environment variables.";
      }

      console.log(
        "----------------------------------------------------------------------------"
      );
      console.log("Google search query:", query);
      console.log(
        "----------------------------------------------------------------------------"
      );

      const searchTool = new GoogleCustomSearch({
        apiKey: process.env.GOOGLE_SEARCH_API_KEY,
        googleCSEId: process.env.GOOGLE_CSE_ID,
      });

      const results = await searchTool.invoke(query);

      if (!results || results.length === 0) {
        return "No results found for your query.";
      }

      return results;
    } catch (error) {
      console.error("Google search error:", error);
      return "An error occurred while searching with Google.";
    }
  },
});

// PDF summarizer tool
export const createPdfSummarizer = (ollama: ChatOllama) =>
  new DynamicStructuredTool({
    name: "pdf_summarizer",
    description:
      "Summarizes a PDF file and returns a clear, concise summary of its contents. Use this tool when you need to understand the content of a PDF document.",
    schema: z.object({
      filePath: z.string().describe("Path to the PDF file"),
    }),
    func: async ({ filePath }) => {
      try {
        const loader = new PDFLoader(filePath);
        const docs = await loader.load();

        // Process all pages of the PDF
        const allChunks = await Promise.all(
          docs.map(async (doc) => {
            const chunks = await splitDocsIntoChunks(doc);
            return chunks;
          })
        );

        // Flatten the array of chunks and join their content
        const combinedContent = allChunks
          .flat()
          .map((chunk) => chunk.pageContent)
          .join("\n\n");

        const summary = await ollama.invoke(
          `Please provide a clear and concise summary of the following text in the requested language. Focus on the main points and key information:\n\n${combinedContent}`
        );

        return summary.content;
      } catch (error) {
        console.error("PDF summarization error:", error);
        return "An error occurred while summarizing the PDF.";
      }
    },
  });

// Get current date tool
export const getCurrentDateTool = new DynamicStructuredTool({
  name: "get_current_date",
  description:
    "Returns the current date and time information. Use this tool when you need to know the current date or time.",
  schema: z.object({}),
  func: async () => {
    try {
      const now = new Date();
      return {
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        timestamp: now.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }.toString();
    } catch (error) {
      console.error("Error getting current date:", error);
      return "An error occurred while getting the current date.";
    }
  },
});
