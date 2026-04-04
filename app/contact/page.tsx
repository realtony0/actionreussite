'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import FadeIn from '@/components/FadeIn';
import { supabase } from '@/lib/supabase';
import { submitRequest, getCurrentUser } from '@/lib/auth';

export default function ContactPage() {
  const [user, setUser] = useState<{ first_name: string; last_name: string; phone: string } | null>(null);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => {
    getCurrentUser().then((u) => setUser(u as typeof user));
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
      <section className="page-header"><h1>Contactez-nous</h1><p>Notre équipe est disponible pour répondre à toutes vos questions</p></section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <FadeIn><h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>Parlons de votre projet</h2></FadeIn>
              <FadeIn><p style={{ color: 'var(--text-medium)', marginBottom: 32, lineHeight: 1.7 }}>Que vous souhaitiez étudier en Chine, au Canada ou ailleurs, nous sommes là pour vous accompagner.</p></FadeIn>
              <FadeIn><a href="https://wa.me/2250779289599" target="_blank" rel="noopener noreferrer" className="contact-info-card"><div className="icon"><i className="fa-brands fa-whatsapp"></i></div><div><h4>WhatsApp</h4><p>+225 07 79 28 95 99</p></div></a></FadeIn>
              <FadeIn><a href="tel:+2250779289599" className="contact-info-card"><div className="icon"><i className="fa-solid fa-phone"></i></div><div><h4>Téléphone</h4><p>+225 07 79 28 95 99</p></div></a></FadeIn>
              <FadeIn><div className="contact-info-card"><div className="icon"><i className="fa-solid fa-location-dot"></i></div><div><h4>Adresse</h4><p>Abidjan, Marcory</p></div></div></FadeIn>
              <FadeIn><div style={{ marginTop: 24 }}><a href="https://wa.me/2250779289599?text=Bonjour%2C%20je%20souhaite%20parler%20maintenant%20à%20un%20conseiller" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg" style={{ width: '100%', justifyContent: 'center' }}><i className="fa-brands fa-whatsapp"></i> Parler maintenant sur WhatsApp</a></div></FadeIn>
              <FadeIn>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 32, marginBottom: 16 }}>Contacter directement notre équipe</h3>
                <div className="team-contacts">
                  {[
                    { name: 'Mr Lopez Aka', role: 'PDG, ACTION RÉUSSITE', link: 'https://wa.me/message/RNF754PNZDDOB1' },
                    { name: 'Mr Comoé Havila', role: 'Directeur Marketing', link: 'https://wa.me/2250779289599' },
                    { name: 'Mr Mickaël Assalé', role: 'Chargé clientèle', link: 'https://wa.me/message/A6QHXGURJUQRM1' },
                  ].map((t, i) => (
                    <a key={i} href={t.link} target="_blank" rel="noopener noreferrer" className="contact-info-card">
                      <div className="icon" style={{ background: 'rgba(37,211,102,0.15)' }}><i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i></div>
                      <div><h4>{t.name}</h4><p>{t.role}</p></div>
                    </a>
                  ))}
                </div>
              </FadeIn>
              <FadeIn>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 32, marginBottom: 16 }}>Suivez-nous</h3>
                <div className="social-grid">
                  <a href="https://www.facebook.com/share/1CcyRSopw9/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-link facebook"><i className="fa-brands fa-facebook-f"></i> Facebook</a>
                  <a href="https://www.instagram.com/action_reussite" target="_blank" rel="noopener noreferrer" className="social-link instagram"><i className="fa-brands fa-instagram"></i> Instagram</a>
                  <a href="https://www.tiktok.com/@action.reussite" target="_blank" rel="noopener noreferrer" className="social-link tiktok"><i className="fa-brands fa-tiktok"></i> TikTok</a>
                  <a href="https://wa.me/2250779289599" target="_blank" rel="noopener noreferrer" className="social-link whatsapp"><i className="fa-brands fa-whatsapp"></i> WhatsApp</a>
                </div>
              </FadeIn>
            </div>
            <FadeIn>
              <div className="contact-form">
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>Envoyez-nous un message</h3>
                {alert && <div className={`auth-alert auth-alert-${alert.type}`}>{alert.type === 'error' && !user ? <><i className="fa-solid fa-user-lock"></i> {alert.message} <Link href="/register" style={{ color: 'var(--accent-dark)', fontWeight: 700, textDecoration: 'underline' }}>Créer un compte</Link></> : <><i className="fa-solid fa-circle-check"></i> {alert.message}</>}</div>}
                <form onSubmit={handleSubmit}>
                  {!user && <><div className="form-group"><label>Nom complet</label><input type="text" name="name" placeholder="Votre nom et prénom" required /></div><div className="form-group"><label>Téléphone</label><input type="tel" name="phone" placeholder="+225 XX XX XX XX XX" required /></div></>}
                  <div className="form-group"><label>Destination souhaitée</label><select name="destination" required><option value="" disabled>Choisissez</option>{['Chine','Canada','Inde','Turquie','Maroc','France','Autre'].map(d => <option key={d} value={d}>{d}</option>)}</select></div>
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
          <FadeIn><div className="section-title"><h2>Notre localisation</h2><p>Abidjan, Marcory — Côte d&apos;Ivoire</p><div className="line"></div></div></FadeIn>
          <FadeIn><div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)', height: 400 }}><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15889.77!2d-3.9895!3d5.3045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1eb5a4b3b7b6f%3A0x3c2b7b7b7b7b7b7b!2sMarcory%2C%20Abidjan!5e0!3m2!1sfr!2sci!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe></div></FadeIn>
        </div>
      </section>

      <section className="cta-section">
        <div className="container"><FadeIn><h2>Prêt à commencer ?</h2><p>Le moyen le plus rapide de nous joindre est WhatsApp. Réponse garantie sous 24h.</p><a href="https://wa.me/2250779289599?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20vos%20services" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp"><i className="fa-brands fa-whatsapp"></i> Écrire sur WhatsApp</a></FadeIn></div>
      </section>

      <Footer /><WhatsAppFloat />
    </>
  );
}
