import { supabase } from './supabase';
import { defaultSiteSettings, normalizeSiteSettings, SITE_ASSET_BUCKET, type SiteSettings } from './site-settings';

// ===== AUTH HELPERS =====

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  destination: string;
  password: string;
}) {
  // Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) {
    return { success: false, message: authError.message };
  }

  if (!authData.user) {
    return { success: false, message: 'Erreur lors de la création du compte.' };
  }

  // Create profile
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    destination: data.destination,
  });

  if (profileError) {
    console.error('Profile error:', profileError);
  }

  return { success: true, user: authData.user };
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: error.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect.' : error.message };
  }

  return { success: true, user: data.user, session: data.session };
}

export async function logoutUser() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile ? { ...profile, authId: user.id } : null;
}

export async function updateProfile(updates: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  destination?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Non connecté.' };

  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: updates.firstName,
      last_name: updates.lastName,
      phone: updates.phone,
      destination: updates.destination,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) return { success: false, message: error.message };
  return { success: true };
}

// ===== REQUESTS =====

export async function submitRequest(data: {
  type: string;
  subject: string;
  message?: string;
  destination?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Vous devez être connecté.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, email, destination')
    .eq('id', user.id)
    .single();

  const { data: request, error } = await supabase.from('requests').insert({
    user_id: user.id,
    user_email: profile?.email || user.email,
    user_name: profile ? `${profile.first_name} ${profile.last_name}` : '',
    type: data.type,
    subject: data.subject,
    message: data.message || '',
    destination: data.destination || profile?.destination || '',
    status: 'en_attente',
  }).select().single();

  if (error) return { success: false, message: error.message };
  return { success: true, request };
}

export async function getUserRequests() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return data || [];
}

export async function enrollFormation(formationName: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Vous devez être connecté.' };

  // Check if already enrolled
  const { data: existing } = await supabase
    .from('requests')
    .select('id')
    .eq('user_id', user.id)
    .eq('type', 'formation')
    .eq('subject', formationName)
    .single();

  if (existing) return { success: false, message: 'Vous êtes déjà inscrit à cette formation.' };

  return submitRequest({
    type: 'formation',
    subject: formationName,
    message: 'Inscription à la formation ' + formationName,
    destination: 'Canada',
  });
}

export async function isEnrolled(formationName: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('requests')
    .select('id')
    .eq('user_id', user.id)
    .eq('type', 'formation')
    .eq('subject', formationName)
    .single();

  return !!data;
}

// ===== MESSAGES =====

export async function sendMessage(data: {
  requestId: string;
  fromUserId: string;
  fromName: string;
  toUserId: string;
  toName?: string;
  content: string;
  isAdmin?: boolean;
}) {
  const { data: msg, error } = await supabase.from('messages').insert({
    request_id: data.requestId,
    from_user_id: data.fromUserId,
    from_name: data.fromName,
    to_user_id: data.toUserId,
    to_name: data.toName || '',
    content: data.content,
    is_admin: data.isAdmin || false,
    read: false,
  }).select().single();

  if (error) console.error('Message send error:', error);
  return msg;
}

export async function getConversation(requestId: string) {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: true });

  return data || [];
}

export async function getUnreadCount(userId: string) {
  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('to_user_id', userId)
    .eq('read', false);

  return count || 0;
}

export async function markAsRead(requestId: string, userId: string) {
  await supabase
    .from('messages')
    .update({ read: true })
    .eq('request_id', requestId)
    .eq('to_user_id', userId)
    .eq('read', false);
}

// ===== ADMIN =====

const ADMIN_EMAIL = 'admin@actionreussite.com';
const ADMIN_PASSWORD = 'Admin2026!';

export function getAdminCredentials() {
  return { email: ADMIN_EMAIL, password: ADMIN_PASSWORD };
}

export async function adminLogin(email: string, password: string) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ar_admin_session', JSON.stringify({
        email,
        role: 'admin',
        name: 'Admin Action Réussite',
        loggedAt: new Date().toISOString(),
      }));
    }
    return { success: true };
  }
  return { success: false, message: 'Identifiants incorrects.' };
}

export function adminLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ar_admin_session');
  }
}

export function isAdminLoggedIn() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('ar_admin_session') !== null;
}

export function getAdminSession() {
  if (typeof window === 'undefined') return null;
  const s = localStorage.getItem('ar_admin_session');
  return s ? JSON.parse(s) : null;
}

export async function getAllUsers() {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getAllRequests() {
  const { data } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}

export async function updateRequestStatus(requestId: string, newStatus: string) {
  const { error } = await supabase
    .from('requests')
    .update({ status: newStatus })
    .eq('id', requestId);
  return !error;
}

export async function getAdminUnreadCount() {
  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('to_user_id', 'admin')
    .eq('read', false);
  return count || 0;
}

export async function getAllMessages() {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });
  return data || [];
}

// ===== SITE SETTINGS (CMS) =====

export function getDefaultSettings(): SiteSettings {
  return JSON.parse(JSON.stringify(defaultSiteSettings)) as SiteSettings;
}

export async function getSiteSettings() {
  const { data } = await supabase
    .from('site_settings')
    .select('settings')
    .eq('id', 1)
    .single();

  return normalizeSiteSettings((data?.settings as Record<string, unknown> | null) ?? null);
}

export async function saveSiteSettings(settings: Record<string, unknown>) {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 1, settings, updated_at: new Date().toISOString() });
  return !error;
}

export async function uploadSiteAsset(file: File) {
  const extension = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() || 'bin' : 'bin';
  const folder = file.type.startsWith('video/') ? 'videos' : 'images';
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(SITE_ASSET_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    });

  if (error) {
    return { success: false, message: error.message };
  }

  const { data } = supabase.storage.from(SITE_ASSET_BUCKET).getPublicUrl(path);
  return { success: true, url: data.publicUrl, path };
}
