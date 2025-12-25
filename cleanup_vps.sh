#!/bin/bash
set -e

echo "Cleaning up VPS..."

# Force kill any process holding our ports (PM2, Zombie Docker, etc)
echo "Releasing ports..."
fuser -k 3000/tcp || true
fuser -k 3001/tcp || true

# Stop any running containers related to the app
if [ -d "/var/www/mqudah-docker/mqudah-professional-website" ]; then
    cd /var/www/mqudah-docker/mqudah-professional-website
    docker compose down --remove-orphans || true
fi

# Aggressive cleanup of unused docker resources to prevent disk issues
docker system prune -af
docker volume prune -f

echo "Cleanup complete."
