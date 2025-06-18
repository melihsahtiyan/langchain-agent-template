# DuckDuckGo Search Troubleshooting

## Known Issue

The DuckDuckGo search tool occasionally fails with this error:

```
TypeError: Cannot read properties of null (reading '1')
```

This error occurs in the `duck-duck-scrape` library when it fails to parse DuckDuckGo's search results properly.

## Causes

- DuckDuckGo changes their HTML structure
- Rate limiting from DuckDuckGo
- Network connectivity issues
- Outdated scraping patterns

## Solution Implemented

### Enhanced Error Handling

The DuckDuckGo search tool now includes:

1. **Retry Logic**: Up to 3 attempts with 2-second delays between retries
2. **Better Error Messages**: Clear feedback when search fails
3. **Graceful Degradation**: Returns a helpful message instead of crashing

### Code Location

The improved DuckDuckGo search tool is located in:
- `src/tool-calling/tools.ts` - Main implementation
- `src/tool-calling/agent.ts` - Agent configuration

## How It Works

1. **First Attempt**: Tries to search normally
2. **On Failure**: Waits 2 seconds and retries
3. **Up to 3 Attempts**: Continues retrying with delays
4. **Final Failure**: Returns a user-friendly error message

## Usage

The agent will automatically handle DuckDuckGo failures and provide clear feedback to users when the search service is unavailable.

## Alternative Solutions

If you continue to experience issues, consider:

1. **Using Google Custom Search** as a fallback (requires API keys)
2. **Implementing a different search provider**
3. **Adding caching** to reduce search requests
4. **Monitoring search success rates** to identify patterns

## Monitoring

Check the application logs for:
- `DuckDuckGo search query (attempt X/3)`
- `DuckDuckGo search error (attempt X/3)`
- `All retry attempts failed for DuckDuckGo search`

This will help you understand how often the search is failing and when retries are being used.

## Root Cause (Community Findings)

- **DuckDuckGo's HTML/API changes**: The DuckDuckGo search tool and libraries like `duckduckgo-search` and `duck-duck-scrape` rely on scraping DuckDuckGo's web results. When DuckDuckGo changes their HTML structure or API endpoints, these libraries break.
- **VQD Extraction Failure**: Many errors (e.g., `VQDExtractionException: Could not extract vqd`) are due to the tool being unable to extract a required token (`vqd`) from the search page, which is necessary for subsequent requests.
- **Parsing Errors**: Errors like `Cannot read properties of null (reading '1')` or similar are caused by the scraper expecting a certain HTML structure that no longer matches the live site.

This is a known, widespread issue and not specific to your codebase. For more reliable search, consider switching to a different provider.

**References:**
- [Stack Overflow: DuckDuckGo search tool keeps throwing Cannot read properties of null on langchain](https://stackoverflow.com/questions/79670794/duckduckgo-search-tool-keeps-throwing-cannot-read-properties-of-null-on-langchai)
- [GitHub Issue: VQDExtractionException: Could not extract vqd](https://github.com/langchain-ai/langchain/issues/14233) 