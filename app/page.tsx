'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import FadeIn from '@/components/FadeIn';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const settings = useSiteSettings();
  const [user, setUser] = useState<unknown>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge"><i className="fa-solid fa-fire"></i> {settings.home.hero.badge}</div>
            <h1 dangerouslySetInnerHTML={{ __html: settings.home.hero.title }} />
            <p className="hero-proof"><i className="fa-solid fa-circle-check"></i> {settings.home.hero.proof}</p>
            <p>{settings.home.hero.subtext}</p>
            <div className="hero-buttons">
              <Link href={user ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
                <i className={user ? 'fa-solid fa-user-circle' : 'fa-solid fa-rocket'}></i> {user ? settings.home.hero.primaryUserLabel : settings.home.hero.primaryGuestLabel}
              </Link>
              <a href="#how-it-works" className="btn btn-secondary">{settings.home.hero.secondaryLabel} <i className="fa-solid fa-arrow-down"></i></a>
            </div>
          </div>
          <div className="hero-images">
            {settings.home.hero.images.slice(0, 3).map((image, index) => (
              <img
                key={image}
                src={image}
                alt={index === 0 ? 'Étudiants Action Réussite' : index === 1 ? 'Départ aéroport' : 'Étudiants accompagnés'}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="stats" id="how-it-works">
        <div className="container">
          <FadeIn>
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-solid fa-graduation-cap"></i></div>
              <div className="stat-number">+{settings.home.stats.students}</div>
              <div className="stat-label">{settings.home.stats.studentsLabel}</div>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-solid fa-earth-americas"></i></div>
              <div className="stat-number">{settings.home.stats.countries}</div>
              <div className="stat-label">{settings.home.stats.countriesLabel}</div>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-solid fa-university"></i></div>
              <div className="stat-number">+{settings.home.stats.universities}</div>
              <div className="stat-label">{settings.home.stats.universitiesLabel}</div>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-solid fa-star"></i></div>
              <div className="stat-number">{settings.home.stats.satisfaction}%</div>
              <div className="stat-label">{settings.home.stats.satisfactionLabel}</div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section section-alt" id="destinations">
        <div className="container">
          <FadeIn>
            <div className="section-title">
              <h2>{settings.home.destinationsSection.title}</h2>
              <p>{settings.home.destinationsSection.subtitle}</p>
              <div className="line"></div>
            </div>
          </FadeIn>
          <div className="destinations-grid">
            {settings.home.destinations.map((destination, index) => (
              <FadeIn key={`${destination.name}-${index}`}>
                <div className="destination-card">
                  <div className="card-img"><img src={destination.image} alt={`Étudier en ${destination.name}`} /></div>
                  <div className="card-body">
                    <h3>{destination.name}</h3>
                    <p>{destination.description}</p>
                    <div className="card-tags">
                      <span className="card-tag tag-bourse"><i className="fa-solid fa-coins"></i> {destination.tags[0]}</span>
                      <span className="card-tag tag-rentree"><i className="fa-solid fa-calendar"></i> {destination.tags[1]}</span>
                      <span className="card-tag tag-niveau"><i className="fa-solid fa-graduation-cap"></i> {destination.tags[2]}</span>
                    </div>
                    {destination.internal ? (
                      <Link href={destination.link} className="card-link">En savoir plus <i className="fa-solid fa-arrow-right"></i></Link>
                    ) : (
                      <a href={destination.link} target="_blank" rel="noopener noreferrer" className="card-link">En savoir plus <i className="fa-solid fa-arrow-right"></i></a>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <FadeIn>
            <div className="section-title">
              <h2>{settings.home.servicesSection.title}</h2>
              <p>{settings.home.servicesSection.subtitle}</p>
              <div className="line"></div>
            </div>
          </FadeIn>
          <div className="services-grid">
            {settings.home.services.map((service, index) => (
              <FadeIn key={`${service.title}-${index}`}>
                <div className="service-card">
                  <div className="service-icon"><i className={`fa-solid ${service.icon}`}></i></div>
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="video-section">
        <div className="container">
          <FadeIn>
            <div className="section-title">
              <h2>{settings.home.videos.title}</h2>
              <p>{settings.home.videos.subtitle}</p>
              <div className="line"></div>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="videos-grid">
              {settings.home.videos.items.slice(0, 2).map((video, index) => (
                <div key={`${video.src}-${index}`} className="video-wrapper">
                  <video controls poster={video.poster}>
                    <source src={video.src} type="video/mp4" />
                  </video>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn>
            <div className="video-cta">
              <Link href={user ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
                <i className="fa-solid fa-rocket"></i> {settings.home.videos.ctaLabel}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="section-title">
              <h2>{settings.home.testimonials.title}</h2>
              <p>{settings.home.testimonials.subtitle}</p>
              <div className="line"></div>
            </div>
          </FadeIn>
          <div className="testimonials-grid">
            {settings.home.testimonials.items.map((testimonial, index) => (
              <FadeIn key={`${testimonial.country}-${index}`}>
                <div className="testimonial-card">
                  <div className="testimonial-quote">&ldquo;{testimonial.quote}&rdquo;</div>
                  <div className="testimonial-author">
                    <img src={testimonial.image} alt="Étudiant" />
                    <div>
                      <strong>Étudiant accompagné</strong>
                      <span>{testimonial.country}</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div className="gallery-grid" style={{ marginTop: 48 }}>
              {settings.home.testimonials.gallery.map((image, index) => (
                <img key={`${image}-${index}`} src={image} alt="Étudiant Action Réussite" />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="cta-section cta-urgent">
        <div className="container">
          <FadeIn>
            <h2>{settings.home.cta.title}</h2>
            <p className="cta-urgency"><i className="fa-solid fa-triangle-exclamation"></i> {settings.home.cta.urgency}</p>
            <p>{settings.home.cta.description}</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' as const }}>
              <Link href={user ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
                <i className="fa-solid fa-rocket"></i> {user ? settings.home.cta.primaryUserLabel : settings.home.cta.primaryGuestLabel}
              </Link>
              <Link href="/contact" className="btn btn-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                <i className="fa-solid fa-envelope"></i> {settings.home.cta.secondaryLabel}
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
