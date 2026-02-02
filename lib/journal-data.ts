import { ReactNode } from 'react';

export interface Article {
  slug: string;
  title: string;
  description: string;
  tag: 'STRATÉGIE' | 'INFLUENCE' | 'IDENTITÉ' | 'STRATEGY' | 'IDENTITY'; // Augmented for EN
  publishDate: string;
  readTime: string;
  aeoSnippet: string;
  ctaBenefit: string;
  content: string;
  coverImage: string;
}

// Helper function to get category image automatically
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

  // Default image if category not recognized
  return '/images/journal/strategie-img-2.webp';
}

const articlesFr: Article[] = [
  {
    slug: 'cabinet-comme-media',
    title: "De la brochure passive au hub d'influence : le cabinet comme média.",
    description: "Votre site web est-il une archive morte ou un actif vivant ? Le modèle du site brochure est obsolète. Pour capter l'attention des décideurs en 2025, un cabinet d'affaires doit opérer sa mutation en média propriétaire.",
    tag: 'STRATÉGIE',
    publishDate: '2025-09-11',
    readTime: '4 min',
    coverImage: getCategoryImage('STRATÉGIE'),
    aeoSnippet: "Le modèle du site <strong>\"brochure\"</strong> est obsolète. Pour capter l'attention des décideurs en 2025, un cabinet d'affaires doit opérer sa mutation en <strong>média propriétaire</strong>. Il ne s'agit plus seulement d'afficher une expertise, mais de la <strong>diffuser en continu</strong> via une plateforme de contenu (insights, podcasts, analyses) qui <strong>nourrit votre autorité</strong> et crée le réflexe de consultation.",
    ctaBenefit: "transformer votre site en média d'autorité",
    content: `
      <div class="text-center">
        <p class="font-serif italic text-xl md:text-2xl text-ink/60 mb-12">Votre site web est-il une archive morte ou un actif vivant ?</p>
      </div>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">I. L'invisibilité par l'ennui</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        La majorité des cabinets d'affaires possèdent des sites techniquement corrects mais éditorialement vides. Ils sont statiques. Dans une économie de l'attention saturée, ne pas publier revient à disparaître. Vos clients, directeurs juridiques ou fonds d'investissement, consomment de l'information stratégique à haute fréquence.
      </p>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">II. La demande de signal</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        L'excellence juridique ne se prouve plus par un CV, mais par la pertinence de l'analyse immédiate. Un changement réglementaire ou une nouvelle jurisprudence doit être décrypté par vos soins.
      </p>
      <ul class="list-disc pl-5 space-y-2 mb-6 text-ink/80">
        <li>Le client ne cherche pas un avocat, il cherche une vision.</li>
        <li>Les moteurs de recherche privilégient les plateformes qui produisent de la donnée fraîche.</li>
        <li>La statique est un risque ; la dynamique est une preuve de maîtrise.</li>
      </ul>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">III. La plateforme média</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Nous transformons votre site pour qu'il supporte cette cadence éditoriale. Orsayn ne livre pas un site figé, mais une plateforme de publication fluide.
      </p>
      <p class="mb-6 leading-relaxed text-ink/80">
        Nous intégrons nativement vos flux de podcasts et vos articles de doctrine. Nous structurons techniquement ces contenus pour une indexation immédiate. Votre site devient le QG de votre pensée, centralisant votre production intellectuelle au sein d'un écosystème cohérent.
      </p>

      <div class="mt-16 pt-8 border-t border-ink/10">
        <p class="font-serif italic text-xl text-ink text-center">
          Cessez de subir l'actualité, commencez à l'éclairer.<br /><br />
          Transformez votre vitrine en média d'autorité.
        </p>
      </div>
    `
  },
  {
    slug: 'marque-personnelle-vs-institution',
    title: "Marque personnelle et institution : l'alignement des forces.",
    description: "L'influence d'un associé est-elle une menace ou un levier pour le cabinet ? Opposer la marque du cabinet au branding personnel des associés est une erreur. L'associé est le visage, le cabinet est le corps.",
    tag: 'INFLUENCE',
    publishDate: '2025-10-15',
    readTime: '5 min',
    coverImage: getCategoryImage('INFLUENCE'),
    aeoSnippet: "Opposer la marque du cabinet (<strong>corporate</strong>) au branding personnel des associés est une erreur. <strong>L'associé est le visage, le cabinet est le corps</strong>. L'enjeu est de créer une <strong>synergie</strong> où la visibilité individuelle sur les réseaux (LinkedIn) est redirigée vers une <strong>plateforme centrale</strong> qui capitalise cette audience. C'est <strong>l'alignement des intérêts</strong> par la technologie.",
    ctaBenefit: "aligner l'influence de vos associés avec celle du cabinet",
    content: `
      <div class="text-center">
        <p class="font-serif italic text-xl md:text-2xl text-ink/60 mb-12">L'influence d'un associé est-elle une menace ou un levier pour le cabinet ?</p>
      </div>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">I. La peur de la cannibalisation</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Beaucoup de cabinets brident les initiatives individuelles, craignant que l'individu ne dépasse l'institution. Résultat : une communication désincarnée qui n'engage personne. Or, dans le droit des affaires, la confiance se tisse d'humain à humain avant de devenir institutionnelle.
      </p>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">II. Le hub et les satellites</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        L'influence moderne fonctionne en écosystème. LinkedIn est un canal d'acquisition (un satellite) puissant mais volatile. Le site du cabinet est l'ancrage (le Hub), le seul actif pérenne.
      </p>
      <ul class="list-disc pl-5 space-y-2 mb-6 text-ink/80">
        <li>L'associé engage la conversation sur les réseaux.</li>
        <li>Il redirige son audience vers la plateforme pour la validation technique.</li>
        <li>Sans ce réceptacle central, l'effort de l'associé ne construit pas la valeur du cabinet.</li>
      </ul>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">III. La convergence</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Nous concevons des écosystèmes qui valorisent l'expert au service du collectif. Chaque associé dispose d'espaces dédiés sur la plateforme, optimisés pour le référencement, qui agrègent ses publications et ses succès.
      </p>
      <p class="mb-6 leading-relaxed text-ink/80">
        Techniquement, nous lions l'autorité de l'auteur à l'autorité du domaine. Plus vos associés rayonnent, plus la puissance digitale de votre cabinet augmente. Nous transformons les individualités en piliers de votre forteresse.
      </p>

      <div class="mt-16 pt-8 border-t border-ink/10">
        <p class="font-serif italic text-xl text-ink text-center">
          Ne bridez pas vos talents, outillez-les.<br /><br />
          Faites converger les influences individuelles vers votre actif souverain.
        </p>
      </div>
    `
  },
  {
    slug: 'marque-transfrontaliere',
    title: "Une marque, un code : la stratégie de l'unité souveraine.",
    description: "Votre bureau de Genève bénéficie-t-il de la réputation de votre bureau de New York ? La gestion de multiples sites locaux est une perte de puissance.",
    tag: 'STRATÉGIE',
    publishDate: '2025-11-12',
    readTime: '4 min',
    coverImage: getCategoryImage('STRATÉGIE'),
    aeoSnippet: "La gestion de <strong>multiples sites locaux</strong> est une perte de puissance. Elle dilue le référencement et fragmente l'image de marque. La stratégie gagnante est celle de <strong>l'écosystème unifié souverain</strong> : une <strong>plateforme unique</strong> qui centralise l'autorité mondiale tout en adaptant culturellement le contenu pour chaque juridiction.",
    ctaBenefit: "unifier votre marque à l'échelle mondiale",
    content: `
      <div class="text-center">
        <p class="font-serif italic text-xl md:text-2xl text-ink/60 mb-12">Votre bureau de Genève bénéficie-t-il de la réputation de votre bureau de New York ?</p>
      </div>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">I. Le coût de la fragmentation</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Au fil de la croissance, les cabinets accumulent des sites disparates. On se retrouve avec un patchwork technologique. Pour un client global, ce manque d'unité est un signal de désorganisation. Une marque forte ne peut pas avoir plusieurs visages digitaux contradictoires.
      </p>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">II. La force de la centralisation</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Les leaders du conseil ne fragmentent pas leur autorité. Ils opèrent sur une plateforme racine forte.
      </p>
      <ul class="list-disc pl-5 space-y-2 mb-6 text-ink/80">
        <li>Centraliser permet de cumuler toute l'autorité sur un seul domaine.</li>
        <li>Cela réduit les risques de sécurité et les coûts de maintenance.</li>
        <li>L'excellence d'un bureau rejaillit mécaniquement sur l'ensemble du réseau.</li>
      </ul>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">III. One global brand</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Orsayn déploie des plateformes globales conçues pour la complexité internationale. Nous créons une plateforme unique capable de gérer les spécificités locales (équipes, news, conformité) sans briser l'unité.
      </p>
      <p class="mb-6 leading-relaxed text-ink/80">
        Nous assurons une souveraineté des données stricte, conforme aux exigences européennes et suisses. Votre marque devient un monolithe de cohérence et de performance.
      </p>

      <div class="mt-16 pt-8 border-t border-ink/10">
        <p class="font-serif italic text-xl text-ink text-center">
          L'unité fait l'autorité.<br /><br />
          Cessez de gérer un archipel, pilotez une plateforme mondiale.
        </p>
      </div>
    `
  },
  {
    slug: 'guerre-des-talents',
    title: "La plateforme digitale comme levier d'attractivité.",
    description: "Pourquoi les meilleurs juniors choisissent-ils vos concurrents ? La \"guerre des talents\" ne se joue plus seulement sur la rémunération, mais sur la projection.",
    tag: 'INFLUENCE',
    publishDate: '2025-12-08',
    readTime: '4 min',
    coverImage: getCategoryImage('INFLUENCE'),
    aeoSnippet: "La \"guerre des talents\" ne se joue plus seulement sur la rémunération, mais sur la <strong>projection</strong>. La nouvelle génération juge la modernité d'un cabinet à son <strong>interface digitale</strong>. Un site obsolète est perçu comme une promesse de lourdeur administrative. Votre <strong>plateforme digitale</strong> est devenue le <strong>pilier central</strong> de votre marque employeur.",
    ctaBenefit: "attirer les meilleurs talents par votre excellence digitale",
    content: `
      <div class="text-center">
        <p class="font-serif italic text-xl md:text-2xl text-ink/60 mb-12">Pourquoi les meilleurs juniors choisissent-ils vos concurrents ?</p>
      </div>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">I. Le décalage générationnel</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Les associés seniors sous-estiment parfois l'importance du digital pour les juniors. Pourtant, avant de postuler, un candidat audit votre site. S'il voit une page carrière datée et non responsive, il perçoit un cabinet figé dans le passé.
      </p>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">II. Le digital comme miroir du management</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        L'expérience utilisateur (UX) de votre plateforme est le reflet de votre culture interne.
      </p>
      <ul class="list-disc pl-5 space-y-2 mb-6 text-ink/80">
        <li>Une plateforme fluide signale une organisation agile.</li>
        <li>Une interface datée signale des processus rigides.</li>
      </ul>
      <p class="mb-6 leading-relaxed text-ink/80">
        Pour recruter l'élite, il faut lui offrir les standards technologiques qu'elle maîtrise.
      </p>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">III. L'écosystème carrière</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Nous ne créons pas de simples pages d'offres. Nous concevons des espaces carrières immersifs au sein de votre plateforme.
      </p>
      <p class="mb-6 leading-relaxed text-ink/80">
        Design soigné, parcours fluide, contenu riche : nous utilisons les codes du luxe pour valoriser votre culture d'entreprise. Notre écosystème envoie un message clair aux talents : "Ici, l'excellence est partout." Vous attirez ainsi des profils qui cherchent à s'associer à une marque forte.
      </p>

      <div class="mt-16 pt-8 border-t border-ink/10">
        <p class="font-serif italic text-xl text-ink text-center">
          Attirez les meilleurs en leur offrant l'écrin que mérite leur potentiel.<br /><br />
          Faites de votre digital votre meilleur atout recrutement.
        </p>
      </div>
    `
  },
  {
    slug: 'influence-deal-flow',
    title: "De la visibilité sociale à l'origination : la mécanique du retour sur investissement.",
    description: "L'engagement sur vos réseaux se transforme-t-il en mandats signés ? La visibilité est une première étape, mais elle ne suffit pas.",
    tag: 'STRATÉGIE',
    publishDate: '2026-01-05',
    readTime: '5 min',
    coverImage: getCategoryImage('STRATÉGIE'),
    aeoSnippet: "La <strong>visibilité</strong> est une première étape, mais elle ne suffit pas. Le véritable enjeu est <strong>l'origination</strong> : transformer une audience en opportunités d'affaires. Cela nécessite un écosystème où le réseau social sert de point de contact et la <strong>plateforme digitale</strong> de lieu de conversion. Le passage de l'intérêt à la confiance se fait par la <strong>démonstration d'autorité</strong>.",
    ctaBenefit: "convertir votre visibilité sociale en mandats",
    content: `
      <div class="text-center">
        <p class="font-serif italic text-xl md:text-2xl text-ink/60 mb-12">L'engagement sur vos réseaux se transforme-t-il en mandats signés ?</p>
      </div>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">I. L'impasse de la vanité</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Il est aisé d'obtenir des vues sur les réseaux. Il est complexe de signer un dossier M&A grâce à un post. Beaucoup d'avocats s'investissent dans la création de contenu sans voir de retour tangible, car il manque la structure de conversion.
      </p>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">II. Le parcours de conviction</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Un décideur ne confie pas un dossier critique sur une simple impression.
      </p>
      <ul class="list-disc pl-5 space-y-2 mb-6 text-ink/80">
        <li><strong>Découverte :</strong> Il repère votre pertinence sur LinkedIn.</li>
        <li><strong>Validation :</strong> Il explore votre plateforme pour vérifier la profondeur de l'expertise.</li>
        <li><strong>Action :</strong> Il prend contact car votre écosystème l'a rassuré sur votre capacité à délivrer.</li>
      </ul>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">III. La connexion hub & satellites</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Orsayn connecte ces deux mondes. Nous structurons votre plateforme pour qu'elle accueille le trafic social avec des contenus à haute valeur ajoutée (doctrine, études de cas).
      </p>
      <p class="mb-6 leading-relaxed text-ink/80">
        Nous transformons l'intérêt éphémère du réseau social en conviction durable sur votre site propriétaire. Nous bâtissons le pont technologique qui permet de qualifier l'intérêt et d'identifier les vraies opportunités business.
      </p>

      <div class="mt-16 pt-8 border-t border-ink/10">
        <p class="font-serif italic text-xl text-ink text-center">
          Ne cherchez pas l'audience pour l'audience.<br /><br />
          Convertissez votre influence en actif stratégique.
        </p>
      </div>
    `
  },
  {
    slug: 'luxe-du-silence',
    title: "L'art de la rareté : le leadership de pensée comme seul marketing.",
    description: "Comment exister avec force quand la discrétion est votre obligation absolue ? Pour les pratiques confidentielles, le marketing de masse est inadapté.",
    tag: 'IDENTITÉ',
    publishDate: '2026-01-20',
    readTime: '4 min',
    coverImage: getCategoryImage('IDENTITÉ'),
    aeoSnippet: "Pour les pratiques confidentielles (arbitrage, private Client, défense pénale), le <strong>marketing de masse est inadapté</strong>. La réponse réside dans le <strong>leadership de pensée</strong>. Plutôt que d'occuper l'espace publicitaire, on construit une <strong>autorité intellectuelle</strong> sur votre plateforme. On privilégie la <strong>qualité extrême</strong> du contenu (doctrine) à la quantité, pour n'être visible que par les <strong>initiés</strong> qui cherchent une expertise précise.",
    ctaBenefit: "bâtir une autorité discrète et souveraine",
    content: `
      <div class="text-center">
        <p class="font-serif italic text-xl md:text-2xl text-ink/60 mb-12">Comment exister avec force quand la discrétion est votre obligation absolue ?</p>
      </div>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">I. L'exigence de retenue</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Un cabinet traitant des intérêts souverains ou des grandes fortunes ne peut pas céder à la vulgarité du "bruit". La sur-exposition est perçue comme un manque de sérénité. Pourtant, l'invisibilité totale est un risque commercial. Il faut trouver le point d'équilibre : être introuvable pour la foule, mais incontournable pour la cible.
      </p>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">II. La densité plutôt que le volume</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Le client, le partenaire cherche une source de vérité. Il ne tape pas des mots-clés génériques, il pose des questions techniques complexes.
      </p>
      <p class="mb-6 leading-relaxed text-ink/80">
        Si votre plateforme offre la réponse la plus structurée et la plus pertinente, vous gagnez la confiance sans avoir à vendre. C'est la victoire du fond sur la forme. La rareté de la parole en augmente la valeur.
      </p>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">III. L'autorité sémantique</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Nous développons pour ces niches des plateformes sobres, où le design s'efface devant le contenu doctrinal. Nous optimisons votre écosystème pour qu'il soit la référence absolue sur vos sujets de prédilection.
      </p>
      <p class="mb-6 leading-relaxed text-ink/80">
        Nous structurons votre savoir pour qu'il soit capté par les moteurs de recherche sur des requêtes de haute précision. C'est une visibilité choisie, aristocratique, qui préserve votre aura tout en assurant que votre expertise soit reconnue par ceux qui comptent vraiment.
      </p>

      <div class="mt-16 pt-8 border-t border-ink/10">
        <p class="font-serif italic text-xl text-ink text-center">
          Le véritable pouvoir n'a pas besoin de crier pour être entendu.<br /><br />
          Cultivez une autorité silencieuse et laissez l'excellence parler.
        </p>
      </div>
    `
  }
];

// --- ENGLISH TRANSLATIONS ---
const articlesEn: Article[] = [
  {
    slug: 'cabinet-comme-media',
    title: "From Passive Brochure to Influence Hub: The Firm as Media.",
    description: "Is your website a dead archive or a living asset? The brochure site model is obsolete. To capture decision-makers' attention in 2025, a business law firm must mutate into a proprietary media.",
    tag: 'STRATEGY',
    publishDate: '2025-09-11',
    readTime: '4 min',
    coverImage: getCategoryImage('STRATEGY'),
    aeoSnippet: "The <strong>\"brochure\"</strong> site model is obsolete. To capture decision-makers' attention in 2025, a business law firm must mutate into a <strong>proprietary media</strong>. It is no longer just about displaying expertise, but <strong>broadcasting it continuously</strong> via a content platform (insights, podcasts, analysis) which <strong>feeds your authority</strong> and creates a reflex of consultation.",
    ctaBenefit: "transform your site into an authority media",
    content: `
      <div class="text-center">
        <p class="font-serif italic text-xl md:text-2xl text-ink/60 mb-12">Is your website a dead archive or a living asset?</p>
      </div>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">I. Invisibility through Boredom</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        The majority of business law firms possess sites that are technically correct but editorially empty. They are static. In a saturated attention economy, not publishing equals disappearing. Your clients, general counsels, or investment funds consume strategic information at high frequency.
      </p>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">II. The Demand for Signal</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Legal excellence is no longer proven by a CV, but by the relevance of immediate analysis. A regulatory change or new jurisprudence must be decrypted by you.
      </p>
      <ul class="list-disc pl-5 space-y-2 mb-6 text-ink/80">
        <li>The client is not looking for a lawyer, they are looking for a vision.</li>
        <li>Search engines favor platforms that produce fresh data.</li>
        <li>Static is a risk; dynamic is proof of mastery.</li>
      </ul>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">III. The Media Platform</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        We transform your site so it supports this editorial cadence. Orsayn delivers not a frozen site, but a fluid publication platform.
      </p>
      <p class="mb-6 leading-relaxed text-ink/80">
        We natively integrate your podcast feeds and doctrine articles. We structure these contents technically for immediate indexing. Your site becomes the HQ of your thought, centralizing your intellectual production within a coherent ecosystem.
      </p>

      <div class="mt-16 pt-8 border-t border-ink/10">
        <p class="font-serif italic text-xl text-ink text-center">
          Stop enduring the news, start illuminating it.<br /><br />
          Transform your showcase into an authority media.
        </p>
      </div>
    `
  },
  {
    slug: 'marque-personnelle-vs-institution',
    title: "Personal Brand and Institution: Alignment of Forces.",
    description: "Is a partner's influence a threat or a lever for the firm? Opposing the firm's brand to partners' personal branding is a mistake. The partner is the face, the firm is the body.",
    tag: 'INFLUENCE',
    publishDate: '2025-10-15',
    readTime: '5 min',
    coverImage: getCategoryImage('INFLUENCE'),
    aeoSnippet: "Opposing the firm's brand (<strong>corporate</strong>) to partners' personal branding is a mistake. <strong>The partner is the face, the firm is the body</strong>. The challenge is to create a <strong>synergy</strong> where individual visibility on networks (LinkedIn) is redirected towards a <strong>central platform</strong> that capitalizes on this audience. It is <strong>alignment of interests</strong> through technology.",
    ctaBenefit: "align your partners' influence with the firm's",
    content: `
      <div class="text-center">
        <p class="font-serif italic text-xl md:text-2xl text-ink/60 mb-12">Is a partner's influence a threat or a lever for the firm?</p>
      </div>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">I. The Fear of Cannibalization</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Many firms curb individual initiatives, fearing the individual might outshine the institution. Result: disembodied communication that engages no one. Yet, in business law, trust is woven human to human before becoming institutional.
      </p>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">II. The Hub and the Satellites</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Modern influence works as an ecosystem. LinkedIn is a powerful but volatile acquisition channel (a satellite). The firm's site is the anchor (the Hub), the only perennial asset.
      </p>
      <ul class="list-disc pl-5 space-y-2 mb-6 text-ink/80">
        <li>The partner engages the conversation on networks.</li>
        <li>They redirect their audience to the platform for technical validation.</li>
        <li>Without this central receptacle, the partner's effort does not build the firm's value.</li>
      </ul>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">III. Convergence</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        We design ecosystems that valorize the expert in service of the collective. Each partner has dedicated spaces on the platform, optimized for SEO, which aggregate their publications and successes.
      </p>
      <p class="mb-6 leading-relaxed text-ink/80">
        Technically, we link the author's authority to the domain's authority. The more your partners shine, the more your firm's digital power increases. We transform individualities into pillars of your fortress.
      </p>

      <div class="mt-16 pt-8 border-t border-ink/10">
        <p class="font-serif italic text-xl text-ink text-center">
          Do not curb your talents, equip them.<br /><br />
          Converge individual influences towards your sovereign asset.
        </p>
      </div>
    `
  },
  {
    slug: 'marque-transfrontaliere',
    title: "One Brand, One Code: The Sovereign Unity Strategy.",
    description: "Does your Geneva office benefit from your New York office's reputation? Managing multiple local sites is a loss of power.",
    tag: 'STRATEGY',
    publishDate: '2025-11-12',
    readTime: '4 min',
    coverImage: getCategoryImage('STRATEGY'),
    aeoSnippet: "Managing <strong>multiple local sites</strong> is a loss of power. It dilutes SEO and fragments brand image. The winning strategy is that of the <strong>sovereign unified ecosystem</strong>: a <strong>single platform</strong> that centralizes global authority while culturally adapting content for each jurisdiction.",
    ctaBenefit: "unify your brand on a global scale",
    content: `
      <div class="text-center">
        <p class="font-serif italic text-xl md:text-2xl text-ink/60 mb-12">Does your Geneva office benefit from your New York office's reputation?</p>
      </div>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">I. The Cost of Fragmentation</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        As they grow, firms accumulate disparate sites. We end up with a technological patchwork. For a global client, this lack of unity is a signal of disorganization. A strong brand cannot have several contradictory digital faces.
      </p>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">II. The Power of Centralization</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Consulting leaders do not fragment their authority. They operate on a strong root platform.
      </p>
      <ul class="list-disc pl-5 space-y-2 mb-6 text-ink/80">
        <li>Centralizing allows accumulating all authority on a single domain.</li>
        <li>This reduces security risks and maintenance costs.</li>
        <li>The excellence of one office mechanically reflects on the entire network.</li>
      </ul>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">III. One Global Brand</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Orsayn deploys global platforms designed for international complexity. We create a unique platform capable of managing local specificities (teams, news, compliance) without breaking unity.
      </p>
      <p class="mb-6 leading-relaxed text-ink/80">
        We ensure strict data sovereignty, compliant with European and Swiss requirements. Your brand becomes a monolith of coherence and performance.
      </p>

      <div class="mt-16 pt-8 border-t border-ink/10">
        <p class="font-serif italic text-xl text-ink text-center">
          Unity makes authority.<br /><br />
          Stop managing an archipelago, pilot a global platform.
        </p>
      </div>
    `
  },
  {
    slug: 'guerre-des-talents',
    title: "The Digital Platform as an Attraction Lever.",
    description: "Why do the best juniors choose your competitors? The \"war for talent\" is no longer played solely on remuneration, but on projection.",
    tag: 'INFLUENCE',
    publishDate: '2025-12-08',
    readTime: '4 min',
    coverImage: getCategoryImage('INFLUENCE'),
    aeoSnippet: "The \"war for talent\" is no longer played solely on remuneration, but on <strong>projection</strong>. The new generation judges a firm's modernity by its <strong>digital interface</strong>. An outdated site is perceived as a promise of administrative heaviness. Your <strong>digital infrastructure</strong> has become the <strong>central pillar</strong> of your employer brand.",
    ctaBenefit: "attract the best talent with your digital excellence",
    content: `
      <div class="text-center">
        <p class="font-serif italic text-xl md:text-2xl text-ink/60 mb-12">Why do the best juniors choose your competitors?</p>
      </div>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">I. The Generational Gap</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Senior partners sometimes underestimate the importance of digital for juniors. Yet, before applying, a candidate audits your site. If they see a dated, non-responsive career page, they perceive a firm frozen in the past.
      </p>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">II. Digital as a Mirror of Management</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Your platform's user experience (UX) is the reflection of your internal culture.
      </p>
      <ul class="list-disc pl-5 space-y-2 mb-6 text-ink/80">
        <li>A fluid platform signals an agile organization.</li>
        <li>A dated interface signals rigid processes.</li>
      </ul>
      <p class="mb-6 leading-relaxed text-ink/80">
        To recruit the elite, you must offer them the technological standards they master.
      </p>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">III. The Career Ecosystem</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        We do not create simple job offer pages. We design immersive career spaces within your platform.
      </p>
      <p class="mb-6 leading-relaxed text-ink/80">
        Polished design, fluid journey, rich content: we use luxury codes to valorize your corporate culture. Our ecosystem sends a clear message to talents: "Here, excellence is everywhere." You thus attract profiles seeking to associate with a strong brand.
      </p>

      <div class="mt-16 pt-8 border-t border-ink/10">
        <p class="font-serif italic text-xl text-ink text-center">
          Attract the best by offering them the setting their potential deserves.<br /><br />
          Make your digital your best recruitment asset.
        </p>
      </div>
    `
  },
  {
    slug: 'influence-deal-flow',
    title: "From Social Visibility to Origination: The ROI Mechanics.",
    description: "Does engagement on your networks transform into signed mandates? Visibility is a first step, but it is not enough.",
    tag: 'STRATEGY',
    publishDate: '2026-01-05',
    readTime: '5 min',
    coverImage: getCategoryImage('STRATEGY'),
    aeoSnippet: "<strong>Visibility</strong> is a first step, but it is not enough. The real challenge is <strong>origination</strong>: transforming an audience into business opportunities. This requires an ecosystem where the social network serves as a contact point and the <strong>digital platform</strong> as a conversion place. The passage from interest to trust happens through the <strong>demonstration of authority</strong>.",
    ctaBenefit: "convert your social visibility into mandates",
    content: `
      <div class="text-center">
        <p class="font-serif italic text-xl md:text-2xl text-ink/60 mb-12">Does engagement on your networks transform into signed mandates?</p>
      </div>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">I. The Vanity Dead End</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        It is easy to get views on networks. It is complex to sign an M&A deal thanks to a post. Many lawyers invest in content creation without seeing tangible returns because the conversion structure is missing.
      </p>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">II. The Conviction Journey</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        A decision-maker does not entrust a critical case on a simple impression.
      </p>
      <ul class="list-disc pl-5 space-y-2 mb-6 text-ink/80">
        <li><strong>Discovery:</strong> They spot your relevance on LinkedIn.</li>
        <li><strong>Validation:</strong> They explore your platform to verify the depth of expertise.</li>
        <li><strong>Action:</strong> They make contact because your ecosystem reassured them of your capacity to deliver.</li>
      </ul>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">III. The Hub & Satellites Connection</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        Orsayn connects these two worlds. We structure your platform to welcome social traffic with high value-added content (doctrine, case studies).
      </p>
      <p class="mb-6 leading-relaxed text-ink/80">
        We transform the ephemeral interest of the social network into durable conviction on your proprietary site. We build the technological bridge that qualifies interest and identifies real business opportunities.
      </p>

      <div class="mt-16 pt-8 border-t border-ink/10">
        <p class="font-serif italic text-xl text-ink text-center">
          Do not seek audience for audience's sake.<br /><br />
          Convert your influence into a strategic asset.
        </p>
      </div>
    `
  },
  {
    slug: 'luxe-du-silence',
    title: "The Art of Scarcity: Thought Leadership as the Only Marketing.",
    description: "How to exist with strength when discretion is your absolute obligation? For confidential practices, mass marketing is unsuitable.",
    tag: 'IDENTITY',
    publishDate: '2026-01-20',
    readTime: '4 min',
    coverImage: getCategoryImage('IDENTITY'),
    aeoSnippet: "For confidential practices (arbitration, Private Client, criminal defense), <strong>mass marketing is unsuitable</strong>. The answer lies in <strong>thought leadership</strong>. Rather than occupying advertising space, we build <strong>intellectual authority</strong> on your platform. We prioritize <strong>extreme quality</strong> of content (doctrine) over quantity, to be visible only to <strong>insiders</strong> seeking precise expertise.",
    ctaBenefit: "build a discreet and sovereign authority",
    content: `
      <div class="text-center">
        <p class="font-serif italic text-xl md:text-2xl text-ink/60 mb-12">How to exist with strength when discretion is your absolute obligation?</p>
      </div>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">I. The Requirement of Restraint</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        A firm dealing with sovereign interests or high net worth individuals cannot yield to the vulgarity of "noise". Over-exposure is perceived as a lack of serenity. Yet, total invisibility is a commercial risk. One must find the balance point: be untraceable for the crowd, but unavoidable for the target.
      </p>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">II. Density Rather Than Volume</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        The client, the partner looks for a source of truth. They do not type generic keywords, they ask complex technical questions.
      </p>
      <p class="mb-6 leading-relaxed text-ink/80">
        If your platform offers the most structured and relevant answer, you gain trust without having to sell. It is the victory of substance over form. The scarcity of speech increases its value.
      </p>

      <h2 class="font-serif text-3xl text-ink mb-6 mt-16 uppercase tracking-wide">III. Semantic Authority</h2>
      <p class="mb-6 leading-relaxed text-ink/80">
        We develop sober platforms for these niches, where design fades behind doctrinal content. We optimize your ecosystem so it is the absolute reference on your subjects of predilection.
      </p>
      <p class="mb-6 leading-relaxed text-ink/80">
        We structure your knowledge so it is captured by search engines on high-precision queries. It is a chosen, aristocratic visibility, which preserves your aura while ensuring your expertise is recognized by those who truly count.
      </p>

      <div class="mt-16 pt-8 border-t border-ink/10">
        <p class="font-serif italic text-xl text-ink text-center">
          True power does not need to shout to be heard.<br /><br />
          Cultivate a silent authority and let excellence speak.
        </p>
      </div>
    `
  }
];

// Re-export old 'articles' as default (FR) for backward compatibility if needed, 
// but we prefer using getArticles(locale)
export const articles = articlesFr;

export const getArticles = (locale: string) => {
  return locale === 'en' ? articlesEn : articlesFr;
};

