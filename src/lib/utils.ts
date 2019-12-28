export function querySelectorArray(target: ParentNode, selector: string): Element[] {
  return Array.from(target.querySelectorAll(selector));
}

export function dedupe<T>(xs: T[]): T[] {
  return Array.from(new Set(xs));
}

export function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}
