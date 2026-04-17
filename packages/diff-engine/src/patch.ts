import { Project, SyntaxKind, type SourceFile } from 'ts-morph';

export type Patch =
  | { kind: 'addProp'; component: string; propName: string; propType: string; optional?: boolean }
  | { kind: 'removeProp'; component: string; propName: string }
  | { kind: 'renameProp'; component: string; from: string; to: string }
  | { kind: 'addVariant'; component: string; variant: string; value: string }
  | { kind: 'replaceToken'; component: string; from: string; to: string };

export interface ApplyPatchOptions {
  tsConfigFilePath?: string;
  dryRun?: boolean;
}

export class DiffEngine {
  private project: Project;

  constructor(opts: ApplyPatchOptions = {}) {
    this.project = new Project({
      tsConfigFilePath: opts.tsConfigFilePath,
      skipAddingFilesFromTsConfig: !opts.tsConfigFilePath,
    });
  }

  addSourceFile(path: string): SourceFile {
    return this.project.addSourceFileAtPath(path);
  }

  applyPatch(filePath: string, patch: Patch): { changed: boolean; diff: string } {
    const sf = this.project.addSourceFileAtPathIfExists(filePath) ?? this.project.addSourceFileAtPath(filePath);
    const before = sf.getFullText();

    switch (patch.kind) {
      case 'addProp':
        this.addPropToInterface(sf, patch.component, patch.propName, patch.propType, patch.optional ?? true);
        break;
      case 'removeProp':
        this.removePropFromInterface(sf, patch.component, patch.propName);
        break;
      case 'renameProp':
        this.renameProp(sf, patch.component, patch.from, patch.to);
        break;
      case 'replaceToken':
        sf.replaceWithText(sf.getFullText().split(patch.from).join(patch.to));
        break;
      case 'addVariant':
        this.addVariantLiteral(sf, patch.component, patch.variant, patch.value);
        break;
    }

    const after = sf.getFullText();
    const changed = before !== after;
    return { changed, diff: makeDiff(before, after) };
  }

  private addPropToInterface(sf: SourceFile, component: string, name: string, type: string, optional: boolean) {
    const iface = sf.getInterface(`${component}Props`);
    if (!iface) return;
    if (iface.getProperty(name)) return;
    iface.addProperty({ name, type, hasQuestionToken: optional });
  }

  private removePropFromInterface(sf: SourceFile, component: string, name: string) {
    const iface = sf.getInterface(`${component}Props`);
    iface?.getProperty(name)?.remove();
  }

  private renameProp(sf: SourceFile, component: string, from: string, to: string) {
    const iface = sf.getInterface(`${component}Props`);
    iface?.getProperty(from)?.rename(to);
  }

  private addVariantLiteral(sf: SourceFile, component: string, variant: string, value: string) {
    const alias = sf.getTypeAlias(`${component}${variant.charAt(0).toUpperCase() + variant.slice(1)}`);
    if (!alias) return;
    const node = alias.getTypeNodeOrThrow();
    if (node.getKind() === SyntaxKind.UnionType) {
      alias.setType(`${node.getText()} | '${value}'`);
    }
  }

  async save() {
    await this.project.save();
  }
}

function makeDiff(before: string, after: string): string {
  if (before === after) return '';
  const bLines = before.split('\n');
  const aLines = after.split('\n');
  const lines: string[] = [];
  const max = Math.max(bLines.length, aLines.length);
  for (let i = 0; i < max; i++) {
    if (bLines[i] !== aLines[i]) {
      if (bLines[i] !== undefined) lines.push(`- ${bLines[i]}`);
      if (aLines[i] !== undefined) lines.push(`+ ${aLines[i]}`);
    }
  }
  return lines.join('\n');
}
