# Faye

Faye is Felt Studio's website assistant — a chat widget that lives on studiofelt.co and talks to visitors the way the studio would. Direct, warm, curious. Not a bot. Not a helper. Studio Felt itself, in conversation.

---

## What it does

Faye sits in the bottom-left corner of the page as a pill button. Click it and a full chat panel slides up. You can ask about the studio, the work, pricing, or how to get in touch — and Faye responds in Studio Felt's voice, keeping the conversation short and pointed.

When someone is ready to book a call, Faye surfaces a Cal.com calendar inline — no redirects, no copy-pasting links.

---

## How it's built

**Frontend — `public/widget.js`**
A single vanilla JS file, no dependencies. Injects itself into any page via one `<script>` tag. All styles are injected at runtime. Everything is scoped inside a self-invoking function so it never touches the host page's globals.

**Backend — `app/api/chat/route.ts`**
A Next.js App Router serverless function that proxies requests to OpenAI GPT-4o. The browser never talks to OpenAI directly. The system prompt is injected server-side — Faye's voice and knowledge live here, not in the client.

Streaming is handled via Server-Sent Events. Tokens arrive in real time and are appended to the message as they stream in.

**Security**
- CORS locked to `studiofelt.co` and `localhost:3000`
- OpenAI API key is server-side only, read from environment
- Rate limited to 30 requests per IP per hour

---

## Repo structure

```
├── app/
│   └── api/chat/route.ts   — streaming proxy to GPT-4o
├── lib/
│   └── rateLimiter.ts      — in-memory sliding window rate limiter
├── public/
│   ├── widget.js           — the full chat widget (vanilla JS)
│   └── test.html           — local test page
├── .env.example            — required environment variables
└── .env.local              — your local secrets (git-ignored)
```

---

## Running locally

```bash
cp .env.example .env.local
# Add your OpenAI API key to .env.local

npm install
npm run dev
```

Open `http://localhost:3000/test.html` to see Faye running against the local API.

---

## Deploying to Vercel

1. Push to GitHub
2. Import the repo in the [Vercel dashboard](https://vercel.com/new)
3. Under **Settings → Environment Variables**, add `OPENAI_API_KEY`
4. Deploy

Once deployed, update the `API_URL` constant at the top of `widget.js` to point to your Vercel URL, then embed on any page with:

```html
<script src="https://your-deployment.vercel.app/widget.js"></script>
```

---

## Embedding on the Studio Felt site

Drop a single script tag before the closing `</body>` tag on any Framer or custom page. Faye initialises itself, injects its own styles, and never interferes with the host page.

```html
<script src="https://your-deployment.vercel.app/widget.js"></script>
```

---

## Environment variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI secret key |

See `.env.example` for the template.
