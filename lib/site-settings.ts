export const SITE_ASSET_BUCKET = 'site-assets';
const PRIMARY_WHATSAPP_LINK = 'https://wa.me/2250576911899';

function buildDefaultSiteSettings() {
  return {
    brand: {
      name: 'Action Réussite',
      logoUrl: '/images/logo.jpeg',
      footerDescription: "Depuis 2017, nous accompagnons les étudiants dans leurs démarches d'admission, de visa et de départ vers l'international.",
      copyright: '2017–2026 Action Réussite. Tous droits réservés.',
    },
    contact: {
      phone: '+225 07 79 28 95 99',
      whatsappNumber: PRIMARY_WHATSAPP_LINK,
      address: 'Abidjan, Marcory',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15889.77!2d-3.9895!3d5.3045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1eb5a4b3b7b6f%3A0x3c2b7b7b7b7b7b7b!2sMarcory%2C%20Abidjan!5e0!3m2!1sfr!2sci!4v1',
      responsePromise: 'Réponse garantie sous 24h.',
      pageTitle: 'Contactez-nous',
      pageSubtitle: 'Notre équipe est disponible pour répondre à toutes vos questions',
      introTitle: 'Parlons de votre projet',
      introBody: 'Que vous souhaitiez étudier en Chine, au Canada ou ailleurs, nous sommes là pour vous accompagner.',
      directTeamTitle: 'Contacter directement notre équipe',
      socialsTitle: 'Suivez-nous',
      formTitle: 'Envoyez-nous un message',
      mapTitle: 'Notre localisation',
      mapSubtitle: "Abidjan, Marcory — Côte d'Ivoire",
      bottomCtaTitle: 'Prêt à commencer ?',
      bottomCtaBody: 'Le moyen le plus rapide de nous joindre est WhatsApp. Réponse garantie sous 24h.',
      bottomCtaButton: 'Écrire sur WhatsApp',
      talkNowButton: 'Parler maintenant sur WhatsApp',
    },
    socialLinks: [
      { label: 'Facebook', url: 'https://www.facebook.com/share/1CcyRSopw9/?mibextid=wwXIfr', icon: 'fa-facebook-f', className: 'facebook' },
      { label: 'Instagram', url: 'https://www.instagram.com/action_reussite?igsh=YXQ1em1vcWF6ZWxk&utm_source=qr', icon: 'fa-instagram', className: 'instagram' },
      { label: 'TikTok', url: 'https://www.tiktok.com/@action.reussite?_r=1&_t=ZS-95AEBRE4ZtN', icon: 'fa-tiktok', className: 'tiktok' },
      { label: 'WhatsApp', url: PRIMARY_WHATSAPP_LINK, icon: 'fa-whatsapp', className: 'whatsapp' },
    ],
    teamContacts: [
      { name: 'MR Havila Comoe', role: 'Directeur marketing', link: 'https://wa.me/message/A6QHXGURJUQRM1' },
      { name: 'MR Lopez Aka', role: 'PDG ACTION REUSSITE', link: 'https://wa.me/message/A6QHXGURJUQRM1' },
      { name: 'MR Assalé Mickaël', role: 'Directeur chargé à la clientèle', link: 'https://wa.me/message/RNF754PNZDDOB1' },
    ],
    home: {
      hero: {
        badge: 'Rentrée Septembre 2026 — Places limitées',
        title: 'Bourse + admission + visa en 60 jours grâce à <span>ACTION RÉUSSITE</span>',
        proof: "+229 étudiants déjà envoyés à l'étranger depuis 2017",
        subtext: "Nous prenons en charge votre projet d'études de A à Z : choix de pays, admission, visa et départ. Selon votre profil, en 60 jours vous pouvez tout obtenir.",
        primaryGuestLabel: 'Démarrer mon projet',
        primaryUserLabel: 'Accéder à mon espace',
        secondaryLabel: 'Voir comment ça marche',
        images: ['/images/photo-1.jpeg', '/images/photo-2.jpeg', '/images/photo-3.jpeg'],
      },
      stats: {
        students: '229',
        countries: '6',
        universities: '52',
        satisfaction: '98',
        studentsLabel: "Étudiants envoyés à l'étranger",
        countriesLabel: 'Pays de destination couverts',
        universitiesLabel: 'Universités partenaires',
        satisfactionLabel: 'Taux de satisfaction client',
      },
      destinationsSection: {
        title: "Choisissez votre destination d'étude",
        subtitle: 'Nous vous accompagnons vers les meilleures universités à travers le monde',
      },
      destinations: [
        {
          name: 'Chine 🇨🇳',
          image: '/images/photo-36.jpeg',
          description: '+52 universités partenaires, accompagnement complet de A à Z.',
          link: PRIMARY_WHATSAPP_LINK,
          internal: false,
          tags: ['Bourses disponibles', 'Rentrée Sept. 2026', 'Licence / Master'],
        },
        {
          name: 'Canada 🇨🇦',
          image: '/images/canada-fiche.jpeg',
          description: 'Études + travail, immigration possible. Formation ou accompagnement complet.',
          link: '/canada',
          internal: true,
          tags: ['Bourses disponibles', 'Rentrée Sept. 2026', 'Licence / Master'],
        },
        {
          name: 'Inde 🇮🇳',
          image: '/images/inde-fiche.jpeg',
          description: 'Programmes accessibles, universités reconnues internationalement.',
          link: PRIMARY_WHATSAPP_LINK,
          internal: false,
          tags: ['Bourses disponibles', 'Rentrée Sept. 2026', 'Licence / Master / Doctorat'],
        },
        {
          name: 'Turquie 🇹🇷',
          image: '/images/turquie-fiche.jpeg',
          description: 'Bourses turques généreuses et admission dans des universités de qualité.',
          link: PRIMARY_WHATSAPP_LINK,
          internal: false,
          tags: ['Bourses disponibles', 'Rentrée Sept. 2026', 'Licence / Master'],
        },
        {
          name: 'Maroc 🇲🇦',
          image: '/images/photo-35.jpeg',
          description: 'Études francophones de qualité à coût accessible.',
          link: PRIMARY_WHATSAPP_LINK,
          internal: false,
          tags: ['Coût accessible', 'Rentrée Sept. 2026', 'Licence / Master'],
        },
        {
          name: 'France 🇫🇷',
          image: '/images/photo-34.jpeg',
          description: 'Campus France, bourses et admission dans les universités françaises.',
          link: PRIMARY_WHATSAPP_LINK,
          internal: false,
          tags: ['Bourses disponibles', 'Rentrée Sept. 2026', 'Licence / Master'],
        },
      ],
      servicesSection: {
        title: 'Ce que vous gagnez avec nous',
        subtitle: 'Chaque service est conçu pour maximiser vos chances de réussite',
      },
      services: [
        {
          icon: 'fa-graduation-cap',
          title: 'Nous trouvons la bourse idéale pour vous',
          description: 'Selon votre profil et votre destination, nous identifions les meilleures opportunités de financement et montons votre dossier de candidature.',
        },
        {
          icon: 'fa-file-lines',
          title: 'Nous vous ouvrons les portes des universités',
          description: "Choix stratégique d'université, montage complet du dossier, lettres de motivation percutantes et suivi jusqu'à l'acceptation.",
        },
        {
          icon: 'fa-passport',
          title: "Nous maximisons vos chances d'obtenir votre visa",
          description: "Préparation minutieuse de votre dossier consulaire, simulation d'entretien et accompagnement jusqu'à l'obtention du visa.",
        },
        {
          icon: 'fa-plane-departure',
          title: "Vous partez l'esprit tranquille",
          description: "Billets d'avion, logement, orientation à l'arrivée — nous gérons tout pour que vous n'ayez qu'à vous concentrer sur vos études.",
        },
      ],
      videos: {
        title: 'Regardez comment nos étudiants partent réellement',
        subtitle: 'Ce ne sont pas des promesses — ce sont des résultats. Voyez par vous-même.',
        ctaLabel: 'Je veux être le prochain',
        items: [
          { src: '/videos/temoignage.mp4', poster: '/images/photo-10.jpeg' },
          { src: '/videos/temoignage-2.mp4', poster: '/images/photo-30.jpeg' },
        ],
      },
      testimonials: {
        title: 'Nos étudiants témoignent',
        subtitle: 'Ils ont fait confiance à Action Réussite — voici leurs histoires',
        items: [
          { quote: "Grâce à ACTION RÉUSSITE, j'ai obtenu mon visa et ma bourse pour la Chine en moins de 2 mois !", image: '/images/photo-11.jpeg', country: 'Chine 🇨🇳' },
          { quote: "Je ne savais pas par où commencer. L'équipe m'a guidé du début à la fin. Aujourd'hui je suis au Canada !", image: '/images/photo-12.jpeg', country: 'Canada 🇨🇦' },
          { quote: "ACTION RÉUSSITE m'a trouvé une bourse complète. Je recommande à 100% !", image: '/images/photo-13.jpeg', country: 'Turquie 🇹🇷' },
        ],
        gallery: ['/images/photo-14.jpeg', '/images/photo-15.jpeg', '/images/photo-16.jpeg', '/images/photo-17.jpeg', '/images/photo-18.jpeg', '/images/photo-30.jpeg', '/images/photo-31.jpeg', '/images/photo-32.jpeg'],
      },
      cta: {
        title: "Lancez votre projet dès aujourd'hui",
        urgency: 'Places limitées pour les prochaines sessions — Rentrée Septembre 2026',
        description: 'Ne laissez pas passer cette opportunité. Chaque jour compte pour préparer votre dossier.',
        primaryGuestLabel: 'Créer mon compte gratuitement',
        primaryUserLabel: 'Mon espace personnel',
        secondaryLabel: 'Nous contacter',
      },
    },
    canada: {
      header: {
        title: 'Étudier au Canada',
        subtitle: "Avec ou sans assistance, réalisez votre rêve d'étudier au Canada grâce à Action Réussite",
      },
      emotion: {
        title: 'Vous êtes perdu dans les démarches ?',
        body1: "Vous pouvez faire votre projet seul et économiser des millions. Ou vous pouvez nous confier l'intégralité de vos démarches et partir l'esprit tranquille.",
        body2: 'Dans les deux cas, nous avons la solution pour vous.',
      },
      comparison: {
        accompanimentLabel: 'Accompagnement',
        formationLabel: 'Formation',
        rows: [
          { label: 'Coût', left: 'Élevé', right: 'Réduit' },
          { label: 'Autonomie', left: 'Dépendance', right: 'Totale' },
          { label: 'Rapidité', left: 'Temps long', right: 'Rapide' },
          { label: 'Apprentissage', left: 'Limité', right: 'Complet' },
        ],
      },
      options: {
        title: 'Choisissez votre formule',
        subtitle: 'Deux options adaptées à vos besoins et à votre budget',
        accompaniment: {
          title: 'Accompagnement complet',
          description: "Nous prenons en charge l'intégralité de vos démarches pour étudier au Canada.",
          items: [
            "Choix de l'école et du programme",
            "Montage complet du dossier d'admission",
            'Demande de CAQ',
            "Demande de permis d'étude",
            "Préparation à l'entretien consulaire",
            "Suivi jusqu'au départ",
          ],
          guestCtaLabel: 'Démarrer mon projet Canada',
          userCtaLabel: 'Accéder à mon espace',
        },
        formation: {
          badge: 'NOUVEAU',
          title: 'Formation autonome',
          description: 'Apprenez à faire vous-même toutes vos démarches pour le Canada.',
          items: [
            'Formation complète en ligne',
            'Guides PDF détaillés étape par étape',
            'Assistance pendant toute la formation',
            'Session questions / réponses en direct',
            'Accès immédiat après inscription',
            'Mises à jour incluses',
          ],
          ctaLabel: 'Découvrir la formation',
        },
      },
      training: {
        title: 'Formation spéciale — Étudier au Canada seul',
        subtitle: 'Tout ce que vous devez savoir pour réussir vos démarches en toute autonomie',
        modules: [
          'Comment choisir son école au Canada',
          "Comment monter son dossier d'admission",
          'Comment faire sa demande de CAQ',
          "Comment faire sa demande de permis d'étude",
          "Conseils pour augmenter ses chances d'acceptation",
        ],
        sessionTitle: 'Prochaine session : Fin juillet 2026',
        sessionSubtitle: 'Durée : 1 semaine intensive — Places limitées',
        pricingTitle: "S'inscrire à la formation",
        pricingSubtitle: 'Formation complète Canada',
        pricingStatus: '250 000 FCFA',
        pricingNote: 'Paiement en ligne sécurisé — Accès immédiat',
        features: [
          'Accès à la formation complète',
          'Support PDF téléchargeables',
          'Assistance pendant la formation',
          'Session questions / réponses',
          'Accès immédiat après paiement',
        ],
        ctaLabel: "S'inscrire maintenant",
      },
      cta: {
        title: 'Des questions sur le Canada ?',
        description: 'Notre équipe est disponible pour vous orienter vers la meilleure option selon votre profil.',
        contactLabel: 'Nous envoyer un message',
        whatsappLabel: 'Ou via WhatsApp',
        whatsappText: "Bonjour, j'ai des questions sur les études au Canada",
      },
    },
    formationCanada: {
      header: {
        title: "Devenez autonome dans votre projet d'étude au Canada",
        subtitle: "Évitez les erreurs, économisez de l'argent et maîtrisez toutes les étapes",
      },
      intro: {
        title: 'Pourquoi cette formation ?',
        body: "Chaque année, des centaines d'étudiants échouent dans leurs démarches pour le Canada à cause d'erreurs évitables. Cette formation vous donne toutes les clés pour réussir par vous-même, étape par étape, sans intermédiaire.",
      },
      learning: {
        title: 'Ce que vous allez apprendre :',
        items: [
          { title: 'Comment choisir son école', description: 'Critères de sélection, écoles DLI, programmes adaptés à votre profil' },
          { title: 'Comment monter son dossier', description: 'Documents requis, lettres de motivation, relevés, traductions' },
          { title: 'Comment faire sa demande de CAQ', description: "Procédure complète pour le Certificat d'acceptation du Québec" },
          { title: "Comment faire sa demande de permis d'étude", description: 'Formulaires, biométrie, preuve financière, soumission en ligne' },
          { title: 'Conseils pour augmenter ses chances', description: "Erreurs fréquentes à éviter, astuces de pros, retours d'expérience" },
        ],
      },
      session: {
        title: 'Prochaine session : Fin juillet 2026',
        lines: [
          'Durée : 1 semaine intensive de formation',
          'Format : En ligne — accessible depuis partout',
        ],
      },
      includes: {
        title: 'Ce qui est inclus :',
        items: [
          { icon: 'fa-video', text: 'Accès à la formation complète' },
          { icon: 'fa-file-pdf', text: 'Support PDF téléchargeables' },
          { icon: 'fa-headset', text: 'Assistance pendant la formation' },
          { icon: 'fa-microphone', text: 'Session questions / réponses' },
        ],
      },
      pricing: {
        badge: 'PLACES LIMITÉES',
        title: 'Formation Canada',
        subtitle: 'Toutes les démarches de A à Z',
        price: '250 000 FCFA',
        note: 'Paiement en ligne sécurisé — Accès immédiat',
        urgency: 'Places limitées — Session juillet 2026',
        features: [
          'Formation complète (1 semaine)',
          'Supports PDF détaillés',
          'Assistance personnalisée',
          'Session Q&A en direct',
          'Accès immédiat après paiement',
        ],
        bonusTitle: 'Bonus inclus :',
        bonus: [
          { icon: 'fa-file-pdf', text: "Modèles PDF prêts à l'emploi" },
          { icon: 'fa-list-check', text: 'Liste des écoles recommandées' },
          { icon: 'fa-lightbulb', text: 'Astuces visa exclusives' },
        ],
        enrollLabel: "S'inscrire maintenant",
        enrolledLabel: 'Vous êtes inscrit',
        contactLabel: 'Poser une question',
        guarantee: 'Satisfait ou remboursé sous 7 jours',
        paymentNote: 'Paiement 100% sécurisé',
      },
      testimonials: {
        title: 'Ils nous font confiance',
        subtitle: 'Découvrez les témoignages de nos étudiants accompagnés avec succès',
        gallery: ['/images/photo-19.jpeg', '/images/photo-20.jpeg', '/images/photo-21.jpeg', '/images/photo-22.jpeg'],
      },
      faq: {
        title: 'Questions fréquentes',
        items: [
          { q: 'La formation est-elle accessible en ligne ?', a: "Oui, la formation est 100% en ligne. Vous pouvez y accéder depuis n'importe quel pays." },
          { q: 'Quand commence la prochaine session ?', a: "La prochaine session est prévue pour fin juillet 2026. La durée est d'une semaine intensive." },
          { q: 'Comment se fait le paiement ?', a: "Le paiement se fait en ligne de manière sécurisée. L'accès est immédiat après paiement." },
          { q: "Y a-t-il un accompagnement pendant la formation ?", a: "Oui, vous bénéficiez d'une assistance pendant toute la durée de la formation ainsi que de sessions questions-réponses en direct." },
          { q: 'Est-ce que je peux réussir sans vous ?', a: "Oui, c'est justement l'objectif de cette formation : vous rendre 100% autonome." },
          { q: 'Combien de temps ça prend ?', a: 'La formation dure 1 semaine intensive. Ensuite, les démarches complètes peuvent prendre entre 2 et 4 mois.' },
          { q: 'Quel budget prévoir pour étudier au Canada ?', a: "Le budget varie selon l'école. En moyenne, prévoyez entre 3 et 8 millions FCFA." },
          { q: "Y a-t-il une garantie ?", a: 'Oui ! Satisfait ou remboursé sous 7 jours. Aucun risque pour vous.' },
        ],
      },
      cta: {
        title: 'Ne manquez pas cette opportunité',
        description: 'Inscrivez-vous maintenant et prenez le contrôle de votre avenir au Canada.',
        enrollLabel: "S'inscrire à la formation",
        contactLabel: 'Nous contacter',
      },
    },
  };
}

export type SiteSettings = ReturnType<typeof buildDefaultSiteSettings>;
type DeepPartial<T> = T extends Array<infer U> ? DeepPartial<U>[] : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

export const defaultSiteSettings: SiteSettings = buildDefaultSiteSettings();

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function deepMerge<T>(target: T, source: unknown): T {
  if (Array.isArray(target)) {
    return (Array.isArray(source) ? cloneValue(source) : cloneValue(target)) as T;
  }

  if (!isPlainObject(target) || !isPlainObject(source)) {
    return (source === undefined ? cloneValue(target) : cloneValue(source)) as T;
  }

  const result: Record<string, unknown> = cloneValue(target as Record<string, unknown>);

  for (const [key, value] of Object.entries(source)) {
    const existing = result[key];
    if (Array.isArray(value)) {
      result[key] = cloneValue(value);
      continue;
    }

    if (isPlainObject(value) && isPlainObject(existing)) {
      result[key] = deepMerge(existing, value);
      continue;
    }

    result[key] = cloneValue(value);
  }

  return result as T;
}

function mapLegacySettings(raw: Record<string, unknown>): DeepPartial<SiteSettings> {
  const legacy: DeepPartial<SiteSettings> = {};

  if (raw.heroBadge || raw.heroTitle || raw.heroProof || raw.heroSubtext || raw.heroImages) {
    legacy.home = {
      ...legacy.home,
      hero: {
        ...defaultSiteSettings.home.hero,
        badge: typeof raw.heroBadge === 'string' ? raw.heroBadge : defaultSiteSettings.home.hero.badge,
        title: typeof raw.heroTitle === 'string' ? raw.heroTitle : defaultSiteSettings.home.hero.title,
        proof: typeof raw.heroProof === 'string' ? raw.heroProof : defaultSiteSettings.home.hero.proof,
        subtext: typeof raw.heroSubtext === 'string' ? raw.heroSubtext : defaultSiteSettings.home.hero.subtext,
        images: Array.isArray(raw.heroImages) ? raw.heroImages.filter((item): item is string => typeof item === 'string') : defaultSiteSettings.home.hero.images,
      },
    };
  }

  if (raw.destChine || raw.destCanada || raw.destInde || raw.destTurquie || raw.destMaroc || raw.destFrance) {
    legacy.home = {
      ...legacy.home,
      destinations: defaultSiteSettings.home.destinations.map((destination) => {
        const name = destination.name.split(' ')[0];
        const key = `dest${name}`;
        const image = typeof raw[key] === 'string' ? raw[key] : destination.image;
        return { ...destination, image };
      }),
    };
  }

  if (raw.statEtudiants || raw.statPays || raw.statSatisfaction) {
    legacy.home = {
      ...legacy.home,
      stats: {
        ...defaultSiteSettings.home.stats,
        students: typeof raw.statEtudiants === 'string' ? raw.statEtudiants : defaultSiteSettings.home.stats.students,
        countries: typeof raw.statPays === 'string' ? raw.statPays : defaultSiteSettings.home.stats.countries,
        satisfaction: typeof raw.statSatisfaction === 'string' ? raw.statSatisfaction : defaultSiteSettings.home.stats.satisfaction,
      },
    };
  }

  if (raw.formationPrix || raw.formationSession) {
    legacy.canada = {
      ...legacy.canada,
      training: {
        ...defaultSiteSettings.canada.training,
        pricingStatus: typeof raw.formationPrix === 'string' ? raw.formationPrix : defaultSiteSettings.canada.training.pricingStatus,
        sessionTitle: typeof raw.formationSession === 'string' ? `Prochaine session : ${raw.formationSession}` : defaultSiteSettings.canada.training.sessionTitle,
      },
    };
    legacy.formationCanada = {
      ...legacy.formationCanada,
      session: {
        ...defaultSiteSettings.formationCanada.session,
        title: typeof raw.formationSession === 'string' ? `Prochaine session : ${raw.formationSession}` : defaultSiteSettings.formationCanada.session.title,
      },
      pricing: {
        ...defaultSiteSettings.formationCanada.pricing,
        price: typeof raw.formationPrix === 'string' ? raw.formationPrix : defaultSiteSettings.formationCanada.pricing.price,
      },
    };
  }

  if (raw.contactPhone || raw.contactAddress || raw.contactWhatsapp) {
    legacy.contact = {
      ...defaultSiteSettings.contact,
      phone: typeof raw.contactPhone === 'string' ? raw.contactPhone : defaultSiteSettings.contact.phone,
      address: typeof raw.contactAddress === 'string' ? raw.contactAddress : defaultSiteSettings.contact.address,
      whatsappNumber: typeof raw.contactWhatsapp === 'string' ? raw.contactWhatsapp : defaultSiteSettings.contact.whatsappNumber,
    };
  }

  if (raw.testimonialImages && Array.isArray(raw.testimonialImages)) {
    legacy.home = {
      ...legacy.home,
      testimonials: {
        ...defaultSiteSettings.home.testimonials,
        gallery: raw.testimonialImages.filter((item): item is string => typeof item === 'string'),
      },
    };
  }

  return legacy;
}

export function normalizeSiteSettings(raw?: Record<string, unknown> | null): SiteSettings {
  const base = cloneValue(defaultSiteSettings);
  if (!raw) return base;

  const legacy = mapLegacySettings(raw);
  return deepMerge(deepMerge(base, legacy), raw);
}

export function makeWhatsappUrl(whatsappNumber: string, text?: string) {
  const rawValue = whatsappNumber.trim();

  if (/^https?:\/\//i.test(rawValue)) {
    if (!text) return rawValue;
    const url = new URL(rawValue);
    url.searchParams.set('text', text);
    return url.toString();
  }

  const sanitized = rawValue.replace(/\D/g, '');
  if (!text) return `https://wa.me/${sanitized}`;
  return `https://wa.me/${sanitized}?text=${encodeURIComponent(text)}`;
}
