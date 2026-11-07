# SaaSCity for Hermes

Plan a product launch from Hermes. The agent audits your homepage the way directory scrapers and link-preview bots see it, picks launch directories out of 1,600+ with Ahrefs DR, link type and price, and turns them into a dated checklist. When you ask, it drafts a listing on [SaaSCity](https://saascity.io), the launch directory for SaaS and AI tools, for you to review.

This is a portable Agent Plugins v1 package: `plugin.json`, `mcp.json` and one skill. It holds configuration only, no code. The tools are served by the hosted SaaSCity MCP server at `https://saascity.io/api/mcp` (Streamable HTTP, no account, no API key).

## Install

```bash
hermes plugins install saascity
hermes plugins enable saascity
```

Then start a new session and ask, for example:

> Check if https://example.com is ready to launch, then give me a two-week launch plan for an AI tool using free dofollow directories.

> Is uneed.best worth paying for? What's its DR and is the link dofollow?

> List my product on SaaSCity. The site is https://example.com.

## What you get

**The `saascity:launch-plan` skill** walks the agent through a launch: audit, fix the blockers, pick directories, write a dated checklist, and draft a SaaSCity listing only if you ask for one.

**The `saascity` MCP server**, with these tools:

| Tool | What it does |
| --- | --- |
| `check_launch_readiness` | Audits a homepage: HTTPS, noindex, title, meta description, og:image (fetched to confirm it loads), X card, favicon, canonical, viewport, h1, JSON-LD, robots.txt, sitemap, parked or 404 pages, response time, and pages that are empty without JavaScript. Returns a 0-100 score, a verdict and a fix for each problem. |
| `recommend_launch_directories` | Hand-picked directories for SaaS, AI or developer tools, grouped by when to submit. Each pick has a human-written verdict, including the ones not worth paying for. |
| `find_launch_directories` | Filters the full dataset by category, minimum DR, dofollow or nofollow, price and badge-swap requirement. Unverified fields come back as `unknown` instead of a guess. |
| `get_launch_directory` | Looks up one directory by domain or URL before you pay for a listing. |
| `get_offers` | SaaSCity's listing plans and current prices. |
| `get_launch_weeks` | The next 12 weekly SaaSCity launches. |
| `submit_project` | Creates an inert SaaSCity draft and returns a claim link. |
| `get_submission_status` | Where a submission stands, by claim token or listing slug. |
| `check_badge` | Checks whether the SaaSCity badge is live on a site. |
| `search_listings`, `get_listing`, `find_alternatives`, `get_leaderboard` | Search the products listed on SaaSCity, for market and competitor research. |
| `calculate_arr`, `calculate_arr_bridge`, `calculate_churn`, `calculate_nrr`, `rule_of_40`, `calculate_nps`, `ab_test_significance`, `markup_margin`, `uptime_downtime` | SaaS metric calculators. They compute from the numbers you pass and read no data. |

## Approvals

The package marks the `saascity` server `untrusted`. Every tool is annotated `readOnlyHint: true` except `submit_project`, so Hermes asks you before that one call runs, and refuses it in cron and other unattended runs.

`submit_project` writes only a draft. Nothing is published or charged until you open the claim link, sign in, pick a plan and a launch week and pay on saascity.io. Every new SaaSCity listing is paid, and only you can pay. A person reviews every listing before it goes live.

## Disclosure

- Every tool call goes over HTTPS to `saascity.io`, which SaaSCity runs. Nothing else is contacted.
- `check_launch_readiness` and `check_badge` make saascity.io fetch the URL you give it (the page, its og:image, robots.txt and sitemap).
- `submit_project` sends the product details you approved to SaaSCity and stores them as a draft, with the caller's IP address for abuse limits. An unclaimed draft expires after 7 days.
- Rate limits are counted per IP: `submit_project` 5 a day, `check_launch_readiness` 20 an hour, `check_badge` 30 an hour, the rest 30 to 60 a minute.
- The server keeps no session, sets no cookies and needs no credentials. The package stores nothing on your machine.
- The tool set is served by the remote server at runtime and is not covered by the catalog's pinned commit.
- saascity.io is not available in every region. Where it is blocked, the server answers HTTP 451 and the tools do not load.

## Data

- DR is Ahrefs Domain Rating. `drCheckedAt` is the date of its last recheck. Link type and price come from checks against the live sites, dated by `dataUpdatedAt`. Rows nobody has verified say `unknown`.
- The same data is on [Best SaaS Directories](https://saascity.io/best-saas-directories) and [Best AI Directories](https://saascity.io/best-ai-directories).

## Other clients

The same server works in any MCP client. Setup for Claude Code, Cursor, VS Code and stdio-only clients is in the [repository README](../README.md) and at [saascity.io/mcp](https://saascity.io/mcp).

## License

MIT.
