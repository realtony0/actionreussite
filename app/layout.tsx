import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Action Réussite — Étudiez à l'étranger avec ou sans bourse",
  description: "Depuis 2017, Action Réussite accompagne les étudiants dans leurs démarches d'admission, de visa et de départ vers l'international.",
  icons: { icon: "/images/logo.jpeg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
