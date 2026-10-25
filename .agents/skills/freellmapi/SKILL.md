---
name: freellmapi
description: Access, route, and manage free LLM inference using FreeLLMAPI (34 free providers, 635 models, 7.4B tokens/mo). Use for free OpenAI-compatible API calls, local routing (http://localhost:3001/v1), multi-model verification, embeddings, and cost-free development.
---

# FreeLLMAPI Skill

Use **FreeLLMAPI** to access free inference across 34 AI providers (Google, Groq, Cerebras, Mistral, OpenRouter, Cloudflare, HuggingFace, etc.) through a single unified OpenAI-compatible endpoint.

## Endpoint & Configuration

* **Local Gateway Base URL:** `http://localhost:3001/v1`
* **MCP Server Endpoint:** `http://localhost:3001/mcp`
* **Wire Protocol:** OpenAI-compatible (`chat/completions`, `embeddings`, `models`)
* **Environment Variable:** `FREELLMAPI_API_KEY` (unified key from dashboard)

---

## Capabilities

1. **Multi-Provider Aggregation:**
   * Combines free tiers across 34 providers (~7.4B tokens/month).
   * Automatic rate-limit failover: If one provider hits a rate limit, the router automatically fails over to the next available provider.

2. **Zero-Cost Inference for Project Development:**
   * Test LLM-driven features (chatbots, text generation, summarization, embeddings) without consuming paid API credits.
   * Multi-model consensus and validation (verify generated code or content across multiple distinct LLMs).

3. **Standard Integration Patterns:**

### Node.js / TypeScript Example
```typescript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://localhost:3001/v1",
  apiKey: process.env.FREELLMAPI_API_KEY || "freellmapi-unified-key",
});

async function main() {
  const response = await client.chat.completions.create({
    model: "auto", // Router selects the fastest available free model
    messages: [{ role: "user", content: "Hello from FreeLLMAPI" }],
  });
  console.log(response.choices[0].message.content);
}
```

### Python Example
```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3001/v1",
    api_key="freellmapi-unified-key"
)

response = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "Hello from FreeLLMAPI"}]
)
print(response.choices[0].message.content)
```

### Direct HTTP / Fetch
```bash
curl http://localhost:3001/v1/chat/completions \
  -H "Authorization: Bearer <FREELLMAPI_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto",
    "messages": [{"role": "user", "content": "Ping"}]
  }'
```

---

## Common Models & Routing Targets

* `auto` — Automatically picks the best low-latency free model with available quota
* `groq/llama-3.3-70b-versatile` — High-speed reasoning & code generation
* `cerebras/llama3.1-70b` — Ultra-low latency responses
* `google/gemini-2.5-flash` — Long context & multimodal understanding
* `mistral/mistral-large` — Precision reasoning & structured output
