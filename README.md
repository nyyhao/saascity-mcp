# SaaSCity MCP server

An MCP server for launching a product. Your AI agent can audit your homepage before launch, pick launch directories out of 1,600+ with Ahrefs DR, link type and price, and list the product on [SaaSCity](https://saascity.io).

- **Remote, keyless:** `https://saascity.io/api/mcp` (Streamable HTTP). No account, no API key.
- **Stdio:** `npx -y saascity-mcp` for clients that only run local servers. It forwards to the hosted server.
- **Protocol:** MCP `2026-07-28` (stateless) and the `initialize`-based versions `2025-11-25`, `2025-06-18`, `2025-03-26` and `2024-11-05`, all on one endpoint.

Built by [SaaSCity](https://saascity.io), the launch directory for SaaS and AI tools. Full docs: [saascity.io/mcp](https://saascity.io/mcp)

## Install

**Claude Code**

```bash
claude mcp add --transport http saascity https://saascity.io/api/mcp
```

**Claude Desktop, Cursor, Windsurf, VS Code and other clients with `mcpServers` JSON**

```json
{
  "mcpServers": {
    "saascity": {
      "type": "http",
      "url": "https://saascity.io/api/mcp"
    }
  }
}
```

**Stdio-only clients**

```json
{
  "mcpServers": {
    "saascity": {
      "command": "npx",
      "args": ["-y", "saascity-mcp"]
    }
  }
}
```

It also runs straight from GitHub: `npx -y github:nyyhao/saascity-mcp`.

## Tools

| Tool | What it does |
| --- | --- |
| `check_launch_readiness` | Audits a homepage the way directory scrapers and link-preview bots see it: HTTPS, noindex, title, meta description, og:image (fetched to confirm it loads), X card, favicon, canonical, viewport, h1, JSON-LD, robots.txt, sitemap, parked or 404 pages, response time, and pages that are empty without JavaScript. Returns a 0-100 score, a verdict and a fix for each problem. |
| `recommend_launch_directories` | Hand-picked directories for SaaS, AI or developer tools, grouped by when to submit. Each pick has a human-written verdict, including the ones not worth paying for. |
| `find_launch_directories` | Filters the full dataset (1,600+ startup, SaaS and AI directories) by category, minimum DR, dofollow/nofollow, price and badge-swap requirement. Unverified fields come back as `unknown` instead of a guess. |
| `get_launch_directory` | Looks up one directory by domain or URL before you pay for a listing. |
| `submit_project` | Lists a product on SaaSCity as an inert draft and returns a claim link. Nothing is published or charged until a human opens it, and every listing is reviewed by a person. |
| `check_badge` | Checks whether the SaaSCity badge is live on a site (a verified badge makes the listing link dofollow). |
| `get_submission_status` | Where a submission stands, by claim token or listing slug. |
| `get_launch_weeks` | Free slots left in the next 12 weekly launches. |
| `get_offers` | Listing tiers and prices. |
| `search_listings` | Searches products listed on SaaSCity by keyword and category. |
| `get_listing` | One listing in full. |
| `get_leaderboard` | Most upvoted launches this week, in the last 30 days, or all time. |
| `find_alternatives` | Other listings in the same category as a given one. |

Every tool declares an `outputSchema` and returns `structuredContent` next to its text, plus `readOnlyHint` and the other behavior hints. Only `submit_project` writes anything, and it writes only a draft.

## Prompts

- `plan_launch` (`website_url`, `product_type`): audit, fix the blockers, pick directories, produce a dated launch checklist.
- `submit_to_saascity` (`website_url`): draft a listing from the site, confirm it with you, then submit it.

## Try it

> Check if https://example.com is ready to launch, then give me a two-week launch plan for an AI tool using free dofollow directories.

> Is uneed.best worth it? What's its DR and is the link dofollow?

> List my product on SaaSCity. The site is https://example.com.

## Data and limits

- DR is Ahrefs Domain Rating. `drCheckedAt` is the date of its last recheck, or null when the value comes from the last sweep of the list. Link type and price come from checks against the live sites, dated by `dataUpdatedAt`. Rows nobody has verified say `unknown`.
- The data is the same as on [Best SaaS Directories](https://saascity.io/best-saas-directories) and [Best AI Directories](https://saascity.io/best-ai-directories).
- Rate limits are per IP: `submit_project` 5 per day, `check_launch_readiness` 20 per hour, `check_badge` 30 per hour, everything else 30-60 per minute.
- The server keeps no session and needs no cookies. The claim link from `submit_project` is the only way a draft becomes a listing.

## Self-check

```bash
curl -s https://saascity.io/api/mcp \
  -H 'content-type: application/json' \
  -H 'mcp-protocol-version: 2025-11-25' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## License

MIT for this bridge. The directory data is served by saascity.io and is not part of this repository.
