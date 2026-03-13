import { isProfilExcellence } from './forces-selector';
import type { AuditForceData } from './forces-selector';

export interface AuditFailleData {
    Nom_Cabinet: string;
    URL_Site: string;
    Specialite_1?: string;
    Specialite_2?: string;
    Est_Template: boolean;
    Nom_Template?: string;
    UI_Obsolete: boolean;
    UI_Commentaire?: string;
    Copywriting_Juridique: boolean;
    Pas_Mobile: boolean;
    Temps_Chargement?: number;
    Pas_SSL: boolean;
    // UX signals
    UX_Menu_Surcharge?: boolean;
    UX_Pas_H1?: boolean;
    UX_Contact_Difficile?: boolean;
    UX_Police_Defaut?: boolean;
    UX_Pas_Hierarchie?: boolean;
    UX_Photos_Generiques?: boolean;
    UX_Pas_Confiance?: boolean;
    UX_Equipe_Anonyme?: boolean;
    UX_Police_Petite?: boolean;
    // For excellence-profile detection
    Note_Google?: number;
    Nb_Avis_Google?: number;
    Nom_Classement?: string;
}

export function selectFailles(data: AuditFailleData, lang: 'fr' | 'en' = 'fr'): { num: string; text: string }[] {
    const failles: string[] = [];
    const cabinet = data.Nom_Cabinet;
    const spec = data.Specialite_1 || (lang === 'fr' ? 'votre domaine' : 'your field');
    const excellenceData: AuditForceData = { Nom_Cabinet: cabinet, Note_Google: data.Note_Google, Nb_Avis_Google: data.Nb_Avis_Google, Nom_Classement: data.Nom_Classement };
    const excellence = isProfilExcellence(excellenceData);

    if (lang === 'fr') {
        // ── FRENCH ──────────────────────────────────────────────────────────────

        // Faille 1 : Preuve sociale / Incarnation
        if (data.UX_Pas_Confiance && data.UX_Equipe_Anonyme) {
            failles.push(
                excellence
                    ? `La plateforme de ${cabinet} ne présente actuellement ni les visages de l'équipe, ni de témoignages clients. Pour une structure de votre niveau, c'est un décalage : vos futurs collaborateurs et mandants de haut niveau veulent savoir avec qui ils travaillent. Cette absence crée un écart entre l'excellence perçue via votre réputation et ce que découvre quelqu'un qui vous cherche en ligne.`
                    : `La plateforme de ${cabinet} ne présente actuellement ni les visages de l'équipe, ni de témoignages clients. Votre prospect arrive souvent dans un moment d'anxiété, avec un enjeu réel sur les épaules. Ce qu'il cherche avant tout, c'est de savoir qu'il entre en relation avec des personnes compétentes et de confiance. L'absence de ces signaux lui complique involontairement cette étape.`
            );
        } else if (data.UX_Pas_Confiance) {
            failles.push(
                excellence
                    ? `Aucun témoignage client ou résultat concret n'est visible sur la plateforme de ${cabinet}. Pour une structure de votre envergure, c'est une occasion manquée : vos partenaires potentiels, recruteurs ou confrères cherchent des preuves de ce que vous accomplissez. Rendre ce parcours visible renforcerait la cohérence entre votre réputation et votre présence digitale.`
                    : `Aucun témoignage client ou résultat concret n'est visible sur la plateforme de ${cabinet}. Dans un secteur où la recommandation est reine, un prospect qui arrive de façon froide a besoin d'une validation externe pour franchir le cap du contact. Cette réassurance, simple à mettre en place, peut faire la différence entre une consultation perdue et un nouveau mandat.`
            );
        }

        // Faille 2 : Navigation surchargée
        if (data.UX_Menu_Surcharge) {
            failles.push(
                excellence
                    ? `La navigation de ${cabinet} présente un nombre d'options qui peut disperser l'attention de quelqu'un qui visite pour la première fois. Pour un cabinet de votre statut, l'architecture de navigation doit refléter la clarté et la précision de votre pratique. Simplifier cette architecture renforcerait la cohérence entre votre expertise et l'expérience que vous offrez à ceux qui vous découvrent.`
                    : `La navigation de ${cabinet} présente un nombre d'options qui peut disperser l'attention de quelqu'un qui arrive avec une problématique précise. Un futur client sous pression cherche une réponse immédiate, pas un sommaire. Simplifier l'architecture de navigation permettrait d'orienter ce visiteur directement vers ce qui l'intéresse.`
            );
        }

        // Faille 3 : Contact difficile
        if (data.UX_Contact_Difficile) {
            failles.push(
                excellence
                    ? `Depuis la page d'accueil de ${cabinet}, la prise de contact n'est pas immédiatement visible. Pour le niveau de dossiers que vous traitez, ce n'est pas anodin : un partenaire, un confrère ou un client d'envergure qui doit chercher comment vous joindre peut percevoir cela comme un signal d'organisation interne. Fluidifier cet accès aligne l'expérience sur la rigueur de votre pratique.`
                    : `La prise de contact depuis la page d'accueil de ${cabinet} n'est pas immédiatement visible. Un prospect convaincu par votre réputation ne devrait jamais avoir à chercher comment vous joindre. Chaque obstacle entre lui et le bouton de contact est une occasion manquée.`
            );
        }

        // Faille 4 : UI / Typographie
        if (data.UX_Police_Defaut || data.UX_Pas_Hierarchie) {
            failles.push(
                excellence
                    ? `L'identité visuelle de ${cabinet} utilise des polices et une hiérarchie de texte communes à un grand nombre de sites sans lien avec votre secteur. Pour un cabinet de votre niveau, cette uniformité crée un écart inattendu avec la sophistication de votre pratique. Le signal visuel devrait refléter directement le niveau d'exigence que vos clients expérimentent.`
                    : `L'identité visuelle de ${cabinet} utilise des polices et une hiérarchie de texte communes à un grand nombre de sites. La typographie est l'une des premières choses que perçoit votre visiteur, souvent avant même de lire un mot. Bien choisie, elle peut projeter immédiatement le niveau d'exigence de votre pratique.`
            );
        }

        // Faille 5 : Image de marque (regroupe template + photos génériques + typo défaut)
        const hasGenericBrand = data.Est_Template && (data.UX_Photos_Generiques || data.UX_Police_Defaut);
        if (hasGenericBrand) {
            const templateNom = data.Nom_Template || 'un CMS généraliste';
            failles.push(
                excellence
                    ? `La plateforme de ${cabinet} repose sur ${templateNom}, utilise des polices standard et des visuels génériques. L'ensemble crée un décalage visible entre la réputation d'excellence de votre cabinet et l'image que découvre un visiteur en ligne. Ce n'est pas un problème technique, c'est un problème de cohérence : votre présence digitale ne reflète pas encore le niveau d'exigence que vos clients expérimentent au quotidien.`
                    : `La plateforme de ${cabinet} repose sur ${templateNom}, avec des polices standard et des visuels génériques identiques à des milliers d'autres sites. Ce manque de singularité crée involontairement un décalage entre votre expertise réelle et l'image perçue en ligne. Un prospect qui compare plusieurs cabinets ne perçoit pas ce qui vous distingue à première vue.`
            );
        } else if (data.UX_Photos_Generiques && !hasGenericBrand) {
            failles.push(
                excellence
                    ? `Les visuels de ${cabinet} proviennent d'une banque d'images, ce qui crée un contraste avec la réalité de votre pratique. Pour un cabinet de votre réputation, des photographies sur mesure de vos équipes et espaces aligneraient votre image en ligne sur ce que vivent réellement vos clients.`
                    : `Les visuels de ${cabinet} proviennent d'une banque d'images, ce qui confère un aspect générique que le visiteur averti reconnaît instinctivement. Dans un secteur où l'authenticité et la confiance sont fondamentales, des photographies sur mesure renforceraient considérablement la crédibilité.`
            );
        } else if (data.Est_Template && failles.length < 3) {
            const templateNom = data.Nom_Template ? `sur ${data.Nom_Template}` : 'sur un CMS généraliste';
            failles.push(
                excellence
                    ? `La plateforme de ${cabinet} repose ${templateNom}, partagé avec des milliers de sites d'univers très différents. Pour un cabinet référencé à votre niveau, ce détail peut créer un décalage entre la réputation que véhicule votre nom et l'environnement dans lequel on vous découvre en ligne.`
                    : `La plateforme de ${cabinet} repose ${templateNom}, un outil partagé avec des milliers de sites d'univers très différents. Cela n'affecte pas la qualité de votre expertise, mais peut créer un décalage subtil entre l'image perçue en ligne et la réalité de votre pratique en ${spec}.`
            );
        }


        // Faille 7 : Vitesse
        if (data.Temps_Chargement && data.Temps_Chargement > 3 && failles.length < 3) {
            failles.push(
                `Le temps de chargement de la plateforme de ${cabinet} est de ${data.Temps_Chargement} secondes. Sur mobile, au-delà de 3 secondes, une part significative des visiteurs quitte la page avant même d'avoir pu voir votre contenu. C'est un détail technique, mais qui pèse concrètement sur le nombre de personnes qui vous lisent réellement chaque semaine.`
            );
        }

        // Faille 8 : Copywriting
        if (data.Copywriting_Juridique && failles.length < 3) {
            failles.push(
                excellence
                    ? `Le contenu de ${cabinet} adopte une approche très technique du droit. Pour attirer les meilleurs mandats (décideurs, funds, dirigeants) le discours doit répondre à leurs enjeux réels, pas seulement décrire vos domaines. Une réécriture orientée enjeux-clients valoriserait encore davantage la profondeur de votre expertise.`
                    : `Le contenu de ${cabinet} adopte une approche descriptive du droit, avec un niveau de technicité qui peut décourager un décideur qui n'est pas lui-même juriste. Un discours davantage orienté vers les enjeux réels de vos clients leur permettrait de comprendre immédiatement en quoi vous êtes la bonne personne pour leur situation.`
            );
        }

        // Faille 9 : SSL
        if (data.Pas_SSL && failles.length < 3) {
            failles.push(
                `La plateforme de ${cabinet} n'est pas en HTTPS. Un navigateur affichera un avertissement "Non sécurisé" à vos visiteurs, ce qui peut créer un doute immédiat et injustifié sur le sérieux de votre structure, notamment chez des clients qui vous contactent pour des sujets sensibles.`
            );
        }

        // Faille 10 : Mobile
        if (data.Pas_Mobile && failles.length < 3) {
            failles.push(
                excellence
                    ? `La plateforme de ${cabinet} présente des difficultés d'affichage sur mobile. Aujourd'hui, même une recommandation entre pairs se vérifie sur smartphone. Si cette première impression visuelle est altérée, elle peut créer un décalage inattendu entre votre réputation transmise verbalement et ce que découvre votre interlocuteur en ligne.`
                    : `La plateforme de ${cabinet} présente des difficultés d'affichage sur mobile. Aujourd'hui, une recommandation sur deux se vérifie immédiatement sur smartphone. Si cette première impression visuelle est altérée, elle peut nuire à une opportunité qui, autrement, aurait abouti naturellement.`
            );
        }

    } else {
        // ── ENGLISH ─────────────────────────────────────────────────────────────

        // Faille 1 : Social proof
        if (data.UX_Pas_Confiance && data.UX_Equipe_Anonyme) {
            failles.push(
                excellence
                    ? `${cabinet}'s platform currently features neither team profiles nor client testimonials. For a firm at your level, this is a disconnect: future senior hires and high-value mandates want to know who they're working with. This gap creates a discrepancy between the excellence your reputation signals and what someone finds when they look you up online.`
                    : `${cabinet}'s platform currently features neither team profiles nor client testimonials. Prospective clients often arrive with a real issue and real anxiety. What they look for first is to know they're dealing with competent, trustworthy people. The absence of these signals makes that step harder than it needs to be.`
            );
        } else if (data.UX_Pas_Confiance) {
            failles.push(
                excellence
                    ? `No client testimonials or concrete results are visible on ${cabinet}'s platform. For a firm of your standing, this is a missed opportunity: potential partners, recruiters, or referrers look for evidence of what you accomplish. Making this visible would strengthen the coherence between your reputation and your digital presence.`
                    : `No client testimonials or concrete results are visible on ${cabinet}'s platform. When a prospect arrives cold, they need external validation to take the next step. This simple addition can be the difference between a lost enquiry and a new engagement.`
            );
        }

        // Faille 2 : Navigation
        if (data.UX_Menu_Surcharge) {
            failles.push(
                excellence
                    ? `${cabinet}'s navigation presents too many options for a first-time visitor. For a firm of your stature, the navigation architecture should reflect the clarity and precision of your practice. Simplifying it would reinforce the coherence between your expertise and the experience you offer those discovering you.`
                    : `${cabinet}'s navigation presents too many options for someone arriving with a specific issue. A prospective client under pressure is looking for a direct answer, not a table of contents. Streamlining the navigation would help direct that visitor immediately to what's relevant to them.`
            );
        }

        // Faille 3 : Contact
        if (data.UX_Contact_Difficile) {
            failles.push(
                excellence
                    ? `From ${cabinet}'s homepage, the contact pathway is not immediately visible. For the level of mandates you handle, this matters: a prospective partner or senior client who has to search for how to reach you may read this as a signal of internal disorganisation. Streamlining this aligns the experience with the rigour of your practice.`
                    : `From ${cabinet}'s homepage, the contact pathway is not immediately visible. A prospect already convinced by your reputation should never have to search for how to reach you. Every obstacle between them and the contact button is a missed opportunity.`
            );
        }

        // Faille 4 : UI / Typography
        if (data.UX_Police_Defaut || data.UX_Pas_Hierarchie) {
            failles.push(
                excellence
                    ? `${cabinet}'s visual identity uses fonts and text hierarchy common to thousands of sites unrelated to your sector. For a firm of your standing, this visual uniformity creates an unexpected gap with the sophistication of your practice. The visual signal should directly reflect the standard your clients experience.`
                    : `${cabinet}'s visual identity uses fonts and text hierarchy common to a large number of sites. Typography is often the first thing your visitor perceives, even before reading a word. Done well, it immediately projects the standard of rigour your practice operates at.`
            );
        }

        // Faille 5 : Stock photos
        if (data.UX_Photos_Generiques) {
            failles.push(
                excellence
                    ? `${cabinet}'s visuals come from a stock library, which contrasts with the reality of your practice. For a firm of your reputation, bespoke photography of your team and spaces is not a luxury: it aligns what the world sees with what your clients actually experience.`
                    : `${cabinet}'s visuals come from a stock library, giving them a generic feel that the discerning visitor instinctively recognises. In a sector where authenticity and trust are foundational values, bespoke photography would add a personal dimension that significantly strengthens credibility.`
            );
        }

        // Faille 6 : Template
        if (data.Est_Template && failles.length < 3) {
            const templateNom = data.Nom_Template ? `on ${data.Nom_Template}` : 'on a generic CMS';
            failles.push(
                excellence
                    ? `${cabinet}'s platform runs ${templateNom}, shared with thousands of sites from vastly different industries. For a firm of your ranking, this technical detail can create a perceptible gap between the reputation your name carries and the environment in which people discover you online.`
                    : `${cabinet}'s platform runs ${templateNom}, shared with thousands of sites from entirely different sectors. This doesn't affect the quality of your expertise, but it can create a subtle disconnect between your online perception and the reality of your practice in ${spec}.`
            );
        }

        // Faille 7 : Speed
        if (data.Temps_Chargement && data.Temps_Chargement > 3 && failles.length < 3) {
            failles.push(
                `${cabinet}'s platform takes ${data.Temps_Chargement} seconds to load. On mobile, beyond 3 seconds, a significant share of visitors leave before seeing any content. It's a technical detail, but one that has a real impact on how many people actually read you each week.`
            );
        }

        // Faille 8 : Copywriting
        if (data.Copywriting_Juridique && failles.length < 3) {
            failles.push(
                excellence
                    ? `${cabinet}'s content takes a very technical approach to law. To attract the best mandates (decision-makers, funds, executives) the messaging must speak to their real issues, not just describe practice areas. A client-outcomes-oriented rewrite would further demonstrate the depth of your expertise.`
                    : `${cabinet}'s content takes a descriptive approach to law, with a level of technicality that can deter a decision-maker who isn't themselves a lawyer. Without reducing the rigour of your expertise, orienting the discourse towards the real stakes of your clients would help them understand immediately why you are the right person for their situation.`
            );
        }

        // Faille 9 : SSL
        if (data.Pas_SSL && failles.length < 3) {
            failles.push(
                `${cabinet}'s platform is not HTTPS-secured. A browser will display a "Not Secure" warning to visitors, which can create an immediate and unwarranted doubt about the seriousness of your firm, particularly for clients reaching out about sensitive matters.`
            );
        }

        // Faille 10 : Mobile
        if (data.Pas_Mobile && failles.length < 3) {
            failles.push(
                excellence
                    ? `${cabinet}'s platform has display issues on mobile. Today, even peer-to-peer referrals are verified on a smartphone. If this visual first impression is compromised, it can create an unexpected gap between your reputation as conveyed verbally and what your contact actually sees when they look you up.`
                    : `${cabinet}'s platform has display issues on mobile. Today, one in two referrals is verified immediately on a smartphone. If this first visual impression is compromised, it can undermine an opportunity that would otherwise have concluded naturally.`
            );
        }
    }

    return failles.slice(0, 3).map((text, index) => ({
        num: String(index + 1).padStart(2, '0'),
        text,
    }));
}
