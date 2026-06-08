# Felt Studios Chatbot — API Proxy

A Next.js serverless function that proxies chat requests from the Felt Studios widget to OpenAI GPT-4o with streaming.

## Endpoint

```
POST /api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ]
}
```

Returns a `text/event-stream` response. Each event is:

```
data: {"token":"Hello"}\n\n
```

The final event is:

```
data: [DONE]\n\n
```

Errors mid-stream are sent as:

```
data: {"error":"Stream error."}\n\n
```

## Local development

1. Copy the example env file and add your key:

   ```bash
   cp .env.example .env.local
   # edit .env.local and set OPENAI_API_KEY
   ```

2. Install dependencies and run:

   ```bash
   npm install
   npm run dev
   ```

   The endpoint is available at `http://localhost:3000/api/chat`.

## Deploy to Vercel

1. Push this repository to GitHub (or connect directly from your machine via the Vercel CLI).

2. Import the project in the [Vercel dashboard](https://vercel.com/new).

3. Under **Settings → Environment Variables**, add:

   | Name | Value |
   |------|-------|
   | `OPENAI_API_KEY` | `sk-...` |

4. Deploy. Vercel will automatically use the Next.js preset.

> **Never commit `.env.local`** — it is listed in `.gitignore`. Only `.env.example` (no real values) should be committed.

## Security notes

- The OpenAI API key is read server-side only — it is never exposed to the browser.
- CORS is locked to `https://studiofelt.co` and `http://localhost:3000`.
- Rate limiting: 30 requests per IP per hour (in-memory, resets on cold start).
- The system prompt is injected server-side; clients cannot override it.
