export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface FigmaPaint {
  type: string;
  color?: FigmaColor;
  opacity?: number;
  visible?: boolean;
}

export interface FigmaTextStyle {
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number;
  lineHeightPx?: number;
  letterSpacing?: number;
}

export interface FigmaComponentProperty {
  type: 'BOOLEAN' | 'TEXT' | 'VARIANT' | 'INSTANCE_SWAP';
  defaultValue: string | boolean;
  variantOptions?: string[];
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  children?: FigmaNode[];
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
  fills?: FigmaPaint[];
  strokes?: FigmaPaint[];
  cornerRadius?: number;
  rectangleCornerRadii?: [number, number, number, number];
  layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX';
  itemSpacing?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  characters?: string;
  style?: FigmaTextStyle;
  componentPropertyDefinitions?: Record<string, FigmaComponentProperty>;
  componentProperties?: Record<string, { type: string; value: string | boolean }>;
}

export interface FigmaFileResponse {
  name: string;
  lastModified: string;
  document: FigmaNode;
  components: Record<string, { name: string; description?: string }>;
  componentSets: Record<string, { name: string; description?: string }>;
  styles: Record<string, { name: string; styleType: string }>;
}

export interface ExtractedLayout {
  kind: 'flex' | 'none';
  direction?: 'row' | 'column';
  gap?: string;
  padding?: { top: string; right: string; bottom: string; left: string };
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
}

export interface ExtractedTokens {
  background?: string;
  color?: string;
  border?: string;
  borderRadius?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string | number;
  lineHeight?: string;
}

export interface ExtractedVariants {
  propertyDefinitions: Record<string, string[]>;
  fromNameConvention: Record<string, string>;
  baseName: string;
}

export interface ExtractedComponent {
  name: string;
  type: 'component' | 'component-set' | 'instance' | 'frame' | 'text' | 'group' | 'other';
  figmaId: string;
  layout: ExtractedLayout;
  variants: ExtractedVariants;
  tokens: ExtractedTokens;
  text?: string;
  children: ExtractedComponent[];
}
