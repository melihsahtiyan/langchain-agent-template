#!/bin/bash

# Start Ollama in the background.
/bin/ollama serve &
pid=$!

# Wait for the server to start
sleep 5

# Model name
MODEL_NAME="LM_MODEL_NAME"

EMBEDDING_MODEL="EMBEDDING_MODEL_NAME"

# Check if model is already pulled
if ollama list | grep -q "$MODEL_NAME"; then
  echo "🟢 LM Model '$MODEL_NAME' already exists. Skipping pull."
else
  echo "🔴 Pulling model '$MODEL_NAME'..."
  ollama pull "$MODEL_NAME"
  echo "🟢 Done!"
fi

if ollama list | grep -q "$EMBEDDING_MODEL"; then
  echo "🟢 Embedding Model '$EMBEDDING_MODEL' already exists. Skipping pull."
else
  echo "🔴 Pulling embedding model '$EMBEDDING_MODEL'..."
  ollama pull "$EMBEDDING_MODEL"
  echo "🟢 Done!"
fi

# Wait for Ollama process to finish.
wait $pid
