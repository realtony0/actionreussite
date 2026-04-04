'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import FadeIn from '@/components/FadeIn';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { enrollFormation, isEnrolled } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function FormationCanadaPage() {
  const settings = useSiteSettings();
  const [user, setUser] = useState<unknown>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        isEnrolled(settings.formationCanada.pricing.title).then(setEnrolled);
      }
    });
  }, [settings.formationCanada.pricing.title]);

  async function handleEnroll() {
    if (!user) {
      setAlert({ type: 'error', message: 'Veuillez créer un compte ou vous connecter pour vous inscrire.' });
      return;
    }

    const result = await enrollFormation(settings.formationCanada.pricing.title);
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
        <h1>{settings.formationCanada.header.title}</h1>
        <p>{settings.formationCanada.header.subtitle}</p>
      </section>

      <section className="section">
        <div className="container">
          <div className="formation-content">
            <div>
              <FadeIn>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 16 }}>{settings.formationCanada.intro.title}</h2>
                <p style={{ color: 'var(--text-medium)', lineHeight: 1.8, marginBottom: 32 }}>{settings.formationCanada.intro.body}</p>
              </FadeIn>
              <FadeIn>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>{settings.formationCanada.learning.title}</h3>
                <ul className="formation-modules">
                  {settings.formationCanada.learning.items.map((item, index) => (
                    <li key={`${item.title}-${index}`}>
                      <span className="module-num">{index + 1}</span>
                      <div>
                        <strong>{item.title}</strong><br />
                        <span style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>{item.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </FadeIn>
              <FadeIn>
                <div style={{ marginTop: 32, padding: 24, background: 'var(--bg-light)', borderRadius: 12, borderLeft: '4px solid var(--accent)' }}>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}><i className="fa-regular fa-calendar" style={{ marginRight: 8, color: 'var(--accent)' }}></i>{settings.formationCanada.session.title}</p>
                  {settings.formationCanada.session.lines.map((line) => (
                    <p key={line} style={{ color: 'var(--text-medium)' }}>{line}</p>
                  ))}
                </div>
              </FadeIn>
              <FadeIn>
                <div style={{ marginTop: 40 }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>{settings.formationCanada.includes.title}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {settings.formationCanada.includes.items.map((item) => (
                      <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'var(--bg-light)', borderRadius: 10 }}>
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
                <div style={{ background: 'var(--accent)', color: 'white', padding: '8px 16px', borderRadius: 50, display: 'inline-block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 16 }}>{settings.formationCanada.pricing.badge}</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{settings.formationCanada.pricing.title}</h3>
                <p style={{ color: 'var(--text-medium)', marginBottom: 16 }}>{settings.formationCanada.pricing.subtitle}</p>
                <div className="price">{settings.formationCanada.pricing.price}</div>
                <p className="price-note">{settings.formationCanada.pricing.note}</p>
                <div className="urgency-badge"><i className="fa-solid fa-triangle-exclamation"></i> {settings.formationCanada.pricing.urgency}</div>
                <ul>
                  {settings.formationCanada.pricing.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <div className="bonus-block">
                  <h4><i className="fa-solid fa-gift"></i> {settings.formationCanada.pricing.bonusTitle}</h4>
                  <ul>
                    {settings.formationCanada.pricing.bonus.map((bonus) => (
                      <li key={bonus.text}><i className={`fa-solid ${bonus.icon}`}></i> {bonus.text}</li>
                    ))}
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
                    <i className="fa-solid fa-circle-check"></i> {settings.formationCanada.pricing.enrolledLabel}
                  </button>
                ) : (
                  <button onClick={handleEnroll} className="btn btn-primary" style={{ marginBottom: 12, width: '100%', justifyContent: 'center' }}>
                    {settings.formationCanada.pricing.enrollLabel} <i className="fa-solid fa-arrow-right"></i>
                  </button>
                )}
                <Link href="/contact" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>{settings.formationCanada.pricing.contactLabel}</Link>
                <div className="guarantee-block"><i className="fa-solid fa-shield-halved"></i><span>{settings.formationCanada.pricing.guarantee}</span></div>
                <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center' }}><i className="fa-solid fa-lock"></i> {settings.formationCanada.pricing.paymentNote}</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <FadeIn>
            <div className="section-title">
              <h2>{settings.formationCanada.testimonials.title}</h2>
              <p>{settings.formationCanada.testimonials.subtitle}</p>
              <div className="line"></div>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="gallery-grid">
              {settings.formationCanada.testimonials.gallery.map((image, index) => (
                <img key={`${image}-${index}`} src={image} alt="Témoignage étudiant" />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn><div className="section-title"><h2>{settings.formationCanada.faq.title}</h2><div className="line"></div></div></FadeIn>
          <div style={{ maxWidth: 750, margin: '0 auto' }}>
            {settings.formationCanada.faq.items.map((faq, index) => (
              <FadeIn key={`${faq.q}-${index}`}>
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
            <h2>{settings.formationCanada.cta.title}</h2>
            <p>{settings.formationCanada.cta.description}</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' as const }}>
              <button onClick={handleEnroll} className="btn btn-primary btn-lg"><i className="fa-solid fa-graduation-cap"></i> {settings.formationCanada.cta.enrollLabel}</button>
              <Link href="/contact" className="btn btn-outline">{settings.formationCanada.cta.contactLabel}</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
