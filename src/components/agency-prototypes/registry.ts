import { lazy, ComponentType } from 'react';

export interface ProtoEntry {
  id: string;
  label: string;
  index: number;
  component: ComponentType<Record<string, never>>;
  wrapperClass?: string;
}

const registry: ProtoEntry[] = [
  {
    id: 'proto-01-wireframe-main',
    label: 'Wireframe Main',
    index: 1,
    component: lazy(() => import('./proto-01-wireframe-main')),
  },
  {
    id: 'proto-02-split-screen',
    label: 'Split-Screen',
    index: 2,
    component: lazy(() => import('./proto-02-split-screen')),
    wrapperClass: 'agency-page',
  },
  {
    id: 'proto-03-wireframe-v1',
    label: 'Wireframe v1',
    index: 3,
    component: lazy(() => import('./proto-03-wireframe-v1')),
  },
  {
    id: 'proto-04-wireframe-v2',
    label: 'Wireframe v2',
    index: 4,
    component: lazy(() => import('./proto-04-wireframe-v2')),
  },
];

registry.sort((a, b) => a.index - b.index);

export default registry;
