# Fonts Directory

Place self-hosted font files here (WOFF2 format recommended).

## Expected fonts:
- `Boska-Variable.woff2` - For headings (font-serif)
- `GeneralSans-Variable.woff2` - For body text (font-sans)

## Usage in layout.tsx:
```typescript
import localFont from 'next/font/local';

const boska = localFont({
  src: './fonts/Boska-Variable.woff2',
  variable: '--font-boska',
  display: 'swap',
});

const generalSans = localFont({
  src: './fonts/GeneralSans-Variable.woff2',
  variable: '--font-general-sans',
  display: 'swap',
});
```
