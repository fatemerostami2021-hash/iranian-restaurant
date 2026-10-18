#!/bin/bash
# deploy.sh v2. Changes vs v1:
#  - SSH preflight + keepalive (fails early, before build/upload)
#  - frontend: upload to dist.new, verify, then swap with mv (dist.old kept for instant rollback;
#    previous hashed assets are copied into the new dist so cached old index.html keeps working)
#  - frontend: refuses to run if server has < 1000 MB free
#  - backend: refuses to run if server Node < 20.9 (sharp), backs up server public/uploads first
#  - backend tar: excludes public/uploads, *.bak*, duplicate root uploadController.js (full-path patterns only)
set -euo pipefail
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log_info() { echo -e "${CYAN}[DEPLOY]${NC} $1"; }
log_ok()   { echo -e "${GREEN}[OK]${NC}   $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_err()  { echo -e "${RED}[ERR]${NC}  $1" >&2; }

SERVER="myserver"
REMOTE_DIR="/var/www/kababdagh.com"
PM2_NAME="kabab-backend"
SSH="ssh -o ConnectTimeout=15 -o ServerAliveInterval=15 -o ServerAliveCountMax=4"

TARGET="${1:-all}"
if [[ "$TARGET" != "frontend" && "$TARGET" != "backend" && "$TARGET" != "all" ]]; then
    echo "Usage: ./deploy.sh [frontend|backend|all]"
    exit 1
fi

preflight() {
    log_info "Checking SSH connection..."
    $SSH "$SERVER" "echo ok" > /dev/null \
        || { log_err "Cannot connect to $SERVER (port 22 blocked? try VPN). Nothing was changed."; exit 1; }
    log_ok "SSH connection OK"
}

deploy_frontend() {
    log_info "🎨 Deploying Frontend..."
    preflight
    local FE="$REMOTE_DIR/frontend"
    local AVAIL
    AVAIL=$($SSH "$SERVER" "df -BM --output=avail $REMOTE_DIR | tail -1" | tr -dc '0-9')
    if [[ -z "$AVAIL" || "$AVAIL" -lt 1000 ]]; then
        log_err "Free space on server is '${AVAIL}' MB (need >= 1000). Aborting."; exit 1
    fi
    log_ok "Free space on server: ${AVAIL} MB"
    cd frontend
    log_info "Running npm run build..."
    npm run build || { log_err "Frontend build failed!"; exit 1; }
    cd ..
    log_info "Uploading dist/ to dist.new (live site untouched until swap)..."
    $SSH "$SERVER" "rm -rf $FE/dist.new && mkdir -p $FE/dist.new"
    tar -czf - -C frontend/dist . | $SSH "$SERVER" "tar -xzf - -C $FE/dist.new" \
        || { log_err "Upload failed! Live site is untouched."; exit 1; }
    $SSH "$SERVER" "test -f $FE/dist.new/index.html" \
        || { log_err "dist.new/index.html missing. Aborting, live site untouched."; exit 1; }
    log_info "Swapping dist.new -> dist (previous dist kept as dist.old)..."
    $SSH "$SERVER" "set -e; mkdir -p $FE/dist.new/assets; if [ -d $FE/dist/assets ]; then cp -an $FE/dist/assets/. $FE/dist.new/assets/ || true; fi; rm -rf $FE/dist.old; if [ -d $FE/dist ]; then mv $FE/dist $FE/dist.old; fi; mv $FE/dist.new $FE/dist"
    log_info "Reloading Nginx..."
    $SSH "$SERVER" "sudo nginx -t && sudo systemctl reload nginx"
    log_ok "Frontend deployed successfully!"
    log_info "Rollback if needed: $SSH $SERVER \"cd $FE && mv dist dist.bad && mv dist.old dist\""
}

deploy_backend() {
    log_info "⚙️  Deploying Backend..."
    preflight
    local BE="$REMOTE_DIR/backend"
    local NODE_V NMAJ REST NMIN
    NODE_V=$($SSH "$SERVER" "node -v" | tr -d 'v\r')
    NMAJ=${NODE_V%%.*}; REST=${NODE_V#*.}; NMIN=${REST%%.*}
    if (( NMAJ < 20 || (NMAJ == 20 && NMIN < 9) )); then
        log_err "Server Node is v$NODE_V but sharp needs >= 20.9. Aborting before upload."; exit 1
    fi
    log_ok "Server Node v$NODE_V"
    log_info "Backing up server public/uploads..."
    $SSH "$SERVER" "test -d $BE/public/uploads && mkdir -p $REMOTE_DIR/backups && tar -czf $REMOTE_DIR/backups/uploads-\$(date +%Y%m%d-%H%M%S).tar.gz -C $BE/public uploads" \
        || { log_err "Uploads backup failed (is $BE/public/uploads the right path?). Aborting."; exit 1; }
    log_info "Uploading backend code (tar over ssh)..."
    tar -czf - \
        --exclude='node_modules' \
        --exclude='.env' \
        --exclude='logs' \
        --exclude='.git' \
        --exclude='uploads/tmp' \
        --exclude='./public/uploads' \
        --exclude='*.bak*' \
        --exclude='./uploadController.js' \
        -C backend . | $SSH "$SERVER" "mkdir -p $BE && tar -xzf - -C $BE" \
        || { log_err "Upload failed!"; exit 1; }
    log_info "Installing production dependencies & restarting PM2..."
    $SSH "$SERVER" "cd $BE && npm install --production && pm2 restart $PM2_NAME && pm2 save"
    $SSH "$SERVER" "pm2 logs $PM2_NAME --lines 15 --nostream" || true
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
