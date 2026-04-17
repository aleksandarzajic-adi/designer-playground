import type { ExtractedComponent } from '@dp/figma-extractor';
import { specFromSnapshot } from '../specFromSnapshot';
import { toPascal, type ArchetypeSpec, type TemplateFn, type TemplateOutput } from './shared';
import { buttonTemplate } from './button.tpl';
import { inputFieldTemplate } from './inputField.tpl';
import { cardTemplate } from './card.tpl';
import { badgeTemplate } from './badge.tpl';
import { avatarTemplate } from './avatar.tpl';
import { tooltipTemplate } from './tooltip.tpl';

export interface ArchetypeRule {
  match: RegExp;
  archetype: string;
  template: TemplateFn;
}

export const archetypes: ArchetypeRule[] = [
  { match: /^icon\s+button$/i, archetype: 'button', template: buttonTemplate },
  { match: /^button(\s+danger)?$/i, archetype: 'button', template: buttonTemplate },
  { match: /^pagination\s+(next|previous|page)$/i, archetype: 'button', template: buttonTemplate },
  { match: /^navigation\s+button$/i, archetype: 'button', template: buttonTemplate },

  { match: /^(input|search|textarea)\s+field$/i, archetype: 'input', template: inputFieldTemplate },
  { match: /^(date\s+picker|date\s+input|select)\s+field$/i, archetype: 'input', template: inputFieldTemplate },
  { match: /^search$/i, archetype: 'input', template: inputFieldTemplate },

  { match: /^card$/i, archetype: 'card', template: cardTemplate },
  { match: /^pricing\s+card$/i, archetype: 'card', template: cardTemplate },

  { match: /^(tag|notification|tag\s+toggle|badge)$/i, archetype: 'badge', template: badgeTemplate },
  { match: /^navigation\s+pill$/i, archetype: 'badge', template: badgeTemplate },

  { match: /^avatar$/i, archetype: 'avatar', template: avatarTemplate },

  { match: /^tooltip$/i, archetype: 'tooltip', template: tooltipTemplate },
];

export function resolveArchetype(name: string): ArchetypeRule | null {
  return archetypes.find((a) => a.match.test(name)) ?? null;
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
