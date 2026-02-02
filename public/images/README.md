# Images Directory

Place your static images and assets here.

## Recommended structure:
```
public/
└── images/
    ├── logo.png
    ├── og-image.jpg
    ├── hero/
    ├── services/
    └── team/
```

## Usage:
Images in `/public` can be referenced with absolute paths:
```tsx
<Image src="/images/logo.png" alt="Orsayn" width={120} height={40} />
```
