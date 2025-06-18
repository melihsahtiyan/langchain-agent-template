# General Troubleshooting Guide

This document covers common issues and solutions for running and developing with the LangChain Agent Template.

## Installation Issues

- **Node.js version**: Ensure you are using Node.js v16 or higher.
- **Dependency errors**: Run `npm install --save` to install all dependencies. Delete `node_modules` and `package-lock.json` if issues persist, then reinstall.

## Docker Issues

- **Containers not starting**: Run `docker-compose down -v` to remove volumes, then `docker-compose up` again.
- **Port conflicts**: Make sure ports 7070 (Express), 11434 (Ollama), 27017 (MongoDB), and 5432 (PostgreSQL) are not in use by other processes.

## MongoDB Issues

- **Authentication failed**: Check your `MONGODB_URI` in the `.env` file. Default user/pass is `admin`/`admin`.
- **Data not persisting**: Ensure the `mongo-data/` volume is not being deleted between runs.

## ChromaDB Issues

- **ChromaDB not starting**: Check Docker logs for errors. Ensure the `chroma_data/` directory is writable.
- **Vector store errors**: Make sure your embeddings and documents are formatted correctly.

## LLM Connectivity

- **Ollama not reachable**: Ensure the Ollama container is running and accessible at the URL in `LM_MODEL_URL`.
- **Model not found**: Check that the model name in `LM_MODEL_NAME` matches an available Ollama model.

## Other Issues

- **Environment variables**: Double-check your `.env` and `.env.docker` files for typos or missing values.
- **Logs**: Check application logs for error messages and stack traces.

## Still Stuck?

- See the [DuckDuckGo Search Troubleshooting](./duckduckgo-troubleshooting.md) for search-specific issues.
- Open an issue or discussion on the project repository for further help. 