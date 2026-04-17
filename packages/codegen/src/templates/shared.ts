const PASCAL_SPLIT = /[\s_\-/]+/;

export const toPascal = (s: string) =>
  s
    .split(PASCAL_SPLIT)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

export const toCamel = (s: string) => {
  const p = toPascal(s);
  return p.charAt(0).toLowerCase() + p.slice(1);
};

export const unionLiteral = (values: string[]) =>
  values.length > 0 ? values.map((v) => `'${v}'`).join(' | ') : "''";

export const defaultOf = (values: string[]) => values[0] ?? '';

export interface ArchetypeSpec {
  componentName: string;
  fileName: string;
  variants: Record<string, string[]>;
  states: string[];
}

export interface TemplateOutput {
  componentName: string;
  fileName: string;
  source: string;
}

export type TemplateFn = (spec: ArchetypeSpec) => TemplateOutput;
