import type { ExtractedVariants, FigmaNode } from '../types';

const NAME_SPLIT = /\s*,\s*/;
const KV_SPLIT = /\s*=\s*/;

export function parseNameConvention(name: string): { base: string; variants: Record<string, string> } {
  if (!name.includes('=')) return { base: name, variants: {} };

  const pairs = name.split(NAME_SPLIT);
  const variants: Record<string, string> = {};
  const baseParts: string[] = [];

  for (const part of pairs) {
    if (part.includes('=')) {
      const [k, v] = part.split(KV_SPLIT);
      if (k && v) variants[k.trim()] = v.trim();
    } else {
      baseParts.push(part);
    }
  }

  return { base: baseParts.join(' ').trim(), variants };
}

export function extractVariants(node: FigmaNode): ExtractedVariants {
  const { base, variants: fromName } = parseNameConvention(node.name);

  const propertyDefinitions: Record<string, string[]> = {};
  if (node.componentPropertyDefinitions) {
    for (const [key, def] of Object.entries(node.componentPropertyDefinitions)) {
      const cleanKey = key.split('#')[0];
      if (def.type === 'VARIANT' && def.variantOptions) {
        propertyDefinitions[cleanKey] = def.variantOptions;
      }
    }
  }

  if (node.type === 'COMPONENT_SET' && node.children) {
    const collected: Record<string, Set<string>> = {};
    for (const child of node.children) {
      const { variants } = parseNameConvention(child.name);
      for (const [k, v] of Object.entries(variants)) {
        (collected[k] ??= new Set()).add(v);
      }
    }
    for (const [k, set] of Object.entries(collected)) {
      if (!propertyDefinitions[k]) propertyDefinitions[k] = [...set];
    }
  }

  return {
    baseName: base || node.name,
    propertyDefinitions,
    fromNameConvention: fromName,
  };
}
