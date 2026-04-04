'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminLogin, adminLogout, isAdminLoggedIn, getAllUsers, getAllRequests, updateRequestStatus, getAllMessages, sendMessage, getAdminUnreadCount, markAsRead, getSiteSettings, saveSiteSettings } from '@/lib/auth';

interface Profile { id: string; first_name: string; last_name: string; email: string; phone: string; destination: string; created_at: string; }
interface Req { id: string; user_id: string; user_email: string; user_name: string; type: string; subject: string; message: string; destination: string; status: string; created_at: string; }
interface Msg { id: string; request_id: string; from_user_id: string; from_name: string; to_user_id: string; content: string; is_admin: boolean; read: boolean; created_at: string; }

function timeAgo(d: string) { const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000); if (s < 60) return "À l'instant"; if (s < 3600) return Math.floor(s / 60) + ' min'; if (s < 86400) return Math.floor(s / 3600) + ' h'; return Math.floor(s / 86400) + ' j'; }

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
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [siteAlert, setSiteAlert] = useState('');

  useEffect(() => { setLoggedIn(isAdminLoggedIn()); }, []);
  useEffect(() => { if (loggedIn) loadAll(); }, [loggedIn]);

  async function loadAll() {
    const [u, r, m, c, s] = await Promise.all([getAllUsers(), getAllRequests(), getAllMessages(), getAdminUnreadCount(), getSiteSettings()]);
    setUsers(u as Profile[]); setRequests(r as Req[]); setMessages(m as Msg[]); setUnreadCount(c); setSettings(s);
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const res = await adminLogin(email, password);
    if (res.success) { setLoggedIn(true); setLoginError(''); } else { setLoginError(res.message || 'Erreur'); }
  }

  function handleLogout() { adminLogout(); setLoggedIn(false); }

  async function handleStatusChange(reqId: string, newStatus: string) {
    await updateRequestStatus(reqId, newStatus);
    loadAll();
  }

  async function openConvo(reqId: string) {
    setCurrentReqId(reqId);
    await markAsRead(reqId, 'admin');
    loadAll();
  }

  async function handleAdminReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentReqId) return;
    const input = (e.currentTarget.elements.namedItem('reply') as HTMLTextAreaElement);
    const content = input.value.trim();
    if (!content) return;
    const req = requests.find(r => r.id === currentReqId);
    await sendMessage({ requestId: currentReqId, fromUserId: 'admin', fromName: 'Équipe Action Réussite', toUserId: req?.user_id || '', toName: req?.user_name || '', content, isAdmin: true });
    if (req && req.status === 'en_attente') await updateRequestStatus(currentReqId, 'en_cours');
    input.value = '';
    loadAll();
  }

  async function handleSaveSettings() {
    const saved = await saveSiteSettings(settings);
    setSiteAlert(saved ? 'Paramètres enregistrés !' : 'Erreur lors de la sauvegarde.');
    setTimeout(() => setSiteAlert(''), 3000);
  }

  function updateSetting(key: string, value: unknown) { setSettings(prev => ({ ...prev, [key]: value })); }

  // LOGIN SCREEN
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

  const filteredUsers = users.filter(u => !searchTerm || (u.first_name + ' ' + u.last_name + ' ' + u.email).toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredReqs = requests.filter(r => (filterStatus === 'all' || r.status === filterStatus) && (filterType === 'all' || r.type === filterType));
  const pendingCount = requests.filter(r => r.status === 'en_attente').length;
  const convoMsgs = currentReqId ? messages.filter(m => m.request_id === currentReqId) : [];
  const currentReq = currentReqId ? requests.find(r => r.id === currentReqId) : null;

  const imageList = Array.from({ length: 42 }, (_, i) => `/images/photo-${i + 1}.jpeg`);

  return (
    <div>
      {/* ADMIN NAVBAR */}
      <nav className="admin-navbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/images/logo.jpeg" alt="Logo" style={{ width: 36, height: 36, borderRadius: '50%' }} />
            <strong style={{ color: 'white', fontSize: '1.1rem' }}>Admin — Action Réussite</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}><i className="fa-solid fa-external-link"></i> Voir le site</Link>
            <button onClick={handleLogout} className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '8px 16px', fontSize: '0.85rem' }}><i className="fa-solid fa-right-from-bracket"></i> Déconnexion</button>
          </div>
        </div>
      </nav>

      {/* STATS BAR */}
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

      {/* CONTENT */}
      <div className="admin-content">
        <div className="container">
          <div className="admin-tabs">
            {[
              { id: 'clients', icon: 'fa-users', label: 'Clients' },
              { id: 'requests', icon: 'fa-inbox', label: 'Demandes' },
              { id: 'messages', icon: 'fa-comments', label: 'Messages', badge: unreadCount },
              { id: 'site', icon: 'fa-globe', label: 'Gérer le site' },
            ].map(t => (
              <button key={t.id} className={`admin-tab${activeTab === t.id ? ' active' : ''}`} onClick={() => { setActiveTab(t.id); setCurrentReqId(null); }}>
                <i className={`fa-solid ${t.icon}`}></i> {t.label}
                {t.badge ? <span className="nav-badge">{t.badge}</span> : null}
              </button>
            ))}
          </div>

          {/* CLIENTS TAB */}
          <div className={`admin-panel${activeTab === 'clients' ? ' active' : ''}`}>
            <div className="admin-search"><i className="fa-solid fa-search"></i><input type="text" placeholder="Rechercher un client..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Client</th><th>Email</th><th>Téléphone</th><th>Destination</th><th>Date</th></tr></thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td><div className="client-cell"><div className="client-avatar-sm">{u.first_name.charAt(0)}{u.last_name.charAt(0)}</div><strong>{u.first_name} {u.last_name}</strong></div></td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td><span className="dest-tag">{u.destination}</span></td>
                      <td>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* REQUESTS TAB */}
          <div className={`admin-panel${activeTab === 'requests' ? ' active' : ''}`}>
            <div className="admin-filters">
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option value="all">Tous les statuts</option><option value="en_attente">En attente</option><option value="en_cours">En cours</option><option value="traite">Traité</option></select>
              <select value={filterType} onChange={e => setFilterType(e.target.value)}><option value="all">Tous les types</option><option value="contact">Messages</option><option value="formation">Formations</option></select>
            </div>
            {filteredReqs.map(r => (
              <div key={r.id} className="admin-request-card">
                <div className="request-icon" style={{ background: r.type === 'formation' ? 'rgba(212,32,39,0.1)' : 'rgba(26,26,26,0.1)' }}><i className={`fa-solid ${r.type === 'formation' ? 'fa-graduation-cap' : 'fa-envelope'}`} style={{ color: r.type === 'formation' ? 'var(--accent)' : 'var(--primary)' }}></i></div>
                <div className="request-info">
                  <div className="request-header"><strong>{r.user_name} — {r.subject}</strong>
                    <select className="status-select" value={r.status} onChange={e => handleStatusChange(r.id, e.target.value)}><option value="en_attente">En attente</option><option value="en_cours">En cours</option><option value="traite">Traité</option></select>
                  </div>
                  <p className="request-type">{r.user_email} — {r.destination}</p>
                  {r.message && <p className="request-message">{r.message}</p>}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
                    <span className="request-date"><i className="fa-regular fa-clock"></i> {new Date(r.created_at).toLocaleDateString('fr-FR')}</span>
                    <button className="btn-reply-small" onClick={() => { setActiveTab('messages'); openConvo(r.id); }}><i className="fa-solid fa-reply"></i> Répondre</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* MESSAGES TAB */}
          <div className={`admin-panel${activeTab === 'messages' ? ' active' : ''}`}>
            {!currentReqId ? (
              requests.map(r => {
                const rMsgs = messages.filter(m => m.request_id === r.id);
                const lastMsg = rMsgs.length > 0 ? rMsgs[rMsgs.length - 1] : null;
                const unread = rMsgs.filter(m => m.to_user_id === 'admin' && !m.read).length;
                return (
                  <div key={r.id} className={`convo-item${unread > 0 ? ' convo-unread-bg' : ''}`} onClick={() => openConvo(r.id)}>
                    <div className="convo-icon" style={{ background: 'rgba(26,26,26,0.1)' }}><i className="fa-solid fa-user" style={{ color: 'var(--primary)' }}></i></div>
                    <div className="convo-info">
                      <div className="convo-title"><strong>{r.user_name} — {r.subject}</strong>{unread > 0 && <span className="convo-unread">{unread}</span>}</div>
                      <p className="convo-preview">{lastMsg ? ((lastMsg.is_admin ? 'Vous : ' : r.user_name + ' : ') + lastMsg.content.substring(0, 60)) : r.message?.substring(0, 60) || 'Aucun message'}</p>
                      <span className="convo-time"><i className="fa-regular fa-clock"></i> {timeAgo(lastMsg?.created_at || r.created_at)}</span>
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
                  {convoMsgs.map(m => (
                    <div key={m.id} className={`chat-msg ${m.is_admin ? 'chat-msg-admin' : 'chat-msg-user'}`}>
                      <div className="chat-bubble">
                        {m.is_admin && <span className="chat-sender"><i className="fa-solid fa-headset"></i> {m.from_name}</span>}
                        <p>{m.content}</p>
                        <span className="chat-time">{new Date(m.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
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

          {/* SITE SETTINGS TAB */}
          <div className={`admin-panel${activeTab === 'site' ? ' active' : ''}`}>
            {siteAlert && <div className="auth-alert auth-alert-success">{siteAlert}</div>}
            <div className="cms-section">
              <h3><i className="fa-solid fa-star"></i> Section Hero (Accueil)</h3>
              <div className="cms-field"><label>Badge d&apos;urgence</label><input type="text" className="cms-input" value={(settings.heroBadge as string) || ''} onChange={e => updateSetting('heroBadge', e.target.value)} /></div>
              <div className="cms-field"><label>Titre principal (HTML autorisé)</label><textarea className="cms-input" rows={2} value={(settings.heroTitle as string) || ''} onChange={e => updateSetting('heroTitle', e.target.value)} /></div>
              <div className="cms-field"><label>Preuve sociale</label><input type="text" className="cms-input" value={(settings.heroProof as string) || ''} onChange={e => updateSetting('heroProof', e.target.value)} /></div>
            </div>
            <div className="cms-section">
              <h3><i className="fa-solid fa-image"></i> Photos des destinations</h3>
              <p className="cms-help">Entrez le chemin (ex: /images/photo-36.jpeg). Cliquez sur une image ci-dessous pour copier son chemin.</p>
              <div className="cms-grid">
                {['Chine', 'Canada', 'Inde', 'Turquie', 'Maroc', 'France'].map(dest => {
                  const key = 'dest' + dest;
                  return (
                    <div key={dest} className="cms-field">
                      <label>{dest}</label>
                      <input type="text" className="cms-input" value={(settings[key] as string) || ''} onChange={e => updateSetting(key, e.target.value)} />
                      {Boolean(settings[key]) && <div className="cms-preview"><img src={String(settings[key])} alt={dest} /></div>}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="cms-section">
              <h3><i className="fa-solid fa-chart-bar"></i> Statistiques</h3>
              <div className="cms-grid">
                <div className="cms-field"><label>Étudiants envoyés</label><input type="text" className="cms-input" value={(settings.statEtudiants as string) || ''} onChange={e => updateSetting('statEtudiants', e.target.value)} /></div>
                <div className="cms-field"><label>Pays</label><input type="text" className="cms-input" value={(settings.statPays as string) || ''} onChange={e => updateSetting('statPays', e.target.value)} /></div>
                <div className="cms-field"><label>Satisfaction (%)</label><input type="text" className="cms-input" value={(settings.statSatisfaction as string) || ''} onChange={e => updateSetting('statSatisfaction', e.target.value)} /></div>
              </div>
            </div>
            <div className="cms-section">
              <h3><i className="fa-solid fa-images"></i> Images disponibles</h3>
              <div className="cms-images-grid">
                {imageList.map(img => (
                  <div key={img} className="cms-img-thumb" onClick={() => { navigator.clipboard.writeText(img); setSiteAlert('Copié : ' + img); setTimeout(() => setSiteAlert(''), 2000); }}>
                    <img src={img} alt="" />
                    <span>{img.split('/').pop()}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleSaveSettings} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
              <i className="fa-solid fa-floppy-disk"></i> Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
