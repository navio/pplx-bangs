# configurable-bangs

A Cloudflare Worker that simplifies web search by providing "bang" shortcuts for popular search engines. By default, all queries are redirected to [Kagi Search](https://kagi.com/), but you can use special "bang" commands to instantly redirect your search to Google, Perplexity, DuckDuckGo, or Metaphor.

## Features

- **Default Search:** All queries go to Kagi Search unless a bang is used.
- **Bang Shortcuts:** Use special commands in your query to search with a different engine:
  - `!g` &rarr; Google Search
  - `!p` &rarr; Perplexity
  - `!d` &rarr; DuckDuckGo
  - `!met` &rarr; Metaphor
  - `!` (at start/end/standalone) &rarr; DuckDuckGo
- **Recall Last Query:** Use `!!` in your query to recall and reuse your previous search (stored in a 1-deep cache).
- **Customizable:** Easily modify the default engine or add new bangs in [`src/index.ts`](src/index.ts:1).

## How It Works

- Enter a search query as usual.
  - Example: `how to make sourdough` &rarr; redirects to Kagi.
- Add a bang to use a different engine:
  - `how to make sourdough !g` &rarr; Google
  - `!p sourdough starter` &rarr; Perplexity
  - `!met bread science` &rarr; Metaphor
  - `!d privacy search` &rarr; DuckDuckGo
  - `! what is a bang` &rarr; DuckDuckGo
- Use `!!` to recall your last query and combine it with a new bang:
  - `!! !g` &rarr; sends your previous query to Google.

## Setup & Deployment

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd pplx-bangs
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Create the KV namespace for query caching:**
   ```bash
   bunx wrangler kv:namespace create QUERY_CACHE
   ```
   - Add the output to your `wrangler.toml` as instructed.

4. **Publish the Worker:**
   ```bash
   bunx wrangler publish
   ```

5. **Set the published Worker URL as your browser's default search engine.**

## Customization

- To change the default search engine or add new bangs, edit [`src/index.ts`](src/index.ts:1).
- The bang logic is in the `handleSearch` function.

## License

MIT
