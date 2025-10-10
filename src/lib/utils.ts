import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { parse, formatRgb } from 'culori';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCssVariable(variable: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

export function getRGB(color: string, alpha?: number) {
  const parsedColor = parse(color);
  if (!parsedColor) return null;
  if (alpha) parsedColor.alpha = alpha;
  return formatRgb(parsedColor);
}
