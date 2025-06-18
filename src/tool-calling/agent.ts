import { ChatOllama } from "@langchain/ollama";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { duckDuckGoSearchTool, createPdfSummarizer, googleSearchTool } from "./tools";

export async function createAgent(ollama: ChatOllama) {
  const tools = [googleSearchTool, createPdfSummarizer(ollama)];

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful assistant that can use tools to help answer questions. 
      When using tools, make sure to use them effectively and only when necessary.

      You can use google-search for the data you need such as datas didn't exist in the knowledge base or when you need to find the latest information.
      
      
      Available tools:
      ${tools.map((tool) => `${tool.name}: ${tool.description}\n`)}

      Always provide clear explanations of your actions and tool usage. 
      If you use a tool, make sure to incorporate its output into your response.
      If you cannot answer the question, respond with "I don't know".
      After using a tool, reformat the output.`,
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
