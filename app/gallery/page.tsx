import fs from 'fs';
import path from 'path';

const galleryDir = path.join(process.cwd(), 'public', 'gallery');
const galleryImages = fs.existsSync(galleryDir)
  ? fs
      .readdirSync(galleryDir)
      .filter((file) => /\.(jpe?g|png|webp|gif|svg)$/i.test(file))
      .sort()
  : [];

export default function GalleryPage() {
  return (
    <main className="container">
      <section className="section">
        <div className="section-title">
          <h1>Galerie</h1>
          <p>Découvrez nos dernières photos ajoutées.</p>
          <div className="line"></div>
        </div>
        {galleryImages.length === 0 ? (
          <p>Aucune image trouvée dans le dossier <strong>/public/gallery</strong>.</p>
        ) : (
          <div className="gallery-grid" style={{ marginTop: 24 }}>
            {galleryImages.map((image) => (
              <img
                key={image}
                src={`/gallery/${encodeURIComponent(image)}`}
                alt={`Galerie ${image}`}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
