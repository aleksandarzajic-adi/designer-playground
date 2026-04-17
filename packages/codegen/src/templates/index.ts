import type { ExtractedComponent } from '@dp/figma-extractor';
import { specFromSnapshot } from '../specFromSnapshot';
import { toPascal, type ArchetypeSpec, type TemplateFn, type TemplateOutput } from './shared';
import { buttonTemplate } from './button.tpl';
import { buttonDangerTemplate } from './buttonDanger.tpl';
import { inputFieldTemplate } from './inputField.tpl';
import { cardTemplate } from './card.tpl';
import { badgeTemplate } from './badge.tpl';
import { avatarTemplate } from './avatar.tpl';
import { tooltipTemplate } from './tooltip.tpl';
import { accordionItemTemplate } from './accordionItem.tpl';

export interface StoryDefault {
  args: Record<string, unknown>;
  render?: string;
  /** Optional allow-list of variant keys to expose in Story argTypes + stories. */
  variantKeys?: string[];
}

export interface ArchetypeRule {
  match: RegExp;
  archetype: string;
  template: TemplateFn;
  storyDefault?: StoryDefault;
}

export const archetypes: ArchetypeRule[] = [
  {
    match: /^button\s+danger$/i,
    archetype: 'button-danger',
    template: buttonDangerTemplate,
    storyDefault: { args: { children: 'Delete' }, variantKeys: ['variant', 'size'] },
  },
  {
    match: /^icon\s+button$/i,
    archetype: 'button',
    template: buttonTemplate,
    storyDefault: { args: { children: '★' }, variantKeys: ['variant', 'size'] },
  },
  {
    match: /^button$/i,
    archetype: 'button',
    template: buttonTemplate,
    storyDefault: { args: { children: 'Button' }, variantKeys: ['variant', 'size'] },
  },
  {
    match: /^pagination\s+(next|previous|page)$/i,
    archetype: 'button',
    template: buttonTemplate,
    storyDefault: { args: { children: '1' }, variantKeys: ['variant', 'size'] },
  },
  {
    match: /^navigation\s+button$/i,
    archetype: 'button',
    template: buttonTemplate,
    storyDefault: { args: { children: 'Nav' }, variantKeys: ['variant', 'size'] },
  },

  {
    match: /^(input|textarea)\s+field$/i,
    archetype: 'input',
    template: inputFieldTemplate,
    storyDefault: { args: { label: 'Label', placeholder: 'Enter value' } },
  },
  {
    match: /^(date\s+picker|date\s+input|select)\s+field$/i,
    archetype: 'input',
    template: inputFieldTemplate,
    storyDefault: { args: { label: 'Label', placeholder: 'Select…' } },
  },
  {
    match: /^search(\s+field)?$/i,
    archetype: 'input',
    template: inputFieldTemplate,
    storyDefault: { args: { label: 'Search', placeholder: 'Search…' } },
  },

  {
    match: /^(pricing\s+)?card$/i,
    archetype: 'card',
    template: cardTemplate,
    storyDefault: { args: { children: 'Card content' }, variantKeys: [] },
  },

  {
    match: /^(tag|notification|tag\s+toggle|badge)$/i,
    archetype: 'badge',
    template: badgeTemplate,
    storyDefault: { args: { children: 'Label' }, variantKeys: ['tone'] },
  },
  {
    match: /^navigation\s+pill$/i,
    archetype: 'badge',
    template: badgeTemplate,
    storyDefault: { args: { children: 'Pill' }, variantKeys: ['tone'] },
  },

  {
    match: /^avatar$/i,
    archetype: 'avatar',
    template: avatarTemplate,
    storyDefault: { args: { initials: 'AZ' }, variantKeys: ['size', 'shape', 'type'] },
  },

  {
    match: /^tooltip$/i,
    archetype: 'tooltip',
    template: tooltipTemplate,
    storyDefault: {
      args: { content: 'Tooltip text' },
      render: `({ content, placement }) => (<span><button>Hover</button></span>)`,
    },
  },

  {
    match: /^accordion\s+item$/i,
    archetype: 'accordion-item',
    template: accordionItemTemplate,
    storyDefault: {
      args: { title: 'Section title', defaultOpen: true, children: 'Body content' },
      variantKeys: [],
    },
  },
];

export function resolveArchetype(name: string): ArchetypeRule | null {
  return archetypes.find((a) => a.match.test(name)) ?? null;
}

export function resolveArchetypeByComponentName(componentName: string): ArchetypeRule | null {
  const spaced = componentName.replace(/([a-z])([A-Z])/g, '$1 $2');
  return archetypes.find((a) => a.match.test(spaced) || a.match.test(componentName)) ?? null;
}

export function renderFromArchetype(snapshot: ExtractedComponent): TemplateOutput | null {
  const rule = resolveArchetype(snapshot.name);
  if (!rule) return null;

  const componentName = toPascal(snapshot.name);
  const spec = specFromSnapshot(snapshot);
  const archetypeSpec: ArchetypeSpec = {
    componentName,
    fileName: `${componentName}.tsx`,
    variants: spec.variants ?? {},
    states: spec.states ?? [],
  };
  return rule.template(archetypeSpec);
}

export * from './shared';
