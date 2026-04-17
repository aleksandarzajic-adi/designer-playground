import type { ExtractedComponent } from '@dp/figma-extractor';
import type { ComponentSpec } from '@dp/diff-engine';

const STATE_PROP_NAMES = new Set(['state', 'status']);
const STATE_VALUE_MAP: Record<string, string> = {
  disabled: 'disabled',
  loading: 'loading',
  invalid: 'invalid',
  error: 'invalid',
  selected: 'selected',
  readonly: 'readonly',
  readOnly: 'readonly',
};

const normalizeKey = (k: string) =>
  k
    .replace(/[_\s-]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toLowerCase());

const normalizeValue = (v: string) =>
  v
    .toLowerCase()
    .replace(/[_\s-]+(.)/g, (_, c) => c.toUpperCase());

export function specFromSnapshot(snapshot: ExtractedComponent): ComponentSpec {
  const variants: Record<string, string[]> = {};
  const states = new Set<string>();

  for (const [rawKey, rawValues] of Object.entries(snapshot.variants.propertyDefinitions)) {
    const key = normalizeKey(rawKey);
    if (STATE_PROP_NAMES.has(key.toLowerCase())) {
      for (const v of rawValues) {
        const mapped = STATE_VALUE_MAP[v.toLowerCase()];
        if (mapped) states.add(mapped);
      }
      continue;
    }
    variants[key] = rawValues.map(normalizeValue);
  }

  for (const [k, v] of Object.entries(snapshot.variants.fromNameConvention)) {
    if (STATE_PROP_NAMES.has(k.toLowerCase())) {
      const mapped = STATE_VALUE_MAP[v.toLowerCase()];
      if (mapped) states.add(mapped);
    }
  }

  return { variants, states: [...states] };
}
