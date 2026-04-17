import type { ExtractedComponent, FigmaFileResponse, FigmaNode } from './types';
import { extractLayout } from './parser/layout';
import { extractTokens } from './parser/tokens';
import { extractVariants } from './parser/variants';

const nodeKind = (type: string): ExtractedComponent['type'] => {
  switch (type) {
    case 'COMPONENT':
      return 'component';
    case 'COMPONENT_SET':
      return 'component-set';
    case 'INSTANCE':
      return 'instance';
    case 'FRAME':
      return 'frame';
    case 'TEXT':
      return 'text';
    case 'GROUP':
      return 'group';
    default:
      return 'other';
  }
};

const SKIP_TYPES = new Set(['VECTOR', 'LINE', 'REGULAR_POLYGON', 'STAR', 'ELLIPSE', 'BOOLEAN_OPERATION']);

export interface ExtractOptions {
  maxDepth?: number;
  includeDecorative?: boolean;
}

export function extractNode(node: FigmaNode, opts: ExtractOptions = {}, depth = 0): ExtractedComponent {
  const layout = extractLayout(node);
  const tokens = extractTokens(node);
  const variants = extractVariants(node);

  const shouldRecurse = (opts.maxDepth ?? 6) > depth;
  const children: ExtractedComponent[] = [];

  if (shouldRecurse && node.children) {
    for (const child of node.children) {
      if (child.visible === false) continue;
      if (!opts.includeDecorative && SKIP_TYPES.has(child.type)) continue;
      children.push(extractNode(child, opts, depth + 1));
    }
  }

  return {
    name: variants.baseName,
    type: nodeKind(node.type),
    figmaId: node.id,
    layout,
    variants,
    tokens,
    text: node.type === 'TEXT' ? node.characters : undefined,
    children,
  };
}

export function walkComponentRoots(root: FigmaNode): FigmaNode[] {
  const out: FigmaNode[] = [];
  const visit = (n: FigmaNode) => {
    if (n.visible === false) return;
    if (n.type === 'COMPONENT_SET') {
      out.push(n);
      return;
    }
    if (n.type === 'COMPONENT') {
      out.push(n);
      return;
    }
    n.children?.forEach(visit);
  };
  visit(root);
  return out;
}

export function extractComponents(
  file: FigmaFileResponse,
  opts: ExtractOptions = {},
): ExtractedComponent[] {
  return walkComponentRoots(file.document).map((n) => extractNode(n, opts));
}
