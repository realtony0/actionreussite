'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { registerUser } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(''); setSuccess('');
    const form = e.currentTarget;
    const data = {
      firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value.trim(),
      lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem('email') as HTMLInputElement).value.trim().toLowerCase(),
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value.trim(),
      destination: (form.elements.namedItem('destination') as HTMLSelectElement).value,
      password: (form.elements.namedItem('password') as HTMLInputElement).value,
    };
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

    if (data.password !== confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (data.password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return; }

    const result = await registerUser(data);
    if (result.success) {
      setSuccess('Compte créé avec succès ! Redirection...');
      setTimeout(() => router.push('/dashboard'), 1500);
    } else {
      setError(result.message || 'Erreur lors de la création du compte');
    }
  }

  return (
    <>
      <Navbar />
      <section className="page-header"><h1>Créer un compte</h1><p>Rejoignez Action Réussite et suivez votre projet d&apos;études</p></section>
      <section className="section">
        <div className="container">
          <div className="auth-wrapper">
            <div className="auth-card fade-in visible">
              <div className="auth-header">
                <div className="auth-icon"><i className="fa-solid fa-user-plus"></i></div>
                <h2>Inscription</h2>
                <p>Remplissez le formulaire pour créer votre compte</p>
              </div>
              {error && <div className="auth-alert auth-alert-error">{error}</div>}
              {success && <div className="auth-alert auth-alert-success">{success}</div>}
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-row">
                  <div className="form-group"><label><i className="fa-solid fa-user"></i> Prénom</label><input type="text" name="firstName" placeholder="Votre prénom" required /></div>
                  <div className="form-group"><label><i className="fa-solid fa-user"></i> Nom</label><input type="text" name="lastName" placeholder="Votre nom" required /></div>
                </div>
                <div className="form-group"><label><i className="fa-solid fa-envelope"></i> Adresse email</label><input type="email" name="email" placeholder="votre@email.com" required /></div>
                <div className="form-group"><label><i className="fa-solid fa-phone"></i> Téléphone / WhatsApp</label><input type="tel" name="phone" placeholder="+225 XX XX XX XX XX" required /></div>
                <div className="form-group"><label><i className="fa-solid fa-earth-americas"></i> Destination souhaitée</label><select name="destination" required><option value="" disabled>Choisissez une destination</option>{['Chine','Canada','Inde','Turquie','Maroc','France','Autre'].map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                <div className="form-group"><label><i className="fa-solid fa-lock"></i> Mot de passe</label><input type="password" name="password" placeholder="Minimum 6 caractères" required minLength={6} /></div>
                <div className="form-group"><label><i className="fa-solid fa-lock"></i> Confirmer le mot de passe</label><input type="password" name="confirmPassword" placeholder="Répétez le mot de passe" required minLength={6} /></div>
                <button type="submit" className="btn btn-primary auth-submit">Créer mon compte <i className="fa-solid fa-arrow-right"></i></button>
              </form>
              <div className="auth-footer"><p>Vous avez déjà un compte ? <Link href="/login">Se connecter</Link></p></div>
            </div>
          </div>
        </div>
      </section>
      <Footer /><WhatsAppFloat />
    </>
  );
}
