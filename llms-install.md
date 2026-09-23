# Installing the SaaSCity MCP server

Nothing to build and no API key. Pick one.

## Remote (preferred)

The server is hosted at `https://saascity.io/api/mcp` over Streamable HTTP.

```json
{
  "mcpServers": {
    "saascity": {
      "type": "streamableHttp",
      "url": "https://saascity.io/api/mcp"
    }
  }
}
```

Some clients name the type `http` instead of `streamableHttp`. Claude Code:

```bash
claude mcp add --transport http saascity https://saascity.io/api/mcp
```

## Local stdio bridge

For clients that only launch local processes. Needs Node.js 20 or newer. It forwards to the hosted server.

```json
{
  "mcpServers": {
    "saascity": {
      "command": "npx",
      "args": ["-y", "github:nyyhao/saascity-mcp"]
    }
  }
}
```

## Check it works

Ask the agent to call `get_offers`. It returns SaaSCity's listing tiers and prices. `check_launch_readiness` with any homepage URL is a good second test.
