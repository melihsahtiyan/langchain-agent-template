import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { VectorStoreRetriever } from "@langchain/core/vectorstores";
import { systemPrompt } from "../llm/prompt.builder";

/**
 * Fetches context from retriever and builds a prompt string
 */
export async function prepareRagPrompt(
  retriever: VectorStoreRetriever<Chroma>,
  userPrompt: string,
  companyName: string
): Promise<string> {
  console.log(
    "---------------------------------------------------------------"
  );

  console.log("Preparing RAG prompt...");

  const docs = await retriever._getRelevantDocuments(userPrompt);

  const context = docs.map((doc) => doc.pageContent).join("\n\n");

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt(companyName)],
    ["human", "{input}"],
  ]);

  const formattedPrompt = await promptTemplate.format({
    input: `${userPrompt}\n\nContext:\n${context}`,
  });

  console.log("Formatted RAG prompt.");
  console.log(
    "---------------------------------------------------------------"
  );

  return formattedPrompt;
}
