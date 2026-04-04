'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import FadeIn from '@/components/FadeIn';

const images = [
  '/images/photo-1.jpeg',
  '/images/photo-2.jpeg',
  '/images/photo-3.jpeg',
  '/images/photo-4.jpeg',
  '/images/photo-5.jpeg',
  '/images/photo-6.jpeg',
  '/images/photo-7.jpeg',
  '/images/photo-8.jpeg',
  '/images/photo-9.jpeg',
  '/images/photo-10.jpeg',
  '/images/photo-11.jpeg',
  '/images/photo-12.jpeg',
  '/images/photo-13.jpeg',
  '/images/photo-14.jpeg',
  '/images/photo-15.jpeg',
  '/images/photo-16.jpeg',
  '/images/photo-17.jpeg',
  '/images/photo-18.jpeg',
  '/images/photo-19.jpeg',
  '/images/photo-20.jpeg',
  '/images/photo-21.jpeg',
  '/images/photo-22.jpeg',
  '/images/photo-23.jpeg',
  '/images/photo-24.jpeg',
  '/images/photo-25.jpeg',
  '/images/photo-26.jpeg',
  '/images/photo-27.jpeg',
  '/images/photo-28.jpeg',
  '/images/photo-29.jpeg',
  '/images/photo-30.jpeg',
  '/images/photo-31.jpeg',
  '/images/photo-32.jpeg',
  '/images/photo-33.jpeg',
  '/images/photo-34.jpeg',
  '/images/photo-35.jpeg',
  '/images/photo-36.jpeg',
  '/images/photo-37.jpeg',
  '/images/photo-38.jpeg',
  '/images/photo-39.jpeg',
  '/images/photo-40.jpeg',
  '/images/photo-41.jpeg',
  '/images/photo-42.jpeg',
];

export default function GaleriePage() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox((i) => (i !== null && i > 0 ? i - 1 : images.length - 1));
  const next = () => setLightbox((i) => (i !== null && i < images.length - 1 ? i + 1 : 0));

  return (
    <>
      <Navbar />

      <section className="page-header">
        <div className="container">
          <h1>Galerie</h1>
          <p>Découvrez en images nos étudiants, nos événements et nos réussites</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="section-title">
              <h2>Nos moments forts</h2>
              <p>Chaque photo raconte une histoire de réussite</p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="gallery-grid">
              {images.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`Action Réussite - Photo ${index + 1}`}
                  onClick={() => openLightbox(index)}
                />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {lightbox !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); prev(); }}>&#8249;</button>
          <img
            src={images[lightbox]}
            alt={`Photo ${lightbox + 1}`}
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); next(); }}>&#8250;</button>
        </div>
      )}

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
