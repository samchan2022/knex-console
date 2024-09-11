#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const knex = require('knex');
const repl = require('repl');
require('dotenv').config({ path: path.resolve(process.env.HOME || process.env.USERPROFILE, '.knex-console.env') });

// Default configuration values for PostgreSQL and MySQL
const defaultConfigs = {
  pg: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'postgres',
      database: 'postgres',
      port: 5432
    }
  },
  mysql: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'test',
      port: 3306
    }
  }
};

// Determine the database client and load appropriate defaults
const dbClient = process.env.DB_CLIENT || 'pg';
const defaultConfig = defaultConfigs[dbClient] || defaultConfigs.pg;

// Define SSL configuration
const sslConfig = process.env.DB_SSL === 'true' ? {
  ca: process.env.DB_SSL_CA ? fs.readFileSync(process.env.DB_SSL_CA, 'utf8') : undefined,
  cert: process.env.DB_SSL_CERT ? fs.readFileSync(process.env.DB_SSL_CERT, 'utf8') : undefined,
  key: process.env.DB_SSL_KEY ? fs.readFileSync(process.env.DB_SSL_KEY, 'utf8') : undefined,
  rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
} : false;

// Override default config with environment variables
const dbConfig = {
  ...defaultConfig,
  connection: {
    ...defaultConfig.connection,
    host: process.env.DB_HOST || defaultConfig.connection.host,
    user: process.env.DB_USER || defaultConfig.connection.user,
    password: process.env.DB_PASSWORD || defaultConfig.connection.password,
    database: process.env.DB_NAME || defaultConfig.connection.database,
    port: parseInt(process.env.DB_PORT, 10) || defaultConfig.connection.port,
    ssl: sslConfig
  }
};

// Initialize Knex instance
const db = knex(dbConfig);

// Function to evaluate commands
async function evalAsync(cmd, context, filename, callback) {
  try {
    const result = await eval(cmd);
    callback(null, result);
  } catch (error) {
    callback(error);
  }
}

// Log message before starting REPL
console.log('Knex interactive console is ready. Type `.exit` to quit.');

// Start REPL
const replServer = repl.start({
  prompt: 'knex> ',
  eval: evalAsync
});

// Expose Knex instance and database object in REPL context
replServer.context.db = db;
replServer.context.knex = db;

// Clean up on exit
replServer.on('exit', () => {
  db.destroy(); // Close the database connection
  console.log('Quit.');
});

