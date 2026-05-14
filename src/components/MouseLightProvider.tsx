'use client';

import { useMouseLight } from '../hooks/useMouseLight';
import { useScrollY } from '../hooks/useScrollY';

export default function MouseLightProvider() {
  useMouseLight();
  useScrollY();
  return null;
}
