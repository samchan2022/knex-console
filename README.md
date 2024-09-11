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

To configure `knex-console`, create a `~/.knex-console` file in your home directory with the following fields:

- `host`: The hostname of your database server (e.g., `localhost`).
- `user`: The username for your database connection.
- `password`: The password for your database connection.
- `database`: The name of the database to connect to.
- `port`: The port number your database server is listening on (e.g., `5432` for PostgreSQL).

The file should be formatted in JSON. If the configuration file is not found, default values will be used.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

