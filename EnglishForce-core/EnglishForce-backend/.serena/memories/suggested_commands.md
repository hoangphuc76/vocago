
# Suggested Commands

Here are the most important commands for developing and running the `EnglishForce-backend` project:

## Installation

To install all the required dependencies, run:

```bash
npm install
```

## Running the Application

- **Development Mode:** To run the server in development mode, use:

  ```bash
  npm run dev
  ```

- **Development Mode with Auto-Reload:** For a better development experience with automatic server restarts on file changes, use:

  ```bash
  npm run dev:watch
  ```

- **Production Mode:** To run the server in production mode, use:

  ```bash
  npm run start
  ```

## Database Seeding

To populate the database with initial data, you can use the Sequelize CLI. The seed files are located in the `src/sequelize/seeders` directory.

To run all seeders, use:

```bash
npx sequelize-cli db:seed:all
```

To run a specific seeder, use:

```bash
npx sequelize-cli db:seed --seed <seeder-file-name>.cjs
```

## Testing, Linting, and Formatting

There are no predefined scripts for testing, linting, or formatting in the `package.json` file. You may need to run these tools manually if they are set up in the project.
