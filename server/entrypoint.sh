#!/bin/sh
set -e

echo "🔄 Running Prisma migrations..."
npx prisma db push --accept-data-loss

echo "✅ Database ready. Starting server..."
exec node dist/src/main.js
