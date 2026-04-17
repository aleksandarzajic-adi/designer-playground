import { Project, type SourceFile } from 'ts-morph';
import { findVariants } from './utils/findVariants';
import { updateVariants } from './utils/updateVariants';

export interface ComponentSpec {
  variants?: Record<string, string[]>;
  states?: string[];
  tokens?: Record<string, string>;
}

export interface UpdateResult {
  changed: boolean;
  addedVariants: Record<string, string[]>;
  addedProps: string[];
  addedStates: string[];
  tokenReplacements: Record<string, number>;
  diff: string;
}

const STATE_PROP_MAP: Record<string, { name: string; type: string } | null> = {
  hover: null,
  focus: null,
  pressed: null,
  active: null,
  disabled: { name: 'disabled', type: 'boolean' },
  loading: { name: 'loading', type: 'boolean' },
  selected: { name: 'selected', type: 'boolean' },
  invalid: { name: 'invalid', type: 'boolean' },
  readonly: { name: 'readOnly', type: 'boolean' },
};

function inferComponentName(sf: SourceFile, fallback: string): string {
  const iface = sf.getInterfaces().find((i) => i.getName().endsWith('Props'));
  if (iface) return iface.getName().replace(/Props$/, '');

  const fn = sf.getFunctions().find((f) => f.isExported());
  if (fn) return fn.getName() ?? fallback;

  const variable = sf
    .getVariableDeclarations()
    .find((v) => v.isExported() && /^[A-Z]/.test(v.getName()));
  if (variable) return variable.getName();

  return fallback;
}

function addStateProps(
  sf: SourceFile,
  componentName: string,
  states: string[],
): { added: string[] } {
  const added: string[] = [];
  const iface = sf.getInterface(`${componentName}Props`);
  if (!iface) return { added };

  for (const state of states) {
    const mapping = STATE_PROP_MAP[state.toLowerCase()];
    if (!mapping) continue;
    if (iface.getProperty(mapping.name)) continue;
    iface.addProperty({ name: mapping.name, type: mapping.type, hasQuestionToken: true });
    added.push(state);
  }
  return { added };
}

function replaceTokens(sf: SourceFile, tokens: Record<string, string>): Record<string, number> {
  const replacements: Record<string, number> = {};
  let text = sf.getFullText();
  let changed = false;

  for (const [from, to] of Object.entries(tokens)) {
    if (from === to) continue;
    const parts = text.split(from);
    const count = parts.length - 1;
    if (count > 0) {
      text = parts.join(to);
      replacements[from] = count;
      changed = true;
    }
  }

  if (changed) sf.replaceWithText(text);
  return replacements;
}

function makeDiff(before: string, after: string): string {
  if (before === after) return '';
  const bLines = before.split('\n');
  const aLines = after.split('\n');
  const out: string[] = [];
  const max = Math.max(bLines.length, aLines.length);
  for (let i = 0; i < max; i++) {
    if (bLines[i] !== aLines[i]) {
      if (bLines[i] !== undefined) out.push(`- ${bLines[i]}`);
      if (aLines[i] !== undefined) out.push(`+ ${aLines[i]}`);
    }
  }
  return out.join('\n');
}

export interface UpdateOptions {
  componentName?: string;
  dryRun?: boolean;
  tsConfigFilePath?: string;
}

export async function updateComponent(
  filePath: string,
  spec: ComponentSpec,
  opts: UpdateOptions = {},
): Promise<UpdateResult> {
  const project = new Project({
    tsConfigFilePath: opts.tsConfigFilePath,
    skipAddingFilesFromTsConfig: !opts.tsConfigFilePath,
  });
  const sf = project.addSourceFileAtPath(filePath);
  const before = sf.getFullText();

  const componentName = opts.componentName ?? inferComponentName(sf, 'Component');

  const { addedValues, addedProps } = spec.variants
    ? updateVariants(sf, componentName, spec.variants)
    : { addedValues: {}, addedProps: [] };

  const { added: addedStates } = spec.states
    ? addStateProps(sf, componentName, spec.states)
    : { added: [] };

  const tokenReplacements = spec.tokens ? replaceTokens(sf, spec.tokens) : {};

  sf.organizeImports();
  const after = sf.getFullText();
  const changed = before !== after;

  if (changed && !opts.dryRun) {
    await sf.save();
  }

  return {
    changed,
    addedVariants: addedValues,
    addedProps,
    addedStates,
    tokenReplacements,
    diff: makeDiff(before, after),
  };
}

export { findVariants };
