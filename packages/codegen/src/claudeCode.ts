import { spawn } from 'node:child_process';

export interface ClaudeCodeOptions {
  bin?: string;
  cwd?: string;
  extraArgs?: string[];
}

function runClaude(prompt: string, opts: ClaudeCodeOptions = {}): Promise<string> {
  const bin = opts.bin ?? 'claude';
  const args = ['-p', '--output-format', 'text', ...(opts.extraArgs ?? [])];

  return new Promise((resolve, reject) => {
    const proc = spawn(bin, args, {
      cwd: opts.cwd ?? process.cwd(),
      shell: process.platform === 'win32',
    });

    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk) => (stdout += chunk.toString()));
    proc.stderr.on('data', (chunk) => (stderr += chunk.toString()));
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(`claude exit ${code}: ${stderr || stdout}`));
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

  async complete(system: string, user: string): Promise<string> {
    return runClaude(`${system}\n\n---\n\n${user}`, this.opts);
  }

  async completeJson<T>(system: string, user: string): Promise<T> {
    const raw = await this.complete(system, user);
    const fenced = raw.match(/```json\s*\n([\s\S]+?)\n```/);
    const text = fenced ? fenced[1] : (raw.match(/\{[\s\S]+\}/)?.[0] ?? raw);
    return JSON.parse(text) as T;
  }
}
