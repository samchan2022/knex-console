# knex-console

An interactive console for Knex.js.

## Installation

To install `knex-console` globally, use the following npm command:

```
npm install -g knex-console
```

## Usage

To start the interactive console, run:

## Configuration

To configure `knex-console`, you need to create a `./knex-console.env` file in your home directory. This file should contain your database connection details.

1. **Create .knex-console.env File**
  Inside the home directory, create a `.knex-console.env` file with the following content:
  
  ```
  DB_HOST=localhost
  DB_USER=your_username
  DB_PASSWORD=your_password
  DB_NAME=your_database
  DB_PORT=5432
  ```
  Replace your_username, your_password, your_database, and adjust the DB_HOST and DB_PORT as needed for your database setup.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

