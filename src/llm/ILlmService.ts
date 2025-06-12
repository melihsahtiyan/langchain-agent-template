export default interface ILlmService {
  invokeLlm(prompt: string): Promise<string>;
  invokeWithRetrieval(userPrompt: string, companyName: string): Promise<string>;
}
