#!/bin/bash
set -euo pipefail
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log_info() { echo -e "${CYAN}[DEPLOY]${NC} $1"; }
log_ok()   { echo -e "${GREEN}[OK]${NC}   $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_err()  { echo -e "${RED}[ERR]${NC}  $1" >&2; }

SERVER="deploy@188.40.174.173"
REMOTE_DIR="/var/www/kababdagh.com"
PM2_NAME="kabab-backend"

TARGET="${1:-all}"
if [[ "$TARGET" != "frontend" && "$TARGET" != "backend" && "$TARGET" != "all" ]]; then
    echo "Usage: ./deploy.sh [frontend|backend|all]"
    exit 1
fi

deploy_frontend() {
    log_info "🎨 Deploying Frontend..."
    cd frontend
    log_info "Running npm run build..."
    npm run build || { log_err "Frontend build failed!"; exit 1; }
    cd ..
    log_info "Clearing old dist on server..."
    ssh "$SERVER" "rm -rf $REMOTE_DIR/frontend/dist && mkdir -p $REMOTE_DIR/frontend/dist"
    log_info "Uploading dist/ to server (tar over ssh)..."
    tar -czf - -C frontend/dist . | ssh "$SERVER" "tar -xzf - -C $REMOTE_DIR/frontend/dist" \
        || { log_err "Upload failed!"; exit 1; }
    log_info "Reloading Nginx..."
    ssh "$SERVER" "sudo nginx -t && sudo systemctl reload nginx"
    log_ok "Frontend deployed successfully!"
}

deploy_backend() {
    log_info "⚙️  Deploying Backend..."
    log_info "Uploading backend code (tar over ssh, excluding node_modules/.env/logs/.git)..."
    tar -czf - \
        --exclude='node_modules' \
        --exclude='.env' \
        --exclude='logs' \
        --exclude='.git' \
        --exclude='uploads/tmp' \
        -C backend . | ssh "$SERVER" "mkdir -p $REMOTE_DIR/backend && tar -xzf - -C $REMOTE_DIR/backend" \
        || { log_err "Upload failed!"; exit 1; }
    log_info "Installing production dependencies & restarting PM2..."
    ssh "$SERVER" "cd $REMOTE_DIR/backend && npm install --production && pm2 restart $PM2_NAME && pm2 save"
    log_ok "Backend deployed successfully!"
}

echo -e "\n${CYAN}═══════════════════════════════════════${NC}"
echo -e "${CYAN}  🚀 Kabab Dagh Deploy Tool${NC}"
echo -e "${CYAN}  Target: ${TARGET}${NC}"
echo -e "${CYAN}═══════════════════════════════════════\n${NC}"

if [[ "$TARGET" == "backend" || "$TARGET" == "all" ]]; then
    deploy_backend
    echo ""
fi
if [[ "$TARGET" == "frontend" || "$TARGET" == "all" ]]; then
    deploy_frontend
    echo ""
fi

log_ok "🎉 All done! Deploy complete."
echo ""
echo -e "${CYAN}Useful checks:${NC}"
echo "  ssh $SERVER 'pm2 status'"
echo "  ssh $SERVER 'pm2 logs $PM2_NAME'"
