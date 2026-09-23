FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY index.js ./
# Speaks MCP over stdio and forwards to the hosted server (override with SAASCITY_MCP_URL).
ENTRYPOINT ["node", "index.js"]
