# Frequently Asked Questions (FAQ)

## General

**Q: How do I start the project?**
A: Follow the steps in the README for environment setup and use `docker-compose up` for a full stack run.

**Q: What LLMs are supported?**
A: Any model supported by Ollama (e.g., llama3, mistral, gemma, phi). See the README for details.

## Development

**Q: How do I add a new tool?**
A: Implement your tool in `src/tool-calling/tools.ts` and register it in `src/tool-calling/agent.ts`.

**Q: How do I change the LLM provider?**
A: Update the implementation in `src/llm/llm.service.ts` and adjust environment variables as needed.

**Q: What to do if ChromaDB fails to start?**
A: Check Docker logs, ensure the `chroma_data/` directory is writable, and that no other process is using the port.

## Troubleshooting

**Q: Why do I get MongoDB authentication errors?**
A: Check your `MONGODB_URI` and ensure the credentials match those in your Docker Compose file.

**Q: Where can I find more help?**
A: See the troubleshooting docs or open an issue on GitHub. 