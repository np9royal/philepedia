import { PHILE_RESERVED_SLUGS } from '../../data/phile-taxonomy';

export function normalizePhileSlug(slug: string): string {
  return slug.trim().toLowerCase().replace(/^\/+/, '').replace(/\/+$/, '');
}

export function isReservedPhileSlug(slug: string): boolean {
  return PHILE_RESERVED_SLUGS.has(normalizePhileSlug(slug));
}

export function assertPhileSlugIsAvailable(slug: string): void {
  const normalized = normalizePhileSlug(slug);

  if (!normalized) {
    throw new Error('Phile slug cannot be empty.');
  }

  if (isReservedPhileSlug(normalized)) {
    throw new Error(`Phile slug "${normalized}" is reserved for a static route.`);
  }
}
