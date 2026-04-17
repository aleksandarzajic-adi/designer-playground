import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface RegistryProp {
  name: string;
  type: string;
  optional: boolean;
  defaultValue?: string;
  description?: string;
}

export interface RegistryComponent {
  name: string;
  filePath: string;
  exportName: string;
  props: RegistryProp[];
  variants?: Record<string, string[]>;
  figmaNodeId?: string;
  figmaLastSyncedAt?: string;
  description?: string;
  hash?: string;
}

export interface Registry {
  version: string;
  updatedAt: string;
  components: Record<string, RegistryComponent>;
}

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_PATH = resolve(HERE, '../registry.json');

export const emptyRegistry = (): Registry => ({
  version: '1.0.0',
  updatedAt: new Date().toISOString(),
  components: {},
});

export function loadRegistry(path: string = DEFAULT_PATH): Registry {
  if (!existsSync(path)) return emptyRegistry();
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Registry;
  } catch {
    return emptyRegistry();
  }
}

export function saveRegistry(reg: Registry, path: string = DEFAULT_PATH): void {
  reg.updatedAt = new Date().toISOString();
  writeFileSync(path, JSON.stringify(reg, null, 2), 'utf8');
}

export function upsertComponent(reg: Registry, comp: RegistryComponent): Registry {
  reg.components[comp.name] = { ...reg.components[comp.name], ...comp };
  return reg;
}

export function getComponent(reg: Registry, name: string): RegistryComponent | undefined {
  return reg.components[name];
}

export function listComponents(reg: Registry): RegistryComponent[] {
  return Object.values(reg.components);
}
