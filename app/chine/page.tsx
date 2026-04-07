'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import FadeIn from '@/components/FadeIn';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { makeWhatsappUrl } from '@/lib/site-settings';
import { supabase } from '@/lib/supabase';

export default function ChinePage() {
  const settings = useSiteSettings();
  const [user, setUser] = useState<unknown>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const whatsappLink = makeWhatsappUrl(settings.contact.whatsappNumber, "Bonjour, je suis intéressé(e) par les études en Chine");

  return (
    <>
      <Navbar />

      {/* HEADER */}
      <section className="page-header">
        <h1>Étudier en Chine avec bourse — une opportunité stratégique pour votre avenir</h1>
        <p>Accédez à des universités de haut niveau, développez un profil international puissant et construisez des opportunités concrètes dans le commerce et le monde professionnel.</p>
      </section>

      {/* PHRASE D'IMPACT */}
      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="emotion-block" style={{ textAlign: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem' }}>Chaque année, des étudiants transforment leur avenir grâce à la Chine.</h2>
                <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)', marginTop: 16 }}>Pourquoi pas vous ?</p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
                  <Link href={user ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
                    <i className="fa-solid fa-rocket"></i> Commencer mon projet Chine
                  </Link>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                    <i className="fa-brands fa-whatsapp"></i> Parler à un conseiller
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* LES 2 OPTIONS */}
      <section className="section section-alt">
        <div className="container">
          <FadeIn>
            <div className="section-title">
              <h2>Les 2 options pour étudier en Chine</h2>
              <p>Choisissez le parcours qui correspond à votre profil</p>
              <div className="line"></div>
            </div>
          </FadeIn>
          <div className="options-grid">
            <FadeIn>
              <div className="option-card">
                <h3><i className="fa-solid fa-award" style={{ color: '#22c55e', marginRight: 8 }}></i> Bourse complète</h3>
                <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: 12 }}>Étudiez en Chine sans contrainte financière</p>
                <p>Imaginez poursuivre vos études sans payer vos frais académiques…</p>
                <h4 style={{ marginTop: 20, marginBottom: 12, fontSize: '1rem' }}>Ce que vous obtenez :</h4>
                <ul>
                  <li>Frais de scolarité entièrement pris en charge</li>
                  <li>Logement universitaire (selon programme)</li>
                  <li>Allocation mensuelle pour vos dépenses</li>
                  <li>Accès à des universités reconnues</li>
                </ul>
                <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-light)', borderRadius: 8, borderLeft: '4px solid var(--primary)' }}>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>Pour qui ?</p>
                  <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>Les étudiants motivés, sérieux, prêts à saisir une opportunité exceptionnelle.</p>
                </div>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="option-card featured">
                <div className="option-badge">Populaire</div>
                <h3><i className="fa-solid fa-star" style={{ color: '#eab308', marginRight: 8 }}></i> Bourse partielle</h3>
                <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: 12 }}>Étudiez à moindre coût et avancez concrètement</p>
                <p>Vous n'avez pas forcément le profil pour une bourse complète ? <strong>Ce n'est pas un problème.</strong></p>
                <h4 style={{ marginTop: 20, marginBottom: 12, fontSize: '1rem' }}>Ce que vous obtenez :</h4>
                <ul>
                  <li>Réduction importante des frais</li>
                  <li>Accès plus facile aux universités</li>
                  <li>Dossier plus rapide à valider</li>
                </ul>
                <div style={{ marginTop: 20, padding: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 8, borderLeft: '4px solid var(--accent)' }}>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>Pourquoi c'est puissant ?</p>
                  <p style={{ fontSize: '0.95rem' }}>Même avec une bourse partielle, le coût reste largement inférieur à celui de nombreux pays.</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* POURQUOI LA CHINE */}
      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="section-title">
              <h2>Pourquoi la Chine ?</h2>
              <p>6 raisons puissantes de choisir la Chine pour vos études</p>
              <div className="line"></div>
            </div>
          </FadeIn>

          <div className="why-china-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* 1. Profil trilingue */}
            <FadeIn>
              <div className="why-card" style={{ background: 'var(--bg-light)', borderRadius: 16, padding: 32, height: '100%' }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}><i className="fa-solid fa-language" style={{ color: 'var(--primary)' }}></i></div>
                <h3>Devenez un profil trilingue recherché</h3>
                <p>Aujourd'hui, les profils internationaux dominent le marché. En Chine, vous développez :</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0' }}>
                  <li style={{ padding: '4px 0' }}><span style={{ marginRight: 8 }}>🇫🇷</span> Votre base francophone</li>
                  <li style={{ padding: '4px 0' }}><span style={{ marginRight: 8 }}>🇬🇧</span> L'anglais académique</li>
                  <li style={{ padding: '4px 0' }}><span style={{ marginRight: 8 }}>🇨🇳</span> Le mandarin, langue stratégique mondiale</li>
                </ul>
                <p style={{ fontWeight: 700, color: 'var(--accent)', marginTop: 12 }}>Vous ne devenez pas juste diplômé… Vous devenez rare et recherché.</p>
              </div>
            </FadeIn>

            {/* 2. Commerce mondial */}
            <FadeIn>
              <div className="why-card" style={{ background: 'var(--bg-light)', borderRadius: 16, padding: 32, height: '100%' }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}><i className="fa-solid fa-globe" style={{ color: 'var(--primary)' }}></i></div>
                <h3>Au coeur du commerce mondial</h3>
                <p>La Chine est l'un des centres économiques les plus puissants du monde. Ce que cela signifie pour vous :</p>
                <ul>
                  <li>Accès direct aux fournisseurs</li>
                  <li>Compréhension du marché international</li>
                  <li>Opportunités d'import/export</li>
                </ul>
                <p style={{ fontWeight: 700, color: 'var(--accent)', marginTop: 12 }}>Beaucoup font du commerce avec la Chine sans y être allés. Vous, vous serez sur place.</p>
              </div>
            </FadeIn>

            {/* 3. Réseau international */}
            <FadeIn>
              <div className="why-card" style={{ background: 'var(--bg-light)', borderRadius: 16, padding: 32, height: '100%' }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}><i className="fa-solid fa-users" style={{ color: 'var(--primary)' }}></i></div>
                <h3>Un réseau international unique</h3>
                <p>Vous ne serez pas seul. Vous allez rencontrer des étudiants :</p>
                <ul>
                  <li>Africains</li>
                  <li>Européens</li>
                  <li>Asiatiques</li>
                  <li>Américains</li>
                </ul>
                <p style={{ fontWeight: 700, color: 'var(--accent)', marginTop: 12 }}>Vous construisez un réseau international dès vos études — opportunités professionnelles, partenariats, projets internationaux.</p>
              </div>
            </FadeIn>

            {/* 4. Formation à la pointe */}
            <FadeIn>
              <div className="why-card" style={{ background: 'var(--bg-light)', borderRadius: 16, padding: 32, height: '100%' }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}><i className="fa-solid fa-graduation-cap" style={{ color: 'var(--primary)' }}></i></div>
                <h3>Une formation à la pointe</h3>
                <p>Les universités chinoises sont aujourd'hui parmi les plus avancées. Vous bénéficiez de :</p>
                <ul>
                  <li>Infrastructures modernes</li>
                  <li>Technologies avancées</li>
                  <li>Programmes compétitifs</li>
                </ul>
                <p style={{ fontWeight: 700, color: 'var(--accent)', marginTop: 12 }}>Vous sortez avec un profil adapté au monde actuel.</p>
              </div>
            </FadeIn>

            {/* 5. Investissement intelligent */}
            <FadeIn>
              <div className="why-card" style={{ background: 'var(--bg-light)', borderRadius: 16, padding: 32, height: '100%' }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}><i className="fa-solid fa-coins" style={{ color: 'var(--primary)' }}></i></div>
                <h3>Un investissement intelligent</h3>
                <p>Contrairement à d'autres destinations, en Chine :</p>
                <ul>
                  <li>Coût de vie abordable</li>
                  <li>Études accessibles</li>
                  <li>Bourses fréquentes</li>
                </ul>
                <p style={{ fontWeight: 700, color: 'var(--accent)', marginTop: 12 }}>Vous pouvez étudier à l'international sans vous ruiner.</p>
              </div>
            </FadeIn>

            {/* 6. Accélérateur de carrière */}
            <FadeIn>
              <div className="why-card" style={{ background: 'var(--bg-light)', borderRadius: 16, padding: 32, height: '100%' }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}><i className="fa-solid fa-rocket" style={{ color: 'var(--primary)' }}></i></div>
                <h3>Un accélérateur de carrière</h3>
                <p>Étudier en Chine vous positionne comme :</p>
                <ul>
                  <li>International</li>
                  <li>Adaptable</li>
                  <li>Stratégique</li>
                </ul>
                <p style={{ fontWeight: 700, color: 'var(--accent)', marginTop: 12 }}>&quot;Cette personne peut évoluer dans un environnement global&quot; — et ça… ça vaut énormément.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* VISAS OBTENUS */}
      <section className="section section-alt">
        <div className="container">
          <FadeIn>
            <div className="section-title">
              <h2>Des visas obtenus, des rêves réalisés</h2>
              <p>Nos étudiants ont reçu leur visa pour la Chine. La preuve en images.</p>
              <div className="line"></div>
            </div>
          </FadeIn>
          <div className="gallery-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <img key={n} src={`/images/visas/visa-chine-${n}.jpeg`} alt={`Visa Chine obtenu ${n}`} />
            ))}
          </div>
        </div>
      </section>

      {/* PREUVE SOCIALE */}
      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="section-title">
              <h2>Découvrez nos étudiants déjà en Chine</h2>
              <p>Ils ont fait le choix de la Chine. Regardez leur parcours.</p>
              <div className="line"></div>
            </div>
          </FadeIn>
          <div className="videos-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="video-wrapper">
                <video controls>
                  <source src={`/videos/chine-${n}.mp4`} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section cta-urgent">
        <div className="container">
          <FadeIn>
            <div className="cta-urgency"><i className="fa-solid fa-clock"></i> Les places pour les bourses sont limitées chaque année</div>
            <h2>Vous avez maintenant une opportunité réelle d'étudier en Chine</h2>
            <p>Ne laissez pas passer cette chance. Commencez votre dossier dès aujourd'hui.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={user ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
                <i className="fa-solid fa-rocket"></i> Démarrer mon dossier
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                <i className="fa-brands fa-whatsapp"></i> Parler à un conseiller
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
