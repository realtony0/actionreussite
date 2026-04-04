'use client';

import { useSiteSettings } from '@/hooks/useSiteSettings';
import { makeWhatsappUrl } from '@/lib/site-settings';

export default function WhatsAppFloat() {
  const settings = useSiteSettings();

  return (
    <a href={makeWhatsappUrl(settings.contact.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="whatsapp-float" title="Contactez-nous sur WhatsApp">
      <i className="fa-brands fa-whatsapp"></i>
    </a>
  );
}
