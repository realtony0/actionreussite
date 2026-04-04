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
import { submitRequest, getCurrentUser } from '@/lib/auth';

export default function ContactPage() {
  const settings = useSiteSettings();
  const [user, setUser] = useState<{ first_name: string; last_name: string; phone: string } | null>(null);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => {
    getCurrentUser().then((profile) => setUser(profile as typeof user));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const destination = (form.elements.namedItem('destination') as HTMLSelectElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      setAlert({ type: 'error', message: 'Veuillez créer un compte ou vous connecter pour envoyer un message.' });
      return;
    }

    const result = await submitRequest({ type: 'contact', subject: 'Message — ' + destination, message, destination });
    if (result.success) {
      setAlert({ type: 'success', message: 'Message envoyé avec succès !' });
      (form.elements.namedItem('message') as HTMLTextAreaElement).value = '';
    }
  }

  return (
    <>
      <Navbar />
      <section className="page-header"><h1>{settings.contact.pageTitle}</h1><p>{settings.contact.pageSubtitle}</p></section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <FadeIn><h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>{settings.contact.introTitle}</h2></FadeIn>
              <FadeIn><p style={{ color: 'var(--text-medium)', marginBottom: 32, lineHeight: 1.7 }}>{settings.contact.introBody}</p></FadeIn>
              <FadeIn><a href={makeWhatsappUrl(settings.contact.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="contact-info-card"><div className="icon"><i className="fa-brands fa-whatsapp"></i></div><div><h4>WhatsApp</h4><p>{settings.contact.phone}</p></div></a></FadeIn>
              <FadeIn><a href={`tel:${settings.contact.phone.replace(/[^\d+]/g, '')}`} className="contact-info-card"><div className="icon"><i className="fa-solid fa-phone"></i></div><div><h4>Téléphone</h4><p>{settings.contact.phone}</p></div></a></FadeIn>
              <FadeIn><div className="contact-info-card"><div className="icon"><i className="fa-solid fa-location-dot"></i></div><div><h4>Adresse</h4><p>{settings.contact.address}</p></div></div></FadeIn>
              <FadeIn><div style={{ marginTop: 24 }}><a href={makeWhatsappUrl(settings.contact.whatsappNumber, 'Bonjour, je souhaite parler maintenant à un conseiller')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg" style={{ width: '100%', justifyContent: 'center' }}><i className="fa-brands fa-whatsapp"></i> {settings.contact.talkNowButton}</a></div></FadeIn>
              <FadeIn>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 32, marginBottom: 16 }}>{settings.contact.directTeamTitle}</h3>
                <div className="team-contacts">
                  {settings.teamContacts.map((member, index) => (
                    <a key={`${member.name}-${index}`} href={member.link} target="_blank" rel="noopener noreferrer" className="contact-info-card">
                      <div className="icon" style={{ background: 'rgba(37,211,102,0.15)' }}><i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i></div>
                      <div><h4>{member.name}</h4><p>{member.role}</p></div>
                    </a>
                  ))}
                </div>
              </FadeIn>
              <FadeIn>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 32, marginBottom: 16 }}>{settings.contact.socialsTitle}</h3>
                <div className="social-grid">
                  {settings.socialLinks.map((social) => (
                    <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" className={`social-link ${social.className}`}>
                      <i className={`fa-brands ${social.icon}`}></i> {social.label}
                    </a>
                  ))}
                </div>
              </FadeIn>
            </div>
            <FadeIn>
              <div className="contact-form">
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>{settings.contact.formTitle}</h3>
                {alert && <div className={`auth-alert auth-alert-${alert.type}`}>{alert.type === 'error' && !user ? <><i className="fa-solid fa-user-lock"></i> {alert.message} <Link href="/register" style={{ color: 'var(--accent-dark)', fontWeight: 700, textDecoration: 'underline' }}>Créer un compte</Link></> : <><i className="fa-solid fa-circle-check"></i> {alert.message}</>}</div>}
                <form onSubmit={handleSubmit}>
                  {!user && <><div className="form-group"><label>Nom complet</label><input type="text" name="name" placeholder="Votre nom et prénom" required /></div><div className="form-group"><label>Téléphone</label><input type="tel" name="phone" placeholder="+225 XX XX XX XX XX" required /></div></>}
                  <div className="form-group">
                    <label>Destination souhaitée</label>
                    <select name="destination" required>
                      <option value="" disabled>Choisissez</option>
                      {[...settings.home.destinations.map((destination) => destination.name.split(' ')[0]), 'Autre'].map((destination) => <option key={destination} value={destination}>{destination}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Votre message</label><textarea name="message" placeholder="Décrivez votre projet d'étude..." rows={5} required></textarea></div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}><i className="fa-solid fa-paper-plane"></i> Envoyer mon message</button>
                </form>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <FadeIn><div className="section-title"><h2>{settings.contact.mapTitle}</h2><p>{settings.contact.mapSubtitle}</p><div className="line"></div></div></FadeIn>
          <FadeIn><div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)', height: 400 }}><iframe src={settings.contact.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe></div></FadeIn>
        </div>
      </section>

      <section className="cta-section">
        <div className="container"><FadeIn><h2>{settings.contact.bottomCtaTitle}</h2><p>{settings.contact.bottomCtaBody}</p><a href={makeWhatsappUrl(settings.contact.whatsappNumber, 'Bonjour, je souhaite des informations sur vos services')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp"><i className="fa-brands fa-whatsapp"></i> {settings.contact.bottomCtaButton}</a></FadeIn></div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
