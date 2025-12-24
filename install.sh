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
cp .env.production "$REMOTE_DIR/"
cp .env.production "$REMOTE_DIR/mqudah-professional-website/.env"

# Deploy
echo "Deploying Docker stack..."
cd "$REMOTE_DIR/mqudah-professional-website"
docker compose down --remove-orphans 2>/dev/null || true
docker compose up -d --build

echo "Waiting for services to stabilize..."
sleep 30

docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
