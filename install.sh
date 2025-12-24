#!/bin/bash
set -e

REMOTE_DIR="/var/www/mqudah-docker"

echo "Starting installation..."

# Ensure permissions
chmod +x cleanup_vps.sh

# Run cleanup
./cleanup_vps.sh

# Prepare directory
echo "Preparing directory $REMOTE_DIR..."
rm -rf "$REMOTE_DIR"
mkdir -p "$REMOTE_DIR"

# Extract
echo "Extracting archive..."
tar -xzf deployment.tar.gz -C "$REMOTE_DIR"

# Copy envs
echo "Configuring environment..."
cp .env.production "$REMOTE_DIR/.env"
cp .env.production "$REMOTE_DIR/mqudah-professional-website/.env"

# Deploy
echo "Deploying Docker stack..."
# CRITICAL: We must run from ROOT where docker-compose.yml lives
cd "$REMOTE_DIR"

# Zero-Downtime Strategy: Build first!
echo "Building images..."
if ! docker compose build; then
    echo "❌ BUILD FAILED. Aborting deployment to protect live site."
    exit 1
fi

echo "✅ Build successful. Updating containers..."
docker compose up -d --remove-orphans

echo "Waiting for services to stabilize..."
sleep 30

docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
