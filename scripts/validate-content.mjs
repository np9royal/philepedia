import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src', 'content', 'philes');
const RESERVED_SLUGS = new Set([
  '',
  'index',
  'explore',
  'philes',
  'robots.txt',
  'sitemap.xml',
  'sitemap-index.xml',
  'favicon.ico',
  'favicon.svg',
  'og',
  'search',
  'api',
  '404'
]);
const CATEGORIES = new Set([
  'Sky & Weather',
  'Water & Earth',
  'Flora & Fauna',
  'Arts & Media',
  'Language & Ideas',
  'Culture & Taste',
  'Elements'
]);
const HERO_STYLES = new Set([
  'rain',
  'rainstorm',
  'clouds',
  'lightning',
  'moonlight',
  'sunbeam',
  'midnight',
  'starlight',
  'waves',
  'river',
  'lake',
  'forest',
  'bloom',
  'earth',
  'pages',
  'film',
  'sound',
  'waveform',
  'type',
  'spark',
  'signal',
  'flag',
  'cafe',
  'passport',
  'vine',
  'cat',
  'dog',
  'wing',
  'gallop',
  'embers'
]);
const HEX_COLOR = /^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(message) {
  console.error(`\nPhilepedia content validation failed.\n${message}\n`);
  process.exit(1);
}

function ensure(condition, message, errors) {
  if (!condition) {
    errors.push(message);
  }
}

function unique(values) {
  const seen = new Set();
  const duplicates = new Set();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
      continue;
    }
    seen.add(value);
  }

  return [...duplicates];
}

function readEntries() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fail(`Missing content directory: ${CONTENT_DIR}`);
  }

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.md'))
    .sort()
    .map((file) => {
      const fullPath = path.join(CONTENT_DIR, file);
      const { data, content } = matter.read(fullPath);
      return {
        file,
        fullPath,
        data,
        content
      };
    });
}

const entries = readEntries();
const errors = [];

ensure(entries.length >= 30, `Expected at least 30 phile entries, found ${entries.length}.`, errors);

const bySlug = new Map();

for (const entry of entries) {
  const { data, file } = entry;
  const slug = String(data.slug ?? '').trim().toLowerCase();

  ensure(Boolean(slug), `${file}: missing slug`, errors);
  ensure(SLUG_PATTERN.test(slug), `${file}: slug must be lowercase kebab-case`, errors);
  ensure(!RESERVED_SLUGS.has(slug), `${file}: slug "${slug}" is reserved`, errors);
  ensure(path.basename(file, '.md') === slug, `${file}: filename must match slug`, errors);
  ensure(String(data.name ?? '').trim().length >= 2, `${file}: missing name`, errors);
  ensure(String(data.pronunciation ?? '').trim().length >= 2, `${file}: missing pronunciation`, errors);
  ensure(String(data.definition ?? '').trim().length >= 10, `${file}: definition too short`, errors);
  ensure(String(data.shortDescription ?? '').trim().length >= 20, `${file}: shortDescription too short`, errors);
  ensure(Array.isArray(data.etymology) && data.etymology.length >= 1, `${file}: missing etymology`, errors);
  ensure(CATEGORIES.has(data.category), `${file}: invalid category "${data.category}"`, errors);
  ensure(Array.isArray(data.tags) && data.tags.length >= 3, `${file}: need at least 3 tags`, errors);
  ensure(Array.isArray(data.tagAliases), `${file}: tagAliases must be an array`, errors);
  ensure(Array.isArray(data.moodKeywords) && data.moodKeywords.length >= 3, `${file}: need at least 3 moodKeywords`, errors);
  ensure(Array.isArray(data.colorPalette) && data.colorPalette.length >= 3, `${file}: need 3-5 colorPalette values`, errors);
  ensure(
    Array.isArray(data.colorPalette) && data.colorPalette.every((value) => HEX_COLOR.test(String(value))),
    `${file}: colorPalette must use valid hex colors`,
    errors
  );
  ensure(HERO_STYLES.has(data.heroStyle), `${file}: invalid heroStyle "${data.heroStyle}"`, errors);
  ensure(Array.isArray(data.youMightBeIf) && data.youMightBeIf.length >= 3, `${file}: need at least 3 youMightBeIf items`, errors);
  ensure(Array.isArray(data.references) && data.references.length >= 2, `${file}: need at least 2 references`, errors);
  ensure(data.status === 'draft' || data.status === 'published', `${file}: invalid status`, errors);
  if (Array.isArray(data.references)) {
    for (const reference of data.references) {
      ensure(
        typeof reference?.label === 'string' && reference.label.trim().length >= 2,
        `${file}: invalid reference label`,
        errors
      );

      try {
        new URL(reference?.url);
      } catch {
        errors.push(`${file}: invalid reference URL "${reference?.url}"`);
      }
    }
  }

  if (Array.isArray(data.tags)) {
    for (const duplicate of unique(data.tags.map((value) => String(value).trim().toLowerCase()))) {
      errors.push(`${file}: duplicate tag "${duplicate}"`);
    }
  }

  if (Array.isArray(data.tagAliases)) {
    for (const duplicate of unique(data.tagAliases.map((value) => String(value).trim().toLowerCase()))) {
      errors.push(`${file}: duplicate tag alias "${duplicate}"`);
    }
  }

  if (Array.isArray(data.relatedPhiles)) {
    for (const relatedSlug of data.relatedPhiles.map((value) => String(value).trim().toLowerCase())) {
      ensure(relatedSlug !== slug, `${file}: relatedPhiles cannot reference itself`, errors);
    }
  }

  if (bySlug.has(slug)) {
    errors.push(`${file}: duplicate slug "${slug}"`);
  } else {
    bySlug.set(slug, entry);
  }
}

for (const entry of entries) {
  const { file, data } = entry;

  if (!Array.isArray(data.relatedPhiles)) {
    continue;
  }

  for (const relatedSlug of data.relatedPhiles.map((value) => String(value).trim().toLowerCase())) {
    ensure(bySlug.has(relatedSlug), `${file}: missing related phile "${relatedSlug}"`, errors);
  }
}

if (errors.length > 0) {
  fail(errors.map((error) => `- ${error}`).join('\n'));
}

console.log(`Validated ${entries.length} phile entries.`);
