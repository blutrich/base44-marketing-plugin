# Trino MCP Setup

> One-command install to access Base44 analytics from Claude Code.

## Quick Install

Run this in your terminal (not inside Claude Code):

```bash
claude mcp add --transport http --scope user trino "https://mcp-s.wewix.net/mcp?mcp=trino"
```

Then restart Claude Code.

## Verify Installation

After restart, the Trino tools should be available. Test by asking Claude:

> "Show me Base44 growth numbers"

If working, you'll see real signup/publish/conversion data from the analytics warehouse.

You can also verify manually:

```bash
# Check if Trino MCP is registered
claude mcp list | grep trino
```

## What This Gives You

Read-only SQL access to Base44 analytics via the `prod` catalog:

| Table | Data |
|-------|------|
| `prod.wt_base44_users.base` | 4.5M+ builders, signups, tiers, funnel timestamps |
| `prod.base44.datadog_llm_spans_log` | LLM model usage, tokens, costs per call |
| `prod.wt_apps.base` | App metadata, classifications, publish status |
| `prod.cs_dwh.base44_user_voice_daily_pulse` | Top builder issues, ticket/highlight counts |

## Available Trino Tools

Once installed, these MCP tools become available:

| Tool | Purpose |
|------|---------|
| `trino__execute_trino_sql_query` | Run any SELECT query |
| `trino__get_table_schema` | View table columns and types |
| `trino__get_sample_data` | Preview rows from a table |
| `trino__get_table_partitions` | Check table partitioning |
| `trino__get_approx_distinct_values_with_count` | Quick cardinality estimates |

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Tools don't appear after install | Restart Claude Code completely |
| Queries fail or timeout | Check you're on Wix network or VPN |
| "MCP not found" error | Re-run the install command above |
| Permission denied | Only SELECT queries are allowed (read-only) |
| Ran command inside Claude Code | Exit Claude, run in a regular terminal, then restart Claude |

## Network Requirement

The Trino MCP connects to the Wix analytics warehouse. You must be on the Wix network (office or VPN) for queries to work.
