#!/bin/bash
# AI Scraper Dashboard Installation Script

echo "🤖 Installing AI Scraper Dashboard..."

# Create application directory
sudo mkdir -p /opt/ai-scraper-dashboard
sudo cp -r ai-scraper-dashboard/* /opt/ai-scraper-dashboard/

# Install desktop entry
sudo cp ai-scraper-dashboard.desktop /usr/share/applications/

# Set permissions
sudo chmod +x /opt/ai-scraper-dashboard/launch.sh

echo "✅ Installation complete!"
echo "🚀 You can now launch 'AI Scraper Dashboard' from your applications menu"
echo "📁 Or run: /opt/ai-scraper-dashboard/launch.sh"
