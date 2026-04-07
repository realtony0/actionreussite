/**
 * Run this script once to update the WhatsApp number in Supabase:
 *   node scripts/update-whatsapp.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://byjyboqvsdzrsyzmiqnu.supabase.co';
const SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5anlib3F2c2R6cnN5em1pcW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTMxMTUxNiwiZXhwIjoyMDkwODg3NTE2fQ.VJ0kACbSM7IhcKrUgzkShwBINqU9aT7Ecj2xwRPBw98';

const NEW_WHATSAPP = 'https://wa.me/2250576911899';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  // 1. Read current settings
  const { data, error: readErr } = await supabase
    .from('site_settings')
    .select('settings')
    .eq('id', 1)
    .single();

  if (readErr) {
    console.error('❌ Erreur lecture:', readErr.message);
    process.exit(1);
  }

  const settings = data.settings || {};

  // 2. Update WhatsApp fields
  settings.contactWhatsapp = NEW_WHATSAPP;
  if (settings.contact) {
    settings.contact.whatsappNumber = NEW_WHATSAPP;
  } else {
    settings.contact = { whatsappNumber: NEW_WHATSAPP };
  }

  // 3. Save back
  const { error: writeErr } = await supabase
    .from('site_settings')
    .update({ settings })
    .eq('id', 1);

  if (writeErr) {
    console.error('❌ Erreur écriture:', writeErr.message);
    process.exit(1);
  }

  console.log('✅ WhatsApp mis à jour en base:', NEW_WHATSAPP);
}

main();
