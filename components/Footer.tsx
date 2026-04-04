'use client';

import Link from 'next/link';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { makeWhatsappUrl } from '@/lib/site-settings';

export default function Footer() {
  const settings = useSiteSettings();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="nav-logo">
              <img src={settings.brand.logoUrl} alt={settings.brand.name} width={45} height={45} />
              <span style={{ color: 'white' }}>{settings.brand.name}</span>
            </Link>
            <p>{settings.brand.footerDescription}</p>
            <div className="footer-social">
              {settings.socialLinks.map((social) => (
                <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" title={social.label}>
                  <i className={`fa-brands ${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4>Navigation</h4>
            <ul>
              <li><Link href="/">Accueil</Link></li>
              <li><Link href="/canada">Étudier au Canada</Link></li>
              <li><Link href="/formation-canada">Formation Canada</Link></li>
              <li><Link href="/galerie">Galerie</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Destinations</h4>
            <ul>
              {settings.home.destinations.map((destination) => (
                <li key={destination.name}>
                  {destination.internal ? (
                    <Link href={destination.link}>{destination.name.split(' ')[0]}</Link>
                  ) : (
                    <a href={destination.link} target="_blank" rel="noopener noreferrer">{destination.name.split(' ')[0]}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><i className="fa-solid fa-location-dot"></i> {settings.contact.address}</li>
              <li><i className="fa-solid fa-phone"></i> {settings.contact.phone}</li>
              <li><a href={makeWhatsappUrl(settings.contact.whatsappNumber)} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i> WhatsApp</a></li>
            </ul>
            <h4 style={{ marginTop: 20 }}>Notre équipe</h4>
            <ul className="footer-team">
              {settings.teamContacts.map((member) => (
                <li key={member.name}>
                  <a href={member.link} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i> {member.name} — {member.role}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {settings.brand.copyright}
        </div>
      </div>
    </footer>
  );
}
