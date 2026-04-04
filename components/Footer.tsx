import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="nav-logo">
              <Image src="/images/logo.jpeg" alt="Action Réussite" width={45} height={45} />
              <span style={{ color: 'white' }}>Action Réussite</span>
            </Link>
            <p>Depuis 2017, nous accompagnons les étudiants dans leurs démarches d&apos;admission, de visa et de départ vers l&apos;international.</p>
            <div className="footer-social">
              <a href="https://www.facebook.com/share/1CcyRSopw9/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" title="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/action_reussite?igsh=YXQ1em1vcWF6ZWxk&utm_source=qr" target="_blank" rel="noopener noreferrer" title="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="https://www.tiktok.com/@action.reussite?_r=1&_t=ZS-95AEBRE4ZtN" target="_blank" rel="noopener noreferrer" title="TikTok"><i className="fa-brands fa-tiktok"></i></a>
              <a href="https://wa.me/2250779289599" target="_blank" rel="noopener noreferrer" title="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>
          <div>
            <h4>Navigation</h4>
            <ul>
              <li><Link href="/">Accueil</Link></li>
              <li><Link href="/canada">Étudier au Canada</Link></li>
              <li><Link href="/formation-canada">Formation Canada</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Destinations</h4>
            <ul>
              <li><a href="https://wa.me/2250779289599?text=Intéressé%20par%20la%20Chine" target="_blank" rel="noopener noreferrer">Chine</a></li>
              <li><Link href="/canada">Canada</Link></li>
              <li><a href="https://wa.me/2250779289599?text=Intéressé%20par%20l'Inde" target="_blank" rel="noopener noreferrer">Inde</a></li>
              <li><a href="https://wa.me/2250779289599?text=Intéressé%20par%20la%20Turquie" target="_blank" rel="noopener noreferrer">Turquie</a></li>
              <li><a href="https://wa.me/2250779289599?text=Intéressé%20par%20le%20Maroc" target="_blank" rel="noopener noreferrer">Maroc</a></li>
              <li><a href="https://wa.me/2250779289599?text=Intéressé%20par%20la%20France" target="_blank" rel="noopener noreferrer">France</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><i className="fa-solid fa-location-dot"></i> Abidjan, Marcory</li>
              <li><i className="fa-solid fa-phone"></i> +225 07 79 28 95 99</li>
              <li><a href="https://wa.me/2250779289599" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i> WhatsApp</a></li>
            </ul>
            <h4 style={{ marginTop: 20 }}>Notre équipe</h4>
            <ul className="footer-team">
              <li><a href="https://wa.me/message/RNF754PNZDDOB1" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i> Mr Lopez Aka — PDG</a></li>
              <li><a href="https://wa.me/2250779289599" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i> Mr Comoé Havila — Dir. Marketing</a></li>
              <li><a href="https://wa.me/message/A6QHXGURJUQRM1" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i> Mr Mickaël Assalé — Chargé clientèle</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2017–2026 Action Réussite. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
