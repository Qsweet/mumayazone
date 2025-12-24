#!/bin/bash
set -e

echo "Cleaning up VPS..."

# Stop any running containers related to the app
if [ -d "/var/www/mqudah-docker/mqudah-professional-website" ]; then
    cd /var/www/mqudah-docker/mqudah-professional-website
    docker compose down --remove-orphans || true
fi

# Aggressive cleanup of unused docker resources to prevent disk issues
docker system prune -af
docker volume prune -f

echo "Cleanup complete."
