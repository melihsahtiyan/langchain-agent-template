import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";

export async function splitTextIntoChunks(
  text: string
): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const createdDocument: Document[] = await splitter.createDocuments([text]);

  console.log(
    `Text split into ${createdDocument.length} chunks with size ${splitter.chunkSize} and overlap ${splitter.chunkOverlap}`
  );

  return createdDocument;
}

export async function splitDocsIntoChunks(
  document: Document
): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const createdDocument: Document[] = await splitter.createDocuments([document.pageContent]);

  console.log(
    `Text split into ${createdDocument.length} chunks with size ${splitter.chunkSize} and overlap ${splitter.chunkOverlap}`
  );

  return createdDocument;
}
