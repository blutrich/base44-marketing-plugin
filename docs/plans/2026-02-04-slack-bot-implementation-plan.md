# Slack Bot Implementation Plan

> **For Claude:** REQUIRED: Follow this plan task-by-task using TDD.
> **Research Source:** Claude Agent SDK (email-agent demo pattern)

**Goal:** Build a Slack bot that exposes the marketing plugin's agents and skills via `/marketing` slash command, using Claude Agent SDK for agent orchestration.

**Architecture:** Slack Bolt (Socket Mode) + Claude Agent SDK `query()` + dynamic agent/skill loading from plugin directory. Brand context injected via `appendSystemPrompt`. Output validated through brand-guardian before delivery.

**Tech Stack:**
- Runtime: Node.js 20+
- Slack: `@slack/bolt` (Socket Mode)
- AI: `@anthropic-ai/claude-agent-sdk`
- Build: TypeScript, tsx for development
- Deploy: Railway (Nixpacks, no Docker)

**Prerequisites:**
- Slack App created with Socket Mode enabled
- `SLACK_BOT_TOKEN`, `SLACK_APP_TOKEN`, `ANTHROPIC_API_KEY` environment variables
- Plugin directory accessible at relative path

---

## Relevant Codebase Files

### Patterns to Follow
- `plugins/base44-marketing/skills/marketing-router/SKILL.md` (lines 155-175) - Decision tree for routing
- `plugins/base44-marketing/agents/brand-guardian.md` (lines 117-125) - Scoring rubric
- `plugins/base44-marketing/AGENTS.md` (lines 1-100) - Voice rules and quick reference

### Configuration Files
- `plugins/base44-marketing/brands/base44/RULES.md` - Hard rules (instant rejection)
- `plugins/base44-marketing/brands/base44/tone-of-voice.md` - Voice guide

### Agent Files to Load
- `plugins/base44-marketing/agents/linkedin-specialist.md`
- `plugins/base44-marketing/agents/x-specialist.md`
- `plugins/base44-marketing/agents/copywriter.md`
- `plugins/base44-marketing/agents/brand-guardian.md`
- `plugins/base44-marketing/agents/ad-specialist.md`
- `plugins/base44-marketing/agents/seo-specialist.md`
- `plugins/base44-marketing/agents/video-specialist.md`
- `plugins/base44-marketing/agents/planner.md`

---

## Phase 1: Project Foundation

### Task 1: Initialize Project Structure

**Files:**
- Create: `slack-bot/package.json`
- Create: `slack-bot/tsconfig.json`
- Create: `slack-bot/.env.example`
- Create: `slack-bot/.gitignore`

**Step 1: Create slack-bot directory**

```bash
mkdir -p slack-bot
```

**Step 2: Create package.json**

```json
{
  "name": "base44-marketing-slack-bot",
  "version": "1.0.0",
  "description": "Slack bot for Base44 marketing content generation using Claude Agent SDK",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "eslint src/"
  },
  "dependencies": {
    "@slack/bolt": "^4.1.0",
    "@anthropic-ai/claude-agent-sdk": "^0.1.0",
    "dotenv": "^16.4.0",
    "gray-matter": "^4.0.3"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.0",
    "vitest": "^1.2.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "eslint": "^8.56.0"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

**Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 4: Create .env.example**

```env
# Slack
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_SIGNING_SECRET=your-signing-secret

# Anthropic
ANTHROPIC_API_KEY=sk-ant-your-key

# Plugin path (relative from slack-bot directory)
PLUGIN_PATH=../plugins/base44-marketing

# Model settings
DEFAULT_MODEL=sonnet
GUARDIAN_MODEL=haiku
```

**Step 5: Create .gitignore**

```gitignore
node_modules/
dist/
.env
*.log
```

**Step 6: Commit**

```bash
git add slack-bot/
git commit -m "feat: initialize slack-bot project structure"
```

---

### Task 2: Plugin Loader Module

**Files:**
- Create: `slack-bot/src/loader/index.ts`
- Create: `slack-bot/src/loader/types.ts`
- Test: `slack-bot/src/loader/index.test.ts`

**Step 1: Define types**

```typescript
// slack-bot/src/loader/types.ts
export interface AgentFrontmatter {
  name: string;
  description: string;
  model: 'sonnet' | 'haiku' | 'opus';
  tools?: string[];
  skills?: string[];
}

export interface SkillFrontmatter {
  name: string;
  description: string;
}

export interface LoadedAgent {
  name: string;
  frontmatter: AgentFrontmatter;
  content: string;  // The markdown body (instructions)
  filePath: string;
}

export interface LoadedSkill {
  name: string;
  frontmatter: SkillFrontmatter;
  content: string;
  filePath: string;
}

export interface BrandContext {
  rules: string;
  toneOfVoice: string;
  learningLog: string;
  agentsIndex: string;
}

export interface PluginManifest {
  agents: Map<string, LoadedAgent>;
  skills: Map<string, LoadedSkill>;
  brand: BrandContext;
}
```

**Step 2: Write failing test for loadAgent**

```typescript
// slack-bot/src/loader/index.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { loadAgent, loadSkill, loadBrandContext, loadPlugin } from './index.js';
import path from 'path';

const PLUGIN_PATH = path.resolve(__dirname, '../../../plugins/base44-marketing');

describe('Plugin Loader', () => {
  describe('loadAgent', () => {
    it('should load linkedin-specialist agent with frontmatter', async () => {
      const agent = await loadAgent(path.join(PLUGIN_PATH, 'agents/linkedin-specialist.md'));

      expect(agent.name).toBe('linkedin-specialist');
      expect(agent.frontmatter.model).toBe('sonnet');
      expect(agent.frontmatter.skills).toContain('linkedin-viral');
      expect(agent.content).toContain('# LinkedIn Specialist');
    });

    it('should load brand-guardian with haiku model', async () => {
      const agent = await loadAgent(path.join(PLUGIN_PATH, 'agents/brand-guardian.md'));

      expect(agent.name).toBe('brand-guardian');
      expect(agent.frontmatter.model).toBe('haiku');
    });
  });

  describe('loadSkill', () => {
    it('should load marketing-router skill', async () => {
      const skill = await loadSkill(path.join(PLUGIN_PATH, 'skills/marketing-router/SKILL.md'));

      expect(skill.name).toBe('marketing-router');
      expect(skill.content).toContain('Decision Tree');
    });
  });

  describe('loadBrandContext', () => {
    it('should load all brand files', async () => {
      const brand = await loadBrandContext(path.join(PLUGIN_PATH, 'brands/base44'));

      expect(brand.rules).toContain('NEVER DO');
      expect(brand.toneOfVoice).toContain('Builder-Centric');
      expect(brand.agentsIndex).toContain('BUILDER-FIRST');
    });
  });

  describe('loadPlugin', () => {
    it('should load entire plugin manifest', async () => {
      const manifest = await loadPlugin(PLUGIN_PATH);

      expect(manifest.agents.has('linkedin-specialist')).toBe(true);
      expect(manifest.agents.has('brand-guardian')).toBe(true);
      expect(manifest.skills.has('marketing-router')).toBe(true);
      expect(manifest.brand.rules).toBeTruthy();
    });
  });
});
```

**Step 3: Run test to verify it fails**

Run: `cd slack-bot && npm test src/loader/index.test.ts`
Expected: FAIL - module not found

**Step 4: Implement loader**

```typescript
// slack-bot/src/loader/index.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type {
  AgentFrontmatter,
  SkillFrontmatter,
  LoadedAgent,
  LoadedSkill,
  BrandContext,
  PluginManifest,
} from './types.js';

export async function loadAgent(filePath: string): Promise<LoadedAgent> {
  const raw = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = data as AgentFrontmatter;

  return {
    name: frontmatter.name,
    frontmatter,
    content,
    filePath,
  };
}

export async function loadSkill(filePath: string): Promise<LoadedSkill> {
  const raw = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = data as SkillFrontmatter;

  return {
    name: frontmatter.name,
    frontmatter,
    content,
    filePath,
  };
}

export async function loadBrandContext(brandPath: string): Promise<BrandContext> {
  const [rules, toneOfVoice, learningLog, agentsIndex] = await Promise.all([
    fs.readFile(path.join(brandPath, 'RULES.md'), 'utf-8'),
    fs.readFile(path.join(brandPath, 'tone-of-voice.md'), 'utf-8'),
    fs.readFile(path.join(brandPath, 'learning-log.md'), 'utf-8').catch(() => ''),
    fs.readFile(path.join(brandPath, '../AGENTS.md'), 'utf-8'),
  ]);

  return { rules, toneOfVoice, learningLog, agentsIndex };
}

async function listMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    } else if (entry.isDirectory()) {
      // Check for SKILL.md in subdirectory
      const skillPath = path.join(fullPath, 'SKILL.md');
      try {
        await fs.access(skillPath);
        files.push(skillPath);
      } catch {
        // No SKILL.md, skip
      }
    }
  }

  return files;
}

export async function loadPlugin(pluginPath: string): Promise<PluginManifest> {
  const agentsDir = path.join(pluginPath, 'agents');
  const skillsDir = path.join(pluginPath, 'skills');
  const brandDir = path.join(pluginPath, 'brands/base44');

  // Load all agents
  const agentFiles = await listMarkdownFiles(agentsDir);
  const agents = new Map<string, LoadedAgent>();
  for (const file of agentFiles) {
    const agent = await loadAgent(file);
    agents.set(agent.name, agent);
  }

  // Load all skills
  const skillFiles = await listMarkdownFiles(skillsDir);
  const skills = new Map<string, LoadedSkill>();
  for (const file of skillFiles) {
    const skill = await loadSkill(file);
    skills.set(skill.name, skill);
  }

  // Load brand context
  const brand = await loadBrandContext(brandDir);

  return { agents, skills, brand };
}

export type { PluginManifest, LoadedAgent, LoadedSkill, BrandContext };
```

**Step 5: Run test to verify it passes**

Run: `cd slack-bot && npm test src/loader/index.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add slack-bot/src/loader/
git commit -m "feat: add plugin loader for agents, skills, and brand context"
```

---

### Task 3: Marketing Router Module

**Files:**
- Create: `slack-bot/src/router/index.ts`
- Create: `slack-bot/src/router/types.ts`
- Test: `slack-bot/src/router/index.test.ts`

**Step 1: Define router types**

```typescript
// slack-bot/src/router/types.ts
export type Workflow =
  | 'BRAINSTORM'
  | 'PAID_AD'
  | 'REPURPOSE'
  | 'CAMPAIGN'
  | 'X'
  | 'LINKEDIN'
  | 'EMAIL'
  | 'LANDING'
  | 'SEO'
  | 'VIDEO'
  | 'CONTENT';

export interface RouteMatch {
  workflow: Workflow;
  confidence: number;  // 0-1
  matchedKeywords: string[];
  primaryAgent: string;
  chain: string[];  // Agent chain: [specialist, brand-guardian]
}

export interface RouterConfig {
  routes: Array<{
    workflow: Workflow;
    priority: number;
    keywords: string[];
    agent: string;
  }>;
}
```

**Step 2: Write failing test**

```typescript
// slack-bot/src/router/index.test.ts
import { describe, it, expect } from 'vitest';
import { routeRequest, MarketingRouter } from './index.js';

describe('Marketing Router', () => {
  describe('routeRequest', () => {
    it('should route LinkedIn requests correctly', () => {
      const result = routeRequest('Write a LinkedIn post about our new feature');

      expect(result.workflow).toBe('LINKEDIN');
      expect(result.primaryAgent).toBe('linkedin-specialist');
      expect(result.chain).toContain('brand-guardian');
    });

    it('should route X/Twitter requests correctly', () => {
      const result = routeRequest('Create a tweet thread about Base44');

      expect(result.workflow).toBe('X');
      expect(result.primaryAgent).toBe('x-specialist');
    });

    it('should prioritize PAID_AD over LINKEDIN when ad keywords present', () => {
      const result = routeRequest('Create a LinkedIn ad for our product');

      expect(result.workflow).toBe('PAID_AD');
      expect(result.primaryAgent).toBe('ad-specialist');
    });

    it('should route brainstorm requests to ideation', () => {
      const result = routeRequest('Give me ideas for promoting our launch');

      expect(result.workflow).toBe('BRAINSTORM');
    });

    it('should route campaign requests for multi-channel', () => {
      const result = routeRequest('Plan a campaign for our new feature launch');

      expect(result.workflow).toBe('CAMPAIGN');
      expect(result.primaryAgent).toBe('planner');
    });

    it('should default to CONTENT for generic requests', () => {
      const result = routeRequest('Write something about Base44');

      expect(result.workflow).toBe('CONTENT');
    });
  });
});
```

**Step 3: Run test to verify it fails**

Run: `cd slack-bot && npm test src/router/index.test.ts`
Expected: FAIL - module not found

**Step 4: Implement router**

```typescript
// slack-bot/src/router/index.ts
import type { Workflow, RouteMatch, RouterConfig } from './types.js';

// Decision tree from marketing-router/SKILL.md (lines 155-175)
const ROUTES: RouterConfig['routes'] = [
  {
    workflow: 'BRAINSTORM',
    priority: 0,
    keywords: ['ideas', 'brainstorm', 'tactics', 'amplify', 'promote', 'growth hacks'],
    agent: 'planner',
  },
  {
    workflow: 'PAID_AD',
    priority: 1,
    keywords: ['ad', 'paid', 'meta ad', 'facebook ad', 'instagram ad', 'linkedin ad', 'reddit ad', 'creative', 'banner', 'sponsored'],
    agent: 'ad-specialist',
  },
  {
    workflow: 'REPURPOSE',
    priority: 2,
    keywords: ['repurpose', 'transform', 'convert', 'adapt', 'rewrite for'],
    agent: 'copywriter',
  },
  {
    workflow: 'CAMPAIGN',
    priority: 3,
    keywords: ['campaign', 'launch', 'multi-channel', 'announcement'],
    agent: 'planner',
  },
  {
    workflow: 'X',
    priority: 4,
    keywords: ['x', 'twitter', 'tweet', 'thread'],
    agent: 'x-specialist',
  },
  {
    workflow: 'LINKEDIN',
    priority: 5,
    keywords: ['linkedin', 'post', 'social', 'viral'],
    agent: 'linkedin-specialist',
  },
  {
    workflow: 'EMAIL',
    priority: 6,
    keywords: ['email', 'nurture', 'sequence', 'drip'],
    agent: 'copywriter',
  },
  {
    workflow: 'LANDING',
    priority: 7,
    keywords: ['landing page', 'sales page', 'signup'],
    agent: 'copywriter',
  },
  {
    workflow: 'SEO',
    priority: 8,
    keywords: ['blog', 'seo', 'article', 'pillar'],
    agent: 'seo-specialist',
  },
  {
    workflow: 'VIDEO',
    priority: 9,
    keywords: ['video', 'remotion', 'animation', 'thumbnail', 'clip', 'reel'],
    agent: 'video-specialist',
  },
];

export function routeRequest(prompt: string): RouteMatch {
  const lowerPrompt = prompt.toLowerCase();

  // Find all matching routes
  const matches: Array<{ route: typeof ROUTES[0]; matchedKeywords: string[] }> = [];

  for (const route of ROUTES) {
    const matchedKeywords = route.keywords.filter(kw =>
      lowerPrompt.includes(kw.toLowerCase())
    );

    if (matchedKeywords.length > 0) {
      matches.push({ route, matchedKeywords });
    }
  }

  // Sort by priority (lower = higher priority)
  matches.sort((a, b) => a.route.priority - b.route.priority);

  // Return best match or default
  if (matches.length > 0) {
    const best = matches[0];
    return {
      workflow: best.route.workflow,
      confidence: Math.min(best.matchedKeywords.length / 2, 1),
      matchedKeywords: best.matchedKeywords,
      primaryAgent: best.route.agent,
      chain: [best.route.agent, 'brand-guardian'],
    };
  }

  // Default to CONTENT
  return {
    workflow: 'CONTENT',
    confidence: 0.3,
    matchedKeywords: [],
    primaryAgent: 'copywriter',
    chain: ['copywriter', 'brand-guardian'],
  };
}

export class MarketingRouter {
  route(prompt: string): RouteMatch {
    return routeRequest(prompt);
  }
}

export type { RouteMatch, Workflow };
```

**Step 5: Run test to verify it passes**

Run: `cd slack-bot && npm test src/router/index.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add slack-bot/src/router/
git commit -m "feat: add marketing router with decision tree from plugin"
```

---

## Phase 2: Claude Agent SDK Integration

### Task 4: Agent Executor Module

**Files:**
- Create: `slack-bot/src/agent/executor.ts`
- Create: `slack-bot/src/agent/types.ts`
- Create: `slack-bot/src/agent/prompt-builder.ts`
- Test: `slack-bot/src/agent/executor.test.ts`

**Step 1: Define agent executor types**

```typescript
// slack-bot/src/agent/types.ts
import type { LoadedAgent, BrandContext } from '../loader/types.js';
import type { RouteMatch } from '../router/types.js';

export interface ExecutionContext {
  route: RouteMatch;
  userPrompt: string;
  channelId: string;
  userId: string;
}

export interface AgentResult {
  content: string;
  agent: string;
  score?: number;  // From brand-guardian
  verdict?: 'APPROVED' | 'NEEDS_REVISION' | 'REJECTED';
  metadata?: Record<string, unknown>;
}

export interface ExecutorConfig {
  maxTurns: number;
  defaultModel: 'sonnet' | 'haiku' | 'opus';
  guardianModel: 'haiku';
}
```

**Step 2: Create prompt builder**

```typescript
// slack-bot/src/agent/prompt-builder.ts
import type { LoadedAgent, BrandContext } from '../loader/types.js';
import type { RouteMatch } from '../router/types.js';

export function buildSystemPrompt(
  agent: LoadedAgent,
  brand: BrandContext,
  route: RouteMatch
): string {
  return `
# Brand Context (READ FIRST)

## Hard Rules (Instant Rejection)
${brand.rules}

## Tone of Voice
${brand.toneOfVoice}

## Agent Index
${brand.agentsIndex}

---

# Agent Instructions: ${agent.name}

${agent.content}

---

# Current Task

**Workflow:** ${route.workflow}
**Confidence:** ${(route.confidence * 100).toFixed(0)}%
**Matched Keywords:** ${route.matchedKeywords.join(', ') || 'none'}

Execute this task following the agent instructions above. Apply brand rules strictly.
`.trim();
}

export function buildGuardianPrompt(
  content: string,
  brand: BrandContext
): string {
  return `
# Brand Guardian Review

## Brand Rules
${brand.rules}

## Tone of Voice
${brand.toneOfVoice}

---

## Content to Review

${content}

---

## Your Task

1. Run self-critique gate (banned phrases, format, numbers, anti-AI)
2. Score the content (1-10)
3. Provide evidence-based verdict
4. If score < 9, provide corrected version

Output format:
- Score: X/10
- Verdict: APPROVED | NEEDS_REVISION | REJECTED
- Evidence: [table of checks]
- Revised Version: [if needed]
`.trim();
}
```

**Step 3: Write failing test for executor**

```typescript
// slack-bot/src/agent/executor.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AgentExecutor } from './executor.js';
import type { PluginManifest } from '../loader/types.js';

// Mock the claude-agent-sdk
vi.mock('@anthropic-ai/claude-agent-sdk', () => ({
  query: vi.fn(async function* ({ prompt, options }) {
    yield {
      type: 'assistant',
      content: [{ type: 'text', text: 'Mock content from agent' }],
    };
  }),
}));

describe('AgentExecutor', () => {
  let executor: AgentExecutor;
  let mockManifest: PluginManifest;

  beforeEach(() => {
    mockManifest = {
      agents: new Map([
        ['linkedin-specialist', {
          name: 'linkedin-specialist',
          frontmatter: { name: 'linkedin-specialist', description: 'test', model: 'sonnet' },
          content: '# Test Agent',
          filePath: '/test/path.md',
        }],
        ['brand-guardian', {
          name: 'brand-guardian',
          frontmatter: { name: 'brand-guardian', description: 'test', model: 'haiku' },
          content: '# Brand Guardian',
          filePath: '/test/guardian.md',
        }],
      ]),
      skills: new Map(),
      brand: {
        rules: '# Rules',
        toneOfVoice: '# Voice',
        learningLog: '',
        agentsIndex: '# Index',
      },
    };

    executor = new AgentExecutor(mockManifest);
  });

  it('should execute agent chain and return result', async () => {
    const result = await executor.execute({
      route: {
        workflow: 'LINKEDIN',
        confidence: 0.9,
        matchedKeywords: ['linkedin'],
        primaryAgent: 'linkedin-specialist',
        chain: ['linkedin-specialist', 'brand-guardian'],
      },
      userPrompt: 'Write a post about our new feature',
      channelId: 'C123',
      userId: 'U456',
    });

    expect(result.content).toBeTruthy();
    expect(result.agent).toBe('linkedin-specialist');
  });
});
```

**Step 4: Run test to verify it fails**

Run: `cd slack-bot && npm test src/agent/executor.test.ts`
Expected: FAIL - module not found

**Step 5: Implement executor**

```typescript
// slack-bot/src/agent/executor.ts
import { query } from '@anthropic-ai/claude-agent-sdk';
import type { PluginManifest, LoadedAgent } from '../loader/types.js';
import type { ExecutionContext, AgentResult, ExecutorConfig } from './types.js';
import { buildSystemPrompt, buildGuardianPrompt } from './prompt-builder.js';

const DEFAULT_CONFIG: ExecutorConfig = {
  maxTurns: 50,
  defaultModel: 'sonnet',
  guardianModel: 'haiku',
};

export class AgentExecutor {
  private manifest: PluginManifest;
  private config: ExecutorConfig;

  constructor(manifest: PluginManifest, config: Partial<ExecutorConfig> = {}) {
    this.manifest = manifest;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async execute(context: ExecutionContext): Promise<AgentResult> {
    const { route, userPrompt } = context;

    // Get primary agent
    const agent = this.manifest.agents.get(route.primaryAgent);
    if (!agent) {
      throw new Error(`Agent not found: ${route.primaryAgent}`);
    }

    // Build system prompt with brand context
    const systemPrompt = buildSystemPrompt(agent, this.manifest.brand, route);

    // Execute primary agent
    const agentContent = await this.runAgent(userPrompt, systemPrompt, agent.frontmatter.model);

    // Run through brand-guardian
    const guardian = this.manifest.agents.get('brand-guardian');
    if (!guardian) {
      // No guardian, return as-is
      return {
        content: agentContent,
        agent: route.primaryAgent,
      };
    }

    const guardianPrompt = buildGuardianPrompt(agentContent, this.manifest.brand);
    const guardianResult = await this.runAgent(
      guardianPrompt,
      guardian.content,
      'haiku'
    );

    // Parse guardian result
    const { score, verdict, revisedContent } = this.parseGuardianResult(guardianResult);

    return {
      content: revisedContent || agentContent,
      agent: route.primaryAgent,
      score,
      verdict,
      metadata: {
        originalContent: agentContent,
        guardianReview: guardianResult,
      },
    };
  }

  private async runAgent(
    prompt: string,
    systemPrompt: string,
    model: 'sonnet' | 'haiku' | 'opus'
  ): Promise<string> {
    const options = {
      maxTurns: this.config.maxTurns,
      model,
      appendSystemPrompt: systemPrompt,
      allowedTools: ['Read'],  // Minimal tools for content generation
    };

    let result = '';
    for await (const message of query({ prompt, options })) {
      if (message.type === 'assistant' && message.content) {
        for (const block of message.content) {
          if (block.type === 'text') {
            result += block.text;
          }
        }
      }
    }

    return result;
  }

  private parseGuardianResult(result: string): {
    score?: number;
    verdict?: 'APPROVED' | 'NEEDS_REVISION' | 'REJECTED';
    revisedContent?: string;
  } {
    // Extract score
    const scoreMatch = result.match(/Score:\s*(\d+)\/10/i);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : undefined;

    // Extract verdict
    let verdict: 'APPROVED' | 'NEEDS_REVISION' | 'REJECTED' | undefined;
    if (result.includes('APPROVED')) verdict = 'APPROVED';
    else if (result.includes('NEEDS_REVISION')) verdict = 'NEEDS_REVISION';
    else if (result.includes('REJECTED')) verdict = 'REJECTED';

    // Extract revised content (if any)
    const revisedMatch = result.match(/Revised Version[:\s]*\n([\s\S]+?)(?=\n##|\n---|\z)/i);
    const revisedContent = revisedMatch ? revisedMatch[1].trim() : undefined;

    return { score, verdict, revisedContent };
  }
}
```

**Step 6: Run test to verify it passes**

Run: `cd slack-bot && npm test src/agent/executor.test.ts`
Expected: PASS

**Step 7: Commit**

```bash
git add slack-bot/src/agent/
git commit -m "feat: add agent executor with Claude SDK integration"
```

---

## Phase 3: Slack Integration

### Task 5: Slack Bot Core

**Files:**
- Create: `slack-bot/src/slack/app.ts`
- Create: `slack-bot/src/slack/handlers.ts`
- Create: `slack-bot/src/slack/formatters.ts`
- Test: `slack-bot/src/slack/handlers.test.ts`

**Step 1: Create Slack app setup**

```typescript
// slack-bot/src/slack/app.ts
import { App, LogLevel } from '@slack/bolt';

export function createSlackApp() {
  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
    logLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
  });

  return app;
}

export type SlackApp = ReturnType<typeof createSlackApp>;
```

**Step 2: Create formatters**

```typescript
// slack-bot/src/slack/formatters.ts
import type { AgentResult } from '../agent/types.js';
import type { RouteMatch } from '../router/types.js';

export function formatRouteInfo(route: RouteMatch): string {
  return [
    `*Workflow:* ${route.workflow}`,
    `*Agent:* ${route.primaryAgent}`,
    `*Confidence:* ${(route.confidence * 100).toFixed(0)}%`,
  ].join(' | ');
}

export function formatAgentResult(result: AgentResult): Array<Record<string, unknown>> {
  const blocks: Array<Record<string, unknown>> = [];

  // Header
  blocks.push({
    type: 'header',
    text: {
      type: 'plain_text',
      text: `Content from ${result.agent}`,
    },
  });

  // Score badge (if available)
  if (result.score !== undefined && result.verdict) {
    const emoji = result.verdict === 'APPROVED' ? ':white_check_mark:' :
                  result.verdict === 'NEEDS_REVISION' ? ':warning:' : ':x:';
    blocks.push({
      type: 'context',
      elements: [{
        type: 'mrkdwn',
        text: `${emoji} *Score:* ${result.score}/10 | *Verdict:* ${result.verdict}`,
      }],
    });
  }

  // Main content
  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: result.content.slice(0, 3000),  // Slack limit
    },
  });

  // Copy button
  blocks.push({
    type: 'actions',
    elements: [{
      type: 'button',
      text: {
        type: 'plain_text',
        text: 'Copy to Clipboard',
      },
      action_id: 'copy_content',
      value: result.content.slice(0, 2000),
    }],
  });

  return blocks;
}

export function formatError(error: Error): Array<Record<string, unknown>> {
  return [{
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `:x: *Error:* ${error.message}`,
    },
  }];
}

export function formatProcessing(route: RouteMatch): Array<Record<string, unknown>> {
  return [{
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `:hourglass_flowing_sand: Processing *${route.workflow}* request with *${route.primaryAgent}*...`,
    },
  }];
}
```

**Step 3: Create handlers**

```typescript
// slack-bot/src/slack/handlers.ts
import type { SlackCommandMiddlewareArgs, AllMiddlewareArgs } from '@slack/bolt';
import type { PluginManifest } from '../loader/types.js';
import { MarketingRouter } from '../router/index.js';
import { AgentExecutor } from '../agent/executor.js';
import { formatRouteInfo, formatAgentResult, formatError, formatProcessing } from './formatters.js';

export function createMarketingCommandHandler(manifest: PluginManifest) {
  const router = new MarketingRouter();
  const executor = new AgentExecutor(manifest);

  return async ({ command, ack, respond, client }: SlackCommandMiddlewareArgs & AllMiddlewareArgs) => {
    // Acknowledge immediately (Slack requires response within 3 seconds)
    await ack();

    const prompt = command.text.trim();
    if (!prompt) {
      await respond({
        text: 'Please provide a prompt. Example: `/marketing Write a LinkedIn post about our new feature`',
      });
      return;
    }

    // Route the request
    const route = router.route(prompt);

    // Send processing message
    await respond({
      blocks: formatProcessing(route),
      response_type: 'ephemeral',
    });

    try {
      // Execute agent chain
      const result = await executor.execute({
        route,
        userPrompt: prompt,
        channelId: command.channel_id,
        userId: command.user_id,
      });

      // Send result
      await client.chat.postMessage({
        channel: command.channel_id,
        text: `Marketing content from ${result.agent}`,
        blocks: [
          {
            type: 'context',
            elements: [{
              type: 'mrkdwn',
              text: formatRouteInfo(route),
            }],
          },
          ...formatAgentResult(result),
        ],
      });

    } catch (error) {
      await respond({
        blocks: formatError(error instanceof Error ? error : new Error(String(error))),
        response_type: 'ephemeral',
      });
    }
  };
}

export function createCopyActionHandler() {
  return async ({ ack, body, client }: { ack: () => Promise<void>; body: Record<string, unknown>; client: Record<string, unknown> }) => {
    await ack();
    // Note: Slack doesn't support clipboard access directly
    // The button click is acknowledged, user copies manually
  };
}
```

**Step 4: Write test for handlers**

```typescript
// slack-bot/src/slack/handlers.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMarketingCommandHandler } from './handlers.js';
import type { PluginManifest } from '../loader/types.js';

vi.mock('@anthropic-ai/claude-agent-sdk', () => ({
  query: vi.fn(async function* () {
    yield {
      type: 'assistant',
      content: [{ type: 'text', text: 'Generated LinkedIn post content' }],
    };
  }),
}));

describe('Slack Handlers', () => {
  let mockManifest: PluginManifest;
  let handler: ReturnType<typeof createMarketingCommandHandler>;

  beforeEach(() => {
    mockManifest = {
      agents: new Map([
        ['linkedin-specialist', {
          name: 'linkedin-specialist',
          frontmatter: { name: 'linkedin-specialist', description: 'test', model: 'sonnet' },
          content: '# Test',
          filePath: '/test.md',
        }],
        ['brand-guardian', {
          name: 'brand-guardian',
          frontmatter: { name: 'brand-guardian', description: 'test', model: 'haiku' },
          content: '# Guardian',
          filePath: '/guardian.md',
        }],
      ]),
      skills: new Map(),
      brand: {
        rules: '# Rules',
        toneOfVoice: '# Voice',
        learningLog: '',
        agentsIndex: '# Index',
      },
    };

    handler = createMarketingCommandHandler(mockManifest);
  });

  it('should acknowledge and process command', async () => {
    const ack = vi.fn().mockResolvedValue(undefined);
    const respond = vi.fn().mockResolvedValue(undefined);
    const client = {
      chat: {
        postMessage: vi.fn().mockResolvedValue({}),
      },
    };

    await handler({
      command: {
        text: 'Write a LinkedIn post',
        channel_id: 'C123',
        user_id: 'U456',
      },
      ack,
      respond,
      client,
    } as any);

    expect(ack).toHaveBeenCalled();
    expect(respond).toHaveBeenCalled();
  });

  it('should respond with error for empty prompt', async () => {
    const ack = vi.fn().mockResolvedValue(undefined);
    const respond = vi.fn().mockResolvedValue(undefined);

    await handler({
      command: {
        text: '',
        channel_id: 'C123',
        user_id: 'U456',
      },
      ack,
      respond,
      client: {},
    } as any);

    expect(ack).toHaveBeenCalled();
    expect(respond).toHaveBeenCalledWith(expect.objectContaining({
      text: expect.stringContaining('provide a prompt'),
    }));
  });
});
```

**Step 5: Run test to verify it passes**

Run: `cd slack-bot && npm test src/slack/handlers.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add slack-bot/src/slack/
git commit -m "feat: add Slack bot handlers with /marketing command"
```

---

### Task 6: Main Entry Point

**Files:**
- Create: `slack-bot/src/index.ts`
- Create: `slack-bot/src/config.ts`

**Step 1: Create config module**

```typescript
// slack-bot/src/config.ts
import { config as loadEnv } from 'dotenv';

loadEnv();

export const config = {
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN!,
    appToken: process.env.SLACK_APP_TOKEN!,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY!,
  },
  plugin: {
    path: process.env.PLUGIN_PATH || '../plugins/base44-marketing',
  },
  models: {
    default: (process.env.DEFAULT_MODEL || 'sonnet') as 'sonnet' | 'haiku' | 'opus',
    guardian: 'haiku' as const,
  },
};

export function validateConfig(): void {
  const required = [
    ['SLACK_BOT_TOKEN', config.slack.botToken],
    ['SLACK_APP_TOKEN', config.slack.appToken],
    ['ANTHROPIC_API_KEY', config.anthropic.apiKey],
  ];

  const missing = required.filter(([, value]) => !value).map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

**Step 2: Create main entry point**

```typescript
// slack-bot/src/index.ts
import path from 'path';
import { fileURLToPath } from 'url';
import { createSlackApp } from './slack/app.js';
import { createMarketingCommandHandler, createCopyActionHandler } from './slack/handlers.js';
import { loadPlugin } from './loader/index.js';
import { config, validateConfig } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log('Starting Base44 Marketing Slack Bot...');

  // Validate configuration
  validateConfig();
  console.log('Configuration validated');

  // Load plugin
  const pluginPath = path.resolve(__dirname, '..', config.plugin.path);
  console.log(`Loading plugin from: ${pluginPath}`);

  const manifest = await loadPlugin(pluginPath);
  console.log(`Loaded ${manifest.agents.size} agents and ${manifest.skills.size} skills`);

  // Create Slack app
  const app = createSlackApp();

  // Register /marketing command
  app.command('/marketing', createMarketingCommandHandler(manifest));

  // Register button action
  app.action('copy_content', createCopyActionHandler());

  // Start app
  const port = process.env.PORT || 3000;
  await app.start(port);

  console.log(`Bot is running on port ${port}`);
  console.log('Available agents:', Array.from(manifest.agents.keys()).join(', '));
}

main().catch((error) => {
  console.error('Failed to start bot:', error);
  process.exit(1);
});
```

**Step 3: Commit**

```bash
git add slack-bot/src/index.ts slack-bot/src/config.ts
git commit -m "feat: add main entry point with plugin loading"
```

---

## Phase 4: Deployment

### Task 7: Railway Configuration

**Files:**
- Create: `slack-bot/railway.json`
- Create: `slack-bot/Procfile`
- Create: `slack-bot/nixpacks.toml`

**Step 1: Create railway.json**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

**Step 2: Create nixpacks.toml**

```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

**Step 3: Create Procfile**

```
web: npm start
```

**Step 4: Update package.json for Railway**

Add to package.json:
```json
{
  "scripts": {
    "postinstall": "npm run build"
  }
}
```

**Step 5: Commit**

```bash
git add slack-bot/railway.json slack-bot/nixpacks.toml slack-bot/Procfile
git commit -m "feat: add Railway deployment configuration"
```

---

### Task 8: Documentation

**Files:**
- Create: `slack-bot/README.md`

**Step 1: Create README**

```markdown
# Base44 Marketing Slack Bot

Slack bot that exposes the Base44 marketing plugin through `/marketing` commands.

## Architecture

```
/marketing "Write a LinkedIn post"
       │
       ▼
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│   Router    │────▶│ linkedin-    │────▶│ brand-        │
│ (decision   │     │ specialist   │     │ guardian      │
│  tree)      │     │ (Sonnet)     │     │ (Haiku)       │
└─────────────┘     └──────────────┘     └───────────────┘
                                                │
                                                ▼
                                         [Slack Message]
```

## Setup

### Prerequisites

1. Slack App with:
   - Bot Token Scopes: `chat:write`, `commands`
   - Socket Mode enabled
   - Slash command: `/marketing`

2. Environment variables:
   ```
   SLACK_BOT_TOKEN=xoxb-...
   SLACK_APP_TOKEN=xapp-...
   ANTHROPIC_API_KEY=sk-ant-...
   PLUGIN_PATH=../plugins/base44-marketing
   ```

### Local Development

```bash
cd slack-bot
npm install
cp .env.example .env
# Edit .env with your tokens
npm run dev
```

### Deploy to Railway

```bash
railway login
railway link
railway up
```

Set environment variables in Railway dashboard.

## Usage

```
/marketing Write a LinkedIn post about our $1M ARR milestone
/marketing Create a tweet thread about Base44
/marketing Give me ideas for promoting our launch
/marketing Create a Meta ad for signups
```

## Routing

| Keywords | Workflow | Agent |
|----------|----------|-------|
| linkedin, post, social | LINKEDIN | linkedin-specialist |
| x, twitter, tweet, thread | X | x-specialist |
| ideas, brainstorm, tactics | BRAINSTORM | planner |
| ad, paid, meta ad | PAID_AD | ad-specialist |
| email, nurture, sequence | EMAIL | copywriter |
| campaign, multi-channel | CAMPAIGN | planner |
| blog, seo, article | SEO | seo-specialist |
| video, remotion | VIDEO | video-specialist |

All content passes through `brand-guardian` before delivery.

## Scoring

| Score | Verdict | Action |
|-------|---------|--------|
| 9-10 | APPROVED | Delivered as-is |
| 7-8 | APPROVED | Delivered with notes |
| 5-6 | NEEDS_REVISION | Revised version provided |
| 1-4 | REJECTED | Error shown |
```

**Step 2: Commit**

```bash
git add slack-bot/README.md
git commit -m "docs: add Slack bot README with setup instructions"
```

---

## Phase 5: Integration Testing

### Task 9: End-to-End Test

**Files:**
- Create: `slack-bot/src/e2e/integration.test.ts`

**Step 1: Create integration test**

```typescript
// slack-bot/src/e2e/integration.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import path from 'path';
import { loadPlugin } from '../loader/index.js';
import { MarketingRouter } from '../router/index.js';
import type { PluginManifest } from '../loader/types.js';

describe('E2E Integration', () => {
  let manifest: PluginManifest;
  let router: MarketingRouter;

  beforeAll(async () => {
    const pluginPath = path.resolve(__dirname, '../../../../plugins/base44-marketing');
    manifest = await loadPlugin(pluginPath);
    router = new MarketingRouter();
  });

  it('should load all required agents', () => {
    const requiredAgents = [
      'linkedin-specialist',
      'x-specialist',
      'copywriter',
      'brand-guardian',
      'ad-specialist',
      'seo-specialist',
      'planner',
    ];

    for (const agent of requiredAgents) {
      expect(manifest.agents.has(agent), `Agent ${agent} should be loaded`).toBe(true);
    }
  });

  it('should load brand context with rules', () => {
    expect(manifest.brand.rules).toContain('NEVER DO');
    expect(manifest.brand.toneOfVoice).toContain('Builder-Centric');
  });

  it('should route LinkedIn requests to correct agent', () => {
    const route = router.route('Write a LinkedIn post about our new feature');
    expect(route.primaryAgent).toBe('linkedin-specialist');
    expect(route.chain).toContain('brand-guardian');
  });

  it('should route X requests to correct agent', () => {
    const route = router.route('Create a tweet about Base44');
    expect(route.primaryAgent).toBe('x-specialist');
  });

  it('should prioritize paid ads over social', () => {
    const route = router.route('Create a LinkedIn ad campaign');
    expect(route.workflow).toBe('PAID_AD');
    expect(route.primaryAgent).toBe('ad-specialist');
  });

  it('should have guardian as last in chain for all routes', () => {
    const prompts = [
      'Write a LinkedIn post',
      'Create a tweet',
      'Write an email',
      'Create an ad',
    ];

    for (const prompt of prompts) {
      const route = router.route(prompt);
      expect(route.chain[route.chain.length - 1]).toBe('brand-guardian');
    }
  });
});
```

**Step 2: Run integration tests**

Run: `cd slack-bot && npm test src/e2e/integration.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add slack-bot/src/e2e/
git commit -m "test: add E2E integration tests for plugin loading and routing"
```

---

## Risks

| Risk | P | I | Score | Mitigation |
|------|---|---|-------|------------|
| Claude SDK API changes | 2 | 4 | 8 | Pin SDK version, monitor releases |
| Slack 3-second timeout | 3 | 3 | 9 | Immediate ack(), async processing |
| Plugin path resolution on Railway | 2 | 4 | 8 | Use absolute paths, test in CI |
| Brand guardian rejects everything | 2 | 3 | 6 | Lower threshold for initial testing |
| Rate limits (Slack/Anthropic) | 2 | 3 | 6 | Add retry logic with backoff |

---

## Success Criteria

- [ ] `/marketing` command responds within 3 seconds (ack)
- [ ] Content generated within 30 seconds (full response)
- [ ] Routing accuracy > 90% (matches expected workflow)
- [ ] Brand guardian scores available content 7+ (APPROVED)
- [ ] All tests pass (unit + integration)
- [ ] Deploys to Railway without Docker

---

## Confidence Score: 8/10 for one-pass success

**Reasons for score:**
- Context References included with file:line references (+2)
- All edge cases documented (routing priority, timeout handling) (+1)
- Test commands specific for each task (+1)
- Risk mitigations defined (+1)
- File paths exact (+1)

**Factors that could improve it:**
- Claude Agent SDK is relatively new - actual API behavior may differ from email-agent demo
- Slack Block Kit formatting might need iteration
- Brand guardian parsing regex may need tuning
