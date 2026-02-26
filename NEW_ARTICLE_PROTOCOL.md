# 🧬 PROTOCOLE D'INJECTION — Nouveaux Articles Orsayn

**Framework "Nouvelle Doctrine"** par Chief Search Strategist

---

## 🎯 UTILISATION

À chaque nouvel article, remplis les crochets `[ ]` de ce template et envoie-le à l'IA.

---

## 🖼️ SYSTÈME D'IMAGES PAR CATÉGORIE

**Fonctionnement Automatique :**

Les articles affichent automatiquement l'image correspondant à leur catégorie via la fonction `getCategoryImage()`.

### Images Disponibles

| Catégorie FR | Catégorie EN | Fichier Image |
|--------------|--------------|---------------|
| IDENTITÉ | IDENTITY | `identite-img.webp` |
| STRATÉGIE | STRATEGY | `strategie-img-2.webp` |
| INFLUENCE | INFLUENCE | `influence-img.webp` |

**Emplacement :** `public/images/journal/`

**Règle :** Quand tu définis la catégorie de ton article (IDENTITÉ, STRATÉGIE ou INFLUENCE), l'image correspondante s'affiche automatiquement. Tu n'as PAS à spécifier manuellement quelle image utiliser.

---

## TEMPLATE PROMPT POUR NOUVEL ARTICLE

```
# MISSION : CRÉATION D'UN NOUVEL ARTICLE DE DOCTRINE

**CONTEXTE :** Ajout d'une nouvelle pièce de contenu au site Orsayn.
**SUJET :** [TON SUJET OU TITRE ICI]
**DATE DE PUBLICATION SOUHAITÉE :** [DATE FORMAT AAAA-MM-JJ]
**TAG PRINCIPAL :** [IDENTITÉ / STRATÉGIE / INFLUENCE]

---

## ÉTAPE 1 : CRÉATION DE LA PAGE

1. **Définis un slug SEO-optimisé :**
   - Minuscules uniquement
   - Tirets (pas d'espaces, pas d'underscores)
   - Sans accents ni caractères spéciaux
   - Maximum 60 caractères
   - Contient le mot-clé principal

2. **Crée le fichier :**
   `app/[locale]/(main)/journal/[slug]/page.tsx`

3. **Analyse les articles existants :**
   - Ouvre les fichiers d'articles actuels dans `app/[locale]/(main)/journal/`
   - Identifie EXACTEMENT la structure utilisée (composants, classes Tailwind, hiérarchie)
   - Copie la structure à l'identique
   - NE modifie PAS le design, les marges, les polices, les couleurs

4. **Rédige le contenu selon le ton Orsayn :**
   - Ton : Élitiste, tranchant, Business-First
   - Vocabulaire juridique/professionnel premium
   - Phrases courtes, directes, impactantes
   - Pas de blabla marketing
   - Structure : Intro italique, Snippet AEO (encadré), Sections H2 uppercase, Conclusion CTA

5. **Ajoute les métadonnées SEO :**
   - Exporte `generateMetadata` avec :
     - title : < 60 caractères, mot-clé principal
     - description : < 160 caractères, mot-clé + CTA
     - openGraph : type 'article', publishedTime, authors
   - Date de publication dans les métadonnées

6. **Gère l'internationalisation :**
   - Utilise `useTranslations('journal.articles.articleN')` où N est le numéro du nouvel article
   - Ajoute les traductions dans `messages/fr.json` et `messages/en.json`
   - OU analyse comment les articles actuels gèrent l'i18n et fais pareil

---

## ÉTAPE 2 : ENREGISTREMENT DATA LAYER

**Analyse d'abord comment les articles actuels sont stockés :**

1. Cherche s'il existe un fichier `lib/journal-data.ts` ou équivalent
2. OU vérifie si les articles sont directement dans `messages/fr.json` et `messages/en.json`
3. OU identifie comment `components/Perspectives.tsx` récupère la liste des articles

**Puis ajoute le nouvel article selon le même système :**

- ID unique
- Slug (identique à l'étape 1)
- Titre FR + EN
- Description courte FR + EN
- Date (AAAA-MM-JJ)
- **Tag/Catégorie (CRITIQUE) :** IDENTITÉ, STRATÉGIE ou INFLUENCE (FR) et IDENTITY, STRATEGY ou INFLUENCE (EN)
- Reading time (estimation)
- **Image :** Utilise `getCategoryImage(category)` — NE spécifie PAS de chemin d'image manuel

**IMPORTANT :** Respecte EXACTEMENT la structure existante.

---

## ÉTAPE 3 : VÉRIFICATION SYSTÈME IMAGES

**Fichier : `components/Perspectives.tsx`**

1. Vérifie que la fonction `getCategoryImage()` existe
2. Si elle existe, assure-toi que ton article utilise cette fonction pour l'image
3. Si elle n'existe PAS, crée-la AVANT d'ajouter l'article :

```typescript
function getCategoryImage(category: string): string {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('identité') || categoryLower.includes('identity')) {
    return '/images/journal/identite-img.webp';
  }
  if (categoryLower.includes('stratégie') || categoryLower.includes('strategy')) {
    return '/images/journal/strategie-img-2.webp';
  }
  if (categoryLower.includes('influence')) {
    return '/images/journal/influence-img.webp';
  }
  
  // Image par défaut si catégorie non reconnue
  return '/images/journal/strategie-img-2.webp';
}
```

4. Utilise cette fonction dans l'objet article :

```typescript
{
  // ... autres propriétés
  category: t('articles.articleN.category'),  // "STRATÉGIE" ou "STRATEGY"
  image: getCategoryImage(t('articles.articleN.category')),  // ← Automatique
  // ... autres propriétés
}
```

**RÈGLE CRITIQUE :** L'image est définie AUTOMATIQUEMENT selon la catégorie. Ne hardcode JAMAIS un chemin d'image.

---

## ÉTAPE 4 : SITEMAP SEO

**Fichier : `app/sitemap.ts`**

Ajoute 2 URLs (FR + EN) :

```typescript
{
  url: `${baseUrl}/fr/journal/[TON-SLUG]`,
  lastModified: new Date('[TA-DATE]'),
  changeFrequency: 'monthly' as const,
  priority: 0.8,
},
{
  url: `${baseUrl}/en/journal/[TON-SLUG]`,
  lastModified: new Date('[TA-DATE]'),
  changeFrequency: 'monthly' as const,
  priority: 0.8,
},
```

---

## ÉTAPE 5 : INDEXATION IA (DISCOVERY)

**Fichier : `public/llms.txt`**

Il est CRITIQUE d'ajouter l'article dans ce fichier pour qu'il soit indexé par les IA (ChatGPT, Perplexity, etc.).

Ajoute l'article en FR et en EN à la fin des sections correspondantes :

```markdown
### [FR] [TITRE ARTICLE]
- URL : https://www.orsayn.com/fr/journal/[SLUG]
- Catégorie : [CATÉGORIE]
- Date : [DATE AAAA-MM-JJ]
- Résumé : [RÉSUMÉ COURT 1 PHRASE]

### [EN] [TITLE ARTICLE]
- URL : https://www.orsayn.com/en/journal/[SLUG]
- Category : [CATEGORY]
- Date : [DATE AAAA-MM-JJ]
```

---

## ÉTAPE 6 : PLAN DU SITE (VISITEURS)

**Fichier : `app/[locale]/(legal)/plan-du-site/page.tsx`**

La liste des articles sur cette page est **hardcodée** pour un contrôle total du design.

1. **Ajoute le lien dans le fichier :**
   Localise la liste des articles (sous `t('nav.review')`) et ajoute le nouveau `<li>` :

```tsx
<li className="pl-4">
    <Link href="/journal/[SLUG]" className="hover:opacity-60 transition-opacity text-gray-500">
        {t('articles.[KEY]')}
    </Link>
</li>
```

2. **Ajoute les traductions :**
   Dans `messages/fr.json` et `messages/en.json`, va dans la section `legal.sitemap.articles` et ajoute la clé correspondante :

```json
"articles": {
    ...
    "[KEY]": "— [TITRE_AFFICHE]"
}
```
```

---

## ✅ CONSIGNES SEO (Chief Search Strategist)

### Slug Optimization
- Minuscules, tirets, sans accents
- < 60 caractères
- Mot-clé principal inclus
- Exemples : "dissonance-prestige", "architecture-strategique"

### Title Tag
- < 60 caractères (sinon coupé dans Google)
- Mot-clé principal en début
- Format : "Titre Principal | Orsayn"

### Meta Description
- < 160 caractères
- Mot-clé principal + secondaire
- Appel à l'action (CTA)
- Format : "Découvrez [sujet]. [Bénéfice]. [CTA]."

### Structure On-Page
- H1 unique (titre article)
- H2 pour sections principales
- Pas de saut de hiérarchie (H1 → H3 interdit)
- Snippet AEO : Encadré réponse directe (position zéro Google)

### OpenGraph
- type: 'article'
- publishedTime: Date ISO
- authors: ['Orsayn']
- Image OG : 1200x630px si applicable

---

## 📋 CHECKLIST POST-CRÉATION

- [ ] Fichier `[slug]/page.tsx` créé
- [ ] Design strictement identique aux articles existants
- [ ] Traductions ajoutées (FR + EN)
- [ ] Métadonnées `generateMetadata` exportées
- [ ] Catégorie définie : IDENTITÉ, STRATÉGIE ou INFLUENCE
- [ ] Entrée ajoutée dans data layer (selon système existant)
- [ ] Image automatique via `getCategoryImage()` (PAS de chemin hardcodé)
- [ ] URLs ajoutées dans `sitemap.ts` (FR + EN)
- [ ] Entrée ajoutée dans `public/llms.txt` (FR + EN)
- [ ] Test local : `http://localhost:3000/fr/journal/[slug]`
- [ ] Test EN : `http://localhost:3000/en/journal/[slug]`
- [ ] Image correcte affichée selon catégorie :
  - IDENTITÉ → `identite-img.webp`
  - STRATÉGIE → `strategie-img-2.webp`
  - INFLUENCE → `influence-img.webp`
- [ ] Article apparaît dans grille "Perspectives" (home)
- [ ] Article apparaît dans page `/journal`
- [ ] Lien ajouté dans `app/[locale]/(legal)/plan-du-site/page.tsx` (ÉTAPE 6)
- [ ] Clé de traduction ajoutée dans `messages/fr.json` et `messages/en.json` (section `legal.sitemap.articles`)
- [ ] Rotation automatique : ancien article passe en annales si besoin

---

## 🔄 ROTATION AUTOMATIQUE HOME/ANNALES

**Fonctionnement :**

1. Les articles sont triés par **date de publication** (plus récent en premier)
2. La **page d'accueil** affiche les **3 articles les plus récents**
3. Les articles plus anciens passent automatiquement dans **"Annales"** (`/journal/annales`)

**Exemple :**

```
4 articles au total (triés par date) :
1. Article 4 - 2025-02-15 (INFLUENCE) → Affiché home
2. Article 1 - 2025-01-15 (STRATÉGIE) → Affiché home
3. Article 2 - 2025-01-10 (IDENTITÉ) → Affiché home
4. Article 3 - 2025-01-05 (STRATÉGIE) → Va dans Annales

Quand Article 5 est ajouté (2025-03-01 - INFLUENCE) :
1. Article 5 - 2025-03-01 (INFLUENCE) → Affiché home
2. Article 4 - 2025-02-15 (INFLUENCE) → Affiché home
3. Article 1 - 2025-01-15 (STRATÉGIE) → Affiché home
4. Article 2 - 2025-01-10 (IDENTITÉ) → Annales
5. Article 3 - 2025-01-05 (STRATÉGIE) → Annales
```

**Conséquence Images :**

- Home affiche 3 articles récents → Possiblement 3 images différentes selon catégories
- Si 2 articles INFLUENCE → Même image (`influence-img.webp`)
- Annales affiche tous les anciens articles → Chacun avec son image catégorie

---

## 🚫 ERREURS À ÉVITER

### Erreur 1 : Lien Fantôme
**Problème :** Page créée mais n'apparaît pas dans la grille Perspectives.
**Cause :** Oubli ÉTAPE 2 (data layer).
**Solution :** Toujours ajouter dans le système de stockage des articles.

### Erreur 2 : Référencement Lent
**Problème :** Google met 3 mois à indexer la page.
**Cause :** Oubli ÉTAPE 4 (sitemap).
**Solution :** Toujours déclarer dans sitemap.ts.

### Erreur 3 : Design Incohérent
**Problème :** Chaque article a un style différent.
**Cause :** Réinvention de la structure au lieu de copier l'existant.
**Solution :** Analyser les articles actuels et copier à l'identique.

### Erreur 4 : Image Hardcodée
**Problème :** Chemin d'image écrit en dur (`/images/journal/mon-image.webp`).
**Cause :** Oubli du système `getCategoryImage()`.
**Solution :** Toujours utiliser `getCategoryImage(category)`.

### Erreur 5 : Catégorie Mal Orthographiée
**Problème :** Image ne s'affiche pas ou mauvaise image.
**Cause :** Catégorie écrite "Strategie" au lieu de "STRATÉGIE".
**Solution :** Respecter l'orthographe exacte (avec accents en FR).

---

## 💡 AJOUTER UNE NOUVELLE CATÉGORIE (Futur)

Si un jour tu veux ajouter une 4e catégorie (ex: "AUTORITÉ") :

1. **Ajoute l'image :**
   - Crée `public/images/journal/autorite-img.webp`
   - Format : WebP
   - Taille : < 500KB

2. **Mets à jour `getCategoryImage()` :**
   ```typescript
   if (categoryLower.includes('autorité') || categoryLower.includes('authority')) {
     return '/images/journal/autorite-img.webp';
   }
   ```

3. **Utilise la nouvelle catégorie :**
   - Dans les traductions : `"category": "AUTORITÉ"` (FR) et `"category": "AUTHORITY"` (EN)
   - L'image s'affichera automatiquement

---

## 🎯 WORKFLOW COMPLET

1. **Je décide du sujet + catégorie** (IDENTITÉ, STRATÉGIE ou INFLUENCE)
2. **Je copie ce template** et remplis les crochets
3. **Je l'envoie à l'IA** (Antigravity)
4. **L'IA exécute les 4 étapes** en analysant l'existant
5. **Vérifie l'image** selon catégorie
6. **Teste localement** (checklist)
7. **Commit & Deploy**

**Temps estimé : 15-20 minutes par article.**
