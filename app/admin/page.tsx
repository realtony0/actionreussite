'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  adminLogin,
  adminLogout,
  getAllMessages,
  getAllRequests,
  getAllUsers,
  getDefaultSettings,
  getAdminUnreadCount,
  getSiteSettings,
  isAdminLoggedIn,
  markAsRead,
  saveSiteSettings,
  sendMessage,
  updateRequestStatus,
  uploadSiteAsset,
} from '@/lib/auth';
import type { SiteSettings } from '@/lib/site-settings';

interface Profile { id: string; first_name: string; last_name: string; email: string; phone: string; destination: string; created_at: string; }
interface Req { id: string; user_id: string; user_email: string; user_name: string; type: string; subject: string; message: string; destination: string; status: string; created_at: string; }
interface Msg { id: string; request_id: string; from_user_id: string; from_name: string; to_user_id: string; content: string; is_admin: boolean; read: boolean; created_at: string; }

function timeAgo(d: string) {
  const seconds = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (seconds < 60) return "À l'instant";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h`;
  return `${Math.floor(seconds / 86400)} j`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function setNestedValue(current: unknown, path: string[], value: unknown): unknown {
  if (path.length === 0) return value;

  const [segment, ...rest] = path;
  const isIndex = /^\d+$/.test(segment);

  if (isIndex) {
    const index = Number(segment);
    const source = Array.isArray(current) ? [...current] : [];
    source[index] = rest.length === 0
      ? value
      : setNestedValue(source[index] ?? (/^\d+$/.test(rest[0]) ? [] : {}), rest, value);
    return source;
  }

  const source = isRecord(current) ? { ...current } : {};
  source[segment] = rest.length === 0
    ? value
    : setNestedValue(source[segment] ?? (/^\d+$/.test(rest[0]) ? [] : {}), rest, value);
  return source;
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('clients');
  const [users, setUsers] = useState<Profile[]>([]);
  const [requests, setRequests] = useState<Req[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentReqId, setCurrentReqId] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(getDefaultSettings());
  const [rawSettings, setRawSettings] = useState('');
  const [siteAlert, setSiteAlert] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedAssets, setUploadedAssets] = useState<string[]>([]);

  useEffect(() => {
    setLoggedIn(isAdminLoggedIn());
  }, []);

  useEffect(() => {
    if (loggedIn) {
      void loadAll();
    }
  }, [loggedIn]);

  useEffect(() => {
    setRawSettings(JSON.stringify(settings, null, 2));
  }, [settings]);

  async function loadAll() {
    const [u, r, m, c, s] = await Promise.all([
      getAllUsers(),
      getAllRequests(),
      getAllMessages(),
      getAdminUnreadCount(),
      getSiteSettings(),
    ]);

    setUsers(u as Profile[]);
    setRequests(r as Req[]);
    setMessages(m as Msg[]);
    setUnreadCount(c);
    setSettings(s);
  }

  function flashSiteAlert(message: string) {
    setSiteAlert(message);
    setTimeout(() => setSiteAlert(''), 3000);
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const res = await adminLogin(email, password);
    if (res.success) {
      setLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError(res.message || 'Erreur');
    }
  }

  function handleLogout() {
    adminLogout();
    setLoggedIn(false);
  }

  async function handleStatusChange(reqId: string, newStatus: string) {
    await updateRequestStatus(reqId, newStatus);
    await loadAll();
  }

  async function openConvo(reqId: string) {
    setCurrentReqId(reqId);
    await markAsRead(reqId, 'admin');
    await loadAll();
  }

  async function handleAdminReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentReqId) return;

    const input = e.currentTarget.elements.namedItem('reply') as HTMLTextAreaElement;
    const content = input.value.trim();
    if (!content) return;

    const req = requests.find((request) => request.id === currentReqId);
    await sendMessage({
      requestId: currentReqId,
      fromUserId: 'admin',
      fromName: 'Équipe Action Réussite',
      toUserId: req?.user_id || '',
      toName: req?.user_name || '',
      content,
      isAdmin: true,
    });

    if (req && req.status === 'en_attente') {
      await updateRequestStatus(currentReqId, 'en_cours');
    }

    input.value = '';
    await loadAll();
  }

  function updateSetting(path: string, value: unknown) {
    setSettings((prev) => setNestedValue(prev, path.split('.'), value) as SiteSettings);
  }

  function applyRawSettings() {
    try {
      const parsed = JSON.parse(rawSettings) as SiteSettings;
      setSettings(parsed);
      flashSiteAlert('JSON appliqué.');
      return parsed;
    } catch {
      flashSiteAlert('JSON invalide. Vérifiez la syntaxe.');
      return null;
    }
  }

  async function handleSaveSettings() {
    const parsed = applyRawSettings();
    if (!parsed) return;

    const saved = await saveSiteSettings(parsed as Record<string, unknown>);
    flashSiteAlert(saved ? 'Paramètres enregistrés !' : 'Erreur lors de la sauvegarde.');
  }

  async function handleUploadFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of files) {
      const result = await uploadSiteAsset(file);
      if (result.success && result.url) {
        uploaded.push(result.url);
      } else {
        flashSiteAlert(result.message || `Erreur lors de l'upload de ${file.name}`);
      }
    }

    setUploading(false);
    e.target.value = '';

    if (uploaded.length > 0) {
      setUploadedAssets((prev) => [...uploaded, ...prev]);
      await navigator.clipboard.writeText(uploaded[0]);
      flashSiteAlert(`${uploaded.length} fichier(s) envoyé(s). URL copiée : ${uploaded[0]}`);
    }
  }

  if (!loggedIn) {
    return (
      <div className="admin-login-wrapper">
        <div className="auth-card" style={{ maxWidth: 420 }}>
          <div className="auth-icon"><i className="fa-solid fa-shield-halved"></i></div>
          <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Espace Administration</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-medium)', marginBottom: 24 }}>Connectez-vous pour gérer vos clients</p>
          {loginError && <div className="auth-alert auth-alert-error">{loginError}</div>}
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group"><label><i className="fa-solid fa-envelope"></i> Email</label><input type="email" name="email" placeholder="admin@actionreussite.com" required /></div>
            <div className="form-group"><label><i className="fa-solid fa-lock"></i> Mot de passe</label><input type="password" name="password" placeholder="Mot de passe admin" required /></div>
            <button type="submit" className="btn btn-primary auth-submit"><i className="fa-solid fa-right-to-bracket"></i> Se connecter</button>
          </form>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter((user) => !searchTerm || `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredReqs = requests.filter((request) => (filterStatus === 'all' || request.status === filterStatus) && (filterType === 'all' || request.type === filterType));
  const pendingCount = requests.filter((request) => request.status === 'en_attente').length;
  const convoMsgs = currentReqId ? messages.filter((message) => message.request_id === currentReqId) : [];
  const currentReq = currentReqId ? requests.find((request) => request.id === currentReqId) : null;
  const whatsappSocialIndex = settings.socialLinks.findIndex((social) => social.label.toLowerCase() === 'whatsapp' || social.className === 'whatsapp');
  const localImages = [
    ...Array.from({ length: 42 }, (_, i) => `/images/photo-${i + 1}.jpeg`),
    '/images/canada-fiche.jpeg',
    '/images/inde-fiche.jpeg',
    '/images/turquie-fiche.jpeg',
  ];
  const assetGallery = [...uploadedAssets, ...localImages];

  return (
    <div>
      <nav className="admin-navbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={settings.brand.logoUrl} alt={settings.brand.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
            <strong style={{ color: 'white', fontSize: '1.1rem' }}>Admin — {settings.brand.name}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}><i className="fa-solid fa-external-link"></i> Voir le site</Link>
            <button onClick={handleLogout} className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '8px 16px', fontSize: '0.85rem' }}><i className="fa-solid fa-right-from-bracket"></i> Déconnexion</button>
          </div>
        </div>
      </nav>

      <div className="admin-stats-bar">
        <div className="container">
          <div className="admin-stats-row">
            <div className="admin-stat"><i className="fa-solid fa-users"></i><span><strong>{users.length}</strong> clients</span></div>
            <div className="admin-stat"><i className="fa-solid fa-inbox"></i><span><strong>{requests.length}</strong> demandes</span></div>
            <div className="admin-stat"><i className="fa-solid fa-clock"></i><span><strong>{pendingCount}</strong> en attente</span></div>
            <div className="admin-stat"><i className="fa-solid fa-comments"></i><span><strong>{unreadCount}</strong> messages non lus</span></div>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          <div className="admin-tabs">
            {[
              { id: 'clients', icon: 'fa-users', label: 'Clients' },
              { id: 'requests', icon: 'fa-inbox', label: 'Demandes' },
              { id: 'messages', icon: 'fa-comments', label: 'Messages', badge: unreadCount },
              { id: 'site', icon: 'fa-globe', label: 'Gérer le site' },
            ].map((tab) => (
              <button key={tab.id} className={`admin-tab${activeTab === tab.id ? ' active' : ''}`} onClick={() => { setActiveTab(tab.id); setCurrentReqId(null); }}>
                <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
                {tab.badge ? <span className="nav-badge">{tab.badge}</span> : null}
              </button>
            ))}
          </div>

          <div className={`admin-panel${activeTab === 'clients' ? ' active' : ''}`}>
            <div className="admin-search"><i className="fa-solid fa-search"></i><input type="text" placeholder="Rechercher un client..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Client</th><th>Email</th><th>Téléphone</th><th>Destination</th><th>Date</th></tr></thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td><div className="client-cell"><div className="client-avatar-sm">{user.first_name.charAt(0)}{user.last_name.charAt(0)}</div><strong>{user.first_name} {user.last_name}</strong></div></td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td><span className="dest-tag">{user.destination}</span></td>
                      <td>{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`admin-panel${activeTab === 'requests' ? ' active' : ''}`}>
            <div className="admin-filters">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value="all">Tous les statuts</option><option value="en_attente">En attente</option><option value="en_cours">En cours</option><option value="traite">Traité</option></select>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}><option value="all">Tous les types</option><option value="contact">Messages</option><option value="formation">Formations</option></select>
            </div>
            {filteredReqs.map((request) => (
              <div key={request.id} className="admin-request-card">
                <div className="request-icon" style={{ background: request.type === 'formation' ? 'rgba(212,32,39,0.1)' : 'rgba(26,26,26,0.1)' }}><i className={`fa-solid ${request.type === 'formation' ? 'fa-graduation-cap' : 'fa-envelope'}`} style={{ color: request.type === 'formation' ? 'var(--accent)' : 'var(--primary)' }}></i></div>
                <div className="request-info">
                  <div className="request-header"><strong>{request.user_name} — {request.subject}</strong>
                    <select className="status-select" value={request.status} onChange={(e) => handleStatusChange(request.id, e.target.value)}><option value="en_attente">En attente</option><option value="en_cours">En cours</option><option value="traite">Traité</option></select>
                  </div>
                  <p className="request-type">{request.user_email} — {request.destination}</p>
                  {request.message && <p className="request-message">{request.message}</p>}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
                    <span className="request-date"><i className="fa-regular fa-clock"></i> {new Date(request.created_at).toLocaleDateString('fr-FR')}</span>
                    <button className="btn-reply-small" onClick={() => { setActiveTab('messages'); void openConvo(request.id); }}><i className="fa-solid fa-reply"></i> Répondre</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`admin-panel${activeTab === 'messages' ? ' active' : ''}`}>
            {!currentReqId ? (
              requests.map((request) => {
                const requestMessages = messages.filter((message) => message.request_id === request.id);
                const lastMessage = requestMessages.length > 0 ? requestMessages[requestMessages.length - 1] : null;
                const unread = requestMessages.filter((message) => message.to_user_id === 'admin' && !message.read).length;
                return (
                  <div key={request.id} className={`convo-item${unread > 0 ? ' convo-unread-bg' : ''}`} onClick={() => void openConvo(request.id)}>
                    <div className="convo-icon" style={{ background: 'rgba(26,26,26,0.1)' }}><i className="fa-solid fa-user" style={{ color: 'var(--primary)' }}></i></div>
                    <div className="convo-info">
                      <div className="convo-title"><strong>{request.user_name} — {request.subject}</strong>{unread > 0 && <span className="convo-unread">{unread}</span>}</div>
                      <p className="convo-preview">{lastMessage ? `${lastMessage.is_admin ? 'Vous' : request.user_name} : ${lastMessage.content.substring(0, 60)}` : request.message?.substring(0, 60) || 'Aucun message'}</p>
                      <span className="convo-time"><i className="fa-regular fa-clock"></i> {timeAgo(lastMessage?.created_at || request.created_at)}</span>
                    </div>
                    <i className="fa-solid fa-chevron-right convo-arrow"></i>
                  </div>
                );
              })
            ) : (
              <>
                <button className="btn-back" onClick={() => setCurrentReqId(null)}><i className="fa-solid fa-arrow-left"></i> Retour</button>
                <div className="admin-convo-header"><strong>{currentReq?.user_name}</strong> — <span>{currentReq?.subject}</span><span className={`status-badge ${currentReq?.status === 'traite' ? 'status-done' : 'status-progress'}`} style={{ marginLeft: 'auto' }}>{currentReq?.status === 'traite' ? 'Traité' : currentReq?.status === 'en_cours' ? 'En cours' : 'En attente'}</span></div>
                <div className="convo-messages">
                  <div className="chat-msg chat-msg-user"><div className="chat-bubble"><p>{currentReq?.message || 'Demande envoyée'}</p><span className="chat-time">{currentReq && new Date(currentReq.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span></div></div>
                  {convoMsgs.map((message) => (
                    <div key={message.id} className={`chat-msg ${message.is_admin ? 'chat-msg-admin' : 'chat-msg-user'}`}>
                      <div className="chat-bubble">
                        {message.is_admin && <span className="chat-sender"><i className="fa-solid fa-headset"></i> {message.from_name}</span>}
                        <p>{message.content}</p>
                        <span className="chat-time">{new Date(message.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <form className="convo-reply" onSubmit={handleAdminReply}>
                  <textarea name="reply" placeholder="Répondre au client..." rows={3} required></textarea>
                  <button type="submit" className="btn btn-primary"><i className="fa-solid fa-paper-plane"></i> Envoyer</button>
                </form>
              </>
            )}
          </div>

          <div className={`admin-panel${activeTab === 'site' ? ' active' : ''}`}>
            {siteAlert && <div className="auth-alert auth-alert-success">{siteAlert}</div>}

            <div className="cms-section">
              <h3><i className="fa-solid fa-sliders"></i> Réglages rapides</h3>
              <p className="cms-help">Ces champs couvrent les changements les plus fréquents. Pour tout le reste, utilisez l&apos;éditeur JSON complet plus bas.</p>
              <div className="cms-grid">
                <div className="cms-field"><label>Nom de marque</label><input type="text" className="cms-input" value={settings.brand.name} onChange={(e) => updateSetting('brand.name', e.target.value)} /></div>
                <div className="cms-field"><label>Logo</label><input type="text" className="cms-input" value={settings.brand.logoUrl} onChange={(e) => updateSetting('brand.logoUrl', e.target.value)} /></div>
                <div className="cms-field"><label>Téléphone</label><input type="text" className="cms-input" value={settings.contact.phone} onChange={(e) => updateSetting('contact.phone', e.target.value)} /></div>
                <div className="cms-field"><label>WhatsApp principal (numéro ou lien)</label><input type="text" className="cms-input" value={settings.contact.whatsappNumber} onChange={(e) => updateSetting('contact.whatsappNumber', e.target.value)} /></div>
                <div className="cms-field"><label>Adresse</label><input type="text" className="cms-input" value={settings.contact.address} onChange={(e) => updateSetting('contact.address', e.target.value)} /></div>
                <div className="cms-field"><label>Prix formation Canada</label><input type="text" className="cms-input" value={settings.formationCanada.pricing.price} onChange={(e) => { updateSetting('formationCanada.pricing.price', e.target.value); updateSetting('canada.training.pricingStatus', e.target.value); }} /></div>
              </div>
            </div>

            <div className="cms-section">
              <h3><i className="fa-brands fa-whatsapp"></i> Contacts WhatsApp</h3>
              <p className="cms-help">Le bouton WhatsApp principal accepte soit un numéro, soit un lien complet `wa.me/message/...`.</p>
              <div className="cms-grid">
                {whatsappSocialIndex >= 0 && (
                  <div className="cms-field">
                    <label>Lien WhatsApp réseau social</label>
                    <input type="text" className="cms-input" value={settings.socialLinks[whatsappSocialIndex]?.url || ''} onChange={(e) => updateSetting(`socialLinks.${whatsappSocialIndex}.url`, e.target.value)} />
                  </div>
                )}
                {settings.teamContacts.map((member, index) => (
                  <div key={`${member.name}-${index}`} className="cms-field">
                    <label>Contact équipe {index + 1}</label>
                    <input type="text" className="cms-input" value={member.name} onChange={(e) => updateSetting(`teamContacts.${index}.name`, e.target.value)} />
                    <input type="text" className="cms-input" style={{ marginTop: 8 }} value={member.role} onChange={(e) => updateSetting(`teamContacts.${index}.role`, e.target.value)} />
                    <input type="text" className="cms-input" style={{ marginTop: 8 }} value={member.link} onChange={(e) => updateSetting(`teamContacts.${index}.link`, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="cms-section">
              <h3><i className="fa-solid fa-star"></i> Accueil</h3>
              <div className="cms-field"><label>Badge hero</label><input type="text" className="cms-input" value={settings.home.hero.badge} onChange={(e) => updateSetting('home.hero.badge', e.target.value)} /></div>
              <div className="cms-field"><label>Titre hero (HTML autorisé)</label><textarea className="cms-input" rows={2} value={settings.home.hero.title} onChange={(e) => updateSetting('home.hero.title', e.target.value)} /></div>
              <div className="cms-field"><label>Preuve sociale</label><input type="text" className="cms-input" value={settings.home.hero.proof} onChange={(e) => updateSetting('home.hero.proof', e.target.value)} /></div>
              <div className="cms-field"><label>Sous-texte hero</label><textarea className="cms-input" rows={3} value={settings.home.hero.subtext} onChange={(e) => updateSetting('home.hero.subtext', e.target.value)} /></div>
              <div className="cms-grid">
                <div className="cms-field"><label>Étudiants</label><input type="text" className="cms-input" value={settings.home.stats.students} onChange={(e) => updateSetting('home.stats.students', e.target.value)} /></div>
                <div className="cms-field"><label>Pays</label><input type="text" className="cms-input" value={settings.home.stats.countries} onChange={(e) => updateSetting('home.stats.countries', e.target.value)} /></div>
                <div className="cms-field"><label>Universités</label><input type="text" className="cms-input" value={settings.home.stats.universities} onChange={(e) => updateSetting('home.stats.universities', e.target.value)} /></div>
                <div className="cms-field"><label>Satisfaction</label><input type="text" className="cms-input" value={settings.home.stats.satisfaction} onChange={(e) => updateSetting('home.stats.satisfaction', e.target.value)} /></div>
              </div>
            </div>

            <div className="cms-section">
              <h3><i className="fa-solid fa-image"></i> Destinations</h3>
              <p className="cms-help">Vous pouvez modifier les images, textes et liens de chaque carte ici.</p>
              <div className="cms-grid">
                {settings.home.destinations.map((destination, index) => (
                  <div key={`${destination.name}-${index}`} className="cms-field">
                    <label>{destination.name}</label>
                    <input type="text" className="cms-input" value={destination.image} onChange={(e) => updateSetting(`home.destinations.${index}.image`, e.target.value)} />
                    <textarea className="cms-input" rows={3} style={{ marginTop: 8 }} value={destination.description} onChange={(e) => updateSetting(`home.destinations.${index}.description`, e.target.value)} />
                    <input type="text" className="cms-input" style={{ marginTop: 8 }} value={destination.link} onChange={(e) => updateSetting(`home.destinations.${index}.link`, e.target.value)} />
                    <div className="cms-preview"><img src={destination.image} alt={destination.name} /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cms-section">
              <h3><i className="fa-solid fa-graduation-cap"></i> Formation Canada</h3>
              <div className="cms-grid">
                <div className="cms-field"><label>Titre page Canada</label><input type="text" className="cms-input" value={settings.canada.header.title} onChange={(e) => updateSetting('canada.header.title', e.target.value)} /></div>
                <div className="cms-field"><label>Titre page Formation</label><input type="text" className="cms-input" value={settings.formationCanada.header.title} onChange={(e) => updateSetting('formationCanada.header.title', e.target.value)} /></div>
                <div className="cms-field"><label>Session Canada</label><input type="text" className="cms-input" value={settings.canada.training.sessionTitle} onChange={(e) => updateSetting('canada.training.sessionTitle', e.target.value)} /></div>
                <div className="cms-field"><label>Session Formation</label><input type="text" className="cms-input" value={settings.formationCanada.session.title} onChange={(e) => updateSetting('formationCanada.session.title', e.target.value)} /></div>
                <div className="cms-field"><label>Prix / statut carte Canada</label><input type="text" className="cms-input" value={settings.canada.training.pricingStatus} onChange={(e) => updateSetting('canada.training.pricingStatus', e.target.value)} /></div>
                <div className="cms-field"><label>Prix formation</label><input type="text" className="cms-input" value={settings.formationCanada.pricing.price} onChange={(e) => { updateSetting('formationCanada.pricing.price', e.target.value); updateSetting('canada.training.pricingStatus', e.target.value); }} /></div>
              </div>
              <div className="cms-field"><label>Urgence formation</label><input type="text" className="cms-input" value={settings.formationCanada.pricing.urgency} onChange={(e) => updateSetting('formationCanada.pricing.urgency', e.target.value)} /></div>
            </div>

            <div className="cms-section">
              <h3><i className="fa-solid fa-upload"></i> Uploader des médias</h3>
              <p className="cms-help">Compatible Vercel : les fichiers sont envoyés vers Supabase Storage. Après upload, l&apos;URL publique est copiée dans le presse-papiers.</p>
              <input type="file" multiple accept="image/*,video/*" onChange={(e) => void handleUploadFiles(e)} />
              {uploading && <p className="cms-help" style={{ marginTop: 12 }}>Upload en cours...</p>}
              {uploadedAssets.length > 0 && (
                <div className="cms-upload-results">
                  {uploadedAssets.map((asset) => (
                    <div key={asset} className="cms-upload-item">
                      {asset.includes('/videos/') ? <video src={asset} controls /> : <img src={asset} alt="" />}
                      <div className="cms-upload-meta">
                        <input className="cms-input" readOnly value={asset} />
                        <button className="btn btn-secondary" onClick={() => { navigator.clipboard.writeText(asset); flashSiteAlert(`Copié : ${asset}`); }}>Copier l&apos;URL</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="cms-section">
              <h3><i className="fa-solid fa-images"></i> Banque d&apos;images</h3>
              <p className="cms-help">Cliquez pour copier un chemin local ou une URL déjà uploadée.</p>
              <div className="cms-images-grid">
                {assetGallery.map((asset) => (
                  <div key={asset} className="cms-img-thumb" onClick={() => { navigator.clipboard.writeText(asset); flashSiteAlert(`Copié : ${asset}`); }}>
                    {asset.includes('/videos/') ? <video src={asset} /> : <img src={asset} alt="" />}
                    <span>{asset.split('/').pop()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cms-section">
              <h3><i className="fa-solid fa-code"></i> JSON complet du site</h3>
              <p className="cms-help">Ici vous pouvez modifier tout le site : accueil, Canada, formation, contact, footer, équipe, réseaux, vidéos, galeries et liens. Le JSON complet est enregistré dans `site_settings`.</p>
              <textarea className="cms-input cms-code-input" rows={26} value={rawSettings} onChange={(e) => setRawSettings(e.target.value)} />
              <div className="cms-actions">
                <button onClick={applyRawSettings} className="btn btn-secondary"><i className="fa-solid fa-wand-magic-sparkles"></i> Appliquer le JSON</button>
                <button onClick={() => setRawSettings(JSON.stringify(settings, null, 2))} className="btn btn-outline"><i className="fa-solid fa-rotate-left"></i> Réinitialiser l&apos;éditeur</button>
              </div>
            </div>

            <button onClick={() => void handleSaveSettings()} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
              <i className="fa-solid fa-floppy-disk"></i> Enregistrer les modifications du site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
