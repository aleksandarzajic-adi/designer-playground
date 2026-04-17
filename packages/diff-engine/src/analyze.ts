import { Project, type SourceFile } from 'ts-morph';

export interface AnalyzedProp {
  name: string;
  type: string;
  optional: boolean;
}

export interface AnalyzedComponent {
  name: string;
  filePath: string;
  props: AnalyzedProp[];
}

export function analyzeFile(filePath: string): AnalyzedComponent[] {
  const project = new Project({ skipAddingFilesFromTsConfig: true });
  const sf = project.addSourceFileAtPath(filePath);
  return analyzeSourceFile(sf);
}

export function analyzeSourceFile(sf: SourceFile): AnalyzedComponent[] {
  const out: AnalyzedComponent[] = [];
  for (const iface of sf.getInterfaces()) {
    const name = iface.getName();
    if (!name.endsWith('Props')) continue;
    const compName = name.replace(/Props$/, '');
    out.push({
      name: compName,
      filePath: sf.getFilePath(),
      props: iface.getProperties().map((p) => ({
        name: p.getName(),
        type: p.getTypeNode()?.getText() ?? p.getType().getText(),
        optional: p.hasQuestionToken(),
      })),
    });
  }
  return out;
}
