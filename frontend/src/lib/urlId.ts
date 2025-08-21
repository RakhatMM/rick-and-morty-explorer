export function idFromUrl(u: string): number | null {
  try {
    const m = u.trim().match(/\/(\d+)(?:\/)?$/);
    return m ? Number(m[1]) : null;
  } catch {
    return null;
  }
}
export function idsFromUrls(urls: string[]): number[] {
  return urls.map(idFromUrl).filter((n): n is number => Number.isFinite(n));
}
