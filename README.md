# fdm-poc-app

FDM PoC application — Node.js + TypeScript + Fastify + PostgreSQL.

## Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Returns app version and environment |
| GET | `/db-check` | Verifies PostgreSQL connection |

## Local development

```bash
cp .env.example .env
# edit .env as needed

# With Docker Compose (app + local DB):
docker compose up

# Without Docker (requires external DB):
npm install
npm run dev
```

## Environment variables

See `.env.example` for all required variables.

## Deployment

The app is containerised. Build and run with:

```bash
docker build -t fdm-poc-app .
docker run --env-file .env -p 3000:3000 fdm-poc-app
```

## Infrastructure

| Environment | Host | IP |
|---|---|---|
| Production App | lab-prod-app | 24.199.101.101 |
| Production DB | lab-prod-db | 64.23.142.139 |
| QA | lab-qa | 24.199.125.142 |
| Dev | lab-dev | 147.182.192.209 |
