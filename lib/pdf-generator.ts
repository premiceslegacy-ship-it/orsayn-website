import puppeteer from 'puppeteer';
import { selectForces, isProfilExcellence, AuditForceData } from './forces-selector';
import { selectFailles, AuditFailleData } from './failles-selector';
import fs from 'fs/promises';
import path from 'path';

interface AuditData extends AuditForceData, AuditFailleData {
  Score_Global: number;
  Screenshot_Base64: string;
  Lien_Calendly?: string;
  lang?: 'fr' | 'en';
}

/**
 * Reads a font file and returns a base64 data URI string
 */
async function fontToBase64(fontPath: string): Promise<string> {
  const buffer = await fs.readFile(fontPath);
  const base64 = buffer.toString('base64');
  return `data:font/woff2;base64,${base64}`;
}

/**
 * Reads an image file and returns a base64 data URI string
 */
async function imageToBase64(imagePath: string, mimeType: string): Promise<string> {
  const buffer = await fs.readFile(imagePath);
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

export async function generateAuditPDF(data: AuditData): Promise<Buffer> {
  const fontsDir = path.join(process.cwd(), 'public', 'fonts');
  const imagesDir = path.join(process.cwd(), 'public', 'images');

  // 1. Embed fonts as base64
  const boska500 = await fontToBase64(path.join(fontsDir, 'Boska-500.woff2'));
  const generalSans400 = await fontToBase64(path.join(fontsDir, 'GeneralSans-400.woff2'));
  const generalSans500 = await fontToBase64(path.join(fontsDir, 'GeneralSans-500.woff2'));
  const generalSans600 = await fontToBase64(path.join(fontsDir, 'GeneralSans-600.woff2'));

  // 2. Embed page 5 hero image as base64
  const heroImagePath = path.join(imagesDir, 'orsayn-hero-audit.png');
  const heroImageBase64 = await imageToBase64(heroImagePath, 'image/png');

  const lang = data.lang || 'fr';
  const isEn = lang === 'en';

  // 4. Select forces and failles with language + profile type
  const forces = selectForces(data, lang);
  const forcesHTML = forces
    .map((force) => `<p style="margin-bottom: 16px;">${force}</p>`)
    .join('');

  // 5. Select failles (1-3 max, numbered)
  const failles = selectFailles(data, lang);
  const faillesHTML = failles
    .map(
      ({ num, text }) => `
    <div class="faille-item">
      <strong>${num}.</strong> ${text}
    </div>
  `
    )
    .join('');

  // 6. Formatted date
  const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const dateJour = new Date().toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', dateOptions);

  // 7. Profile type for template
  const excellence = isProfilExcellence(data);

  // 8. Page III: Enjeu commercial (language + profile-aware)
  const page4content1 = isEn
    ? `What your clients look for, even before reading a word, is the certainty they are making the right choice.<br /><br />Today, even the warmest referral ends with a visit to your website. That is where the validation of everything your reputation has promised them takes place.`
    : `Ce que vos clients recherchent, avant même de vous lire, c'est la certitude qu'ils font le bon choix.<br /><br />Aujourd'hui, même la recommandation la plus chaleureuse se termine par un passage sur votre site. C'est là que se joue la validation de tout ce que votre réputation leur a promis.`;

  const page4content2 = excellence
    ? (
      isEn
        ? `You have built something genuinely exceptional. The question is no longer whether your expertise is recognised: it is.<br /><br />What we address is the <strong>coherence</strong> between that recognition and what the world sees when it searches for you: the quality of the mandates it signals, the talent it attracts, the partners it convinces.`
        : `Vous avez construit quelque chose d'exceptionnel. La question n'est plus de savoir si votre expertise est reconnue : elle l'est.<br /><br />Ce que nous adressons, c'est la <strong>cohérence</strong> entre cette reconnaissance et ce que le monde perçoit lorsqu'il vous cherche : la qualité des mandats que cela attire, les talents que cela convainc, les partenaires que cela engage.`
    )
    : (
      isEn
        ? `You have built something solid. It would be a shame if your digital platform told a different story from the one your clients experience.<br /><br />The gap between your real expertise and your online perception does not call your value into question. But it can quietly redirect qualified opportunities towards peers who do not surpass you, but who are better aligned visually.`
        : `Vous avez construit quelque chose de solide. Ce serait dommage que votre plateforme digitale raconte une histoire différente de celle que vivent vos clients.<br /><br />L'écart entre votre expertise réelle et la perception en ligne ne remet pas en question votre valeur. Mais il peut, silencieusement, rediriger des opportunités qualifiées vers des confrères qui ne vous surpassent pas, mais qui sont mieux alignés visuellement.`
    );

  // 9. Page V: Alignement stratégique (language + profile-aware)
  const page6content1 = excellence
    ? (
      isEn
        ? `<span style="font-weight:400;">You have built an expertise that already commands genuine </span><span style="font-weight:500;">market authority.</span><br /><br /><span style="font-weight:400;">The work of substance is done. What remains is to align </span><span style="font-weight:500;">how the world perceives it.</span>`
        : `<span style="font-weight:400;">Vous avez construit une expertise qui commande déjà une </span><span style="font-weight:500;">autorité réelle sur votre marché.</span><br /><br /><span style="font-weight:400;">Le travail de fond est accompli. Ce qui reste, c'est aligner </span><span style="font-weight:500;">la façon dont le monde le perçoit.</span>`
    )
    : (
      isEn
        ? `<span style="font-weight:400;">You have built an expertise that deserves </span><span style="font-weight:500;">a presence to match.</span><br /><br /><span style="font-weight:400;">The foundational work is done. What remains to align is </span><span style="font-weight:500;">the image the outside world perceives of you.</span>`
        : `<span style="font-weight:400;">Vous avez bâti une expertise qui mérite </span><span style="font-weight:500;">une présence à sa hauteur.</span><br /><br /><span style="font-weight:400;">Le travail de fond, vous l'avez accompli. Ce qu'il reste à aligner, c'est </span><span style="font-weight:500;">l'image que le monde extérieur perçoit de vous.</span>`
    );

  const page6content2 = excellence
    ? (
      isEn
        ? `<span style="font-weight:400;">Aligning your platform with </span><span style="font-weight:500;">your actual level of excellence</span><span style="font-weight:400;"> is not an additional expense. It is </span><span style="font-weight:500;">the activation of what you have already built.</span><br /><br /><span style="font-weight:400;">The next step is a confidential 10-minute conversation to explore how to align your digital presence with the authority you have already earned.</span>`
        : `<span style="font-weight:400;">Aligner votre plateforme sur </span><span style="font-weight:500;">votre niveau d'excellence réel</span><span style="font-weight:400;"> n'est pas une dépense supplémentaire. C'est </span><span style="font-weight:500;">l'activation de ce que vous avez déjà bâti.</span><br /><br /><span style="font-weight:400;">La prochaine étape est un échange confidentiel de 10 minutes pour explorer ensemble comment aligner votre empreinte digitale à votre autorité réelle.</span>`
    )
    : (
      isEn
        ? `<span style="font-weight:400;">Aligning your platform with </span><span style="font-weight:500;">your real excellence</span><span style="font-weight:400;"> is not an additional expense. It is </span><span style="font-weight:500;">the valorisation of what you have already built.</span><br /><br /><span style="font-weight:400;">The next step is a confidential 10-minute conversation to explore together how to align your digital presence with your actual level.</span>`
        : `<span style="font-weight:400;">Aligner votre plateforme sur </span><span style="font-weight:500;">votre excellence réelle</span><span style="font-weight:400;"> n'est pas une dépense supplémentaire. C'est </span><span style="font-weight:500;">la valorisation de ce que vous avez déjà construit.</span><br /><br /><span style="font-weight:400;">La prochaine étape est un échange confidentiel de 10 minutes pour explorer ensemble comment aligner votre empreinte digitale à votre niveau réel.</span>`
    );

  const ctaText = isEn ? 'Request a live diagnostic' : 'Solliciter un diagnostic de vive voix';


  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const currentYear = currentDate.getFullYear();
  const calendlyLink =
    data.Lien_Calendly ||
    `https://calendly.com/orsaynsession/orsaynsession?back=1&month=${currentYear}-${currentMonth}`;

  const templatePathFile = path.join(process.cwd(), 'templates', 'audit-template.html');
  let htmlTemplate = await fs.readFile(templatePathFile, 'utf-8');

  htmlTemplate = htmlTemplate
    .replace(/\{\{Nom_Cabinet\}\}/g, data.Nom_Cabinet)
    .replace(/\{\{Date_Jour\}\}/g, dateJour)
    .replace(/\{\{Score_Global\}\}/g, String(data.Score_Global))
    .replace(/\{\{Forces_Section\}\}/g, forcesHTML)
    .replace(/\{\{Failles_Section\}\}/g, faillesHTML)
    .replace(/\{\{Screenshot_Base64\}\}/g, data.Screenshot_Base64)
    .replace(/\{\{Lien_Calendly\}\}/g, calendlyLink)
    .replace(/\{\{FONT_BOSKA_500\}\}/g, boska500)
    .replace(/\{\{FONT_GS_400\}\}/g, generalSans400)
    .replace(/\{\{FONT_GS_500\}\}/g, generalSans500)
    .replace(/\{\{FONT_GS_600\}\}/g, generalSans600)
    .replace(/\{\{Hero_Image_Base64\}\}/g, heroImageBase64)
    // ── PAGE 1: Cover ─────────────────────────────────────────────────────────
    .replace(/\{\{Page1_Title\}\}/g, isEn ? 'DIGITAL PLATFORM AUDIT' : 'AUDIT DE PLATEFORME DIGITALE')
    .replace(/\{\{Page1_Subtitle\}\}/g, isEn
      ? `Prepared exclusively for ${data.Nom_Cabinet}.`
      : `Préparé exclusivement pour le cabinet ${data.Nom_Cabinet}.`)
    .replace(/\{\{Page1_Date\}\}/g, isEn ? 'Date' : 'Date')
    .replace(/\{\{Page1_Confidential\}\}/g, isEn ? 'Strictly confidential document.' : 'Document strictement confidentiel.')
    // ── PAGE 2: Paradox ───────────────────────────────────────────────────────
    .replace(/\{\{Page2_Title\}\}/g, isEn ? 'I - THE PARADOX OF YOUR EXPERTISE' : 'I - LE PARADOXE DE VOTRE EXPERTISE')
    .replace(/\{\{Page2_Intro1\}\}/g, isEn ? 'handles complex matters.' : 'maîtrise des dossiers complexes.')
    .replace(/\{\{Page2_Intro2\}\}/g, isEn
      ? 'Yet a significant anomaly affects your public image: the gap between your real excellence and the way your online platform conveys it.'
      : "Pourtant, une anomalie majeure frappe votre image publique : l'écart entre votre excellence réelle et la perception qu'en donne votre plateforme en ligne.")
    .replace(/\{\{Page2_Forces_Title\}\}/g, isEn ? 'YOUR LEGAL REALITY' : 'VOTRE RÉALITÉ JURIDIQUE')
    .replace(/\{\{Page2_Forces_Subtitle\}\}/g, isEn
      ? 'You have built an undeniable authority on the ground.'
      : 'Vous avez bâti une autorité indéniable sur le terrain.')
    .replace(/\{\{Page2_Dissonance_Title\}\}/g, isEn ? 'THE DIGITAL DISSONANCE' : 'LA DISSONANCE DIGITALE')
    .replace(/\{\{Page2_Dissonance_Text\}\}/g, isEn
      ? 'Your current platform no longer reflects that level of standard.<br />In a sector where form is often the first guarantor of substance,<br />your digital presence silently devalues the quality of your work.'
      : "Votre plateforme actuelle ne reflète plus ce niveau d'exigence.<br />Dans un secteur où la forme est souvent le premier garant du fond,<br />votre vitrine numérique dévalue silencieusement la qualité de vos dossiers.")
    // ── PAGE 3: Footprint ─────────────────────────────────────────────────────
    .replace(/\{\{Page3_Title\}\}/g, isEn ? 'II - THE ANATOMY OF YOUR DIGITAL FOOTPRINT' : "II - L'ANATOMIE DE VOTRE EMPREINTE")
    .replace(/\{\{Page3_Score_Label\}\}/g, isEn
      ? 'What your future clients see before contacting you:'
      : 'Ce que voient vos futurs clients avant de vous contacter :')
    .replace(/\{\{Page3_Score_Text\}\}/g, isEn ? 'Algorithmic perception score' : 'Score de perception algorithmique')
    // ── PAGE 4: Commercial challenge ──────────────────────────────────────────
    .replace(/\{\{Page4_Title\}\}/g, isEn ? 'III - YOUR COMMERCIAL CHALLENGE' : 'III - VOTRE ENJEU COMMERCIAL')
    .replace(/\{\{Page4_Content1\}\}/g, page4content1)
    .replace(/\{\{Page4_Content2\}\}/g, page4content2)
    // ── PAGE 5: Orsayn Standard ───────────────────────────────────────────────
    .replace(/\{\{Page5_Title\}\}/g, isEn ? 'IV - THE ORSAYN STANDARD' : 'IV - LE STANDARD ORSAYN')
    .replace(/\{\{Page5_Intro\}\}/g, isEn
      ? 'We design sovereign digital environments for firms that refuse to let their image fall short of their expertise.'
      : "Nous concevons des environnements digitaux souverains pour les cabinets qui refusent que leur image soit inférieure à leur expertise.")
    .replace(/\{\{Page5_Block1_Title\}\}/g, isEn ? 'STATUTORY DESIGN' : 'LE DESIGN STATUTAIRE')
    .replace(/\{\{Page5_Block1_Text\}\}/g, isEn
      ? 'A clinical visual architecture.<br />Every element of visual noise removed to establish immediate authority.'
      : 'Une architecture visuelle clinique.<br />Suppression de tout bruit visuel pour installer une autorité immédiate.')
    .replace(/\{\{Page5_Block2_Title\}\}/g, isEn ? 'SURGICAL COPYWRITING' : 'LE COPYWRITING CHIRURGICAL')
    .replace(/\{\{Page5_Block2_Text\}\}/g, isEn
      ? 'A discourse stripped of jargon.<br />Your expertise translated into direct answers to your clients\' pain points.'
      : "Un discours débarrassé du jargon.<br />Vos expertises sont traduites en réponses directes aux douleurs de vos clients.")
    .replace(/\{\{Page5_Block3_Title\}\}/g, isEn ? 'ZERO FRICTION' : 'LA FRICTION ZÉRO')
    .replace(/\{\{Page5_Block3_Text\}\}/g, isEn
      ? 'User journeys designed for a smooth and reassuring transition,<br />from the first reading to the moment of contact.'
      : "Des parcours utilisateurs pensés pour une transition fluide et sécurisante,<br />de la première lecture jusqu'à la prise de contact.")
    // ── PAGE 6: Strategic alignment ───────────────────────────────────────────
    .replace(/\{\{Page6_Title\}\}/g, isEn ? 'V - STRATEGIC ALIGNMENT' : "V - L'ALIGNEMENT STRATÉGIQUE")
    .replace(/\{\{Page6_Content1\}\}/g, page6content1)
    .replace(/\{\{Page6_Content2\}\}/g, page6content2)
    .replace(/\{\{CTA_Text\}\}/g, ctaText)
    .replace(/\{\{Page6_Signature\}\}/g, isEn ? 'Founder, Orsayn.' : 'Fondateur, Orsayn.');


  // 9. Générer le PDF avec Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: false,
  });

  await browser.close();

  return Buffer.from(pdfBuffer);
}
