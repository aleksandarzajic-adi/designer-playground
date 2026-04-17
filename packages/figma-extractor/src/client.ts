import type { FigmaFileResponse } from './types';

const FIGMA_API = 'https://api.figma.com/v1';

export interface FigmaClientOptions {
  token: string;
  fetchImpl?: typeof fetch;
  baseUrl?: string;
}

export class FigmaClient {
  private token: string;
  private fetchImpl: typeof fetch;
  private baseUrl: string;

  constructor({ token, fetchImpl, baseUrl }: FigmaClientOptions) {
    if (!token) throw new Error('FIGMA_TOKEN required');
    this.token = token;
    this.fetchImpl = fetchImpl ?? globalThis.fetch;
    this.baseUrl = baseUrl ?? FIGMA_API;
  }

  async request<T>(path: string): Promise<T> {
    const res = await this.fetchImpl(`${this.baseUrl}${path}`, {
      headers: { 'X-Figma-Token': this.token },
    });
    if (!res.ok) {
      throw new Error(`Figma API ${res.status}: ${await res.text()}`);
    }
    return (await res.json()) as T;
  }

  getFile(fileKey: string): Promise<FigmaFileResponse> {
    return this.request<FigmaFileResponse>(`/files/${fileKey}`);
  }

  getNodes(fileKey: string, nodeIds: string[]) {
    const ids = encodeURIComponent(nodeIds.join(','));
    return this.request<{ nodes: Record<string, { document: unknown }> }>(
      `/files/${fileKey}/nodes?ids=${ids}`,
    );
  }

  getImages(fileKey: string, nodeIds: string[], format: 'png' | 'svg' = 'png') {
    const ids = encodeURIComponent(nodeIds.join(','));
    return this.request<{ images: Record<string, string> }>(
      `/images/${fileKey}?ids=${ids}&format=${format}`,
    );
  }
}

export async function fetchFigmaFile(
  fileKey: string,
  opts: FigmaClientOptions,
): Promise<FigmaFileResponse> {
  const client = new FigmaClient(opts);
  return client.getFile(fileKey);
}
