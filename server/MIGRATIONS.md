# Database Migrations Guide

This guide explains how to handle database migrations in this project.

## Understanding the Issue

The project was experiencing two migration-related issues:

1. **Schema Drift**: The database schema was not in sync with the migration history.
2. **Failed Migrations**: There were failed migrations in the database preventing new migrations from being applied.

## Solution

We've implemented the following changes to address these issues:

1. Removed automatic migrations from container startup to prevent errors during development.
2. Created a script to reset and reapply all migrations when needed.

## How to Handle Migrations

### Development Environment

#### Running the Application

The application now starts without attempting migrations:

```bash
docker compose -f docker-compose.dev.yml up --build
```

#### When You Need to Run Migrations

If you need to apply migrations, you have several options:

1. **Apply pending migrations** (safe, doesn't modify existing data):
   ```bash
   # From the server directory
   yarn run migrate:deploy
   
   # Or from a running container
   docker exec parcels-server yarn run migrate:deploy
   ```

2. **Reset and reapply all migrations** (⚠️ deletes all data, use only in development):
   ```bash
   # From the server directory
   yarn run migrate:reset
   
   # Or from a running container
   docker exec parcels-server yarn run migrate:reset
   ```

3. **Create a new migration** (after schema changes):
   ```bash
   # From the server directory
   yarn run migrate:dev
   
   # Or from a running container
   docker exec parcels-server yarn run migrate:dev
   ```

### Production Environment

For production, always use `migrate:deploy` to safely apply pending migrations without data loss:

```bash
yarn run migrate:deploy
```

## Troubleshooting

### P3009: Failed Migrations

If you encounter the error:

```
Error: P3009
migrate found failed migrations in the target database, new migrations will not be applied.
```

Use the reset script to clean up the database (⚠️ development only):

```bash
yarn run migrate:reset
```

### Schema Drift

If you see a "Drift detected" error, it means your database schema doesn't match your migration history. This can happen if:

1. Changes were made directly to the database
2. Migrations were applied out of order
3. Some migrations failed

To resolve, use the reset script in development:

```bash
yarn run migrate:reset
```

## Best Practices

1. Never modify the database schema directly; always use migrations
2. Keep migrations small and focused
3. Test migrations thoroughly in development before applying to production
4. Back up your database before applying migrations in production
