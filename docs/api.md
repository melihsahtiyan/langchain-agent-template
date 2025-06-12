# API Documentation

This document provides detailed information about the API endpoints available in the LangChain Agent Template.

## Base URL

All API endpoints are relative to the base URL: `http://localhost:7070`

## Authentication

Currently, the API does not implement authentication. This should be added for production use.

## Endpoints

### Chat API

#### Send a Message

Sends a message to the LLM agent and retrieves a response.

- **URL**: `/api/chat`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:

```json
{
  "message": "Your message here",
  "sessionId": "unique-session-id"
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `message` | string | The message to send to the LLM agent |
| `sessionId` | string | A unique identifier for the chat session |

**Response**:

```json
{
  "response": "The LLM agent's response",
  "sessionId": "unique-session-id"
}
```

**Example**:

```bash
curl -X POST http://localhost:7070/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What can you tell me about LangChain?",
    "sessionId": "user123-session456"
  }'
```

### Health and Monitoring

#### Health Check

Check if the service is running properly.

- **URL**: `/health`
- **Method**: `GET`

**Response**:

```json
{
  "status": "ok",
  "timestamp": "2023-06-12T14:32:10.123Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "llm": "available"
  }
}
```

#### Prometheus Metrics

Retrieve metrics for monitoring.

- **URL**: `/metrics`
- **Method**: `GET`

**Response**: Prometheus-formatted metrics text

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests:

- `200 OK`: The request was successful
- `400 Bad Request`: The request was invalid or missing required parameters
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An error occurred on the server

Error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "A human-readable error message"
  }
}
```

## Rate Limiting

Currently, there are no rate limits implemented. Consider adding rate limiting for production use.

## Versioning

The current API version is v1. All endpoints are prefixed with `/api`. 