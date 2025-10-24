#!/bin/bash
echo "🧹 Clearing Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .next/cache

echo "✅ Cache cleared!"
echo "🚀 Starting dev server..."
npm run dev
