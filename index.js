#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const knex = require('knex');
const repl = require('repl');
require('dotenv').config({ path: path.resolve(process.env.HOME || process.env.USERPROFILE, '.knex-console/.env') });

// Default configuration for PostgreSQL
const dbConfig = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
    port: parseInt(process.env.DB_PORT, 10) || 5432 // default PostgreSQL port
  }
};

// Initialize Knex
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
});

