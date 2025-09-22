# AI Scraper Dashboard - Linux Package

## Installation

```bash
chmod +x install.sh
./install.sh
```

## Manual Launch

```bash
cd ai-scraper-dashboard
./launch.sh
```

## Components

- `ai-scraper-dashboard/` - Main application files
- `install.sh` - System installation script
- `ai-scraper-dashboard.desktop` - Desktop entry

## Requirements

- Linux with X11 or Wayland
- Web browser (Firefox, Chromium, or any modern browser)
- For full functionality: Docker, Node.js (optional)

## Architecture

This dashboard is part of a 3-component system:
1. **ai-scraper-vm** - Core scraping engine
2. **frankenstein-db** - Data storage and intelligence
3. **ai-scraper-dashboard** - This monitoring interface

Built with ❤️ for intelligent web scraping.
