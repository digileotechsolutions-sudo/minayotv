const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || "https://pulsedaily.com";

export const siteUrl = new URL(siteOrigin).origin;

export function absoluteUrl(path: string) {
  return new URL(path, `${siteUrl}/`).toString();
}
