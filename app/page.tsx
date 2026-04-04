'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import FadeIn from '@/components/FadeIn';
import { getSiteSettings } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [settings, setSettings] = useState<Record<string, string | string[]>>({});
  const [user, setUser] = useState<unknown>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings);
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const s = settings;

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge"><i className="fa-solid fa-fire"></i> {(s.heroBadge as string) || 'Rentrée Septembre 2026 — Places limitées'}</div>
            <h1 dangerouslySetInnerHTML={{ __html: (s.heroTitle as string) || "Bourse + admission + visa en 60 jours grâce à <span>ACTION RÉUSSITE</span>" }} />
            <p className="hero-proof"><i className="fa-solid fa-circle-check"></i> {(s.heroProof as string) || '+229 étudiants déjà envoyés à l\'étranger depuis 2017'}</p>
            <p>Nous prenons en charge votre projet d&apos;études de A à Z : choix de pays, admission, visa et départ. Selon votre profil, en 60 jours vous pouvez tout obtenir.</p>
            <div className="hero-buttons">
              <Link href={user ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
                <i className={user ? 'fa-solid fa-user-circle' : 'fa-solid fa-rocket'}></i> {user ? 'Accéder à mon espace' : 'Démarrer mon projet'}
              </Link>
              <a href="#how-it-works" className="btn btn-secondary">Voir comment ça marche <i className="fa-solid fa-arrow-down"></i></a>
            </div>
          </div>
          <div className="hero-images">
            <img src={(s.heroImages as string[])?.[0] || '/images/photo-1.jpeg'} alt="Étudiants Action Réussite" />
            <img src={(s.heroImages as string[])?.[1] || '/images/photo-2.jpeg'} alt="Départ aéroport" />
            <img src={(s.heroImages as string[])?.[2] || '/images/photo-3.jpeg'} alt="Étudiants accompagnés" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats" id="how-it-works">
        <div className="container">
          <FadeIn>
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-solid fa-graduation-cap"></i></div>
              <div className="stat-number">+{(s.statEtudiants as string) || '229'}</div>
              <div className="stat-label">Étudiants envoyés à l&apos;étranger</div>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-solid fa-earth-americas"></i></div>
              <div className="stat-number">{(s.statPays as string) || '6'}</div>
              <div className="stat-label">Pays de destination couverts</div>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-solid fa-university"></i></div>
              <div className="stat-number">+52</div>
              <div className="stat-label">Universités partenaires</div>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-solid fa-star"></i></div>
              <div className="stat-number">{(s.statSatisfaction as string) || '98'}%</div>
              <div className="stat-label">Taux de satisfaction client</div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="section section-alt" id="destinations">
        <div className="container">
          <FadeIn>
            <div className="section-title">
              <h2>Choisissez votre destination d&apos;étude</h2>
              <p>Nous vous accompagnons vers les meilleures universités à travers le monde</p>
              <div className="line"></div>
            </div>
          </FadeIn>
          <div className="destinations-grid">
            {[
              { name: 'Chine 🇨🇳', img: (s.destChine as string) || '/images/photo-36.jpeg', desc: '+52 universités partenaires, accompagnement complet de A à Z.', link: 'https://wa.me/2250779289599?text=Bonjour%2C%20je%20suis%20intéressé(e)%20par%20les%20études%20en%20Chine', tags: ['Bourses disponibles', 'Rentrée Sept. 2026', 'Licence / Master'] },
              { name: 'Canada 🇨🇦', img: (s.destCanada as string) || '/images/photo-5.jpeg', desc: 'Études + travail, immigration possible. Formation ou accompagnement complet.', link: '/canada', internal: true, tags: ['Bourses disponibles', 'Rentrée Sept. 2026', 'Licence / Master'] },
              { name: 'Inde 🇮🇳', img: (s.destInde as string) || '/images/photo-6.jpeg', desc: 'Programmes accessibles, universités reconnues internationalement.', link: 'https://wa.me/2250779289599?text=Bonjour%2C%20je%20suis%20intéressé(e)%20par%20les%20études%20en%20Inde', tags: ['Bourses disponibles', 'Rentrée Sept. 2026', 'Licence / Master / Doctorat'] },
              { name: 'Turquie 🇹🇷', img: (s.destTurquie as string) || '/images/photo-7.jpeg', desc: 'Bourses turques généreuses et admission dans des universités de qualité.', link: 'https://wa.me/2250779289599?text=Bonjour%2C%20je%20suis%20intéressé(e)%20par%20les%20études%20en%20Turquie', tags: ['Bourses disponibles', 'Rentrée Sept. 2026', 'Licence / Master'] },
              { name: 'Maroc 🇲🇦', img: (s.destMaroc as string) || '/images/photo-35.jpeg', desc: 'Études francophones de qualité à coût accessible.', link: 'https://wa.me/2250779289599?text=Bonjour%2C%20je%20suis%20intéressé(e)%20par%20les%20études%20au%20Maroc', tags: ['Coût accessible', 'Rentrée Sept. 2026', 'Licence / Master'] },
              { name: 'France 🇫🇷', img: (s.destFrance as string) || '/images/photo-34.jpeg', desc: 'Campus France, bourses et admission dans les universités françaises.', link: 'https://wa.me/2250779289599?text=Bonjour%2C%20je%20suis%20intéressé(e)%20par%20les%20études%20en%20France', tags: ['Bourses disponibles', 'Rentrée Sept. 2026', 'Licence / Master'] },
            ].map((dest, i) => (
              <FadeIn key={i}>
                <div className="destination-card">
                  <div className="card-img"><img src={dest.img} alt={`Étudier en ${dest.name}`} /></div>
                  <div className="card-body">
                    <h3>{dest.name}</h3>
                    <p>{dest.desc}</p>
                    <div className="card-tags">
                      <span className="card-tag tag-bourse"><i className="fa-solid fa-coins"></i> {dest.tags[0]}</span>
                      <span className="card-tag tag-rentree"><i className="fa-solid fa-calendar"></i> {dest.tags[1]}</span>
                      <span className="card-tag tag-niveau"><i className="fa-solid fa-graduation-cap"></i> {dest.tags[2]}</span>
                    </div>
                    {dest.internal ? (
                      <Link href={dest.link} className="card-link">En savoir plus <i className="fa-solid fa-arrow-right"></i></Link>
                    ) : (
                      <a href={dest.link} target="_blank" rel="noopener noreferrer" className="card-link">En savoir plus <i className="fa-solid fa-arrow-right"></i></a>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="container">
          <FadeIn>
            <div className="section-title">
              <h2>Ce que vous gagnez avec nous</h2>
              <p>Chaque service est conçu pour maximiser vos chances de réussite</p>
              <div className="line"></div>
            </div>
          </FadeIn>
          <div className="services-grid">
            {[
              { icon: 'fa-graduation-cap', title: 'Nous trouvons la bourse idéale pour vous', desc: 'Selon votre profil et votre destination, nous identifions les meilleures opportunités de financement et montons votre dossier de candidature.' },
              { icon: 'fa-file-lines', title: 'Nous vous ouvrons les portes des universités', desc: 'Choix stratégique d\'université, montage complet du dossier, lettres de motivation percutantes et suivi jusqu\'à l\'acceptation.' },
              { icon: 'fa-passport', title: 'Nous maximisons vos chances d\'obtenir votre visa', desc: 'Préparation minutieuse de votre dossier consulaire, simulation d\'entretien et accompagnement jusqu\'à l\'obtention du visa.' },
              { icon: 'fa-plane-departure', title: 'Vous partez l\'esprit tranquille', desc: 'Billets d\'avion, logement, orientation à l\'arrivée — nous gérons tout pour que vous n\'ayez qu\'à vous concentrer sur vos études.' },
            ].map((svc, i) => (
              <FadeIn key={i}>
                <div className="service-card">
                  <div className="service-icon"><i className={`fa-solid ${svc.icon}`}></i></div>
                  <div>
                    <h3>{svc.title}</h3>
                    <p>{svc.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section className="video-section">
        <div className="container">
          <FadeIn>
            <div className="section-title">
              <h2>Regardez comment nos étudiants partent réellement</h2>
              <p>Ce ne sont pas des promesses — ce sont des résultats. Voyez par vous-même.</p>
              <div className="line"></div>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="videos-grid">
              <div className="video-wrapper">
                <video controls poster="/images/photo-10.jpeg">
                  <source src="/videos/temoignage.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="video-wrapper">
                <video controls poster="/images/photo-30.jpeg">
                  <source src="/videos/temoignage-2.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="video-cta">
              <Link href={user ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
                <i className="fa-solid fa-rocket"></i> Je veux être le prochain
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="section-title">
              <h2>Nos étudiants témoignent</h2>
              <p>Ils ont fait confiance à Action Réussite — voici leurs histoires</p>
              <div className="line"></div>
            </div>
          </FadeIn>
          <div className="testimonials-grid">
            {[
              { quote: "Grâce à ACTION RÉUSSITE, j'ai obtenu mon visa et ma bourse pour la Chine en moins de 2 mois !", img: '/images/photo-11.jpeg', country: 'Chine 🇨🇳' },
              { quote: "Je ne savais pas par où commencer. L'équipe m'a guidé du début à la fin. Aujourd'hui je suis au Canada !", img: '/images/photo-12.jpeg', country: 'Canada 🇨🇦' },
              { quote: "ACTION RÉUSSITE m'a trouvé une bourse complète. Je recommande à 100% !", img: '/images/photo-13.jpeg', country: 'Turquie 🇹🇷' },
            ].map((t, i) => (
              <FadeIn key={i}>
                <div className="testimonial-card">
                  <div className="testimonial-quote">&ldquo;{t.quote}&rdquo;</div>
                  <div className="testimonial-author">
                    <img src={t.img} alt="Étudiant" />
                    <div>
                      <strong>Étudiant accompagné</strong>
                      <span>{t.country}</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div className="gallery-grid" style={{ marginTop: 48 }}>
              {[14, 15, 16, 17, 18, 30, 31, 32].map(n => (
                <img key={n} src={`/images/photo-${n}.jpeg`} alt="Étudiant Action Réussite" />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section cta-urgent">
        <div className="container">
          <FadeIn>
            <h2>Lancez votre projet dès aujourd&apos;hui</h2>
            <p className="cta-urgency"><i className="fa-solid fa-triangle-exclamation"></i> Places limitées pour les prochaines sessions — Rentrée Septembre 2026</p>
            <p>Ne laissez pas passer cette opportunité. Chaque jour compte pour préparer votre dossier.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' as const }}>
              <Link href={user ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
                <i className="fa-solid fa-rocket"></i> {user ? 'Mon espace personnel' : 'Créer mon compte gratuitement'}
              </Link>
              <Link href="/contact" className="btn btn-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                <i className="fa-solid fa-envelope"></i> Nous contacter
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
