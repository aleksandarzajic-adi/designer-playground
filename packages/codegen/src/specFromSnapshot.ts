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

export function specFromSnapshot(snapshot: ExtractedComponent): ComponentSpec {
  const variants: Record<string, string[]> = {};
  const states = new Set<string>();

  for (const [key, values] of Object.entries(snapshot.variants.propertyDefinitions)) {
    if (STATE_PROP_NAMES.has(key.toLowerCase())) {
      for (const v of values) {
        const mapped = STATE_VALUE_MAP[v.toLowerCase()];
        if (mapped) states.add(mapped);
      }
      continue;
    }
    variants[key] = [...values];
  }

  for (const [k, v] of Object.entries(snapshot.variants.fromNameConvention)) {
    if (STATE_PROP_NAMES.has(k.toLowerCase())) {
      const mapped = STATE_VALUE_MAP[v.toLowerCase()];
      if (mapped) states.add(mapped);
    }
  }

  return { variants, states: [...states] };
}
