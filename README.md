# Orsayn — website

Site web Orsayn (FR/EN), reconstruit from scratch.

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [next-intl](https://next-intl.dev) pour l'internationalisation FR/EN
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript

## Développement

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Structure

- `app/[locale]/` — pages localisées
- `i18n/` — configuration next-intl (routing, navigation, request)
- `messages/` — traductions FR/EN
- `proxy.ts` — proxy Next.js gérant le routage des locales
