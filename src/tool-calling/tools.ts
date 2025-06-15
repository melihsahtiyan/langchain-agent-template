import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatOllama } from "@langchain/ollama";
import splitTextIntoChunks from "../rag/embedder";

// DuckDuckGo search tool
export const duckDuckGoSearchTool = new DynamicStructuredTool({
  name: "duckduckgo_search",
  description:
    "Searches the web using DuckDuckGo and returns relevant results. Use this tool when you need to find information online.",
  schema: z.object({
    query: z.string().describe("Search query to find information"),
  }),
  func: async ({ query }) => {
    try {
      console.log("Starting DuckDuckGo search for query:", query);
      const searchTool = new DuckDuckGoSearch();
      const searchResults = await searchTool.invoke(query);
      
      if (!searchResults || !Array.isArray(searchResults) || searchResults.length === 0) {
        console.log("No valid search results found for query:", query);
        return "No results found for your search query.";
      }

      console.log(`Found ${searchResults.length} results for query:`, query);
      
      const formattedResults = searchResults
        .filter(result => result && typeof result === 'object')
        .map((result) => ({
          title: result.title || "No title",
          link: result.link || "No link",
          snippet: result.snippet || "No description available",
        }));

      if (formattedResults.length === 0) {
        return "No valid results could be processed from the search.";
      }

      return formattedResults;
    } catch (error) {
      console.error("Search error:", error);
      return "An error occurred while searching the web. Please try again later.";
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

        const textSplitter = await splitTextIntoChunks(docs[0]);
        const summary = await ollama.invoke(
          `Please provide a clear and concise summary of the following text in English. Focus on the main points and key information:\n\n${textSplitter[0].pageContent}`
        );

        return summary.content;
      } catch (error) {
        console.error("PDF summarization error:", error);
        return "An error occurred while summarizing the PDF.";
      }
    },
  });
