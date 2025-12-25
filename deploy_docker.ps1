$ErrorActionPreference = "Stop"
$VPS_USER = "root"
$VPS_IP = "72.61.98.100"
$KEY_PATH = "C:\Users\Lenovo\Documents\augment-projects\InstaBot\deploy_key"
$REMOTE_DIR = "/var/www/mqudah-docker"

Write-Host "Starting Deployment to $VPS_IP with key $KEY_PATH..." -ForegroundColor Cyan

# 1. Archive
Write-Host "Creating archive..." -ForegroundColor Yellow
if (Test-Path deployment.tar.gz) { Remove-Item deployment.tar.gz }
git archive --format=tar.gz -o deployment.tar.gz HEAD

# 2. Upload
Write-Host "Uploading..." -ForegroundColor Yellow
# We must use the key from CWD that we just restored
scp -i $KEY_PATH -o StrictHostKeyChecking=no deployment.tar.gz ${VPS_USER}@${VPS_IP}:/root/
scp -i $KEY_PATH -o StrictHostKeyChecking=no .env.production ${VPS_USER}@${VPS_IP}:/root/
scp -i $KEY_PATH -o StrictHostKeyChecking=no cleanup_vps.sh ${VPS_USER}@${VPS_IP}:/root/
scp -i $KEY_PATH -o StrictHostKeyChecking=no install.sh ${VPS_USER}@${VPS_IP}:/root/

# 3. Execute
Write-Host "Executing remote..." -ForegroundColor Yellow

# We use a single-line command to avoid CRLF issues with PowerShell heredocs sending \r to Linux
$cmd = "cd /root && sed -i 's/\r$//' cleanup_vps.sh && sed -i 's/\r$//' install.sh && chmod +x cleanup_vps.sh install.sh && ./install.sh"

ssh -i $KEY_PATH -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} $cmd
# Post-deployment migration check
Write-Host "Running strict migrations..." -ForegroundColor Yellow
$migrate_cmd = "docker exec mqudah-app pnpm db:migrate"
ssh -i $KEY_PATH -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} $migrate_cmd

Remove-Item deployment.tar.gz -ErrorAction SilentlyContinue
Write-Host "DONE! Visit https://mumayazone.com" -ForegroundColor Green
