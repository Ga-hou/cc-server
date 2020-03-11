import * as path from 'path';

const baseDir = path.join(__dirname, '../');
const entitiesPath = `${baseDir}${process.env.DATABASE_ENTITIES}`;
const migrationPath = `${baseDir}${process.env.DATABASE_MIGRATIONS}`;

export default {
  type: process.env.DATABASE_CONNECTION,
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  port: Number.parseInt(process.env.DATABASE_PORT, 10),
  entities: [entitiesPath],
  timezone: 'UTC',
  charset: 'utf8mb4',
  multipleStatements: true,
  dropSchema: false,
  synchronize: true,
  logging: false,
  migrations: [migrationPath],
  // migrationsRun: process.env.DATABASE_MIGRATIONS_RUN === 'true',
  // seeds: [`src/db/seeds/*.seed.ts`],
  // cli: {
  //   migrationsDir: 'src/db/migrations',
  //   entitiesDir: 'src/db/entities',
  // },
};