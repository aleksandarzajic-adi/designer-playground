import type { InterfaceDeclaration, SourceFile } from 'ts-morph';
import { findVariants } from './findVariants';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export interface VariantUpdateResult {
  addedValues: Record<string, string[]>;
  addedProps: string[];
}

function renderUnion(values: string[]): string {
  return values.map((v) => `'${v}'`).join(' | ');
}

function ensurePropertyOnInterface(
  iface: InterfaceDeclaration,
  propName: string,
  type: string,
): boolean {
  if (iface.getProperty(propName)) return false;
  iface.addProperty({ name: propName, type, hasQuestionToken: true });
  return true;
}

export function updateVariants(
  sf: SourceFile,
  componentName: string,
  newVariants: Record<string, string[]>,
): VariantUpdateResult {
  const existing = findVariants(sf, componentName);
  const addedValues: Record<string, string[]> = {};
  const addedProps: string[] = [];

  for (const [propName, values] of Object.entries(newVariants)) {
    const current = existing.propertyDefinitions[propName] ?? new Set<string>();
    const missing = values.filter((v) => !current.has(v));
    if (missing.length === 0) continue;

    const next = [...current, ...missing];
    const aliasName = `${componentName}${cap(propName)}`;
    const alias = existing.aliasByProp[propName] ?? sf.getTypeAlias(aliasName);

    if (alias) {
      alias.setType(renderUnion(next));
    } else if (existing.propsInterface) {
      const prop = existing.propsInterface.getProperty(propName);
      if (prop) {
        prop.setType(renderUnion(next));
      } else {
        sf.addTypeAlias({
          name: aliasName,
          type: renderUnion(next),
          isExported: true,
        });
        ensurePropertyOnInterface(existing.propsInterface, propName, aliasName);
        addedProps.push(propName);
      }
    } else {
      sf.addTypeAlias({
        name: aliasName,
        type: renderUnion(next),
        isExported: true,
      });
    }

    addedValues[propName] = missing;
  }

  return { addedValues, addedProps };
}
