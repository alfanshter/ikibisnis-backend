import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config(); // load .env for CLI usage

/**
 * TypeORM DataSource used by the migration CLI.
 * Run: npx typeorm migration:run -d src/database/data-source.ts
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_DATABASE ?? 'ikibisnis_db',
  ssl: process.env.DB_SSL === 'true',
  entities: [join(__dirname, '../modules/**/*.orm-entity{.ts,.js}')],
  migrations: [join(__dirname, '../modules/**/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: true,
});
