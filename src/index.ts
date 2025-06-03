export interface Env {
  QUERY_CACHE: KVNamespace;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    async function handleSearch(
      request: Request,
      env: Env,
      ctx: ExecutionContext
    ): Promise<Response> {
      const query = url.searchParams.get("q");

      let redirectUrl = new URL("https://kagi.com/search");
      const swapLastQuery = async (query: string) => {
        if (query?.includes("!!")) {
          const lastQuery = await env.QUERY_CACHE.get("last");
          if (lastQuery) {
            return `${lastQuery} ${query
              .replace("!!", "")
              .replace(/!g|!p|!m/g, "")}`;
          }
        }
        return query;
      };

      if (query) {
        if (query.includes("!g")) {
          redirectUrl = new URL("https://www.google.com/search");
          redirectUrl.searchParams.set(
            "q",
            await swapLastQuery(query.replace(/!p\s?/, ""))
          );
        } else if (query.includes("!p")) {
          redirectUrl = new URL("https://www.perplexity.ai/search");
          redirectUrl.searchParams.set(
            "q",
            await swapLastQuery(query.replace(/!p\s?/, ""))
          );
        } else if (query.startsWith("! ") || query.endsWith(" !") || query.includes(" ! ")) {
          redirectUrl = new URL("https://duckduckgo.com/");
          redirectUrl.searchParams.set(
            "q",
            query
          );
        } else if (query.includes("!d")) {
          redirectUrl = new URL("https://duckduckgo.com/");
          redirectUrl.searchParams.set(
            "d",
            await swapLastQuery(query.replace(/!d\s?/, ""))
          );
        } else if (query.includes("!met")) {
          redirectUrl = new URL("https://metaphor.systems/search");
          redirectUrl.searchParams.set(
            "q",
            await swapLastQuery(query.replace(/!met\s?/, ""))
          );
        } else {
          redirectUrl.searchParams.set("q", await swapLastQuery(query));
        }

        ctx.waitUntil(
          env.QUERY_CACHE.put("last", query.replace(/!g|!p|!m/g, ""))
        );
      }

      return Response.redirect(redirectUrl.href, 302);
    }

    switch (url.pathname) {
      default:
        // Default to search
        return handleSearch(request, env, ctx);
    }
  },
};
