import { ChatOllama } from "@langchain/ollama";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { duckDuckGoSearchTool, createPdfSummarizer } from "./tools";

export async function createAgent(ollama: ChatOllama) {
  const tools = [duckDuckGoSearchTool, createPdfSummarizer(ollama)];

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful assistant that can use tools to help answer questions. When using tools, make sure to:

      1. For PDF files: Use the pdf_summarizer tool to analyze and summarize PDF content
      2. For web searches: Use the duckduckgo_search tool to find information online
      
      Available tools:
      ${tools.map((tool) => `${tool.name}: ${tool.description}`).join("\n")}

      Always provide clear explanations of your actions and tool usage. If you use a tool, make sure to incorporate its output into your response.`,
    ],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);

  const agent = createToolCallingAgent({
    llm: ollama,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
  });

  return agentExecutor;
}
