'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import FadeIn from '@/components/FadeIn';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, updateProfile, getUserRequests, sendMessage, getConversation, getUnreadCount, markAsRead } from '@/lib/auth';

interface UserProfile {
  id: string;
  authId: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  destination: string;
  created_at: string;
}

interface Request {
  id: string;
  type: string;
  subject: string;
  message: string;
  destination: string;
  status: string;
  created_at: string;
}

interface Message {
  id: string;
  request_id: string;
  from_user_id: string;
  from_name: string;
  to_user_id: string;
  content: string;
  is_admin: boolean;
  read: boolean;
  created_at: string;
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return Math.floor(diff / 60) + ' min';
  if (diff < 86400) return Math.floor(diff / 3600) + ' h';
  if (diff < 604800) return Math.floor(diff / 86400) + ' j';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [requests, setRequests] = useState<Request[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentReqId, setCurrentReqId] = useState<string | null>(null);
  const [convoMessages, setConvoMessages] = useState<Message[]>([]);
  const [currentReq, setCurrentReq] = useState<Request | null>(null);

  // Profile edit state
  const [profileAlert, setProfileAlert] = useState<{ type: string; msg: string } | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) { router.push('/login'); return; }
    const profile = await getCurrentUser();
    if (profile) {
      setUser(profile as UserProfile);
      const reqs = await getUserRequests();
      setRequests(reqs as Request[]);
      const count = await getUnreadCount(authUser.id);
      setUnreadCount(count);
    }
  }

  async function handleProfileUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const result = await updateProfile({
      firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
      lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      destination: (form.elements.namedItem('destination') as HTMLSelectElement).value,
    });
    if (result.success) {
      setProfileAlert({ type: 'success', msg: 'Profil mis à jour avec succès !' });
      loadUser();
    } else {
      setProfileAlert({ type: 'error', msg: result.message || 'Erreur' });
    }
  }

  async function openConversation(reqId: string) {
    setCurrentReqId(reqId);
    const req = requests.find(r => r.id === reqId);
    setCurrentReq(req || null);
    if (user) await markAsRead(reqId, user.authId);
    const msgs = await getConversation(reqId);
    setConvoMessages(msgs as Message[]);
    const count = await getUnreadCount(user!.authId);
    setUnreadCount(count);
  }

  async function handleSendReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentReqId || !user) return;
    const input = (e.currentTarget.elements.namedItem('reply') as HTMLTextAreaElement);
    const content = input.value.trim();
    if (!content) return;
    await sendMessage({
      requestId: currentReqId,
      fromUserId: user.authId,
      fromName: user.first_name + ' ' + user.last_name,
      toUserId: 'admin',
      toName: 'Admin',
      content,
      isAdmin: false,
    });
    input.value = '';
    openConversation(currentReqId);
  }

  function handleLogout() {
    supabase.auth.signOut().then(() => router.push('/'));
  }

  if (!user) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Chargement...</p></div>;

  return (
    <>
      <Navbar />
      <section className="page-header">
        <h1>Bonjour, {user.first_name} !</h1>
        <p>Gérez votre profil et suivez votre projet d&apos;études</p>
      </section>

      <section className="section">
        <div className="container">
          <div className="dashboard-grid">
            {/* SIDEBAR */}
            <div className="dashboard-sidebar">
              <div className="profile-card">
                <div className="profile-avatar"><span>{user.first_name.charAt(0).toUpperCase()}{user.last_name.charAt(0).toUpperCase()}</span></div>
                <h3>{user.first_name} {user.last_name}</h3>
                <p className="profile-email">{user.email}</p>
                <span className="profile-badge"><i className="fa-solid fa-circle-check"></i> Membre actif</span>
              </div>
              <nav className="dashboard-nav">
                {[
                  { id: 'overview', icon: 'fa-house', label: 'Aperçu' },
                  { id: 'profile', icon: 'fa-user-pen', label: 'Mon profil' },
                  { id: 'requests', icon: 'fa-inbox', label: 'Mes demandes', badge: requests.length },
                  { id: 'messages', icon: 'fa-comments', label: 'Messages', badge: unreadCount },
                  { id: 'project', icon: 'fa-folder-open', label: 'Mon projet' },
                  { id: 'documents', icon: 'fa-file-lines', label: 'Mes documents' },
                ].map(tab => (
                  <button key={tab.id} className={`dash-nav-link${activeTab === tab.id ? ' active' : ''}`} onClick={() => { setActiveTab(tab.id); setCurrentReqId(null); }}>
                    <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
                    {tab.badge ? <span className="nav-badge">{tab.badge}</span> : null}
                  </button>
                ))}
                <button className="dash-nav-link logout-link" onClick={handleLogout}>
                  <i className="fa-solid fa-right-from-bracket"></i> Déconnexion
                </button>
              </nav>
            </div>

            {/* CONTENT */}
            <div className="dashboard-content">
              {/* Overview */}
              <div className={`dash-tab${activeTab === 'overview' ? ' active' : ''}`}>
                <h2>Bienvenue dans votre espace !</h2>
                <div className="dash-stats-grid">
                  <div className="dash-stat-card"><div className="dash-stat-icon" style={{ background: 'rgba(212,32,39,0.1)' }}><i className="fa-solid fa-graduation-cap" style={{ color: 'var(--accent)' }}></i></div><div><div className="dash-stat-value">{user.destination || '—'}</div><div className="dash-stat-label">Destination choisie</div></div></div>
                  <div className="dash-stat-card"><div className="dash-stat-icon" style={{ background: 'rgba(42,157,143,0.15)' }}><i className="fa-solid fa-clock" style={{ color: 'var(--success)' }}></i></div><div><div className="dash-stat-value">{new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</div><div className="dash-stat-label">Membre depuis</div></div></div>
                  <div className="dash-stat-card"><div className="dash-stat-icon" style={{ background: 'rgba(26,26,26,0.1)' }}><i className="fa-solid fa-list-check" style={{ color: 'var(--primary)' }}></i></div><div><div className="dash-stat-value">En cours</div><div className="dash-stat-label">Statut du projet</div></div></div>
                </div>
                <div className="project-progress">
                  <h3>Étapes de votre projet</h3>
                  <div className="progress-steps">
                    <div className="progress-step completed"><div className="step-circle"><i className="fa-solid fa-check"></i></div><div className="step-info"><strong>Inscription</strong><span>Compte créé avec succès</span></div></div>
                    <div className="progress-step active"><div className="step-circle">2</div><div className="step-info"><strong>Consultation</strong><span>Contactez un conseiller pour définir votre projet</span></div></div>
                    <div className="progress-step"><div className="step-circle">3</div><div className="step-info"><strong>Dossier d&apos;admission</strong><span>Montage et soumission de votre dossier</span></div></div>
                    <div className="progress-step"><div className="step-circle">4</div><div className="step-info"><strong>Demande de visa</strong><span>Préparation et dépôt du dossier consulaire</span></div></div>
                    <div className="progress-step"><div className="step-circle">5</div><div className="step-info"><strong>Départ</strong><span>Préparation au départ et embarquement</span></div></div>
                  </div>
                </div>
                <div className="quick-actions">
                  <h3>Actions rapides</h3>
                  <div className="actions-grid">
                    <a href="https://wa.me/2250779289599?text=Bonjour%2C%20je%20suis%20membre%20et%20je%20souhaite%20une%20consultation" target="_blank" rel="noopener noreferrer" className="action-card"><i className="fa-brands fa-whatsapp"></i><span>Parler à un conseiller</span></a>
                    <Link href="/formation-canada" className="action-card"><i className="fa-solid fa-book-open"></i><span>Voir la formation</span></Link>
                    <Link href="/contact" className="action-card"><i className="fa-solid fa-envelope"></i><span>Nous contacter</span></Link>
                  </div>
                </div>
              </div>

              {/* Profile */}
              <div className={`dash-tab${activeTab === 'profile' ? ' active' : ''}`}>
                <h2>Mon profil</h2>
                {profileAlert && <div className={`auth-alert auth-alert-${profileAlert.type}`}>{profileAlert.msg}</div>}
                <form onSubmit={handleProfileUpdate} className="auth-form">
                  <div className="form-row">
                    <div className="form-group"><label><i className="fa-solid fa-user"></i> Prénom</label><input type="text" name="firstName" defaultValue={user.first_name} required /></div>
                    <div className="form-group"><label><i className="fa-solid fa-user"></i> Nom</label><input type="text" name="lastName" defaultValue={user.last_name} required /></div>
                  </div>
                  <div className="form-group"><label><i className="fa-solid fa-envelope"></i> Email</label><input type="email" value={user.email} disabled style={{ opacity: 0.6 }} /></div>
                  <div className="form-group"><label><i className="fa-solid fa-phone"></i> Téléphone</label><input type="tel" name="phone" defaultValue={user.phone} required /></div>
                  <div className="form-group"><label><i className="fa-solid fa-earth-americas"></i> Destination</label><select name="destination" defaultValue={user.destination}>{['Chine','Canada','Inde','Turquie','Maroc','France','Autre'].map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                  <button type="submit" className="btn btn-primary auth-submit"><i className="fa-solid fa-floppy-disk"></i> Enregistrer les modifications</button>
                </form>
              </div>

              {/* Requests */}
              <div className={`dash-tab${activeTab === 'requests' ? ' active' : ''}`}>
                <h2>Mes demandes</h2>
                <p style={{ color: 'var(--text-medium)', marginBottom: 24 }}>Retrouvez ici toutes vos demandes.</p>
                {requests.length === 0 ? (
                  <div className="documents-empty"><i className="fa-solid fa-inbox"></i><h3>Aucune demande pour le moment</h3><p>Envoyez un message via la page <Link href="/contact" style={{ color: 'var(--primary)', fontWeight: 600 }}>Contact</Link>.</p></div>
                ) : (
                  requests.map(req => {
                    const icon = req.type === 'formation' ? 'fa-graduation-cap' : req.type === 'consultation' ? 'fa-comments' : 'fa-envelope';
                    const color = req.type === 'formation' ? 'var(--accent)' : req.type === 'consultation' ? 'var(--success)' : 'var(--primary)';
                    const statusText = req.status === 'traite' ? 'Traité' : req.status === 'en_cours' ? 'En cours' : 'En attente';
                    const statusClass = req.status === 'traite' ? 'status-done' : 'status-progress';
                    return (
                      <div key={req.id} className="request-card">
                        <div className="request-icon" style={{ background: color + '20' }}><i className={`fa-solid ${icon}`} style={{ color }}></i></div>
                        <div className="request-info">
                          <div className="request-header"><strong>{req.subject}</strong><span className={`status-badge ${statusClass}`}>{statusText}</span></div>
                          {req.message && <p className="request-message">{req.message}</p>}
                          <span className="request-date"><i className="fa-regular fa-clock"></i> {new Date(req.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Messages */}
              <div className={`dash-tab${activeTab === 'messages' ? ' active' : ''}`}>
                <h2>Messages</h2>
                <p style={{ color: 'var(--text-medium)', marginBottom: 24 }}>Échangez directement avec l&apos;équipe Action Réussite.</p>
                {!currentReqId ? (
                  requests.length === 0 ? (
                    <div className="documents-empty"><i className="fa-solid fa-comments"></i><h3>Aucun message pour le moment</h3><p>Envoyez un message via <Link href="/contact" style={{ color: 'var(--primary)', fontWeight: 600 }}>Contact</Link>.</p></div>
                  ) : (
                    requests.map(req => {
                      const icon = req.type === 'formation' ? 'fa-graduation-cap' : 'fa-envelope';
                      const color = req.type === 'formation' ? 'var(--accent)' : 'var(--primary)';
                      return (
                        <div key={req.id} className="convo-item" onClick={() => openConversation(req.id)}>
                          <div className="convo-icon" style={{ background: color + '20' }}><i className={`fa-solid ${icon}`} style={{ color }}></i></div>
                          <div className="convo-info">
                            <div className="convo-title"><strong>{req.subject}</strong></div>
                            <p className="convo-preview">{req.message?.substring(0, 60) || 'Aucun message'}...</p>
                            <span className="convo-time"><i className="fa-regular fa-clock"></i> {timeAgo(req.created_at)}</span>
                          </div>
                          <i className="fa-solid fa-chevron-right convo-arrow"></i>
                        </div>
                      );
                    })
                  )
                ) : (
                  <>
                    <button className="btn-back" onClick={() => setCurrentReqId(null)}><i className="fa-solid fa-arrow-left"></i> Retour aux messages</button>
                    <div className="convo-header"><h3>{currentReq?.subject}</h3><span className={`status-badge ${currentReq?.status === 'traite' ? 'status-done' : 'status-progress'}`}>{currentReq?.status === 'traite' ? 'Traité' : currentReq?.status === 'en_cours' ? 'En cours' : 'En attente'}</span></div>
                    <div className="convo-messages">
                      <div className="chat-msg chat-msg-user"><div className="chat-bubble"><p>{currentReq?.message || 'Demande envoyée'}</p><span className="chat-time">{currentReq && new Date(currentReq.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span></div></div>
                      {convoMessages.map(msg => (
                        <div key={msg.id} className={`chat-msg ${msg.is_admin ? 'chat-msg-admin' : 'chat-msg-user'}`}>
                          <div className="chat-bubble">
                            {msg.is_admin && <span className="chat-sender"><i className="fa-solid fa-headset"></i> {msg.from_name}</span>}
                            <p>{msg.content}</p>
                            <span className="chat-time">{new Date(msg.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <form className="convo-reply" onSubmit={handleSendReply}>
                      <textarea name="reply" placeholder="Écrivez votre réponse..." rows={3} required></textarea>
                      <button type="submit" className="btn btn-primary"><i className="fa-solid fa-paper-plane"></i> Envoyer</button>
                    </form>
                  </>
                )}
              </div>

              {/* Project */}
              <div className={`dash-tab${activeTab === 'project' ? ' active' : ''}`}>
                <h2>Mon projet d&apos;études</h2>
                <div className="project-info">
                  <div className="info-card"><h4><i className="fa-solid fa-earth-americas"></i> Destination</h4><p>{user.destination || '—'}</p></div>
                  <div className="info-card"><h4><i className="fa-solid fa-calendar"></i> Rentrée visée</h4><p>Septembre 2026</p></div>
                  <div className="info-card"><h4><i className="fa-solid fa-signal"></i> Statut</h4><p><span className="status-badge status-progress">En cours</span></p></div>
                </div>
                <div style={{ marginTop: 32, padding: 32, background: 'var(--bg-light)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                  <i className="fa-solid fa-rocket" style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: 16 }}></i>
                  <h3 style={{ marginBottom: 8 }}>Prochaine étape</h3>
                  <p style={{ color: 'var(--text-medium)', marginBottom: 24 }}>Contactez un conseiller pour planifier votre projet.</p>
                  <a href="https://wa.me/2250779289599?text=Bonjour%2C%20je%20suis%20inscrit%20et%20je%20souhaite%20démarrer%20mon%20projet" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp"><i className="fa-brands fa-whatsapp"></i> Démarrer mon projet</a>
                </div>
              </div>

              {/* Documents */}
              <div className={`dash-tab${activeTab === 'documents' ? ' active' : ''}`}>
                <h2>Mes documents</h2>
                <div className="documents-empty">
                  <i className="fa-solid fa-folder-open"></i>
                  <h3>Aucun document pour le moment</h3>
                  <p>Vos documents seront disponibles ici une fois votre accompagnement démarré.</p>
                  <a href="https://wa.me/2250779289599?text=Bonjour%2C%20je%20souhaite%20démarrer%20mon%20accompagnement" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: 16 }}>Démarrer mon accompagnement <i className="fa-solid fa-arrow-right"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
