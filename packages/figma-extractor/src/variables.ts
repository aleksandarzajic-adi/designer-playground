import type { FigmaClient } from './client';

export interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  valuesByMode: Record<string, unknown>;
  scopes: string[];
  variableCollectionId: string;
}

export interface FigmaVariableCollection {
  id: string;
  name: string;
  modes: { modeId: string; name: string }[];
  defaultModeId: string;
  variableIds: string[];
}

export interface FigmaVariablesResponse {
  status: number;
  error: boolean;
  meta: {
    variables: Record<string, FigmaVariable>;
    variableCollections: Record<string, FigmaVariableCollection>;
  };
}

export interface ExtractedTokenMap {
  modes: string[];
  tokensByMode: Record<string, Record<string, string>>;
}

const rgbaToHex = (c: { r: number; g: number; b: number; a?: number }): string => {
  const to = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0');
  const hex = `#${to(c.r)}${to(c.g)}${to(c.b)}`;
  return c.a !== undefined && c.a < 1 ? `${hex}${to(c.a)}` : hex;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function fetchVariables(
  client: FigmaClient,
  fileKey: string,
): Promise<FigmaVariablesResponse> {
  return client.request<FigmaVariablesResponse>(`/files/${fileKey}/variables/local`);
}

export function resolveVariableValue(
  variable: FigmaVariable,
  modeId: string,
  all: Record<string, FigmaVariable>,
  seen = new Set<string>(),
): string | null {
  if (seen.has(variable.id)) return null;
  seen.add(variable.id);

  const raw = variable.valuesByMode[modeId];
  if (raw === undefined) return null;

  if (typeof raw === 'object' && raw !== null && 'type' in (raw as object)) {
    const ref = raw as { type: string; id: string };
    if (ref.type === 'VARIABLE_ALIAS') {
      const target = all[ref.id];
      if (!target) return null;
      return resolveVariableValue(target, modeId, all, seen);
    }
  }

  switch (variable.resolvedType) {
    case 'COLOR':
      return rgbaToHex(raw as { r: number; g: number; b: number; a?: number });
    case 'FLOAT':
      return `${raw}px`;
    case 'STRING':
      return String(raw);
    case 'BOOLEAN':
      return String(raw);
  }
}

export function extractVariableTokens(response: FigmaVariablesResponse): ExtractedTokenMap {
  const { variables, variableCollections } = response.meta;
  const modes = new Set<string>();
  const tokensByMode: Record<string, Record<string, string>> = {};

  for (const collection of Object.values(variableCollections)) {
    for (const mode of collection.modes) {
      const modeKey = slugify(mode.name);
      modes.add(modeKey);
      tokensByMode[modeKey] ??= {};

      for (const varId of collection.variableIds) {
        const v = variables[varId];
        if (!v) continue;
        const value = resolveVariableValue(v, mode.modeId, variables);
        if (value === null) continue;
        const cssName = `--dp-${slugify(v.name)}`;
        tokensByMode[modeKey][cssName] = value;
      }
    }
  }

  return { modes: [...modes], tokensByMode };
}
