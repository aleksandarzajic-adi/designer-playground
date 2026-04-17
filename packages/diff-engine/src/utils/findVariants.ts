import {
  Node,
  SyntaxKind,
  TypeAliasDeclaration,
  type InterfaceDeclaration,
  type SourceFile,
} from 'ts-morph';

export interface FoundVariants {
  propertyDefinitions: Record<string, Set<string>>;
  aliasByProp: Record<string, TypeAliasDeclaration>;
  propsInterface: InterfaceDeclaration | undefined;
  knownProps: Set<string>;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function collectLiterals(typeNode: Node | undefined, into: Set<string>): void {
  if (!typeNode) return;
  if (typeNode.getKind() === SyntaxKind.UnionType) {
    typeNode.forEachChild((child) => collectLiterals(child, into));
    return;
  }
  if (typeNode.getKind() === SyntaxKind.LiteralType) {
    const literal = typeNode.getFirstChild();
    if (literal && literal.getKind() === SyntaxKind.StringLiteral) {
      into.add(literal.getText().replace(/^['"]|['"]$/g, ''));
    }
    return;
  }
}

export function findVariants(sf: SourceFile, componentName: string): FoundVariants {
  const propertyDefinitions: Record<string, Set<string>> = {};
  const aliasByProp: Record<string, TypeAliasDeclaration> = {};
  const knownProps = new Set<string>();

  const propsInterface =
    sf.getInterface(`${componentName}Props`) ??
    sf.getInterfaces().find((i) => i.getName().endsWith('Props'));

  if (propsInterface) {
    for (const prop of propsInterface.getProperties()) {
      const name = prop.getName();
      knownProps.add(name);

      const typeNode = prop.getTypeNode();
      if (!typeNode) continue;

      const inline = new Set<string>();
      collectLiterals(typeNode, inline);
      if (inline.size > 0) {
        propertyDefinitions[name] = inline;
        continue;
      }

      const typeText = typeNode.getText();
      const alias =
        sf.getTypeAlias(typeText) ??
        sf.getTypeAlias(`${componentName}${cap(name)}`);
      if (alias) {
        const aliased = new Set<string>();
        collectLiterals(alias.getTypeNode(), aliased);
        if (aliased.size > 0) {
          propertyDefinitions[name] = aliased;
          aliasByProp[name] = alias;
        }
      }
    }
  }

  for (const alias of sf.getTypeAliases()) {
    const name = alias.getName();
    if (!name.startsWith(componentName)) continue;
    const propName = name.slice(componentName.length);
    if (!propName) continue;
    const key = propName.charAt(0).toLowerCase() + propName.slice(1);
    if (propertyDefinitions[key]) continue;
    const values = new Set<string>();
    collectLiterals(alias.getTypeNode(), values);
    if (values.size > 0) {
      propertyDefinitions[key] = values;
      aliasByProp[key] = alias;
    }
  }

  return { propertyDefinitions, aliasByProp, propsInterface, knownProps };
}
