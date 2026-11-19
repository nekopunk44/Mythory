// Runs a free coding agent on a GitHub issue in the background, without manual steps:
// creates the worktree, writes the standard prompt, starts OpenCode or Kilo headless and
// switches to the next free model when one runs out of quota or stops responding.
//
//   npm run agent:ready                    issues an agent can take right now
//   npm run agent:run -- <issue> [--tool opencode|kilo] [--model <id>] [--agent <role>]
import { execFileSync, spawn } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'

// Coarena gives $5 of credit a day and allows at most 2 requests at once, so it goes first
// and at most 2 agents use it at the same time. Free models take over when it is busy or spent.
const coarenaRunners = [
  ['opencode', 'coarena/kimi-k3-1-pro'],
  ['kilo', 'coarena/claude-sonnet-5-5'],
]
const coarenaSlots = 2
const freeRunners = [
  ['opencode', 'opencode/deepseek-v4.1-flash-free'],
  ['kilo', 'kilo/nvidia/nemotron-3-ultra-550b-a55b:free'],
  ['opencode', 'opencode/glm-5.3-flash-free'],
  ['kilo', 'kilo/cohere/north-mini-code:free'],
  ['opencode', 'opencode/mimo-v2.6-flash-free'],
  ['kilo', 'kilo/kilo-auto/free'],
]
const quotaPattern =
  /free usage limit|rate limit|too many requests|quota|insufficient (credits|balance)|payment required|credit limit/i
const idleLimitMs = 15 * 60 * 1000
const isWindows = process.platform === 'win32'

const repoRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
  encoding: 'utf8',
}).trim()
const agentsDir = path.join(
  path.dirname(repoRoot),
  `${path.basename(repoRoot)}-agents`,
)
const logsDir = path.join(agentsDir, 'logs')

const gh = (args) =>
  JSON.parse(execFileSync('gh', args, { cwd: repoRoot, encoding: 'utf8' }))

const fail = (message) => {
  console.error(message)
  process.exit(1)
}

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .split('-')
    .slice(0, 4)
    .join('-')

const dependencies = (body) =>
  [...(body.match(/^Depends on (.+)$/m)?.[1].matchAll(/#(\d+)/g) ?? [])].map(
    ([, number]) => Number(number),
  )

const openPullRequests = () =>
  gh(['pr', 'list', '--state', 'open', '--json', 'body,headRefName'])

const isTaken = (number, pullRequests) =>
  pullRequests.some(
    ({ body, headRefName }) =>
      headRefName.startsWith(`agent/${number}-`) ||
      new RegExp(`(close|closes|fix|fixes) #${number}\\b`, 'i').test(body),
  ) ||
  (existsSync(agentsDir) &&
    execFileSync('git', ['worktree', 'list'], { encoding: 'utf8' }).includes(
      `[agent/${number}-`,
    ))

const blockers = (body) =>
  dependencies(body).filter(
    (number) =>
      gh(['issue', 'view', String(number), '--json', 'state']).state === 'OPEN',
  )

const listReady = () => {
  const pullRequests = openPullRequests()
  const issues = gh([
    'issue',
    'list',
    '--label',
    'agent-ready',
    '--state',
    'open',
    '--json',
    'number,title,body',
  ])

  for (const { number, title, body } of issues.reverse()) {
    const blockedBy = blockers(body)
    const status = isTaken(number, pullRequests)
      ? 'taken'
      : blockedBy.length
        ? `waits for ${blockedBy.map((n) => `#${n}`).join(', ')}`
        : 'ready'
    console.log(`#${number}\t${status}\t${title}`)
  }
}

const promptFor = (
  number,
  title,
  branch,
) => `You are an autonomous coding agent working on GitHub issue #${number} ("${title}") of this repository, inside your own git worktree on branch ${branch}.

1. Read AGENTS.md and run \`gh issue view ${number}\`.
2. If \`git status\` shows uncommitted changes or the branch already has commits ahead of origin/main, a previous agent started this task: continue from that work, do not start over.
3. Implement the issue exactly within its scope. Work without asking questions; if you are truly blocked, comment on the issue with \`gh issue comment ${number}\` and stop.
4. Keep every file you create inside this folder. Temporary files go to .tmp/ and must be deleted before you finish.
5. Run \`npm run format\`; \`npm run check\` must pass.
6. Commit in small commits on this branch. Do NOT push and do NOT open a pull request: the owner does that.
7. End with the handoff summary from AGENTS.md.
`

const stopProcess = (child) => {
  if (isWindows) {
    execFileSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
      stdio: 'ignore',
    })
  } else {
    child.kill('SIGTERM')
  }
}

// Resolves 'done' on a normal exit, 'switch' when the model ran out of quota or hung.
const isAlive = (pid) => {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

// One lock file per Coarena slot, holding the pid of the launcher that uses it.
const acquireCoarenaSlot = () => {
  mkdirSync(logsDir, { recursive: true })
  for (let slot = 1; slot <= coarenaSlots; slot += 1) {
    const lock = path.join(logsDir, `coarena-slot-${slot}.lock`)
    if (existsSync(lock)) {
      if (isAlive(Number(readFileSync(lock, 'utf8')))) continue
      rmSync(lock, { force: true })
    }
    try {
      writeFileSync(lock, String(process.pid), { flag: 'wx' })
      return () => rmSync(lock, { force: true })
    } catch {
      continue
    }
  }
  return null
}

const runOnce = ({ tool, model, agent, cwd, promptFile, logFile, title }) =>
  new Promise((resolve) => {
    const release = model.startsWith('coarena/')
      ? acquireCoarenaSlot()
      : () => {}
    if (!release) {
      console.log(`Coarena already serves ${coarenaSlots} agents, skipping it.`)
      resolve('switch')
      return
    }

    writeFileSync(
      logFile,
      `\n=== ${tool} ${model} (${agent}) ${new Date().toISOString()}\n`,
      {
        flag: 'a',
      },
    )
    const startSize = statSync(logFile).size
    const args = [
      'run',
      '--agent',
      agent,
      '--model',
      model,
      '--title',
      title,
      '--file',
      promptFile,
      'Follow the instructions in the attached file.',
    ]
    // The CLIs are npm shims on Windows, which only start through a shell.
    const child = spawn(
      tool,
      args.map((arg) => (isWindows && arg.includes(' ') ? `"${arg}"` : arg)),
      { cwd, shell: isWindows, stdio: ['ignore', 'pipe', 'pipe'] },
    )
    let lastOutput = Date.now()
    let switching = false

    const append = (chunk) => {
      lastOutput = Date.now()
      writeFileSync(logFile, chunk, { flag: 'a' })
    }
    child.stdout.on('data', append)
    child.stderr.on('data', append)

    const watchdog = setInterval(() => {
      const output = readFileSync(logFile, 'utf8').slice(startSize)
      const outOfQuota = quotaPattern.test(output)
      const idle = Date.now() - lastOutput > idleLimitMs
      if (outOfQuota || idle) {
        switching = true
        append(
          `\n=== ${outOfQuota ? 'quota exhausted' : 'no output for 15 min'}, switching model\n`,
        )
        stopProcess(child)
      }
    }, 10_000)

    child.on('exit', () => {
      clearInterval(watchdog)
      release()
      const output = readFileSync(logFile, 'utf8').slice(startSize)
      resolve(switching || quotaPattern.test(output) ? 'switch' : 'done')
    })
  })

const runIssue = async (number, options) => {
  const issue = gh([
    'issue',
    'view',
    String(number),
    '--json',
    'title,body,state',
  ])
  if (issue.state !== 'OPEN') fail(`#${number} is closed.`)

  const blockedBy = blockers(issue.body)
  if (blockedBy.length) {
    fail(`#${number} waits for ${blockedBy.map((n) => `#${n}`).join(', ')}.`)
  }

  // Reuse the issue's worktree if an earlier run created one, so no work is lost.
  const existing = existsSync(agentsDir)
    ? readdirSync(agentsDir).find((name) => name.startsWith(`${number}-`))
    : undefined
  const task = existing ?? `${number}-${slugify(issue.title)}`
  const cwd = path.join(agentsDir, task)
  if (!existsSync(cwd)) {
    execFileSync('git', ['fetch', 'origin', 'main'], { stdio: 'inherit' })
    execFileSync(
      'node',
      [
        path.join(repoRoot, 'scripts/agent-worktree.mjs'),
        'new',
        task,
        '--from',
        'origin/main',
      ],
      { stdio: 'inherit' },
    )
  }

  const role =
    options.agent ??
    issue.body.match(/### Starting role\s+(\w[\w-]*)/)?.[1] ??
    'orchestrator'

  mkdirSync(logsDir, { recursive: true })
  const logFile = path.join(logsDir, `${task}.log`)
  const prompt = promptFor(number, issue.title, `agent/${task}`)
  const promptFile = path.join(logsDir, `${task}.prompt.md`)
  writeFileSync(promptFile, prompt)

  // Kilo ignores the project's opencode.json, so it runs its own full-access `code`
  // agent with the role description pasted into the prompt.
  const kiloPromptFile = path.join(logsDir, `${task}.kilo.prompt.md`)
  writeFileSync(
    kiloPromptFile,
    `${readFileSync(path.join(cwd, `.github/agents/${role}.agent.md`), 'utf8')}\n` +
      'In this tool the other roles are not available as subagents: do their steps yourself, in order.\n\n' +
      prompt,
  )
  // Spread parallel agents over different free models so they do not share one limit.
  const shift = number % freeRunners.length
  const runners = [
    ...(process.env.COARENA_API_KEY ? coarenaRunners : []),
    ...freeRunners.slice(shift),
    ...freeRunners.slice(0, shift),
  ]
  const queue = options.tool
    ? [
        [
          options.tool,
          options.model ?? runners.find(([tool]) => tool === options.tool)[1],
        ],
      ]
    : runners

  console.log(`#${number} → ${cwd}\nLog: ${logFile}`)

  for (const [tool, model] of queue) {
    console.log(`Running ${tool} ${model} as ${role}…`)
    const isKilo = tool === 'kilo'
    const result = await runOnce({
      tool,
      model,
      agent: isKilo ? 'code' : role,
      cwd,
      promptFile: isKilo ? kiloPromptFile : promptFile,
      logFile,
      title: `Issue #${number}`,
    })
    if (result === 'done') {
      const commits = execFileSync(
        'git',
        ['log', '--oneline', 'origin/main..HEAD'],
        {
          cwd,
          encoding: 'utf8',
        },
      )
      const dirty = execFileSync('git', ['status', '--short'], {
        cwd,
        encoding: 'utf8',
      })
      console.log(
        `Finished with ${tool} ${model}.\nCommits:\n${commits || '(none)\n'}` +
          (dirty ? `Uncommitted changes:\n${dirty}` : 'Working tree clean.'),
      )
      return
    }
    console.log(
      `${tool} ${model} ran out of quota or stalled, trying the next model.`,
    )
  }

  fail(
    'All free models are exhausted for now. The work so far stays in the worktree.',
  )
}

const [command, ...rest] = process.argv.slice(2)
const option = (name) => {
  const index = rest.indexOf(`--${name}`)
  return index === -1 ? undefined : rest[index + 1]
}

if (command === 'ready') {
  listReady()
} else if (command === 'run' && Number(rest[0])) {
  await runIssue(Number(rest[0]), {
    tool: option('tool'),
    model: option('model'),
    agent: option('agent'),
  })
} else {
  fail(
    'Usage:\n' +
      '  npm run agent:ready\n' +
      '  npm run agent:run -- <issue> [--tool opencode|kilo] [--model <id>] [--agent <role>]',
  )
}
