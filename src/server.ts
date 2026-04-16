import 'dotenv/config';
import Fastify from 'fastify';
import { Pool } from 'pg';

const app = Fastify({ logger: true });

const db = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.get('/', async (_, reply) => {
  reply.type('text/html');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FDM PoC App</title>
  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 80px auto; padding: 0 20px; color: #333; }
    h1 { font-size: 1.8rem; margin-bottom: 0.25rem; }
    p  { color: #666; margin-top: 0; }
    ul { list-style: none; padding: 0; margin-top: 2rem; }
    li { margin: 0.75rem 0; }
    a  { display: inline-block; padding: 0.5rem 1rem; background: #0070f3; color: #fff;
         text-decoration: none; border-radius: 6px; font-size: 0.95rem; }
    a:hover { background: #005bb5; }
  </style>
</head>
<body>
  <h1>FDM PoC App</h1>
  <p>Fastify + TypeScript + PostgreSQL</p>
  <ul>
    <li><a href="/health">/health</a></li>
    <li><a href="/db-check">/db-check</a></li>
  </ul>
</body>
</html>`;
});

app.get('/health', async () => {
  return {
    status: 'ok',
    version: process.env.APP_VERSION ?? '1.0.0',
    environment: process.env.NODE_ENV ?? 'development',
  };
});

app.get('/db-check', async (_, reply) => {
  try {
    const result = await db.query('SELECT NOW() AS time');
    return {
      status: 'ok',
      db_time: result.rows[0].time,
    };
  } catch (err) {
    reply.status(503);
    return {
      status: 'error',
      message: (err as Error).message,
    };
  }
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST ?? '0.0.0.0';
    await app.listen({ port, host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
