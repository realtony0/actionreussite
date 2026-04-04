'use client';

import { useEffect, useState } from 'react';
import { getDefaultSettings, getSiteSettings } from '@/lib/auth';
import type { SiteSettings } from '@/lib/site-settings';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(getDefaultSettings());

  useEffect(() => {
    let mounted = true;

    getSiteSettings()
      .then((data) => {
        if (mounted) setSettings(data);
      })
      .catch(() => {
        if (mounted) setSettings(getDefaultSettings());
      });

    return () => {
      mounted = false;
    };
  }, []);

  return settings;
}
