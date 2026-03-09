#!/usr/bin/env bash
# run-daily-discovery.sh
#
# Daily feature discovery automation runner.
# Invoke Claude Code non-interactively to run the discovery-automation skill.
#
# Usage:
#   ./run-daily-discovery.sh                     # 24h lookback (default)
#   ./run-daily-discovery.sh --window 48h        # custom lookback
#   ./run-daily-discovery.sh --dry-run           # print the prompt, don't run
#
# Scheduling (cron — runs at 9:00 AM UTC daily):
#   0 9 * * * cd /path/to/base44-marketing-agent && ./run-daily-discovery.sh >> logs/discovery.log 2>&1
#
# GitHub Actions: see .github/workflows/daily-discovery.yml

set -euo pipefail

# ── Config ──────────────────────────────────────────────────────────────────

PLUGIN_DIR="plugins/base44-marketing"
LOG_DIR="logs"
LOG_FILE="$LOG_DIR/discovery-$(date +%Y-%m-%d).log"
WINDOW="24h"
DRY_RUN=false

# ── Parse args ───────────────────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
  case "$1" in
    --window)   WINDOW="$2"; shift 2 ;;
    --dry-run)  DRY_RUN=true; shift ;;
    *)          echo "Unknown arg: $1"; exit 1 ;;
  esac
done

# ── Setup ────────────────────────────────────────────────────────────────────

mkdir -p "$LOG_DIR"

echo "=== Daily Discovery: $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" | tee -a "$LOG_FILE"
echo "Window: $WINDOW" | tee -a "$LOG_FILE"

# ── Verify claude CLI is available ───────────────────────────────────────────

if ! command -v claude &> /dev/null; then
  echo "ERROR: 'claude' CLI not found. Install Claude Code first." | tee -a "$LOG_FILE"
  exit 1
fi

# ── Build the prompt ─────────────────────────────────────────────────────────

PROMPT="Run the discovery-automation skill. Window: last $WINDOW. Run fully autonomously — no confirmation gates. Post the daily digest to Slack when done."

if [ "$DRY_RUN" = true ]; then
  echo "DRY RUN — prompt that would be sent:"
  echo "$PROMPT"
  exit 0
fi

# ── Run Claude Code non-interactively ────────────────────────────────────────
# -p = non-interactive (print mode)
# --plugin = load the base44-marketing plugin

echo "Running Claude Code..." | tee -a "$LOG_FILE"

claude \
  -p "$PROMPT" \
  --plugin "$PLUGIN_DIR" \
  2>&1 | tee -a "$LOG_FILE"

EXIT_CODE="${PIPESTATUS[0]}"

if [ "$EXIT_CODE" -eq 0 ]; then
  echo "=== Discovery complete ===" | tee -a "$LOG_FILE"
else
  echo "=== Discovery FAILED (exit $EXIT_CODE) ===" | tee -a "$LOG_FILE"
  exit "$EXIT_CODE"
fi
