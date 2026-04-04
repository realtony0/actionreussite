'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import FadeIn from '@/components/FadeIn';
import { supabase } from '@/lib/supabase';

export default function CanadaPage() {
  const [user, setUser] = useState<unknown>(null);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  return (
    <>
      <Navbar />
      <section className="page-header">
        <h1>Étudier au Canada</h1>
        <p>Avec ou sans assistance, réalisez votre rêve d&apos;étudier au Canada grâce à Action Réussite</p>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="emotion-block">
              <div className="emotion-left">
                <h2>Vous êtes perdu dans les démarches ?</h2>
                <p>Vous pouvez faire votre projet seul et économiser des millions. Ou vous pouvez nous confier l&apos;intégralité de vos démarches et partir l&apos;esprit tranquille.</p>
                <p><strong>Dans les deux cas, nous avons la solution pour vous.</strong></p>
              </div>
              <div className="emotion-right">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th><i className="fa-solid fa-handshake"></i> Accompagnement</th>
                      <th className="highlight-col"><i className="fa-solid fa-book-open"></i> Formation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Coût</td><td>Élevé</td><td className="highlight-col">Réduit</td></tr>
                    <tr><td>Autonomie</td><td>Dépendance</td><td className="highlight-col">Totale</td></tr>
                    <tr><td>Rapidité</td><td>Temps long</td><td className="highlight-col">Rapide</td></tr>
                    <tr><td>Apprentissage</td><td>Limité</td><td className="highlight-col">Complet</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <FadeIn><div className="section-title"><h2>Choisissez votre formule</h2><p>Deux options adaptées à vos besoins et à votre budget</p><div className="line"></div></div></FadeIn>
          <div className="options-grid">
            <FadeIn>
              <div className="option-card">
                <h3><i className="fa-solid fa-handshake" style={{ color: 'var(--accent)', marginRight: 8 }}></i> Accompagnement complet</h3>
                <p>Nous prenons en charge l&apos;intégralité de vos démarches pour étudier au Canada.</p>
                <ul>
                  <li>Choix de l&apos;école et du programme</li>
                  <li>Montage complet du dossier d&apos;admission</li>
                  <li>Demande de CAQ</li>
                  <li>Demande de permis d&apos;étude</li>
                  <li>Préparation à l&apos;entretien consulaire</li>
                  <li>Suivi jusqu&apos;au départ</li>
                </ul>
                <br />
                <Link href={user ? '/dashboard' : '/register'} className="btn btn-primary">
                  <i className={user ? 'fa-solid fa-user-circle' : 'fa-solid fa-rocket'}></i> {user ? 'Accéder à mon espace' : 'Démarrer mon projet Canada'}
                </Link>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="option-card featured">
                <div className="option-badge">NOUVEAU</div>
                <h3><i className="fa-solid fa-book-open" style={{ color: 'var(--accent)', marginRight: 8 }}></i> Formation autonome</h3>
                <p>Apprenez à faire vous-même toutes vos démarches pour le Canada.</p>
                <ul>
                  <li>Formation complète en ligne</li>
                  <li>Guides PDF détaillés étape par étape</li>
                  <li>Assistance pendant toute la formation</li>
                  <li>Session questions / réponses en direct</li>
                  <li>Accès immédiat après inscription</li>
                  <li>Mises à jour incluses</li>
                </ul>
                <br />
                <Link href="/formation-canada" className="btn btn-primary">Découvrir la formation <i className="fa-solid fa-arrow-right"></i></Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <FadeIn><div className="section-title"><h2>Formation spéciale — Étudier au Canada seul</h2><p>Tout ce que vous devez savoir pour réussir vos démarches en toute autonomie</p><div className="line"></div></div></FadeIn>
          <div className="formation-content">
            <FadeIn>
              <ul className="formation-modules">
                {['Comment choisir son école au Canada', 'Comment monter son dossier d\'admission', 'Comment faire sa demande de CAQ', 'Comment faire sa demande de permis d\'étude', 'Conseils pour augmenter ses chances d\'acceptation'].map((m, i) => (
                  <li key={i}><span className="module-num">{i + 1}</span><span>{m}</span></li>
                ))}
              </ul>
              <div style={{ marginTop: 32, padding: 24, background: 'white', borderRadius: 12, borderLeft: '4px solid var(--primary)' }}>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}><i className="fa-regular fa-calendar" style={{ marginRight: 8, color: 'var(--accent)' }}></i>Prochaine session : Fin juillet 2026</p>
                <p style={{ color: 'var(--text-medium)' }}>Durée : 1 semaine intensive — Places limitées</p>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="pricing-card">
                <h3>S&apos;inscrire à la formation</h3>
                <p style={{ color: 'var(--text-medium)', margin: '8px 0 0' }}>Formation complète Canada</p>
                <div className="price">Inscription ouverte</div>
                <p className="price-note">Paiement en ligne sécurisé</p>
                <ul>
                  <li>Accès à la formation complète</li>
                  <li>Support PDF téléchargeables</li>
                  <li>Assistance pendant la formation</li>
                  <li>Session questions / réponses</li>
                  <li>Accès immédiat après paiement</li>
                </ul>
                <Link href="/formation-canada" className="btn btn-primary">S&apos;inscrire maintenant <i className="fa-solid fa-arrow-right"></i></Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <FadeIn>
            <h2>Des questions sur le Canada ?</h2>
            <p>Notre équipe est disponible pour vous orienter vers la meilleure option selon votre profil.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' as const }}>
              <Link href="/contact" className="btn btn-primary btn-lg"><i className="fa-solid fa-envelope"></i> Nous envoyer un message</Link>
              <a href="https://wa.me/2250779289599?text=Bonjour%2C%20j'ai%20des%20questions%20sur%20les%20études%20au%20Canada" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp"><i className="fa-brands fa-whatsapp"></i> Ou via WhatsApp</a>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
