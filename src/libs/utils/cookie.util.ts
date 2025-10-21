export function parseCookies(cookieHeader?: string): Record<string, string> {
    if (!cookieHeader) return {};

    return Object.fromEntries(
        cookieHeader
            .split(';')
            .map((cookie) => cookie.trim().split('='))
            .map(([key, ...v]) => [key, decodeURIComponent(v.join('='))]),
    );
}
