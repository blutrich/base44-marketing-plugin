#!/bin/bash
# Runs on Stop hook — guaranteed to fire after every session
# Appends a minimal entry to sessions.md if the agent didn't already log

SESSIONS_FILE=".claude/marketing/sessions.md"
mkdir -p .claude/marketing

# Create file with header if it doesn't exist
if [ ! -f "$SESSIONS_FILE" ]; then
  cat > "$SESSIONS_FILE" << 'HEADER'
# Plugin Session Log

| Date | Workflow | Channel | Pieces | Score | Min Saved | Summary |
|------|----------|---------|--------|-------|-----------|---------|
HEADER
fi

TODAY=$(date '+%Y-%m-%d')

# Check if agent already logged today (last line contains today's date)
LAST_LINE=$(tail -1 "$SESSIONS_FILE")
if echo "$LAST_LINE" | grep -q "$TODAY"; then
  # Agent already logged — skip
  exit 0
fi

# Agent didn't log — append a minimal "session happened" row
echo "| $TODAY | UNKNOWN | - | - | - | - | Session ended without agent log |" >> "$SESSIONS_FILE"
