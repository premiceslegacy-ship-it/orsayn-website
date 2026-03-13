export interface AuditForceData {
  Nom_Cabinet: string;
  Nom_Classement?: string;
  Note_Google?: number;
  Nb_Avis_Google?: number;
  Taille_Equipe?: number;
  Annee_Creation?: number;
  Specialite_1?: string;
  Specialite_2?: string;
  Ville?: string;
  // UX/UI positive signals
  UX_Architecture_Intuitive?: boolean;
  UX_Typographie_Prestige?: boolean;
  UX_Preuve_Sociale?: boolean;
  UX_Equipe_Visible?: boolean;
  UX_Vitesse_Excellente?: boolean;
}

// A "high-success" profile: 30+ reviews AND (4+ stars OR a ranking)
export function isProfilExcellence(data: AuditForceData): boolean {
  const hasStrongRating = (data.Note_Google ?? 0) >= 4.0;
  const hasManyReviews = (data.Nb_Avis_Google ?? 0) >= 30;
  const hasRanking = !!data.Nom_Classement;
  return (hasManyReviews && hasStrongRating) || (hasManyReviews && hasRanking) || (hasStrongRating && hasRanking);
}

export function selectForces(data: AuditForceData, lang: 'fr' | 'en' = 'fr'): string[] {
  const forces: string[] = [];
  const cabinet = data.Nom_Cabinet;
  const currentYear = new Date().getFullYear();
  const annees = data.Annee_Creation ? currentYear - data.Annee_Creation : 0;
  const spec = data.Specialite_1 || '';
  const excellence = isProfilExcellence(data);

  // ── FRENCH ──────────────────────────────────────────────────────────────────
  if (lang === 'fr') {
    // Force A : Classement
    if (data.Nom_Classement) {
      if (excellence) {
        forces.push(
          `${cabinet} est référencé dans ${data.Nom_Classement}. Cette reconnaissance, accordée à un nombre restreint de structures, est le reflet d'une excellence déjà éprouvée par le marché. Ce que nous faisons, c'est aligner votre présence digitale sur cette réalité, pour que vos meilleurs futurs mandats et vos futurs talents vous trouvent avec la même clarté que vos clients actuels.`
        );
      } else {
        forces.push(
          `${cabinet} est référencé dans ${data.Nom_Classement}. Ce type de reconnaissance, accordée à un nombre restreint de structures par marché, valide une chose que peu de cabinets peuvent se prévaloir : votre expertise a été éprouvée par ceux qui connaissent le mieux l'exigence du secteur.`
        );
      }
    }

    // Force B : Google rating
    if (data.Note_Google && data.Note_Google >= 4.0) {
      const avisStr = data.Nb_Avis_Google && data.Nb_Avis_Google > 1 ? ` sur ${data.Nb_Avis_Google} avis` : '';
      if (excellence) {
        forces.push(
          `${data.Note_Google}/5${avisStr} sur Google. Ce capital de confiance, vous l'avez construit client après client, dossier par dossier. Il est réel. Ce que nous proposons, ce n'est pas d'attirer plus de clients : c'est d'aligner votre empreinte digitale sur ce niveau d'excellence, pour attirer les bons dossiers, les bons associés, et renforcer la cohérence perçue de votre cabinet par les parties prenantes qui comptent.`
        );
      } else {
        forces.push(
          `${data.Note_Google}/5${avisStr} sur Google. Ce score, construit client après client, représente une preuve de satisfaction rare dans votre secteur. Vous avez fait le plus dur : gagner la confiance active de vos clients. C'est justement cette confiance qu'une présence digitale à la hauteur peut amplifier et rayonner au-delà de votre réseau existant.`
        );
      }
    }

    // Force C : Ancienneté
    if (annees >= 10) {
      const localiteLower = data.Ville?.toLowerCase() || '';
      const paysAvecAu = ['luxembourg', 'portugal', 'maroc', 'sénégal', 'canada', 'brésil', 'royaume-uni', 'mali'];
      const preposition = paysAvecAu.some(p => localiteLower.includes(p)) ? 'au' : 'à';
      const localite = data.Ville ? ` ${preposition} ${data.Ville}` : '';
      const domaine = spec ? ` en ${spec}` : '';
      forces.push(
        excellence
          ? `${annees} ans d'exercice${domaine}${localite}. Cette longévité, vous avez mis des années à la construire. Elle représente une profondeur de marché que vos confrères plus récents ne peuvent tout simplement pas revendiquer. Le sujet n'est pas d'attirer plus de volume, c'est d'aligner votre présence sur l'autorité que cette expérience confère.`
          : `${annees} ans d'exercice${domaine}${localite}. Cette longévité, vous avez mis des années à la construire dossier après dossier. Elle représente une profondeur de marché et une résilience que vos confrères plus récents ne peuvent tout simplement pas revendiquer.`
      );
    }

    // Force D : Équipe visible
    if (data.UX_Equipe_Visible && data.Taille_Equipe && data.Taille_Equipe >= 5) {
      const spec2 = data.Specialite_2 ? ` et ${data.Specialite_2}` : '';
      const domaine2 = spec ? ` en ${spec}${spec2}` : '';
      forces.push(
        `L'incarnation visuelle d'une équipe de ${data.Taille_Equipe} collaborateurs${domaine2} humanise une expertise que vos concurrents se contentent de lister. Vos futurs clients ont besoin de savoir qui va traiter leur dossier. Vous leur donnez déjà cette réponse.`
      );
    } else if (data.Taille_Equipe && data.Taille_Equipe >= 5) {
      forces.push(
        `${data.Taille_Equipe} collaborateurs : une capacité opérationnelle qui rassure directement vos clients sur votre aptitude à absorber des dossiers d'envergure sans jamais sacrifier la qualité du suivi.`
      );
    }

    // Force E : Typographie prestige
    if (data.UX_Typographie_Prestige && forces.length < 2) {
      forces.push(
        `L'identité visuelle actuelle procède déjà d'une intention typographique claire. Cette rigueur esthétique communique, avant même la lecture, un niveau d'exigence cohérent avec vos honoraires.`
      );
    }

    // Force F : Vitesse
    if (data.UX_Vitesse_Excellente && forces.length < 2) {
      forces.push(
        `La réactivité technique de la plateforme se situe dans les meilleures performances du secteur. Un site rapide communique un message subtil mais puissant : votre structure est agile, rigoureuse, et respecte le temps de ses interlocuteurs.`
      );
    }

    // Force G : Preuve sociale
    if (data.UX_Preuve_Sociale && !data.Note_Google && forces.length < 2) {
      forces.push(
        `La présence de témoignages et de preuves sociales sur votre plateforme réduit l'hésitation de tout prospect qui ne vous connaît pas encore. Vous avez compris quelque chose que beaucoup de cabinets ignorent : en matière juridique, on choisit l'avocat avant de choisir la solution.`
      );
    }

    // Fallback
    if (forces.length === 0 && spec) {
      forces.push(
        `Votre positionnement en ${spec} vous place dans un segment où la rareté de l'expertise crée naturellement une barrière à l'entrée. Ce capital, vous l'avez bâti. Ce qui reste à construire, c'est l'empreinte digitale qui le reflète avec la même précision.`
      );
    }

    // ── ENGLISH ─────────────────────────────────────────────────────────────────
  } else {
    // Force A : Ranking
    if (data.Nom_Classement) {
      if (excellence) {
        forces.push(
          `${cabinet} is listed in ${data.Nom_Classement}. This recognition, awarded to a select number of firms, reflects excellence already validated by the market. Our role is to align your digital presence with this reality, so your ideal future mandates and talent find you with the same clarity as your current clients do.`
        );
      } else {
        forces.push(
          `${cabinet} is listed in ${data.Nom_Classement}. This type of recognition, awarded to a limited number of firms per market, validates something few firms can claim: your expertise has been tested and confirmed by those who understand the industry's standards best.`
        );
      }
    }

    // Force B : Google rating
    if (data.Note_Google && data.Note_Google >= 4.0) {
      const avisStr = data.Nb_Avis_Google && data.Nb_Avis_Google > 1 ? ` across ${data.Nb_Avis_Google} reviews` : '';
      if (excellence) {
        forces.push(
          `${data.Note_Google}/5${avisStr} on Google. This trust capital was built client by client, matter by matter. It's real. What we propose is not to bring you more clients: it's to align your digital presence with this level of excellence, to attract the right mandates, the right partners, and reinforce the perceived coherence of your firm among the stakeholders who matter most.`
        );
      } else {
        forces.push(
          `${data.Note_Google}/5${avisStr} on Google. This score, built client by client, represents a rare level of satisfaction in your sector. You've done the hardest part: earning active trust. A digital presence to match can amplify and project that trust beyond your existing network.`
        );
      }
    }

    // Force C : Seniority
    if (annees >= 10) {
      const localite = data.Ville ? ` in ${data.Ville}` : '';
      const domaine = spec ? ` in ${spec}` : '';
      forces.push(
        excellence
          ? `${annees} years of practice${domaine}${localite}. This longevity took years to build. It represents a depth of market presence your newer peers simply cannot claim. The question is no longer about volume: it's about aligning your digital presence with the authority that experience conveys.`
          : `${annees} years of practice${domaine}${localite}. This longevity, built matter by matter, represents a depth of market presence and resilience that your newer peers simply cannot claim.`
      );
    }

    // Force D : Team visible
    if (data.UX_Equipe_Visible && data.Taille_Equipe && data.Taille_Equipe >= 5) {
      forces.push(
        `Showcasing a team of ${data.Taille_Equipe} professionals humanises an expertise your competitors merely list. Prospective clients need to know who will handle their matter. You already give them that answer.`
      );
    } else if (data.Taille_Equipe && data.Taille_Equipe >= 5) {
      forces.push(
        `${data.Taille_Equipe} professionals: an operational capacity that reassures clients directly about your ability to absorb high-value matters without sacrificing quality of service.`
      );
    }

    // Force E : Prestige typography
    if (data.UX_Typographie_Prestige && forces.length < 2) {
      forces.push(
        `The current visual identity already demonstrates a clear typographic intent. This aesthetic rigour communicates, before anyone reads a word, a level of precision consistent with your fees.`
      );
    }

    // Force F : Speed
    if (data.UX_Vitesse_Excellente && forces.length < 2) {
      forces.push(
        `The platform's technical performance ranks among the best in the sector. A fast site communicates a subtle but powerful signal: your firm is agile, rigorous, and respects its clients' time.`
      );
    }

    // Force G : Social proof
    if (data.UX_Preuve_Sociale && !data.Note_Google && forces.length < 2) {
      forces.push(
        `The presence of testimonials and social proof on your platform reduces hesitation for any prospect who doesn't yet know you. You've understood something many firms overlook: in legal matters, clients choose the lawyer before they choose the solution.`
      );
    }

    // Fallback
    if (forces.length === 0 && spec) {
      forces.push(
        `Your positioning in ${spec} places you in a segment where the scarcity of genuine expertise creates a natural barrier to entry. You have built that capital. What remains is a digital presence that reflects it with equal precision.`
      );
    }
  }

  return forces.slice(0, 2);
}
