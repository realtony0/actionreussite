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

export default function CanadaPage() {
  const settings = useSiteSettings();
  const [user, setUser] = useState<unknown>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <>
      <Navbar />
      <section className="page-header">
        <h1>{settings.canada.header.title}</h1>
        <p>{settings.canada.header.subtitle}</p>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="emotion-block">
              <div className="emotion-left">
                <h2>{settings.canada.emotion.title}</h2>
                <p>{settings.canada.emotion.body1}</p>
                <p><strong>{settings.canada.emotion.body2}</strong></p>
              </div>
              <div className="emotion-right">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th><i className="fa-solid fa-handshake"></i> {settings.canada.comparison.accompanimentLabel}</th>
                      <th className="highlight-col"><i className="fa-solid fa-book-open"></i> {settings.canada.comparison.formationLabel}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings.canada.comparison.rows.map((row) => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        <td>{row.left}</td>
                        <td className="highlight-col">{row.right}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <FadeIn>
            <div className="section-title">
              <h2>{settings.canada.options.title}</h2>
              <p>{settings.canada.options.subtitle}</p>
              <div className="line"></div>
            </div>
          </FadeIn>
          <div className="options-grid">
            <FadeIn>
              <div className="option-card">
                <h3><i className="fa-solid fa-handshake" style={{ color: 'var(--accent)', marginRight: 8 }}></i> {settings.canada.options.accompaniment.title}</h3>
                <p>{settings.canada.options.accompaniment.description}</p>
                <ul>
                  {settings.canada.options.accompaniment.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <br />
                <Link href={user ? '/dashboard' : '/register'} className="btn btn-primary">
                  <i className={user ? 'fa-solid fa-user-circle' : 'fa-solid fa-rocket'}></i> {user ? settings.canada.options.accompaniment.userCtaLabel : settings.canada.options.accompaniment.guestCtaLabel}
                </Link>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="option-card featured">
                <div className="option-badge">{settings.canada.options.formation.badge}</div>
                <h3><i className="fa-solid fa-book-open" style={{ color: 'var(--accent)', marginRight: 8 }}></i> {settings.canada.options.formation.title}</h3>
                <p>{settings.canada.options.formation.description}</p>
                <ul>
                  {settings.canada.options.formation.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <br />
                <Link href="/formation-canada" className="btn btn-primary">{settings.canada.options.formation.ctaLabel} <i className="fa-solid fa-arrow-right"></i></Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <FadeIn>
            <div className="section-title">
              <h2>{settings.canada.training.title}</h2>
              <p>{settings.canada.training.subtitle}</p>
              <div className="line"></div>
            </div>
          </FadeIn>
          <div className="formation-content">
            <FadeIn>
              <ul className="formation-modules">
                {settings.canada.training.modules.map((module, index) => (
                  <li key={module}><span className="module-num">{index + 1}</span><span>{module}</span></li>
                ))}
              </ul>
              <div style={{ marginTop: 32, padding: 24, background: 'white', borderRadius: 12, borderLeft: '4px solid var(--primary)' }}>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}><i className="fa-regular fa-calendar" style={{ marginRight: 8, color: 'var(--accent)' }}></i>{settings.canada.training.sessionTitle}</p>
                <p style={{ color: 'var(--text-medium)' }}>{settings.canada.training.sessionSubtitle}</p>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="pricing-card">
                <h3>{settings.canada.training.pricingTitle}</h3>
                <p style={{ color: 'var(--text-medium)', margin: '8px 0 0' }}>{settings.canada.training.pricingSubtitle}</p>
                <div className="price">{settings.canada.training.pricingStatus}</div>
                <p className="price-note">{settings.canada.training.pricingNote}</p>
                <ul>
                  {settings.canada.training.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link href="/formation-canada" className="btn btn-primary">{settings.canada.training.ctaLabel} <i className="fa-solid fa-arrow-right"></i></Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <FadeIn>
            <h2>{settings.canada.cta.title}</h2>
            <p>{settings.canada.cta.description}</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' as const }}>
              <Link href="/contact" className="btn btn-primary btn-lg"><i className="fa-solid fa-envelope"></i> {settings.canada.cta.contactLabel}</Link>
              <a
                href={makeWhatsappUrl(settings.contact.whatsappNumber, settings.canada.cta.whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <i className="fa-brands fa-whatsapp"></i> {settings.canada.cta.whatsappLabel}
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
