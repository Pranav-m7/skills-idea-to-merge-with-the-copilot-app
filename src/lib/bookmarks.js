const slugPattern = /^mona-[0-9A-Za-z]{4}$/;

export function normalizeUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('A URL is required.');
  }

  const input = value.trim();
  const candidate = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  const url = new URL(candidate);
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) {
    throw new TypeError('Enter an HTTP or HTTPS URL.');
  }
  return url.href;
}

export function loadBookmarks(rawValue) {
  if (typeof rawValue !== 'string' || rawValue.trim() === '') return [];

  let value;
  try {
    value = JSON.parse(rawValue);
  } catch {
    return [];
  }
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (
      entry === null ||
      typeof entry !== 'object' ||
      typeof entry.url !== 'string' ||
      typeof entry.slug !== 'string' ||
      !slugPattern.test(entry.slug)
    ) {
      return [];
    }

    try {
      return [{ url: normalizeUrl(entry.url), slug: entry.slug }];
    } catch {
      return [];
    }
  });
}

export function formatBookmark(bookmark) {
  return `${bookmark.url} :: ${bookmark.slug}`;
}
