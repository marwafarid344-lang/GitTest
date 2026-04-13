/**
 * Global Request Deduplication Layer
 * Ensures identical queries fired in quick succession (e.g. from multiple React components)
 * use the exact same Promise rather than hitting the network multiple times.
 */

const promiseCache = new Map<string, { promise: Promise<any>, timestamp: number }>();

const DEDUPE_WINDOW_MS = 2000; // Deduplicate identical queries within a 2-second window

export async function deduplicateQuery<T>(
  queryKey: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const cached = promiseCache.get(queryKey);

  if (cached && now - cached.timestamp < DEDUPE_WINDOW_MS) {
    // Return existing inflight or recently completed promise
    return cached.promise;
  }

  // Create new promise
  const promise = fetcher().catch((err) => {
    // Evict on error so we can retry later
    promiseCache.delete(queryKey);
    throw err;
  });

  promiseCache.set(queryKey, { promise, timestamp: now });

  return promise;
}
