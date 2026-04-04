'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { makeWhatsappUrl } from '@/lib/site-settings';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const settings = useSiteSettings();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="navbar">
      <div className="container">
        <Link href="/" className="nav-logo">
          <img src={settings.brand.logoUrl} alt={settings.brand.name} width={45} height={45} />
          <span>{settings.brand.name}</span>
        </Link>
        <div className={`nav-links${menuOpen ? ' active' : ''}`}>
          <Link href="/" className={pathname === '/' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Accueil</Link>
          <Link href="/canada" className={pathname === '/canada' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Étudier au Canada</Link>
          <Link href="/formation-canada" className={pathname === '/formation-canada' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Formation</Link>
          <Link href="/galerie" className={pathname === '/galerie' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Galerie</Link>
          <Link href="/contact" className={pathname === '/contact' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Contact</Link>
          {user ? (
            <Link href="/dashboard" className="nav-cta" onClick={() => setMenuOpen(false)}>
              <i className="fa-solid fa-user-circle"></i> Mon Espace
            </Link>
          ) : (
            <a href={makeWhatsappUrl(settings.contact.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="nav-cta">
              <i className="fa-brands fa-whatsapp"></i> WhatsApp
            </a>
          )}
        </div>
        <div className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </div>
      </div>
    </nav>
  );
}
