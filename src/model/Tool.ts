import { ToolCall } from "@langchain/core/dist/messages/tool";


export interface Tool {
    name: string;
    description: string;
    func: (input: string) => Promise<string>;
}

export interface ToolResponse {
    tool_calls: ToolCall[];
}