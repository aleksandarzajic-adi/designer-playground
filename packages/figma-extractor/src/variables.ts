import type { FigmaClient } from './client';

export type FigmaVariableType = 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';

export interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: FigmaVariableType;
  valuesByMode: Record<string, unknown>;
  scopes: string[];
  variableCollectionId: string;
  description?: string;
  remote?: boolean;
  hiddenFromPublishing?: boolean;
}

export interface FigmaVariableCollection {
  id: string;
  name: string;
  modes: { modeId: string; name: string }[];
  defaultModeId: string;
  variableIds: string[];
  remote?: boolean;
  hiddenFromPublishing?: boolean;
}

export interface FigmaVariablesResponse {
  status: number;
  error: boolean;
  meta: {
    variables: Record<string, FigmaVariable>;
    variableCollections: Record<string, FigmaVariableCollection>;
  };
}

export interface TokenEntry {
  name: string;
  cssVar: string;
  type: FigmaVariableType;
  group: string;
  collection: string;
  value: string;
  rawValue: unknown;
  scopes: string[];
  description?: string;
}

export interface ExtractedVariableTokens {
  modes: string[];
  defaultMode: string;
  collections: string[];
  tokensByMode: Record<string, Record<string, TokenEntry>>;
}

const UNITLESS_SCOPES = new Set(['OPACITY', 'FONT_WEIGHT', 'FONT_STYLE', 'LINE_HEIGHT']);
const PX_SCOPES = new Set([
  'WIDTH_HEIGHT',
  'GAP',
  'CORNER_RADIUS',
  'STROKE_FLOAT',
  'EFFECT_FLOAT',
  'FONT_SIZE',
  'LETTER_SPACING',
  'PARAGRAPH_SPACING',
  'PARAGRAPH_INDENT',
]);

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function rgbaToHex(c: { r: number; g: number; b: number; a?: number }): string {
  const to = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0');
  const hex = `#${to(c.r)}${to(c.g)}${to(c.b)}`;
  return c.a !== undefined && c.a < 1 ? `${hex}${to(c.a)}` : hex;
}

const UNITLESS_NAME = /\b(weight|opacity|ratio|line-?height|z-?index|multiplier)\b/i;
const MS_NAME = /\b(duration|delay|ms)\b/i;

function formatFloat(value: number, scopes: string[], varName: string): string {
  if (scopes.some((s) => UNITLESS_SCOPES.has(s))) return String(value);
  if (UNITLESS_NAME.test(varName)) return String(value);
  if (MS_NAME.test(varName)) return `${value}ms`;
  if (scopes.some((s) => PX_SCOPES.has(s))) return `${value}px`;
  return `${value}px`;
}

export function resolveVariableValue(
  variable: FigmaVariable,
  modeId: string,
  all: Record<string, FigmaVariable>,
  seen: Set<string> = new Set(),
): { value: string; rawValue: unknown } | null {
  if (seen.has(variable.id)) return null;
  seen.add(variable.id);

  let raw = variable.valuesByMode[modeId];
  if (raw === undefined) return null;

  if (raw && typeof raw === 'object' && 'type' in (raw as object)) {
    const ref = raw as { type: string; id: string };
    if (ref.type === 'VARIABLE_ALIAS') {
      const target = all[ref.id];
      if (!target) return null;
      return resolveVariableValue(target, modeId, all, seen);
    }
  }

  switch (variable.resolvedType) {
    case 'COLOR':
      return { value: rgbaToHex(raw as { r: number; g: number; b: number; a?: number }), rawValue: raw };
    case 'FLOAT':
      return { value: formatFloat(raw as number, variable.scopes, variable.name), rawValue: raw };
    case 'STRING':
      return { value: String(raw), rawValue: raw };
    case 'BOOLEAN':
      return { value: String(raw), rawValue: raw };
    default:
      return null;
  }
}

export async function fetchVariables(
  client: FigmaClient,
  fileKey: string,
): Promise<FigmaVariablesResponse> {
  return client.request<FigmaVariablesResponse>(`/files/${fileKey}/variables/local`);
}

export function extractVariableTokens(response: FigmaVariablesResponse): ExtractedVariableTokens {
  const { variables, variableCollections } = response.meta;

  const modesByName = new Map<string, string>();
  const collections: string[] = [];
  const tokensByMode: Record<string, Record<string, TokenEntry>> = {};
  let defaultModeName = '';

  for (const collection of Object.values(variableCollections)) {
    if (collection.hiddenFromPublishing) continue;
    const collectionSlug = slugify(collection.name);
    if (!collections.includes(collectionSlug)) collections.push(collectionSlug);

    for (const mode of collection.modes) {
      const modeKey = slugify(mode.name);
      modesByName.set(mode.name, modeKey);
      tokensByMode[modeKey] ??= {};
      if (collection.defaultModeId === mode.modeId && !defaultModeName) {
        defaultModeName = modeKey;
      }
    }

    for (const varId of collection.variableIds) {
      const v = variables[varId];
      if (!v || v.hiddenFromPublishing) continue;

      const pathSegments = v.name.split('/').map(slugify).filter(Boolean);
      const group = pathSegments.length > 1 ? pathSegments[0] : collectionSlug;
      const tokenName = pathSegments.join('-');
      const cssVar = `--dp-${tokenName}`;

      for (const mode of collection.modes) {
        const modeKey = slugify(mode.name);
        const resolved = resolveVariableValue(v, mode.modeId, variables);
        if (!resolved) continue;

        tokensByMode[modeKey][cssVar] = {
          name: tokenName,
          cssVar,
          type: v.resolvedType,
          group,
          collection: collectionSlug,
          value: resolved.value,
          rawValue: resolved.rawValue,
          scopes: v.scopes,
          description: v.description,
        };
      }
    }
  }

  const modes = [...new Set(tokensByMode ? Object.keys(tokensByMode) : [])];
  return {
    modes,
    defaultMode: defaultModeName || modes[0] || 'default',
    collections,
    tokensByMode,
  };
}
