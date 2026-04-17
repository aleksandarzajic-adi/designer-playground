import Anthropic from '@anthropic-ai/sdk';

export interface ClaudeOptions {
  apiKey?: string;
  model?: string;
}

export class ClaudeClient {
  private client: Anthropic;
  private model: string;

  constructor(opts: ClaudeOptions = {}) {
    const apiKey = opts.apiKey ?? process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY required');
    this.client = new Anthropic({ apiKey });
    this.model = opts.model ?? process.env.ANTHROPIC_MODEL ?? 'claude-opus-4-7';
  }

  async complete(system: string, user: string, maxTokens = 4096): Promise<string> {
    const resp = await this.client.messages.create({
      model: this.model,
      max_tokens: maxTokens,
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }] as any,
      messages: [{ role: 'user', content: user }],
    });
    const block = resp.content.find((c) => c.type === 'text');
    return block && block.type === 'text' ? block.text : '';
  }

  async completeJson<T>(system: string, user: string, maxTokens = 4096): Promise<T> {
    const raw = await this.complete(system, user, maxTokens);
    const fenced = raw.match(/```json\s*\n([\s\S]+?)\n```/);
    const text = fenced ? fenced[1] : (raw.match(/\{[\s\S]+\}/)?.[0] ?? raw);
    return JSON.parse(text) as T;
  }
}
