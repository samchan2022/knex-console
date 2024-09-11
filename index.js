#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const knex = require('knex');
const repl = require('repl');
require('dotenv').config();

// Determine the path to the configuration file
const configFilePath = path.resolve(process.env.HOME || process.env.USERPROFILE, '.knex-console');

// Default configuration
let dbConfig = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
  }
};

// Load configuration from ~/.knex-console if it exists
if (fs.existsSync(configFilePath)) {
  try {
    const fileConfig = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    dbConfig = {
      ...dbConfig,
      connection: {
        ...dbConfig.connection,
        ...fileConfig
      }
    };
  } catch (error) {
    console.error('Error reading or parsing the configuration file:', error);
  }
} else {
  console.warn(`Configuration file not found at ${configFilePath}. Using default configuration.`);
}

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



