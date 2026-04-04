'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { loginUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(''); setSuccess('');
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim().toLowerCase();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const result = await loginUser(email, password);
    if (result.success) {
      setSuccess('Connexion réussie ! Redirection...');
      setTimeout(() => router.push('/dashboard'), 1000);
    } else {
      setError(result.message || 'Erreur de connexion');
    }
  }

  return (
    <>
      <Navbar />
      <section className="page-header"><h1>Connexion</h1><p>Accédez à votre espace personnel</p></section>
      <section className="section">
        <div className="container">
          <div className="auth-wrapper">
            <div className="auth-card fade-in visible">
              <div className="auth-header">
                <div className="auth-icon"><i className="fa-solid fa-right-to-bracket"></i></div>
                <h2>Se connecter</h2>
                <p>Entrez vos identifiants pour accéder à votre compte</p>
              </div>
              {error && <div className="auth-alert auth-alert-error">{error}</div>}
              {success && <div className="auth-alert auth-alert-success">{success}</div>}
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group"><label><i className="fa-solid fa-envelope"></i> Adresse email</label><input type="email" name="email" placeholder="votre@email.com" required /></div>
                <div className="form-group"><label><i className="fa-solid fa-lock"></i> Mot de passe</label><input type="password" name="password" placeholder="Votre mot de passe" required /></div>
                <button type="submit" className="btn btn-primary auth-submit">Se connecter <i className="fa-solid fa-arrow-right"></i></button>
              </form>
              <div className="auth-footer"><p>Pas encore de compte ? <Link href="/register">Créer un compte</Link></p></div>
            </div>
          </div>
        </div>
      </section>
      <Footer /><WhatsAppFloat />
    </>
  );
}
