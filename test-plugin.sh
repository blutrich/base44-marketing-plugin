#!/bin/bash
# Comprehensive validation script for base44-marketing Claude Code plugin
# Tests: JSON validity, required fields, skill/agent existence, file references,
#         version consistency, and dry-run installation simulation.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_DIR="$REPO_ROOT/plugins/base44-marketing"
ROOT_CP="$REPO_ROOT/.claude-plugin"
INNER_CP="$PLUGIN_DIR/.claude-plugin"

PASS=0
FAIL=0
WARN=0
ERRORS=()
WARNINGS=()

pass() { ((PASS++)); echo "  ✅ $1"; }
fail() { ((FAIL++)); ERRORS+=("$1"); echo "  ❌ $1"; }
warn() { ((WARN++)); WARNINGS+=("$1"); echo "  ⚠️  $1"; }

echo "============================================"
echo " Base44 Marketing Plugin Validation"
echo "============================================"
echo ""

# ── TEST 1: plugin.json validity & required fields ──────────────────────────

echo "── Test 1: plugin.json validity & required fields ──"

for pj in "$ROOT_CP/plugin.json" "$INNER_CP/plugin.json"; do
  label="${pj#$REPO_ROOT/}"
  if [ ! -f "$pj" ]; then
    fail "$label: file missing"
    continue
  fi
  if ! python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$pj" 2>/dev/null; then
    fail "$label: invalid JSON"
    continue
  fi
  pass "$label: valid JSON"

  # Required fields
  for field in name version description author; do
    if python3 -c "import json,sys; d=json.load(open(sys.argv[1])); assert '$field' in d" "$pj" 2>/dev/null; then
      pass "$label: has required field '$field'"
    else
      fail "$label: missing required field '$field'"
    fi
  done
done
echo ""

# ── TEST 2: marketplace.json validity ────────────────────────────────────────

echo "── Test 2: marketplace.json validity ──"

MKT="$ROOT_CP/marketplace.json"
if [ ! -f "$MKT" ]; then
  fail "marketplace.json: file missing"
else
  if ! python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$MKT" 2>/dev/null; then
    fail "marketplace.json: invalid JSON"
  else
    pass "marketplace.json: valid JSON"

    # Check required fields
    for field in name plugins; do
      if python3 -c "import json,sys; d=json.load(open(sys.argv[1])); assert '$field' in d" "$MKT" 2>/dev/null; then
        pass "marketplace.json: has field '$field'"
      else
        fail "marketplace.json: missing field '$field'"
      fi
    done

    # Check each plugin source path exists
    SOURCES=$(python3 -c "
import json,sys
d=json.load(open(sys.argv[1]))
for p in d.get('plugins',[]):
    src=p.get('source','')
    if src: print(src)
" "$MKT" 2>/dev/null)

    while IFS= read -r src; do
      [ -z "$src" ] && continue
      resolved="$REPO_ROOT/$src"
      if [ -d "$resolved" ]; then
        pass "marketplace source '$src' directory exists"
      else
        fail "marketplace source '$src' directory NOT found at $resolved"
      fi
      # Source must have its own .claude-plugin/plugin.json
      if [ -f "$resolved/.claude-plugin/plugin.json" ]; then
        pass "marketplace source '$src' has .claude-plugin/plugin.json"
      else
        fail "marketplace source '$src' missing .claude-plugin/plugin.json"
      fi
    done <<< "$SOURCES"
  fi
fi
echo ""

# ── TEST 3: settings.json & hooks.json validity ─────────────────────────────

echo "── Test 3: settings.json & hooks.json validity ──"

for f in "$ROOT_CP/settings.json" "$ROOT_CP/hooks.json" \
         "$INNER_CP/settings.json" "$INNER_CP/hooks.json"; do
  label="${f#$REPO_ROOT/}"
  if [ ! -f "$f" ]; then
    warn "$label: file missing (optional)"
    continue
  fi
  if ! python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$f" 2>/dev/null; then
    fail "$label: invalid JSON"
  else
    pass "$label: valid JSON"
  fi
done
echo ""

# ── TEST 4: Version consistency ──────────────────────────────────────────────

echo "── Test 4: Version consistency ──"

VERSIONS=()
for vf in "$ROOT_CP/plugin.json" "$INNER_CP/plugin.json" "$MKT"; do
  label="${vf#$REPO_ROOT/}"
  if [ ! -f "$vf" ]; then continue; fi
  ver=$(python3 -c "
import json,sys
d=json.load(open(sys.argv[1]))
if 'version' in d:
    print(d['version'])
elif 'metadata' in d and 'version' in d['metadata']:
    print(d['metadata']['version'])
elif 'plugins' in d and len(d['plugins'])>0 and 'version' in d['plugins'][0]:
    print(d['plugins'][0]['version'])
" "$vf" 2>/dev/null)
  if [ -n "$ver" ]; then
    VERSIONS+=("$label=$ver")
  fi
done

# Also check settings.json env var
for sf in "$ROOT_CP/settings.json" "$INNER_CP/settings.json"; do
  label="${sf#$REPO_ROOT/}"
  if [ ! -f "$sf" ]; then continue; fi
  ver=$(python3 -c "
import json,sys
d=json.load(open(sys.argv[1]))
print(d.get('env',{}).get('MARKETING_PLUGIN_VERSION',''))
" "$sf" 2>/dev/null)
  if [ -n "$ver" ]; then
    VERSIONS+=("$label:env=$ver")
  fi
done

# Check all versions match
UNIQUE_VERS=$(printf '%s\n' "${VERSIONS[@]}" | sed 's/.*=//' | sort -u)
NUM_UNIQUE=$(echo "$UNIQUE_VERS" | wc -l | tr -d ' ')

if [ "$NUM_UNIQUE" -eq 1 ]; then
  pass "All versions consistent: $(echo $UNIQUE_VERS)"
else
  fail "Version mismatch found:"
  for v in "${VERSIONS[@]}"; do
    echo "      $v"
  done
fi
echo ""

# ── TEST 5: Skills existence ────────────────────────────────────────────────

echo "── Test 5: Skills referenced in CLAUDE.md exist ──"

SKILLS_DIR="$PLUGIN_DIR/skills"

# Get list of skill directories that actually exist
ACTUAL_SKILLS=()
if [ -d "$SKILLS_DIR" ]; then
  for sd in "$SKILLS_DIR"/*/; do
    [ -d "$sd" ] || continue
    name=$(basename "$sd")
    ACTUAL_SKILLS+=("$name")
  done
fi

# Check each skill dir has a SKILL.md
for skill in "${ACTUAL_SKILLS[@]}"; do
  if [ -f "$SKILLS_DIR/$skill/SKILL.md" ]; then
    pass "skill '$skill' has SKILL.md"
  else
    fail "skill '$skill' missing SKILL.md"
  fi
done

# Cross-check: skills mentioned in CLAUDE.md that should exist as directories
CLAUDE_MD="$PLUGIN_DIR/CLAUDE.md"
if [ -f "$CLAUDE_MD" ]; then
  # Extract skill names from CLAUDE.md table rows (backtick-wrapped names)
  MENTIONED=$(grep -oE '`[a-z][-a-z0-9]*`' "$CLAUDE_MD" | tr -d '`' | sort -u)
  for skill_name in $MENTIONED; do
    # Only check if it looks like a skill name (skip agent names and other refs)
    if [ -d "$SKILLS_DIR/$skill_name" ]; then
      pass "CLAUDE.md skill '$skill_name' exists in skills/"
    elif [ -f "$PLUGIN_DIR/agents/$skill_name.md" ]; then
      # It's an agent, not a skill — that's fine
      true
    else
      # Could be a keyword, not a skill — only warn if it looks like one
      if echo "$skill_name" | grep -qE '^(marketing-|brand-|linkedin-|x-|seo-|geo-|direct-|landing-|cross-|hook-|nano-|remotion|verification-)'; then
        fail "CLAUDE.md references skill '$skill_name' but no directory at skills/$skill_name/"
      fi
    fi
  done
fi
echo ""

# ── TEST 6: Agents existence ────────────────────────────────────────────────

echo "── Test 6: Agent files exist ──"

AGENTS_DIR="$PLUGIN_DIR/agents"
EXPECTED_AGENTS=(
  ad-specialist
  brand-guardian
  copywriter
  linkedin-specialist
  planner
  seo-specialist
  video-specialist
  x-specialist
)

for agent in "${EXPECTED_AGENTS[@]}"; do
  if [ -f "$AGENTS_DIR/$agent.md" ]; then
    pass "agent '$agent.md' exists"
  else
    fail "agent '$agent.md' missing from agents/"
  fi
done
echo ""

# ── TEST 7: Brand assets existence ──────────────────────────────────────────

echo "── Test 7: Brand assets integrity ──"

BRAND_DIR="$PLUGIN_DIR/brands/base44"
EXPECTED_BRAND_FILES=(
  tone-of-voice.md
  brand-system.md
  brand.json
  guidelines.md
  learning-log.md
  AGENTS.md
  RULES.md
)

for bf in "${EXPECTED_BRAND_FILES[@]}"; do
  if [ -f "$BRAND_DIR/$bf" ]; then
    pass "brand file '$bf' exists"
  else
    fail "brand file '$bf' missing from brands/base44/"
  fi
done

# Check brand.json is valid JSON
if [ -f "$BRAND_DIR/brand.json" ]; then
  if python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$BRAND_DIR/brand.json" 2>/dev/null; then
    pass "brands/base44/brand.json: valid JSON"
  else
    fail "brands/base44/brand.json: invalid JSON"
  fi
fi

# Check content-library files
for cl in ctas.md hooks.md objection-handling.md value-props.md; do
  if [ -f "$BRAND_DIR/content-library/$cl" ]; then
    pass "content-library/$cl exists"
  else
    fail "content-library/$cl missing"
  fi
done

# Check template files
for tpl in linkedin.md x.md email.md discord.md whatsnew.md; do
  if [ -f "$BRAND_DIR/templates/$tpl" ]; then
    pass "templates/$tpl exists"
  else
    fail "templates/$tpl missing"
  fi
done

# Check feedback files
for fb in testimonials.md pain-points.md; do
  if [ -f "$BRAND_DIR/feedback/$fb" ]; then
    pass "feedback/$fb exists"
  else
    fail "feedback/$fb missing"
  fi
done
echo ""

# ── TEST 8: Internal file references ────────────────────────────────────────

echo "── Test 8: Internal file references in AGENTS.md ──"

AGENTS_MD="$PLUGIN_DIR/AGENTS.md"
if [ -f "$AGENTS_MD" ]; then
  # Extract relative paths from the docs index table
  REFS=$(grep -oE 'brands/base44/[a-zA-Z0-9/_-]+\.[a-z]+' "$AGENTS_MD" 2>/dev/null || true)
  REFS="$REFS $(grep -oE 'brands/base44/[a-zA-Z0-9/_-]+/' "$AGENTS_MD" 2>/dev/null || true)"
  for ref in $REFS; do
    target="$PLUGIN_DIR/$ref"
    if [ -e "$target" ]; then
      pass "AGENTS.md ref '$ref' exists"
    else
      fail "AGENTS.md ref '$ref' NOT found"
    fi
  done
else
  fail "AGENTS.md missing"
fi
echo ""

# ── TEST 9: Skill reference files ───────────────────────────────────────────

echo "── Test 9: Skill internal references ──"

# Check that skills with reference/ or playbooks/ dirs have actual files
for skill_dir in "$SKILLS_DIR"/*/; do
  [ -d "$skill_dir" ] || continue
  skill_name=$(basename "$skill_dir")

  # Check reference dirs
  for subdir in reference playbooks scripts rules references; do
    sd="$skill_dir$subdir"
    if [ -d "$sd" ]; then
      count=$(find "$sd" -type f | wc -l | tr -d ' ')
      if [ "$count" -gt 0 ]; then
        pass "skill '$skill_name/$subdir/' has $count file(s)"
      else
        fail "skill '$skill_name/$subdir/' is empty"
      fi
    fi
  done
done
echo ""

# ── TEST 10: Dry-run installation simulation ────────────────────────────────

echo "── Test 10: Dry-run installation simulation ──"

# Simulate what `claude plugin install` would do:
# 1. Read marketplace.json from root .claude-plugin/
# 2. For each plugin entry, resolve source path
# 3. Verify source has: .claude-plugin/plugin.json, CLAUDE.md, skills/, agents/

INSTALL_SRC="$PLUGIN_DIR"

# Required for installation
INSTALL_REQUIRED=(
  ".claude-plugin/plugin.json"
  "CLAUDE.md"
)

for req in "${INSTALL_REQUIRED[@]}"; do
  if [ -e "$INSTALL_SRC/$req" ]; then
    pass "install: '$req' present"
  else
    fail "install: '$req' MISSING - installation would fail"
  fi
done

# Expected directories
for dir in skills agents brands; do
  if [ -d "$INSTALL_SRC/$dir" ]; then
    pass "install: '$dir/' directory present"
  else
    fail "install: '$dir/' directory MISSING"
  fi
done

# Verify CLAUDE.md is non-empty
if [ -f "$INSTALL_SRC/CLAUDE.md" ]; then
  lines=$(wc -l < "$INSTALL_SRC/CLAUDE.md" | tr -d ' ')
  if [ "$lines" -gt 10 ]; then
    pass "install: CLAUDE.md has $lines lines (substantial)"
  else
    warn "install: CLAUDE.md only has $lines lines (may be too minimal)"
  fi
fi

# Verify plugin name consistency between marketplace and inner plugin.json
if [ -f "$MKT" ] && [ -f "$INNER_CP/plugin.json" ]; then
  mkt_name=$(python3 -c "import json,sys; d=json.load(open(sys.argv[1])); print(d.get('plugins',[{}])[0].get('name',''))" "$MKT" 2>/dev/null)
  inner_name=$(python3 -c "import json,sys; print(json.load(open(sys.argv[1])).get('name',''))" "$INNER_CP/plugin.json" 2>/dev/null)
  if [ "$mkt_name" = "$inner_name" ]; then
    pass "install: plugin name consistent ('$inner_name')"
  else
    fail "install: plugin name mismatch - marketplace='$mkt_name' vs inner='$inner_name'"
  fi
fi

# Check no duplicate .claude-plugin/plugin.json content drift
if [ -f "$ROOT_CP/plugin.json" ] && [ -f "$INNER_CP/plugin.json" ]; then
  if diff -q "$ROOT_CP/plugin.json" "$INNER_CP/plugin.json" >/dev/null 2>&1; then
    pass "install: root and inner plugin.json are in sync"
  else
    fail "install: root and inner plugin.json have DRIFTED apart"
  fi
fi

# Check that marketplace.json has the root-level 'name' matching plugin name
if [ -f "$MKT" ]; then
  root_name=$(python3 -c "import json,sys; print(json.load(open(sys.argv[1])).get('name',''))" "$MKT" 2>/dev/null)
  if [ "$root_name" = "base44-marketing" ]; then
    pass "install: marketplace root name matches plugin"
  else
    fail "install: marketplace root name is '$root_name', expected 'base44-marketing'"
  fi
fi
echo ""

# ── TEST 11: No orphaned or empty markdown files ────────────────────────────

echo "── Test 11: No empty critical files ──"

CRITICAL_MDS=(
  "$PLUGIN_DIR/CLAUDE.md"
  "$PLUGIN_DIR/AGENTS.md"
  "$PLUGIN_DIR/brands/base44/tone-of-voice.md"
  "$PLUGIN_DIR/brands/base44/brand-system.md"
  "$PLUGIN_DIR/brands/base44/RULES.md"
)

for md in "${CRITICAL_MDS[@]}"; do
  label="${md#$PLUGIN_DIR/}"
  if [ ! -f "$md" ]; then
    fail "$label: file missing"
    continue
  fi
  size=$(wc -c < "$md" | tr -d ' ')
  if [ "$size" -lt 50 ]; then
    fail "$label: file nearly empty ($size bytes)"
  else
    pass "$label: has content ($size bytes)"
  fi
done
echo ""

# ── SUMMARY ─────────────────────────────────────────────────────────────────

echo "============================================"
echo " RESULTS"
echo "============================================"
echo "  ✅ Passed: $PASS"
echo "  ❌ Failed: $FAIL"
echo "  ⚠️  Warnings: $WARN"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo "FAILURES:"
  for err in "${ERRORS[@]}"; do
    echo "  ❌ $err"
  done
  echo ""
fi

if [ "$WARN" -gt 0 ]; then
  echo "WARNINGS:"
  for w in "${WARNINGS[@]}"; do
    echo "  ⚠️  $w"
  done
  echo ""
fi

if [ "$FAIL" -eq 0 ]; then
  echo "🎉 ALL TESTS PASSED"
  exit 0
else
  echo "💥 $FAIL TEST(S) FAILED"
  exit 1
fi
