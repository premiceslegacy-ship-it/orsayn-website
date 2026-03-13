import puppeteer, { Browser, Page } from 'puppeteer';
import type { AuditForceData } from './forces-selector';
import type { AuditFailleData } from './failles-selector';

export type ScrapedAuditData = AuditForceData &
    AuditFailleData & {
        Score_Global: number;
        Screenshot_Base64: string;
        // Contacts for CRM
        Email?: string;
        Telephone?: string;
        LinkedIn?: string;
        // UX detailed scores (for PDF commentary)
        UX_Score_Architecture?: number;
        UX_Score_UI?: number;
        UX_Score_Conversion?: number;
        UX_Score_Technique?: number;
        UX_Details?: string[];
        // Raw booleans mapped from metrics
        UX_Menu_Surcharge?: boolean;
        UX_Pas_H1?: boolean;
        UX_Contact_Difficile?: boolean;
        UX_Police_Defaut?: boolean;
        UX_Pas_Hierarchie?: boolean;
        UX_Photos_Generiques?: boolean;
        UX_Pas_Confiance?: boolean;
        UX_Equipe_Anonyme?: boolean;
        UX_Police_Petite?: boolean;

        UX_Architecture_Intuitive?: boolean;
        UX_Typographie_Prestige?: boolean;
        UX_Preuve_Sociale?: boolean;
        UX_Equipe_Visible?: boolean;
        UX_Vitesse_Excellente?: boolean;
    };

// ─── Keyword banks ───────────────────────────────────────────────────────────

const SPECIALTY_KEYWORDS: Record<string, string[]> = {
    'Droit pénal des affaires': ['pénal', 'penal', 'correctionnel', 'fraude', 'abus de biens', 'blanchiment', 'corruption'],
    'M&A / Fusions-acquisitions': ['fusion', 'acquisition', 'cession', 'transmission', 'M&A', 'due diligence'],
    'Droit des sociétés': ['société', 'associé', 'actionnaire', 'gouvernance', 'statuts', 'SAS', 'SARL', 'holding'],
    'Private Equity': ['private equity', 'capital-investissement', 'LBO', 'fonds', 'participations'],
    'Restructuring': ['restructuration', 'procédure collective', 'sauvegarde', 'redressement', 'liquidation', 'insolvabilité'],
    'Droit fiscal': ['fiscal', 'fiscalité', 'impôt', 'TVA', 'optimisation', 'régime fiscal'],
    'Droit du travail': ['travail', 'salarié', 'licenciement', 'prud', 'RH', 'ressources humaines'],
    'Droit immobilier': ['immobilier', 'bail', 'construction', 'VEFA', 'urbanisme', 'foncier'],
    'Contentieux commercial': ['contentieux', 'arbitrage', 'litige', 'tribunal de commerce'],
    'Droit de la propriété intellectuelle': ['propriété intellectuelle', 'brevet', 'marque', "droit d'auteur", 'PI'],
};

const CMS_SIGNATURES: Record<string, string[]> = {
    'WordPress': ['wp-content', 'wp-includes', 'xmlrpc.php', 'WordPress'],
    'Wix': ['wix.com', 'wixstatic', 'wixsite'],
    'Squarespace': ['squarespace.com', 'sqsp.net'],
    'Webflow': ['webflow.com', 'webflow.io'],
    'Jimdo': ['jimdo.com', 'jimdofree'],
    'Joomla': ['Joomla', '/components/', '/modules/'],
    'Drupal': ['Drupal', '/sites/default/'],
};

// ─── Name extraction ──────────────────────────────────────────────────────────

function cleanCabinetName(raw: string): string {
    return raw
        // Remove everything after separators
        .replace(/\s*[|\-\/\\]\.*.+$/, '')
        // Remove after common descriptor words
        .replace(/\s+(avocat|avocats|attorneys?|lawyer|law firm|law|counsel|solicitor|barreau|cabinet|studio|juriste).*/i, '')
        // Remove leading "Cabinet", "Maître", "Me "
        .replace(/^(cabinet\s+(d'avocats\s+)?|maître\s+|me\s+)/i, '')
        // Remove location info like "en droit du travail | Luxembourg"
        .replace(/\s+en\s+droit.*/i, '')
        // Remove trailing punctuation
        .replace(/[.,;:]+$/, '')
        .trim();
}

function extractCabinetName(title: string, h1: string, og: string, domain: string): string {
    // 1. og:site_name is usually cleanest
    if (og && og.length > 2 && og.length < 60) {
        const c = cleanCabinetName(og);
        if (c.length > 2) return c;
    }
    // 2. Try title
    if (title) {
        const c = cleanCabinetName(title);
        if (c.length > 2 && c.length < 60) return c;
    }
    // 3. H1 fallback
    if (h1) {
        const c = cleanCabinetName(h1);
        if (c.length > 2 && c.length < 60) return c;
    }
    // 4. Domain name as last resort
    return domain.replace(/^www\./, '').split('.')[0];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectSpecialties(text: string): { spec1?: string; spec2?: string } {
    const lower = text.toLowerCase();
    const scored: { specialty: string; matchCount: number; keywordHits: number }[] = [];
    for (const [specialty, keywords] of Object.entries(SPECIALTY_KEYWORDS)) {
        let totalMentions = 0;
        let distinctHits = 0;
        for (const kw of keywords) {
            const kwLower = kw.toLowerCase();
            const regex = new RegExp(kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            const matches = lower.match(regex);
            if (matches && matches.length > 0) {
                distinctHits++;
                totalMentions += matches.length;
            }
        }
        // Require at least 3 distinct keyword hits OR 6+ total mentions of a single keyword
        if (distinctHits >= 3 || totalMentions >= 6) {
            scored.push({ specialty, matchCount: totalMentions, keywordHits: distinctHits });
        }
    }

    // If they score high in 3 or more distinct areas, they are a generalist firm, not truly niched.
    // In this case, we return undefined so the copy defaults to "secteur" or "domaine" instead of naming one arbitrarily.
    if (scored.length > 2) {
        return { spec1: undefined, spec2: undefined };
    }

    // Sort by number of keyword hits, then by total mentions
    scored.sort((a, b) => b.keywordHits - a.keywordHits || b.matchCount - a.matchCount);
    return { spec1: scored[0]?.specialty, spec2: scored[1]?.specialty };
}

function detectCMS(html: string, generator: string): { isTemplate: boolean; templateName?: string } {
    for (const [cms, signals] of Object.entries(CMS_SIGNATURES)) {
        if (signals.some(s => html.includes(s) || generator.includes(s))) {
            return { isTemplate: true, templateName: cms };
        }
    }
    return { isTemplate: false };
}

function detectCopywritingStyle(text: string): boolean {
    const juridicalTerms = ['article', 'décret', 'ordonnance', 'jurisprudence', 'textes de loi',
        'code civil', 'code pénal', 'réglementation', 'norme', 'directive'];
    const clientTerms = ['vous', 'votre', 'protéger', 'sécuriser', 'résoudre', 'défendre',
        'accompagner', 'conseiller', 'solution', 'problème', 'risque'];
    const lower = text.toLowerCase();
    const juridical = juridicalTerms.filter(t => lower.includes(t)).length;
    const client = clientTerms.filter(t => lower.includes(t)).length;
    return juridical > client;
}

function extractVille(text: string): string | undefined {
    // Match French postal codes followed by city names
    const match = text.match(/\b(?:75|69|13|33|31|59|67|06|44|76|35|38|34|57|54|68)\d{3}\b[,\s]+([A-ZÀ-Ü][a-zà-ü\-]+(?:\s[A-ZÀ-Ü][a-zà-ü\-]+)?)/);
    if (match && match[1].length >= 3) return match[1];
    // Match "situé à" / "basé à" / "barreau de" but NOT "avocat à la Cour" patterns
    const cityMatch = text.match(/(?:situé[e]?\s+à|basé[e]?\s+à|barreau de|cabinet (?:de|d'))\s+([A-ZÀ-Ü][a-zà-ü\-]{2,}(?:[\s-][A-ZÀ-Ü][a-zà-ü\-]+)*)/i);
    if (cityMatch && cityMatch[1].length >= 3) {
        let city = cityMatch[1].trim();
        // Clean up common capitalized trailing words that aren't parts of city names
        city = city.replace(/\s+(?:Depuis|Notre|Votre|Le|La|Les|Et|Ou|Dans|Sur|Avec)\b.*$/i, '').trim();

        // Reject false positives: "la Cour", "le Droit", common nouns
        const rejected = ['cour', 'droit', 'conseil', 'cabinet', 'barreau', 'tribunal', 'ministère', 'depuis'];
        if (rejected.some(r => city.toLowerCase().startsWith(r))) return undefined;
        return city;
    }
    // Also match known major cities directly mentioned
    const cities = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse', 'Lille', 'Nantes', 'Strasbourg', 'Nice', 'Luxembourg', 'Bruxelles', 'Genève', 'Montréal'];
    for (const city of cities) {
        if (text.includes(city)) return city;
    }
    return undefined;
}

function extractYear(text: string): number | undefined {
    const match = text.match(/(?:depuis|créé en|fondé en|depuis)\s+(\d{4})/i)
        || text.match(/©\s*(\d{4})/);
    const year = match ? parseInt(match[1]) : undefined;
    if (year && year >= 1900 && year <= new Date().getFullYear()) return year;
    return undefined;
}

function extractTeamCount(html: string): number | undefined {
    // Only match compound team-specific class names (not generic 'card' or 'profile')
    const patterns = [
        /class="[^"]*(?:team-member|team_member|teamMember)[^"]*"/gi,
        /class="[^"]*(?:avocat-card|avocat_card|avocatCard)[^"]*"/gi,
        /class="[^"]*(?:member-card|member_card|memberCard)[^"]*"/gi,
        /class="[^"]*(?:attorney-card|attorney_card)[^"]*"/gi,
        /class="[^"]*(?:partner-card|partner_card)[^"]*"/gi,
        /class="[^"]*(?:staff-member|staff_member)[^"]*"/gi,
    ];
    for (const p of patterns) {
        const matches = html.match(p);
        if (matches && matches.length >= 2) return matches.length;
    }
    return undefined;
}

function extractGoogleRating(html: string): { note?: number; nb?: number } {
    const jsonLdBlocks = html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi) || [];
    for (const block of jsonLdBlocks) {
        try {
            const json = JSON.parse(block.replace(/<\/?script[^>]*>/gi, ''));
            if (json.aggregateRating) {
                return {
                    note: parseFloat(json.aggregateRating.ratingValue),
                    nb: parseInt(json.aggregateRating.reviewCount),
                };
            }
        } catch { /* continue */ }
    }
    const ratingMatch = html.match(/(\d+[.,]\d+)\s*\/\s*5\s*(?:étoiles?|stars?)/i);
    if (ratingMatch) return { note: parseFloat(ratingMatch[1].replace(',', '.')) };
    return {};
}

function extractContacts(html: string, text: string): { email?: string; phone?: string; linkedin?: string } {
    // Basic email regex
    const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i);
    // French phone regex: 01 23 45 67 89 / +33 1 23 45 67 89
    const phoneMatch = text.match(/(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/);
    // LinkedIn regex
    const linkedinMatch = html.match(/(https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/[a-zA-Z0-9_-]+)/i);

    return {
        email: emailMatch ? emailMatch[1] : undefined,
        phone: phoneMatch ? phoneMatch[0] : undefined,
        linkedin: linkedinMatch ? linkedinMatch[1] : undefined,
    };
}

// ─── Full site crawl ─────────────────────────────────────────────────────────

const MAX_CRAWL_PAGES = 15;
const CRAWL_TIMEOUT = 10000; // 10s per page

interface CrawledPageData {
    url: string;
    hasTeamPhotos: boolean;
    hasTestimonials: boolean;
    teamCount: number;
    bodyText: string;
    html: string;
}

/**
 * Extract all same-origin internal links from a page.
 */
async function collectInternalLinks(page: Page, origin: string): Promise<string[]> {
    const links: string[] = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a[href]'))
            .map(a => (a as HTMLAnchorElement).href)
            .filter(h => h.startsWith('http'))
    );

    const uniqueLinks = new Set<string>();
    for (const link of links) {
        try {
            const u = new URL(link);
            if (u.origin !== origin) continue;
            if (u.pathname === '/' || u.pathname === '') continue;
            if (/\.(pdf|jpg|jpeg|png|gif|svg|zip|docx?|xlsx?|pptx?|mp4|mp3|webp|ico|css|js|xml|json|woff2?|ttf|eot)$/i.test(u.pathname)) continue;
            // Normalize: strip hash, strip trailing slash
            const clean = u.origin + u.pathname.replace(/\/+$/, '') + u.search;
            uniqueLinks.add(clean);
        } catch { continue; }
    }
    return Array.from(uniqueLinks);
}

/**
 * Analyzes a single page for team photos, testimonials, and extracts text.
 */
async function analyzePage(page: Page): Promise<{
    hasTeamPhotos: boolean;
    hasTestimonials: boolean;
    teamCount: number;
    bodyText: string;
}> {
    return page.evaluate(() => {
        // ── Team photos detection (comprehensive) ────────────────────────
        const teamSelectors = [
            '[class*="team"]', '[class*="equipe"]', '[class*="avocat"]',
            '[class*="partner"]', '[class*="associe"]', '[class*="member"]',
            '[class*="attorney"]', '[class*="lawyer"]', '[class*="person"]',
            '[class*="profil"]', '[class*="profile"]', '[class*="collaborateur"]',
            '[class*="people"]', '[class*="staff"]', '[class*="employee"]',
            '[id*="team"]', '[id*="equipe"]', '[id*="avocat"]',
        ];

        // Check if any team-related container has images inside
        const imgsInTeamContainers = teamSelectors.some(sel => {
            const els = document.querySelectorAll(sel);
            return Array.from(els).some(c => c.querySelector('img') !== null);
        });

        // Check for figure/article with image + name pattern
        const figuresWithProfiles = Array.from(
            document.querySelectorAll('figure, article, section')
        ).filter(el => {
            const hasImg = el.querySelector('img') !== null;
            const hasName = el.querySelector('h2, h3, h4, h5, p strong, .name, [class*="name"], [class*="titre"], [class*="title"]') !== null;
            // Only count smallish containers (avoid matching the whole page)
            const rect = el.getBoundingClientRect();
            return hasImg && hasName && rect.height < 600 && rect.width < 800;
        });

        // Also very broad: any page with 3+ portrait-sized images (faces)
        const allImages = Array.from(document.querySelectorAll('img'));
        const portraitImages = allImages.filter(img => {
            const w = img.naturalWidth || img.width;
            const h = img.naturalHeight || img.height;
            // Portrait/square aspect ratio between 0.5 and 1.5, min 80px
            const ratio = w > 0 && h > 0 ? w / h : 0;
            return ratio > 0.5 && ratio < 1.5 && w >= 80 && h >= 80;
        });

        const hasTeamPhotos = imgsInTeamContainers || figuresWithProfiles.length >= 2 || portraitImages.length >= 3;

        // Team member count
        const profileSelectors = [
            '[class*="team-member"]', '[class*="team_member"]', '[class*="teamMember"]',
            '[class*="avocat-card"]', '[class*="member-card"]', '[class*="memberCard"]',
            '[class*="attorney-card"]', '[class*="person-card"]', '[class*="personCard"]',
            '[class*="partner-card"]', '[class*="staff-card"]',
        ];
        let teamCount = 0;
        for (const sel of profileSelectors) {
            const c = document.querySelectorAll(sel).length;
            if (c >= 2) { teamCount = c; break; }
        }
        if (teamCount === 0 && figuresWithProfiles.length >= 2) teamCount = figuresWithProfiles.length;

        // ── Testimonials / social proof detection ────────────────────────
        const hasTestimonials = !!(
            document.querySelector(
                '[class*="testimonial"], [class*="avis"], [class*="review"], [itemprop="review"],' +
                '[class*="temoignage"], [class*="recommandation"], [class*="client-feedback"],' +
                'blockquote, [class*="quote"], [class*="feedback"]'
            )
        );

        return {
            hasTeamPhotos,
            hasTestimonials,
            teamCount,
            bodyText: document.body?.innerText?.slice(0, 10000) || '',
        };
    });
}

/**
 * Full site crawl: starting from homepage, visits all internal pages
 * up to MAX_CRAWL_PAGES. Returns aggregated data from all pages.
 */
async function crawlAllPages(
    browser: Browser,
    startUrl: string,
    homePage: Page,
): Promise<CrawledPageData[]> {
    let origin: string;
    try { origin = new URL(startUrl).origin; } catch { return []; }

    const visited = new Set<string>();
    const homePath = new URL(startUrl).pathname.replace(/\/+$/, '') || '/';
    visited.add(origin + homePath);

    // Collect links from homepage first
    const toVisit: string[] = await collectInternalLinks(homePage, origin);
    const results: CrawledPageData[] = [];

    for (let i = 0; i < toVisit.length && results.length < MAX_CRAWL_PAGES; i++) {
        const url = toVisit[i];
        const normalized = (() => {
            try { const u = new URL(url); return u.origin + u.pathname.replace(/\/+$/, ''); }
            catch { return url; }
        })();

        if (visited.has(normalized)) continue;
        visited.add(normalized);

        const subPage = await browser.newPage();
        try {
            await subPage.setViewport({ width: 1280, height: 800 });
            await subPage.setUserAgent(
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            );
            await subPage.goto(url, { waitUntil: 'domcontentloaded', timeout: CRAWL_TIMEOUT });

            const analysis = await analyzePage(subPage);
            const pageHtml = await subPage.content();

            results.push({
                url,
                ...analysis,
                html: pageHtml,
            });

            // Discover new links from this page too (recursive crawl)
            if (results.length < MAX_CRAWL_PAGES) {
                const newLinks = await collectInternalLinks(subPage, origin);
                for (const link of newLinks) {
                    const norm = (() => {
                        try { return new URL(link).origin + new URL(link).pathname.replace(/\/+$/, ''); }
                        catch { return link; }
                    })();
                    if (!visited.has(norm) && !toVisit.includes(link)) {
                        toVisit.push(link);
                    }
                }
            }
        } catch (err) {
            console.warn(`Crawl failed for ${url}:`, (err as Error).message);
        } finally {
            await subPage.close();
        }
    }

    return results;
}


// ─── UX Evaluation Grid (4 categories) ────────────────────────────────────────

interface UXMetrics {
    menuCount: number;
    hasH1: boolean;
    clicksToContact: boolean;
    ctaCount: number;
    hasTestimonials: boolean;
    hasTeamPhotos: boolean;
    hasTypographyHierarchy: boolean;
    isDefaultFont: boolean;
    genericAlts: number;
    bodyFontSize: number;
    inlineColorCount: number;
    visibleTextLength: number;
    fontFamily: string;
    fontColorHex: string;
    bgColorHex: string;
    hasHeroCTA: boolean;
    hasMetaDescription: boolean;
    hasFavicon: boolean;
    hasAnimations: boolean;
    heroHasClientCopy: boolean;
    hasAboveFoldProposition: boolean;
    colorCount: number;
    hasBreathing: boolean;
    heroCopyLength: number;
}

interface UXAudit {
    architecture: number;  // /25 — UX & cognition
    ui: number;            // /25 — UI & prestige
    conversion: number;    // /25 — conversion
    technique: number;     // /25 — technical
    details: string[];     // notable findings
    metrics: UXMetrics;
}

async function runUXAudit(page: Page, loadTimeSeconds: number): Promise<UXAudit> {
    const details: string[] = [];

    const metrics = await page.evaluate(() => {
        // Architecture UX
        const navLinks = document.querySelectorAll('nav a, header nav a');
        const menuCount = navLinks.length;
        const hasH1 = !!document.querySelector('h1');
        const clicksToContact = (
            document.querySelector('a[href*="contact"], a[href*="rendez-vous"], a[href*="booking"]') != null
        );

        // UI & prestige
        const styles = getComputedStyle(document.body);
        const bgColor = styles.backgroundColor;
        const visibleText = document.body.innerText;

        // Color diversity heuristic: count unique color-like tokens from inline styles
        const inlineColors = new Set<string>();
        document.querySelectorAll('[style]').forEach(el => {
            const m = (el as HTMLElement).style.color || '';
            if (m) inlineColors.add(m);
        });

        // Conversion — CTAs (exclude cookie banners and navigation links)
        const ctaCount = (() => {
            const ctaEls = document.querySelectorAll(
                'a[href*="contact"], a[href*="rendez-vous"], a[href*="calendly"], a[href*="booking"], button[class*="cta"], .cta, [class*="btn-primary"], a[href*="consultation"]'
            );
            let count = 0;
            for (const el of Array.from(ctaEls)) {
                const text = el.textContent?.toLowerCase() || '';
                const cls = (el as HTMLElement).className?.toLowerCase() || '';
                const parent = (el as HTMLElement).closest('[class*="cookie"], [class*="rgpd"], [class*="gdpr"], [class*="consent"], [id*="cookie"], [id*="consent"], [id*="gdpr"]');
                // Exclude cookie/GDPR buttons and nav links
                if (parent) continue;
                if (text.match(/accept|cookie|rgpd|gdpr|privacy|refuser|param[eè]tre/)) continue;
                if (cls.includes('cookie') || cls.includes('consent')) continue;
                count++;
            }
            return count;
        })();
        const hasTestimonials = !!(
            document.querySelector('[class*="testimonial"], [class*="avis"], [class*="review"], [itemprop="review"]')
        );
        // ── IMPROVED hasTeamPhotos for homepage ─────────────────────────
        const hasTeamPhotos = (() => {
            const selectors = [
                '[class*="team"]', '[class*="equipe"]', '[class*="avocat"]',
                '[class*="partner"]', '[class*="associe"]', '[class*="member"]',
                '[class*="attorney"]', '[class*="lawyer"]', '[class*="person"]',
                '[class*="profil"]', '[class*="profile"]', '[class*="collaborateur"]',
            ];
            const hasContainer = selectors.some(sel =>
                document.querySelector(sel) !== null
            );
            const imgsInContainers = selectors.some(sel => {
                const els = document.querySelectorAll(sel);
                return Array.from(els).some(c => c.querySelector('img') !== null);
            });
            const namedFigures = Array.from(document.querySelectorAll('figure, article')).filter(el =>
                el.querySelector('img') !== null &&
                el.querySelector('h2, h3, h4, p strong, [class*="name"]') !== null
            );
            return hasContainer || imgsInContainers || namedFigures.length >= 2;
        })();

        // Typography
        const h1El = document.querySelector('h1');
        const bodyEl = document.body;
        const h1Size = h1El ? parseFloat(getComputedStyle(h1El).fontSize) : 0;
        const bodySize = parseFloat(getComputedStyle(bodyEl).fontSize);
        const hasTypographyHierarchy = h1Size > bodySize * 1.4;

        // Font: detect system/web-safe vs custom
        const fontFamily = getComputedStyle(document.body).fontFamily.toLowerCase();
        const isDefaultFont = ['arial', 'helvetica', 'times new roman', 'georgia', 'verdana'].some(f => fontFamily.includes(f));

        // Images: any stock photo signals (Alt texts with generic words)
        const imgs = Array.from(document.querySelectorAll('img[alt]'));
        const genericAlts = imgs.filter(img => {
            const alt = img.getAttribute('alt')?.toLowerCase() || '';
            return ['business', 'office', 'handshake', 'team', 'istock', 'shutterstock', 'gettyimages'].some(kw => alt.includes(kw));
        }).length;

        // Technical: contrast (rough)
        const fontColorHex = styles.color;
        const bgColorHex = bgColor;

        // Hero CTA: check if the first visible section has a REAL action button (not just nav links)
        const hasHeroCTA = (() => {
            const heroSelectors = ['.hero', '#hero', '[class*="hero"]', '[class*="banner"]',
                '[class*="slider"]', 'header + section', 'header + div',
                'main > section:first-child', 'main > div:first-child'];
            for (const sel of heroSelectors) {
                const hero = document.querySelector(sel);
                if (hero) {
                    const btns = hero.querySelectorAll('a, button');
                    for (const btn of Array.from(btns)) {
                        const text = btn.textContent?.toLowerCase().trim() || '';
                        const href = (btn as HTMLAnchorElement).href || '';
                        const cls = (btn as HTMLElement).className?.toLowerCase() || '';
                        const isNav = !!(btn as HTMLElement).closest('nav');
                        if (isNav) continue;
                        // Must have action text, styled as button, or link to contact
                        const isActionText = /contact|rendez|appel|consult|rdv|book|découvr|en savoir|nous joindre|prendre|demande|call|schedule|learn more|get in touch/.test(text);
                        const isStyledBtn = cls.includes('btn') || cls.includes('cta') || cls.includes('button') || btn.tagName === 'BUTTON';
                        const isContactLink = href.includes('contact') || href.includes('rendez') || href.includes('calendly') || href.includes('booking');
                        if (isActionText || isStyledBtn || isContactLink) return true;
                    }
                    return false;
                }
            }
            // Fallback: check the top 600px for action buttons (not in nav/header)
            const allBtns = Array.from(document.querySelectorAll('a, button'));
            return allBtns.some(el => {
                const rect = el.getBoundingClientRect();
                const isNav = !!(el as HTMLElement).closest('nav, header');
                if (isNav || rect.top >= 600 || rect.top < 80) return false;
                const text = el.textContent?.toLowerCase().trim() || '';
                return /contact|rendez|appel|consult|rdv|book|découvr|nous joindre|prendre|demande/.test(text);
            });
        })();

        // Meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        const hasMetaDescription = !!(metaDesc && metaDesc.getAttribute('content')?.trim());

        // Favicon
        const hasFavicon = !!(document.querySelector('link[rel*="icon"]'));

        // CSS animations/transitions (signals modern design)
        const allEls = document.querySelectorAll('*');
        let hasAnimations = false;
        for (let i = 0; i < Math.min(allEls.length, 200); i++) {
            const cs = getComputedStyle(allEls[i]);
            if (cs.transition !== 'all 0s ease 0s' && cs.transition !== '' && cs.transition !== 'none') {
                hasAnimations = true;
                break;
            }
            if (cs.animation && cs.animation !== 'none') {
                hasAnimations = true;
                break;
            }
        }

        // Hero copy: client-oriented?
        const heroEl = document.querySelector('.hero, [class*="hero"], [class*="banner"], header + section, main > section:first-child');
        const heroText = heroEl ? (heroEl as HTMLElement).innerText?.toLowerCase() || '' : '';
        const heroHasClientCopy = (() => {
            if (!heroEl) return false;
            const clientTerms = ['vous', 'votre', 'vos', 'protéger', 'défendre', 'accompagner', 'solution', 'your', 'you', 'protect', 'help'];
            return clientTerms.some(t => heroText.includes(t));
        })();

        // Above-fold value proposition: does the hero answer "why should I care?"
        const hasAboveFoldProposition = (() => {
            if (!heroEl) return false;
            const text = heroText;
            // A value prop should have some substance (not just a name)
            return text.length > 30 && (text.includes('vous') || text.includes('votre') ||
                text.includes('your') || text.includes('we ') ||
                /accompagn|défend|protég|conseil|expert|spécial|solution|cabinet/.test(text));
        })();

        // Color diversity: count distinct background colors used across major elements
        const colorCount = (() => {
            const colors = new Set<string>();
            const elements = document.querySelectorAll('header, nav, section, footer, main, div, aside');
            for (let i = 0; i < Math.min(elements.length, 100); i++) {
                const bg = getComputedStyle(elements[i]).backgroundColor;
                if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                    colors.add(bg);
                }
            }
            return colors.size;
        })();

        // Whitespace/breathing: check if main content area has generous padding
        const hasBreathing = (() => {
            const main = document.querySelector('main, .content, .main, #content, body > div');
            if (!main) return true;
            const cs = getComputedStyle(main);
            const paddingLeft = parseFloat(cs.paddingLeft);
            const paddingTop = parseFloat(cs.paddingTop);
            return paddingLeft >= 20 || paddingTop >= 20;
        })();

        // Hero copy length (Hick's law: too much text = decision paralysis)
        const heroCopyLength = heroText.length;

        return {
            menuCount,
            hasH1,
            clicksToContact,
            ctaCount,
            hasTestimonials,
            hasTeamPhotos,
            hasTypographyHierarchy,
            isDefaultFont,
            genericAlts,
            bodyFontSize: bodySize,
            inlineColorCount: inlineColors.size,
            visibleTextLength: visibleText.length,
            fontFamily,
            fontColorHex,
            bgColorHex,
            hasHeroCTA,
            hasMetaDescription,
            hasFavicon,
            hasAnimations,
            heroHasClientCopy,
            hasAboveFoldProposition,
            colorCount,
            hasBreathing,
            heroCopyLength,
        };
    });

    // ── CATEGORY 1 : Architecture UX /25 (Miller, Hick, Ockham, Jacob) ──────────
    let arch = 25;

    if (metrics.menuCount > 7) {
        arch -= 10;
        details.push(`Menu surchargé (${metrics.menuCount} liens) : la loi de Miller limite la mémoire de travail à 7 éléments. Au-delà, le visiteur est en surcharge cognitive et ne sait plus où cliquer.`);
    }
    if (!metrics.hasH1) {
        arch -= 8;
        details.push(`Absence de balise H1 : aucune hiérarchie de navigation structurée. Le visiteur ne sait pas immédiatement où poser son regard à l'arrivée (loi de Jacob : les utilisateurs s'attendent à une structure familière).`);
    }
    if (!metrics.clicksToContact) {
        arch -= 10;
        details.push(`Aucun accès rapide à la prise de contact depuis la page d'accueil. L'information critique doit être accessible en deux clics maximum.`);
    }
    if (metrics.heroCopyLength > 500) {
        arch -= 5;
        details.push(`Trop de texte dans la section d'accueil (${metrics.heroCopyLength} caractères). La loi de Hick démontre que plus on offre d'informations simultanément, plus la prise de décision ralentit. Le hero doit être épuré et décisif.`);
    }

    // ── CATEGORY 2 : UI & prestige /25 (Aesthetic-Usability, Pragnanz, espace négatif) ──
    let ui = 25;

    if (metrics.isDefaultFont) {
        ui -= 10;
        details.push(`Typographie système détectée (${metrics.fontFamily.split(',')[0].trim()}) : aucune intention typographique. La hiérarchie typographique est l'un des premiers signaux de prestige perçu par le visiteur, avant même la lecture.`);
    }
    if (!metrics.hasTypographyHierarchy) {
        ui -= 8;
        details.push(`Hiérarchie typographique absente : titres et corps de texte se confondent. La distinction H1/H2/body doit être évidente au premier coup d'œil pour guider la lecture.`);
    }
    if (metrics.genericAlts > 2) {
        ui -= 10;
        details.push(`Photos génériques de banque d'images détectées. Dans un secteur où la confiance est fondamentale, des visuels authentiques sont indispensables.`);
    }
    if (!metrics.hasAnimations && metrics.isDefaultFont) {
        ui -= 8;
        details.push(`Interface statique sans micro-animations ni transitions : le site manque de dynamisme et projette une image datée.`);
    }
    if (metrics.colorCount > 6) {
        ui -= 6;
        details.push(`Palette chromatique trop dispersée (${metrics.colorCount} couleurs distinctes détectées). Un site premium utilise 2 à 3 couleurs principales maximum. La retenue chromatique est un signal de luxe et de maîtrise.`);
    }
    if (!metrics.hasBreathing) {
        ui -= 6;
        details.push(`Manque d'espace négatif (marges et respirations). Les designs surchargés signalent un positionnement bas de gamme. La retenue visuelle projette la confiance et le prestige (loi de Pragnanz).`);
    }

    // ── CATEGORY 3 : Conversion /25 (Fitts, Goal Gradient, preuve sociale) ──────
    let conv = 25;

    if (!metrics.hasHeroCTA) {
        conv -= 12;
        details.push(`Aucun appel à l'action dans la section hero. Le visiteur arrive, voit un titre, mais rien ne l'invite à agir. La loi de Fitts dicte qu'un bouton absent ne génère aucun rendez-vous.`);
    }
    if (metrics.ctaCount === 0) {
        conv -= 8;
        details.push(`Aucun Call-To-Action identifiable sur la page. Sans bouton visible de taille et position adéquates, la page ne convertit pas.`);
    } else if (metrics.ctaCount === 1) {
        conv -= 4;
    }
    if (!metrics.hasTestimonials) {
        conv -= 8;
        details.push(`Aucune preuve sociale visible : pas de témoignages clients, pas de résultats chiffrés. La densité des signaux de confiance est un facteur déterminant de conversion.`);
    }
    if (!metrics.hasTeamPhotos) {
        conv -= 8;
        details.push(`Les avocats ne sont pas présentés visuellement. Dans une profession de confiance, l'anonymat de l'équipe freine la prise de contact.`);
    }
    if (!metrics.heroHasClientCopy) {
        conv -= 6;
        details.push(`Le copywriting n'est pas orienté client : absence de \"vous\", aucune promesse concrète. Le site doit répondre à \"pourquoi devrais-je m'intéresser à vous ?\" en moins de 5 secondes.`);
    }
    if (!metrics.hasAboveFoldProposition) {
        conv -= 5;
        details.push(`Aucune proposition de valeur claire au-dessus de la ligne de flottaison. Le visiteur doit comprendre votre positionnement dès l'écran d'accueil, sans scroller.`);
    }

    // ── CATEGORY 4 : Technique & accessibilité /25 (Performance, WCAG, mobile) ──
    let tech = 25;

    if (loadTimeSeconds > 3.5) {
        tech -= 12;
        details.push(`Chargement à ${loadTimeSeconds}s : au-delà du seuil mobile de 3,5s. La lenteur est perçue comme un signal de structure précaire. Les marques premium chargent vite.`);
    } else if (loadTimeSeconds > 2.5) {
        tech -= 6;
        details.push(`Chargement à ${loadTimeSeconds}s : au-delà du seuil idéal de 2,5s sur desktop. Marge d'optimisation technique réelle.`);
    }
    if (metrics.bodyFontSize < 16) {
        tech -= 8;
        details.push(`Taille de police du corps inférieure à 16px (${Math.round(metrics.bodyFontSize)}px détectés). Le standard WCAG AA exige 16px minimum pour la lisibilité.`);
    }
    if (!metrics.hasMetaDescription) {
        tech -= 5;
        details.push(`Aucune balise meta description : le site perd en visibilité Google et en taux de clic dans les résultats de recherche.`);
    }
    if (!metrics.hasFavicon) {
        tech -= 3;
        details.push(`Pas de favicon : un détail de finition qui signale un manque de soin technique.`);
    }

    const architecture = Math.max(0, arch);
    const uiScore = Math.max(0, ui);
    const conversion = Math.max(0, conv);
    const technique = Math.max(0, tech);

    return { architecture, ui: uiScore, conversion, technique, details, metrics };
}

// ─── Score global ─────────────────────────────────────────────────────────────

function computeScore(
    failles: { Est_Template: boolean; UI_Obsolete: boolean; Copywriting_Juridique: boolean; Pas_Mobile: boolean; Pas_SSL: boolean; Temps_Chargement?: number },
    ux: UXAudit
): number {
    // UX score out of 100
    const uxTotal = ux.architecture + ux.ui + ux.conversion + ux.technique;

    // Structural penalties (these compound with UX deductions)
    let penalty = 0;
    if (failles.Pas_SSL) penalty += 15;
    if (failles.Est_Template) penalty += 15;
    if (failles.Copywriting_Juridique) penalty += 10;
    if (failles.UI_Obsolete) penalty += 15;
    if (failles.Pas_Mobile) penalty += 20;

    return Math.max(5, Math.min(95, uxTotal - penalty));
}

// ─── Main scraper ─────────────────────────────────────────────────────────────

export async function scrapeWebsite(
    url: string,
    browser: Browser,
    overrides?: Partial<AuditForceData>
): Promise<ScrapedAuditData> {
    const isHttps = url.startsWith('https://');
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
    let parsedDomain: string;
    try {
        parsedDomain = new URL(normalizedUrl).hostname;
    } catch {
        throw new Error(`URL invalide ou malformée : "${url}"`);
    }
    const domain = parsedDomain;

    const page = await browser.newPage();

    try {
        await page.setViewport({ width: 1280, height: 800 });
        await page.setUserAgent(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

        const startTime = Date.now();
        await page.goto(normalizedUrl, { waitUntil: 'networkidle2', timeout: 25000 });
        const rawLoadTime = (Date.now() - startTime) / 1000;

        // Wait for images to load and page to settle
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Try to dismiss cookie banners before screenshot
        await page.evaluate(() => {
            const cookieSelectors = [
                '[class*="cookie"] button', '[id*="cookie"] button',
                '[class*="consent"] button', '[id*="consent"] button',
                '[class*="gdpr"] button', '[class*="rgpd"] button',
                'button[class*="accept"]', 'a[class*="accept"]',
            ];
            for (const sel of cookieSelectors) {
                const btn = document.querySelector(sel) as HTMLElement;
                if (btn) { btn.click(); break; }
            }
        });
        await new Promise(resolve => setTimeout(resolve, 500));

        // Screenshot at desktop viewport (after page fully loaded)
        const screenshotBuffer = await page.screenshot({ type: 'png', fullPage: false });
        const screenshotBase64 = Buffer.from(screenshotBuffer).toString('base64');

        const html = await page.content();
        const bodyText = await page.evaluate(() => document.body?.innerText || '');
        const title = await page.title();

        const generator = await page.evaluate(
            () => document.querySelector('meta[name="generator"]')?.getAttribute('content') || ''
        );
        const ogSiteName = await page.evaluate(
            () => document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || ''
        );
        const h1 = await page.evaluate(() => document.querySelector('h1')?.innerText || '');
        const hasViewport = await page.evaluate(
            () => !!document.querySelector('meta[name="viewport"]')
        );

        // Mobile viewport test
        await page.setViewport({ width: 375, height: 812 });
        await new Promise(resolve => setTimeout(resolve, 500));
        const mobileIssue = await page.evaluate(
            () => document.body.scrollWidth > window.innerWidth + 20
        );
        await page.setViewport({ width: 1280, height: 800 });

        // Load time via performance API
        const navTimingJson = await page.evaluate(
            () => JSON.stringify(performance?.timing || {})
        );
        let measuredLoad = rawLoadTime;
        try {
            const t = JSON.parse(navTimingJson);
            const ms = t.loadEventEnd - t.navigationStart;
            if (ms > 0) measuredLoad = Math.round((ms / 1000) * 10) / 10;
        } catch { /* use rawLoadTime */ }

        // Run full UX audit on homepage
        const uxAudit = await runUXAudit(page, measuredLoad);

        // ── Full site crawl ─────────────────────────────────────────────────────
        const crawledPages = await crawlAllPages(browser, normalizedUrl, page);
        let mergedHasTeamPhotos = uxAudit.metrics.hasTeamPhotos;
        let mergedHasTestimonials = uxAudit.metrics.hasTestimonials;
        let mergedBodyText = bodyText;
        let mergedEquipe = extractTeamCount(html);

        for (const crawled of crawledPages) {
            if (crawled.hasTeamPhotos) mergedHasTeamPhotos = true;
            if (crawled.hasTestimonials) mergedHasTestimonials = true;
            if (crawled.bodyText) mergedBodyText += ' ' + crawled.bodyText;
            if (crawled.teamCount > 0 && (!mergedEquipe || crawled.teamCount > mergedEquipe)) {
                mergedEquipe = crawled.teamCount;
            }
        }

        // Patch UX metrics with full-site findings
        uxAudit.metrics.hasTeamPhotos = mergedHasTeamPhotos;
        uxAudit.metrics.hasTestimonials = mergedHasTestimonials;
        if (mergedHasTeamPhotos) {
            const idx = uxAudit.details.findIndex(d => d.includes('visuellement') || d.includes('anonymat'));
            if (idx !== -1) { uxAudit.details.splice(idx, 1); uxAudit.conversion = Math.min(25, uxAudit.conversion + 7); }
        }
        if (mergedHasTestimonials) {
            const idx = uxAudit.details.findIndex(d => d.includes('preuve sociale') || d.includes('Zéro preuve'));
            if (idx !== -1) { uxAudit.details.splice(idx, 1); uxAudit.conversion = Math.min(25, uxAudit.conversion + 8); }
        }
        // ─────────────────────────────────────────────────────────────────────


        const nom = extractCabinetName(title, h1, ogSiteName, domain);
        const { isTemplate, templateName } = detectCMS(html, generator);
        const { spec1, spec2 } = detectSpecialties(mergedBodyText);
        const tooJuridical = detectCopywritingStyle(mergedBodyText);
        const ville = extractVille(mergedBodyText);
        const annee = extractYear(mergedBodyText);
        const equipe = mergedEquipe;
        const { note: noteGoogle, nb: nbAvis } = extractGoogleRating(html);
        const contacts = extractContacts(html, mergedBodyText);

        const uiObsolete =
            (html.match(/<table/gi) || []).length > 3 ||
            html.includes('font-awesome/4') ||
            html.includes('bootstrap/3') ||
            html.includes('jquery/1.') ||
            /<center>|<font |<frameset|bgcolor=|align="center"/i.test(html) ||
            (uxAudit.metrics.isDefaultFont && uxAudit.metrics.colorCount > 6);

        const failles = {
            Est_Template: isTemplate,
            UI_Obsolete: uiObsolete,
            Copywriting_Juridique: tooJuridical,
            Pas_Mobile: !hasViewport || mobileIssue,
            Pas_SSL: !isHttps,
            Temps_Chargement: measuredLoad > 0 ? measuredLoad : undefined,
        };

        const score = computeScore(failles, uxAudit);

        return {
            // Core
            Nom_Cabinet: nom,
            URL_Site: normalizedUrl,
            Score_Global: score,
            Screenshot_Base64: screenshotBase64,

            // Forces (overrides from CSV take precedence)
            Nom_Classement: overrides?.Nom_Classement,
            Note_Google: overrides?.Note_Google ?? noteGoogle,
            Nb_Avis_Google: overrides?.Nb_Avis_Google ?? nbAvis,
            Taille_Equipe: overrides?.Taille_Equipe ?? equipe,
            Annee_Creation: overrides?.Annee_Creation ?? annee,
            Specialite_1: overrides?.Specialite_1 ?? spec1,
            Specialite_2: overrides?.Specialite_2 ?? spec2,
            Ville: overrides?.Ville ?? ville,

            // Contacts
            Email: contacts.email,
            Telephone: contacts.phone,
            LinkedIn: contacts.linkedin,

            // Failles
            ...failles,
            Nom_Template: templateName,
            UI_Commentaire: undefined,

            // UX boolean indicators derived from metrics
            UX_Menu_Surcharge: uxAudit.metrics.menuCount > 7,
            UX_Pas_H1: !uxAudit.metrics.hasH1,
            UX_Contact_Difficile: !uxAudit.metrics.clicksToContact || uxAudit.metrics.ctaCount === 0,
            UX_Police_Defaut: uxAudit.metrics.isDefaultFont,
            UX_Pas_Hierarchie: !uxAudit.metrics.hasTypographyHierarchy,
            UX_Photos_Generiques: uxAudit.metrics.genericAlts > 2,
            UX_Pas_Confiance: !uxAudit.metrics.hasTestimonials,
            UX_Equipe_Anonyme: !uxAudit.metrics.hasTeamPhotos,
            UX_Police_Petite: uxAudit.metrics.bodyFontSize < 16,

            UX_Architecture_Intuitive: uxAudit.metrics.menuCount <= 7 && uxAudit.metrics.hasH1,
            UX_Typographie_Prestige: !uxAudit.metrics.isDefaultFont && uxAudit.metrics.hasTypographyHierarchy,
            UX_Preuve_Sociale: uxAudit.metrics.hasTestimonials,
            UX_Equipe_Visible: uxAudit.metrics.hasTeamPhotos,
            UX_Vitesse_Excellente: (measuredLoad > 0 && measuredLoad < 1.5),

            // UX scores
            UX_Score_Architecture: uxAudit.architecture,
            UX_Score_UI: uxAudit.ui,
            UX_Score_Conversion: uxAudit.conversion,
            UX_Score_Technique: uxAudit.technique,
            UX_Details: uxAudit.details,
        };
    } finally {
        await page.close();
    }
}

export async function scrapeMultipleSites(
    entries: { url: string; overrides?: Partial<AuditForceData> }[]
): Promise<ScrapedAuditData[]> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    try {
        const results: ScrapedAuditData[] = [];
        for (const { url, overrides } of entries) {
            try {
                const data = await scrapeWebsite(url, browser, overrides);
                results.push(data);
            } catch (err) {
                console.error(`Scraping failed for ${url}:`, err);
                results.push({
                    Nom_Cabinet: (() => { try { return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', ''); } catch { return url; } })(),
                    URL_Site: url,
                    Score_Global: 50,
                    Screenshot_Base64: '',
                    Est_Template: false,
                    UI_Obsolete: false,
                    Copywriting_Juridique: false,
                    Pas_Mobile: false,
                    Pas_SSL: !url.startsWith('https'),
                });
            }
        }
        return results;
    } finally {
        await browser.close();
    }
}
