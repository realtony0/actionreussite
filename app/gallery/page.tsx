import fs from 'fs';
import path from 'path';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const galleryDir = path.join(process.cwd(), 'public', 'gallery');
const galleryImages = fs.existsSync(galleryDir)
  ? fs
      .readdirSync(galleryDir)
      .filter((file) => /\.(jpe?g|png|webp|gif|svg)$/i.test(file))
      .sort()
  : [];

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <section className="page-header">
        <h1>Galerie</h1>
        <p>Découvrez nos dernières photos ajoutées.</p>
      </section>

      <section className="section">
        <div className="container">
          {galleryImages.length === 0 ? (
            <p>Aucune image trouvée.</p>
          ) : (
            <div className="gallery-grid">
              {galleryImages.map((image) => (
                <img
                  key={image}
                  src={`/gallery/${encodeURIComponent(image)}`}
                  alt={`Galerie ${image}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <WhatsAppFloat />
      <Footer />
    </>
  );
}
