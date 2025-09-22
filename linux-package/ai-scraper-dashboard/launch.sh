#!/bin/bash
# AI Scraper Dashboard Launcher

# Set working directory
cd "$(dirname "$0")"

# Check if we have a browser available
if command -v xdg-open >/dev/null 2>&1; then
    echo "🚀 Opening AI Scraper Dashboard..."
    xdg-open index.html
elif command -v firefox >/dev/null 2>&1; then
    echo "🚀 Opening AI Scraper Dashboard in Firefox..."
    firefox index.html
elif command -v chromium-browser >/dev/null 2>&1; then
    echo "🚀 Opening AI Scraper Dashboard in Chromium..."
    chromium-browser index.html
else
    echo "❌ No browser found. Please open index.html manually."
    echo "📁 Dashboard location: $(pwd)/index.html"
fi
