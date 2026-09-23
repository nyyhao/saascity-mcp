#!/usr/bin/env node
// stdio bridge to the SaaSCity MCP server at https://saascity.io/api/mcp.
//
// Clients that speak Streamable HTTP should point at that URL directly; this
// exists for clients and sandboxes that only launch local stdio servers. It
// forwards tools and prompts unchanged, so it never drifts from the hosted server.
import { readFileSync } from 'node:fs';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    GetPromptRequestSchema,
    ListPromptsRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const endpoint = new URL(process.env.SAASCITY_MCP_URL || 'https://saascity.io/api/mcp');

// Connected on first use, not at startup: a client can initialize and list
// capabilities while offline, and a dropped connection is retried on the next call.
let remote = null;
async function upstream() {
    if (remote) return remote;
    const client = new Client({ name: 'saascity-mcp-stdio', version });
    client.onclose = () => { remote = null; };
    await client.connect(new StreamableHTTPClientTransport(endpoint));
    remote = client;
    return client;
}

const server = new Server(
    { name: 'saascity', title: 'SaaSCity', version, websiteUrl: 'https://saascity.io' },
    {
        capabilities: { tools: {}, prompts: {} },
        instructions: 'SaaSCity helps a founder launch a product: check_launch_readiness audits the site, recommend_launch_directories and find_launch_directories pick where to launch, submit_project lists it on SaaSCity as a draft the human claims. DR figures are Ahrefs Domain Rating.',
    },
);

server.setRequestHandler(ListToolsRequestSchema, async (req) => (await upstream()).listTools(req.params));
server.setRequestHandler(CallToolRequestSchema, async (req) => (await upstream()).callTool(req.params));
server.setRequestHandler(ListPromptsRequestSchema, async (req) => (await upstream()).listPrompts(req.params));
server.setRequestHandler(GetPromptRequestSchema, async (req) => (await upstream()).getPrompt(req.params));

await server.connect(new StdioServerTransport());
