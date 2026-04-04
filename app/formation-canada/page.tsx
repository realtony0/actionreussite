'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import FadeIn from '@/components/FadeIn';
import { supabase } from '@/lib/supabase';
import { enrollFormation, isEnrolled } from '@/lib/auth';

export default function FormationCanadaPage() {
  const router = useRouter();
  const [user, setUser] = useState<unknown>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        isEnrolled('Formation Canada').then(setEnrolled);
      }
    });
  }, []);

  async function handleEnroll() {
    if (!user) {
      setAlert({ type: 'error', message: 'Veuillez créer un compte ou vous connecter pour vous inscrire.' });
      return;
    }
    const result = await enrollFormation('Formation Canada');
    if (result.success) {
      setAlert({ type: 'success', message: 'Inscription enregistrée ! Consultez votre espace personnel pour le suivi.' });
      setEnrolled(true);
    } else {
      setAlert({ type: 'error', message: result.message || 'Erreur' });
    }
  }

  return (
    <>
      <Navbar />
      <section className="page-header">
        <h1>Devenez autonome dans votre projet d&apos;étude au Canada</h1>
        <p>Évitez les erreurs, économisez de l&apos;argent et maîtrisez toutes les étapes</p>
      </section>

      <section className="section">
        <div className="container">
          <div className="formation-content">
            <div>
              <FadeIn>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 16 }}>Pourquoi cette formation ?</h2>
                <p style={{ color: 'var(--text-medium)', lineHeight: 1.8, marginBottom: 32 }}>
                  Chaque année, des centaines d&apos;étudiants échouent dans leurs démarches pour le Canada à cause d&apos;erreurs évitables.
                  Cette formation vous donne toutes les clés pour réussir par vous-même, étape par étape, sans intermédiaire.
                </p>
              </FadeIn>
              <FadeIn>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>Ce que vous allez apprendre :</h3>
                <ul className="formation-modules">
                  {[
                    { title: 'Comment choisir son école', desc: 'Critères de sélection, écoles DLI, programmes adaptés à votre profil' },
                    { title: 'Comment monter son dossier', desc: 'Documents requis, lettres de motivation, relevés, traductions' },
                    { title: 'Comment faire sa demande de CAQ', desc: 'Procédure complète pour le Certificat d\'acceptation du Québec' },
                    { title: 'Comment faire sa demande de permis d\'étude', desc: 'Formulaires, biométrie, preuve financière, soumission en ligne' },
                    { title: 'Conseils pour augmenter ses chances', desc: 'Erreurs fréquentes à éviter, astuces de pros, retours d\'expérience' },
                  ].map((m, i) => (
                    <li key={i}>
                      <span className="module-num">{i + 1}</span>
                      <div>
                        <strong>{m.title}</strong><br />
                        <span style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>{m.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </FadeIn>
              <FadeIn>
                <div style={{ marginTop: 32, padding: 24, background: 'var(--bg-light)', borderRadius: 12, borderLeft: '4px solid var(--accent)' }}>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}><i className="fa-regular fa-calendar" style={{ marginRight: 8, color: 'var(--accent)' }}></i>Prochaine session : Fin juillet 2026</p>
                  <p style={{ color: 'var(--text-medium)' }}>Durée : 1 semaine intensive de formation</p>
                  <p style={{ color: 'var(--text-medium)' }}>Format : En ligne — accessible depuis partout</p>
                </div>
              </FadeIn>
              <FadeIn>
                <div style={{ marginTop: 40 }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>Ce qui est inclus :</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[
                      { icon: 'fa-video', text: 'Accès à la formation complète' },
                      { icon: 'fa-file-pdf', text: 'Support PDF téléchargeables' },
                      { icon: 'fa-headset', text: 'Assistance pendant la formation' },
                      { icon: 'fa-microphone', text: 'Session questions / réponses' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'var(--bg-light)', borderRadius: 10 }}>
                        <span style={{ fontSize: '1.2rem', color: 'var(--accent)', width: 24, textAlign: 'center' }}><i className={`fa-solid ${item.icon}`}></i></span>
                        <span style={{ fontWeight: 600 }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>

            <FadeIn>
              <div className="pricing-card">
                <div style={{ background: 'var(--accent)', color: 'white', padding: '8px 16px', borderRadius: 50, display: 'inline-block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 16 }}>PLACES LIMITÉES</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: 4 }}>Formation Canada</h3>
                <p style={{ color: 'var(--text-medium)', marginBottom: 16 }}>Toutes les démarches de A à Z</p>
                <div className="price">50 000 FCFA</div>
                <p className="price-note">Paiement en ligne sécurisé — Accès immédiat</p>
                <div className="urgency-badge"><i className="fa-solid fa-triangle-exclamation"></i> Places limitées — Session juillet 2026</div>
                <ul>
                  <li>Formation complète (1 semaine)</li>
                  <li>Supports PDF détaillés</li>
                  <li>Assistance personnalisée</li>
                  <li>Session Q&amp;A en direct</li>
                  <li>Accès immédiat après paiement</li>
                </ul>
                <div className="bonus-block">
                  <h4><i className="fa-solid fa-gift"></i> Bonus inclus :</h4>
                  <ul>
                    <li><i className="fa-solid fa-file-pdf"></i> Modèles PDF prêts à l&apos;emploi</li>
                    <li><i className="fa-solid fa-list-check"></i> Liste des écoles recommandées</li>
                    <li><i className="fa-solid fa-lightbulb"></i> Astuces visa exclusives</li>
                  </ul>
                </div>
                {alert && (
                  <div className={`auth-alert auth-alert-${alert.type}`}>
                    {alert.type === 'success' ? <><i className="fa-solid fa-circle-check"></i> {alert.message} <Link href="/dashboard" style={{ color: 'var(--success)', fontWeight: 700 }}>Mon espace</Link></> : alert.message}
                    {alert.type === 'error' && !user && <> <Link href="/register" style={{ color: 'var(--accent-dark)', fontWeight: 700, textDecoration: 'underline' }}>Créer un compte</Link> ou <Link href="/login" style={{ color: 'var(--accent-dark)', fontWeight: 700, textDecoration: 'underline' }}>se connecter</Link></>}
                  </div>
                )}
                {enrolled ? (
                  <button className="btn btn-outline" style={{ marginBottom: 12, width: '100%', justifyContent: 'center', pointerEvents: 'none', opacity: 0.8 }}>
                    <i className="fa-solid fa-circle-check"></i> Vous êtes inscrit
                  </button>
                ) : (
                  <button onClick={handleEnroll} className="btn btn-primary" style={{ marginBottom: 12, width: '100%', justifyContent: 'center' }}>
                    S&apos;inscrire maintenant <i className="fa-solid fa-arrow-right"></i>
                  </button>
                )}
                <Link href="/contact" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Poser une question</Link>
                <div className="guarantee-block"><i className="fa-solid fa-shield-halved"></i><span>Satisfait ou remboursé sous 7 jours</span></div>
                <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center' }}><i className="fa-solid fa-lock"></i> Paiement 100% sécurisé</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <FadeIn><div className="section-title"><h2>Ils nous font confiance</h2><p>Découvrez les témoignages de nos étudiants accompagnés avec succès</p><div className="line"></div></div></FadeIn>
          <FadeIn>
            <div className="gallery-grid">
              {[19, 20, 21, 22].map(n => <img key={n} src={`/images/photo-${n}.jpeg`} alt="Témoignage étudiant" />)}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn><div className="section-title"><h2>Questions fréquentes</h2><div className="line"></div></div></FadeIn>
          <div style={{ maxWidth: 750, margin: '0 auto' }}>
            {[
              { q: 'La formation est-elle accessible en ligne ?', a: 'Oui, la formation est 100% en ligne. Vous pouvez y accéder depuis n\'importe quel pays.' },
              { q: 'Quand commence la prochaine session ?', a: 'La prochaine session est prévue pour fin juillet 2026. La durée est d\'une semaine intensive.' },
              { q: 'Comment se fait le paiement ?', a: 'Le paiement se fait en ligne de manière sécurisée. L\'accès est immédiat après paiement.' },
              { q: 'Y a-t-il un accompagnement pendant la formation ?', a: 'Oui, vous bénéficiez d\'une assistance pendant toute la durée de la formation ainsi que de sessions questions/réponses en direct.' },
              { q: 'Est-ce que je peux réussir sans vous ?', a: 'Oui, c\'est justement l\'objectif de cette formation : vous rendre 100% autonome.' },
              { q: 'Combien de temps ça prend ?', a: 'La formation dure 1 semaine intensive. Ensuite, les démarches complètes peuvent prendre entre 2 et 4 mois.' },
              { q: 'Quel budget prévoir pour étudier au Canada ?', a: 'Le budget varie selon l\'école. En moyenne, prévoyez entre 3 et 8 millions FCFA.' },
              { q: 'Y a-t-il une garantie ?', a: 'Oui ! Satisfait ou remboursé sous 7 jours. Aucun risque pour vous.' },
            ].map((faq, i) => (
              <FadeIn key={i}>
                <div style={{ padding: 24, background: 'var(--bg-light)', borderRadius: 12, marginBottom: 16 }}>
                  <h4 style={{ marginBottom: 8 }}>{faq.q}</h4>
                  <p style={{ color: 'var(--text-medium)' }}>{faq.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <FadeIn>
            <h2>Ne manquez pas cette opportunité</h2>
            <p>Inscrivez-vous maintenant et prenez le contrôle de votre avenir au Canada.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' as const }}>
              <button onClick={handleEnroll} className="btn btn-primary btn-lg"><i className="fa-solid fa-graduation-cap"></i> S&apos;inscrire à la formation</button>
              <Link href="/contact" className="btn btn-outline">Nous contacter</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
