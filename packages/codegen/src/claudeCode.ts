import { spawn } from 'node:child_process';
import { startSpinner } from './spinner';

export interface ClaudeCodeOptions {
  bin?: string;
  cwd?: string;
  extraArgs?: string[];
  showSpinner?: boolean;
}

export interface RunOptions extends ClaudeCodeOptions {
  label?: string;
}

function runClaude(prompt: string, opts: RunOptions = {}): Promise<string> {
  const bin = opts.bin ?? process.env.CLAUDE_BIN ?? 'claude';
  const defaultArgs = [
    '-p',
    '--output-format',
    'text',
    '--allowedTools',
    'Read,Glob,Grep',
  ];
  const args = [...defaultArgs, ...(opts.extraArgs ?? [])];

  const showSpinner = opts.showSpinner !== false;
  const label = opts.label ?? 'claude code generating…';
  const spinner = showSpinner ? startSpinner(label) : null;
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const proc = spawn(bin, args, {
      cwd: opts.cwd ?? process.cwd(),
      shell: process.platform === 'win32',
    });

    let stdout = '';
    let stderr = '';
    let byteCount = 0;
    proc.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
      byteCount += chunk.length;
      spinner?.update(`${label} (${byteCount}B)`);
    });
    proc.stderr.on('data', (chunk) => (stderr += chunk.toString()));
    proc.on('error', (err) => {
      spinner?.fail(`claude failed: ${err.message}`);
      reject(err);
    });
    proc.on('close', (code) => {
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      if (code === 0) {
        spinner?.succeed(`${label} — done in ${elapsed}s`);
        resolve(stdout);
      } else {
        spinner?.fail(`claude exit ${code} after ${elapsed}s: ${stderr || stdout}`);
        reject(new Error(`claude exit ${code}: ${stderr || stdout}`));
      }
    });

    proc.stdin.write(prompt);
    proc.stdin.end();
  });
}

export class ClaudeCodeClient {
  private opts: ClaudeCodeOptions;

  constructor(opts: ClaudeCodeOptions = {}) {
    this.opts = opts;
  }

  async complete(system: string, user: string, runOpts: RunOptions = {}): Promise<string> {
    return runClaude(`${system}\n\n---\n\n${user}`, { ...this.opts, ...runOpts });
  }

  async completeJson<T>(system: string, user: string, runOpts: RunOptions = {}): Promise<T> {
    const raw = await this.complete(system, user, runOpts);
    const fenced = raw.match(/```json\s*\n([\s\S]+?)\n```/);
    const text = fenced ? fenced[1] : (raw.match(/\{[\s\S]+\}/)?.[0] ?? raw);
    return JSON.parse(text) as T;
  }
}
