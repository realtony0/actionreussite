-- ===== ACTION RÉUSSITE — SUPABASE SCHEMA =====

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  destination TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Requests table
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_email TEXT,
  user_name TEXT,
  type TEXT NOT NULL CHECK (type IN ('contact', 'formation', 'consultation', 'destination')),
  subject TEXT NOT NULL,
  message TEXT,
  destination TEXT,
  status TEXT DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'en_cours', 'traite')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  from_user_id TEXT NOT NULL,
  from_name TEXT,
  to_user_id TEXT NOT NULL,
  to_name TEXT,
  content TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings table (CMS)
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings (id, settings) VALUES (1, '{
  "heroTitle": "Bourse + admission + visa en 60 jours grâce à <span>ACTION RÉUSSITE</span>",
  "heroBadge": "Rentrée Septembre 2026 — Places limitées",
  "heroSubtext": "Nous prenons en charge votre projet d''études de A à Z : choix de pays, admission, visa et départ. Selon votre profil, en 60 jours vous pouvez tout obtenir.",
  "heroProof": "+229 étudiants déjà envoyés à l''étranger depuis 2017",
  "heroImages": ["/images/photo-1.jpeg", "/images/photo-2.jpeg", "/images/photo-3.jpeg"],
  "destChine": "/images/photo-36.jpeg",
  "destCanada": "/images/photo-5.jpeg",
  "destInde": "/images/photo-6.jpeg",
  "destTurquie": "/images/photo-7.jpeg",
  "destMaroc": "/images/photo-35.jpeg",
  "destFrance": "/images/photo-34.jpeg",
  "statEtudiants": "229",
  "statAnnees": "8",
  "statPays": "6",
  "statSatisfaction": "98",
  "formationPrix": "50 000 FCFA",
  "formationSession": "Fin juillet 2026",
  "contactPhone": "+225 07 79 28 95 99",
  "contactAddress": "Abidjan, Marcory",
  "contactWhatsapp": "2250779289599",
  "testimonialImages": ["/images/photo-30.jpeg", "/images/photo-31.jpeg", "/images/photo-32.jpeg", "/images/photo-38.jpeg"]
}'::jsonb) ON CONFLICT (id) DO NOTHING;

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
-- Allow service role full access (for admin)
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT TO anon USING (true);
CREATE POLICY "Authenticated can read site settings" ON site_settings FOR SELECT TO authenticated USING (true);

-- Requests: users can see their own, admin can see all
CREATE POLICY "Users can view own requests" ON requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create requests" ON requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can read requests" ON requests FOR SELECT TO anon USING (true);

-- Messages: users can see messages where they are sender or receiver
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
  from_user_id = auth.uid()::text OR to_user_id = auth.uid()::text OR to_user_id = 'admin' OR from_user_id = 'admin'
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (from_user_id = auth.uid()::text);
CREATE POLICY "Anon can read messages" ON messages FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert messages" ON messages FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update messages" ON messages FOR UPDATE TO anon USING (true);

-- Allow anon/authenticated full access for demo purposes
CREATE POLICY "Allow all profiles read" ON profiles FOR SELECT TO anon USING (true);
CREATE POLICY "Allow all profiles insert" ON profiles FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow all profiles update" ON profiles FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow all requests insert" ON requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow all requests update" ON requests FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow all site_settings update" ON site_settings FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow auth site_settings update" ON site_settings FOR UPDATE TO authenticated USING (true);

-- ===== STORAGE FOR VERCEL-COMPATIBLE MEDIA UPLOADS =====

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-assets',
  'site-assets',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read site assets'
  ) THEN
    CREATE POLICY "Public read site assets"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'site-assets');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public upload site assets'
  ) THEN
    CREATE POLICY "Public upload site assets"
    ON storage.objects FOR INSERT
    TO anon, authenticated
    WITH CHECK (bucket_id = 'site-assets');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public update site assets'
  ) THEN
    CREATE POLICY "Public update site assets"
    ON storage.objects FOR UPDATE
    TO anon, authenticated
    USING (bucket_id = 'site-assets')
    WITH CHECK (bucket_id = 'site-assets');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public delete site assets'
  ) THEN
    CREATE POLICY "Public delete site assets"
    ON storage.objects FOR DELETE
    TO anon, authenticated
    USING (bucket_id = 'site-assets');
  END IF;
END $$;
