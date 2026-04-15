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
