import 'dotenv/config';
import { defineConfig } from 'prisma/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node src/prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
