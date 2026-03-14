/**
 * api-security.ts — Shared security utilities for all API routes.
 * Rate limiting, input validation, URL sanitization, safe error responses.
 */

import { NextRequest, NextResponse } from 'next/server';

// ═══════════════════════════════════════════════════════════════════════════════
// 1. RATE LIMITER
// ═══════════════════════════════════════════════════════════════════════════════

const rateLimitMaps = new Map<string, Map<string, number[]>>();

export function isRateLimited(
    ip: string,
    routeKey: string,
    maxRequests: number = 5,
    windowMs: number = 60_000
): boolean {
    if (!rateLimitMaps.has(routeKey)) {
        rateLimitMaps.set(routeKey, new Map());
    }
    const map = rateLimitMaps.get(routeKey)!;
    const now = Date.now();
    const requests = map.get(ip) || [];

    // Filter to recent window
    const recentRequests = requests.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
        return true;
    }

    recentRequests.push(now);
    map.set(ip, recentRequests);

    // Cleanup: prevent memory leak (evict oldest entry when map grows too large)
    if (map.size > 10_000) {
        const oldestKey = map.keys().next().value;
        if (oldestKey) map.delete(oldestKey);
    }

    return false;
}

export function getClientIP(request: NextRequest | Request): string {
    if ('headers' in request) {
        return (
            (request.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            'unknown'
        );
    }
    return 'unknown';
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. URL VALIDATION (anti-SSRF)
// ═══════════════════════════════════════════════════════════════════════════════

const BLOCKED_PROTOCOLS = ['javascript:', 'file:', 'data:', 'ftp:', 'gopher:'];
const BLOCKED_HOSTNAMES = ['localhost', '127.0.0.1', '0.0.0.0', '[::1]'];

export function isValidUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;

    try {
        // Ensure it starts with http(s)://
        const normalized = url.startsWith('http') ? url : `https://${url}`;
        const parsed = new URL(normalized);

        // Block dangerous protocols
        if (BLOCKED_PROTOCOLS.some(p => parsed.protocol === p)) return false;

        // Only allow http(s)
        if (!['http:', 'https:'].includes(parsed.protocol)) return false;

        // Block internal/loopback addresses
        if (BLOCKED_HOSTNAMES.includes(parsed.hostname)) return false;

        // Block private IPs (10.x.x.x, 192.168.x.x, 172.16-31.x.x)
        const ipParts = parsed.hostname.split('.').map(Number);
        if (ipParts.length === 4 && ipParts.every(n => !isNaN(n))) {
            if (ipParts[0] === 10) return false;
            if (ipParts[0] === 172 && ipParts[1] >= 16 && ipParts[1] <= 31) return false;
            if (ipParts[0] === 192 && ipParts[1] === 168) return false;
            if (ipParts[0] === 169 && ipParts[1] === 254) return false; // link-local
        }

        return true;
    } catch {
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. INPUT SANITIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/** Strip HTML tags and limit length */
export function sanitizeString(str: unknown, maxLength: number = 500): string {
    if (!str || typeof str !== 'string') return '';
    return str
        .trim()
        .slice(0, maxLength)
        .replace(/[<>]/g, '')           // Anti-XSS
        .replace(/\n{3,}/g, '\n\n');    // Limit consecutive newlines
}

/** Sanitize a value for use in Content-Disposition filename */
export function sanitizeFilename(name: string, maxLength: number = 80): string {
    return name
        .replace(/[^a-zA-Z0-9À-ÿ._\- ]/g, '_')
        .replace(/\s+/g, '_')
        .slice(0, maxLength);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. ERROR RESPONSES
// ═══════════════════════════════════════════════════════════════════════════════

/** Return a generic error response — never leak internal details */
export function errorResponse(
    message: string = 'Une erreur est survenue.',
    status: number = 500
): NextResponse {
    return NextResponse.json({ error: message }, { status });
}

/** Return 405 Method Not Allowed */
export function methodNotAllowed(): NextResponse {
    return NextResponse.json(
        { error: 'Méthode non autorisée' },
        { status: 405 }
    );
}

/** Return 429 Rate Limited */
export function rateLimitedResponse(): NextResponse {
    return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez patienter.' },
        { status: 429 }
    );
}
