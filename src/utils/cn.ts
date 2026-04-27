import { clsx, type ClassValue } from 'clsx';

/** Utility to merge class names conditionally */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
