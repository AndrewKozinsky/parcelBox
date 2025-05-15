#!/bin/bash

# Script to reset and reapply all migrations for development environment

echo "Resetting database and applying all migrations from scratch..."

# Navigate to the server directory
cd "$(dirname "$0")/.."

# Drop the database schema (this will remove all data)
echo "Dropping database schema..."
npx prisma migrate reset --force

# Apply all migrations
echo "Applying all migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Migration reset complete. Your database is now in sync with your migration history."
echo "Note: This script should only be used in development environments as it will delete all data."
