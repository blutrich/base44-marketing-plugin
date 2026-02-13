#!/bin/bash
# Validate agent teams configuration

echo "=== Agent Teams Validation ==="

# Check team templates exist
TEMPLATES=("campaign-launch" "content-sprint" "brand-audit" "ab-testing")
for t in "${TEMPLATES[@]}"; do
  if [ -f "teams/$t.md" ]; then
    echo "✅ Template: $t.md"
  else
    echo "❌ Missing template: $t.md"
  fi
done

# Check hooks
if [ -f "hooks/task-completed.sh" ]; then
  echo "✅ Hook: task-completed.sh"
else
  echo "❌ Missing hook: task-completed.sh"
fi

if [ -f "hooks/teammate-idle.sh" ]; then
  echo "✅ Hook: teammate-idle.sh"
else
  echo "❌ Missing hook: teammate-idle.sh"
fi

# Check memory protocol
if [ -f "teams/memory-protocol.md" ]; then
  echo "✅ Memory protocol defined"
else
  echo "❌ Missing memory protocol"
fi

# Check examples
if [ -f "teams/examples.md" ]; then
  echo "✅ Examples documented"
else
  echo "❌ Missing examples"
fi

# Check settings.json has agent teams enabled
if grep -q "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS" .claude-plugin/settings.json 2>/dev/null; then
  echo "✅ Agent teams enabled in settings"
else
  echo "⚠️  Agent teams not enabled in settings.json"
fi

echo ""
echo "=== Validation Complete ==="
